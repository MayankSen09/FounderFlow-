import prisma from '../../config/database';
import aiService from '../ai/ai.service';
import logger from '../../utils/logger';

export class PlaybookService {
    /**
     * Create a new Playbook (either manual or via AI)
     */
    async createPlaybook(userId: string, data: any, generatedByAI = false) {
        try {
            const playbook = await prisma.sOP.create({
                data: {
                    title: data.title,
                    departmentId: data.departmentId || 'general',
                    category: data.category || 'Standard',
                    purpose: data.purpose,
                    status: 'DRAFT',
                    content: typeof data.content === 'string' ? data.content : JSON.stringify(data.content || data),
                    metadata: typeof data.metadata === 'string' ? data.metadata : JSON.stringify(data.metadata || {}),
                    generatedByAI,
                    createdById: userId,
                    version: 1,
                },
            });

            // Log activity
            await prisma.activityLog.create({
                data: {
                    type: 'Playbook_CREATED',
                    description: `Playbook "${playbook.title}" created ${generatedByAI ? 'via AI' : 'manually'}`,
                    userId,
                    playbookId: playbook.id,
                },
            });

            return playbook;
        } catch (error) {
            logger.error('Error in PlaybookService.createPlaybook:', error);
            throw error;
        }
    }

    /**
     * Generate an Playbook using AI and then save it
     */
    async generateAndSavePlaybook(userId: string, prompt: string, industry?: string) {
        const generatedContent = await aiService.generatePlaybook(prompt, industry);

        return this.createPlaybook(userId, {
            title: generatedContent.title,
            purpose: generatedContent.purpose,
            content: generatedContent,
            metadata: generatedContent.metadata,
            category: generatedContent.metadata.industry || 'General',
        }, true);
    }

    /**
     * Get all Playbooks (for dashboard/list)
     */
    async getAllPlaybooks(filters: any = {}) {
        const where: any = { deletedAt: null };

        if (filters.status) where.status = filters.status;
        if (filters.departmentId) where.departmentId = filters.departmentId;

        const playbooks = await prisma.sOP.findMany({
            where,
            orderBy: { updatedAt: 'desc' },
            include: {
                createdBy: {
                    select: { name: true, avatar: true }
                }
            }
        });

        // Parse JSON strings back to objects for the response
        return playbooks.map(playbook => ({
            ...playbook,
            content: JSON.parse(playbook.content as string),
            metadata: playbook.metadata ? JSON.parse(playbook.metadata as string) : null,
        }));
    }

    /**
     * Get single Playbook by ID
     */
    async getPlaybookById(id: string) {
        const playbook = await prisma.sOP.findUnique({
            where: { id },
            include: {
                createdBy: {
                    select: { name: true, avatar: true }
                }
            }
        });

        if (!playbook || playbook.deletedAt) throw new Error('Playbook not found');

        return {
            ...playbook,
            content: JSON.parse(playbook.content as string),
            metadata: playbook.metadata ? JSON.parse(playbook.metadata as string) : null,
        };
    }

    /**
     * Update Playbook or create new version
     */
    async updatePlaybook(id: string, userId: string, updates: any, createNewVersion = false) {
        const current = await this.getPlaybookById(id);

        if (createNewVersion) {
            return this.createPlaybook(userId, {
                ...current,
                ...updates,
                version: current.version + 1,
                parentId: current.id,
            });
        }

        const updated = await prisma.sOP.update({
            where: { id },
            data: {
                ...updates,
                content: updates.content ? JSON.stringify(updates.content) : undefined,
                metadata: updates.metadata ? JSON.stringify(updates.metadata) : undefined,
                updatedAt: new Date(),
            }
        });

        return updated;
    }
}

export default new PlaybookService();
