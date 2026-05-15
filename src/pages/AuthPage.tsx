import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type SignupRole = 'student' | 'teacher' | 'company_hr';

export default function AuthPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [selectedRole, setSelectedRole] = useState<SignupRole>('student');
  const [companyName, setCompanyName] = useState('');
  const [cnpj, setCnpj] = useState('');

  const ROLE_OPTIONS: { value: SignupRole; labelKey: string; descKey: string }[] = [
    { value: 'student', labelKey: 'auth.roleStudent', descKey: 'auth.roleStudentDesc' },
    { value: 'teacher', labelKey: 'auth.roleFacilitator', descKey: 'auth.roleFacilitatorDesc' },
    { value: 'company_hr', labelKey: 'auth.roleCompany', descKey: 'auth.roleCompanyDesc' },
  ];

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatCNPJ = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 14);
    return digits
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    setLoading(false);

    if (error) {
      toast({ title: t('auth.loginFailed'), description: error.message, variant: 'destructive' });
    } else {
      navigate('/');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword.length < 8) {
      toast({ title: t('auth.passwordTooShort'), description: t('auth.passwordMinChars'), variant: 'destructive' });
      return;
    }
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setLoading(false);
      toast({ title: t('auth.signupFailed'), description: error.message, variant: 'destructive' });
      return;
    }

    if (data.user) {
      const cleanCpf = cpf.replace(/\D/g, '');
      if (cleanCpf.length === 11) {
        await supabase.from('profiles').update({ cpf: cleanCpf, full_name: fullName }).eq('id', data.user.id);
      }

      await supabase.from('user_roles').insert({ user_id: data.user.id, role: selectedRole, is_active: true });

      // Auto-link student/teacher to a company by email domain
      if (selectedRole === 'student' || selectedRole === 'teacher') {
        const emailDomain = signupEmail.split('@')[1]?.toLowerCase();
        if (emailDomain) {
          const { data: matchedCompany } = await supabase
            .from('companies')
            .select('id, name')
            .contains('email_domains', [emailDomain])
            .eq('status', 'active')
            .maybeSingle();
          if (matchedCompany) {
            await supabase.from('company_employees').insert({
              company_id: matchedCompany.id,
              user_id: data.user.id,
              active: false,
            });
            toast({ title: t('auth.autoLinkedTitle'), description: t('auth.autoLinkedDesc', { company: matchedCompany.name }) });
          }
        }
      }

      if (selectedRole === 'company_hr' && companyName) {
        const cleanCnpj = cnpj.replace(/\D/g, '');
        const { data: company } = await supabase.from('companies').insert({
          name: companyName,
          cnpj: cleanCnpj || null,
          status: 'pending',
        }).select().single();

        if (company) {
          await supabase.from('company_employees').insert({
            company_id: company.id,
            user_id: data.user.id,
            active: true,
            approved_at: new Date().toISOString(),
          });
        }
      }

      if (selectedRole === 'teacher') {
        await supabase.from('teachers').insert({ id: data.user.id });
      }

      if (selectedRole === 'student') {
        await supabase.from('student_preferences').insert({ user_id: data.user.id });
      }
    }

    setLoading(false);
    toast({ title: t('auth.accountCreated'), description: t('auth.verifyEmail') });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-3">
        <div className="flex justify-end"><LanguageSwitcher /></div>
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center text-white font-bold text-lg">F3</div>
              <span className="text-xl font-bold text-navy">Feb3</span>
            </div>
            <CardTitle className="text-2xl">{t('auth.welcome')}</CardTitle>
            <CardDescription>{t('auth.tagline')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
                <TabsTrigger value="signup">{t('auth.signup')}</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">{t('common.email')}</Label>
                    <Input id="login-email" type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">{t('common.password')}</Label>
                    <Input id="login-password" type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? t('auth.loggingIn') : t('auth.login')}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full-name">{t('auth.fullName')}</Label>
                    <Input id="full-name" value={fullName} onChange={e => setFullName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{t('common.email')}</Label>
                    <Input id="signup-email" type="email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">{t('auth.passwordMin')}</Label>
                    <Input id="signup-password" type="password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} required minLength={8} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">{t('auth.cpf')}</Label>
                    <Input id="cpf" placeholder="000.000.000-00" value={cpf} onChange={e => setCpf(formatCPF(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('auth.iAmA')}</Label>
                    <Select value={selectedRole} onValueChange={v => setSelectedRole(v as SignupRole)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {ROLE_OPTIONS.map(r => (
                          <SelectItem key={r.value} value={r.value}>
                            <span className="font-medium">{t(r.labelKey)}</span>
                            <span className="text-xs text-muted-foreground ml-2">{t(r.descKey)}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedRole === 'company_hr' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="company-name">{t('auth.companyName')}</Label>
                        <Input id="company-name" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cnpj">{t('auth.cnpj')}</Label>
                        <Input id="cnpj" placeholder="00.000.000/0000-00" value={cnpj} onChange={e => setCnpj(formatCNPJ(e.target.value))} />
                      </div>
                    </>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? t('auth.creatingAccount') : t('auth.signup')}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground pt-2">
                    {t('auth.isCompany')}
                    <Link to="/company/signup" className="underline text-primary">{t('auth.registerCompany')}</Link>
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
