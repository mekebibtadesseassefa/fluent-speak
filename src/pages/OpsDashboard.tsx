import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckSquare, Users, Calendar, AlertTriangle, Clock, UserCheck, UserX, Shield } from 'lucide-react';

// ─── Mock Data ───
const verificationQueue = [
  { id: '1', name: 'Carlos Mendes', cpf: '***.456.789-**', type: 'CPF', submitted: '2 hrs ago', status: 'pending' },
  { id: '2', name: 'TechBrasil Ltda', cpf: '12.345.678/0001-**', type: 'CNPJ', submitted: '5 hrs ago', status: 'pending' },
  { id: '3', name: 'Ana Oliveira', cpf: '***.123.456-**', type: 'CPF', submitted: '1 day ago', status: 'pending' },
  { id: '4', name: 'Sofia Ribeiro', cpf: '***.789.012-**', type: 'CPF', submitted: '1 day ago', status: 'pending' },
];

const facilitatorOnboarding = [
  { id: '1', name: 'Amina K.', languages: ['EN', 'FR'], stage: 'Training', progress: 75 },
  { id: '2', name: 'Carlos M.', languages: ['ES', 'PT'], stage: 'Application Review', progress: 25 },
  { id: '3', name: 'Fatima R.', languages: ['EN', 'AR'], stage: 'Profile Complete', progress: 50 },
  { id: '4', name: 'David N.', languages: ['EN'], stage: 'Active', progress: 100 },
];

const classCapacity = [
  { id: '1', language: 'EN', level: 'Intermediate', day: 'Tuesday 19:00', enrolled: 10, capacity: 12, facilitator: 'Amina K.' },
  { id: '2', language: 'EN', level: 'Advanced', day: 'Thursday 19:00', enrolled: 8, capacity: 12, facilitator: 'David N.' },
  { id: '3', language: 'ES', level: 'Beginner', day: 'Wednesday 18:00', enrolled: 12, capacity: 12, facilitator: 'Carlos M.' },
  { id: '4', language: 'FR', level: 'Intermediate', day: 'Monday 19:00', enrolled: 5, capacity: 12, facilitator: 'Fatima R.' },
];

const STAGE_COLOR: Record<string, string> = {
  'Application Review': 'bg-accent/15 text-accent border-accent/30',
  'Profile Complete': 'bg-primary/15 text-primary border-primary/30',
  'Training': 'bg-admin/15 text-admin border-admin/30',
  'Active': 'bg-success/15 text-success border-success/30',
};

export default function OpsDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Operations Dashboard</h1>
        <p className="text-sm text-muted-foreground">User verification, teacher onboarding, and class capacity management.</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending Verifications', value: verificationQueue.length, icon: Shield, color: 'text-accent' },
          { label: 'Teachers Onboarding', value: teacherOnboarding.filter(t => t.stage !== 'Active').length, icon: Users, color: 'text-admin' },
          { label: 'Active Teachers', value: teacherOnboarding.filter(t => t.stage === 'Active').length, icon: UserCheck, color: 'text-success' },
          { label: 'Groups at Capacity', value: classCapacity.filter(c => c.enrolled >= c.capacity).length, icon: AlertTriangle, color: 'text-destructive' },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <m.icon className={`h-8 w-8 ${m.color}`} />
              <div>
                <p className="text-2xl font-bold">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Verification Queue */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><CheckSquare className="h-4 w-4 text-primary" />CPF / CNPJ Verification Queue</CardTitle>
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
              {verificationQueue.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{v.name}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">{v.cpf}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{v.type}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{v.submitted}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="outline" className="h-7 text-xs text-success border-success/30 hover:bg-success/10"><UserCheck className="h-3 w-3 mr-1" />Approve</Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"><UserX className="h-3 w-3 mr-1" />Reject</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Teacher Onboarding */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4 text-admin" />Teacher Onboarding Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teacherOnboarding.map((t) => (
              <div key={t.id} className="flex items-center gap-4 p-3 rounded-md border">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">Languages: {t.languages.join(', ')}</p>
                </div>
                <Badge className={STAGE_COLOR[t.stage] ?? 'bg-muted text-muted-foreground'}>{t.stage}</Badge>
                <div className="w-24">
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${t.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Class Capacity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />Group Class Capacity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Language</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Capacity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classCapacity.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.language}</TableCell>
                  <TableCell>{c.level}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{c.day}</TableCell>
                  <TableCell className="text-xs">{c.teacher}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${c.enrolled >= c.capacity ? 'text-destructive' : 'text-foreground'}`}>
                        {c.enrolled}/{c.capacity}
                      </span>
                      {c.enrolled >= c.capacity && <Badge className="bg-destructive/15 text-destructive text-[10px] border-destructive/30">Full</Badge>}
                    </div>
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
