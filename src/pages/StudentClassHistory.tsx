import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface BookingRow {
  id: string;
  agenda_text: string | null;
  teacher_notes: string | null;
  attended: boolean | null;
  cancelled_at: string | null;
  classes: {
    scheduled_at: string;
    language: string;
    type: string;
    status: string;
    duration_minutes: number;
  } | null;
}

export default function StudentClassHistory() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadBookings();
  }, [user]);

  const loadBookings = async () => {
    const { data } = await supabase
      .from('class_bookings')
      .select('id, agenda_text, teacher_notes, attended, cancelled_at, classes(scheduled_at, language, type, status, duration_minutes)')
      .eq('student_id', user!.id)
      .order('created_at', { ascending: false });
    if (data) setBookings(data as BookingRow[]);
    setLoading(false);
  };

  const now = new Date().toISOString();
  const upcoming = bookings.filter(b => !b.cancelled_at && b.classes && b.classes.scheduled_at > now);
  const past = bookings.filter(b => b.cancelled_at || (b.classes && b.classes.scheduled_at <= now));

  const renderBooking = (b: BookingRow) => {
    if (!b.classes) return null;
    return (
      <div key={b.id} className="p-4 rounded-lg border space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant={b.classes.type === 'private' ? 'default' : 'secondary'}>{b.classes.type}</Badge>
            <span className="font-medium">{format(new Date(b.classes.scheduled_at), 'EEE, MMM d · HH:mm')}</span>
            <Badge variant="outline">{b.classes.language.toUpperCase()}</Badge>
          </div>
          <Badge variant={b.cancelled_at ? 'destructive' : b.attended ? 'default' : 'secondary'}>
            {b.cancelled_at ? 'Cancelled' : b.attended ? 'Attended' : b.classes.status}
          </Badge>
        </div>
        {b.agenda_text && <p className="text-sm text-muted-foreground">Agenda: {b.agenda_text}</p>}
        {b.teacher_notes && <p className="text-sm text-foreground">Teacher note: {b.teacher_notes}</p>}
      </div>
    );
  };

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">My Classes</h1>
        <p className="text-sm text-muted-foreground">Upcoming and past sessions</p>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-3 mt-4">
          {upcoming.length === 0 ? (
            <Card><CardContent className="p-6 text-center text-muted-foreground">No upcoming classes. Book one!</CardContent></Card>
          ) : upcoming.map(renderBooking)}
        </TabsContent>

        <TabsContent value="past" className="space-y-3 mt-4">
          {past.length === 0 ? (
            <Card><CardContent className="p-6 text-center text-muted-foreground">No past classes yet.</CardContent></Card>
          ) : past.map(renderBooking)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
