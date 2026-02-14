import { IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';

export enum UploadType {
  ProfilePhoto = 'profile-photo',
  ResumeImage = 'resume-image',
}

export class UploadResponseDto {
  url: string;
  publicId?: string;
}
