import { Module } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';
import { Resume } from '../entities/resume.entity';
import { User } from '../entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdfService } from './pdf.service';

@Module({
  imports: [TypeOrmModule.forFeature([Resume, User])],
  controllers: [ResumesController],
  providers: [ResumesService, PdfService],
})
export class ResumesModule {}