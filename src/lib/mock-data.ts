// ─── Role Types ───
export type AdminRole = 'super_admin' | 'sub_admin_ops' | 'sub_admin_finance' | 'sub_admin_content';

export const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  sub_admin_ops: 'Sub-Admin Ops',
  sub_admin_finance: 'Sub-Admin Finance',
  sub_admin_content: 'Sub-Admin Content',
};

// ─── Dashboard Metrics ───
export const dashboardMetrics = {
  totalMRR: 'R$ 187.450',
  activeSubscriptions: 1_243,
  activeTeachers: 47, // DB column name stays, label changed in UI
  contentPublished: 312,
};

export const healthCards = [
  { label: 'Activation Rate', value: '78%', trend: '+3.2% vs last month', positive: true },
  { label: 'Facilitator Utilization', value: '14.2 hrs/wk', trend: '+1.1 hrs', positive: true },
  { label: 'Content Freshness', value: '92%', trend: 'On track', positive: true },
  { label: 'Cancellation Rate', value: '6.4%', trend: '-0.8%', positive: true },
];

export const recentActivity = [
  { id: '1', time: '2 min ago', text: 'New company registered: TechBrasil Ltda', type: 'company' },
  { id: '2', time: '15 min ago', text: 'Facilitator onboarded: Amina K. (EN, FR)', type: 'teacher' },
  { id: '3', time: '1 hr ago', text: 'Subscription cancelled: João Silva (Individual Basic)', type: 'cancel' },
  { id: '4', time: '2 hrs ago', text: 'Content published: "The Power of Vulnerability" (TED)', type: 'content' },
  { id: '5', time: '3 hrs ago', text: 'Company plan upgraded: GlobalCorp → Plus', type: 'company' },
  { id: '6', time: '4 hrs ago', text: 'New teacher application: Carlos M. (ES, PT)', type: 'teacher' },
  { id: '7', time: '5 hrs ago', text: 'Employee approved: Maria Santos @ InnovaTech', type: 'company' },
  { id: '8', time: '6 hrs ago', text: 'Group class auto-created: EN Intermediate (Tue 19:00)', type: 'class' },
];

// ─── Companies ───
export interface Company {
  id: string;
  name: string;
  cnpj: string;
  plan: string;
  employees: number;
  mrr: string;
  renewalDate: string;
  status: 'active' | 'suspended' | 'terminated';
}

export const companies: Company[] = [
  { id: '1', name: 'TechBrasil Ltda', cnpj: '12.345.678/0001-90', plan: 'Corporate Plus', employees: 85, mrr: 'R$ 25.415', renewalDate: '2026-06-15', status: 'active' },
  { id: '2', name: 'GlobalCorp SA', cnpj: '98.765.432/0001-10', plan: 'Corporate Basic', employees: 120, mrr: 'R$ 21.480', renewalDate: '2026-04-01', status: 'active' },
  { id: '3', name: 'InnovaTech', cnpj: '11.222.333/0001-44', plan: 'Corporate Plus', employees: 45, mrr: 'R$ 13.455', renewalDate: '2026-08-20', status: 'active' },
  { id: '4', name: 'EduStart ME', cnpj: '55.666.777/0001-88', plan: 'Corporate Basic', employees: 20, mrr: 'R$ 3.580', renewalDate: '2026-03-10', status: 'suspended' },
  { id: '5', name: 'FinanceOne', cnpj: '22.333.444/0001-55', plan: 'Enterprise', employees: 200, mrr: 'R$ 52.000', renewalDate: '2026-12-01', status: 'active' },
  { id: '6', name: 'GreenEnergy BR', cnpj: '33.444.555/0001-66', plan: 'Corporate Basic', employees: 30, mrr: 'R$ 5.370', renewalDate: '2026-05-15', status: 'active' },
  { id: '7', name: 'MediaHouse', cnpj: '44.555.666/0001-77', plan: 'Corporate Plus', employees: 15, mrr: 'R$ 4.485', renewalDate: '2026-07-01', status: 'terminated' },
  { id: '8', name: 'LogiTrans SA', cnpj: '66.777.888/0001-99', plan: 'Corporate Basic', employees: 65, mrr: 'R$ 11.635', renewalDate: '2026-09-30', status: 'active' },
];

