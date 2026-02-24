import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format, addHours } from 'date-fns';
import { Calendar, User, Clock, FileText } from 'lucide-react';

interface TeacherOption {
  id: string;
  bio: string | null;
  languages_taught: string[];
  profiles: { full_name: string; avatar_url: string | null } | null;
}

interface SlotOption {
  id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  max_students: number;
  current_bookings: number;
}

export default function StudentBookingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState('');
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [slots, setSlots] = useState<SlotOption[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [agenda, setAgenda] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (step === 2 && language) loadTeachers();
    if (step === 3 && selectedTeacher) loadSlots();
  }, [step, language, selectedTeacher]);

  const loadTeachers = async () => {
    const { data } = await supabase
      .from('teachers')
      .select('id, bio, languages_taught, profiles(full_name, avatar_url)')
      .eq('active', true)
      .contains('languages_taught', [language]);
    if (data) setTeachers(data as TeacherOption[]);
  };

  const loadSlots = async () => {
    const minDate = format(addHours(new Date(), 72), 'yyyy-MM-dd');
    const { data } = await supabase
      .from('teacher_availability')
      .select('id, slot_date, start_time, end_time, max_students, current_bookings')
      .eq('teacher_id', selectedTeacher!)
      .eq('available', true)
      .gte('slot_date', minDate)
      .order('slot_date')
      .order('start_time');
    if (data) setSlots(data.filter(s => s.current_bookings < s.max_students));
  };

  const handleBook = async () => {
    if (!user || !selectedSlot || agenda.length < 50) {
      toast({ title: 'Agenda required', description: 'Please write at least 50 characters about what you want to work on.', variant: 'destructive' });
      return;
    }

    setBooking(true);
    const slot = slots.find(s => s.id === selectedSlot)!;

    // Create class
    const { data: cls, error: classError } = await supabase.from('classes').insert({
      type: 'private',
      language,
      teacher_id: selectedTeacher!,
      availability_slot_id: selectedSlot,
      scheduled_at: `${slot.slot_date}T${slot.start_time}`,
      capacity: 1,
    }).select().single();

    if (classError || !cls) {
      toast({ title: 'Booking failed', description: classError?.message || 'Unknown error', variant: 'destructive' });
      setBooking(false);
      return;
    }

    // Create booking
    await supabase.from('class_bookings').insert({
      class_id: cls.id,
      student_id: user.id,
      agenda_text: agenda,
      agenda_submitted_at: new Date().toISOString(),
    });

    // Increment slot bookings
    await supabase.from('teacher_availability').update({
      current_bookings: slot.current_bookings + 1,
    }).eq('id', selectedSlot);

    toast({ title: 'Class booked!', description: `Your class is scheduled for ${format(new Date(slot.slot_date), 'MMM d')} at ${slot.start_time}.` });
    setBooking(false);
    setStep(1);
    setLanguage('');
    setSelectedTeacher(null);
    setSelectedSlot(null);
    setAgenda('');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-navy">Book a Class</h1>
        <p className="text-sm text-muted-foreground">Step {step} of 4</p>
      </div>

      {/* Step 1: Language */}
      {step === 1 && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" /> Select Language</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {['en', 'es', 'fr', 'pt'].map(lang => (
              <Button
                key={lang}
                variant={language === lang ? 'default' : 'outline'}
                className="h-16 text-lg"
                onClick={() => { setLanguage(lang); setStep(2); }}
              >
                {lang === 'en' ? '🇺🇸 English' : lang === 'es' ? '🇪🇸 Español' : lang === 'fr' ? '🇫🇷 Français' : '🇧🇷 Português'}
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Teacher */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Choose a Teacher</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {teachers.length === 0 ? (
              <p className="text-muted-foreground">No teachers available for this language yet.</p>
            ) : (
              teachers.map(t => (
                <div
                  key={t.id}
                  onClick={() => { setSelectedTeacher(t.id); setStep(3); }}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors hover:border-primary/50 ${
                    selectedTeacher === t.id ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  <p className="font-medium">{t.profiles?.full_name || 'Teacher'}</p>
                  <p className="text-sm text-muted-foreground">{t.bio || 'No bio available'}</p>
                  <div className="flex gap-1 mt-2">
                    {t.languages_taught.map(l => (
                      <Badge key={l} variant="outline" className="text-xs">{l.toUpperCase()}</Badge>
                    ))}
                  </div>
                </div>
              ))
            )}
            <Button variant="secondary" onClick={() => setStep(1)}>← Back</Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Time Slot */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Select Date & Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">Only slots ≥72 hours from now are shown (agenda submission requirement).</p>
            {slots.length === 0 ? (
              <p className="text-muted-foreground">No available slots. Please check back later or choose another teacher.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {slots.map(s => (
                  <Button
                    key={s.id}
                    variant={selectedSlot === s.id ? 'default' : 'outline'}
                    className="h-auto py-2 flex flex-col"
                    onClick={() => { setSelectedSlot(s.id); setStep(4); }}
                  >
                    <span className="font-medium">{format(new Date(s.slot_date), 'EEE, MMM d')}</span>
                    <span className="text-xs">{s.start_time} – {s.end_time}</span>
                  </Button>
                ))}
              </div>
            )}
            <Button variant="secondary" onClick={() => setStep(2)}>← Back</Button>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Agenda */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Submit Your Agenda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              What do you want to work on? What content will you bring? (min 50 characters)
            </p>
            <Textarea
              value={agenda}
              onChange={e => setAgenda(e.target.value)}
              placeholder="I'd like to discuss..."
              rows={5}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">{agenda.length}/500</p>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setStep(3)}>← Back</Button>
              <Button onClick={handleBook} disabled={booking || agenda.length < 50} className="flex-1">
                {booking ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
