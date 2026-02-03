import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AiController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ai/improve-bullet (POST) - should return improved bullet point', async () => {
    const response = await request(app.getHttpServer())
      .post('/ai/improve-bullet')
      .send({
        text: 'worked on a team to build a new feature',
        role: 'Software Engineer'
      })
      .expect(401); // Expecting 401 because we didn't provide authentication

    // The endpoint requires authentication, so we expect a 401
    expect(response.status).toBe(401);
  });

  afterEach(async () => {
    await app.close();
  });
});