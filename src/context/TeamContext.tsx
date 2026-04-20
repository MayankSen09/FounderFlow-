import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Team, TeamMember, TeamSettings, TeamMemberRole } from '../types';

interface TeamContextType {
    currentTeam: Team | null;
    teams: Team[];
    teamMembers: TeamMember[];
    createTeam: (name: string) => Team;
    switchTeam: (teamId: string) => void;
    joinTeam: (inviteCode: string) => boolean;
    generateInviteCode: () => string;
    addTeamMember: (userId: string, role: TeamMemberRole) => void;
    removeTeamMember: (memberId: string) => void;
    updateMemberRole: (memberId: string, role: TeamMemberRole) => void;
    getTeamMembers: (teamId: string) => TeamMember[];
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

// Helper to generate 6-character invite code
const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

const DEFAULT_TEAM_SETTINGS: TeamSettings = {
    allowInvites: true,
    defaultMemberRole: 'Viewer'
};

export const TeamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [teams, setTeams] = useState<Team[]>(() => {
        const saved = localStorage.getItem('playbook_teams');
        if (saved) return JSON.parse(saved);

        // Create default personal workspace
        const defaultTeam: Team = {
            id: crypto.randomUUID(),
            name: 'Personal Workspace',
            inviteCode: generateCode(),
            ownerId: 'current-user', // Will be replaced with actual user ID
            createdAt: new Date().toISOString(),
            settings: DEFAULT_TEAM_SETTINGS
        };
        return [defaultTeam];
    });

    const [currentTeam, setCurrentTeam] = useState<Team | null>(() => {
        const savedId = localStorage.getItem('playbook_current_team_id');
        if (savedId) {
            const team = teams.find(t => t.id === savedId);
            return team || teams[0];
        }
        return teams[0];
    });

    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
        const saved = localStorage.getItem('playbook_team_members');
        return saved ? JSON.parse(saved) : [];
    });

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('playbook_teams', JSON.stringify(teams));
    }, [teams]);

    useEffect(() => {
        localStorage.setItem('playbook_team_members', JSON.stringify(teamMembers));
    }, [teamMembers]);

    useEffect(() => {
        if (currentTeam) {
            localStorage.setItem('playbook_current_team_id', currentTeam.id);
        }
    }, [currentTeam]);

    const createTeam = (name: string): Team => {
        const newTeam: Team = {
            id: crypto.randomUUID(),
            name,
            inviteCode: generateCode(),
            ownerId: 'current-user',
            createdAt: new Date().toISOString(),
            settings: DEFAULT_TEAM_SETTINGS
        };
        setTeams(prev => [...prev, newTeam]);
        setCurrentTeam(newTeam);

        // Add owner as team member
        const ownerMember: TeamMember = {
            id: crypto.randomUUID(),
            userId: 'current-user',
            teamId: newTeam.id,
            role: 'Owner',
            joinedAt: new Date().toISOString()
        };
        setTeamMembers(prev => [...prev, ownerMember]);

        return newTeam;
    };

    const switchTeam = (teamId: string) => {
        const team = teams.find(t => t.id === teamId);
        if (team) {
            setCurrentTeam(team);
        }
    };

    const joinTeam = (inviteCode: string): boolean => {
        const team = teams.find(t => t.inviteCode === inviteCode);
        if (!team) return false;

        // Check if already a member
        const existing = teamMembers.find(
            m => m.teamId === team.id && m.userId === 'current-user'
        );
        if (existing) {
            setCurrentTeam(team);
            return true;
        }

        // Add as new member
        const newMember: TeamMember = {
            id: crypto.randomUUID(),
            userId: 'current-user',
            teamId: team.id,
            role: team.settings.defaultMemberRole as TeamMemberRole,
            joinedAt: new Date().toISOString()
        };
        setTeamMembers(prev => [...prev, newMember]);
        setCurrentTeam(team);
        return true;
    };

    const generateInviteCode = (): string => {
        if (!currentTeam) return '';
        const newCode = generateCode();
        setTeams(prev => prev.map(t =>
            t.id === currentTeam.id ? { ...t, inviteCode: newCode } : t
        ));
        setCurrentTeam({ ...currentTeam, inviteCode: newCode });
        return newCode;
    };

    const addTeamMember = (userId: string, role: TeamMemberRole) => {
        if (!currentTeam) return;
        const newMember: TeamMember = {
            id: crypto.randomUUID(),
            userId,
            teamId: currentTeam.id,
            role,
            joinedAt: new Date().toISOString()
        };
        setTeamMembers(prev => [...prev, newMember]);
    };

    const removeTeamMember = (memberId: string) => {
        setTeamMembers(prev => prev.filter(m => m.id !== memberId));
    };

    const updateMemberRole = (memberId: string, role: TeamMemberRole) => {
        setTeamMembers(prev => prev.map(m =>
            m.id === memberId ? { ...m, role } : m
        ));
    };

    const getTeamMembers = (teamId: string): TeamMember[] => {
        return teamMembers.filter(m => m.teamId === teamId);
    };

    return (
        <TeamContext.Provider value={{
            currentTeam,
            teams,
            teamMembers,
            createTeam,
            switchTeam,
            joinTeam,
            generateInviteCode,
            addTeamMember,
            removeTeamMember,
            updateMemberRole,
            getTeamMembers
        }}>
            {children}
        </TeamContext.Provider>
    );
};

export const useTeam = () => {
    const context = useContext(TeamContext);
    if (!context) {
        throw new Error('useTeam must be used within a TeamProvider');
    }
    return context;
};
