import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

interface CursorPosition {
  x: number;
  y: number;
}

interface Collaborator {
  userId: string;
  userName: string;
  userColor: string;
  socketId: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'collaboration',
})
export class CollaborationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(CollaborationGateway.name);
  private readonly userColors = [
    '#3b82f6',
    '#ef4444',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
    '#ec4899',
  ];
  private resumeCollaborators: Map<string, Map<string, Collaborator>> =
    new Map();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      client.data.userId = payload.sub;
      client.data.userName = payload.name;
      client.data.userColor = this.getRandomColor();

      this.logger.log(`Client connected: ${client.id} (User: ${payload.sub})`);
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    // Remove user from all resumes they're collaborating on
    this.resumeCollaborators.forEach((collaborators, resumeId) => {
      if (collaborators.has(client.id)) {
        const collaborator = collaborators.get(client.id);
        collaborators.delete(client.id);

        // Notify others that user left
        this.server.to(resumeId).emit('user_left', {
          userId: collaborator?.userId,
          userName: collaborator?.userName,
        });

        // Clean up empty resume rooms
        if (collaborators.size === 0) {
          this.resumeCollaborators.delete(resumeId);
        }
      }
    });
  }

  @SubscribeMessage('join_resume')
  async handleJoinResume(
    @MessageBody() data: { resumeId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { resumeId } = data;
    const userId = client.data.userId;
    const userName = client.data.userName;
    const userColor = client.data.userColor;

    // Join the room
    client.join(resumeId);

    // Add to collaborators
    if (!this.resumeCollaborators.has(resumeId)) {
      this.resumeCollaborators.set(resumeId, new Map());
    }

    const collaborators = this.resumeCollaborators.get(resumeId)!;
    collaborators.set(client.id, {
      userId,
      userName,
      userColor,
      socketId: client.id,
    });

    // Notify others that user joined
    client.to(resumeId).emit('user_joined', {
      userId,
      userName,
      userColor,
    });

    // Send current collaborators to the joining user
    const otherCollaborators = Array.from(collaborators.values())
      .filter((c) => c.socketId !== client.id)
      .map((c) => ({
        userId: c.userId,
        userName: c.userName,
        userColor: c.userColor,
      }));

    client.emit('joined_resume', {
      resumeId,
      collaborators: otherCollaborators,
    });

    this.logger.log(`User ${userId} joined resume ${resumeId}`);
  }

  @SubscribeMessage('leave_resume')
  async handleLeaveResume(
    @MessageBody() data: { resumeId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { resumeId } = data;
    const userId = client.data.userId;
    const userName = client.data.userName;

    client.leave(resumeId);

    const collaborators = this.resumeCollaborators.get(resumeId);
    if (collaborators) {
      collaborators.delete(client.id);

      client.to(resumeId).emit('user_left', {
        userId,
        userName,
      });

      if (collaborators && collaborators.size === 0) {
        this.resumeCollaborators.delete(resumeId);
      }
    }

    this.logger.log(`User ${userId} left resume ${resumeId}`);
  }

  @SubscribeMessage('resume_update')
  async handleResumeUpdate(
    @MessageBody()
    data: { resumeId: string; field: string; value: any; section?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { resumeId, field, value, section } = data;
    const userId = client.data.userId;
    const userName = client.data.userName;
    const userColor = client.data.userColor;

    // Broadcast update to all other clients in the room
    client.to(resumeId).emit('resume_updated', {
      userId,
      userName,
      userColor,
      field,
      value,
      section,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('cursor_position')
  async handleCursorPosition(
    @MessageBody()
    data: {
      resumeId: string;
      section: string;
      field: string;
      position: CursorPosition;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { resumeId, section, field, position } = data;
    const userId = client.data.userId;
    const userName = client.data.userName;
    const userColor = client.data.userColor;

    // Broadcast cursor position to all other clients
    client.to(resumeId).emit('cursor_updated', {
      userId,
      userName,
      userColor,
      section,
      field,
      position,
    });
  }

  private getRandomColor(): string {
    return this.userColors[Math.floor(Math.random() * this.userColors.length)];
  }
}
