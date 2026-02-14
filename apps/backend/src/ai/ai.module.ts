import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { HuggingFaceService } from './huggingface.service';
import { User } from '../entities/user.entity';
import { AIUsage } from '../entities/ai-usage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, AIUsage])],
  controllers: [AiController],
  providers: [AiService, HuggingFaceService],
  exports: [AiService, HuggingFaceService],
})
export class AiModule {}
