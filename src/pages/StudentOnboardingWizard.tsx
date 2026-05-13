import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Globe, BookOpen, Target, Smile, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', labelKey: 'languages.en', flag: '🇺🇸' },
  { code: 'es', labelKey: 'languages.es', flag: '🇪🇸' },
  { code: 'fr', labelKey: 'languages.fr', flag: '🇫🇷' },
  { code: 'pt', labelKey: 'languages.pt', flag: '🇧🇷' },
];

const CONTENT_STREAMS = [
  { id: 'ted', icon: '🎤' },
  { id: 'news', icon: '📰' },
  { id: 'global_south', icon: '🌍' },
  { id: 'business', icon: '💼' },
  { id: 'culture', icon: '🎨' },
  { id: 'science', icon: '🔬' },
] as const;

const GOALS = [
  { id: 'speaking_confidence', icon: '🗣️' },
  { id: 'professional_fluency', icon: '💼' },
  { id: 'academic', icon: '🎓' },
  { id: 'travel', icon: '✈️' },
] as const;

const CONFIDENCE_LEVELS = [
  { value: 1, emoji: '😰' },
  { value: 2, emoji: '😟' },
  { value: 3, emoji: '😐' },
  { value: 4, emoji: '🙂' },
  { value: 5, emoji: '😎' },
];

const STEPS = [
  { key: 'languages', icon: Globe },
  { key: 'content', icon: BookOpen },
  { key: 'goal', icon: Target },
  { key: 'assessment', icon: Smile },
];

interface Props {
  onComplete: () => void;
}

export default function StudentOnboardingWizard({ onComplete }: Props) {
  const { t } = useTranslation();
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
      toast({ title: t('onboarding.saved'), description: t('onboarding.savedDesc') });
      onComplete();
    } catch (err: any) {
      toast({ title: t('common.error'), description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;
  const StepIcon = STEPS[step].icon;
  const stepKey = STEPS[step].key;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            {t('onboarding.welcomeBadge')}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-navy">{t('onboarding.welcomeTitle')}</h1>
          <p className="text-muted-foreground">{t('onboarding.welcomeSubtitle')}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            {STEPS.map((s, i) => (
              <span key={s.key} className={i <= step ? 'text-primary font-medium' : ''}>
                {t(`onboarding.steps.${s.key}`)}
              </span>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="border-2">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit mb-2">
              <StepIcon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">{t(`onboarding.stepDesc.${stepKey}`)}</CardTitle>
            <CardDescription>{t(`onboarding.stepHelp.${stepKey}`)}</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
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
                    <p className="font-semibold mt-2 text-foreground">{t(lang.labelKey)}</p>
                  </button>
                ))}
              </div>
            )}

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
                    <p className="font-semibold mt-1 text-foreground">{t(`onboarding.streams.${stream.id}`)}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t(`onboarding.streams.${stream.id}Desc`)}</p>
                  </button>
                ))}
              </div>
            )}

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
                      <p className="font-semibold text-foreground">{t(`onboarding.goals.${goal.id}`)}</p>
                      <p className="text-sm text-muted-foreground">{t(`onboarding.goals.${goal.id}Desc`)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <p className="text-center text-sm text-muted-foreground mb-4">
                  {t('onboarding.confidenceQuestion', {
                    langs: languages.map(l => t(`languages.${l}`)).filter(Boolean).join(' / '),
                  })}
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
                    <p className="font-medium text-foreground">{t(`onboarding.confidence.${level.value}`)}</p>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="ghost" onClick={() => setStep(s => s - 1)} disabled={step === 0}>
            <ChevronLeft className="h-4 w-4 mr-1" /> {t('common.back')}
          </Button>

          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}>
              {t('common.next')} <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleFinish} disabled={!canProceed() || saving}>
              {saving ? t('common.saving') : t('onboarding.startLearning')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
