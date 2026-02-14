import { Test, TestingModule } from '@nestjs/testing';
import { ResumesService } from './resumes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Resume } from '../entities/resume.entity';
import { Repository } from 'typeorm';

describe('ResumesService', () => {
  let service: ResumesService;
  let repository: Repository<Resume>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResumesService,
        {
          provide: getRepositoryToken(Resume),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ResumesService>(ResumesService);
    repository = module.get<Repository<Resume>>(getRepositoryToken(Resume));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all resumes for a user', async (): Promise<void> => {
      const userId = '123';
      const mockResumes = [
        {
          id: '1',
          userId,
          title: 'Test Resume 1',
          data: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          userId,
          title: 'Test Resume 2',
          data: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(mockResumes);

      const result = await service.findAll(userId);

      expect(result).toEqual(mockResumes);
      expect(repository.find).toHaveBeenCalledWith({
        where: { userId },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a resume if it belongs to the user', async (): Promise<void> => {
      const userId = '123';
      const resumeId = '456';
      const mockResume = {
        id: resumeId,
        userId,
        title: 'Test Resume',
        data: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockResume);

      const result = await service.findOne(resumeId, userId);

      expect(result).toEqual(mockResume);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: resumeId, userId },
      });
    });

    it('should throw an error if resume does not belong to the user', async (): Promise<void> => {
      const userId = '123';
      const resumeId = '456';

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(resumeId, userId)).rejects.toThrow(
        'Resume not found',
      );
    });
  });

  describe('create', () => {
    it('should create a new resume', async (): Promise<void> => {
      const userId = '123';
      const createDto = { title: 'New Resume', data: { profile: {} } };
      const expectedResult = {
        id: '789',
        userId,
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(repository, 'create').mockReturnValue(expectedResult as any);
      jest.spyOn(repository, 'save').mockResolvedValue(expectedResult);

      const result = await service.create(createDto, userId);

      expect(result).toEqual(expectedResult);
      expect(repository.create).toHaveBeenCalledWith({
        userId,
        title: createDto.title,
        data: createDto.data,
      });
      expect(repository.save).toHaveBeenCalledWith(expectedResult);
    });
  });

  describe('update', () => {
    it('should update an existing resume', async (): Promise<void> => {
      const userId = '123';
      const resumeId = '456';
      const updateDto = {
        title: 'Updated Resume',
        data: { profile: { name: 'John Doe' } },
      };
      const existingResume = {
        id: resumeId,
        userId,
        title: 'Old Title',
        data: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updatedResume = {
        ...existingResume,
        ...updateDto,
        updatedAt: new Date(),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingResume);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedResume);

      const result = await service.update(resumeId, updateDto, userId);

      expect(result).toEqual(updatedResume);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: resumeId, userId },
      });
      expect(repository.save).toHaveBeenCalledWith({
        ...existingResume,
        ...updateDto,
        updatedAt: expect.any(Date),
      });
    });

    it('should throw an error if trying to update a resume that does not belong to the user', async (): Promise<void> => {
      const userId = '123';
      const resumeId = '456';
      const updateDto = { title: 'Updated Resume' };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(resumeId, updateDto, userId)).rejects.toThrow(
        'Resume not found',
      );
    });
  });

  describe('remove', () => {
    it('should remove an existing resume', async (): Promise<void> => {
      const userId = '123';
      const resumeId = '456';
      const existingResume = {
        id: resumeId,
        userId,
        title: 'To Delete',
        data: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingResume);
      jest.spyOn(repository, 'remove').mockResolvedValue(existingResume as any);

      await service.remove(resumeId, userId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: resumeId, userId },
      });
      expect(repository.remove).toHaveBeenCalledWith(existingResume);
    });

    it('should throw an error if trying to remove a resume that does not belong to the user', async (): Promise<void> => {
      const userId = '123';
      const resumeId = '456';

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(resumeId, userId)).rejects.toThrow(
        'Resume not found',
      );
    });
  });
});
