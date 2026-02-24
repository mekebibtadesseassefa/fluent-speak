import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, TrendingUp, Clock, Calendar, Search } from 'lucide-react';

interface EmployeeRow {
  id: string;
  active: boolean;
  verified_year: number | null;
  approved_at: string | null;
  profiles: { full_name: string; cpf: string | null } | null;
}

export default function HRDashboardPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<EmployeeRow[]>([]);
  const [company, setCompany] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    // Find user's company
    const { data: empRecord } = await supabase
      .from('company_employees')
      .select('company_id')
      .eq('user_id', user!.id)
      .eq('active', true)
      .single();

    if (!empRecord) { setLoading(false); return; }

    const [companyRes, employeesRes] = await Promise.all([
      supabase.from('companies').select('*').eq('id', empRecord.company_id).single(),
      supabase.from('company_employees')
        .select('id, active, verified_year, approved_at, profiles!company_employees_user_id_fkey(full_name, cpf)')
        .eq('company_id', empRecord.company_id)
        .order('created_at', { ascending: false }),
    ]);

    if (companyRes.data) setCompany(companyRes.data);
    if (employeesRes.data) setEmployees(employeesRes.data as EmployeeRow[]);
    setLoading(false);
  };

  const maskCPF = (cpf: string | null) => {
    if (!cpf || cpf.length !== 11) return '***.***.***-**';
    return `***.***.${ cpf.slice(6, 9) }-${ cpf.slice(9) }`;
  };

  const activeCount = employees.filter(e => e.active).length;
  const pendingCount = employees.filter(e => !e.active && !e.approved_at).length;

  const filtered = employees.filter(e =>
    !search || e.profiles?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>;
  if (!company) return <div className="p-6 text-muted-foreground">No company found for your account.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">{company.name}</h1>
        <p className="text-sm text-muted-foreground">HR Dashboard · Plan: {company.plan_type}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10"><Users className="h-5 w-5 text-success" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Active Employees</p>
              <p className="text-2xl font-bold">{activeCount}/{company.employee_limit}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10"><Clock className="h-5 w-5 text-accent" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Approval</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><TrendingUp className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Join Code</p>
              <p className="text-2xl font-bold font-mono">{company.join_code || '—'}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-navy/10"><Calendar className="h-5 w-5 text-navy" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={company.status === 'active' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}>
                {company.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-lg">Employees</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(e => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.profiles?.full_name || '—'}</TableCell>
                  <TableCell className="font-mono text-sm">{maskCPF(e.profiles?.cpf || null)}</TableCell>
                  <TableCell>
                    <Badge variant={e.active ? 'default' : 'secondary'}>
                      {e.active ? 'Active' : e.approved_at ? 'Inactive' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>{e.verified_year || '—'}</TableCell>
                  <TableCell>
                    {!e.active && !e.approved_at && (
                      <Button size="sm" variant="secondary">Approve</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
