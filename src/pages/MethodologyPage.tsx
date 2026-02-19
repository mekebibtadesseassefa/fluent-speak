import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { defaultPhases, type MethodologyPhase } from '@/lib/mock-data';
import { GripVertical, Clock, Eye, Pencil } from 'lucide-react';

export default function MethodologyPage() {
  const [phases] = useState<MethodologyPhase[]>(defaultPhases);

  const appliesToLabel: Record<string, string> = {
    self_study: 'Self-Study',
    live_class: 'Live Class',
    both: 'Both',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Methodology Builder</h1>
          <p className="text-sm text-muted-foreground">UIRF Phase Editor — Version 2.1 (Active)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Archive</Button>
          <Button size="sm">Publish New Version</Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Badge className="bg-success text-success-foreground">v2.1 — Active</Badge>
        <Badge variant="outline">v2.0 — Archived</Badge>
        <Badge variant="outline">v1.0 — Archived</Badge>
      </div>

      <div className="space-y-3">
        {phases.map((phase, idx) => (
          <Card key={phase.id} className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 cursor-grab text-muted-foreground hover:text-foreground">
                  <GripVertical className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">{phase.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {appliesToLabel[phase.appliesTo]}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {phase.durationMinutes} min
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-muted rounded-md p-3">
                      <p className="text-[11px] uppercase text-muted-foreground font-medium mb-1">Student Instruction</p>
                      <p className="text-sm text-foreground">{phase.studentInstruction}</p>
                    </div>
                    <div className="bg-muted rounded-md p-3">
                      <p className="text-[11px] uppercase text-muted-foreground font-medium mb-1">Teacher Prompt</p>
                      <p className="text-sm text-foreground">{phase.teacherPrompt}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
