import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, Clock, CheckCircle } from 'lucide-react';

const payoutQueue = [
  { id: '1', teacher: 'Amina K.', period: 'Feb 1–15', classes: 18, gross: 'R$ 2.340', status: 'pending' },
  { id: '2', teacher: 'David N.', period: 'Feb 1–15', classes: 22, gross: 'R$ 2.860', status: 'pending' },
  { id: '3', teacher: 'Carlos M.', period: 'Feb 1–15', classes: 14, gross: 'R$ 1.820', status: 'pending' },
  { id: '4', teacher: 'Fatima R.', period: 'Jan 16–31', classes: 16, gross: 'R$ 2.080', status: 'paid' },
  { id: '5', teacher: 'Amina K.', period: 'Jan 16–31', classes: 20, gross: 'R$ 2.600', status: 'paid' },
  { id: '6', teacher: 'David N.', period: 'Jan 16–31', classes: 19, gross: 'R$ 2.470', status: 'paid' },
  { id: '7', teacher: 'Kofi A.', period: 'Feb 1–15', classes: 10, gross: 'R$ 1.300', status: 'pending' },
];

const STATUS: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-accent/15 text-accent border-accent/30' },
  paid: { label: 'Paid', className: 'bg-success/15 text-success border-success/30' },
};

export default function PayoutsPage() {
  const pending = payoutQueue.filter(p => p.status === 'pending');
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Teacher Payouts</h1>
        <p className="text-sm text-muted-foreground">Manage teacher payout batches and processing.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><Clock className="h-8 w-8 text-accent" /><div><p className="text-2xl font-bold">{pending.length}</p><p className="text-xs text-muted-foreground">Pending Payouts</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><CheckCircle className="h-8 w-8 text-success" /><div><p className="text-2xl font-bold">{payoutQueue.length - pending.length}</p><p className="text-xs text-muted-foreground">Paid This Month</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><DollarSign className="h-8 w-8 text-primary" /><div><p className="text-2xl font-bold">R$ 15.470</p><p className="text-xs text-muted-foreground">Total This Month</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2"><DollarSign className="h-4 w-4 text-accent" />Payout Queue</CardTitle>
            <CardDescription className="text-xs mt-1">Review and approve teacher payment batches.</CardDescription>
          </div>
          <Button size="sm" className="h-7 text-xs">Approve All Pending</Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Classes</TableHead>
                <TableHead className="text-right">Gross</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payoutQueue.map((p) => {
                const badge = STATUS[p.status];
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
    </div>
  );
}
