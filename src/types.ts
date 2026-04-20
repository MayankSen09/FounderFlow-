export type UserRole = 'Admin' | 'Editor' | 'Viewer';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    departmentId?: string;
    avatarUrl?: string;
}

export type PlaybookStatus = 'Draft' | 'Review' | 'Approved' | 'Archived';

export interface Playbook {
    id: string;
    title: string;
    departmentId: string;
    status: PlaybookStatus;
    currentVersion: number;
    content: string; // HTML/RichText
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    tags?: string[];
    teamId?: string; // Added for team collaboration
}

export interface PlaybookVersion {
    id: string;
    playbookId: string;
    versionNumber: number;
    content: string;
    changeSummary: string;
    createdBy: string;
    createdAt: string;
}

export interface Department {
    id: string;
    name: string;
    description?: string;
}

export interface Comment {
    id: string;
    playbookId: string;
    userId: string;
    text: string;
    createdAt: string;
}

// Team Collaboration Types
export type TeamMemberRole = 'Owner' | 'Admin' | 'Editor' | 'Viewer';

export interface Team {
    id: string;
    name: string;
    inviteCode: string;
    ownerId: string;
    createdAt: string;
    settings: TeamSettings;
}

export interface TeamMember {
    id: string;
    userId: string;
    teamId: string;
    role: TeamMemberRole;
    joinedAt: string;
}

export interface TeamSettings {
    allowInvites: boolean;
    defaultMemberRole: UserRole;
}

// Marketing Strategy Types
export interface MarketingStrategy {
    id: string;
    industry: string;
    companySize: string;
    targetGeo: string;
    businessModel: string;
    generatedAt: string;
    objectives: string[];
    channels: {
        name: string;
        focus: string;
        tactics: string[];
    }[];
    metaTargeting: {
        interests: string[];
        behaviors: string[];
        demographics: string[];
    };
    roadmap: {
        phase: string;
        duration: string;
        activities: string[];
    }[];
    teamId?: string; // Added for team collaboration
}

// Analytics Types
export interface AnalyticsEvent {
    id: string;
    teamId: string;
    userId: string;
    eventType: 'playbook_created' | 'playbook_updated' | 'playbook_viewed' | 'strategy_generated';
    resourceId: string;
    timestamp: string;
    metadata?: Record<string, any>;
}
