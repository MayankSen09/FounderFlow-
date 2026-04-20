import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    MessageCircle,
    BookOpen,
    DollarSign,
    Compass,
    Calculator,
    FileText,
    Layers,
    Settings,
    Layers as LogoIcon,
    LogOut,
    TrendingUp,
    Globe,
    PieChart,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navSections = [
    {
        label: 'Co-Founder',
        items: [
            { to: '/dashboard', icon: LayoutDashboard, label: 'Command Center' },
            { to: '/advisor', icon: MessageCircle, label: 'AI Co-Founder' },
            { to: '/journal', icon: BookOpen, label: 'Founder Journal' },
            { to: '/funding', icon: DollarSign, label: 'Funding Tracker' },
        ],
    },
    {
        label: 'Discover',
        items: [
            { to: '/trends', icon: TrendingUp, label: 'Trends & News' },
            { to: '/directory', icon: Globe, label: 'Funding Directory' },
        ],
    },
    {
        label: 'Strategy & Ops',
        items: [
            { to: '/strategy', icon: Compass, label: 'Strategy Matrix' },
            { to: '/advanced-playbook', icon: FileText, label: 'Playbook Generator' },
            { to: '/funnel-builder', icon: Layers, label: 'Growth Funnel' },
            { to: '/cap-table', icon: PieChart, label: 'Cap Table Simulator' },
        ],
    },
];

export function Sidebar() {
    const { logout } = useAuth();
    const location = useLocation();

    return (
        <aside className="fixed left-0 top-0 h-full w-64 sidebar-bg border-r border-default flex flex-col z-50">
            {/* Brand */}
            <div className="px-6 py-5 border-b border-default">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-black dark:bg-white flex items-center justify-center shadow-sm border border-default">
                        <LogoIcon className="w-5 h-5 text-white dark:text-black" />
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-tight text-heading">FounderFlow</h1>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-faint">AI Co-Founder</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-5 space-y-5 overflow-y-auto">
                {navSections.map((section) => (
                    <div key={section.label}>
                        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-faint">
                            {section.label}
                        </p>
                        <div className="space-y-0.5">
                            {section.items.map((item) => {
                                const isActive = location.pathname === item.to;
                                return (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                                            isActive
                                                ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
                                                : 'text-muted hover:text-heading hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
                                        }`}
                                    >
                                        <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-brand-primary' : 'text-muted group-hover:text-heading'}`} />
                                        <span className="truncate">{item.label}</span>
                                        {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(79,172,254,0.6)]" />}
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="px-3 py-4 border-t border-default space-y-1">
                <NavLink
                    to="/settings"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        location.pathname === '/settings'
                            ? 'bg-brand-primary/10 text-brand-primary'
                            : 'text-muted hover:text-heading hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                </NavLink>
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-red-500 hover:bg-red-500/5 transition-all w-full"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
