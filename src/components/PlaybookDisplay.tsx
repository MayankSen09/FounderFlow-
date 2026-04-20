import { Shield, Users, Settings, FileText, AlertTriangle, CheckCircle2, TrendingUp, Book } from 'lucide-react';

interface PlaybookDisplayProps {
    content: any;
}

export function PlaybookDisplay({ content }: PlaybookDisplayProps) {
    if (!content) return null;

    return (
        <div className="space-y-8 text-left">
            {/* Header Section */}
            <div className="border-b border-architect-border/30 pb-8">
                <h1 className="text-4xl font-black text-primary uppercase tracking-tight mb-4">
                    {content.title}
                </h1>

                {content.purpose && (
                    <div className="flex gap-3 items-start p-6 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                        <FileText className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">Purpose</h3>
                            <p className="text-sm text-secondary dark:text-slate-300 leading-relaxed">{content.purpose}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Scope & Audience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.scope && (
                    <div className="p-6 bg-surface dark:bg-architect-card rounded-2xl border border-default dark:border-architect-border">
                        <h3 className="text-xs font-black text-brand-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Scope
                        </h3>
                        <p className="text-sm text-secondary dark:text-slate-300 leading-relaxed">{content.scope}</p>
                    </div>
                )}

                {content.audience && (
                    <div className="p-6 bg-surface dark:bg-architect-card rounded-2xl border border-default dark:border-architect-border">
                        <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Audience
                        </h3>
                        <p className="text-sm text-secondary dark:text-slate-300 leading-relaxed">{content.audience}</p>
                    </div>
                )}
            </div>

            {/* Steps/Procedures */}
            {content.steps && content.steps.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-black text-primary uppercase tracking-tight flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        Procedures
                    </h2>
                    <div className="space-y-4">
                        {content.steps.map((step: string, idx: number) => (
                            <div
                                key={idx}
                                className="p-6 bg-surface dark:bg-architect-card rounded-2xl border border-default dark:border-architect-border hover:border-brand-primary/50 transition-all group"
                            >
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-black border-2 border-brand-primary/30">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-primary dark:text-white leading-relaxed font-medium">
                                            {step.replace(/^STEP \d+:\s*/i, '')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Responsible Parties */}
            {content.responsibleParties && content.responsibleParties.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-black text-primary uppercase tracking-tight flex items-center gap-3">
                        <Users className="w-6 h-6 text-purple-500" />
                        Responsible Parties
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {content.responsibleParties.map((party: any, idx: number) => (
                            <div key={idx} className="p-6 bg-surface dark:bg-architect-card rounded-2xl border border-default dark:border-architect-border">
                                <h3 className="text-sm font-black text-primary uppercase mb-3">{party.role}</h3>
                                {party.responsibilities && (
                                    <ul className="space-y-2 mb-4">
                                        {party.responsibilities.map((resp: string, i: number) => (
                                            <li key={i} className="text-xs text-secondary dark:text-slate-300 flex items-start gap-2">
                                                <span className="text-brand-primary mt-1">•</span>
                                                <span>{resp}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {party.authority && (
                                    <p className="text-xs text-emerald-500 font-bold">Authority: {party.authority}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tools Required */}
            {content.toolsRequired && content.toolsRequired.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-black text-primary uppercase tracking-tight flex items-center gap-3">
                        <Settings className="w-6 h-6 text-blue-500" />
                        Tools & Resources
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {content.toolsRequired.map((tool: any, idx: number) => (
                            <div key={idx} className="p-6 bg-surface dark:bg-architect-card rounded-xl border border-default dark:border-architect-border">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-sm font-black text-primary mb-2">{tool.name}</h3>
                                        <p className="text-xs text-secondary dark:text-slate-300 mb-2">{tool.purpose}</p>
                                        <p className="text-xs text-blue-400 font-bold">Access: {tool.accessLevel}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* KPIs */}
            {content.kpis && content.kpis.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-black text-primary uppercase tracking-tight flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-emerald-500" />
                        Key Performance Indicators
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {content.kpis.map((kpi: any, idx: number) => (
                            <div key={idx} className="p-6 bg-surface dark:bg-architect-card rounded-xl border border-default dark:border-architect-border">
                                <h3 className="text-sm font-black text-emerald-500 mb-2">{kpi.metric}</h3>
                                <p className="text-xl font-black text-primary mb-2">{kpi.target}</p>
                                <p className="text-xs text-secondary dark:text-slate-300">{kpi.measurement}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Compliance */}
            {content.compliance && content.compliance.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-black text-primary uppercase tracking-tight flex items-center gap-3">
                        <Shield className="w-6 h-6 text-amber-500" />
                        Compliance Requirements
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {content.compliance.map((item: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-3 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                                <Shield className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-secondary dark:text-slate-300 font-medium">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Common Errors */}
            {content.commonErrors && content.commonErrors.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-black text-primary uppercase tracking-tight flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 text-rose-500" />
                        Common Errors & Prevention
                    </h2>
                    <div className="space-y-4">
                        {content.commonErrors.map((error: any, idx: number) => (
                            <div key={idx} className="p-6 bg-surface dark:bg-architect-card rounded-xl border border-default dark:border-architect-border">
                                <h3 className="text-sm font-black text-rose-500 mb-3">{error.error}</h3>
                                <div className="space-y-3 text-xs text-secondary dark:text-slate-300">
                                    <div>
                                        <span className="font-bold text-amber-500">Consequences:</span> {error.consequences}
                                    </div>
                                    <div>
                                        <span className="font-bold text-blue-500">Prevention:</span> {error.prevention}
                                    </div>
                                    <div>
                                        <span className="font-bold text-emerald-500">Resolution:</span> {error.resolution}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Related Documents */}
            {content.relatedDocuments && content.relatedDocuments.length > 0 && (
                <div className="p-6 bg-surface dark:bg-architect-card rounded-xl border border-default dark:border-architect-border">
                    <h3 className="text-xs font-black text-brand-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Book className="w-4 h-4" />
                        Related Documents
                    </h3>
                    <ul className="space-y-2">
                        {content.relatedDocuments.map((doc: string, idx: number) => (
                            <li key={idx} className="text-sm text-secondary dark:text-slate-300 flex items-center gap-2">
                                <span className="text-brand-primary">→</span>
                                {doc}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Revision History */}
            {content.revisionHistory && (
                <div className="p-6 bg-surface dark:bg-architect-card rounded-xl border border-default dark:border-architect-border">
                    <h3 className="text-xs font-black text-tertiary uppercase tracking-widest mb-3">Revision History</h3>
                    <div className="text-xs text-secondary dark:text-slate-300 space-y-1">
                        <p><span className="font-bold">Version:</span> {content.revisionHistory.version}</p>
                        <p><span className="font-bold">Date:</span> {content.revisionHistory.date}</p>
                        <p><span className="font-bold">Author:</span> {content.revisionHistory.author}</p>
                        <p><span className="font-bold">Changes:</span> {content.revisionHistory.changes}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
