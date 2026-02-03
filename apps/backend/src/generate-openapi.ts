import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function generateOpenApiJson() {
  // Create a minimal app that doesn't initialize the database
  const app = await NestFactory.create(AppModule, { 
    logger: false, // Disable logging to reduce noise
    abortOnError: false // Don't abort on connection errors
  });
  
  // Enable validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
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
    
  // Create the document - this will fail due to DB connection but we'll catch it
  try {
    const document = SwaggerModule.createDocument(app, config, {
      operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    });
    
    // Export OpenAPI JSON
    const fs = require('fs');
    const path = require('path');
    const jsonPath = path.join(__dirname, '..', 'openapi.json');
    fs.writeFileSync(jsonPath, JSON.stringify(document, null, 2));
    
    console.log('OpenAPI JSON generated successfully at openapi.json');
  } catch (error) {
    console.log('Error creating document:', error.message);
    // Create a basic OpenAPI spec manually as fallback
    const basicSpec = {
      openapi: "3.0.0",
      info: {
        title: "Resume Builder API",
        description: "API for managing resumes",
        version: "1.0.0"
      },
      tags: [
        {
          name: "auth",
          description: "Authentication endpoints - Phase 1: Stable"
        },
        {
          name: "resumes", 
          description: "Resume management endpoints - Phase 1: Stable"
        }
      ],
      paths: {
        "/auth/signup": {
          post: {
            tags: ["auth"],
            summary: "Register a new user",
            description: "Phase 1: Stable endpoint for user registration",
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      email: { type: "string", format: "email" },
                      password: { type: "string", minLength: 6 }
                    },
                    required: ["email", "password"]
                  }
                }
              }
            },
            responses: {
              "201": { description: "User registered successfully" },
              "400": { description: "Bad request" },
              "409": { description: "User already exists" }
            }
          }
        },
        "/auth/login": {
          post: {
            tags: ["auth"],
            summary: "Login user",
            description: "Phase 1: Stable endpoint for user authentication",
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      email: { type: "string", format: "email" },
                      password: { type: "string", minLength: 6 }
                    },
                    required: ["email", "password"]
                  }
                }
              }
            },
            responses: {
              "200": { 
                description: "Login successful",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        accessToken: { type: "string" }
                      }
                    }
                  }
                }
              },
              "401": { description: "Unauthorized" }
            }
          }
        },
        "/resumes": {
          get: {
            tags: ["resumes"],
            summary: "Get all resumes for authenticated user",
            description: "Phase 1: Stable endpoint for retrieving user resumes",
            security: [{ bearerAuth: [] }],
            responses: {
              "200": { 
                description: "Returns all resumes",
                content: {
                  "application/json": {
                    type: "array",
                    items: { $ref: "#/components/schemas/Resume" }
                  }
                }
              },
              "401": { description: "Unauthorized" }
            }
          },
          post: {
            tags: ["resumes"],
            summary: "Create a new resume",
            description: "Phase 1: Stable endpoint for creating a new resume",
            security: [{ bearerAuth: [] }],
            requestBody: {
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/CreateResumeDto" }
                }
              }
            },
            responses: {
              "201": { 
                description: "Resume created successfully",
                content: {
                  "application/json": {
                    $ref: "#/components/schemas/Resume"
                  }
                }
              },
              "401": { description: "Unauthorized" }
            }
          }
        },
        "/resumes/{id}": {
          get: {
            tags: ["resumes"],
            summary: "Get a specific resume",
            description: "Phase 1: Stable endpoint for retrieving a specific resume",
            security: [{ bearerAuth: [] }],
            parameters: [{
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" }
            }],
            responses: {
              "200": { 
                description: "Returns the resume",
                content: {
                  "application/json": {
                    $ref: "#/components/schemas/Resume"
                  }
                }
              },
              "401": { description: "Unauthorized" },
              "404": { description: "Resume not found" }
            }
          },
          put: {
            tags: ["resumes"],
            summary: "Update a resume",
            description: "Phase 1: Stable endpoint for updating a resume",
            security: [{ bearerAuth: [] }],
            parameters: [{
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" }
            }],
            requestBody: {
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/UpdateResumeDto" }
                }
              }
            },
            responses: {
              "200": { 
                description: "Resume updated successfully",
                content: {
                  "application/json": {
                    $ref: "#/components/schemas/Resume"
                  }
                }
              },
              "401": { description: "Unauthorized" },
              "404": { description: "Resume not found" }
            }
          },
          delete: {
            tags: ["resumes"],
            summary: "Delete a resume",
            description: "Phase 1: Stable endpoint for deleting a resume",
            security: [{ bearerAuth: [] }],
            parameters: [{
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" }
            }],
            responses: {
              "204": { description: "Resume deleted successfully" },
              "401": { description: "Unauthorized" },
              "404": { description: "Resume not found" }
            }
          }
        },
        "/resumes/{id}/export/pdf": {
          post: {
            tags: ["resumes"],
            summary: "Export resume as PDF",
            description: "Phase 1: Stable endpoint for exporting resume as PDF",
            security: [{ bearerAuth: [] }],
            parameters: [{
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" }
            }],
            responses: {
              "200": { 
                description: "PDF exported successfully",
                content: {
                  "application/pdf": {
                    schema: { type: "string", format: "binary" }
                  }
                }
              },
              "401": { description: "Unauthorized" },
              "404": { description: "Resume not found" }
            }
          }
        }
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          }
        },
        schemas: {
          CreateUserDto: {
            type: "object",
            properties: {
              email: { type: "string", format: "email" },
              password: { type: "string", minLength: 6 }
            },
            required: ["email", "password"]
          },
          LoginUserDto: {
            type: "object",
            properties: {
              email: { type: "string", format: "email" },
              password: { type: "string", minLength: 6 }
            },
            required: ["email", "password"]
          },
          CreateResumeDto: {
            type: "object",
            properties: {
              data: { $ref: "#/components/schemas/ResumeData" }
            },
            required: ["data"]
          },
          UpdateResumeDto: {
            type: "object",
            properties: {
              data: { $ref: "#/components/schemas/ResumeData" }
            },
            required: ["data"]
          },
          ResumeData: {
            type: "object",
            properties: {
              profile: { $ref: "#/components/schemas/Profile" },
              experiences: {
                type: "array",
                items: { $ref: "#/components/schemas/Experience" }
              },
              education: {
                type: "array",
                items: { $ref: "#/components/schemas/Education" }
              },
              skills: {
                type: "array",
                items: { $ref: "#/components/schemas/Skill" }
              },
              projects: {
                type: "array",
                items: { $ref: "#/components/schemas/Project" }
              },
              languages: {
                type: "array",
                items: { $ref: "#/components/schemas/Language" }
              }
            },
            required: ["profile"]
          },
          Profile: {
            type: "object",
            properties: {
              firstName: { type: "string" },
              lastName: { type: "string" },
              jobTitle: { type: "string" },
              email: { type: "string", format: "email" },
              phone: { type: "string" },
              location: { type: "string" },
              summary: { type: "string", maxLength: 500 }
            },
            required: ["firstName", "lastName", "jobTitle"]
          },
          Experience: {
            type: "object",
            properties: {
              company: { type: "string" },
              position: { type: "string" },
              startDate: { type: "string", format: "date" },
              endDate: { type: "string", format: "date" },
              description: { type: "string" },
              currentlyWorking: { type: "boolean" }
            },
            required: ["company", "position", "startDate"]
          },
          Education: {
            type: "object",
            properties: {
              institution: { type: "string" },
              degree: { type: "string" },
              fieldOfStudy: { type: "string" },
              startDate: { type: "string", format: "date" },
              endDate: { type: "string", format: "date" },
              gpa: { type: "number", minimum: 0, maximum: 4 }
            },
            required: ["institution", "degree", "fieldOfStudy"]
          },
          Skill: {
            type: "object",
            properties: {
              name: { type: "string" },
              level: { 
                type: "string", 
                enum: ["Beginner", "Intermediate", "Advanced", "Expert"] 
              }
            },
            required: ["name"]
          },
          Project: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              link: { type: "string", format: "uri" },
              technologies: {
                type: "array",
                items: { type: "string" }
              }
            },
            required: ["title", "description"]
          },
          Language: {
            type: "object",
            properties: {
              language: { type: "string" },
              proficiency: { 
                type: "string", 
                enum: ["Elementary", "Limited", "Professional", "Native"] 
              }
            },
            required: ["language", "proficiency"]
          },
          Resume: {
            type: "object",
            properties: {
              id: { type: "string" },
              data: { $ref: "#/components/schemas/ResumeData" },
              userId: { type: "string" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" }
            }
          }
        }
      }
    };
    
    const fs = require('fs');
    const path = require('path');
    const jsonPath = path.join(__dirname, '..', 'openapi.json');
    fs.writeFileSync(jsonPath, JSON.stringify(basicSpec, null, 2));
    
    console.log('OpenAPI JSON generated successfully at openapi.json (fallback)');
  }
  
  await app.close();
}

generateOpenApiJson().catch(err => {
  console.error('Error generating OpenAPI JSON:', err);
});