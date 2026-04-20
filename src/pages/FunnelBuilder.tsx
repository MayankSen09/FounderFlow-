import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { FUNNEL_TEMPLATES, INDUSTRIES, GOALS, type FunnelType, type Industry, type FunnelGoal } from '../lib/funnelTypes';
import { getSmartQuestions, validateAnswers, type FunnelQuestion } from '../lib/funnelQuestions';
import { FunnelStack } from '../components/FunnelBuilder/FunnelStack';
import { StrategyCoach } from '../components/FunnelBuilder/StrategyCoach';
import { FunnelSimulator } from '../components/FunnelBuilder/FunnelSimulator';
import { generateMarketingFunnel } from '../lib/ai';
import { Button } from '../components/ui/Button';
import { Sparkles, ArrowLeft, Check, Loader2, ChevronRight, Briefcase, Target, Layers, Calculator, Info, TrendingUp } from 'lucide-react';
import { RoadmapDetailsModal } from '../components/FunnelBuilder/RoadmapDetailsModal';

type Step = 'type' | 'industry' | 'goal' | 'questions' | 'generating' | 'preview';

export default function FunnelBuilder() {
    const navigate = useNavigate();
    const { createPlaybook } = useData();
    const { success, error: showError } = useToast();

    const [currentStep, setCurrentStep] = useState<Step>('type');
    const [selectedType, setSelectedType] = useState<FunnelType | null>(null);
    const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
    const [selectedGoal, setSelectedGoal] = useState<FunnelGoal | null>(null);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [questions, setQuestions] = useState<FunnelQuestion[]>([]);
    const [generatedFunnel, setGeneratedFunnel] = useState<any>(null);
    const [simulationData, setSimulationData] = useState<any>(null);
    const [activeStage, setActiveStage] = useState<any>(null);
    const [openRoadmapData, setOpenRoadmapData] = useState<any>(null);

    const changeStep = (step: Step) => {
        setCurrentStep(step);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleRestart = () => {
        setSelectedType(null);
        setSelectedIndustry(null);
        setSelectedGoal(null);
        setAnswers({});
        setGeneratedFunnel(null);
        changeStep('type');
    };

    const handleTypeSelect = (type: FunnelType) => {
        setSelectedType(type);
        changeStep('industry');
    };

    const handleIndustrySelect = (industry: Industry) => {
        setSelectedIndustry(industry);
        changeStep('goal');
    };

    const handleGoalSelect = (goal: FunnelGoal) => {
        setSelectedGoal(goal);
        if (selectedType && selectedIndustry) {
            const smartQuestions = getSmartQuestions(selectedType, selectedIndustry, goal);
            setQuestions(smartQuestions);
            changeStep('questions');
        }
    };

    const handleAnswerChange = (questionId: string, value: any) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleGenerate = async () => {
        if (!selectedType || !selectedIndustry || !selectedGoal) return;

        const validation = validateAnswers(answers, questions);
        if (!validation.isValid) {
            showError(validation.errors[0]);
            return;
        }

        changeStep('generating');

        try {
            const template = FUNNEL_TEMPLATES[selectedType];
            const result = await generateMarketingFunnel(
                template.name,
                INDUSTRIES[selectedIndustry].name,
                GOALS[selectedGoal].name,
                answers,
                template.stages
            );

            const funnelData = {
                ...result,
                template,
                type: selectedType,
                industry: selectedIndustry,
                goal: selectedGoal,
            };
            setGeneratedFunnel(funnelData);
            if (funnelData.stages?.[0] || funnelData.template?.stages?.[0]) {
                setActiveStage(funnelData.stages?.[0] || funnelData.template.stages[0]);
            }

            changeStep('preview');
            success('Funnel strategy generated successfully.');
        } catch (err: any) {
            showError(err.message || 'Failed to generate funnel');
            changeStep('questions');
        }
    };

    const handleSave = () => {
        if (!generatedFunnel) return;

        const playbookContent = JSON.stringify({
            funnelType: 'Marketing Funnel',
            ...generatedFunnel,
            stages: generatedFunnel.stages || generatedFunnel.template.stages
        });

        createPlaybook({
            title: `${generatedFunnel.template.name} System - ${INDUSTRIES[generatedFunnel.industry as Industry].name}`,
            departmentId: '1',
            content: playbookContent,
            status: 'Draft',
            currentVersion: 1,
            createdBy: 'architect',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: ['Architect', 'Strategy', 'Neural']
        });

        success('Architecture committed to ledger.');
        navigate('/playbooks');
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-architect-dark text-slate-900 dark:text-white selection:bg-brand-primary/30 relative overflow-x-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-brand-primary/10 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-brand-secondary/10 blur-[150px] rounded-full" />
                <div className="absolute inset-0 bg-white/40 dark:bg-architect-dark/40 mix-blend-overlay" />
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                {/* Global Brand Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 flex flex-col items-center"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 dark:bg-architect-card/50 border border-slate-200 dark:border-white/10 backdrop-blur-md mb-8 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-600 dark:text-slate-300">Marketing Lab</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter mb-6 text-center">
                        Funnel <span className="architect-gradient">Architect</span>
                    </h1>
                    <p className="text-slate-600 dark:text-architect-muted text-xl max-w-2xl text-center leading-relaxed font-medium">
                        Deploy advanced customer acquisition systems powered by AI strategies.
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {currentStep === 'type' && (
                        <motion.div
                            key="type"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="w-full"
                        >
                            <div className="flex items-center gap-3 mb-10 justify-center">
                                <Layers className="w-6 h-6 text-brand-primary" />
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Select Funnel Type</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {Object.values(FUNNEL_TEMPLATES).map(template => (
                                    <button
                                        key={template.id}
                                        onClick={() => handleTypeSelect(template.id)}
                                        className="group relative p-10 rounded-[2.5rem] bg-white dark:bg-architect-card border border-slate-200 dark:border-architect-border hover:border-brand-primary/40 transition-all duration-500 text-left overflow-hidden shadow-xl hover:shadow-2xl dark:shadow-none"
                                    >
                                        <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0 translate-x-4">
                                            <ChevronRight className="w-6 h-6 text-brand-primary" />
                                        </div>
                                        <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-500 origin-left">
                                            {template.icon}
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter group-hover:architect-gradient transition-all">
                                            {template.name}
                                        </h3>
                                        <p className="text-slate-500 dark:text-architect-muted leading-relaxed mb-6 font-medium">
                                            {template.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {template.bestFor.map(tag => (
                                                <span key={tag} className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-architect-dark/50 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-architect-border group-hover:border-brand-primary/20 transition-colors">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 'industry' && (
                        <motion.div
                            key="industry"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="w-full max-w-5xl mx-auto"
                        >
                            <button onClick={() => changeStep('type')} className="group mb-12 flex items-center gap-3 text-architect-muted hover:text-white transition-colors">
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                                <span className="text-xs font-bold uppercase tracking-wider">Back</span>
                            </button>
                            <div className="flex items-center gap-4 mb-10">
                                <Briefcase className="w-8 h-8 text-brand-primary" />
                                <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Select Industry</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Object.entries(INDUSTRIES).map(([key, value]) => (
                                    <button
                                        key={key}
                                        onClick={() => handleIndustrySelect(key as Industry)}
                                        className="p-8 rounded-3xl bg-white dark:bg-architect-card border border-slate-200 dark:border-architect-border hover:border-brand-primary/40 transition-all text-left group hover:shadow-xl hover:shadow-brand-primary/5"
                                    >
                                        <div className="text-3xl mb-6 p-4 bg-slate-50 dark:bg-architect-dark rounded-2xl w-fit group-hover:bg-brand-primary/10 transition-colors">
                                            {value.icon}
                                        </div>
                                        <div className="font-black text-xl text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-brand-primary transition-colors">{value.name}</div>
                                        <div className="text-sm text-slate-500 dark:text-architect-muted leading-relaxed font-medium">{value.description}</div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 'goal' && (
                        <motion.div
                            key="goal"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="w-full max-w-4xl mx-auto"
                        >
                            <button onClick={() => changeStep('industry')} className="group mb-12 flex items-center gap-3 text-architect-muted hover:text-white transition-colors">
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                                <span className="text-xs font-bold uppercase tracking-wider">Back</span>
                            </button>
                            <div className="flex items-center gap-4 mb-10">
                                <Target className="w-8 h-8 text-brand-primary" />
                                <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Select Goal</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.entries(GOALS).map(([key, value]) => (
                                    <button
                                        key={key}
                                        onClick={() => handleGoalSelect(key as FunnelGoal)}
                                        className="p-10 rounded-[2.5rem] bg-white dark:bg-architect-card border border-slate-200 dark:border-architect-border hover:border-brand-secondary/40 transition-all text-left relative overflow-hidden group hover:shadow-xl dark:shadow-none"
                                    >
                                        <div className="text-4xl mb-8 group-hover:scale-110 transition-transform origin-left">
                                            {value.icon}
                                        </div>
                                        <div className="font-black text-2xl text-slate-900 dark:text-white mb-3 tracking-tighter group-hover:text-brand-secondary transition-colors">{value.name}</div>
                                        <div className="text-slate-500 dark:text-architect-muted leading-relaxed font-medium">{value.description}</div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 'questions' && (
                        <motion.div
                            key="questions"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="w-full max-w-3xl mx-auto"
                        >
                            <div className="text-center mb-12">
                                <div className="text-brand-primary text-xs font-bold tracking-wider uppercase mb-4">Details</div>
                                <h2 className="text-5xl font-bold text-slate-900 dark:text-white tracking-tight">Funnel Configuration</h2>
                            </div>
                            <div className="bg-white/80 dark:bg-architect-card/80 backdrop-blur-3xl rounded-[3rem] p-12 border border-slate-200 dark:border-architect-border shadow-2xl dark:shadow-3xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-12 opacity-10">
                                    <Sparkles className="w-12 h-12 text-brand-primary" />
                                </div>
                                <div className="space-y-12 mb-16">
                                    {questions.map((q, idx) => (
                                        <div key={q.id}>
                                            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-[0.1em]">
                                                <span className="text-slate-400 dark:text-architect-muted mr-3 font-mono opacity-50">/{idx + 1}</span>
                                                {q.question}
                                                {q.required && <span className="text-brand-primary ml-2 font-black">*</span>}
                                            </label>

                                            {q.type === 'radio' && q.options && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {q.options.map(opt => (
                                                        <label
                                                            key={opt.value}
                                                            className={`flex items-start gap-5 p-6 rounded-2xl border transition-all cursor-pointer ${answers[q.id] === opt.value
                                                                ? 'bg-brand-primary/5 border-brand-primary/40 ring-1 ring-brand-primary/40'
                                                                : 'bg-slate-50 dark:bg-architect-dark/50 border-slate-200 dark:border-architect-border hover:bg-slate-100 dark:hover:bg-architect-dark hover:border-brand-primary/20 dark:hover:border-architect-border/80'
                                                                }`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name={q.id}
                                                                value={opt.value}
                                                                checked={answers[q.id] === opt.value}
                                                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                                className="sr-only"
                                                            />
                                                            <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${answers[q.id] === opt.value ? 'border-brand-primary' : 'border-slate-300 dark:border-architect-border'}`}>
                                                                {answers[q.id] === opt.value && <div className="w-3 h-3 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(79,172,254,0.5)]" />}
                                                            </div>
                                                            <div>
                                                                <div className={`font-black text-sm tracking-tight ${answers[q.id] === opt.value ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-architect-muted'}`}>{opt.label}</div>
                                                                {opt.description && <div className="text-[11px] text-slate-400 dark:text-architect-muted mt-1 leading-normal font-medium opacity-70">{opt.description}</div>}
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}

                                            {q.type === 'select' && q.options && (
                                                <div className="relative group">
                                                    <select
                                                        value={answers[q.id] || ''}
                                                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                        className="w-full bg-slate-50 dark:bg-architect-dark/50 border border-slate-200 dark:border-architect-border rounded-2xl px-8 py-5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all appearance-none cursor-pointer font-bold tracking-tight"
                                                    >
                                                        <option value="" className="bg-white dark:bg-architect-card italic">Select Option...</option>
                                                        {q.options.map(opt => (
                                                            <option key={opt.value} value={opt.value} className="bg-white dark:bg-architect-card font-bold text-slate-900 dark:text-white">
                                                                {opt.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-architect-muted group-hover:text-brand-primary transition-all">
                                                        <ChevronRight className="w-6 h-6 rotate-90" />
                                                    </div>
                                                </div>
                                            )}

                                            {q.type === 'text' && (
                                                <input
                                                    type="text"
                                                    value={answers[q.id] || ''}
                                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                    placeholder={q.placeholder}
                                                    className="w-full bg-slate-50 dark:bg-architect-dark/50 border border-slate-200 dark:border-architect-border rounded-2xl px-8 py-5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-architect-muted focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all font-bold tracking-tight"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    onClick={handleGenerate}
                                    className="w-full py-8 rounded-2xl font-black text-xl tracking-tighter bg-gradient-to-r from-brand-primary to-brand-secondary text-white dark:text-architect-dark hover:shadow-[0_0_40px_rgba(79,172,254,0.3)] hover:scale-[1.01] active:scale-[0.98] transition-all"
                                    disabled={Object.keys(answers).length < questions.filter(q => q.required).length}
                                >
                                    <Sparkles className="w-6 h-6 mr-4" />
                                    Generate Funnel
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 'generating' && (
                        <motion.div
                            key="generating"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center py-24 text-center"
                        >
                            <div className="relative mb-16">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="w-48 h-48 rounded-full border-2 border-brand-primary/10"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="w-16 h-16 text-brand-primary animate-spin" />
                                </div>
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.1, 0.3, 0.1]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="absolute inset-0 bg-brand-primary/20 blur-[100px] rounded-full"
                                />
                            </div>
                            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight uppercase">Generating Strategy</h2>
                            <p className="text-slate-500 dark:text-architect-muted max-w-md text-lg leading-relaxed font-medium">
                                AI is analyzing industry benchmarks to build your funnel.
                            </p>
                        </motion.div>
                    )}

                    {currentStep === 'preview' && generatedFunnel && (
                        <motion.div
                            key="preview"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="w-full max-w-7xl mx-auto"
                        >
                            {/* Dashboard Shell Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-16 px-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4">
                                        <div className="px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-xs font-bold tracking-wider uppercase">Funnel Type</div>
                                        <div className="text-slate-500 dark:text-architect-muted text-xs font-mono tracking-widest uppercase">{selectedType} Funnel</div>
                                    </div>
                                    <h2 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                                        Funnel <span className="architect-gradient">Strategy</span>
                                    </h2>
                                    <div className="flex flex-wrap gap-6 pt-2">
                                        <div className="flex items-center gap-2.5 text-slate-500 dark:text-architect-muted font-bold text-sm tracking-tight border-r border-slate-200 dark:border-architect-border pr-6">
                                            <Briefcase className="w-4 h-4 text-brand-primary" />
                                            {INDUSTRIES[generatedFunnel.industry as Industry].name}
                                        </div>
                                        <div className="flex items-center gap-2.5 text-slate-500 dark:text-architect-muted font-bold text-sm tracking-tight">
                                            <Target className="w-4 h-4 text-brand-secondary" />
                                            {GOALS[generatedFunnel.goal as FunnelGoal].name}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <Button onClick={handleRestart} variant="secondary" className="px-8 rounded-2xl bg-white dark:bg-architect-card text-slate-900 dark:text-white border border-slate-200 dark:border-architect-border hover:bg-slate-50 dark:hover:bg-architect-dark">
                                        Reset
                                    </Button>
                                    <Button onClick={handleSave} className="px-10 rounded-2xl bg-brand-primary text-white hover:bg-brand-secondary transition-all shadow-xl font-bold">
                                        <Check className="w-5 h-5 mr-3" />
                                        Save Funnel
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                                {/* Visual Studio - Central Column */}
                                <div className="lg:col-span-8 space-y-10">
                                    <div className="bg-white dark:bg-architect-card rounded-[3.5rem] p-12 border border-slate-200 dark:border-architect-border relative overflow-hidden group shadow-2xl dark:shadow-3xl">
                                        <div className="absolute top-12 left-12 z-20 flex flex-col gap-1">
                                            <div className="text-brand-primary text-[10px] font-black tracking-[0.4em] uppercase">Interactive Preview</div>
                                            <div className="h-0.5 w-16 bg-brand-primary/40 rounded-full" />
                                        </div>

                                        <div className="absolute top-12 right-12 z-20 flex gap-4">
                                            <div className="p-3 bg-slate-100 dark:bg-architect-dark/50 border border-slate-200 dark:border-architect-border rounded-2xl backdrop-blur-md">
                                                <Layers className="w-5 h-5 text-architect-muted hover:text-white transition-colors cursor-pointer" />
                                            </div>
                                        </div>

                                        <div className="flex justify-center items-center h-[700px]">
                                            
<FunnelStack
    stages={generatedFunnel.stages || generatedFunnel.template.stages}
    activeStage={activeStage}
    onStageSelect={setActiveStage}
/>
<div className="absolute right-0 top-0 bottom-0 w-80 rounded-l-3xl border-l border-white/5 bg-[#22262b]/95 backdrop-blur-[20px] shadow-[40px_0_80px_rgba(0,0,0,0.5)] z-40 transition-all flex flex-col p-6 space-y-8">
    <div className="flex items-center space-x-4 mb-4 mt-6">
        <div className="w-12 h-12 rounded-xl bg-brand-primary/20 flex items-center justify-center border border-brand-primary/30">
            <span className="material-symbols-outlined text-brand-primary" style={{fontVariationSettings: "'FILL' 1"}}>visibility</span>
        </div>
        <div>
            <h3 className="font-headline font-bold text-xl text-white">Stage Insights</h3>
            <p className="font-body text-xs text-brand-primary font-medium">{activeStage ? activeStage.name : 'AI Strategy'}</p>
        </div>
    </div>
    
    {activeStage && (
        <nav className="flex flex-col space-y-2 flex-1">
            <div className="p-4 rounded-xl bg-brand-primary/10 border border-brand-primary/20 mb-4">
                <p className="text-white/80 text-sm font-medium leading-relaxed italic">{activeStage.objective || activeStage.description}</p>
            </div>
            
            <div className="flex flex-col space-y-3">
                <h4 className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Core Channels</h4>
                {activeStage.channels?.map((channel: string, i: number) => (
                    <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 text-brand-primary border-l-4 border-brand-primary text-sm">
                        <span className="font-medium">{channel}</span>
                    </div>
                ))}
                
                <h4 className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-4">Content Focus</h4>
                {activeStage.contentTypes?.map((contentType: string, i: number) => (
                    <div key={i} className="flex items-center space-x-3 p-3 rounded-lg text-architect-muted hover:bg-white/5 transition-colors border-l-4 border-transparent text-sm">
                        <span>{contentType}</span>
                    </div>
                ))}
            </div>
        </nav>
    )}
    
    <div className="mt-auto pt-6 border-t border-white/10">
        <button className="w-full py-3 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-brand-primary font-bold hover:bg-brand-primary hover:text-white transition-all shadow-[0_0_15px_rgba(133,173,255,0.2)]">
            Apply Stage Strategy
        </button>
    </div>
</div>

                                        </div>

                                        {/* Dynamic HUD Hint */}
                                        <div className="absolute bottom-12 left-12 flex items-center gap-4 text-slate-400 dark:text-architect-muted text-[10px] font-black tracking-[0.2em] uppercase opacity-50">
                                            <div className="w-2 h-2 rounded-full bg-brand-primary animate-ping" />
                                            Interactive Mode
                                        </div>
                                    </div>

                                    {/* Strategy Feed */}
                                    <div className="bg-white dark:bg-architect-card rounded-[3rem] border border-slate-200 dark:border-architect-border overflow-hidden shadow-xl dark:shadow-none">
                                        <div className="p-10 border-b border-slate-200 dark:border-architect-border flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-brand-primary/10 rounded-2xl">
                                                    <Info className="w-6 h-6 text-brand-primary" />
                                                </div>
                                                <h3 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">Strategic Breakdown</h3>
                                            </div>
                                            <div className="text-slate-500 dark:text-architect-muted text-xs font-mono tracking-widest uppercase">Deltas Processed: {generatedFunnel.stages.length}</div>
                                        </div>
                                        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                                            {generatedFunnel.stages.map((stage: any, idx: number) => (
                                                <div key={idx} className="space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-2xl font-black text-brand-primary/30">0{idx + 1}</span>
                                                        <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{stage.name}</h4>
                                                    </div>
                                                    <p className="text-slate-500 dark:text-architect-muted font-medium leading-relaxed pl-10 border-l border-slate-200 dark:border-architect-border ml-4 italic">
                                                        {stage.description}
                                                    </p>
                                                    <div className="pl-14 space-y-2">
                                                        {stage.strategies?.map((strat: string, sIdx: number) => (
                                                            <div key={sIdx} className="flex items-start gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary/40 mt-1 flex-shrink-0" />
                                                                {strat}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar HUD - Intelligence Layer */}
                                <div className="lg:col-span-4 space-y-8">
                                    <motion.div
                                        initial={{ opacity: 0, x: 40 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="bg-white dark:bg-architect-card border border-brand-primary/20 rounded-[3rem] p-10 backdrop-blur-3xl shadow-2xl dark:shadow-3xl dark:shadow-brand-primary/5"
                                    >
                                        <StrategyCoach
                                            industry={generatedFunnel.industry as Industry}
                                            goal={generatedFunnel.goal as FunnelGoal}
                                            answers={answers}
                                        />
                                    </motion.div>

                                    {/* 90-Day Roadmap Widget */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 40 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="bg-white dark:bg-architect-card border border-slate-200 dark:border-architect-border rounded-[3rem] p-10 shadow-xl dark:shadow-none"
                                    >
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="p-3 bg-emerald-500/10 rounded-2xl">
                                                <TrendingUp className="w-6 h-6 text-emerald-500" />
                                            </div>
                                            <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">90-Day Growth Roadmap</h3>
                                        </div>

                                        {generatedFunnel.implementationRoadmap ? (
                                            <div className="space-y-6 relative">
                                                {/* Connecting Line */}
                                                <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-100 dark:bg-white/5" />

                                                {['month1', 'month2', 'month3'].map((monthKey, idx) => {
                                                    const monthData = generatedFunnel.implementationRoadmap[monthKey];
                                                    if (!monthData) return null;

                                                    return (
                                                        <div
                                                            key={monthKey}
                                                            onClick={() => {
                                                                console.log('DEBUG CLICK ROADMAP (Container):', monthData);
                                                                setOpenRoadmapData(monthData);
                                                            }}
                                                            className="relative pl-10 group cursor-pointer"
                                                        >
                                                            <div className="absolute left-[11px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-white/20 ring-4 ring-white dark:ring-architect-card group-hover:bg-brand-primary group-hover:dark:bg-brand-primary transition-colors" />

                                                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 group-hover:border-brand-primary/30 group-hover:bg-white dark:group-hover:bg-architect-dark transition-all">
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest mb-1">Month {idx + 1}</div>
                                                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-brand-primary transition-colors">{monthData.title.split(': ')[1] || monthData.title}</h4>
                                                                    </div>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            console.log('DEBUG CLICK ROADMAP (Button):', monthData);
                                                                            setOpenRoadmapData(monthData);
                                                                        }}
                                                                        className="relative z-50 px-4 py-2 rounded-lg bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                                                    >
                                                                        Open Details
                                                                    </button>
                                                                </div>
                                                                <p className="text-xs text-slate-500 dark:text-architect-muted line-clamp-2 mt-2">{monthData.focus}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 px-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-300 dark:border-white/10">
                                                <TrendingUp className="w-10 h-10 text-slate-300 dark:text-white/20 mx-auto mb-3" />
                                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Legacy Strategy Detected</h4>
                                                <p className="text-xs text-slate-500 dark:text-architect-muted mb-4">This strategy was generated before the Roadmap update.</p>
                                                <Button
                                                    onClick={handleRestart}
                                                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold py-2 rounded-xl"
                                                >
                                                    Regenerate for Roadmap
                                                </Button>
                                            </div>
                                        )}
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: 40 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="bg-white dark:bg-architect-card border border-slate-200 dark:border-architect-border rounded-[3rem] p-10 backdrop-blur-3xl shadow-xl dark:shadow-none"
                                    >
                                        <div className="flex items-center gap-3 mb-10">
                                            <div className="p-3 bg-brand-secondary/10 rounded-2xl">
                                                <Calculator className="w-6 h-6 text-brand-secondary" />
                                            </div>
                                            <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Revenue Simulator</h3>
                                        </div>
                                        <FunnelSimulator
                                            onSimulate={setSimulationData}
                                            baseConvRate={INDUSTRIES[generatedFunnel.industry as Industry].benchmarks.convRate}
                                            baseAOV={INDUSTRIES[generatedFunnel.industry as Industry].benchmarks.avgOrderValue}
                                        />
                                    </motion.div>
                                </div>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>

                <RoadmapDetailsModal
                    isOpen={!!openRoadmapData}
                    onClose={() => setOpenRoadmapData(null)}
                    data={openRoadmapData}
                />
            </div>
        </div>
    );
}
