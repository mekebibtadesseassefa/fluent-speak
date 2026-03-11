import { useState } from 'react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { defaultPhases, type MethodologyPhase } from '@/lib/mock-data';
import { GripVertical, Clock } from 'lucide-react';

const appliesToLabel: Record<string, string> = {
  self_study: 'Self-Study',
  live_class: 'Live Class',
  both: 'Both',
};

function SortablePhaseCard({ phase }: { phase: MethodologyPhase }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: phase.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`border-l-4 border-l-primary ${isDragging ? 'shadow-lg ring-2 ring-primary/20' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <button
              {...attributes}
              {...listeners}
              className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
              aria-label={`Reorder ${phase.name}`}
            >
              <GripVertical className="h-5 w-5" />
            </button>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground">{phase.name}</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{appliesToLabel[phase.appliesTo]}</Badge>
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
                  <p className="text-[11px] uppercase text-muted-foreground font-medium mb-1">Facilitator Prompt</p>
                  <p className="text-sm text-foreground">{phase.teacherPrompt}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function MethodologyPage() {
  const [phases, setPhases] = useState<MethodologyPhase[]>(defaultPhases);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPhases((prev) => {
        const oldIndex = prev.findIndex((p) => p.id === active.id);
        const newIndex = prev.findIndex((p) => p.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }

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

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={phases.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {phases.map((phase) => (
              <SortablePhaseCard key={phase.id} phase={phase} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
