import prisma from '../../config/database';
import logger from '../../utils/logger';

export class AnalyticsService {
    /**
     * Get dashboard statistics for a user
     */
    async getDashboardStats(userId: string, userRole: string) {
        try {
            // Build where clause based on role
            const isAdmin = userRole === 'ADMIN';
            const whereClause = isAdmin ? {} : { createdById: userId };

            // Get Playbook statistics
            const totalPlaybooks = await prisma.sOP.count({
                where: { ...whereClause, deletedAt: null },
            });

            const playbooksByStatus = await prisma.sOP.groupBy({
                by: ['status'],
                where: { ...whereClause, deletedAt: null },
                _count: true,
            });

            const aiGeneratedCount = await prisma.sOP.count({
                where: { ...whereClause, generatedByAI: true, deletedAt: null },
            });

            // Get recent activity
            const recentActivity = await prisma.activityLog.findMany({
                where: isAdmin ? {} : { userId },
                orderBy: { createdAt: 'desc' },
                take: 10,
                include: {
                    user: {
                        select: { name: true, avatar: true },
                    },
                    playbook: {
                        select: { title: true },
                    },
                },
            });

            // Get wizard statistics
            const totalWizardSessions = await prisma.wizardSession.count({
                where: { userId },
            });

            const completedSessions = await prisma.wizardSession.count({
                where: { userId, completed: true },
            });

            return {
                playbooks: {
                    total: totalPlaybooks,
                    byStatus: playbooksByStatus.reduce((acc, item) => {
                        acc[item.status] = item._count;
                        return acc;
                    }, {} as Record<string, number>),
                    aiGenerated: aiGeneratedCount,
                },
                wizard: {
                    total: totalWizardSessions,
                    completed: completedSessions,
                    completionRate: totalWizardSessions > 0
                        ? Math.round((completedSessions / totalWizardSessions) * 100)
                        : 0,
                },
                recentActivity: recentActivity.map(activity => ({
                    ...activity,
                    metadata: activity.metadata ? JSON.parse(activity.metadata as string) : null,
                })),
            };
        } catch (error) {
            logger.error('Error fetching dashboard stats:', error);
            throw error;
        }
    }

    /**
     * Get activity feed with pagination
     */
    async getActivityFeed(userId: string, userRole: string, params: any = {}) {
        const { page = 1, limit = 20, type } = params;
        const skip = (page - 1) * limit;

        const isAdmin = userRole === 'ADMIN';
        const where: any = isAdmin ? {} : { userId };

        if (type) where.type = type;

        const [activities, total] = await Promise.all([
            prisma.activityLog.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    user: {
                        select: { name: true, avatar: true, email: true },
                    },
                    playbook: {
                        select: { title: true, status: true },
                    },
                },
            }),
            prisma.activityLog.count({ where }),
        ]);

        return {
            activities: activities.map(a => ({
                ...a,
                metadata: a.metadata ? JSON.parse(a.metadata as string) : null,
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get Playbook trends over time
     */
    async getPlaybookTrends(userId: string, userRole: string, days: number = 30) {
        const isAdmin = userRole === 'ADMIN';
        const whereClause = isAdmin ? {} : { createdById: userId };

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const playbooks = await prisma.sOP.findMany({
            where: {
                ...whereClause,
                createdAt: { gte: startDate },
                deletedAt: null,
            },
            select: {
                createdAt: true,
                status: true,
                generatedByAI: true,
            },
        });

        // Group by date
        const trendData: Record<string, any> = {};

        playbooks.forEach(playbook => {
            const dateKey = playbook.createdAt.toISOString().split('T')[0];
            if (!trendData[dateKey]) {
                trendData[dateKey] = { total: 0, aiGenerated: 0, manual: 0 };
            }
            trendData[dateKey].total++;
            if (playbook.generatedByAI) {
                trendData[dateKey].aiGenerated++;
            } else {
                trendData[dateKey].manual++;
            }
        });

        return Object.entries(trendData).map(([date, data]) => ({
            date,
            ...data,
        })).sort((a, b) => a.date.localeCompare(b.date));
    }
}

export default new AnalyticsService();
