import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Clock, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-accent/10 text-accent',
  processing: 'bg-primary/10 text-primary',
  paid: 'bg-success/10 text-success',
};

export default function TeacherIncomePage() {
  const { user } = useAuth();
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadPayouts();
  }, [user]);

  const loadPayouts = async () => {
    const { data } = await supabase
      .from('teacher_payouts')
      .select('*')
      .eq('teacher_id', user!.id)
      .order('period_end', { ascending: false });
    if (data) setPayouts(data);
    setLoading(false);
  };

  const totalEarned = payouts.filter(p => p.status === 'paid').reduce((s, p) => s + Number(p.net_amount), 0);
  const pending = payouts.filter(p => p.status === 'pending').reduce((s, p) => s + Number(p.net_amount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Income & Payouts</h1>
        <p className="text-sm text-muted-foreground">Track your earnings and payout history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10"><DollarSign className="h-5 w-5 text-success" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Total Earned</p>
              <p className="text-2xl font-bold">R$ {totalEarned.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10"><Clock className="h-5 w-5 text-accent" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Payout</p>
              <p className="text-2xl font-bold">R$ {pending.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><FileText className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Payout Schedule</p>
              <p className="text-sm font-medium">1st & 15th monthly</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Payout History</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : payouts.length === 0 ? (
            <p className="text-muted-foreground text-sm">No payouts yet. Complete classes to start earning!</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Gross</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Net</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-sm">{p.period_start} → {p.period_end}</TableCell>
                    <TableCell>R$ {Number(p.gross_amount).toFixed(2)}</TableCell>
                    <TableCell className="text-muted-foreground">R$ {Number(p.platform_fee).toFixed(2)}</TableCell>
                    <TableCell className="font-medium">R$ {Number(p.net_amount).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[p.status] || ''}>{p.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
