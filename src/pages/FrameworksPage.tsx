import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { BookOpen, Layers } from 'lucide-react';
import { contentFrameworks } from '@/lib/mock-data';

export default function FrameworksPage() {
  const [frameworks, setFrameworks] = useState(contentFrameworks);
  const active = frameworks.filter(f => f.active).length;

  const toggle = (id: string) => {
    setFrameworks(prev => prev.map(f => f.id === id ? { ...f, active: !f.active } : f));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Content Frameworks</h1>
        <p className="text-sm text-muted-foreground">Manage content source frameworks — {active} of {frameworks.length} active.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><Layers className="h-8 w-8 text-primary" /><div><p className="text-2xl font-bold">{active}</p><p className="text-xs text-muted-foreground">Active Frameworks</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><BookOpen className="h-8 w-8 text-muted-foreground" /><div><p className="text-2xl font-bold">{frameworks.reduce((s, f) => s + f.itemCount, 0)}</p><p className="text-xs text-muted-foreground">Total Content Items</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-4 w-4 text-success" />All Frameworks</CardTitle>
          <CardDescription className="text-xs">Enable or disable content frameworks. Disabled frameworks hide their content from students.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {frameworks.map((fw) => (
            <div key={fw.id} className="flex items-center gap-4 p-4 rounded-md border hover:bg-muted/30 transition-colors">
              <div className={`h-3 w-3 rounded-full ${fw.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{fw.name}</p>
                <p className="text-xs text-muted-foreground">{fw.description}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Source: {fw.sourceType} · {fw.itemCount} items</p>
              </div>
              <Badge variant="outline" className="text-xs shrink-0">{fw.itemCount} items</Badge>
              <Switch checked={fw.active} onCheckedChange={() => toggle(fw.id)} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
