import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export type AppRole = 
  | 'super_admin' | 'sub_admin_ops' | 'sub_admin_finance' | 'sub_admin_content'
  | 'pedagogical_lead' | 'content_curator' | 'teacher' | 'student'
  | 'company_hr' | 'company_finance';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  roles: AppRole[];
  activeRole: AppRole | null;
  setActiveRole: (role: AppRole) => void;
  profile: { full_name: string; cpf: string | null; avatar_url: string | null } | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [activeRole, setActiveRole] = useState<AppRole | null>(null);
  const [profile, setProfile] = useState<AuthContextType['profile']>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    try {
      const [profileRes, rolesRes] = await Promise.all([
        supabase.from('profiles').select('full_name, cpf, avatar_url').eq('id', userId).single(),
        supabase.from('user_roles').select('role').eq('user_id', userId).eq('is_active', true),
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data);
      }

      if (rolesRes.data && rolesRes.data.length > 0) {
        const userRoles = rolesRes.data.map(r => r.role as AppRole);
        setRoles(userRoles);
        if (!activeRole || !userRoles.includes(activeRole)) {
          setActiveRole(userRoles[0]);
        }
      } else {
        setRoles([]);
        setActiveRole(null);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        setTimeout(() => fetchUserData(session.user.id), 0);
      } else {
        setProfile(null);
        setRoles([]);
        setActiveRole(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRoles([]);
    setActiveRole(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, roles, activeRole, setActiveRole, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
