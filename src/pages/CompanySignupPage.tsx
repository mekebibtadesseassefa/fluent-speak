import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const formatCNPJ = (value: string) => {
  const d = value.replace(/\D/g, '').slice(0, 14);
  return d
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
};

export default function CompanySignupPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [domains, setDomains] = useState('');
  const [hrName, setHrName] = useState('');
  const [hrEmail, setHrEmail] = useState('');
  const [hrPassword, setHrPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hrPassword.length < 8) {
      toast({ title: t('auth.passwordTooShort'), description: t('auth.passwordMinChars'), variant: 'destructive' });
      return;
    }
    setLoading(true);

    const cleanDomains = domains
      .split(/[,\s]+/)
      .map(d => d.trim().toLowerCase().replace(/^@/, ''))
      .filter(Boolean);

    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: companyName,
        cnpj: cnpj.replace(/\D/g, '') || null,
        billing_email: billingEmail || null,
        email_domains: cleanDomains,
        status: 'pending',
      })
      .select()
      .single();

    if (companyError || !company) {
      setLoading(false);
      toast({ title: t('companySignup.failed'), description: companyError?.message, variant: 'destructive' });
      return;
    }

    const { data: signup, error: signupError } = await supabase.auth.signUp({
      email: hrEmail,
      password: hrPassword,
      options: {
        data: { full_name: hrName },
        emailRedirectTo: window.location.origin,
      },
    });

    if (signupError) {
      setLoading(false);
      toast({ title: t('auth.signupFailed'), description: signupError.message, variant: 'destructive' });
      return;
    }

    if (signup.user) {
      await supabase.from('user_roles').insert({ user_id: signup.user.id, role: 'company_hr', is_active: true });
      await supabase.from('company_employees').insert({
        company_id: company.id,
        user_id: signup.user.id,
        active: false,
      });
    }

    setLoading(false);
    toast({ title: t('companySignup.submitted'), description: t('companySignup.pendingApproval') });
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-xl space-y-3">
        <div className="flex justify-end"><LanguageSwitcher /></div>
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center text-primary-foreground font-bold text-lg">F3</div>
              <span className="text-xl font-bold text-navy">Feb3</span>
            </div>
            <CardTitle className="text-2xl">{t('companySignup.title')}</CardTitle>
            <CardDescription>{t('companySignup.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">{t('auth.companyName')}</Label>
                <Input id="company-name" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="cnpj">{t('auth.cnpj')}</Label>
                  <Input id="cnpj" placeholder="00.000.000/0000-00" value={cnpj} onChange={e => setCnpj(formatCNPJ(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing-email">{t('companySignup.billingEmail')}</Label>
                  <Input id="billing-email" type="email" value={billingEmail} onChange={e => setBillingEmail(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="domains">{t('companySignup.emailDomains')}</Label>
                <Input id="domains" placeholder="acme.com, acme.com.br" value={domains} onChange={e => setDomains(e.target.value)} required />
                <p className="text-xs text-muted-foreground">{t('companySignup.domainsHelp')}</p>
              </div>

              <div className="border-t pt-4 space-y-4">
                <h3 className="font-semibold text-sm">{t('companySignup.hrContact')}</h3>
                <div className="space-y-2">
                  <Label htmlFor="hr-name">{t('auth.fullName')}</Label>
                  <Input id="hr-name" value={hrName} onChange={e => setHrName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hr-email">{t('common.email')}</Label>
                  <Input id="hr-email" type="email" value={hrEmail} onChange={e => setHrEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hr-password">{t('auth.passwordMin')}</Label>
                  <Input id="hr-password" type="password" minLength={8} value={hrPassword} onChange={e => setHrPassword(e.target.value)} required />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('common.loading') : t('companySignup.submit')}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                <Link to="/auth" className="underline">{t('companySignup.backToLogin')}</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
