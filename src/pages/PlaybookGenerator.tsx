import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Sparkles,
    Download,
    Save,
    Loader2,
    CheckCircle2,
    ChevronRight,
    BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Playbook_TEMPLATES, type PlaybookTemplate } from '../lib/playbookTemplates';
import { generateAdvancedPlaybook } from '../lib/ai';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import ReactMarkdown from 'react-markdown';

interface FormData {
    title: string;
    industry: string;
    [key: string]: any;
}

export default function AdvancedPlaybookGenerator() {
    const navigate = useNavigate();
    const { createPlaybook } = useData();
    const { success, error: showError } = useToast();

    const [step, setStep] = useState<'template' | 'customize' | 'generating' | 'preview'>('template');
    const [selectedTemplate, setSelectedTemplate] = useState<PlaybookTemplate | null>(null);
    const [formData, setFormData] = useState<FormData>({ title: '', industry: '' });
    const [generatedPlaybook, setGeneratedPlaybook] = useState<any>(null);
    const [generationProgress, setGenerationProgress] = useState(0);

    // Reset everything
    const handleReset = () => {
        setStep('template');
        setSelectedTemplate(null);
        setFormData({ title: '', industry: '' });
        setGeneratedPlaybook(null);
        setGenerationProgress(0);
    };

    // Select template
    const handleTemplateSelect = (template: PlaybookTemplate) => {
        setSelectedTemplate(template);
        setFormData({
            title: '',
            industry: template.industry[0] || '',
            ...template.parameters.reduce((acc, param) => ({
                ...acc,
                [param.id]: param.defaultValue || ''
            }), {})
        });
        setStep('customize');
    };

    // Generate Playbook
    const handleGenerate = async () => {
        if (!selectedTemplate || !formData.title || !formData.industry) {
            showError('Please fill in all required fields');
            return;
        }

        setStep('generating');
        setGenerationProgress(0);

        // Simulate progress animation
        const progressInterval = setInterval(() => {
            setGenerationProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 500);

        try {
            const result = await generateAdvancedPlaybook(
                selectedTemplate.id,
                formData.title,
                formData.industry,
                formData
            );

            setGenerationProgress(100);
            setTimeout(() => {
                setGeneratedPlaybook(result);
                setStep('preview');
                success('Playbook Generated Successfully!');
            }, 500);

        } catch (err: any) {
            console.error('Generation error:', err);
            showError(err.message || 'Failed to generate Playbook');
            setStep('customize');
        } finally {
            clearInterval(progressInterval);
        }
    };

    // Save to library
    const handleSave = () => {
        if (!generatedPlaybook) return;

        createPlaybook({
            title: generatedPlaybook.title,
            departmentId: selectedTemplate?.category || 'General',
            status: 'Draft',
            content: generatedPlaybook.content,
            createdBy: 'Advanced Playbook Generator'
        });

        success('Playbook saved to library!');
        navigate('/playbooks');
    };

    // Export as Markdown
    const handleExportMarkdown = () => {
        if (!generatedPlaybook) return;

        const blob = new Blob([generatedPlaybook.content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${generatedPlaybook.title.replace(/[^a-z0-9]/gi, '_')}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        success('Markdown file downloaded!');
    };

    // Export as PDF
    const handleExportPDF = () => {
        if (!generatedPlaybook) return;

        import('../lib/pdfExport').then(({ generatePlaybookPDF }) => {
            // Convert markdown to simple structure for PDF
            const pdfData = {
                title: generatedPlaybook.title,
                content: generatedPlaybook.content
            };
            const doc = generatePlaybookPDF(pdfData.title, pdfData.content);
            doc.save(`${generatedPlaybook.title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
            success('PDF exported successfully!');
        }).catch(err => {
            console.error('PDF export failed:', err);
            showError('Failed to export PDF');
        });
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 pb-20">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <div className="flex items-center justify-center gap-3">
                    <BookOpen className="w-10 h-10 text-brand-primary" />
                    <h1 className="text-5xl font-black text-primary tracking-tight">
                        Founder <span className="architect-gradient">Playbook Generator</span>
                    </h1>
                </div>
                <p className="text-tertiary font-medium text-lg max-w-2xl mx-auto">
                    Generate elite startup playbooks and standard operating procedures to scale your operations rapidly.
                </p>
            </motion.div>

            {/* Progress Indicator */}
            {step !== 'template' && (
                <div className="flex items-center justify-center gap-4">
                    <StepIndicator
                        number={1}
                        label="Template"
                        active={false}
                        completed={true}
                    />
                    <div className="w-16 h-0.5 bg-architect-border" />
                    <StepIndicator
                        number={2}
                        label="Customize"
                        active={step === 'customize'}
                        completed={step === 'generating' || step === 'preview'}
                    />
                    <div className="w-16 h-0.5 bg-architect-border" />
                    <StepIndicator
                        number={3}
                        label="Generate"
                        active={step === 'generating'}
                        completed={step === 'preview'}
                    />
                    <div className="w-16 h-0.5 bg-architect-border" />
                    <StepIndicator
                        number={4}
                        label="Preview"
                        active={step === 'preview'}
                        completed={false}
                    />
                </div>
            )}

            <AnimatePresence mode="wait">
                {/* STEP 1: Template Selection */}
                {step === 'template' && (
                    <motion.div
                        key="template-selection"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Playbook_TEMPLATES.map((template) => (
                                <TemplateCard
                                    key={template.id}
                                    template={template}
                                    onSelect={() => handleTemplateSelect(template)}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* STEP 2: Customization Form */}
                {step === 'customize' && selectedTemplate && (
                    <motion.div
                        key="customization"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-3xl mx-auto"
                    >
                        <Card className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl">{selectedTemplate.icon}</div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-primary">{selectedTemplate.name}</h2>
                                        <p className="text-sm text-tertiary">{selectedTemplate.description}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    icon={ArrowLeft}
                                    onClick={() => setStep('template')}
                                    className="text-xs font-bold"
                                >
                                    Back
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {/* Playbook Title */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-secondary uppercase tracking-wider">
                                        Playbook Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-architect-dark/50 border border-slate-200 dark:border-architect-border text-slate-900 dark:text-white focus:border-brand-primary outline-none transition-colors font-medium"
                                        placeholder="e.g., Social Media Operations Guide"
                                    />
                                </div>

                                {/* Industry */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-secondary uppercase tracking-wider">
                                        Industry *
                                    </label>
                                    <select
                                        value={formData.industry}
                                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                        className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-architect-dark/50 border border-slate-200 dark:border-architect-border text-slate-900 dark:text-white focus:border-brand-primary outline-none transition-colors font-medium"
                                    >
                                        <option value="">Select Industry</option>
                                        {selectedTemplate.industry.map((ind) => (
                                            <option key={ind} value={ind}>{ind}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Template-specific parameters */}
                                {selectedTemplate.parameters.map((param) => (
                                    <div key={param.id} className="space-y-2">
                                        <label className="text-xs font-bold text-secondary uppercase tracking-wider">
                                            {param.label} {param.required && '*'}
                                        </label>

                                        {param.type === 'text' && (
                                            <input
                                                type="text"
                                                value={formData[param.id] || ''}
                                                onChange={(e) => setFormData({ ...formData, [param.id]: e.target.value })}
                                                className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-architect-dark/50 border border-slate-200 dark:border-architect-border text-slate-900 dark:text-white focus:border-brand-primary outline-none transition-colors font-medium"
                                                placeholder={param.placeholder}
                                            />
                                        )}

                                        {param.type === 'textarea' && (
                                            <textarea
                                                value={formData[param.id] || ''}
                                                onChange={(e) => setFormData({ ...formData, [param.id]: e.target.value })}
                                                className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-architect-dark/50 border border-slate-200 dark:border-architect-border text-slate-900 dark:text-white focus:border-brand-primary outline-none transition-colors font-medium min-h-[120px]"
                                                placeholder={param.placeholder}
                                            />
                                        )}

                                        {param.type === 'select' && param.options && (
                                            <select
                                                value={formData[param.id] || ''}
                                                onChange={(e) => setFormData({ ...formData, [param.id]: e.target.value })}
                                                className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-architect-dark/50 border border-slate-200 dark:border-architect-border text-slate-900 dark:text-white focus:border-brand-primary outline-none transition-colors font-medium"
                                            >
                                                <option value="">Select {param.label}</option>
                                                {param.options.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        )}

                                        {param.type === 'multiselect' && param.options && (
                                            <select
                                                multiple
                                                value={Array.isArray(formData[param.id]) ? formData[param.id] : []}
                                                onChange={(e) => {
                                                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                                                    setFormData({ ...formData, [param.id]: selected });
                                                }}
                                                className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-architect-dark/50 border border-slate-200 dark:border-architect-border text-slate-900 dark:text-white focus:border-brand-primary outline-none transition-colors font-medium min-h-[120px]"
                                            >
                                                {param.options.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                ))}

                                <Button
                                    variant="gradient"
                                    icon={Sparkles}
                                    onClick={handleGenerate}
                                    className="w-full py-6 text-lg font-black uppercase tracking-wider rounded-2xl mt-8"
                                >
                                    Generate Playbook
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* STEP 3: Generating */}
                {step === 'generating' && (
                    <motion.div
                        key="generating"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="max-w-2xl mx-auto"
                    >
                        <Card className="p-12 text-center space-y-8">
                            <div className="flex justify-center">
                                <div className="relative">
                                    <Loader2 className="w-16 h-16 text-brand-primary animate-spin" />
                                    <Sparkles className="w-6 h-6 text-yellow-400 absolute top-0 right-0 animate-pulse" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-3xl font-black text-primary">
                                    Generating Your Playbook...
                                </h2>
                                <div className="space-y-2">
                                    {generationProgress < 30 && (
                                        <p className="text-tertiary font-medium animate-pulse">
                                            🔍 Researching {formData.industry} best practices...
                                        </p>
                                    )}
                                    {generationProgress >= 30 && generationProgress < 60 && (
                                        <p className="text-tertiary font-medium animate-pulse">
                                            📝 Creating comprehensive phase structures...
                                        </p>
                                    )}
                                    {generationProgress >= 60 && generationProgress < 90 && (
                                        <p className="text-tertiary font-medium animate-pulse">
                                            ✨ Formatting tables, checklists, and procedures...
                                        </p>
                                    )}
                                    {generationProgress >= 90 && (
                                        <p className="text-tertiary font-medium animate-pulse">
                                            🎯 Finalizing your professional Playbook...
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-architect-border rounded-full h-3 overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${generationProgress}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                            <p className="text-sm font-bold text-brand-primary">
                                {generationProgress}% Complete
                            </p>
                        </Card>
                    </motion.div>
                )}

                {/* STEP 4: Preview */}
                {step === 'preview' && generatedPlaybook && (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="p-0 overflow-hidden">
                            {/* Header */}
                            <div className="p-8 bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <CheckCircle2 className="w-10 h-10" />
                                        <div>
                                            <h2 className="text-3xl font-black">Playbook Generated Successfully!</h2>
                                            <p className="text-white/80 font-medium mt-1">
                                                {generatedPlaybook.metadata.wordCount} words • Version {generatedPlaybook.metadata.version}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            variant="secondary"
                                            icon={Download}
                                            onClick={handleExportMarkdown}
                                            className="font-bold text-xs"
                                        >
                                            Markdown
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            icon={Download}
                                            onClick={handleExportPDF}
                                            className="font-bold text-xs"
                                        >
                                            PDF
                                        </Button>
                                        <Button
                                            variant="primary"
                                            icon={Save}
                                            onClick={handleSave}
                                            className="font-bold text-xs bg-white text-brand-primary hover:bg-white/90"
                                        >
                                            Save to Library
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Playbook Content */}
                            <div className="p-12 bg-white dark:bg-architect-dark">
                                <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-black prose-h1:text-4xl prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-xl prose-p:text-base prose-p:leading-relaxed prose-strong:text-brand-primary prose-table:border-collapse prose-th:bg-slate-100 dark:prose-th:bg-architect-card prose-th:p-4 prose-td:p-4 prose-td:border prose-td:border-slate-200 dark:prose-td:border-architect-border">
                                    <ReactMarkdown>{generatedPlaybook.content}</ReactMarkdown>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 border-t border-architect-border bg-slate-50 dark:bg-architect-card flex justify-center gap-4">
                                <button
                                    onClick={handleReset}
                                    className="text-sm font-bold text-tertiary hover:text-primary transition-colors uppercase tracking-wider"
                                >
                                    Create Another Playbook
                                </button>
                                <span className="text-architect-border">•</span>
                                <button
                                    onClick={() => navigate('/playbooks')}
                                    className="text-sm font-bold text-tertiary hover:text-primary transition-colors uppercase tracking-wider"
                                >
                                    View All Playbooks
                                </button>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Template Card Component
function TemplateCard({ template, onSelect }: { template: PlaybookTemplate; onSelect: () => void }) {
    return (
        <motion.button
            onClick={onSelect}
            className="group relative p-8 rounded-3xl bg-surface dark:bg-architect-card border border-default dark:border-architect-border hover:border-brand-primary transition-all duration-500 text-left shadow-lg overflow-hidden"
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Gradient glow on hover */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary opacity-0 group-hover:opacity-10 blur-[100px] transition-opacity" />

            <div className="relative z-10 space-y-4">
                {/* Icon */}
                <div className="text-5xl group-hover:scale-110 transition-transform duration-500">
                    {template.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-black text-primary uppercase tracking-tight">
                    {template.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-tertiary font-medium line-clamp-2 leading-relaxed">
                    {template.description}
                </p>

                {/* Metadata */}
                <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-black uppercase tracking-wider">
                        {template.category}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-architect-dark text-architect-muted text-xs font-black uppercase tracking-wider">
                        {template.estimatedPhases} Phases
                    </span>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 text-xs font-black text-brand-primary uppercase tracking-wider pt-2 group-hover:translate-x-2 transition-transform">
                    Use Template <ChevronRight className="w-4 h-4" />
                </div>
            </div>
        </motion.button>
    );
}

// Step Indicator Component
function StepIndicator({ number, label, active, completed }: { number: number; label: string; active: boolean; completed: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <div className={`
                w-10 h-10 rounded-full border-2 flex items-center justify-center font-black text-sm transition-all duration-300
                ${completed ? 'bg-brand-primary border-brand-primary text-white' :
                    active ? 'border-brand-primary text-brand-primary scale-110' :
                        'border-architect-border text-architect-muted'}
            `}>
                {completed ? <CheckCircle2 className="w-5 h-5" /> : number}
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${active || completed ? 'text-primary' : 'text-tertiary'}`}>
                {label}
            </span>
        </div>
    );
}
