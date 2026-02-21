import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { type Company, employees } from '@/lib/mock-data';
import { Building2, Users, Calendar, CreditCard, AlertTriangle, Ban } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Props {
  company: Company | null;
  open: boolean;
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  active: 'bg-success text-success-foreground',
  suspended: 'bg-accent text-accent-foreground',
  terminated: 'bg-destructive text-destructive-foreground',
  invited: 'bg-secondary text-secondary-foreground',
  inactive: 'bg-muted text-muted-foreground',
};

const PLANS = ['Corporate Basic', 'Corporate Plus', 'Enterprise'];

export default function CompanyDetailDialog({ company, open, onClose }: Props) {
  const [overrideOpen, setOverrideOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [newPlan, setNewPlan] = useState('');

  if (!company) return null;

  const companyEmployees = employees.filter((e) => e.companyId === company.id);

  const handleOverride = () => {
    toast({ title: 'Plan overridden', description: `${company.name} plan changed to ${newPlan}.` });
    setOverrideOpen(false);
  };

  const handleSuspend = () => {
    toast({ title: 'Company suspended', description: `${company.name} has been suspended.` });
    setSuspendOpen(false);
    onClose();
  };

  const handleTerminate = () => {
    toast({ title: 'Company terminated', description: `${company.name} contract has been terminated.`, variant: 'destructive' });
    setTerminateOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">{company.name}</DialogTitle>
                <DialogDescription className="font-mono text-xs">{company.cnpj}</DialogDescription>
              </div>
              <Badge className={`ml-auto ${statusColors[company.status]}`}>{company.status}</Badge>
            </div>
          </DialogHeader>

          <Tabs defaultValue="overview" className="mt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="employees">Employees ({companyEmployees.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Plan</p>
                      <p className="font-semibold text-sm">{company.plan}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Employees</p>
                      <p className="font-semibold text-sm">{company.employees}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">MRR</p>
                      <p className="font-semibold text-sm">{company.mrr}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Renewal</p>
                      <p className="font-semibold text-sm">{company.renewalDate}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <Button size="sm" variant="outline" onClick={() => { setNewPlan(company.plan); setOverrideOpen(true); }}>
                  Override Plan
                </Button>
                {company.status === 'active' && (
                  <Button size="sm" variant="outline" onClick={() => setSuspendOpen(true)}>
                    <AlertTriangle className="h-3.5 w-3.5 mr-1" /> Suspend
                  </Button>
                )}
                {company.status !== 'terminated' && (
                  <Button size="sm" variant="destructive" onClick={() => setTerminateOpen(true)}>
                    <Ban className="h-3.5 w-3.5 mr-1" /> Terminate
                  </Button>
                )}
              </div>
            </TabsContent>

            <TabsContent value="employees" className="mt-4">
              {companyEmployees.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No employees registered for this company.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companyEmployees.map((emp) => (
                      <TableRow key={emp.id}>
                        <TableCell className="font-medium">{emp.name}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">{emp.email}</TableCell>
                        <TableCell>{emp.level}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={statusColors[emp.status]}>{emp.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Override Plan Dialog */}
      <AlertDialog open={overrideOpen} onOpenChange={setOverrideOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Override Plan — {company.name}</AlertDialogTitle>
            <AlertDialogDescription>Select a new plan for this company. This will take effect immediately.</AlertDialogDescription>
          </AlertDialogHeader>
          <Select value={newPlan} onValueChange={setNewPlan}>
            <SelectTrigger><SelectValue placeholder="Select plan" /></SelectTrigger>
            <SelectContent>
              {PLANS.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleOverride} disabled={!newPlan || newPlan === company.plan}>
              Confirm Override
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Suspend Confirmation */}
      <AlertDialog open={suspendOpen} onOpenChange={setSuspendOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend {company.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately revoke access for all {company.employees} employees. The company can be reactivated later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSuspend}>Suspend Company</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Terminate Confirmation */}
      <AlertDialog open={terminateOpen} onOpenChange={setTerminateOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terminate {company.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action is permanent. All {company.employees} employee accounts will be deactivated and billing will stop. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleTerminate} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Terminate Contract
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
