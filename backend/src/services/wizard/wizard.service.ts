import prisma from '../../config/database';
import aiService from '../ai/ai.service';
import logger from '../../utils/logger';

export class WizardService {
    /**
     * Create a new wizard session for conversational Playbook creation
     */
    async createSession(userId: string, initialInput?: string, mode: string = 'prompts') {
        try {
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

            const session = await prisma.wizardSession.create({
                data: {
                    userId,
                    mode,
                    currentStep: 1,
                    stepData: JSON.stringify({
                        userInputs: initialInput ? [initialInput] : [],
                        extractedData: {},
                        conversationHistory: [],
                    }),
                    completed: false,
                    expiresAt,
                },
            });

            logger.info(`Wizard session created: ${session.id} for user: ${userId}`);

            return {
                ...session,
                stepData: JSON.parse(session.stepData as string),
            };
        } catch (error) {
            logger.error('Error in WizardService.createSession:', error);
            throw error;
        }
    }

    /**
     * Get wizard session by ID
     */
    async getSession(sessionId: string, userId: string) {
        const session = await prisma.wizardSession.findFirst({
            where: {
                id: sessionId,
                userId,
            },
        });

        if (!session) throw new Error('Wizard session not found');

        return {
            ...session,
            stepData: JSON.parse(session.stepData as string),
        };
    }

    /**
     * Process user input in a wizard session (conversational flow)
     */
    async processInput(sessionId: string, userId: string, userInput: string) {
        const session = await this.getSession(sessionId, userId);
        const stepData = session.stepData;

        // Add user input to conversation history
        stepData.conversationHistory.push({
            role: 'user',
            message: userInput,
            timestamp: new Date().toISOString(),
        });

        // Get step-specific prompt
        const stepResponse = this.getStepPrompt(session.currentStep);

        // Update stepData with new user input
        stepData.userInputs.push(userInput);

        // Add AI response to conversation
        stepData.conversationHistory.push({
            role: 'assistant',
            message: stepResponse.question,
            timestamp: new Date().toISOString(),
        });

        // Determine next step
        const nextStep = session.currentStep + 1;
        const isComplete = nextStep > 5; // Assume 5 steps for now

        // Update session
        const updated = await prisma.wizardSession.update({
            where: { id: sessionId },
            data: {
                currentStep: isComplete ? session.currentStep : nextStep,
                stepData: JSON.stringify(stepData),
                completed: isComplete,
                completedAt: isComplete ? new Date() : null,
            },
        });

        return {
            ...updated,
            stepData: JSON.parse(updated.stepData as string),
            nextQuestion: isComplete ? null : this.getStepPrompt(nextStep).question,
        };
    }

    /**
     * Generate final Playbook from wizard session
     */
    async generateFromSession(sessionId: string, userId: string) {
        const session = await this.getSession(sessionId, userId);

        if (!session.completed) {
            throw new Error('Wizard session is not complete yet');
        }

        const stepData = session.stepData;

        // Combine all user inputs into a comprehensive prompt
        const combinedPrompt = stepData.userInputs.join('\n\n');

        // Generate Playbook using AI
        const generatedContent = await aiService.generatePlaybook(combinedPrompt);

        // Create Playbook record
        const playbook = await prisma.sOP.create({
            data: {
                title: generatedContent.title,
                departmentId: 'general',
                category: generatedContent.metadata.industry || 'General',
                purpose: generatedContent.purpose,
                status: 'DRAFT',
                content: JSON.stringify(generatedContent),
                metadata: JSON.stringify(generatedContent.metadata),
                generatedByAI: true,
                createdById: userId,
                version: 1,
            },
        });

        // Link session to generated Playbook
        await prisma.wizardSession.update({
            where: { id: sessionId },
            data: { playbookId: playbook.id },
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                type: 'Playbook_CREATED',
                description: `Playbook "${playbook.title}" created via Wizard`,
                userId,
                playbookId: playbook.id,
            },
        });

        return {
            ...playbook,
            content: JSON.parse(playbook.content),
            metadata: playbook.metadata ? JSON.parse(playbook.metadata as string) : null,
        };
    }

    /**
     * Get step-specific prompts for the wizard flow
     */
    private getStepPrompt(step: number) {
        const prompts = [
            { step: 1, question: "What's the title or main topic of this Playbook?" },
            { step: 2, question: "What's the primary purpose of this procedure? Who will use it?" },
            { step: 3, question: "Can you describe the main steps involved in this process?" },
            { step: 4, question: "Are there any specific warnings, compliance requirements, or safety notes?" },
            { step: 5, question: "What tools, resources, or systems are needed to complete this Playbook?" },
        ];

        return prompts.find(p => p.step === step) || prompts[0];
    }

    /**
     * List all sessions for a user
     */
    async listUserSessions(userId: string) {
        const sessions = await prisma.wizardSession.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        return sessions.map(s => ({
            ...s,
            stepData: JSON.parse(s.stepData as string),
        }));
    }
}

export default new WizardService();
