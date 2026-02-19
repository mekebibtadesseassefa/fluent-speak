import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dashboardMetrics, healthCards, recentActivity } from '@/lib/mock-data';
import { DollarSign, Users, GraduationCap, FileText, TrendingUp, Building2, UserPlus, XCircle, BookOpen, Calendar } from 'lucide-react';

const metricIcons = [DollarSign, Users, GraduationCap, FileText];
const metricEntries = [
  { label: 'Total MRR', value: dashboardMetrics.totalMRR },
  { label: 'Active Subscriptions', value: dashboardMetrics.activeSubscriptions.toLocaleString() },
  { label: 'Active Teachers', value: dashboardMetrics.activeTeachers },
  { label: 'Content Published', value: dashboardMetrics.contentPublished },
];

const activityIcons: Record<string, React.ElementType> = {
  company: Building2, teacher: UserPlus, cancel: XCircle, content: BookOpen, class: Calendar,
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Command Center</h1>
        <p className="text-sm text-muted-foreground">Platform overview and key metrics</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricEntries.map((m, i) => {
          const Icon = metricIcons[i];
          return (
            <Card key={m.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                  <p className="text-xl font-bold text-foreground">{m.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Health Cards */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Platform Health</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {healthCards.map((h) => (
            <Card key={h.label}>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">{h.label}</p>
                <p className="text-2xl font-bold text-foreground">{h.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-xs text-success">{h.trend}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Recent Activity</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentActivity.map((a) => {
                const Icon = activityIcons[a.type] || FileText;
                return (
                  <div key={a.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-foreground flex-1">{a.text}</p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{a.time}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
