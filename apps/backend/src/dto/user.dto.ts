import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  bio?: string;

  @IsOptional()
  preferences?: {
    defaultTemplate?: string;
    autoSaveInterval?: number;
    showAiSuggestions?: boolean;
    emailNotifications?: {
      tips: boolean;
      updates: boolean;
      marketing: boolean;
    };
    editorPreferences?: {
      fontSize: 'small' | 'medium' | 'large';
      colorScheme: 'light' | 'dark' | 'system';
    };
  };
}

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  phone?: string;
  location?: string;
  bio?: string;
  photoUrl?: string;
  plan: string;
  emailVerified: boolean;
  preferences?: any;
  createdAt: Date;
  updatedAt: Date;
}
