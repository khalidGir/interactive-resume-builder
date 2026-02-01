import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resume } from '../entities/resume.entity';
import { User } from '../entities/user.entity';
import { CreateResumeDto, UpdateResumeDto } from '../dto/resume.dto';

@Injectable()
export class ResumesService {
  constructor(
    @InjectRepository(Resume)
    private resumesRepository: Repository<Resume>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(userId: string): Promise<Resume[]> {
    return await this.resumesRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Resume> {
    const resume = await this.resumesRepository.findOne({
      where: { id, userId },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    return resume;
  }

  async create(createResumeDto: CreateResumeDto, userId: string): Promise<Resume> {
    const resume = new Resume();
    resume.data = createResumeDto.data;
    resume.userId = userId;

    return await this.resumesRepository.save(resume);
  }

  async update(id: string, updateResumeDto: UpdateResumeDto, userId: string): Promise<Resume> {
    const resume = await this.resumesRepository.findOne({
      where: { id, userId },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    resume.data = updateResumeDto.data;
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
}