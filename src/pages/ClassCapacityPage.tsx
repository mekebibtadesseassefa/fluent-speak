import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, AlertTriangle, Users, CheckCircle } from 'lucide-react';

const classCapacity = [
  { id: '1', language: 'EN', level: 'Intermediate', day: 'Tuesday 19:00', enrolled: 10, capacity: 12, facilitator: 'Amina K.' },
  { id: '2', language: 'EN', level: 'Advanced', day: 'Thursday 19:00', enrolled: 8, capacity: 12, facilitator: 'David N.' },
  { id: '3', language: 'ES', level: 'Beginner', day: 'Wednesday 18:00', enrolled: 12, capacity: 12, facilitator: 'Carlos M.' },
  { id: '4', language: 'FR', level: 'Intermediate', day: 'Monday 19:00', enrolled: 5, capacity: 12, facilitator: 'Fatima R.' },
  { id: '5', language: 'EN', level: 'Beginner', day: 'Monday 18:00', enrolled: 9, capacity: 12, facilitator: 'David N.' },
  { id: '6', language: 'PT', level: 'Intermediate', day: 'Friday 17:00', enrolled: 11, capacity: 12, facilitator: 'Carlos M.' },
];

export default function ClassCapacityPage() {
  const full = classCapacity.filter(c => c.enrolled >= c.capacity).length;
  const nearFull = classCapacity.filter(c => c.enrolled >= c.capacity * 0.8 && c.enrolled < c.capacity).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Class Capacity</h1>
        <p className="text-sm text-muted-foreground">Monitor group class enrollment and capacity across all languages.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            <div><p className="text-2xl font-bold">{classCapacity.length}</p><p className="text-xs text-muted-foreground">Total Groups</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <div><p className="text-2xl font-bold">{full}</p><p className="text-xs text-muted-foreground">At Capacity</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="h-8 w-8 text-accent" />
            <div><p className="text-2xl font-bold">{nearFull}</p><p className="text-xs text-muted-foreground">Near Capacity</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-success" />
            <div><p className="text-2xl font-bold">{classCapacity.length - full - nearFull}</p><p className="text-xs text-muted-foreground">Available</p></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />All Group Classes</CardTitle>
          <CardDescription className="text-xs">Current enrollment vs capacity for each scheduled group.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Language</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Facilitator</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classCapacity.map((c) => {
                const pct = c.enrolled / c.capacity;
                return (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.language}</TableCell>
                    <TableCell>{c.level}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.day}</TableCell>
                    <TableCell className="text-xs">{c.facilitator}</TableCell>
                    <TableCell>
                      <span className={`text-sm font-medium ${pct >= 1 ? 'text-destructive' : pct >= 0.8 ? 'text-accent' : 'text-foreground'}`}>
                        {c.enrolled}/{c.capacity}
                      </span>
                    </TableCell>
                    <TableCell>
                      {pct >= 1 && <Badge className="bg-destructive/15 text-destructive text-[10px] border-destructive/30">Full</Badge>}
                      {pct >= 0.8 && pct < 1 && <Badge className="bg-accent/15 text-accent text-[10px] border-accent/30">Near Full</Badge>}
                      {pct < 0.8 && <Badge className="bg-success/15 text-success text-[10px] border-success/30">Available</Badge>}
                    </TableCell>
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
