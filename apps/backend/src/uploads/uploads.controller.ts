import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';

@ApiTags('uploads')
@Controller('api/upload')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('profile-photo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload profile photo' })
  @ApiResponse({ status: 200, description: 'Photo uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file' })
  async uploadProfilePhoto(
    @CurrentUser() userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.uploadsService.uploadProfilePhoto(file, userId);
    return result;
  }

  @Post('resume-image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload resume image' })
  @ApiResponse({ status: 200, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file' })
  async uploadResumeImage(
    @CurrentUser() userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.uploadsService.uploadResumeImage(file, userId);
    return result;
  }

  @Delete(':publicId')
  @ApiOperation({ summary: 'Delete uploaded file' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  async deleteUpload(
    @CurrentUser() userId: string,
    @Param('publicId') publicId: string,
  ) {
    await this.uploadsService.deleteUpload(publicId, userId);
    return { success: true };
  }
}
