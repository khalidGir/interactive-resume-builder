import { Test } from '@nestjs/testing';
import { AiService } from './ai.service';
import { ConfigService } from '@nestjs/config';

describe('AiService', () => {
  let service: AiService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should improve a bullet point', async () => {
    const result = await service.improveBulletPoint('worked on a team to build a new feature');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle role context', async () => {
    const result = await service.improveBulletPoint('built a new feature', 'Software Engineer');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should throw error for empty text', async () => {
    await expect(service.improveBulletPoint('')).rejects.toThrow('Bullet point text is required');
  });
});