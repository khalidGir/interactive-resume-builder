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
} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto, UpdateResumeDto } from '../dto/resume.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('resumes')
@Controller('resumes')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all resumes for authenticated user' })
  @ApiResponse({ status: 200, description: 'Returns all resumes' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Req() req) {
    return await this.resumesService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific resume' })
  @ApiResponse({ status: 200, description: 'Returns the resume' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Resume not found' })
  async findOne(@Param('id') id: string, @Req() req) {
    return await this.resumesService.findOne(id, req.user.userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new resume' })
  @ApiResponse({ status: 201, description: 'Resume created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createResumeDto: CreateResumeDto, @Req() req) {
    return await this.resumesService.create(createResumeDto, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a resume' })
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
  @ApiOperation({ summary: 'Delete a resume' })
  @ApiResponse({ status: 204, description: 'Resume deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Resume not found' })
  async remove(@Param('id') id: string, @Req() req) {
    await this.resumesService.remove(id, req.user.userId);
  }

  @Post(':id/export/pdf')
  @ApiOperation({ summary: 'Export resume as PDF (stub)' })
  @ApiResponse({ status: 501, description: 'Not implemented yet' })
  exportPdf(@Param('id') id: string, @Req() req) {
    // This is a stub implementation - return 501 as requested
    throw new Error('Not Implemented');
  }
}