// Advanced Playbook Templates Library
// Comprehensive templates tailored for Startup Founders

export interface PlaybookTemplate {
    id: string;
    name: string;
    category: string;
    industry: string[];
    icon: string;
    description: string;
    estimatedPhases: number;

    // Template structure guidelines
    structure: {
        phases: PhaseTemplate[];
        defaultSections: string[];
    };

    // Customization parameters
    parameters: TemplateParameter[];
}

export interface PhaseTemplate {
    title: string;
    emoji: string;
    objective: string;
    hasTables?: boolean;
    hasChecklists?: boolean;
    subsections: string[];
}

export interface TemplateParameter {
    id: string;
    label: string;
    type: 'text' | 'select' | 'multiselect' | 'number' | 'textarea';
    required: boolean;
    options?: { value: string; label: string }[];
    placeholder?: string;
    defaultValue?: any;
}

// ============================================================================
// TEMPLATE DEFINITIONS
// ============================================================================

export const Playbook_TEMPLATES: PlaybookTemplate[] = [
    {
        id: 'technical-hiring',
        name: 'Technical Founder Hiring',
        category: 'Team Building',
        industry: ['SaaS', 'Fintech', 'DeepTech', 'Web3'],
        icon: '💻',
        description: 'Elite technical hiring playbook to acquire 10x engineers and technical co-founders.',
        estimatedPhases: 5,

        structure: {
            phases: [
                {
                    title: 'Role Design & Scorecard',
                    emoji: '🔹',
                    objective: 'Define the engineering needs and exactly what success looks like.',
                    hasTables: true,
                    hasChecklists: true,
                    subsections: ['Technical Stack', 'Cultural Fit', 'Success Metrics', 'Compensation Range']
                },
                {
                    title: 'Sourcing & Outbound',
                    emoji: '🔹',
                    objective: 'Build a high-quality pipeline through targeted outreach.',
                    hasChecklists: true,
                    subsections: ['GitHub Sourcing', 'Cold Email Sequences', 'Network Referrals']
                },
                {
                    title: 'Technical Evaluation',
                    emoji: '🔹',
                    objective: 'Assess coding capability without alienating senior talent.',
                    hasTables: false,
                    hasChecklists: true,
                    subsections: ['Pair Programming', 'System Design Review', 'Take-home vs Live coding']
                },
                {
                    title: 'The Sell & Closing',
                    emoji: '🔹',
                    objective: 'Convince top talent to join early-stage risk.',
                    hasTables: true,
                    subsections: ['Equity Explanation', 'Vision Pitch', 'Offer Negotiation']
                },
                {
                    title: 'Onboarding & Shipping',
                    emoji: '🔹',
                    objective: 'Get engineers pushing to production in week 1.',
                    hasChecklists: true,
                    subsections: ['Dev Environment Setup', 'First PR', 'Architecture Walkthrough']
                }
            ],
            defaultSections: ['Overview', 'Scorecard', 'Interview Loop', 'Offer Structure']
        },

        parameters: [
            {
                id: 'roleLevel',
                label: 'Role Level',
                type: 'select',
                required: true,
                options: [
                    { value: 'Founding Engineer', label: 'Founding Engineer' },
                    { value: 'Senior Backend', label: 'Senior Backend' },
                    { value: 'Full-Stack Lead', label: 'Full-Stack Lead' },
                    { value: 'CTO', label: 'CTO' }
                ]
            },
            {
                id: 'stack',
                label: 'Tech Stack',
                type: 'multiselect',
                required: true,
                options: [
                    { value: 'React/Node', label: 'React / Node.js' },
                    { value: 'Python/Django', label: 'Python / Django' },
                    { value: 'Rust', label: 'Rust' },
                    { value: 'Web3', label: 'Solidity / Web3' }
                ]
            },
            {
                id: 'compensation',
                label: 'Equity/Salary Ratio',
                type: 'select',
                required: true,
                options: [
                    { value: 'High Equity', label: 'High Equity / Low Base' },
                    { value: 'Market', label: 'Market Base / Avg Equity' }
                ]
            }
        ]
    },
    {
        id: 'investor-relations',
        name: 'Investor Relations & Updates',
        category: 'Fundraising',
        industry: ['All Startups'],
        icon: '📈',
        description: 'Standardized monthly updates to keep investors engaged and confident for the next round.',
        estimatedPhases: 3,

        structure: {
            phases: [
                {
                    title: 'Data Collection & Formatting',
                    emoji: '🔹',
                    objective: 'Compile critical KPIs without wasting founder time.',
                    hasTables: true,
                    hasChecklists: true,
                    subsections: ['MRR/ARR', 'Cash & Runway', 'Active Users', 'Burn Rate']
                },
                {
                    title: 'Narrative Construction',
                    emoji: '🔹',
                    objective: 'Tell the story behind the numbers.',
                    hasTables: false,
                    hasChecklists: true,
                    subsections: ['The Good', 'The Bad', 'The Ugly', 'Product Roadmap']
                },
                {
                    title: 'The "Asks"',
                    emoji: '🔹',
                    objective: 'Leverage investor networks effectively.',
                    hasChecklists: true,
                    subsections: ['Hiring Needs', 'Intro Requests', 'Strategic Advice']
                }
            ],
            defaultSections: ['Executive Summary', 'Financials', 'Highlights', 'Lowlights', 'Asks']
        },

        parameters: [
            {
                id: 'stage',
                label: 'Startup Stage',
                type: 'select',
                required: true,
                options: [
                    { value: 'Pre-Seed', label: 'Pre-Seed' },
                    { value: 'Seed', label: 'Seed' },
                    { value: 'Series A', label: 'Series A' }
                ]
            },
            {
                id: 'frequency',
                label: 'Update Frequency',
                type: 'select',
                required: true,
                options: [
                    { value: 'Monthly', label: 'Monthly' },
                    { value: 'Quarterly', label: 'Quarterly' }
                ]
            }
        ]
    },
    {
        id: 'pmf-discovery',
        name: 'Product-Market Fit Discovery',
        category: 'Product',
        industry: ['SaaS', 'Consumer Tech', 'Marketplace'],
        icon: '🔍',
        description: 'Systematic approach to running experiments and validating product-market fit.',
        estimatedPhases: 4,

        structure: {
            phases: [
                {
                    title: 'Hypothesis Definition',
                    emoji: '🔹',
                    objective: 'Clearly state what is being tested and the success criteria.',
                    hasTables: true,
                    hasChecklists: true,
                    subsections: ['Target Persona', 'Core Pain Point', 'Value Proposition', 'Falsifiability']
                },
                {
                    title: 'Customer Interviews',
                    emoji: '🔹',
                    objective: 'Run non-leading interviews (The Mom Test).',
                    hasChecklists: true,
                    subsections: ['Sourcing Intros', 'Interview Script', 'Signal Processing']
                },
                {
                    title: 'MVP Construction',
                    emoji: '🔹',
                    objective: 'Build the lowest-fidelity required to validate.',
                    hasTables: false,
                    hasChecklists: true,
                    subsections: ['Concierge MVP', 'Wizard of Oz', 'Landing Page Tests']
                },
                {
                    title: 'Data Review & Pivot',
                    emoji: '🔹',
                    objective: 'Analyze results and determine whether to pivot, persevere, or scale.',
                    hasTables: true,
                    subsections: ['Conversion Analysis', 'Retention Metrics', 'Decision Matrix']
                }
            ],
            defaultSections: ['Hypotheses', 'Interview Logs', 'Experiment Setup', 'Results']
        },

        parameters: [
            {
                id: 'productType',
                label: 'Product Type',
                type: 'select',
                required: true,
                options: [
                    { value: 'B2B SaaS', label: 'B2B SaaS' },
                    { value: 'B2C App', label: 'B2C Mobile App' },
                    { value: 'Marketplace', label: 'Two-sided Marketplace' }
                ]
            },
            {
                id: 'currentConfidence',
                label: 'PMF Confidence Level',
                type: 'select',
                required: true,
                options: [
                    { value: 'Low', label: 'Low (Just Ideas)' },
                    { value: 'Medium', label: 'Medium (Some Users)' },
                    { value: 'High', label: 'High (Generating Revenue)' }
                ]
            }
        ]
    }
];

export function getTemplateById(id: string): PlaybookTemplate | undefined {
    return Playbook_TEMPLATES.find(template => template.id === id);
}

export function getTemplatesByCategory(category: string): PlaybookTemplate[] {
    return Playbook_TEMPLATES.filter(template => template.category === category);
}

export function getTemplatesByIndustry(industry: string): PlaybookTemplate[] {
    return Playbook_TEMPLATES.filter(template => template.industry.includes(industry));
}

export const TEMPLATE_IDS = Playbook_TEMPLATES.map(t => t.id);
