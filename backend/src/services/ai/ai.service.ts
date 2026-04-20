import config from '../../config/env';
import { getAIClient } from '../../config/ai';
import logger from '../../utils/logger';
import { Playbook_GENERATION_PROMPT, REFINE_Playbook_PROMPT } from './prompts';

export interface GeneratedPlaybook {
    title: string;
    purpose: string;
    scope: string;
    procedures: Array<{
        stepNumber: number;
        title: string;
        description: string;
        warnings: string[];
        resources: string[];
    }>;
    definitions: Record<string, string>;
    compliance: string[];
    metadata: {
        industry: string;
        complexity: string;
        estimatedTime: string;
    };
}

export class AIService {
    private _model: any = null;
    private generationConfig: any = {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
    };

    /**
     * Lazy getter for the generative model
     */
    private get model() {
        if (!this._model) {
            const genAI = getAIClient();
            this._model = genAI.getGenerativeModel({
                model: config.aiModel,
            });
        }
        return this._model;
    }

    /**
     * Generates a complete Playbook from a brief description or title
     */
    async generatePlaybook(input: string, industry?: string): Promise<GeneratedPlaybook> {
        const startTime = Date.now();
        logger.info(`Starting Playbook generation for: ${input.substring(0, 50)}...`);

        try {
            const prompt = `
        ${Playbook_GENERATION_PROMPT}
        
        [User Input]:
        Title/Topic: ${input}
        ${industry ? `Industry: ${industry}` : ''}
      `;

            const result = await this.model.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: this.generationConfig,
            });
            const response = await result.response;
            let text = response.text();

            // Clean possible markdown JSON wrappers
            text = this.cleanJsonString(text);

            try {
                const parsed = JSON.parse(text);
                const duration = Date.now() - startTime;
                logger.info(`Playbook generated successfully in ${duration}ms`);
                return parsed as GeneratedPlaybook;
            } catch (parseError) {
                logger.error('Failed to parse AI response as JSON:', text);
                throw new Error('AI produced an invalid response format');
            }
        } catch (error) {
            logger.error('Error in AIService.generatePlaybook:', error);
            throw error;
        }
    }

    /**
     * Refines an existing Playbook based on feedback
     */
    async refinePlaybook(originalContent: string, feedback: string): Promise<GeneratedPlaybook> {
        try {
            const prompt = REFINE_Playbook_PROMPT
                .replace('{{originalContent}}', originalContent)
                .replace('{{feedback}}', feedback);

            const result = await this.model.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: this.generationConfig,
            });
            const response = await result.response;
            let text = response.text();
            text = this.cleanJsonString(text);

            return JSON.parse(text) as GeneratedPlaybook;
        } catch (error) {
            logger.error('Error in AIService.refinePlaybook:', error);
            throw error;
        }
    }

    /**
     * Simple method to sanitize AI output if needed
     */
    private cleanJsonString(str: string): string {
        return str.replace(/```json\n?|```/g, '').trim();
    }
}

export default new AIService();
