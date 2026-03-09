import { useState } from 'react';
import DemoLoginButtons from '@/components/DemoLoginButtons';
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

const ROLE_OPTIONS: { value: SignupRole; label: string; desc: string }[] = [
  { value: 'student', label: 'Student', desc: 'Learn languages with real content' },
  { value: 'teacher', label: 'Teacher', desc: 'Facilitate classes as an educator' },
  { value: 'company_hr', label: 'Company (HR)', desc: 'Manage employee language benefits' },
];

export default function AuthPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [selectedRole, setSelectedRole] = useState<SignupRole>('student');
  const [companyName, setCompanyName] = useState('');
  const [cnpj, setCnpj] = useState('');

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
      toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
    } else {
      navigate('/');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword.length < 8) {
      toast({ title: 'Password too short', description: 'Minimum 8 characters.', variant: 'destructive' });
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
      toast({ title: 'Signup failed', description: error.message, variant: 'destructive' });
      return;
    }

    if (data.user) {
      // Update CPF on profile
      const cleanCpf = cpf.replace(/\D/g, '');
      if (cleanCpf.length === 11) {
        await supabase.from('profiles').update({ cpf: cleanCpf, full_name: fullName }).eq('id', data.user.id);
      }

      // Insert role
      await supabase.from('user_roles').insert({ user_id: data.user.id, role: selectedRole, is_active: true });

      // If company HR, create company
      if (selectedRole === 'company_hr' && companyName) {
        const cleanCnpj = cnpj.replace(/\D/g, '');
        const { data: company } = await supabase.from('companies').insert({ 
          name: companyName, 
          cnpj: cleanCnpj || null 
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

      // If teacher, create teacher record
      if (selectedRole === 'teacher') {
        await supabase.from('teachers').insert({ id: data.user.id });
      }

      // If student, create preferences
      if (selectedRole === 'student') {
        await supabase.from('student_preferences').insert({ user_id: data.user.id });
      }
    }

    setLoading(false);
    toast({ title: 'Account created!', description: 'Please check your email to verify your account.' });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center text-white font-bold text-lg">F3</div>
            <span className="text-xl font-bold text-navy">Feb3</span>
          </div>
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>Fluent with Real Content</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Log In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Logging in...' : 'Log In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input id="full-name" value={fullName} onChange={e => setFullName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password (min 8 chars)</Label>
                  <Input id="signup-password" type="password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} required minLength={8} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" placeholder="000.000.000-00" value={cpf} onChange={e => setCpf(formatCPF(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>I am a...</Label>
                  <Select value={selectedRole} onValueChange={v => setSelectedRole(v as SignupRole)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map(r => (
                        <SelectItem key={r.value} value={r.value}>
                          <span className="font-medium">{r.label}</span>
                          <span className="text-xs text-muted-foreground ml-2">{r.desc}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedRole === 'company_hr' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input id="company-name" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input id="cnpj" placeholder="00.000.000/0000-00" value={cnpj} onChange={e => setCnpj(formatCNPJ(e.target.value))} />
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          <div className="mt-6">
            <DemoLoginButtons />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