// ─── Methodology (UIRF Phases) ───
export interface MethodologyPhase {
  id: string;
  name: string;
  studentInstruction: string;
  teacherPrompt: string;
  durationMinutes: number;
  appliesTo: 'self_study' | 'live_class' | 'both';
}

export const defaultPhases: MethodologyPhase[] = [
  { id: '1', name: 'Phase 1: Full Immersion', studentInstruction: 'Watch the full talk without pausing. Focus on the overall message.', teacherPrompt: 'Let the student watch/listen without interruption. Observe engagement.', durationMinutes: 15, appliesTo: 'both' },
  { id: '2', name: 'Phase 2: Key Ideas & Expressions', studentInstruction: 'Note 2-3 key ideas and 3-5 useful expressions from the content.', teacherPrompt: 'Ask: What stood out? Which expressions would you like to use?', durationMinutes: 10, appliesTo: 'both' },
  { id: '3', name: 'Phase 3: Fluency Activation', studentInstruction: 'Retell the talk aloud for 2-3 minutes in your own words.', teacherPrompt: 'Listen without correcting. Note emergent language for Phase 5.', durationMinutes: 10, appliesTo: 'both' },
  { id: '4', name: 'Phase 4: Facilitated Discussion', studentInstruction: 'Discuss the topic with your facilitator. Share your perspective.', teacherPrompt: 'Guide discussion using student agenda. Expand on their ideas.', durationMinutes: 15, appliesTo: 'live_class' },
  { id: '5', name: 'Phase 5: Language Mining', studentInstruction: 'Identify 1-2 grammar structures from the transcript to study.', teacherPrompt: 'Highlight patterns from Phase 3 output. Reformulate together.', durationMinutes: 5, appliesTo: 'both' },
  { id: '6', name: 'Phase 6: Re-voicing', studentInstruction: "Express the talk's idea in your own words using new expressions.", teacherPrompt: 'Encourage integration of mined language. Provide gentle scaffolding.', durationMinutes: 10, appliesTo: 'both' },
  { id: '7', name: 'Phase 7: Expression Takeaway', studentInstruction: 'Save 2 expressions you want to reuse this week.', teacherPrompt: 'Help student select high-utility expressions. Suggest contexts.', durationMinutes: 5, appliesTo: 'both' },
];

// ─── Feature Flags ───
export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export const defaultFeatureFlags: FeatureFlag[] = [
  { id: '1', name: 'AI Chat in Self-Study', description: 'Allow students to ask AI questions about content during self-study sessions.', enabled: true },
  { id: '2', name: 'Vocabulary Save', description: 'Enable word highlighting and saving to personal vocabulary list.', enabled: true },
  { id: '3', name: 'Group Class Auto-Create', description: 'Automatically create group classes when student count exceeds capacity.', enabled: false },
  { id: '4', name: 'ESG Reporting', description: 'Enable social impact and ESG reporting for Corporate Plus companies.', enabled: false },
  { id: '5', name: 'Maintenance Mode', description: 'Show maintenance page to all non-admin users.', enabled: false },
];

// ─── Content Frameworks ───
export interface ContentFramework {
  id: string;
  name: string;
  description: string;
  sourceType: string;
  active: boolean;
  itemCount: number;
  color: string;
}

export const contentFrameworks: ContentFramework[] = [
  { id: '1', name: 'Fluent with TED', description: 'TED Talks curated for language learners across all levels.', sourceType: 'TED / YouTube', active: true, itemCount: 42, color: 'bg-destructive' },
  { id: '2', name: 'Fluent with News', description: 'Current affairs from global outlets for topical discussion.', sourceType: 'NewsAPI / Guardian', active: true, itemCount: 28, color: 'bg-primary' },
  { id: '3', name: 'Fluent with Global South', description: 'Perspectives from Africa, Latin America, and Asia.', sourceType: 'RSS / Manual', active: true, itemCount: 15, color: 'bg-success' },
  { id: '4', name: 'Fluent with Business', description: 'Professional and corporate communication content.', sourceType: 'HBR / Manual', active: true, itemCount: 22, color: 'bg-accent' },
  { id: '5', name: 'Fluent with Culture', description: 'Arts, music, cinema, and cultural identity.', sourceType: 'Manual', active: false, itemCount: 8, color: 'bg-admin' },
  { id: '6', name: 'Fluent with Science', description: 'Science communication and environmental topics.', sourceType: 'Manual', active: false, itemCount: 5, color: 'bg-navy' },
];

