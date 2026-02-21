import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RotateCcw, CheckCircle, XCircle } from 'lucide-react';

const refundLog = [
  { id: '1', student: 'João Silva', amount: 'R$ 129', reason: 'Duplicate charge', date: '2026-02-18', status: 'approved' },
  { id: '2', student: 'Maria Santos', amount: 'R$ 229', reason: 'Downgrade refund', date: '2026-02-15', status: 'approved' },
  { id: '3', student: 'Pedro Costa', amount: 'R$ 129', reason: 'Service complaint', date: '2026-02-12', status: 'rejected' },
  { id: '4', student: 'Ana Oliveira', amount: 'R$ 99', reason: 'Cancelled within trial', date: '2026-02-08', status: 'approved' },
  { id: '5', student: 'Carlos Mendes', amount: 'R$ 229', reason: 'Billing error', date: '2026-02-05', status: 'approved' },
];

const STATUS: Record<string, { label: string; className: string }> = {
  approved: { label: 'Approved', className: 'bg-success/15 text-success border-success/30' },
  rejected: { label: 'Rejected', className: 'bg-destructive/15 text-destructive border-destructive/30' },
};

export default function RefundsPage() {
  const approved = refundLog.filter(r => r.status === 'approved');
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Refunds</h1>
        <p className="text-sm text-muted-foreground">Refund processing log and history.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><RotateCcw className="h-8 w-8 text-primary" /><div><p className="text-2xl font-bold">{refundLog.length}</p><p className="text-xs text-muted-foreground">Total Refunds (MTD)</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><CheckCircle className="h-8 w-8 text-success" /><div><p className="text-2xl font-bold">{approved.length}</p><p className="text-xs text-muted-foreground">Approved</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><XCircle className="h-8 w-8 text-destructive" /><div><p className="text-2xl font-bold">{refundLog.length - approved.length}</p><p className="text-xs text-muted-foreground">Rejected</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><RotateCcw className="h-4 w-4 text-destructive" />Refund Log</CardTitle>
          <CardDescription className="text-xs">Complete history of refund requests and outcomes.</CardDescription>
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
                const badge = STATUS[r.status];
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
