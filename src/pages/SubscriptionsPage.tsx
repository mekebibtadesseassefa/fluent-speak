import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, CreditCard, TrendingUp, Users } from 'lucide-react';

const subscriptionOverview = [
  { plan: 'Free', active: 342, mrr: 'R$ 0', churn: '12.1%' },
  { plan: 'Individual Basic', active: 487, mrr: 'R$ 62.823', churn: '5.2%' },
  { plan: 'Individual Plus', active: 128, mrr: 'R$ 29.312', churn: '3.8%' },
  { plan: 'Corporate Basic', active: 215, mrr: 'R$ 38.485', churn: '2.1%' },
  { plan: 'Corporate Plus', active: 71, mrr: 'R$ 21.229', churn: '1.4%' },
  { plan: 'Enterprise', active: 8, mrr: 'R$ 52.000', churn: '0%' },
];

const totalActive = subscriptionOverview.reduce((s, r) => s + r.active, 0);

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Subscriptions</h1>
        <p className="text-sm text-muted-foreground">Overview of all subscription plans and revenue.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><DollarSign className="h-8 w-8 text-success" /><div><p className="text-2xl font-bold">R$ 203.849</p><p className="text-xs text-muted-foreground">Total MRR</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><CreditCard className="h-8 w-8 text-primary" /><div><p className="text-2xl font-bold">{totalActive.toLocaleString()}</p><p className="text-xs text-muted-foreground">Active Subscriptions</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><TrendingUp className="h-8 w-8 text-admin" /><div><p className="text-2xl font-bold">+4.2%</p><p className="text-xs text-muted-foreground">MRR Growth</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Users className="h-8 w-8 text-accent" /><div><p className="text-2xl font-bold">6.4%</p><p className="text-xs text-muted-foreground">Avg Churn</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" />Plan Breakdown</CardTitle>
          <CardDescription className="text-xs">Active subscriptions and revenue by plan tier.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Active</TableHead>
                <TableHead className="text-right">Monthly Revenue</TableHead>
                <TableHead className="text-right">Churn Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptionOverview.map((s) => (
                <TableRow key={s.plan}>
                  <TableCell className="font-medium">{s.plan}</TableCell>
                  <TableCell className="text-right">{s.active.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{s.mrr}</TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{s.churn}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
