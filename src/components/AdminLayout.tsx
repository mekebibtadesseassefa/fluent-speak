import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useAuth, type AppRole } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { activeRole } = useAuth();
  const { t } = useTranslation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b flex items-center px-4 gap-3 bg-card shrink-0">
            <SidebarTrigger />
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground truncate">
                {activeRole ? t(`roles.${activeRole as AppRole}`) : t('common.loading')}
              </span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground truncate">Feb3 Platform</span>
            </div>
            <LanguageSwitcher />
          </header>
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
