import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Shield, Settings, DollarSign, Newspaper, Building2 } from 'lucide-react';

const DEMO_PASSWORD = 'demo123456';

const DEMO_ACCOUNTS = [
  { role: 'student', email: 'demo.student@feb3.app', name: 'Ana Silva', label: 'Student', icon: GraduationCap, color: 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 border-emerald-500/20', roleSetup: 'student' },
  { role: 'teacher', email: 'demo.facilitator@feb3.app', name: 'Carlos Mendes', label: 'Facilitator', icon: BookOpen, color: 'bg-blue-500/10 text-blue-700 hover:bg-blue-500/20 border-blue-500/20', roleSetup: 'teacher' },
  { role: 'company_hr', email: 'demo.hr@feb3.app', name: 'Mariana Costa', label: 'Company HR', icon: Building2, color: 'bg-purple-500/10 text-purple-700 hover:bg-purple-500/20 border-purple-500/20', roleSetup: 'company_hr' },
  { role: 'super_admin', email: 'demo.admin@feb3.app', name: 'Rafael Admin', label: 'Super Admin', icon: Shield, color: 'bg-red-500/10 text-red-700 hover:bg-red-500/20 border-red-500/20', roleSetup: '' },
  { role: 'sub_admin_ops', email: 'demo.ops@feb3.app', name: 'Ops Manager', label: 'Ops Admin', icon: Settings, color: 'bg-orange-500/10 text-orange-700 hover:bg-orange-500/20 border-orange-500/20', roleSetup: '' },
  { role: 'sub_admin_finance', email: 'demo.finance@feb3.app', name: 'Finance Lead', label: 'Finance Admin', icon: DollarSign, color: 'bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 border-yellow-500/20', roleSetup: '' },
  { role: 'sub_admin_content', email: 'demo.content@feb3.app', name: 'Content Curator', label: 'Content Admin', icon: Newspaper, color: 'bg-teal-500/10 text-teal-700 hover:bg-teal-500/20 border-teal-500/20', roleSetup: '' },
];

export default function DemoLoginButtons() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const handleDemoLogin = async (account: typeof DEMO_ACCOUNTS[0]) => {
    setLoadingRole(account.role);

    // Try to sign in first
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: account.email,
      password: DEMO_PASSWORD,
    });

    if (!signInError) {
      navigate('/');
      setLoadingRole(null);
      return;
    }

    // Account doesn't exist — create it via edge function (auto-confirms email)
    const { data: fnData, error: fnError } = await supabase.functions.invoke('create-demo-user', {
      body: {
        email: account.email,
        password: DEMO_PASSWORD,
        full_name: account.name,
        role: account.role,
        role_setup: account.roleSetup,
      },
    });

    if (fnError) {
      toast({ title: 'Demo login failed', description: fnError.message, variant: 'destructive' });
      setLoadingRole(null);
      return;
    }

    // Now sign in
    const { error: finalSignIn } = await supabase.auth.signInWithPassword({
      email: account.email,
      password: DEMO_PASSWORD,
    });

    if (finalSignIn) {
      toast({ title: 'Demo login failed', description: finalSignIn.message, variant: 'destructive' });
    } else {
      navigate('/');
    }

    setLoadingRole(null);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Quick Demo Access</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {DEMO_ACCOUNTS.map((account) => {
          const Icon = account.icon;
          return (
            <Button
              key={account.role}
              variant="outline"
              size="sm"
              className={`justify-start gap-2 text-xs border ${account.color}`}
              disabled={loadingRole !== null}
              onClick={() => handleDemoLogin(account)}
            >
              {loadingRole === account.role ? (
                <span className="animate-spin h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <Icon className="h-3.5 w-3.5" />
              )}
              {account.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
