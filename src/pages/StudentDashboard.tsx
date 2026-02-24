import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, Flame, Clock, TrendingUp, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ContentItem {
  id: string;
  title: string;
  language: string;
  level_min: string;
  level_max: string;
  duration_seconds: number | null;
  status: string;
  framework: { name: string; color: string | null } | null;
}

interface UpcomingClass {
  id: string;
  scheduled_at: string;
  language: string;
  type: string;
  teacher: { full_name: string } | null;
  booking: { agenda_text: string | null; agenda_submitted_at: string | null } | null;
}

const LANG_FLAGS: Record<string, string> = { en: '🇺🇸', es: '🇪🇸', fr: '🇫🇷', pt: '🇧🇷' };

export default function StudentDashboard() {
  const { user } = useAuth();
  const [weeklyContent, setWeeklyContent] = useState<ContentItem[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([]);
  const [reflections, setReflections] = useState<{ confidence_score: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    const now = new Date();
    const currentWeek = getISOWeek(now);
    const currentYear = now.getFullYear();

    const [contentRes, classesRes, reflectionsRes] = await Promise.all([
      supabase
        .from('content_items')
        .select('id, title, language, level_min, level_max, duration_seconds, status, content_frameworks(name, color)')
        .eq('status', 'published')
        .eq('published_year', currentYear)
        .eq('published_week', currentWeek)
        .limit(5),
      supabase
        .from('class_bookings')
        .select('id, classes(id, scheduled_at, language, type, teachers(id, profiles(full_name))), agenda_text, agenda_submitted_at')
        .eq('student_id', user!.id)
        .is('cancelled_at', null)
        .order('created_at', { ascending: false })
        .limit(3),
      supabase
        .from('session_reflections')
        .select('confidence_score')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(8),
    ]);

    if (contentRes.data) {
      setWeeklyContent(contentRes.data.map((item: any) => ({
        ...item,
        framework: item.content_frameworks,
      })));
    }

    if (reflectionsRes.data) {
      setReflections(reflectionsRes.data.filter((r: any) => r.confidence_score != null));
    }

    setLoading(false);
  };

  const getISOWeek = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  const avgConfidence = reflections.length > 0
    ? (reflections.reduce((s, r) => s + (r.confidence_score || 0), 0) / reflections.length).toFixed(1)
    : '—';

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading your dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Your Dashboard</h1>
        <p className="text-sm text-muted-foreground">This week's learning journey</p>
      </div>

      {/* Progress Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Flame className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Speaking Streak</p>
              <p className="text-2xl font-bold text-foreground">0 sessions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Clock className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Speaking Time</p>
              <p className="text-2xl font-bold text-foreground">0h this month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Confidence</p>
              <p className="text-2xl font-bold text-foreground">{avgConfidence}/5</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* This Week's Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-primary" />
            This Week's Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          {weeklyContent.length === 0 ? (
            <p className="text-muted-foreground text-sm">No content published for this week yet.</p>
          ) : (
            <div className="space-y-3">
              {weeklyContent.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{LANG_FLAGS[item.language] || '🌐'}</span>
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">{item.level_min}–{item.level_max}</Badge>
                        {item.framework && <Badge variant="outline" className="text-xs">{item.framework.name}</Badge>}
                      </div>
                    </div>
                  </div>
                  <Link to={`/student/content/${item.id}`}>
                    <Button size="sm">Start Self-Study</Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/student/content">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-medium">Browse All Content</span>
            </CardContent>
          </Card>
        </Link>
        <Link to="/student/book">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <Calendar className="h-5 w-5 text-accent" />
              <span className="font-medium">Book a Class</span>
            </CardContent>
          </Card>
        </Link>
        <Link to="/student/classes">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <Mic className="h-5 w-5 text-success" />
              <span className="font-medium">My Class History</span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
