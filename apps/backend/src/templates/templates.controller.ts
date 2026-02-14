import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplateQueryDto, CreateTemplateDto } from '../dto/template.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('templates')
@Controller('api/templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all templates' })
  @ApiResponse({ status: 200, description: 'Templates retrieved successfully' })
  async findAll(@Query() query: TemplateQueryDto) {
    const templates = await this.templatesService.findAll(query);
    return { templates };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get template by ID' })
  @ApiResponse({ status: 200, description: 'Template retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async findById(@Param('id') id: string) {
    const template = await this.templatesService.findById(id);
    return { template };
  }

  @Get(':id/preview')
  @ApiOperation({ summary: 'Get template preview' })
  @ApiResponse({
    status: 200,
    description: 'Template preview retrieved successfully',
  })
  async getPreview(@Param('id') id: string) {
    const preview = await this.templatesService.getPreview(id);
    return preview;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new template (Admin only)' })
  @ApiResponse({ status: 201, description: 'Template created successfully' })
  async create(@Body() createTemplateDto: CreateTemplateDto) {
    const template = await this.templatesService.create(createTemplateDto);
    return { template };
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed default templates' })
  @ApiResponse({ status: 200, description: 'Templates seeded successfully' })
  async seedTemplates() {
    await this.templatesService.seedDefaultTemplates();
    return { success: true, message: 'Default templates seeded' };
  }
}
