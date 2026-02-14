import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadsService {
  constructor(private configService: ConfigService) {}

  async uploadProfilePhoto(
    file: Express.Multer.File,
    userId: string,
  ): Promise<{ url: string; publicId: string }> {
    // Validate file
    this.validateImageFile(file);

    // In production, upload to S3, Cloudflare R2, or local storage
    // For now, return mock URL
    const publicId = `profile-${userId}-${Date.now()}`;
    const url = `${this.configService.get('UPLOAD_BASE_URL', 'http://localhost:8000/uploads')}/${publicId}.jpg`;

    // TODO: Implement actual file upload to storage
    console.log(
      `Uploading profile photo for user ${userId}: ${file.originalname}`,
    );

    return { url, publicId };
  }

  async uploadResumeImage(
    file: Express.Multer.File,
    userId: string,
  ): Promise<{ url: string }> {
    // Validate file
    this.validateImageFile(file);

    // In production, upload to storage
    const url = `${this.configService.get('UPLOAD_BASE_URL', 'http://localhost:8000/uploads')}/resume-${userId}-${Date.now()}.jpg`;

    // TODO: Implement actual file upload
    console.log(
      `Uploading resume image for user ${userId}: ${file.originalname}`,
    );

    return { url };
  }

  async deleteUpload(publicId: string, userId: string): Promise<void> {
    // TODO: Implement file deletion from storage
    console.log(`Deleting upload ${publicId} for user ${userId}`);
  }

  private validateImageFile(file: Express.Multer.File): void {
    // Check file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size must be less than 2MB');
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('File must be an image (JPEG or PNG)');
    }
  }
}
