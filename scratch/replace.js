const fs = require('fs');
let content = fs.readFileSync('src/pages/LandingPage.tsx', 'utf8');

content = content.replace(/SOP<span className=\"text-indigo-600 dark:text-indigo-400\">Master<\/span>/g, 'Founder<span className=\"text-brand-primary dark:text-brand-secondary\">Flow<\/span>');
content = content.replace('v3.0 with AI Strategy Generator', 'FounderFlow 3.0: The Operations Ecosystem for Startups');
content = content.replace(/Standardize success <br className=\"hidden md:block\" \/>\s*with <span className=\"text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 dark:from-indigo-400 dark:via-violet-400 dark:to-indigo-400 animate-text\">Intelligent SOPs<\/span>\./, 
'Scale your startup <br className=\"hidden md:block\" />\\n                        with <span className=\"text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-vibrant to-brand-secondary dark:from-brand-primary dark:via-brand-vibrant dark:to-brand-secondary animate-text\">FounderFlow</span>.');

content = content.replace('Transform chaos into clarity. The only SOP platform that uses AI to generate, optimize, and enforce your operating procedures in real-time.', 'Empowering modern founders. The unified platform that combines AI-driven workflows, runway calculators, and proven funnels to scale your business from Seed to Series A.');
content = content.replace('Built for the future of work', 'Built for fast-growing startups');
content = content.replace('Everything you need to scale your operations efficiently.', 'Everything you need to find Product-Market Fit and scale efficiently.');
content = content.replace('Stop writing from scratch. Feed our engine a simple prompt like \"Employee Onboarding\" and get a comprehensive, compliance-ready guide in seconds.', 'Stop searching for formulas. Feed our engine a simple prompt like \"Technical Co-founder Hiring\" or \"Series A Due Diligence\" and get expert-grade playbooks in seconds.');

// Colors updates
content = content.replace(/text-indigo-600/g, 'text-brand-primary').replace(/text-indigo-400/g, 'text-brand-secondary');
content = content.replace(/bg-indigo-600/g, 'bg-brand-primary').replace(/bg-indigo-500/g, 'bg-brand-vibrant');
content = content.replace(/shadow-indigo-500/g, 'shadow-brand-primary').replace(/shadow-indigo-600/g, 'shadow-brand-primary');
content = content.replace(/from-indigo-600/g, 'from-brand-primary').replace(/via-violet-600/g, 'via-brand-vibrant');
content = content.replace(/border-indigo-200/g, 'border-brand-primary/20').replace(/border-indigo-800/g, 'border-brand-primary/20');
content = content.replace(/border-indigo-100/g, 'border-brand-primary/10').replace(/border-indigo-900/g, 'border-brand-primary/10');
content = content.replace(/bg-indigo-50/g, 'bg-brand-primary/5').replace(/bg-indigo-900\/30/g, 'bg-brand-primary/10');
content = content.replace(/bg-indigo-900\/20/g, 'bg-brand-primary/10');
content = content.replace(/text-indigo-300/g, 'text-brand-secondary');

fs.writeFileSync('src/pages/LandingPage.tsx', content, 'utf8');
console.log('Done');
