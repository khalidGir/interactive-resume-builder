// Strict Resume JSON Schema
export const resumeSchema = {
  type: 'object',
  properties: {
    profile: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        jobTitle: { type: 'string' },
        email: { type: 'string', format: 'email' },
        phone: { type: 'string' },
        location: { type: 'string' },
        summary: { type: 'string' },
      },
      required: ['firstName', 'lastName', 'jobTitle'],
    },
    experiences: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          company: { type: 'string' },
          position: { type: 'string' },
          startDate: { type: 'string', format: 'date' },
          endDate: { type: 'string', format: 'date' },
          description: { type: 'string' },
          currentlyWorking: { type: 'boolean' },
        },
        required: ['company', 'position', 'startDate'],
      },
    },
    education: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          institution: { type: 'string' },
          degree: { type: 'string' },
          fieldOfStudy: { type: 'string' },
          startDate: { type: 'string', format: 'date' },
          endDate: { type: 'string', format: 'date' },
          gpa: { type: 'number' },
        },
        required: ['institution', 'degree', 'fieldOfStudy'],
      },
    },
    skills: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          level: { type: 'string', enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] },
        },
        required: ['name'],
      },
    },
    projects: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          link: { type: 'string', format: 'uri' },
          technologies: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        required: ['title', 'description'],
      },
    },
    languages: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          language: { type: 'string' },
          proficiency: { type: 'string', enum: ['Elementary', 'Limited', 'Professional', 'Native'] },
        },
        required: ['language', 'proficiency'],
      },
    },
  },
  required: ['profile'],
};