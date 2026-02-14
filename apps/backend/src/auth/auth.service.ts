import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserPlan } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  CreateUserDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
  SocialAuthDto,
} from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(
    createUserDto: CreateUserDto,
  ): Promise<{ user: any; accessToken: string; refreshToken: string }> {
    const { email, password, name } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = new User();
    user.email = email;
    user.password = hashedPassword;
    user.name = name;
    user.plan = UserPlan.Free;

    const savedUser = await this.userRepository.save(user);

    // Generate tokens
    const tokens = await this.generateTokens(savedUser);

    return {
      user: this.mapToUserResponse(savedUser),
      ...tokens,
    };
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ user: any; accessToken: string; refreshToken: string }> {
    // Find user by email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: this.mapToUserResponse(user),
      ...tokens,
    };
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret:
          this.configService.get<string>('JWT_REFRESH_SECRET') ||
          this.configService.get<string>('JWT_SECRET'),
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ success: true }> {
    const { email } = forgotPasswordDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if user exists
      return { success: true };
    }

    // Generate reset token (in production, store in Redis with expiration)
    const resetToken = this.jwtService.sign(
      { sub: user.id, type: 'password-reset' },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '1h',
      },
    );

    // TODO: Send email with reset link
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return { success: true };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ success: true }> {
    const { token, newPassword } = resetPasswordDto;

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (payload.type !== 'password-reset') {
        throw new UnauthorizedException('Invalid token');
      }

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;

      await this.userRepository.save(user);

      return { success: true };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async verifyEmail(
    verifyEmailDto: VerifyEmailDto,
  ): Promise<{ success: true }> {
    const { token } = verifyEmailDto;

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (payload.type !== 'email-verification') {
        throw new UnauthorizedException('Invalid token');
      }

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      user.emailVerified = true;
      await this.userRepository.save(user);

      return { success: true };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async googleAuth(socialAuthDto: SocialAuthDto): Promise<{
    user: any;
    accessToken: string;
    refreshToken: string;
    isNewUser: boolean;
  }> {
    // TODO: Implement Google OAuth verification
    // For now, return mock implementation
    throw new BadRequestException('Google auth not yet implemented');
  }

  async linkedinAuth(socialAuthDto: SocialAuthDto): Promise<{
    user: any;
    accessToken: string;
    refreshToken: string;
    isNewUser: boolean;
  }> {
    // TODO: Implement LinkedIn OAuth verification
    // For now, return mock implementation
    throw new BadRequestException('LinkedIn auth not yet implemented');
  }

  async logout(userId: string): Promise<{ success: true }> {
    // In a production app, you would invalidate the refresh token in Redis/database
    return { success: true };
  }

  private async generateTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id, tokenId: this.generateTokenId() },
      {
        secret:
          this.configService.get<string>('JWT_REFRESH_SECRET') ||
          this.configService.get<string>('JWT_SECRET'),
        expiresIn: '7d',
      },
    );

    return { accessToken, refreshToken };
  }

  private generateTokenId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private mapToUserResponse(user: User): any {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      location: user.location,
      bio: user.bio,
      photoUrl: user.photoUrl,
      plan: user.plan,
      emailVerified: user.emailVerified,
      preferences: user.preferences,
    };
  }
}
