const fs = require('fs');
let content = fs.readFileSync('src/pages/FunnelBuilder.tsx', 'utf8');

// 1. Add FunnelStack import
content = content.replace("import { Funnel3D } from '../components/Funnel3D/Funnel3D';", "import { FunnelStack } from '../components/FunnelBuilder/FunnelStack';");

// 2. Add activeStage state
content = content.replace("const [simulationData, setSimulationData] = useState<any>(null);", "const [simulationData, setSimulationData] = useState<any>(null);\n    const [activeStage, setActiveStage] = useState<any>(null);");

// 3. Update preview initialization to set active stage
content = content.replace(
    "setGeneratedFunnel({",
    "const funnelData = {\n                ...result,\n                template,\n                type: selectedType,\n                industry: selectedIndustry,\n                goal: selectedGoal\n            };\n            setGeneratedFunnel(funnelData);\n            setActiveStage(funnelData.stages?.[0] || funnelData.template.stages[0]);\n            // "
);
content = content.replace("...result,", "");
content = content.replace("template,", "");
content = content.replace("type: selectedType,", "");
content = content.replace("industry: selectedIndustry,", "");
content = content.replace("goal: selectedGoal", "");

// 4. Replace Funnel3D component invocation with FunnelStack and SideNavBar layout

const funnelStackCode = `
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
`;

content = content.replace(
    /<Funnel3D[\s\S]*?simulationData=\{simulationData\}\s*\/>/,
    funnelStackCode
);

fs.writeFileSync('src/pages/FunnelBuilder.tsx', content, 'utf8');
console.log('Replaced FunnelBuilder.tsx contents.');
