import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useFounder } from '../context/FounderContext';
import { useNavigate } from 'react-router-dom';
import {
    MessageCircle, BookOpen, DollarSign, Compass, Calculator,
    FileText, Layers, AlertTriangle, Trophy, TrendingUp,
    Clock, Zap, ArrowRight, Sparkles, Globe,
} from 'lucide-react';

export function Dashboard() {
    const { user } = useAuth();
    const { profile, journal, fundingRounds, chatHistory } = useFounder();
    const navigate = useNavigate();

    const runway = profile?.runway || 0;
    const burnRate = profile?.burnRate || 0;
    const mrr = profile?.mrr || 0;
    const recentMistakes = journal.filter(e => e.type === 'mistake').slice(0, 3);
    const recentWins = journal.filter(e => e.type === 'win').slice(0, 3);
    const activeRounds = fundingRounds.filter(r => r.status === 'active');
    const totalRaised = fundingRounds.reduce((s, r) => s + r.raisedAmount, 0);

    const quickActions = [
        { icon: MessageCircle, label: 'Ask AI Co-Founder', to: '/advisor', color: 'from-blue-500 to-cyan-500', desc: 'Get instant advice' },
        { icon: BookOpen, label: 'Log a Decision', to: '/journal', color: 'from-purple-500 to-pink-500', desc: 'Track your journey' },
        { icon: DollarSign, label: 'Track Funding', to: '/funding', color: 'from-emerald-500 to-teal-500', desc: 'Manage investors' },
        { icon: Globe, label: 'Explore Funding', to: '/directory', color: 'from-amber-500 to-orange-500', desc: 'Find grants & VCs' },
    ];

    const getRunwayColor = () => {
        if (runway <= 3) return 'text-red-500';
        if (runway <= 6) return 'text-amber-500';
        return 'text-emerald-500';
    };

    return (
        <div className="min-h-screen page-bg">
            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* Greeting */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                    <h1 className="text-3xl font-black tracking-tight mb-1">
                        {getGreeting()}, {user?.name?.split(' ')[0] || 'Founder'} 👋
                    </h1>
                    <p className="text-sm text-muted">
                        {profile ? `${profile.startupName} • ${profile.stage.replace('-', ' ').toUpperCase()} Stage` : 'Set up your startup profile in Settings to unlock full AI context.'}
                    </p>
                </motion.div>

                {/* Vital Stats */}
                {profile && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Runway', value: `${runway}`, unit: 'mo', color: getRunwayColor(), icon: Clock },
                            { label: 'Burn Rate', value: `$${(burnRate / 1000).toFixed(0)}k`, unit: '/mo', color: 'text-rose-500', icon: TrendingUp },
                            { label: 'MRR', value: `$${(mrr / 1000).toFixed(1)}k`, unit: '', color: 'text-brand-primary', icon: Zap },
                            { label: 'Total Raised', value: `$${(totalRaised / 1000).toFixed(0)}k`, unit: '', color: 'text-emerald-500', icon: DollarSign },
                        ].map(stat => (
                            <div key={stat.label} className="p-5 rounded-2xl card-bg border border-default">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted">{stat.label}</p>
                                    <stat.icon className="w-4 h-4 text-heading" />
                                </div>
                                <p className="text-3xl font-black text-heading">{stat.value}<span className="text-sm font-semibold ml-1 text-muted">{stat.unit}</span></p>
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* Quick Actions */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-4 gap-4 mb-8">
                    {quickActions.map((action) => (
                        <button
                            key={action.to}
                            onClick={() => navigate(action.to)}
                            className="group p-5 rounded-2xl card-bg border border-default hover:border-brand-primary/20 hover:shadow-lg hover:shadow-black/[0.03] dark:hover:shadow-black/20 hover:-translate-y-[1px] transition-all duration-200 text-left"
                        >
                            <div className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center mb-3 shadow-sm border border-default group-hover:scale-110 transition-transform">
                                <action.icon className="w-5 h-5 text-white dark:text-black" />
                            </div>
                            <p className="font-bold text-sm text-heading mb-0.5">{action.label}</p>
                            <p className="text-[11px] text-faint">{action.desc}</p>
                        </button>
                    ))}
                </motion.div>

                <div className="grid grid-cols-12 gap-6">
                    {/* Left column */}
                    <div className="col-span-8 space-y-6">
                        {/* Active Funding */}
                        {activeRounds.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="p-6 rounded-2xl card-bg border border-default">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-bold flex items-center gap-2 text-heading"><DollarSign className="w-4 h-4 text-emerald-500" /> Active Fundraising</h2>
                                    <button onClick={() => navigate('/funding')} className="text-xs text-brand-primary font-bold flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></button>
                                </div>
                                {activeRounds.map(round => {
                                    const progress = round.targetAmount > 0 ? (round.raisedAmount / round.targetAmount) * 100 : 0;
                                    return (
                                        <div key={round.id} className="p-4 rounded-xl stat-bg mb-3 last:mb-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold uppercase text-sm text-heading">{round.roundType}</span>
                                                <span className="text-xs text-muted">${round.raisedAmount.toLocaleString()} / ${round.targetAmount.toLocaleString()}</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
                                                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-brand-primary transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                                            </div>
                                            <p className="text-[11px] text-faint mt-2">{round.investors.length} investors tracked • {round.investors.filter(i => i.status === 'committed').length} committed</p>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        )}

                        {/* AI Suggestion */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-2xl bg-blue-50 dark:bg-brand-primary/5 border border-blue-100 dark:border-brand-primary/10">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-brand-primary/15 flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-5 h-5 text-brand-primary" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-sm mb-1 text-heading">AI Co-Founder Tip</h3>
                                    <p className="text-sm text-muted leading-relaxed">
                                        {runway > 0 && runway <= 3 ? `⚠️ Critical: You have ${runway} months of runway. Focus 100% on either revenue or fundraising.` :
                                         runway > 3 && runway <= 6 ? `Your runway of ${runway} months gives you a short window. Start fundraising conversations now.` :
                                         journal.length === 0 ? "Start logging your decisions in the Founder Journal. The more context I have, the better I can advise you." :
                                         recentMistakes.length > 0 ? `You've logged ${recentMistakes.length} recent mistake(s). Review them and extract one lesson to apply this week.` :
                                         "You're on track. Keep logging decisions and wins to build your founder knowledge base."}
                                    </p>
                                    <button onClick={() => navigate('/advisor')} className="mt-3 text-xs text-brand-primary font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                        Talk to your AI Co-Founder <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Tools */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="p-6 rounded-2xl card-bg border border-default">
                            <h2 className="font-bold mb-4 text-heading">Strategy & Ops Toolkit</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { icon: Calculator, label: 'Runway & Burn', desc: 'Financial projections', to: '/roi-calculator' },
                                    { icon: Compass, label: 'Strategy Matrix', desc: 'Founder frameworks', to: '/strategy' },
                                    { icon: FileText, label: 'Playbook Generator', desc: 'AI-powered Playbooks', to: '/advanced-playbook' },
                                    { icon: Layers, label: 'Growth Funnel', desc: 'Customer journey', to: '/funnel-builder' },
                                ].map(tool => (
                                    <button key={tool.to} onClick={() => navigate(tool.to)} className="flex items-center gap-3 p-4 rounded-xl stat-bg hover:card-bg-hover border border-transparent hover:border-default transition-all text-left group">
                                        <tool.icon className="w-5 h-5 text-muted group-hover:text-brand-primary transition-colors" />
                                        <div>
                                            <p className="text-sm font-bold text-heading">{tool.label}</p>
                                            <p className="text-[11px] text-faint">{tool.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right column */}
                    <div className="col-span-4 space-y-6">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="p-5 rounded-2xl card-bg border border-default">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-bold flex items-center gap-2 text-heading"><Trophy className="w-4 h-4 text-emerald-500" /> Recent Wins</h3>
                                <button onClick={() => navigate('/journal')} className="text-[10px] text-brand-primary font-bold">View All</button>
                            </div>
                            {recentWins.length === 0 ? (
                                <p className="text-xs text-faint italic">No wins logged yet. Celebrate your progress!</p>
                            ) : (
                                <div className="space-y-2">
                                    {recentWins.map(w => (
                                        <div key={w.id} className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10">
                                            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{w.title}</p>
                                            <p className="text-[10px] text-muted mt-0.5">{new Date(w.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-5 rounded-2xl card-bg border border-default">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-bold flex items-center gap-2 text-heading"><AlertTriangle className="w-4 h-4 text-amber-500" /> Watch Out</h3>
                            </div>
                            {recentMistakes.length === 0 ? (
                                <p className="text-xs text-faint italic">No mistakes logged. Log them to avoid repeating them.</p>
                            ) : (
                                <div className="space-y-2">
                                    {recentMistakes.map(m => (
                                        <div key={m.id} className="p-3 rounded-lg bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10">
                                            <p className="text-xs font-bold text-amber-600 dark:text-amber-400">{m.title}</p>
                                            <p className="text-[10px] text-muted mt-0.5 line-clamp-2">{m.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="p-5 rounded-2xl card-bg border border-default">
                            <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-heading"><BookOpen className="w-4 h-4 text-purple-500" /> Journal Stats</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 rounded-lg stat-bg text-center">
                                    <p className="text-xl font-black text-heading">{journal.length}</p>
                                    <p className="text-[10px] text-faint font-bold">Entries</p>
                                </div>
                                <div className="p-3 rounded-lg stat-bg text-center">
                                    <p className="text-xl font-black text-heading">{chatHistory.length}</p>
                                    <p className="text-[10px] text-faint font-bold">AI Chats</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}
