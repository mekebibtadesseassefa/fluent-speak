import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  CheckCircle, XCircle, Eye, Clock, FileText, Calendar, Layers, BookOpen, Globe,
} from 'lucide-react';

// ─── Mock Data ───
const approvalQueue = [
  { id: '1', title: 'The Power of Vulnerability', framework: 'Fluent with TED', language: 'EN', level: 'B1–C1', curator: 'Content Admin', submitted: '1 day ago' },
  { id: '2', title: 'How Great Leaders Inspire Action', framework: 'Fluent with TED', language: 'EN', level: 'B2–C2', curator: 'Maria C.', submitted: '2 days ago' },
  { id: '3', title: 'Migración y Resiliencia', framework: 'Fluent with Global South', language: 'ES', level: 'B1–B2', curator: 'Maria C.', submitted: '1 day ago' },
  { id: '4', title: 'Climate Justice in the Global South', framework: 'Fluent with Global South', language: 'EN', level: 'B1–B2', curator: 'João P.', submitted: '3 days ago' },
];

const weeklyCalendar = [
  { week: 8, year: 2026, items: ['Negociação em Contextos Interculturais (PT)', 'The Danger of a Single Story (EN)', 'Renewable Energy Breakthroughs (EN)'], status: 'published' },
  { week: 9, year: 2026, items: ['The Power of Vulnerability (EN)', 'How Great Leaders Inspire Action (EN)'], status: 'partial' },
  { week: 10, year: 2026, items: ['Climate Justice in the Global South (EN)', "L'art de la conversation (FR)", 'Migración y Resiliencia (ES)'], status: 'draft' },
  { week: 11, year: 2026, items: [], status: 'empty' },
];

const frameworks = [
  { name: 'Fluent with TED', items: 42, active: true },
  { name: 'Fluent with News', items: 28, active: true },
  { name: 'Fluent with Global South', items: 15, active: true },
  { name: 'Fluent with Business', items: 22, active: true },
  { name: 'Fluent with Culture', items: 8, active: false },
  { name: 'Fluent with Science', items: 5, active: false },
];

const WEEK_STATUS: Record<string, { label: string; className: string }> = {
  published: { label: 'Published', className: 'bg-success/15 text-success border-success/30' },
  partial: { label: 'Partial', className: 'bg-accent/15 text-accent border-accent/30' },
  draft: { label: 'Draft', className: 'bg-muted text-muted-foreground' },
  empty: { label: 'Empty', className: 'bg-destructive/15 text-destructive border-destructive/30' },
};

const LANG_FLAG: Record<string, string> = { EN: '🇬🇧', ES: '🇪🇸', FR: '🇫🇷', PT: '🇧🇷' };

export default function ContentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Content Dashboard</h1>
        <p className="text-sm text-muted-foreground">Approval queue, publishing schedule, and framework management.</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending Approval', value: approvalQueue.length, icon: Clock, color: 'text-accent' },
          { label: 'Published This Month', value: 12, icon: CheckCircle, color: 'text-success' },
          { label: 'Total Content Items', value: 120, icon: FileText, color: 'text-primary' },
          { label: 'Active Frameworks', value: frameworks.filter(f => f.active).length, icon: Layers, color: 'text-admin' },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <m.icon className={`h-8 w-8 ${m.color}`} />
              <div>
                <p className="text-2xl font-bold">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Approval Queue */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><CheckCircle className="h-4 w-4 text-accent" />Approval Queue</CardTitle>
          <CardDescription className="text-xs">Review and approve submitted content items.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {approvalQueue.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-3 rounded-md border hover:bg-muted/30 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.framework} · {LANG_FLAG[item.language]} {item.language} · {item.level}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] text-muted-foreground">{item.curator} · {item.submitted}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button size="icon" variant="ghost" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-success hover:text-success"><CheckCircle className="h-3.5 w-3.5" /></Button>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive"><XCircle className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Publishing Calendar (compact) */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />Publishing Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {weeklyCalendar.map((w) => {
              const badge = WEEK_STATUS[w.status];
              return (
                <div key={w.week} className="rounded-md border p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Week {w.week}</p>
                    <Badge className={`${badge.className} text-[10px]`}>{badge.label}</Badge>
                  </div>
                  {w.items.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No content scheduled</p>
                  ) : (
                    <ul className="space-y-1">
                      {w.items.map((title, i) => (
                        <li key={i} className="text-xs text-muted-foreground truncate">• {title}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Frameworks */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-4 w-4 text-success" />Content Frameworks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {frameworks.map((fw) => (
              <div key={fw.name} className="flex items-center gap-4 p-3 rounded-md border">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{fw.name}</p>
                  <p className="text-xs text-muted-foreground">{fw.items} items</p>
                </div>
                <Switch checked={fw.active} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
