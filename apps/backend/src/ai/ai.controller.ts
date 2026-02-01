import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AiService } from './ai.service';
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ImproveBulletDto {
  @ApiProperty({
    description: 'The bullet point text to improve',
    example: 'Worked on a team to build a new feature'
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'Optional job role context for improvement',
    example: 'Software Engineer',
    required: false
  })
  @IsOptional()
  @IsString()
  role?: string;
}

export class ImproveBulletResponseDto {
  @ApiProperty({
    description: 'The improved bullet point text',
    example: 'Spearheaded development of a new feature that increased user engagement by 25%'
  })
  improvedText: string;
}

@ApiTags('ai', 'experimental')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('improve-bullet')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Improve a resume bullet point',
    description: 'Opt-in AI feature to enhance a single resume bullet point. User must manually apply the result.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the improved bullet point text',
    type: ImproveBulletResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async improveBullet(
    @Body() improveBulletDto: ImproveBulletDto
  ): Promise<ImproveBulletResponseDto> {
    const { text, role } = improveBulletDto;
    
    const improvedText = await this.aiService.improveBulletPoint(text, role);
    
    return { improvedText };
  }
}