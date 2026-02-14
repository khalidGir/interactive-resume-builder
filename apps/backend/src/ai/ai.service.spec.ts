import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { HuggingFaceService } from './huggingface.service';
import { ConfigService } from '@nestjs/config';

describe('AiService', () => {
  let service: AiService;
  let huggingFaceService: HuggingFaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: HuggingFaceService,
          useValue: {
            improveBulletPoint: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
    huggingFaceService = module.get<HuggingFaceService>(HuggingFaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('improveBulletPoint', () => {
    it('should improve a bullet point using HuggingFace service', async (): Promise<void> => {
      const mockInput = 'Worked on a team to build a new feature';
      const mockOutput =
        'Spearheaded development of a new feature that increased user engagement by 25%';

      jest
        .spyOn(huggingFaceService, 'improveBulletPoint')
        .mockResolvedValue(mockOutput);

      const result = await service.improveBulletPoint(mockInput);

      expect(result).toBe(mockOutput);
      expect(huggingFaceService.improveBulletPoint).toHaveBeenCalledWith(
        mockInput,
        undefined,
      );
    });

    it('should improve a bullet point with role context', async (): Promise<void> => {
      const mockInput = 'Managed a project';
      const mockRole = 'Project Manager';
      const mockOutput =
        'Managed cross-functional project that delivered on-time and under budget';

      jest
        .spyOn(huggingFaceService, 'improveBulletPoint')
        .mockResolvedValue(mockOutput);

      const result = await service.improveBulletPoint(mockInput, mockRole);

      expect(result).toBe(mockOutput);
      expect(huggingFaceService.improveBulletPoint).toHaveBeenCalledWith(
        mockInput,
        mockRole,
      );
    });

    it('should throw an error for empty input', async (): Promise<void> => {
      await expect(service.improveBulletPoint('')).rejects.toThrow(
        'Bullet point text is required',
      );
      await expect(service.improveBulletPoint('   ')).rejects.toThrow(
        'Bullet point text is required',
      );
    });

    it('should throw an error for null input', async (): Promise<void> => {
      await expect(service.improveBulletPoint(null)).rejects.toThrow(
        'Bullet point text is required',
      );
    });

    it('should throw an error for undefined input', async (): Promise<void> => {
      await expect(service.improveBulletPoint(undefined)).rejects.toThrow(
        'Bullet point text is required',
      );
    });
  });
});
