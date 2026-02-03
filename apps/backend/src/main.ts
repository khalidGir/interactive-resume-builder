import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Use global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // Strips objects of any properties not in the DTO
      forbidNonWhitelisted: true, // Throws error if non-whitelisted property is present
      transform: true,           // Automatically transforms payloads to DTO instances
    }),
  );

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Resume Builder API')
    .setDescription('API for managing resumes')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints - Phase 1: Stable')
    .addTag('resumes', 'Resume management endpoints - Phase 1: Stable')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  // Export OpenAPI JSON if GENERATE_OPENAPI env variable is set
  if (process.env.GENERATE_OPENAPI === 'true') {
    const fs = require('fs');
    const path = require('path');
    const jsonPath = path.join(__dirname, '..', 'openapi.json');
    fs.writeFileSync(jsonPath, JSON.stringify(document, null, 2));
    console.log('OpenAPI JSON generated successfully at openapi.json');
    await app.close();
    return;
  }

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
