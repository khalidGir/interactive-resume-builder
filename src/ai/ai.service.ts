import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private configService: ConfigService) {}

  /**
   * Improves a resume bullet point using AI
   * @param text The original bullet point text
   * @param role Optional job role context
   * @returns Improved bullet point text
   */
  async improveBulletPoint(text: string, role?: string): Promise<string> {
    // Validate input
    if (!text || text.trim().length === 0) {
      throw new Error('Bullet point text is required');
    }

    // In a real implementation, this would call an open-source LLM API
    // For now, we'll use a cost-effective approach with a well-crafted prompt
    // that could work with local LLMs like Llama in the future
    const improvedText = await this.callLocalLLMForBulletImprovement(text, role);

    return improvedText;
  }

  /**
   * Calls a local LLM for bullet point improvement
   * This is structured to easily connect to an actual LLM API in the future
   */
  private async callLocalLLMForBulletImprovement(text: string, role?: string): Promise<string> {
    // This is a placeholder implementation that simulates calling a local LLM
    // In a real implementation, you would connect to a local LLM API like Ollama,
    // Hugging Face transformers, or similar open-source solution

    // Create a prompt for the LLM
    const prompt = this.createBulletImprovementPrompt(text, role);

    // For now, we'll simulate the response with a cost-conscious approach
    // In a real implementation, this would call the actual LLM
    return this.simulateLLMResponse(prompt);
  }

  /**
   * Creates a prompt for bullet point improvement
   */
  private createBulletImprovementPrompt(text: string, role?: string): string {
    let prompt = `Improve this resume bullet point to be more impactful, specific, and quantifiable. `;

    if (role) {
      prompt += `Consider the role of "${role}" when improving. `;
    }

    prompt += `Make it start with a strong action verb and focus on achievements and outcomes. `;
    prompt += `Keep it concise but powerful. Original text: "${text}"`;

    return prompt;
  }

  /**
   * Simulates LLM response (in a real app, this would call the actual LLM)
   */
  private simulateLLMResponse(prompt: string): string {
    // This is a cost-conscious simulation that follows best practices for resume writing
    // In a real implementation, this would be replaced with an actual LLM call

    // Extract the original text from the prompt
    const originalText = prompt.match(/Original text: "(.*)"/)?.[1] || "";

    // Apply transformations that follow resume best practices
    let improvedText = originalText.trim();

    // Capitalize first letter if needed
    if (improvedText && improvedText[0]) {
      improvedText = improvedText.charAt(0).toUpperCase() + improvedText.slice(1);
    }

    // Remove trailing period if present (standard for resume bullets)
    if (improvedText.endsWith('.')) {
      improvedText = improvedText.slice(0, -1);
    }

    // Add a strong action verb if missing
    if (!this.startsWithActionVerb(improvedText)) {
      const actionVerbs = [
        'Spearheaded', 'Drove', 'Optimized', 'Engineered', 'Delivered',
        'Implemented', 'Launched', 'Managed', 'Developed', 'Enhanced'
      ];
      const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
      improvedText = `${randomVerb} ${improvedText}`;
    }

    // Add impact if possible (simulated)
    if (!improvedText.includes('%') && !improvedText.includes('increased') &&
        !improvedText.includes('reduced') && !improvedText.includes('improved')) {
      // Add a generic impact statement
      const impacts = [
        ', resulting in measurable improvements',
        ', leading to enhanced efficiency',
        ', contributing to team success',
        ', achieving significant results'
      ];
      const randomImpact = impacts[Math.floor(Math.random() * impacts.length)];
      improvedText += randomImpact;
    }

    return improvedText;
  }

  /**
   * Checks if the text starts with a common action verb
   */
  private startsWithActionVerb(text: string): boolean {
    const actionVerbs = [
      'Achieved', 'Built', 'Collaborated', 'Communicated', 'Completed',
      'Conceptualized', 'Coordinated', 'Created', 'Defined', 'Delivered',
      'Designed', 'Developed', 'Directed', 'Enhanced', 'Established',
      'Evaluated', 'Executed', 'Facilitated', 'Generated', 'Identified',
      'Implemented', 'Improved', 'Increased', 'Initiated', 'Innovated',
      'Integrated', 'Launched', 'Led', 'Maintained', 'Managed',
      'Maximized', 'Minimized', 'Negotiated', 'Operated', 'Organized',
      'Originated', 'Overhauled', 'Participated', 'Performed', 'Planned',
      'Processed', 'Produced', 'Programmed', 'Projected', 'Provided',
      'Reduced', 'Recommended', 'Represented', 'Resolved', 'Scheduled',
      'Selected', 'Sold', 'Solved', 'Streamlined', 'Supervised',
      'Supported', 'Synthesized', 'Tracked', 'Trained', 'Utilized',
      'Verified', 'Won', 'Yielded', 'Spearheaded', 'Drove', 'Optimized',
      'Engineered', 'Delivered'
    ];

    const firstWord = text.split(' ')[0]?.toLowerCase();
    return actionVerbs.some(verb => verb.toLowerCase() === firstWord);
  }
}