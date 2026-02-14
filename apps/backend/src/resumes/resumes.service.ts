import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Resume, ResumeData, ResumeStatus } from '../entities/resume.entity';
import { User } from '../entities/user.entity';
import { Template } from '../entities/template.entity';
import {
  CreateResumeDto,
  UpdateResumeDto,
  ReorderSectionsDto,
  ResumeQueryDto,
} from '../dto/resume.dto';

@Injectable()
export class ResumesService {
  constructor(
    @InjectRepository(Resume)
    private resumesRepository: Repository<Resume>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Template)
    private templateRepository: Repository<Template>,
  ) {}

  async findAll(
    userId: string,
    query: ResumeQueryDto,
  ): Promise<{
    resumes: Resume[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      status,
      search,
      sortBy = 'updatedAt',
      order = 'DESC',
      page = 1,
      limit = 10,
    } = query;

    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.name = Like(`%${search}%`);
    }

    const [resumes, total] = await this.resumesRepository.findAndCount({
      where,
      order: { [sortBy]: order },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['template'],
    });

    return {
      resumes,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string, userId: string): Promise<Resume> {
    const resume = await this.resumesRepository.findOne({
      where: { id, userId },
      relations: ['template'],
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    // Update lastOpenedAt
    resume.lastOpenedAt = new Date();
    await this.resumesRepository.save(resume);

    return resume;
  }

  async create(
    createResumeDto: CreateResumeDto,
    userId: string,
  ): Promise<Resume> {
    // Check if user has reached the free tier limit
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.plan === 'free') {
      const resumeCount = await this.resumesRepository.count({
        where: { userId },
      });
      if (resumeCount >= 1) {
        throw new ForbiddenException(
          'Free users can only create 1 resume. Upgrade to Pro for unlimited resumes.',
        );
      }
    }

    // Verify template exists
    const template = await this.templateRepository.findOne({
      where: { id: createResumeDto.templateId },
    });
    if (!template) {
      throw new NotFoundException('Template not found');
    }

    // Check if template is pro-only and user is free
    if (template.isPro && user.plan === 'free') {
      throw new ForbiddenException('This template requires a Pro subscription');
    }

    const resume = new Resume();
    resume.name = createResumeDto.name;
    resume.userId = userId;
    resume.templateId = createResumeDto.templateId;
    resume.data = this.transformDtoToResumeData(createResumeDto.data);
    resume.status = ResumeStatus.Draft;
    resume.completionPercentage = this.calculateCompletionPercentage(
      resume.data,
    );
    resume.lastOpenedAt = new Date();

    return await this.resumesRepository.save(resume);
  }

  async update(
    id: string,
    updateResumeDto: UpdateResumeDto,
    userId: string,
  ): Promise<Resume> {
    const resume = await this.resumesRepository.findOne({
      where: { id, userId },
      relations: ['template'],
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    // Update name if provided
    if (updateResumeDto.name !== undefined) {
      resume.name = updateResumeDto.name;
    }

    // Update template if provided
    if (updateResumeDto.templateId !== undefined) {
      const template = await this.templateRepository.findOne({
        where: { id: updateResumeDto.templateId },
      });
      if (!template) {
        throw new NotFoundException('Template not found');
      }

      // Check if template is pro-only
      if (template.isPro) {
        const user = await this.userRepository.findOne({
          where: { id: userId },
        });
        if (user && user.plan === 'free') {
          throw new ForbiddenException(
            'This template requires a Pro subscription',
          );
        }
      }

      resume.templateId = updateResumeDto.templateId;
    }

    // Update status if provided
    if (updateResumeDto.status !== undefined) {
      resume.status = updateResumeDto.status;
    }

    // Update data if provided
    if (updateResumeDto.data !== undefined) {
      resume.data = this.transformDtoToResumeData(updateResumeDto.data);
      resume.completionPercentage = this.calculateCompletionPercentage(
        resume.data,
      );
    }

    resume.updatedAt = new Date();

    return await this.resumesRepository.save(resume);
  }

  async remove(id: string, userId: string): Promise<void> {
    const resume = await this.resumesRepository.findOne({
      where: { id, userId },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    await this.resumesRepository.remove(resume);
  }

  async duplicate(
    id: string,
    userId: string,
    newName?: string,
  ): Promise<Resume> {
    const resume = await this.resumesRepository.findOne({
      where: { id, userId },
      relations: ['template'],
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    // Check free tier limit
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user && user.plan === 'free') {
      const resumeCount = await this.resumesRepository.count({
        where: { userId },
      });
      if (resumeCount >= 1) {
        throw new ForbiddenException(
          'Free users can only have 1 resume. Upgrade to Pro for unlimited resumes.',
        );
      }
    }

    const duplicatedResume = new Resume();
    duplicatedResume.name = newName || `${resume.name} (Copy)`;
    duplicatedResume.userId = userId;
    duplicatedResume.templateId = resume.templateId;
    duplicatedResume.data = resume.data;
    duplicatedResume.status = ResumeStatus.Draft;
    duplicatedResume.completionPercentage = resume.completionPercentage;

    return await this.resumesRepository.save(duplicatedResume);
  }

  async reorderSections(
    id: string,
    reorderSectionsDto: ReorderSectionsDto,
    userId: string,
  ): Promise<Resume> {
    const resume = await this.resumesRepository.findOne({
      where: { id, userId },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    resume.data.sectionOrder = reorderSectionsDto.sectionOrder;
    resume.updatedAt = new Date();

    return await this.resumesRepository.save(resume);
  }

  async getStats(
    id: string,
    userId: string,
  ): Promise<{ views: number; downloads: number; lastViewedAt: Date | null }> {
    const resume = await this.resumesRepository.findOne({
      where: { id, userId },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    // For now, return mock stats - in production, these would be tracked in a separate analytics table
    return {
      views: 0,
      downloads: 0,
      lastViewedAt: null,
    };
  }

  private transformDtoToResumeData(data: any): ResumeData {
    return {
      profile: {
        firstName: data.profile?.firstName || '',
        lastName: data.profile?.lastName || '',
        jobTitle: data.profile?.jobTitle || '',
        email: data.profile?.email || '',
        phone: data.profile?.phone || '',
        location: data.profile?.location || '',
        website: data.profile?.website || '',
        linkedin: data.profile?.linkedin || '',
        summary: data.profile?.summary || '',
        photoUrl: data.profile?.photoUrl,
      },
      experiences: data.experiences || [],
      education: data.education || [],
      skills: data.skills || [],
      projects: data.projects || [],
      languages: data.languages || [],
      certifications: data.certifications || [],
      customSections: data.customSections || [],
      sectionOrder: data.sectionOrder || [
        'profile',
        'experiences',
        'education',
        'skills',
        'projects',
        'languages',
        'certifications',
      ],
    };
  }

  private calculateCompletionPercentage(data: ResumeData): number {
    let totalFields = 0;
    let filledFields = 0;

    // Profile fields
    const profileFields = [
      'firstName',
      'lastName',
      'jobTitle',
      'email',
      'phone',
      'location',
      'summary',
    ];
    totalFields += profileFields.length;
    profileFields.forEach((field) => {
      if (data.profile[field as keyof typeof data.profile]) filledFields++;
    });

    // Experience
    if (data.experiences && data.experiences.length > 0) {
      filledFields += Math.min(data.experiences.length, 1);
    }
    totalFields += 1;

    // Education
    if (data.education && data.education.length > 0) {
      filledFields += Math.min(data.education.length, 1);
    }
    totalFields += 1;

    // Skills
    if (data.skills && data.skills.length >= 3) {
      filledFields += 1;
    }
    totalFields += 1;

    // Projects (optional)
    if (data.projects && data.projects.length > 0) {
      filledFields += 1;
    }
    totalFields += 1;

    return Math.round((filledFields / totalFields) * 100);
  }
}
