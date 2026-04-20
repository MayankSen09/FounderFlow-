import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Playbook, Department } from '../types';

interface DataContextType {
    playbooks: Playbook[];
    departments: Department[];
    createPlaybook: (playbook: Partial<Playbook>) => void;
    updatePlaybook: (id: string, updates: Partial<Playbook>) => void;
    deletePlaybook: (id: string) => void;
    getPlaybook: (id: string) => Playbook | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const INITIAL_DEPARTMENTS: Department[] = [
    { id: 'dept1', name: 'Operations', description: 'Daily operational procedures' },
    { id: 'dept2', name: 'HR', description: 'Human Resources policies' },
    { id: 'dept3', name: 'IT', description: 'Technical support and security' },
    { id: 'dept4', name: 'Marketing', description: 'Brand and outreach strategies' },
];

const INITIAL_PlaybookS: Playbook[] = [
    {
        id: 'playbook1',
        title: 'New Employee Onboarding',
        departmentId: 'dept2',
        status: 'Approved', // Ensure string literal match
        currentVersion: 1,
        content: '<h2>Purpose</h2><p>To ensure smooth integration of new hires.</p><h2>Steps</h2><ol><li>Prepare workstation</li><li>Grant system access</li><li>Welcome meeting</li></ol>',
        createdBy: 'u2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'playbook2',
        title: 'Server Maintenance Protocol',
        departmentId: 'dept3',
        status: 'Draft',
        currentVersion: 0,
        content: '<h2>Purpose</h2><p>Weekly server health check.</p>',
        createdBy: 'u2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [playbooks, setSops] = useState<Playbook[]>(() => {
        const saved = localStorage.getItem('playbook_playbooks');
        return saved ? JSON.parse(saved) : INITIAL_PlaybookS;
    });

    const [departments] = useState<Department[]>(INITIAL_DEPARTMENTS);

    useEffect(() => {
        localStorage.setItem('playbook_playbooks', JSON.stringify(playbooks));
    }, [playbooks]);

    const createPlaybook = (playbookData: Partial<Playbook>) => {
        const newPlaybook: Playbook = {
            id: crypto.randomUUID(),
            title: playbookData.title || 'Untitled Playbook',
            departmentId: playbookData.departmentId || 'dept1',
            status: 'Draft',
            currentVersion: 1,
            content: playbookData.content || '',
            createdBy: playbookData.createdBy || 'unknown',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...playbookData
        };
        setSops(prev => [newPlaybook, ...prev]);
    };

    const updatePlaybook = (id: string, updates: Partial<Playbook>) => {
        setSops(prev => prev.map(playbook =>
            playbook.id === id ? { ...playbook, ...updates, updatedAt: new Date().toISOString() } : playbook
        ));
    };

    const deletePlaybook = (id: string) => {
        setSops(prev => prev.filter(playbook => playbook.id !== id));
    };

    const getPlaybook = (id: string) => playbooks.find(s => s.id === id);

    return (
        <DataContext.Provider value={{ playbooks, departments, createPlaybook, updatePlaybook, deletePlaybook, getPlaybook }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
