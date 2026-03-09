import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Users, Clock, BookOpen, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const [todayClasses, setTodayClasses] = useState<any[]>([]);
  const [weekClasses, setWeekClasses] = useState<any[]>([]);
  const [teacherProfile, setTeacherProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const [teacherRes, todayRes, weekRes] = await Promise.all([
      supabase.from('teachers').select('*').eq('id', user!.id).single(),
      supabase.from('classes')
        .select('id, scheduled_at, language, type, status, capacity, class_bookings(id, student_id, agenda_text)')
        .eq('teacher_id', user!.id)
        .gte('scheduled_at', todayStr)
        .lt('scheduled_at', todayStr + 'T23:59:59')
        .order('scheduled_at'),
      supabase.from('classes')
        .select('id, scheduled_at, language, type, status')
        .eq('teacher_id', user!.id)
        .gte('scheduled_at', today.toISOString())
        .lt('scheduled_at', weekEnd.toISOString())
        .order('scheduled_at'),
    ]);

    if (teacherRes.data) setTeacherProfile(teacherRes.data);
    if (todayRes.data) setTodayClasses(todayRes.data);
    if (weekRes.data) setWeekClasses(weekRes.data);
    setLoading(false);
  };

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Facilitator Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back! Here's your facilitation overview.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10"><Calendar className="h-5 w-5 text-accent" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Today's Classes</p>
              <p className="text-2xl font-bold">{todayClasses.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><Clock className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-2xl font-bold">{weekClasses.length} classes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10"><DollarSign className="h-5 w-5 text-success" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Earnings</p>
              <p className="text-2xl font-bold">R$ 0</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-admin/10"><Users className="h-5 w-5 text-admin" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Languages</p>
              <p className="text-2xl font-bold">{teacherProfile?.languages_taught?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Classes */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Today's Classes</CardTitle></CardHeader>
        <CardContent>
          {todayClasses.length === 0 ? (
            <p className="text-muted-foreground text-sm">No classes scheduled for today.</p>
          ) : (
            <div className="space-y-3">
              {todayClasses.map(cls => (
                <div key={cls.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Badge variant={cls.type === 'private' ? 'default' : 'secondary'}>{cls.type}</Badge>
                    <div>
                      <p className="font-medium">{format(new Date(cls.scheduled_at), 'HH:mm')} — {cls.language.toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground">{cls.class_bookings?.length || 0} student(s)</p>
                    </div>
                  </div>
                  <Button size="sm" variant="secondary">View</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/teacher/schedule">
          <Card className="hover:border-accent/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <Calendar className="h-5 w-5 text-accent" />
              <span className="font-medium">Manage Schedule</span>
            </CardContent>
          </Card>
        </Link>
        <Link to="/teacher/agendas">
          <Card className="hover:border-accent/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-medium">View Agendas</span>
            </CardContent>
          </Card>
        </Link>
        <Link to="/teacher/income">
          <Card className="hover:border-accent/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-success" />
              <span className="font-medium">Income & Payouts</span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
