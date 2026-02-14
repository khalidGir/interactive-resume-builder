import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Template, TemplateCategory } from '../entities/template.entity';
import { TemplateQueryDto, CreateTemplateDto } from '../dto/template.dto';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private templatesRepository: Repository<Template>,
  ) {}

  async findAll(query: TemplateQueryDto): Promise<Template[]> {
    const where: any = {};

    if (query.category) {
      where.category = query.category;
    }

    if (query.isPro !== undefined) {
      where.isPro = query.isPro;
    }

    if (query.search) {
      where.name = Like(`%${query.search}%`);
    }

    return this.templatesRepository.find({
      where,
      order: { name: 'ASC' },
    });
  }

  async findById(id: string): Promise<Template> {
    const template = await this.templatesRepository.findOne({ where: { id } });
    if (!template) {
      throw new NotFoundException('Template not found');
    }
    return template;
  }

  async getPreview(id: string): Promise<{ html: string; thumbnail: string }> {
    const template = await this.findById(id);
    return {
      html: template.htmlTemplate,
      thumbnail: template.thumbnailUrl,
    };
  }

  async create(createTemplateDto: CreateTemplateDto): Promise<Template> {
    const template = this.templatesRepository.create(createTemplateDto);
    return this.templatesRepository.save(template);
  }

  async seedDefaultTemplates(): Promise<void> {
    const count = await this.templatesRepository.count();
    if (count > 0) {
      return; // Templates already exist
    }

    const defaultTemplates: CreateTemplateDto[] = [
      {
        name: 'Professional Classic',
        category: TemplateCategory.Professional,
        description:
          'A clean, traditional resume template perfect for conservative industries like finance, law, and government.',
        features: [
          'Traditional layout',
          'ATS-friendly',
          'Easy to scan',
          'Conservative design',
        ],
        isPro: false,
        thumbnailUrl: '/templates/professional-classic-thumb.jpg',
        availableColors: ['#2563eb', '#1e40af', '#1e3a8a'],
        htmlTemplate: this.getProfessionalClassicTemplate(),
        styles: {
          fontFamily: 'Georgia, serif',
          headingColor: '#2563eb',
          accentColor: '#1e40af',
        },
      },
      {
        name: 'Modern Minimal',
        category: TemplateCategory.Modern,
        description:
          'A sleek, contemporary design with plenty of white space and modern typography.',
        features: [
          'Clean layout',
          'Modern typography',
          'Minimalist design',
          'Eye-catching',
        ],
        isPro: false,
        thumbnailUrl: '/templates/modern-minimal-thumb.jpg',
        availableColors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
        htmlTemplate: this.getModernMinimalTemplate(),
        styles: {
          fontFamily: 'Inter, sans-serif',
          headingColor: '#3b82f6',
          accentColor: '#10b981',
        },
      },
      {
        name: 'Creative Portfolio',
        category: TemplateCategory.Creative,
        description:
          'Stand out with this bold, creative template perfect for designers, marketers, and creative professionals.',
        features: [
          'Bold design',
          'Visual elements',
          'Unique layout',
          'Portfolio-friendly',
        ],
        isPro: true,
        thumbnailUrl: '/templates/creative-portfolio-thumb.jpg',
        availableColors: ['#f97316', '#ec4899', '#8b5cf6', '#06b6d4'],
        htmlTemplate: this.getCreativePortfolioTemplate(),
        styles: {
          fontFamily: 'Poppins, sans-serif',
          headingColor: '#f97316',
          accentColor: '#ec4899',
        },
      },
      {
        name: 'Academic Scholar',
        category: TemplateCategory.Academic,
        description:
          'Designed for academics, researchers, and educators with sections for publications and research.',
        features: [
          'Publication sections',
          'Research focus',
          'Education emphasis',
          'Detailed layout',
        ],
        isPro: true,
        thumbnailUrl: '/templates/academic-scholar-thumb.jpg',
        availableColors: ['#1e3a8a', '#312e81', '#3f3f46'],
        htmlTemplate: this.getAcademicScholarTemplate(),
        styles: {
          fontFamily: 'Times New Roman, serif',
          headingColor: '#1e3a8a',
          accentColor: '#312e81',
        },
      },
    ];

    for (const templateData of defaultTemplates) {
      const template = this.templatesRepository.create(templateData);
      await this.templatesRepository.save(template);
    }
  }

  private getProfessionalClassicTemplate(): string {
    return `
      <div class="resume-template professional-classic">
        <header class="resume-header">
          <h1 class="full-name">{{profile.firstName}} {{profile.lastName}}</h1>
          <p class="job-title">{{profile.jobTitle}}</p>
          <div class="contact-info">
            <span>{{profile.email}}</span>
            <span>{{profile.phone}}</span>
            <span>{{profile.location}}</span>
            {{#if profile.linkedin}}<span>{{profile.linkedin}}</span>{{/if}}
          </div>
        </header>
        {{#if profile.summary}}
        <section class="summary">
          <h2>Professional Summary</h2>
          <p>{{profile.summary}}</p>
        </section>
        {{/if}}
        {{#if experiences.length}}
        <section class="experience">
          <h2>Work Experience</h2>
          {{#each experiences}}
          <div class="experience-item">
            <h3>{{position}}</h3>
            <p class="company">{{company}} | {{location}}</p>
            <p class="dates">{{startDate}} - {{#if current}}Present{{else}}{{endDate}}{{/if}}</p>
            <p>{{description}}</p>
          </div>
          {{/each}}
        </section>
        {{/if}}
      </div>
    `;
  }

  private getModernMinimalTemplate(): string {
    return `
      <div class="resume-template modern-minimal">
        <aside class="sidebar">
          <h1 class="full-name">{{profile.firstName}} {{profile.lastName}}</h1>
          <p class="job-title">{{profile.jobTitle}}</p>
          <div class="contact-info">
            <p>{{profile.email}}</p>
            <p>{{profile.phone}}</p>
            <p>{{profile.location}}</p>
          </div>
        </aside>
        <main class="main-content">
          {{#if profile.summary}}
          <section class="summary">
            <h2>About</h2>
            <p>{{profile.summary}}</p>
          </section>
          {{/if}}
        </main>
      </div>
    `;
  }

  private getCreativePortfolioTemplate(): string {
    return `
      <div class="resume-template creative-portfolio">
        <header class="creative-header">
          <div class="header-content">
            <h1 class="full-name">{{profile.firstName}} {{profile.lastName}}</h1>
            <p class="job-title">{{profile.jobTitle}}</p>
          </div>
        </header>
        <!-- Creative template content -->
      </div>
    `;
  }

  private getAcademicScholarTemplate(): string {
    return `
      <div class="resume-template academic-scholar">
        <header class="academic-header">
          <h1 class="full-name">{{profile.firstName}} {{profile.lastName}}</h1>
          <p class="job-title">{{profile.jobTitle}}</p>
          <div class="contact-info">
            <span>{{profile.email}}</span>
            <span>{{profile.phone}}</span>
            <span>{{profile.location}}</span>
          </div>
        </header>
        <!-- Academic template content -->
      </div>
    `;
  }
}