// ─── Content Items (Approval Queue) ───
export interface ContentItem {
  id: string;
  title: string;
  framework: string;
  language: string;
  levelRange: string;
  perspective: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  curator: string;
  submittedAt: string;
  publishedWeek: number;
  publishedYear: number;
  durationSeconds: number;
  sourceUrl: string;
  topicTags: string[];
}

export const contentItems: ContentItem[] = [
  { id: '1', title: 'The Power of Vulnerability', framework: 'Fluent with TED', language: 'EN', levelRange: 'B1–C1', perspective: 'global_north', status: 'review', curator: 'Content Admin', submittedAt: '2026-02-18', publishedWeek: 9, publishedYear: 2026, durationSeconds: 1212, sourceUrl: 'https://ted.com/talks/brene_brown_the_power_of_vulnerability', topicTags: ['psychology', 'leadership'] },
  { id: '2', title: 'How Great Leaders Inspire Action', framework: 'Fluent with TED', language: 'EN', levelRange: 'B2–C2', perspective: 'global_north', status: 'review', curator: 'Maria C.', submittedAt: '2026-02-17', publishedWeek: 9, publishedYear: 2026, durationSeconds: 1098, sourceUrl: 'https://ted.com/talks/simon_sinek_how_great_leaders_inspire_action', topicTags: ['leadership', 'business'] },
  { id: '3', title: 'Climate Justice in the Global South', framework: 'Fluent with Global South', language: 'EN', levelRange: 'B1–B2', perspective: 'global_south', status: 'review', curator: 'João P.', submittedAt: '2026-02-16', publishedWeek: 10, publishedYear: 2026, durationSeconds: 840, sourceUrl: 'https://example.com/climate-justice', topicTags: ['climate', 'justice'] },
  { id: '4', title: 'Negociação em Contextos Interculturais', framework: 'Fluent with Business', language: 'PT', levelRange: 'B2–C1', perspective: 'neutral', status: 'published', curator: 'Content Admin', submittedAt: '2026-02-10', publishedWeek: 8, publishedYear: 2026, durationSeconds: 960, sourceUrl: 'https://example.com/negociacao', topicTags: ['negotiation', 'culture'] },
  { id: '5', title: 'The Danger of a Single Story', framework: 'Fluent with TED', language: 'EN', levelRange: 'A2–B2', perspective: 'global_south', status: 'published', curator: 'Maria C.', submittedAt: '2026-02-08', publishedWeek: 8, publishedYear: 2026, durationSeconds: 1140, sourceUrl: 'https://ted.com/talks/chimamanda_ngozi_adichie_the_danger_of_a_single_story', topicTags: ['identity', 'storytelling'] },
  { id: '6', title: "L'art de la conversation", framework: 'Fluent with Culture', language: 'FR', levelRange: 'B1–C1', perspective: 'global_north', status: 'draft', curator: 'João P.', submittedAt: '2026-02-19', publishedWeek: 10, publishedYear: 2026, durationSeconds: 720, sourceUrl: 'https://example.com/conversation-art', topicTags: ['culture', 'communication'] },
  { id: '7', title: 'Renewable Energy Breakthroughs 2026', framework: 'Fluent with News', language: 'EN', levelRange: 'B2–C2', perspective: 'neutral', status: 'published', curator: 'Content Admin', submittedAt: '2026-02-05', publishedWeek: 7, publishedYear: 2026, durationSeconds: 480, sourceUrl: 'https://example.com/renewable-2026', topicTags: ['science', 'energy'] },
  { id: '8', title: 'Migración y Resiliencia', framework: 'Fluent with Global South', language: 'ES', levelRange: 'B1–B2', perspective: 'global_south', status: 'review', curator: 'Maria C.', submittedAt: '2026-02-19', publishedWeek: 10, publishedYear: 2026, durationSeconds: 900, sourceUrl: 'https://example.com/migracion', topicTags: ['migration', 'resilience'] },
];

// ─── Employees (mock per company) ───
export interface Employee {
  id: string;
  name: string;
  email: string;
  companyId: string;
  level: string;
  status: 'active' | 'invited' | 'inactive';
  joinedAt: string;
}

