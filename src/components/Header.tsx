import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search } from 'lucide-react';

export const Header: React.FC = () => {
    const { user, login } = useAuth();

    return (
        <header className="h-16 border-b border-border bg-card/50 glass px-6 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search Playbooks..."
                        className="w-full pl-10 pr-4 py-2 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 rounded-full hover:bg-secondary/10 text-muted-foreground transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-border">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium">{user?.name || 'Guest'}</p>
                        <p className="text-xs text-muted-foreground">{user?.role || 'Select Role'}</p>
                    </div>

                    <div className="relative group">
                        <img
                            src={user?.avatarUrl || 'https://ui-avatars.com/api/?name=Guest'}
                            alt="Profile"
                            className="w-9 h-9 rounded-full border border-border cursor-pointer hover:ring-2 ring-primary/20 transition-all"
                        />
                        {/* Quick Role Switcher for Demo */}
                        <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-xl p-2 hidden group-hover:block animate-in fade-in zoom-in-95 z-50">
                            <div className="text-xs text-muted-foreground px-2 py-1 mb-1">Switch Role (Demo)</div>
                            {['Admin', 'Editor', 'Viewer'].map((role) => (
                                <button
                                    key={role}
                                    // @ts-ignore
                                    onClick={() => login(role)}
                                    className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-primary/10 ${user?.role === role ? 'text-primary font-medium' : ''}`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
