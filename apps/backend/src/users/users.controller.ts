import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import {
  UpdateUserDto,
  UpdatePasswordDto,
  UserResponseDto,
} from '../dto/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getCurrentUser(
    @CurrentUser() userId: string,
  ): Promise<UserResponseDto> {
    return this.usersService.findById(userId);
  }

  @Patch('me')
  async updateCurrentUser(
    @CurrentUser() userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(userId, updateUserDto);
  }

  @Post('me/photo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePhoto(
    @CurrentUser() userId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ photoUrl: string }> {
    return this.usersService.uploadProfilePhoto(userId, file);
  }

  @Patch('me/password')
  async updatePassword(
    @CurrentUser() userId: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ success: true }> {
    await this.usersService.updatePassword(userId, updatePasswordDto);
    return { success: true };
  }

  @Delete('me')
  async deleteCurrentUser(
    @CurrentUser() userId: string,
  ): Promise<{ success: true }> {
    await this.usersService.remove(userId);
    return { success: true };
  }
}
