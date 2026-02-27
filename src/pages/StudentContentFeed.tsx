import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Play } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';

const LANG_FLAGS: Record<string, string> = { en: '🇺🇸', es: '🇪🇸', fr: '🇫🇷', pt: '🇧🇷' };

// Map onboarding content_stream ids to framework names for filtering
const STREAM_TO_FRAMEWORK: Record<string, string> = {
  ted: 'Fluent with TED',
  news: 'Fluent with News',
  global_south: 'Fluent with Global South',
  business: 'Fluent with Business',
  culture: 'Fluent with Culture',
  science: 'Fluent with Science',
};

interface ContentRow {
  id: string;
  title: string;
  language: string;
  level_min: string;
  level_max: string;
  duration_seconds: number | null;
  status: string;
  perspective: string | null;
  topic_tags: string[] | null;
  published_week: number | null;
  published_year: number | null;
  content_frameworks: { name: string; color: string | null } | null;
}

export default function StudentContentFeed() {
  const { user } = useAuth();
  const [content, setContent] = useState<ContentRow[]>([]);
  const [search, setSearch] = useState('');
  const [langFilter, setLangFilter] = useState('all');
  const [prefLanguages, setPrefLanguages] = useState<string[]>([]);
  const [prefStreams, setPrefStreams] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPreferencesAndContent();
    }
  }, [user, showAll]);

  const loadPreferencesAndContent = async () => {
    // Load preferences first
    const { data: prefs } = await supabase
      .from('student_preferences')
      .select('languages, content_streams')
      .eq('user_id', user!.id)
      .maybeSingle();

    const langs = prefs?.languages ?? [];
    const streams = prefs?.content_streams ?? [];
    setPrefLanguages(langs);
    setPrefStreams(streams);

    // Build query — filter by preferred languages if any
    let query = supabase
      .from('content_items')
      .select('id, title, language, level_min, level_max, duration_seconds, status, perspective, topic_tags, published_week, published_year, content_frameworks(name, color)')
      .eq('status', 'published')
      .order('published_year', { ascending: false })
      .order('published_week', { ascending: false })
      .limit(50);

    if (!showAll && langs.length > 0) {
      query = query.in('language', langs);
    }

    const { data } = await query;
    if (data) {
      let items = data as ContentRow[];
      if (!showAll && streams.length > 0) {
        const preferredNames = streams.map(s => STREAM_TO_FRAMEWORK[s]).filter(Boolean);
        if (preferredNames.length > 0) {
          items = items.filter(item =>
            !item.content_frameworks || preferredNames.includes(item.content_frameworks.name)
          );
        }
      }
      setContent(items);
    }
    setLoading(false);
  };

  const filtered = content.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchLang = langFilter === 'all' || item.language === langFilter;
    return matchSearch && matchLang;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Content Library</h1>
        <p className="text-sm text-muted-foreground">Browse and study real-world content</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search content..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={langFilter} onValueChange={setLangFilter}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{prefLanguages.length > 0 ? 'My Languages' : 'All Languages'}</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="pt">Português</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {prefStreams.length > 0 && !showAll && (
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs text-muted-foreground mr-1">Streams:</span>
          {prefStreams.map(s => (
            <Badge key={s} variant="secondary" className="text-xs capitalize">{s.replace('_', ' ')}</Badge>
          ))}
        </div>
      )}

      {(prefLanguages.length > 0 || prefStreams.length > 0) && (
        <div className="flex items-center gap-2">
          <Switch id="show-all" checked={showAll} onCheckedChange={setShowAll} />
          <Label htmlFor="show-all" className="text-sm cursor-pointer">Show all content</Label>
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading content...</p>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No content found.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{LANG_FLAGS[item.language] || '🌐'}</span>
                  <div>
                    <p className="font-medium text-foreground">{item.title}</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <Badge variant="secondary" className="text-xs">{item.level_min}–{item.level_max}</Badge>
                      {item.content_frameworks && (
                        <Badge variant="outline" className="text-xs">{item.content_frameworks.name}</Badge>
                      )}
                      {item.perspective && item.perspective !== 'neutral' && (
                        <Badge variant="outline" className="text-xs capitalize">{item.perspective.replace('_', ' ')}</Badge>
                      )}
                      {item.duration_seconds && (
                        <Badge variant="outline" className="text-xs">{Math.round(item.duration_seconds / 60)} min</Badge>
                      )}
                      {item.published_week && (
                        <Badge variant="outline" className="text-xs font-mono">W{item.published_week}</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Link to={`/student/content/${item.id}`}>
                  <Button size="sm" variant="secondary" className="gap-1">
                    <Play className="h-3.5 w-3.5" /> Study
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