export const employees: Employee[] = [
  { id: 'e1', name: 'Ana Souza', email: 'ana@techbrasil.com', companyId: '1', level: 'B2', status: 'active', joinedAt: '2025-06-10' },
  { id: 'e2', name: 'Pedro Lima', email: 'pedro@techbrasil.com', companyId: '1', level: 'B1', status: 'active', joinedAt: '2025-07-15' },
  { id: 'e3', name: 'Carla Mendes', email: 'carla@techbrasil.com', companyId: '1', level: 'C1', status: 'invited', joinedAt: '2026-01-20' },
  { id: 'e4', name: 'Lucas Ferreira', email: 'lucas@globalcorp.com', companyId: '2', level: 'A2', status: 'active', joinedAt: '2025-09-01' },
  { id: 'e5', name: 'Julia Costa', email: 'julia@globalcorp.com', companyId: '2', level: 'B1', status: 'active', joinedAt: '2025-10-05' },
  { id: 'e6', name: 'Rafael Dias', email: 'rafael@globalcorp.com', companyId: '2', level: 'B2', status: 'inactive', joinedAt: '2025-08-12' },
  { id: 'e7', name: 'Beatriz Alves', email: 'bia@innovatech.com', companyId: '3', level: 'C1', status: 'active', joinedAt: '2025-11-01' },
  { id: 'e8', name: 'Thiago Rocha', email: 'thiago@innovatech.com', companyId: '3', level: 'B2', status: 'active', joinedAt: '2025-12-10' },
  { id: 'e9', name: 'Mariana Nunes', email: 'mariana@edustart.com', companyId: '4', level: 'A2', status: 'invited', joinedAt: '2026-01-05' },
  { id: 'e10', name: 'Gabriel Santos', email: 'gabriel@financeone.com', companyId: '5', level: 'B1', status: 'active', joinedAt: '2025-05-20' },
  { id: 'e11', name: 'Isabela Martins', email: 'isabela@financeone.com', companyId: '5', level: 'C2', status: 'active', joinedAt: '2025-04-15' },
  { id: 'e12', name: 'Fernando Oliveira', email: 'fernando@financeone.com', companyId: '5', level: 'B2', status: 'active', joinedAt: '2025-06-01' },
];

// ─── Audit Log ───
export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  resource: string;
  details: { before?: Record<string, unknown>; after?: Record<string, unknown> };
}

export const auditEntries: AuditEntry[] = [
  { id: '1', timestamp: '2026-02-19 14:32:00', actor: 'Admin User', actorRole: 'super_admin', action: 'company.plan_changed', resource: 'GlobalCorp SA', details: { before: { plan: 'Corporate Basic' }, after: { plan: 'Corporate Plus' } } },
  { id: '2', timestamp: '2026-02-19 13:15:00', actor: 'Admin User', actorRole: 'super_admin', action: 'feature_flag.toggled', resource: 'AI Chat in Self-Study', details: { before: { enabled: false }, after: { enabled: true } } },
  { id: '3', timestamp: '2026-02-19 11:45:00', actor: 'Ops Admin', actorRole: 'sub_admin_ops', action: 'teacher.approved', resource: 'Amina K.', details: { after: { status: 'active', languages: ['EN', 'FR'] } } },
  { id: '4', timestamp: '2026-02-19 10:20:00', actor: 'Admin User', actorRole: 'super_admin', action: 'company.suspended', resource: 'EduStart ME', details: { before: { status: 'active' }, after: { status: 'suspended', reason: 'Payment overdue 45 days' } } },
  { id: '5', timestamp: '2026-02-18 16:00:00', actor: 'Content Admin', actorRole: 'sub_admin_content', action: 'content.published', resource: 'The Power of Vulnerability', details: { after: { framework: 'TED', language: 'EN', level: 'B1-C1' } } },
  { id: '6', timestamp: '2026-02-18 14:30:00', actor: 'Finance Admin', actorRole: 'sub_admin_finance', action: 'payout.approved', resource: 'Teacher Batch Feb-1', details: { after: { teachers: 12, total: 'R$ 18.450' } } },
  { id: '7', timestamp: '2026-02-18 11:00:00', actor: 'Admin User', actorRole: 'super_admin', action: 'methodology.published', resource: 'UIRF v2.1', details: { before: { version: '2.0', status: 'active' }, after: { version: '2.1', status: 'active' } } },
  { id: '8', timestamp: '2026-02-17 09:15:00', actor: 'Ops Admin', actorRole: 'sub_admin_ops', action: 'employee.verified', resource: 'Maria Santos @ InnovaTech', details: { after: { verified_year: 2026 } } },
];
