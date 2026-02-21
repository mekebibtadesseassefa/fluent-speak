import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, Clock, FileText } from 'lucide-react';

const teacherOnboarding = [
  { id: '1', name: 'Amina K.', languages: ['EN', 'FR'], stage: 'Training', progress: 75, email: 'amina@example.com', appliedAt: '2026-01-15' },
  { id: '2', name: 'Carlos M.', languages: ['ES', 'PT'], stage: 'Application Review', progress: 25, email: 'carlos@example.com', appliedAt: '2026-02-10' },
  { id: '3', name: 'Fatima R.', languages: ['EN', 'AR'], stage: 'Profile Complete', progress: 50, email: 'fatima@example.com', appliedAt: '2026-02-01' },
  { id: '4', name: 'David N.', languages: ['EN'], stage: 'Active', progress: 100, email: 'david@example.com', appliedAt: '2025-11-20' },
  { id: '5', name: 'Lina W.', languages: ['EN', 'DE'], stage: 'Application Review', progress: 10, email: 'lina@example.com', appliedAt: '2026-02-18' },
  { id: '6', name: 'Kofi A.', languages: ['EN', 'FR'], stage: 'Training', progress: 60, email: 'kofi@example.com', appliedAt: '2026-01-28' },
];

const STAGE_COLOR: Record<string, string> = {
  'Application Review': 'bg-accent/15 text-accent border-accent/30',
  'Profile Complete': 'bg-primary/15 text-primary border-primary/30',
  'Training': 'bg-admin/15 text-admin border-admin/30',
  'Active': 'bg-success/15 text-success border-success/30',
};

export default function TeacherOnboardingPage() {
  const inPipeline = teacherOnboarding.filter(t => t.stage !== 'Active');
  const active = teacherOnboarding.filter(t => t.stage === 'Active');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Teacher Onboarding</h1>
        <p className="text-sm text-muted-foreground">Track teacher applications through the onboarding pipeline.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="h-8 w-8 text-admin" />
            <div><p className="text-2xl font-bold">{inPipeline.length}</p><p className="text-xs text-muted-foreground">In Pipeline</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <UserCheck className="h-8 w-8 text-success" />
            <div><p className="text-2xl font-bold">{active.length}</p><p className="text-xs text-muted-foreground">Active Teachers</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-8 w-8 text-accent" />
            <div><p className="text-2xl font-bold">{teacherOnboarding.filter(t => t.stage === 'Application Review').length}</p><p className="text-xs text-muted-foreground">Awaiting Review</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div><p className="text-2xl font-bold">{teacherOnboarding.filter(t => t.stage === 'Training').length}</p><p className="text-xs text-muted-foreground">In Training</p></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4 text-admin" />Onboarding Pipeline</CardTitle>
          <CardDescription className="text-xs">Full teacher application and onboarding tracking.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {teacherOnboarding.map((t) => (
            <div key={t.id} className="flex items-center gap-4 p-3 rounded-md border hover:bg-muted/30 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.email} · Languages: {t.languages.join(', ')} · Applied: {t.appliedAt}</p>
              </div>
              <Badge className={STAGE_COLOR[t.stage] ?? 'bg-muted text-muted-foreground'}>{t.stage}</Badge>
              <div className="w-24 shrink-0">
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${t.progress}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground text-right mt-0.5">{t.progress}%</p>
              </div>
              {t.stage === 'Application Review' && (
                <Button size="sm" variant="outline" className="h-7 text-xs shrink-0">Review</Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
