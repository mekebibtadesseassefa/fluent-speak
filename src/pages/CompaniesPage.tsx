import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { companies, type Company } from '@/lib/mock-data';
import { Search, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CompanyDetailDialog from '@/components/CompanyDetailDialog';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';

interface PendingCompany {
  id: string;
  name: string;
  cnpj: string | null;
  billing_email: string | null;
  email_domains: string[] | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  active: 'bg-success text-success-foreground',
  suspended: 'bg-accent text-accent-foreground',
  terminated: 'bg-destructive text-destructive-foreground',
};

export default function CompaniesPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'view' | 'override' | 'suspend' | 'terminate'>('view');
  const [pending, setPending] = useState<PendingCompany[]>([]);

  const loadPending = async () => {
    const { data } = await supabase
      .from('companies')
      .select('id, name, cnpj, billing_email, email_domains, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    setPending((data as PendingCompany[]) ?? []);
  };

  useEffect(() => { loadPending(); }, []);

  const approve = async (id: string) => {
    const { error } = await supabase.from('companies').update({ status: 'active' }).eq('id', id);
    if (error) {
      toast({ title: t('common.error'), description: error.message, variant: 'destructive' });
      return;
    }
    await supabase.from('company_employees').update({ active: true, approved_at: new Date().toISOString() }).eq('company_id', id);
    toast({ title: t('companySignup.approved') });
    loadPending();
  };

  const filtered = companies.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openCompany = (company: Company) => {
    setSelectedCompany(company);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Company Management</h1>
        <p className="text-sm text-muted-foreground">{companies.length} companies registered</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            {t('companySignup.pendingTitle')}
            {pending.length > 0 && <Badge variant="secondary">{pending.length}</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('companySignup.noPending')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('common.name')}</TableHead>
                  <TableHead>{t('auth.cnpj')}</TableHead>
                  <TableHead>{t('companySignup.emailDomains')}</TableHead>
                  <TableHead>{t('companySignup.billingEmail')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pending.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{p.cnpj ?? '—'}</TableCell>
                    <TableCell className="text-xs">{(p.email_domains ?? []).join(', ') || '—'}</TableCell>
                    <TableCell className="text-xs">{p.billing_email ?? '—'}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => approve(p.id)}>{t('companySignup.approve')}</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search companies..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="terminated">Terminated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Employees</TableHead>
                <TableHead className="text-right">MRR</TableHead>
                <TableHead>Renewal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} className="cursor-pointer" onClick={() => openCompany(c)}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-muted-foreground text-xs font-mono">{c.cnpj}</TableCell>
                  <TableCell>{c.plan}</TableCell>
                  <TableCell className="text-right">{c.employees}</TableCell>
                  <TableCell className="text-right font-medium">{c.mrr}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{c.renewalDate}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[c.status]}>{c.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openCompany(c)}>View</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openCompany(c)}>Override Plan</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openCompany(c)}>Suspend</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => openCompany(c)}>Terminate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CompanyDetailDialog
        company={selectedCompany}
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setSelectedCompany(null); }}
      />
    </div>
  );
}
