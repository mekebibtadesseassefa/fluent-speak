import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { auditEntries } from '@/lib/mock-data';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';

export default function AuditLogPage() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = auditEntries.filter((e) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return e.action.includes(s) || e.actor.toLowerCase().includes(s) || e.resource.toLowerCase().includes(s);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Audit Log</h1>
        <p className="text-sm text-muted-foreground">Immutable record of all admin actions</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search actions, actors, resources..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8" />
                <TableHead>Timestamp</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <>
                  <TableRow key={e.id} className="cursor-pointer" onClick={() => setExpanded(expanded === e.id ? null : e.id)}>
                    <TableCell>
                      {expanded === e.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono whitespace-nowrap">{e.timestamp}</TableCell>
                    <TableCell>
                      <span className="text-sm">{e.actor}</span>
                      <Badge variant="outline" className="ml-2 text-[10px]">{e.actorRole}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{e.action}</TableCell>
                    <TableCell className="text-sm">{e.resource}</TableCell>
                  </TableRow>
                  {expanded === e.id && (
                    <TableRow key={`${e.id}-detail`}>
                      <TableCell colSpan={5} className="bg-muted/50 p-4">
                        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                          {e.details.before && (
                            <div>
                              <p className="text-muted-foreground font-sans text-[11px] uppercase mb-1">Before</p>
                              <pre className="bg-card p-2 rounded text-foreground">{JSON.stringify(e.details.before, null, 2)}</pre>
                            </div>
                          )}
                          {e.details.after && (
                            <div>
                              <p className="text-muted-foreground font-sans text-[11px] uppercase mb-1">After</p>
                              <pre className="bg-card p-2 rounded text-foreground">{JSON.stringify(e.details.after, null, 2)}</pre>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
