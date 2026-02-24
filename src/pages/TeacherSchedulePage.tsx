import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, startOfWeek } from 'date-fns';

const HOURS = Array.from({ length: 16 }, (_, i) => i + 7); // 7:00 - 22:00
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface SlotState {
  [key: string]: { available: boolean; booked: boolean; id?: string };
}

export default function TeacherSchedulePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [slots, setSlots] = useState<SlotState>({});
  const [saving, setSaving] = useState(false);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));

  useEffect(() => {
    if (!user) return;
    loadSlots();
  }, [user, weekStart]);

  const loadSlots = async () => {
    const weekEnd = addDays(weekStart, 7);
    const { data } = await supabase
      .from('teacher_availability')
      .select('*')
      .eq('teacher_id', user!.id)
      .gte('slot_date', format(weekStart, 'yyyy-MM-dd'))
      .lt('slot_date', format(weekEnd, 'yyyy-MM-dd'));

    const slotMap: SlotState = {};
    data?.forEach(s => {
      const hour = parseInt(s.start_time.split(':')[0]);
      const dayIndex = (new Date(s.slot_date + 'T12:00:00').getDay() + 6) % 7; // Mon=0
      const key = `${dayIndex}-${hour}`;
      slotMap[key] = { available: s.available, booked: s.current_bookings > 0, id: s.id };
    });
    setSlots(slotMap);
  };

  const toggleSlot = (dayIndex: number, hour: number) => {
    const key = `${dayIndex}-${hour}`;
    const current = slots[key];
    if (current?.booked) return; // Can't toggle booked slots
    setSlots(prev => ({
      ...prev,
      [key]: { available: !(current?.available), booked: false, id: current?.id },
    }));
  };

  const saveSlots = async () => {
    if (!user) return;
    setSaving(true);

    const upserts: any[] = [];
    const deletes: string[] = [];

    for (const [key, state] of Object.entries(slots)) {
      const [dayStr, hourStr] = key.split('-');
      const dayIndex = parseInt(dayStr);
      const hour = parseInt(hourStr);
      const date = addDays(weekStart, dayIndex);
      const dateStr = format(date, 'yyyy-MM-dd');

      if (state.available && !state.id) {
        upserts.push({
          teacher_id: user.id,
          slot_date: dateStr,
          start_time: `${hour.toString().padStart(2, '0')}:00`,
          end_time: `${(hour + 1).toString().padStart(2, '0')}:00`,
          available: true,
        });
      } else if (!state.available && state.id && !state.booked) {
        deletes.push(state.id);
      }
    }

    if (upserts.length) await supabase.from('teacher_availability').insert(upserts);
    if (deletes.length) await supabase.from('teacher_availability').delete().in('id', deletes);

    toast({ title: 'Schedule saved!' });
    setSaving(false);
    loadSlots();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Schedule Management</h1>
          <p className="text-sm text-muted-foreground">Week of {format(weekStart, 'MMM d, yyyy')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setWeekStart(addDays(weekStart, -7))}>← Prev</Button>
          <Button variant="secondary" onClick={() => setWeekStart(addDays(weekStart, 7))}>Next →</Button>
          <Button onClick={saveSlots} disabled={saving}>{saving ? 'Saving...' : 'Save Schedule'}</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 overflow-x-auto">
          <div className="grid grid-cols-8 gap-1 min-w-[600px]">
            <div className="text-xs font-medium text-muted-foreground p-2">Time</div>
            {DAYS.map((d, i) => (
              <div key={d} className="text-xs font-medium text-center p-2">
                {d}<br />
                <span className="text-muted-foreground">{format(addDays(weekStart, i), 'MMM d')}</span>
              </div>
            ))}

            {HOURS.map(hour => (
              <>
                <div key={`h-${hour}`} className="text-xs text-muted-foreground p-2 text-right">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                {DAYS.map((_, dayIndex) => {
                  const key = `${dayIndex}-${hour}`;
                  const state = slots[key];
                  const isAvailable = state?.available;
                  const isBooked = state?.booked;

                  return (
                    <button
                      key={key}
                      onClick={() => toggleSlot(dayIndex, hour)}
                      className={`h-8 rounded text-xs transition-colors ${
                        isBooked
                          ? 'bg-accent/30 text-accent cursor-not-allowed'
                          : isAvailable
                          ? 'bg-primary/20 text-primary hover:bg-primary/30'
                          : 'bg-muted hover:bg-muted-foreground/10'
                      }`}
                      disabled={isBooked}
                    >
                      {isBooked ? '📅' : isAvailable ? '✓' : ''}
                    </button>
                  );
                })}
              </>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-primary/20" /> Available</span>
        <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-accent/30" /> Booked</span>
        <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-muted" /> Unavailable</span>
      </div>
    </div>
  );
}
