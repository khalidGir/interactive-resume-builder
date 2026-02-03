import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { chromium } from 'playwright-core';

@Injectable()
export class PdfService {
  async generatePdfFromHtml(htmlContent: string): Promise<Buffer> {
    // Launch a headless browser
    const browser = await chromium.launch({
      executablePath: process.env.CHROMIUM_PATH, // Path to your Chromium installation
    });
    
    try {
      // Create a new page
      const page = await browser.newPage();
      
      // Set the HTML content to the page
      await page.setContent(htmlContent, { waitUntil: 'networkidle' });
      
      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          bottom: '20px',
          left: '20px',
          right: '20px',
        },
      });
      
      return pdfBuffer;
    } finally {
      // Close the browser
      await browser.close();
    }
  }

  async generateResumeHtml(resumeData: any): Promise<string> {
    // Read the template file
    const templatePath = path.join(__dirname, '../assets/resume-template.html');
    let template = fs.readFileSync(templatePath, 'utf8');

    // Replace placeholders with actual data
    // This is a simplified replacement - in a real implementation, you'd want to use a proper templating engine
    template = template.replace('{{fullName}}', `${resumeData.profile.firstName} ${resumeData.profile.lastName}`);
    template = template.replace('{{profile.firstName}}', resumeData.profile.firstName || '');
    template = template.replace('{{profile.lastName}}', resumeData.profile.lastName || '');
    template = template.replace('{{profile.jobTitle}}', resumeData.profile.jobTitle || '');
    template = template.replace('{{profile.email}}', resumeData.profile.email || '');
    template = template.replace('{{profile.phone}}', resumeData.profile.phone || '');
    template = template.replace('{{profile.location}}', resumeData.profile.location || '');
    template = template.replace('{{profile.summary}}', resumeData.profile.summary || '');

    // Handle experiences
    let experiencesHtml = '';
    if (resumeData.experiences && resumeData.experiences.length > 0) {
      for (const exp of resumeData.experiences) {
        experiencesHtml += `
        <div class="experience-item">
          <div class="job-title">${exp.position || ''}</div>
          <div class="company">${exp.company || ''} <span class="date-range">${exp.startDate || ''} - ${exp.currentlyWorking ? 'Present' : (exp.endDate || '')}</span></div>
          <div class="clear"></div>
          <p>${exp.description || ''}</p>
        </div>
        `;
      }
    }
    template = template.replace('{{#if experiences.length}}\n    <div class="experiences">\n        <h2 class="section-title">Experience</h2>\n        {{#each experiences}}\n        <div class="experience-item">\n            <div class="job-title">{{this.position}}</div>\n            <div class="company">{{this.company}} <span class="date-range">{{this.startDate}} - {{#if this.currentlyWorking}}Present{{else}}{{this.endDate}}{{/if}}</span></div>\n            <div class="clear"></div>\n            <p>{{this.description}}</p>\n        </div>\n        {{/each}}\n    </div>\n    {{/if}}', experiencesHtml ? `<div class="experiences"><h2 class="section-title">Experience</h2>${experiencesHtml}</div>` : '');

    // Handle education
    let educationHtml = '';
    if (resumeData.education && resumeData.education.length > 0) {
      for (const edu of resumeData.education) {
        educationHtml += `
        <div class="education-item">
          <div class="degree">${edu.degree || ''} in ${edu.fieldOfStudy || ''}</div>
          <div class="institution">${edu.institution || ''} <span class="date-range">${edu.startDate || ''} - ${edu.endDate || ''}</span></div>
          <div class="clear"></div>
          ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
        </div>
        `;
      }
    }
    template = template.replace('{{#if education.length}}\n    <div class="education">\n        <h2 class="section-title">Education</h2>\n        {{#each education}}\n        <div class="education-item">\n            <div class="degree">{{this.degree}} in {{this.fieldOfStudy}}</div>\n            <div class="institution">{{this.institution}} <span class="date-range">{{this.startDate}} - {{this.endDate}}</span></div>\n            <div class="clear"></div>\n            {{#if this.gpa}}\n            <p>GPA: {{this.gpa}}</p>\n            {{/if}}\n        </div>\n        {{/each}}\n    </div>\n    {{/if}}', educationHtml ? `<div class="education"><h2 class="section-title">Education</h2>${educationHtml}</div>` : '');

    // Handle skills
    let skillsHtml = '';
    if (resumeData.skills && resumeData.skills.length > 0) {
      let skillsTags = '';
      for (const skill of resumeData.skills) {
        skillsTags += `<div class="skill-tag">${skill.name} ${skill.level ? `(${skill.level})` : ''}</div>`;
      }
      skillsHtml = `<div class="skills-container">${skillsTags}</div>`;
    }
    template = template.replace('{{#if skills.length}}\n    <div class="skills">\n        <h2 class="section-title">Skills</h2>\n        <div class="skills-container">\n            {{#each skills}}\n            <div class="skill-tag">{{this.name}} {{#if this.level}}({{this.level}}){{/if}}</div>\n            {{/each}}\n        </div>\n    </div>\n    {{/if}}', skillsHtml ? `<div class="skills"><h2 class="section-title">Skills</h2>${skillsHtml}</div>` : '');

    // Handle projects
    let projectsHtml = '';
    if (resumeData.projects && resumeData.projects.length > 0) {
      for (const proj of resumeData.projects) {
        projectsHtml += `
        <div class="project-item">
          <div class="project-title">${proj.title || ''}</div>
          <p>${proj.description || ''}</p>
          ${proj.link ? `<p><a href="${proj.link}">${proj.link}</a></p>` : ''}
          ${proj.technologies && proj.technologies.length ? `<p>Technologies: ${proj.technologies.join(', ')}</p>` : ''}
        </div>
        `;
      }
    }
    template = template.replace('{{#if projects.length}}\n    <div class="projects">\n        <h2 class="section-title">Projects</h2>\n        {{#each projects}}\n        <div class="project-item">\n            <div class="project-title">{{this.title}}</div>\n            <p>{{this.description}}</p>\n            {{#if this.link}}<p><a href="{{this.link}}">{{this.link}}</a></p>{{/if}}\n            {{#if this.technologies.length}}\n            <p>Technologies: {{#each this.technologies}}{{#unless @first}}, {{/unless}}{{this}}{{/each}}</p>\n            {{/if}}\n        </div>\n        {{/each}}\n    </div>\n    {{/if}}', projectsHtml ? `<div class="projects"><h2 class="section-title">Projects</h2>${projectsHtml}</div>` : '');

    // Handle languages
    let languagesHtml = '';
    if (resumeData.languages && resumeData.languages.length > 0) {
      for (const lang of resumeData.languages) {
        languagesHtml += `<div class="language-item"><span class="language-name">${lang.language || ''}</span>${lang.proficiency ? ` <span>(${lang.proficiency})</span>` : ''}</div>`;
      }
    }
    template = template.replace('{{#if languages.length}}\n    <div class="languages">\n        <h2 class="section-title">Languages</h2>\n        {{#each languages}}\n        <div class="language-item">\n            <span class="language-name">{{this.language}}</span>\n            {{#if this.proficiency}}<span> ({{this.proficiency}})</span>{{/if}}\n        </div>\n        {{/each}}\n    </div>\n    {{/if}}', languagesHtml ? `<div class="languages"><h2 class="section-title">Languages</h2>${languagesHtml}</div>` : '');

    // Handle summary section
    if (resumeData.profile.summary) {
      template = template.replace('{{#if profile.summary}}\n    <div class="summary">\n        <h2 class="section-title">Summary</h2>\n        <p>{{profile.summary}}</p>\n    </div>\n    {{/if}}', `<div class="summary"><h2 class="section-title">Summary</h2><p>${resumeData.profile.summary}</p></div>`);
    } else {
      template = template.replace('{{#if profile.summary}}\n    <div class="summary">\n        <h2 class="section-title">Summary</h2>\n        <p>{{profile.summary}}</p>\n    </div>\n    {{/if}}', '');
    }

    return template;
  }
}