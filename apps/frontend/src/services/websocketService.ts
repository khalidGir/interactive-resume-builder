// WebSocket service for real-time updates (to be implemented if needed)
// This service provides the foundation for real-time features like:
// - Auto-saving resume changes
// - Collaborative editing
// - Notifications
// - Live previews

import { EventEmitter } from 'events';

type WebSocketEvent = 
  | 'connect'
  | 'disconnect'
  | 'error'
  | 'resumeUpdate'
  | 'collaboratorJoin'
  | 'collaboratorLeave'
  | 'notification';

class WebSocketService {
  private ws: WebSocket | null = null;
  private eventEmitter: EventEmitter;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000; // 5 seconds
  private url: string;
  private isConnected = false;

  constructor(url?: string) {
    this.eventEmitter = new EventEmitter();
    this.url = url || process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws';
  }

  connect(userId: string, resumeId?: string) {
    if (this.isConnected) return;

    // Construct WebSocket URL with user and resume info
    const params = new URLSearchParams({ userId });
    if (resumeId) params.append('resumeId', resumeId);
    
    const wsUrl = `${this.url}?${params.toString()}`;
    
    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.eventEmitter.emit('connect');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.eventEmitter.emit(data.type, data.payload);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          this.eventEmitter.emit('error', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.eventEmitter.emit('disconnect');
        
        // Attempt to reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          setTimeout(() => {
            this.reconnectAttempts++;
            this.connect(userId, resumeId);
          }, this.reconnectInterval);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.eventEmitter.emit('error', error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.eventEmitter.emit('error', error);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }

  send(eventType: string, payload: any) {
    if (this.ws && this.isConnected) {
      this.ws.send(JSON.stringify({ type: eventType, payload }));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  }

  on(event: WebSocketEvent, callback: (data?: any) => void) {
    this.eventEmitter.on(event, callback);
  }

  off(event: WebSocketEvent, callback: (data?: any) => void) {
    this.eventEmitter.off(event, callback);
  }

  isConnectedToWebSocket(): boolean {
    return this.isConnected;
  }
}

// Singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;

// Example usage:
/*
// Connect to WebSocket
webSocketService.connect('user-id', 'resume-id');

// Listen for events
webSocketService.on('resumeUpdate', (data) => {
  console.log('Resume updated:', data);
});

// Send an event
webSocketService.send('resumeChange', {
  field: 'profile.firstName',
  value: 'John'
});
*/