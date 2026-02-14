import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class HuggingFaceService {
  private readonly logger = new Logger(HuggingFaceService.name);
  private readonly apiUrl = 'https://api-inference.huggingface.co/models/';

  constructor(private configService: ConfigService) {}

  /**
   * Calls the HuggingFace Inference API to improve a resume bullet point
   * @param text The original bullet point text to improve
   * @param role Optional job role context
   * @returns Improved bullet point text
   */
  async improveBulletPoint(text: string, role?: string): Promise<string> {
    const token = this.configService.get<string>('HUGGINGFACE_API_TOKEN');
    const model = this.configService.get<string>(
      'HUGGINGFACE_MODEL',
      'mistralai/Mistral-7B-Instruct-v0.1',
    );

    if (!token) {
      this.logger.warn(
        'HUGGINGFACE_API_TOKEN not set, falling back to simulation',
      );
      return this.fallbackSimulation(text, role);
    }

    // Create the prompt for the model
    const prompt = this.createBulletImprovementPrompt(text, role);

    try {
      // Configure the API request
      const config = {
        method: 'POST',
        url: `${this.apiUrl}${model}`,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: {
          inputs: prompt,
          parameters: {
            max_new_tokens: 100,
            temperature: 0.7,
            return_full_text: false,
          },
        },
        timeout: 30000, // 30 seconds timeout
      };

      this.logger.log(`Calling HuggingFace API with model: ${model}`);

      // Make the API request
      const response = await axios(config);

      // Parse the response
      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        let improvedText =
          (
            response.data[0] as { generated_text?: string }
          ).generated_text?.trim() || '';

        // Clean up the response - remove the original prompt from the response
        const originalTextIndex = improvedText.indexOf(text);
        if (originalTextIndex !== -1) {
          improvedText = improvedText
            .substring(originalTextIndex + text.length)
            .trim();
        }

        // Additional cleaning: remove common prefixes that models might add
        improvedText = improvedText.replace(/^[*\-•\s]+/, '').trim(); // Remove leading bullets
        improvedText = improvedText.replace(/^[A-Z][a-z]*\s*/, (match) => {
          // Check if starts with capitalized word
          const firstWord = match.trim();
          const actionVerbs = [
            'Achieved',
            'Built',
            'Collaborated',
            'Communicated',
            'Completed',
            'Conceptualized',
            'Coordinated',
            'Created',
            'Defined',
            'Delivered',
            'Designed',
            'Developed',
            'Directed',
            'Enhanced',
            'Established',
            'Evaluated',
            'Executed',
            'Facilitated',
            'Generated',
            'Identified',
            'Implemented',
            'Improved',
            'Increased',
            'Initiated',
            'Innovated',
            'Integrated',
            'Launched',
            'Led',
            'Maintained',
            'Managed',
            'Maximized',
            'Minimized',
            'Negotiated',
            'Operated',
            'Organized',
            'Originated',
            'Overhauled',
            'Participated',
            'Performed',
            'Planned',
            'Processed',
            'Produced',
            'Programmed',
            'Projected',
            'Provided',
            'Reduced',
            'Recommended',
            'Represented',
            'Resolved',
            'Scheduled',
            'Selected',
            'Sold',
            'Solved',
            'Streamlined',
            'Supervised',
            'Supported',
            'Synthesized',
            'Tracked',
            'Trained',
            'Utilized',
            'Verified',
            'Won',
            'Yielded',
            'Spearheaded',
            'Drove',
            'Optimized',
            'Engineered',
            'Delivered',
            'Spearheaded',
            'Drove',
            'Optimized',
            'Engineered',
            'Delivered',
          ];

          if (
            actionVerbs.some(
              (verb) => verb.toLowerCase() === firstWord.toLowerCase(),
            )
          ) {
            return match; // Keep the action verb
          }
          return ''; // Remove if it's not an action verb
        });

        // Remove trailing punctuation if needed
        if (improvedText.endsWith('.') || improvedText.endsWith(':')) {
          improvedText = improvedText.slice(0, -1);
        }

        // Ensure it's not empty
        if (!improvedText) {
          this.logger.warn(
            'HuggingFace API returned empty response, using fallback',
          );
          return this.fallbackSimulation(text, role);
        }

        return improvedText;
      } else {
        this.logger.warn(
          'Unexpected response format from HuggingFace API, using fallback',
        );
        return this.fallbackSimulation(text, role);
      }
    } catch (error: any) {
      this.logger.error(
        `HuggingFace API error: ${(error as Error).message || 'Unknown error'}`,
      );

      // Handle specific error cases
      if (error.response) {
        const statusCode = (error.response as { status: number }).status;
        if (statusCode === 429) {
          this.logger.warn('Rate limited by HuggingFace API, using fallback');
          return this.fallbackSimulation(text, role);
        } else if (statusCode >= 400 && statusCode < 500) {
          this.logger.warn(
            `Client error (${statusCode}) from HuggingFace API, using fallback`,
          );
          return this.fallbackSimulation(text, role);
        }
      }

      // For other errors (network, timeout, etc.), use fallback
      return this.fallbackSimulation(text, role);
    }
  }

  /**
   * Creates a prompt for bullet point improvement
   * @param text The original bullet point text
   * @param role Optional job role context
   * @returns Formatted prompt string
   */
  private createBulletImprovementPrompt(text: string, role?: string): string {
    let prompt = `You are an expert resume writer. Improve the following resume bullet point to be more impactful, specific, and quantifiable. `;

    if (role) {
      prompt += `Consider the role of "${role}" when improving. `;
    }

    prompt += `Make it start with a strong action verb and focus on achievements and outcomes. `;
    prompt += `Keep it concise but powerful. Ensure the improved version is only the improved bullet point without any additional commentary. `;
    prompt += `Original text: "${text}"`;

    return prompt;
  }

  /**
   * Fallback simulation when API is unavailable
   * @param text The original bullet point text
   * @param role Optional job role context
   * @returns Simulated improved bullet point
   */
  private fallbackSimulation(text: string, role?: string): string {
    this.logger.log('Using fallback simulation for bullet point improvement');

    // Apply transformations that follow resume best practices
    let improvedText = text.trim();

    // Capitalize first letter if needed
    if (improvedText && improvedText[0]) {
      improvedText =
        improvedText.charAt(0).toUpperCase() + improvedText.slice(1);
    }

    // Remove trailing period if present (standard for resume bullets)
    if (improvedText.endsWith('.')) {
      improvedText = improvedText.slice(0, -1);
    }

    // Add a strong action verb if missing
    if (!this.startsWithActionVerb(improvedText)) {
      const actionVerbs = [
        'Spearheaded',
        'Drove',
        'Optimized',
        'Engineered',
        'Delivered',
        'Implemented',
        'Launched',
        'Managed',
        'Developed',
        'Enhanced',
        'Achieved',
        'Built',
        'Collaborated',
        'Communicated',
        'Completed',
        'Conceptualized',
        'Coordinated',
        'Created',
        'Defined',
        'Designed',
        'Established',
        'Evaluated',
        'Executed',
        'Facilitated',
        'Generated',
        'Identified',
        'Improved',
        'Increased',
        'Initiated',
        'Innovated',
        'Integrated',
        'Led',
        'Maintained',
        'Maximized',
        'Minimized',
        'Negotiated',
        'Operated',
        'Organized',
        'Originated',
        'Overhauled',
        'Participated',
        'Performed',
        'Planned',
        'Processed',
        'Produced',
        'Programmed',
        'Projected',
        'Provided',
        'Reduced',
        'Recommended',
        'Represented',
        'Resolved',
        'Scheduled',
        'Selected',
        'Sold',
        'Solved',
        'Streamlined',
        'Supervised',
        'Supported',
        'Synthesized',
        'Tracked',
        'Trained',
        'Utilized',
        'Verified',
        'Won',
        'Yielded',
      ];
      const randomVerb =
        actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
      improvedText = `${randomVerb} ${improvedText}`;
    }

    // Add impact if possible (simulated)
    if (
      !improvedText.includes('%') &&
      !improvedText.includes('increased') &&
      !improvedText.includes('reduced') &&
      !improvedText.includes('improved') &&
      !improvedText.includes('boosted') &&
      !improvedText.includes('enhanced')
    ) {
      // Add a generic impact statement based on role if provided
      let impactStatement = '';
      if (role && role.toLowerCase().includes('engineer')) {
        impactStatement = ', resulting in improved system performance';
      } else if (
        role &&
        (role.toLowerCase().includes('manager') ||
          role.toLowerCase().includes('lead'))
      ) {
        impactStatement = ', leading to enhanced team productivity';
      } else if (role && role.toLowerCase().includes('design')) {
        impactStatement = ', resulting in improved user experience';
      } else {
        // Generic impact statements
        const impacts = [
          ', resulting in measurable improvements',
          ', leading to enhanced efficiency',
          ', contributing to team success',
          ', achieving significant results',
          ', driving positive outcomes',
        ];
        impactStatement = impacts[Math.floor(Math.random() * impacts.length)];
      }
      improvedText += impactStatement;
    }

    return improvedText;
  }

  /**
   * Checks if the text starts with a common action verb
   * @param text The text to check
   * @returns Boolean indicating if text starts with an action verb
   */
  private startsWithActionVerb(text: string): boolean {
    const actionVerbs = [
      'Achieved',
      'Built',
      'Collaborated',
      'Communicated',
      'Completed',
      'Conceptualized',
      'Coordinated',
      'Created',
      'Defined',
      'Delivered',
      'Designed',
      'Developed',
      'Directed',
      'Enhanced',
      'Established',
      'Evaluated',
      'Executed',
      'Facilitated',
      'Generated',
      'Identified',
      'Implemented',
      'Improved',
      'Increased',
      'Initiated',
      'Innovated',
      'Integrated',
      'Launched',
      'Led',
      'Maintained',
      'Managed',
      'Maximized',
      'Minimized',
      'Negotiated',
      'Operated',
      'Organized',
      'Originated',
      'Overhauled',
      'Participated',
      'Performed',
      'Planned',
      'Processed',
      'Produced',
      'Programmed',
      'Projected',
      'Provided',
      'Reduced',
      'Recommended',
      'Represented',
      'Resolved',
      'Scheduled',
      'Selected',
      'Sold',
      'Solved',
      'Streamlined',
      'Supervised',
      'Supported',
      'Synthesized',
      'Tracked',
      'Trained',
      'Utilized',
      'Verified',
      'Won',
      'Yielded',
      'Spearheaded',
      'Drove',
      'Optimized',
      'Engineered',
      'Delivered',
    ];

    const firstWord = text.split(' ')[0]?.toLowerCase();
    return actionVerbs.some(
      (verb) => verb.toLowerCase() === firstWord?.toLowerCase(),
    );
  }
}
