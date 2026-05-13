import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { i18n, t } = useTranslation();
  const current = i18n.language?.startsWith('en') ? 'en' : 'pt-BR';

  const change = (lng: string) => {
    i18n.changeLanguage(lng);
    try { localStorage.setItem('feb3.lang', lng); } catch {}
    document.documentElement.lang = lng;
  };

  return (
    <div className="flex items-center gap-1.5">
      {!compact && <Languages className="h-4 w-4 text-muted-foreground" />}
      <Select value={current} onValueChange={change}>
        <SelectTrigger className="h-8 w-[140px] text-xs" aria-label={t('langSwitcher.label')}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pt-BR" className="text-xs">🇧🇷 {t('langSwitcher.pt')}</SelectItem>
          <SelectItem value="en" className="text-xs">🇺🇸 {t('langSwitcher.en')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
