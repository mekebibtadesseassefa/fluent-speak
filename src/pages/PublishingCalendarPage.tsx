import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, Clock, FileText } from 'lucide-react';

const weeklyCalendar = [
  { week: 7, year: 2026, items: ['Renewable Energy Breakthroughs 2026 (EN)'], status: 'published' },
  { week: 8, year: 2026, items: ['Negociação em Contextos Interculturais (PT)', 'The Danger of a Single Story (EN)'], status: 'published' },
  { week: 9, year: 2026, items: ['The Power of Vulnerability (EN)', 'How Great Leaders Inspire Action (EN)'], status: 'partial' },
  { week: 10, year: 2026, items: ['Climate Justice in the Global South (EN)', "L'art de la conversation (FR)", 'Migración y Resiliencia (ES)'], status: 'draft' },
  { week: 11, year: 2026, items: [], status: 'empty' },
  { week: 12, year: 2026, items: [], status: 'empty' },
];

const WEEK_STATUS: Record<string, { label: string; className: string }> = {
  published: { label: 'Published', className: 'bg-success/15 text-success border-success/30' },
  partial: { label: 'Partial', className: 'bg-accent/15 text-accent border-accent/30' },
  draft: { label: 'Draft', className: 'bg-muted text-muted-foreground' },
  empty: { label: 'Empty', className: 'bg-destructive/15 text-destructive border-destructive/30' },
};

export default function PublishingCalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Publishing Calendar</h1>
        <p className="text-sm text-muted-foreground">Weekly content publishing schedule and status overview.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><CheckCircle className="h-8 w-8 text-success" /><div><p className="text-2xl font-bold">{weeklyCalendar.filter(w => w.status === 'published').length}</p><p className="text-xs text-muted-foreground">Published Weeks</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Clock className="h-8 w-8 text-accent" /><div><p className="text-2xl font-bold">{weeklyCalendar.filter(w => w.status === 'partial' || w.status === 'draft').length}</p><p className="text-xs text-muted-foreground">In Progress</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><FileText className="h-8 w-8 text-primary" /><div><p className="text-2xl font-bold">{weeklyCalendar.reduce((s, w) => s + w.items.length, 0)}</p><p className="text-xs text-muted-foreground">Total Scheduled</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Calendar className="h-8 w-8 text-destructive" /><div><p className="text-2xl font-bold">{weeklyCalendar.filter(w => w.status === 'empty').length}</p><p className="text-xs text-muted-foreground">Empty Weeks</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />Weekly Schedule</CardTitle>
          <CardDescription className="text-xs">Content scheduled for upcoming weeks.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {weeklyCalendar.map((w) => {
              const badge = WEEK_STATUS[w.status];
              return (
                <div key={w.week} className="rounded-md border p-4 space-y-2 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Week {w.week}, {w.year}</p>
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
    </div>
  );
}
