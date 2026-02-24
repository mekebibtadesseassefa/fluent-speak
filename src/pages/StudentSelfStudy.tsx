import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, Save, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContentDetail {
  id: string;
  title: string;
  subtitle: string | null;
  source_url: string | null;
  embed_url: string | null;
  transcript_text: string | null;
  language: string;
  level_min: string;
  level_max: string;
  duration_seconds: number | null;
  topic_tags: string[] | null;
  content_frameworks: { name: string } | null;
}

interface Phase {
  id: string;
  name: string;
  student_instruction: string | null;
  default_duration_minutes: number;
  applies_to: string;
  sort_order: number;
}

export default function StudentSelfStudy() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState<ContentDetail | null>(null);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [vocabWord, setVocabWord] = useState('');
  const [vocabContext, setVocabContext] = useState('');
  const [keyIdeas, setKeyIdeas] = useState(['', '', '']);

  useEffect(() => {
    if (!id) return;
    loadContent();
    loadPhases();
  }, [id]);

  const loadContent = async () => {
    const { data } = await supabase
      .from('content_items')
      .select('id, title, subtitle, source_url, embed_url, transcript_text, language, level_min, level_max, duration_seconds, topic_tags, content_frameworks(name)')
      .eq('id', id!)
      .single();
    if (data) setContent(data as ContentDetail);
  };

  const loadPhases = async () => {
    const { data: version } = await supabase
      .from('methodology_versions')
      .select('id')
      .eq('status', 'active')
      .single();

    if (version) {
      const { data } = await supabase
        .from('methodology_phases')
        .select('id, name, student_instruction, default_duration_minutes, applies_to, sort_order')
        .eq('version_id', version.id)
        .in('applies_to', ['both', 'self_study'])
        .order('sort_order');
      if (data) setPhases(data);
    }
  };

  const saveVocab = async () => {
    if (!user || !vocabWord.trim()) return;
    await supabase.from('vocabulary_saves').insert({
      user_id: user.id,
      content_id: id,
      word: vocabWord.trim(),
      context_sentence: vocabContext.trim() || null,
    });
    toast({ title: 'Saved!', description: `"${vocabWord}" added to your vocabulary.` });
    setVocabWord('');
    setVocabContext('');
  };

  const getYouTubeEmbedUrl = (url: string | null) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|ted\.com\/talks\/)([^\s&?]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    if (url.includes('youtube.com/embed')) return url;
    return null;
  };

  if (!content) {
    return <div className="p-6 text-muted-foreground">Loading content...</div>;
  }

  const embedUrl = getYouTubeEmbedUrl(content.embed_url || content.source_url);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">{content.title}</h1>
        <div className="flex gap-2 mt-2">
          <Badge variant="secondary">{content.level_min}–{content.level_max}</Badge>
          {content.content_frameworks && <Badge variant="outline">{content.content_frameworks.name}</Badge>}
          {content.duration_seconds && <Badge variant="outline">{Math.round(content.duration_seconds / 60)} min</Badge>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video / Source */}
        <div className="lg:col-span-2 space-y-4">
          {embedUrl ? (
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <iframe src={embedUrl} className="w-full h-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
            </div>
          ) : content.source_url ? (
            <Card>
              <CardContent className="p-6 text-center">
                <a href={content.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline">
                  <ExternalLink className="h-4 w-4" /> Open Source Content
                </a>
              </CardContent>
            </Card>
          ) : (
            <Card><CardContent className="p-6 text-center text-muted-foreground">No media available</CardContent></Card>
          )}

          {/* Transcript */}
          {content.transcript_text && (
            <Card>
              <CardHeader><CardTitle className="text-base">Transcript</CardTitle></CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto text-sm text-muted-foreground whitespace-pre-wrap">
                  {content.transcript_text}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Key Ideas */}
          <Card>
            <CardHeader><CardTitle className="text-base">Key Ideas</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {keyIdeas.map((idea, i) => (
                <Input
                  key={i}
                  placeholder={`Key idea ${i + 1}...`}
                  value={idea}
                  onChange={e => {
                    const next = [...keyIdeas];
                    next[i] = e.target.value;
                    setKeyIdeas(next);
                  }}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: UIRF + Vocabulary */}
        <div className="space-y-4">
          {/* UIRF Methodology Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" /> UIRF Study Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {phases.map(phase => (
                  <AccordionItem key={phase.id} value={phase.id}>
                    <AccordionTrigger className="text-sm">
                      <span className="flex items-center gap-2">
                        {phase.name}
                        <Badge variant="outline" className="text-xs">{phase.default_duration_minutes}m</Badge>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {phase.student_instruction}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Vocabulary Save */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Save Vocabulary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Word or expression" value={vocabWord} onChange={e => setVocabWord(e.target.value)} />
              <Textarea placeholder="Context sentence (optional)" value={vocabContext} onChange={e => setVocabContext(e.target.value)} rows={2} />
              <Button onClick={saveVocab} size="sm" className="w-full gap-1" disabled={!vocabWord.trim()}>
                <Save className="h-3.5 w-3.5" /> Save
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
