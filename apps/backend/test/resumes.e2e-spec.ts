import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Resume } from '../../src/entities/resume.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ResumesController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let resumeRepository: Repository<Resume>;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    resumeRepository = moduleFixture.get<Repository<Resume>>(
      getRepositoryToken(Resume),
    );

    // Create a mock JWT token for testing
    authToken = jwtService.sign({
      userId: 'test-user-id',
      email: 'test@example.com',
    });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clear any existing test data
    await resumeRepository.delete({ userId: 'test-user-id' });
  });

  it('/resumes (POST) - should create a new resume', async () => {
    const createResumeDto = {
      title: 'Test Resume',
      data: {
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          jobTitle: 'Software Engineer',
          email: 'john@example.com',
          phone: '+1234567890',
          location: 'New York, NY',
          summary:
            'Experienced software engineer with expertise in TypeScript and NestJS.',
        },
        experiences: [],
        education: [],
        skills: [],
        projects: [],
        languages: [],
      },
    };

    return request(app.getHttpServer())
      .post('/resumes')
      .set('Authorization', `Bearer ${authToken}`)
      .send(createResumeDto)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(createResumeDto.title);
        expect(response.body.userId).toBe('test-user-id');
      });
  });

  it('/resumes (GET) - should return all resumes for the user', async () => {
    // First create a resume
    const createResumeDto = {
      title: 'Test Resume for GET',
      data: {
        profile: {
          firstName: 'Jane',
          lastName: 'Smith',
          jobTitle: 'Frontend Developer',
        },
      },
    };

    await request(app.getHttpServer())
      .post('/resumes')
      .set('Authorization', `Bearer ${authToken}`)
      .send(createResumeDto)
      .expect(201);

    // Then get all resumes
    return request(app.getHttpServer())
      .get('/resumes')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0].userId).toBe('test-user-id');
      });
  });

  it('/resumes/:id (GET) - should return a specific resume', async () => {
    // First create a resume
    const createResumeDto = {
      title: 'Test Resume for Specific GET',
      data: {
        profile: {
          firstName: 'Bob',
          lastName: 'Johnson',
          jobTitle: 'DevOps Engineer',
        },
      },
    };

    const createResponse = await request(app.getHttpServer())
      .post('/resumes')
      .set('Authorization', `Bearer ${authToken}`)
      .send(createResumeDto)
      .expect(201);

    const resumeId = createResponse.body.id;

    // Then get the specific resume
    return request(app.getHttpServer())
      .get(`/resumes/${resumeId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(resumeId);
        expect(response.body.userId).toBe('test-user-id');
        expect(response.body.title).toBe(createResumeDto.title);
      });
  });

  it('/resumes/:id (PUT) - should update a specific resume', async () => {
    // First create a resume
    const createResumeDto = {
      title: 'Original Title',
      data: {
        profile: {
          firstName: 'Alice',
          lastName: 'Brown',
          jobTitle: 'QA Engineer',
        },
      },
    };

    const createResponse = await request(app.getHttpServer())
      .post('/resumes')
      .set('Authorization', `Bearer ${authToken}`)
      .send(createResumeDto)
      .expect(201);

    const resumeId = createResponse.body.id;

    // Then update the resume
    const updateDto = {
      title: 'Updated Title',
      data: {
        profile: {
          firstName: 'Alice',
          lastName: 'Brown',
          jobTitle: 'Senior QA Engineer',
        },
      },
    };

    return request(app.getHttpServer())
      .put(`/resumes/${resumeId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateDto)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(resumeId);
        expect(response.body.title).toBe(updateDto.title);
        expect(response.body.data.profile.jobTitle).toBe(
          updateDto.data.profile.jobTitle,
        );
      });
  });

  it('/resumes/:id (DELETE) - should delete a specific resume', async () => {
    // First create a resume
    const createResumeDto = {
      title: 'Resume to Delete',
      data: {
        profile: {
          firstName: 'Charlie',
          lastName: 'Davis',
          jobTitle: 'Designer',
        },
      },
    };

    const createResponse = await request(app.getHttpServer())
      .post('/resumes')
      .set('Authorization', `Bearer ${authToken}`)
      .send(createResumeDto)
      .expect(201);

    const resumeId = createResponse.body.id;

    // Then delete the resume
    await request(app.getHttpServer())
      .delete(`/resumes/${resumeId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(204);

    // Verify the resume was deleted
    await request(app.getHttpServer())
      .get(`/resumes/${resumeId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404);
  });

  it('/resumes/:id/export/pdf (POST) - should export resume as PDF', async () => {
    // First create a resume
    const createResumeDto = {
      title: 'Resume for PDF Export',
      data: {
        profile: {
          firstName: 'Diana',
          lastName: 'Miller',
          jobTitle: 'Product Manager',
          email: 'diana@example.com',
          phone: '+1987654321',
          location: 'San Francisco, CA',
          summary: 'Product manager with 5 years of experience in tech.',
        },
        experiences: [
          {
            position: 'Senior PM',
            company: 'Tech Corp',
            startDate: '2020-01-01',
            endDate: '2023-01-01',
            currentlyWorking: false,
            description: 'Led product development for enterprise solutions.',
          },
        ],
        education: [
          {
            degree: 'BS',
            fieldOfStudy: 'Computer Science',
            institution: 'University',
            startDate: '2016-09-01',
            endDate: '2020-05-01',
            gpa: '3.8',
          },
        ],
        skills: [
          { name: 'Product Strategy', level: 'Expert' },
          { name: 'Agile Methodology', level: 'Advanced' },
        ],
        projects: [
          {
            title: 'E-commerce Platform',
            description: 'Led development of new e-commerce platform',
            link: 'https://example.com',
            technologies: ['React', 'Node.js'],
          },
        ],
        languages: [
          { language: 'English', proficiency: 'Native' },
          { language: 'Spanish', proficiency: 'Intermediate' },
        ],
      },
    };

    const createResponse = await request(app.getHttpServer())
      .post('/resumes')
      .set('Authorization', `Bearer ${authToken}`)
      .send(createResumeDto)
      .expect(201);

    const resumeId = createResponse.body.id;

    // Then export the resume as PDF
    return request(app.getHttpServer())
      .post(`/resumes/${resumeId}/export/pdf`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .then((response) => {
        expect(response.headers['content-type']).toMatch(/application\/pdf/);
        expect(response.headers['content-disposition']).toMatch(
          /attachment; filename="resume-${resumeId}-modern.pdf"/,
        );
        expect(response.body).toBeInstanceOf(Buffer);
      });
  });

  it('/resumes/:id/export/pdf?template=classic (POST) - should export resume as PDF with classic template', async () => {
    // First create a resume
    const createResumeDto = {
      title: 'Resume for Classic PDF Export',
      data: {
        profile: {
          firstName: 'Eve',
          lastName: 'Wilson',
          jobTitle: 'Data Scientist',
          email: 'eve@example.com',
          phone: '+1555555555',
          location: 'Seattle, WA',
        },
      },
    };

    const createResponse = await request(app.getHttpServer())
      .post('/resumes')
      .set('Authorization', `Bearer ${authToken}`)
      .send(createResumeDto)
      .expect(201);

    const resumeId = createResponse.body.id;

    // Then export the resume as PDF with classic template
    return request(app.getHttpServer())
      .post(`/resumes/${resumeId}/export/pdf?template=classic`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .then((response) => {
        expect(response.headers['content-type']).toMatch(/application\/pdf/);
        expect(response.headers['content-disposition']).toMatch(
          /attachment; filename="resume-${resumeId}-classic.pdf"/,
        );
        expect(response.body).toBeInstanceOf(Buffer);
      });
  });
});
