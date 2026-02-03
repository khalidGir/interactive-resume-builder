import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Res,
  Header,
} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto, UpdateResumeDto } from '../dto/resume.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';
import { PdfService } from './pdf.service';

@ApiTags('resumes', 'stable')
@Controller('resumes')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ResumesController {
  constructor(
    private readonly resumesService: ResumesService,
    private readonly pdfService: PdfService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all resumes for authenticated user',
    description: 'Phase 1: Stable endpoint for retrieving user resumes'
  })
  @ApiResponse({ status: 200, description: 'Returns all resumes' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Req() req) {
    return await this.resumesService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a specific resume',
    description: 'Phase 1: Stable endpoint for retrieving a specific resume'
  })
  @ApiResponse({ status: 200, description: 'Returns the resume' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Resume not found' })
  async findOne(@Param('id') id: string, @Req() req) {
    return await this.resumesService.findOne(id, req.user.userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new resume',
    description: 'Phase 1: Stable endpoint for creating a new resume'
  })
  @ApiResponse({ status: 201, description: 'Resume created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createResumeDto: CreateResumeDto, @Req() req) {
    return await this.resumesService.create(createResumeDto, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a resume',
    description: 'Phase 1: Stable endpoint for updating a resume'
  })
  @ApiResponse({ status: 200, description: 'Resume updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Resume not found' })
  async update(
    @Param('id') id: string,
    @Body() updateResumeDto: UpdateResumeDto,
    @Req() req,
  ) {
    return await this.resumesService.update(id, updateResumeDto, req.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a resume',
    description: 'Phase 1: Stable endpoint for deleting a resume'
  })
  @ApiResponse({ status: 204, description: 'Resume deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Resume not found' })
  async remove(@Param('id') id: string, @Req() req) {
    await this.resumesService.remove(id, req.user.userId);
  }

  @Post(':id/export/pdf')
  @ApiOperation({
    summary: 'Export resume as PDF',
    description: 'Phase 1: Stable endpoint for exporting resume as PDF'
  })
  @ApiResponse({ status: 200, description: 'PDF exported successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Resume not found' })
  @Header('Content-Type', 'application/pdf')
  async exportPdf(
    @Param('id') id: string,
    @Req() req,
    @Res() res: Response,
  ) {
    // Get the resume data
    const resume = await this.resumesService.findOne(id, req.user.userId);

    // Generate HTML from the resume data
    const htmlContent = await this.pdfService.generateResumeHtml(resume.data);

    // Generate PDF from HTML
    const pdfBuffer = await this.pdfService.generatePdfFromHtml(htmlContent);

    // Send the PDF as a download
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="resume-${id}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    res.send(pdfBuffer);
  }
}