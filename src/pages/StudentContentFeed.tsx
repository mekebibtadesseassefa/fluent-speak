import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const LANG_FLAGS: Record<string, string> = { en: '🇺🇸', es: '🇪🇸', fr: '🇫🇷', pt: '🇧🇷' };

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
  const [content, setContent] = useState<ContentRow[]>([]);
  const [search, setSearch] = useState('');
  const [langFilter, setLangFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const { data } = await supabase
      .from('content_items')
      .select('id, title, language, level_min, level_max, duration_seconds, status, perspective, topic_tags, published_week, published_year, content_frameworks(name, color)')
      .eq('status', 'published')
      .order('published_year', { ascending: false })
      .order('published_week', { ascending: false })
      .limit(50);

    if (data) setContent(data as ContentRow[]);
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
            <SelectItem value="all">All Languages</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="pt">Português</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
