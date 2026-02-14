import { Test, TestingModule } from '@nestjs/testing';
import { HuggingFaceService } from './huggingface.service';
import { ConfigService } from '@nestjs/config';
import * as axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HuggingFaceService', () => {
  let service: HuggingFaceService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HuggingFaceService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<HuggingFaceService>(HuggingFaceService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('improveBulletPoint', () => {
    it('should call HuggingFace API when token is provided', async () => {
      const mockToken = 'test-token';
      const mockModel = 'mistralai/Mistral-7B-Instruct-v0.1';
      const mockInput = 'Worked on a team to build a new feature';
      const mockOutput =
        'Spearheaded development of a new feature that increased user engagement by 25%';

      jest
        .spyOn(configService, 'get')
        .mockReturnValueOnce(mockToken)
        .mockReturnValueOnce(mockModel);

      mockedAxios.default.mockResolvedValue({
        data: [{ generated_text: mockOutput }],
      });

      const result = await service.improveBulletPoint(mockInput);

      expect(result).toBe(mockOutput);
      expect(mockedAxios.default).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api-inference.huggingface.co/models/${mockModel}`,
          headers: {
            Authorization: `Bearer ${mockToken}`,
            'Content-Type': 'application/json',
          },
          data: {
            inputs: expect.stringContaining(mockInput),
            parameters: {
              max_new_tokens: 100,
              temperature: 0.7,
              return_full_text: false,
            },
          },
          timeout: 30000,
        }),
      );
    });

    it('should use fallback simulation when API token is not set', async () => {
      jest
        .spyOn(configService, 'get')
        .mockReturnValueOnce(undefined) // No token
        .mockReturnValueOnce('mistralai/Mistral-7B-Instruct-v0.1'); // Default model

      const mockInput = 'Worked on a team to build a new feature';
      const result = await service.improveBulletPoint(mockInput);

      // Result should not be empty and should contain some improvement
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should use fallback simulation when API returns error', async () => {
      const mockToken = 'test-token';
      const mockModel = 'mistralai/Mistral-7B-Instruct-v0.1';
      const mockInput = 'Managed a project';

      jest
        .spyOn(configService, 'get')
        .mockReturnValueOnce(mockToken)
        .mockReturnValueOnce(mockModel);

      mockedAxios.default.mockRejectedValue({
        response: { status: 500 },
        message: 'API Error',
      });

      const result = await service.improveBulletPoint(mockInput);

      // Result should not be empty and should contain some improvement
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should use fallback simulation when API returns unexpected format', async () => {
      const mockToken = 'test-token';
      const mockModel = 'mistralai/Mistral-7B-Instruct-v0.1';
      const mockInput = 'Developed software';

      jest
        .spyOn(configService, 'get')
        .mockReturnValueOnce(mockToken)
        .mockReturnValueOnce(mockModel);

      mockedAxios.default.mockResolvedValue({
        data: {}, // Empty response
      });

      const result = await service.improveBulletPoint(mockInput);

      // Result should not be empty and should contain some improvement
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should use fallback simulation when API returns rate limit error', async () => {
      const mockToken = 'test-token';
      const mockModel = 'mistralai/Mistral-7B-Instruct-v0.1';
      const mockInput = 'Led a team';

      jest
        .spyOn(configService, 'get')
        .mockReturnValueOnce(mockToken)
        .mockReturnValueOnce(mockModel);

      mockedAxios.default.mockRejectedValue({
        response: { status: 429 },
        message: 'Rate Limited',
      });

      const result = await service.improveBulletPoint(mockInput);

      // Result should not be empty and should contain some improvement
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('createBulletImprovementPrompt', () => {
    it('should create a proper prompt without role', () => {
      const text = 'Worked on a team';
      const result = (service as any).createBulletImprovementPrompt(text);

      expect(result).toContain(text);
      expect(result).toContain('improve');
      expect(result).toContain('impactful');
    });

    it('should create a proper prompt with role', () => {
      const text = 'Managed a project';
      const role = 'Project Manager';
      const result = (service as any).createBulletImprovementPrompt(text, role);

      expect(result).toContain(text);
      expect(result).toContain(role);
      expect(result).toContain('Project Manager');
    });
  });

  describe('fallbackSimulation', () => {
    it('should simulate improvement when API is unavailable', () => {
      const text = 'Worked on a team';
      const result = (service as any).fallbackSimulation(text);

      expect(result).toBeDefined();
      expect(result).toContain(text);
      expect(result.length).toBeGreaterThan(text.length);
    });

    it('should simulate improvement with role context', () => {
      const text = 'Developed software';
      const role = 'Software Engineer';
      const result = (service as any).fallbackSimulation(text, role);

      expect(result).toBeDefined();
      expect(result).toContain(text);
      expect(result.length).toBeGreaterThan(text.length);
    });
  });
});
