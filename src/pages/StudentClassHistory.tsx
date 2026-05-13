import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { ptBR as ptBRLocale, enUS } from 'date-fns/locale';

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
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  const locale = i18n.language?.startsWith('en') ? enUS : ptBRLocale;

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
            <span className="font-medium">{format(new Date(b.classes.scheduled_at), 'EEE, MMM d · HH:mm', { locale })}</span>
            <Badge variant="outline">{b.classes.language.toUpperCase()}</Badge>
          </div>
          <Badge variant={b.cancelled_at ? 'destructive' : b.attended ? 'default' : 'secondary'}>
            {b.cancelled_at ? t('classHistory.cancelled') : b.attended ? t('classHistory.attended') : b.classes.status}
          </Badge>
        </div>
        {b.agenda_text && <p className="text-sm text-muted-foreground">{t('classHistory.agenda')}: {b.agenda_text}</p>}
        {b.teacher_notes && <p className="text-sm text-foreground">{t('classHistory.facilitatorNote')}: {b.teacher_notes}</p>}
      </div>
    );
  };

  if (loading) return <div className="p-6 text-muted-foreground">{t('common.loading')}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">{t('classHistory.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('classHistory.subtitle')}</p>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">{t('classHistory.upcoming')} ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">{t('classHistory.past')} ({past.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-3 mt-4">
          {upcoming.length === 0 ? (
            <Card><CardContent className="p-6 text-center text-muted-foreground">{t('classHistory.noUpcoming')}</CardContent></Card>
          ) : upcoming.map(renderBooking)}
        </TabsContent>

        <TabsContent value="past" className="space-y-3 mt-4">
          {past.length === 0 ? (
            <Card><CardContent className="p-6 text-center text-muted-foreground">{t('classHistory.noPast')}</CardContent></Card>
          ) : past.map(renderBooking)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
