import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, UserRole } from '../types';

interface AuthContextType {
    user: User | null;
    login: (role: UserRole) => void;
    logout: () => void;
    updateProfile: (updates: Partial<User>) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: Record<UserRole, User> = {
    Admin: {
        id: 'u1',
        name: 'Admin User',
        email: 'admin@company.com',
        role: 'Admin',
        avatarUrl: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff'
    },
    Editor: {
        id: 'u2',
        name: 'Sarah Editor',
        email: 'sarah@company.com',
        role: 'Editor',
        departmentId: 'dept1',
        avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Editor&background=6b21a8&color=fff'
    },
    Viewer: {
        id: 'u3',
        name: 'John Viewer',
        email: 'john@company.com',
        role: 'Viewer',
        departmentId: 'dept2',
        avatarUrl: 'https://ui-avatars.com/api/?name=John+Viewer&background=10b981&color=fff'
    }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        // Load user from localStorage on mount
        const saved = localStorage.getItem('playbook_user');
        return saved ? JSON.parse(saved) : null;
    });

    // Persist user to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('playbook_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('playbook_user');
        }
    }, [user]);

    const login = (role: UserRole) => {
        // Simulate API call
        const mockUser = MOCK_USERS[role];
        setUser(mockUser);
    };

    const logout = () => {
        setUser(null);
    };

    const updateProfile = (updates: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...updates };
            setUser(updatedUser);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateProfile, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
