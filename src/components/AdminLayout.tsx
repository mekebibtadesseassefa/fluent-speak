import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import { useAuth, type AppRole } from '@/contexts/AuthContext';

const ROLE_LABELS: Record<AppRole, string> = {
  super_admin: 'Super Admin',
  sub_admin_ops: 'Sub-Admin Ops',
  sub_admin_finance: 'Sub-Admin Finance',
  sub_admin_content: 'Sub-Admin Content',
  pedagogical_lead: 'Pedagogical Lead',
  content_curator: 'Content Curator',
  teacher: 'Facilitator',
  student: 'Student',
  company_hr: 'Company HR',
  company_finance: 'Company Finance',
};

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { activeRole } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b flex items-center px-4 gap-3 bg-card shrink-0">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{activeRole ? ROLE_LABELS[activeRole] : 'Loading...'}</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">Feb3 Platform</span>
            </div>
          </header>
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
