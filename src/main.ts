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
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
