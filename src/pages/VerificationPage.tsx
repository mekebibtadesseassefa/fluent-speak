import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Shield, UserCheck, UserX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialQueue = [
  { id: '1', name: 'Carlos Mendes', cpf: '***.456.789-**', type: 'CPF', submitted: '2 hrs ago', status: 'pending' },
  { id: '2', name: 'TechBrasil Ltda', cpf: '12.345.678/0001-**', type: 'CNPJ', submitted: '5 hrs ago', status: 'pending' },
  { id: '3', name: 'Ana Oliveira', cpf: '***.123.456-**', type: 'CPF', submitted: '1 day ago', status: 'pending' },
  { id: '4', name: 'Sofia Ribeiro', cpf: '***.789.012-**', type: 'CPF', submitted: '1 day ago', status: 'pending' },
  { id: '5', name: 'Roberto Almeida', cpf: '***.234.567-**', type: 'CPF', submitted: '2 days ago', status: 'pending' },
  { id: '6', name: 'GreenEnergy BR', cpf: '33.444.555/0001-**', type: 'CNPJ', submitted: '3 days ago', status: 'pending' },
];

export default function VerificationPage() {
  const { toast } = useToast();
  const [queue, setQueue] = useState(initialQueue);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = (id: string, name: string) => {
    setQueue((q) => q.filter((v) => v.id !== id));
    toast({ title: 'Approved', description: `${name} has been verified successfully.` });
  };

  const handleReject = (id: string, name: string) => {
    setQueue((q) => q.filter((v) => v.id !== id));
    toast({ title: 'Rejected', description: `${name}'s verification was rejected.${rejectReason ? ` Reason: ${rejectReason}` : ''}`, variant: 'destructive' });
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">User Verification</h1>
        <p className="text-sm text-muted-foreground">CPF/CNPJ verification queue — {queue.length} pending.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Shield className="h-8 w-8 text-accent" />
            <div>
              <p className="text-2xl font-bold">{queue.length}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <UserCheck className="h-8 w-8 text-success" />
            <div>
              <p className="text-2xl font-bold">128</p>
              <p className="text-xs text-muted-foreground">Approved (MTD)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <UserX className="h-8 w-8 text-destructive" />
            <div>
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs text-muted-foreground">Rejected (MTD)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4 text-primary" />Verification Queue</CardTitle>
          <CardDescription className="text-xs">Review submitted documents and approve or reject identity verification requests.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queue.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{v.name}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">{v.cpf}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{v.type}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{v.submitted}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="outline" className="h-7 text-xs text-success border-success/30 hover:bg-success/10" onClick={() => handleApprove(v.id, v.name)}><UserCheck className="h-3 w-3 mr-1" />Approve</Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="h-7 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"><UserX className="h-3 w-3 mr-1" />Reject</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reject verification?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will reject <span className="font-semibold">{v.name}</span>'s {v.type} verification. They will need to resubmit their documents.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <Textarea
                            placeholder="Reason for rejection (optional)..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="min-h-[80px]"
                          />
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setRejectReason('')}>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => handleReject(v.id, v.name)}>Reject</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {queue.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">All verifications processed!</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
