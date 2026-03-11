import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, TrendingUp, CreditCard, RotateCcw, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

// ─── Mock Data ───
const subscriptionOverview = [
  { plan: 'Free', active: 342, mrr: 'R$ 0' },
  { plan: 'Individual Basic', active: 487, mrr: 'R$ 62.823' },
  { plan: 'Individual Plus', active: 128, mrr: 'R$ 29.312' },
  { plan: 'Corporate Basic', active: 215, mrr: 'R$ 38.485' },
  { plan: 'Corporate Plus', active: 71, mrr: 'R$ 21.229' },
];

const payoutQueue = [
  { id: '1', facilitator: 'Amina K.', period: 'Feb 1–15', classes: 18, gross: 'R$ 2.340', status: 'pending' },
  { id: '2', facilitator: 'David N.', period: 'Feb 1–15', classes: 22, gross: 'R$ 2.860', status: 'pending' },
  { id: '3', facilitator: 'Carlos M.', period: 'Feb 1–15', classes: 14, gross: 'R$ 1.820', status: 'pending' },
  { id: '4', facilitator: 'Fatima R.', period: 'Jan 16–31', classes: 16, gross: 'R$ 2.080', status: 'paid' },
  { id: '5', facilitator: 'Amina K.', period: 'Jan 16–31', classes: 20, gross: 'R$ 2.600', status: 'paid' },
];

const refundLog = [
  { id: '1', student: 'João Silva', amount: 'R$ 129', reason: 'Duplicate charge', date: '2026-02-18', status: 'approved' },
  { id: '2', student: 'Maria Santos', amount: 'R$ 229', reason: 'Downgrade refund', date: '2026-02-15', status: 'approved' },
  { id: '3', student: 'Pedro Costa', amount: 'R$ 129', reason: 'Service complaint', date: '2026-02-12', status: 'rejected' },
];

const PAYOUT_STATUS: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-accent/15 text-accent border-accent/30' },
  processing: { label: 'Processing', className: 'bg-primary/15 text-primary border-primary/30' },
  paid: { label: 'Paid', className: 'bg-success/15 text-success border-success/30' },
};

const REFUND_STATUS: Record<string, { label: string; className: string }> = {
  approved: { label: 'Approved', className: 'bg-success/15 text-success border-success/30' },
  rejected: { label: 'Rejected', className: 'bg-destructive/15 text-destructive border-destructive/30' },
  pending: { label: 'Pending', className: 'bg-accent/15 text-accent border-accent/30' },
};

export default function FinanceDashboard() {
  const totalMRR = 'R$ 151.849';
  const pendingPayouts = payoutQueue.filter(p => p.status === 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Finance Dashboard</h1>
        <p className="text-sm text-muted-foreground">Subscriptions, facilitator payouts, and refund management.</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total MRR', value: totalMRR, icon: DollarSign, color: 'text-success', trend: '+4.2%', up: true },
          { label: 'Active Subscriptions', value: '1,243', icon: CreditCard, color: 'text-primary', trend: '+12 this week', up: true },
          { label: 'Pending Payouts', value: pendingPayouts.length, icon: Clock, color: 'text-accent', trend: `R$ ${pendingPayouts.reduce((_, p) => _ + parseFloat(p.gross.replace(/[^\d]/g, '')), 0).toLocaleString('pt-BR')}`, up: false },
          { label: 'Refunds (MTD)', value: refundLog.filter(r => r.status === 'approved').length, icon: RotateCcw, color: 'text-destructive', trend: 'R$ 358', up: false },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <m.icon className={`h-8 w-8 ${m.color}`} />
              <div>
                <p className="text-2xl font-bold">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {m.up ? <ArrowUpRight className="h-3 w-3 text-success" /> : <ArrowDownRight className="h-3 w-3 text-muted-foreground" />}
                  <span className="text-[10px] text-muted-foreground">{m.trend}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Subscription Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" />Subscription Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Active</TableHead>
                <TableHead className="text-right">Monthly Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptionOverview.map((s) => (
                <TableRow key={s.plan}>
                  <TableCell className="font-medium">{s.plan}</TableCell>
                  <TableCell className="text-right">{s.active.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{s.mrr}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payout Queue */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2"><DollarSign className="h-4 w-4 text-accent" />Facilitator Payout Queue</CardTitle>
          <Button size="sm" className="h-7 text-xs">Approve Batch</Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Facilitator</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Classes</TableHead>
                <TableHead className="text-right">Gross</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payoutQueue.map((p) => {
                const badge = PAYOUT_STATUS[p.status];
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.teacher}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.period}</TableCell>
                    <TableCell className="text-right">{p.classes}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{p.gross}</TableCell>
                    <TableCell><Badge className={badge.className}>{badge.label}</Badge></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Refund Log */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><RotateCcw className="h-4 w-4 text-destructive" />Refund Log</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {refundLog.map((r) => {
                const badge = REFUND_STATUS[r.status];
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.student}</TableCell>
                    <TableCell className="font-mono text-sm">{r.amount}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.reason}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.date}</TableCell>
                    <TableCell><Badge className={badge.className}>{badge.label}</Badge></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
