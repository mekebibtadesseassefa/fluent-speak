import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Globe, BookOpen, Target, Smile, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
];

const CONTENT_STREAMS = [
  { id: 'ted', label: 'TED Talks', icon: '🎤', desc: 'Inspiring ideas worth spreading' },
  { id: 'news', label: 'News', icon: '📰', desc: 'Stay current with world events' },
  { id: 'global_south', label: 'Global South', icon: '🌍', desc: 'Perspectives from the developing world' },
  { id: 'business', label: 'Business', icon: '💼', desc: 'Corporate & professional English' },
  { id: 'culture', label: 'Culture', icon: '🎨', desc: 'Arts, film, music & society' },
  { id: 'science', label: 'Science', icon: '🔬', desc: 'Technology & scientific discovery' },
];

const GOALS = [
  { id: 'speaking_confidence', label: 'Speaking Confidence', icon: '🗣️', desc: 'Feel comfortable speaking in any situation' },
  { id: 'professional_fluency', label: 'Professional Fluency', icon: '💼', desc: 'Excel in meetings, presentations & emails' },
  { id: 'academic', label: 'Academic', icon: '🎓', desc: 'Prepare for studies or research abroad' },
  { id: 'travel', label: 'Travel & Culture', icon: '✈️', desc: 'Navigate the world with ease' },
];

const CONFIDENCE_LEVELS = [
  { value: 1, emoji: '😰', label: 'Very nervous' },
  { value: 2, emoji: '😟', label: 'Somewhat anxious' },
  { value: 3, emoji: '😐', label: 'It depends on the situation' },
  { value: 4, emoji: '🙂', label: 'Fairly comfortable' },
  { value: 5, emoji: '😎', label: 'Very confident' },
];

const STEPS = [
  { title: 'Languages', icon: Globe, desc: 'Which languages do you want to learn?' },
  { title: 'Content', icon: BookOpen, desc: 'What topics interest you?' },
  { title: 'Goal', icon: Target, desc: 'What\'s your main learning goal?' },
  { title: 'Self-Assessment', icon: Smile, desc: 'How do you feel about speaking?' },
];

interface Props {
  onComplete: () => void;
}

export default function StudentOnboardingWizard({ onComplete }: Props) {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [languages, setLanguages] = useState<string[]>([]);
  const [contentStreams, setContentStreams] = useState<string[]>([]);
  const [learningGoal, setLearningGoal] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);

  const toggleItem = (arr: string[], setArr: (v: string[]) => void, item: string) => {
    setArr(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]);
  };

  const canProceed = () => {
    switch (step) {
      case 0: return languages.length > 0;
      case 1: return contentStreams.length > 0;
      case 2: return learningGoal !== null;
      case 3: return confidence !== null;
      default: return false;
    }
  };

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('student_preferences').upsert({
        user_id: user.id,
        languages,
        content_streams: contentStreams,
        learning_goal: learningGoal,
        baseline_confidence: confidence,
        onboarding_complete: true,
      }, { onConflict: 'user_id' });

      if (error) throw error;
      toast({ title: 'Welcome to Feb3! 🎉', description: 'Your preferences have been saved.' });
      onComplete();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;
  const StepIcon = STEPS[step].icon;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Let's personalize your experience
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-navy">Welcome to Feb3</h1>
          <p className="text-muted-foreground">4 quick steps to tailor your learning journey</p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            {STEPS.map((s, i) => (
              <span key={i} className={i <= step ? 'text-primary font-medium' : ''}>
                {s.title}
              </span>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Card */}
        <Card className="border-2">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit mb-2">
              <StepIcon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">{STEPS[step].desc}</CardTitle>
            <CardDescription>
              {step === 0 && 'Select one or more languages you want to practice.'}
              {step === 1 && 'Choose content streams that interest you. You can change these anytime.'}
              {step === 2 && 'This helps us recommend the right content and classes.'}
              {step === 3 && 'Be honest — there are no wrong answers. This is just your starting point.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {/* Step 0: Languages */}
            {step === 0 && (
              <div className="grid grid-cols-2 gap-3">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => toggleItem(languages, setLanguages, lang.code)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      languages.includes(lang.code)
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <span className="text-3xl">{lang.flag}</span>
                    <p className="font-semibold mt-2 text-foreground">{lang.label}</p>
                  </button>
                ))}
              </div>
            )}

            {/* Step 1: Content Streams */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-3">
                {CONTENT_STREAMS.map(stream => (
                  <button
                    key={stream.id}
                    onClick={() => toggleItem(contentStreams, setContentStreams, stream.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      contentStreams.includes(stream.id)
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <span className="text-2xl">{stream.icon}</span>
                    <p className="font-semibold mt-1 text-foreground">{stream.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stream.desc}</p>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Learning Goal */}
            {step === 2 && (
              <div className="space-y-3">
                {GOALS.map(goal => (
                  <button
                    key={goal.id}
                    onClick={() => setLearningGoal(goal.id)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                      learningGoal === goal.id
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <span className="text-2xl">{goal.icon}</span>
                    <div>
                      <p className="font-semibold text-foreground">{goal.label}</p>
                      <p className="text-sm text-muted-foreground">{goal.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 3: Confidence Self-Assessment */}
            {step === 3 && (
              <div className="space-y-3">
                <p className="text-center text-sm text-muted-foreground mb-4">
                  How do you feel when speaking {languages.map(l => LANGUAGES.find(la => la.code === l)?.label).filter(Boolean).join(' / ')}?
                </p>
                {CONFIDENCE_LEVELS.map(level => (
                  <button
                    key={level.value}
                    onClick={() => setConfidence(level.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                      confidence === level.value
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <span className="text-3xl">{level.emoji}</span>
                    <p className="font-medium text-foreground">{level.label}</p>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleFinish} disabled={!canProceed() || saving}>
              {saving ? 'Saving...' : 'Start Learning 🚀'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
