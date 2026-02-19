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
  activeTeachers: 47,
  contentPublished: 312,
};

export const healthCards = [
  { label: 'Activation Rate', value: '78%', trend: '+3.2% vs last month', positive: true },
  { label: 'Teacher Utilization', value: '14.2 hrs/wk', trend: '+1.1 hrs', positive: true },
  { label: 'Content Freshness', value: '92%', trend: 'On track', positive: true },
  { label: 'Cancellation Rate', value: '6.4%', trend: '-0.8%', positive: true },
];

export const recentActivity = [
  { id: '1', time: '2 min ago', text: 'New company registered: TechBrasil Ltda', type: 'company' },
  { id: '2', time: '15 min ago', text: 'Teacher onboarded: Amina K. (EN, FR)', type: 'teacher' },
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
