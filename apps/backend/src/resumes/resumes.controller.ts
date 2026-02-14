import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Res,
  Header,
  Query,
} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import {
  CreateResumeDto,
  UpdateResumeDto,
  ReorderSectionsDto,
  ResumeQueryDto,
  DuplicateResumeDto,
} from '../dto/resume.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { PdfService, TemplateType } from './pdf.service';

@ApiTags('resumes')
@Controller('api/resumes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ResumesController {
  constructor(
    private readonly resumesService: ResumesService,
    private readonly pdfService: PdfService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all resumes for authenticated user' })
  @ApiResponse({ status: 200, description: 'Returns all resumes' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@CurrentUser() userId: string, @Query() query: ResumeQueryDto) {
    return await this.resumesService.findAll(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific resume' })
  @ApiResponse({ status: 200, description: 'Returns the resume' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Resume not found' })
  async findOne(@Param('id') id: string, @CurrentUser() userId: string) {
    const resume = await this.resumesService.findOne(id, userId);
    return { resume };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new resume' })
  @ApiResponse({ status: 201, description: 'Resume created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Free tier limit reached' })
  async create(
    @Body() createResumeDto: CreateResumeDto,
    @CurrentUser() userId: string,
  ) {
    const resume = await this.resumesService.create(createResumeDto, userId);
    return { resume };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a resume' })
  @ApiResponse({ status: 200, description: 'Resume updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Resume not found' })
  async update(
    @Param('id') id: string,
    @Body() updateResumeDto: UpdateResumeDto,
    @CurrentUser() userId: string,
  ) {
    const resume = await this.resumesService.update(
      id,
      updateResumeDto,
      userId,
    );
    return { resume };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a resume' })
  @ApiResponse({ status: 200, description: 'Resume deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Resume not found' })
  async remove(@Param('id') id: string, @CurrentUser() userId: string) {
    await this.resumesService.remove(id, userId);
    return { success: true };
  }

  @Post(':id/duplicate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Duplicate a resume' })
  @ApiResponse({ status: 201, description: 'Resume duplicated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Resume not found' })
  async duplicate(
    @Param('id') id: string,
    @CurrentUser() userId: string,
    @Body() dto: DuplicateResumeDto,
  ) {
    const resume = await this.resumesService.duplicate(id, userId, dto.name);
    return { resume };
  }

  @Patch(':id/reorder-sections')
  @ApiOperation({ summary: 'Reorder resume sections' })
  @ApiResponse({ status: 200, description: 'Sections reordered successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Resume not found' })
  async reorderSections(
    @Param('id') id: string,
    @Body() reorderSectionsDto: ReorderSectionsDto,
    @CurrentUser() userId: string,
  ) {
    const resume = await this.resumesService.reorderSections(
      id,
      reorderSectionsDto,
      userId,
    );
    return { resume };
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get resume statistics' })
  @ApiResponse({ status: 200, description: 'Stats retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Resume not found' })
  async getStats(@Param('id') id: string, @CurrentUser() userId: string) {
    const stats = await this.resumesService.getStats(id, userId);
    return stats;
  }

  @Get(':id/export')
  @ApiOperation({ summary: 'Export resume as PDF or DOCX' })
  @ApiResponse({ status: 200, description: 'File exported successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Resume not found' })
  @Header('Content-Type', 'application/pdf')
  async export(
    @Param('id') id: string,
    @CurrentUser() userId: string,
    @Query('format') format: string = 'pdf',
    @Query('templateId') templateId: string,
    @Res() res: Response,
  ) {
    const resume = await this.resumesService.findOne(id, userId);

    const template = this.parseTemplateQuery(templateId || 'modern');
    const htmlContent = await this.pdfService.generateResumeHtml(
      resume.data,
      template,
    );

    if (format === 'pdf') {
      const pdfBuffer = await this.pdfService.generatePdfFromHtml(htmlContent);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${resume.name}.pdf"`,
        'Content-Length': pdfBuffer.length,
      });
      res.send(pdfBuffer);
    } else {
      // For DOCX or other formats
      throw new Error('Format not yet supported');
    }
  }

  private parseTemplateQuery(templateStr: string): TemplateType {
    if (!templateStr) {
      return TemplateType.MODERN;
    }

    const template = templateStr.toLowerCase();
    if (Object.values(TemplateType).includes(template as TemplateType)) {
      return template as TemplateType;
    }

    return TemplateType.MODERN;
  }
}
