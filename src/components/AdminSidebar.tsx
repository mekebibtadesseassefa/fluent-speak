import {
  LayoutDashboard, Building2, BookOpen, FileText, Flag, ClipboardList, BarChart3, Settings, Users, DollarSign, Calendar, CheckSquare, LogOut, Mic,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth, type AppRole } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator,
} from '@/components/ui/sidebar';

type NavItem = { titleKey: string; url: string; icon: any };

const superAdminNav: NavItem[] = [
  { titleKey: 'nav.overview', url: '/admin', icon: LayoutDashboard },
  { titleKey: 'nav.methodology', url: '/admin/methodology', icon: BookOpen },
  { titleKey: 'nav.companies', url: '/admin/companies', icon: Building2 },
  { titleKey: 'nav.content', url: '/admin/content', icon: FileText },
  { titleKey: 'nav.featureFlags', url: '/admin/feature-flags', icon: Flag },
  { titleKey: 'nav.auditLog', url: '/admin/audit-log', icon: ClipboardList },
  { titleKey: 'nav.analytics', url: '/admin/analytics', icon: BarChart3 },
  { titleKey: 'nav.settings', url: '/admin/settings', icon: Settings },
];

const opsNav: NavItem[] = [
  { titleKey: 'nav.overview', url: '/admin', icon: LayoutDashboard },
  { titleKey: 'nav.userVerification', url: '/admin/verification', icon: CheckSquare },
  { titleKey: 'nav.facilitatorOnboarding', url: '/admin/teacher-onboarding', icon: Users },
  { titleKey: 'nav.classCapacity', url: '/admin/class-capacity', icon: Calendar },
];

const financeNav: NavItem[] = [
  { titleKey: 'nav.overview', url: '/admin', icon: LayoutDashboard },
  { titleKey: 'nav.subscriptions', url: '/admin/subscriptions', icon: DollarSign },
  { titleKey: 'nav.payouts', url: '/admin/payouts', icon: DollarSign },
  { titleKey: 'nav.refunds', url: '/admin/refunds', icon: ClipboardList },
];

const contentNav: NavItem[] = [
  { titleKey: 'nav.overview', url: '/admin', icon: LayoutDashboard },
  { titleKey: 'nav.approvalQueue', url: '/admin/content', icon: CheckSquare },
  { titleKey: 'nav.publishingCalendar', url: '/admin/publishing-calendar', icon: Calendar },
  { titleKey: 'nav.frameworks', url: '/admin/frameworks', icon: BookOpen },
];

const studentNav: NavItem[] = [
  { titleKey: 'nav.dashboard', url: '/student', icon: LayoutDashboard },
  { titleKey: 'nav.contentLibrary', url: '/student/content', icon: BookOpen },
  { titleKey: 'nav.bookClass', url: '/student/book', icon: Calendar },
  { titleKey: 'nav.myClasses', url: '/student/classes', icon: Mic },
];

const facilitatorNav: NavItem[] = [
  { titleKey: 'nav.dashboard', url: '/teacher', icon: LayoutDashboard },
  { titleKey: 'nav.schedule', url: '/teacher/schedule', icon: Calendar },
  { titleKey: 'nav.studentAgendas', url: '/teacher/agendas', icon: FileText },
  { titleKey: 'nav.income', url: '/teacher/income', icon: DollarSign },
];

const hrNav: NavItem[] = [
  { titleKey: 'nav.hrDashboard', url: '/hr', icon: LayoutDashboard },
];

function getNavForRole(role: AppRole | null): NavItem[] {
  switch (role) {
    case 'super_admin': return superAdminNav;
    case 'sub_admin_ops': return opsNav;
    case 'sub_admin_finance': return financeNav;
    case 'sub_admin_content': return contentNav;
    case 'content_curator': return contentNav;
    case 'pedagogical_lead': return superAdminNav;
    case 'teacher': return facilitatorNav;
    case 'student': return studentNav;
    case 'company_hr': return hrNav;
    case 'company_finance': return hrNav;
    default: return studentNav;
  }
}

export function AdminSidebar() {
  const { t } = useTranslation();
  const { activeRole, setActiveRole, roles, profile, signOut } = useAuth();
  const navItems = getNavForRole(activeRole);

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">F3</span>
          </div>
          <div>
            <p className="font-bold text-sidebar-foreground text-sm">Feb3</p>
            <p className="text-[11px] text-sidebar-foreground/60">{t('brand.sidebarTagline')}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      {roles.length > 1 && (
        <div className="px-3 py-2">
          <Select value={activeRole || ''} onValueChange={(v) => setActiveRole(v as AppRole)}>
            <SelectTrigger className="w-full bg-sidebar-accent border-sidebar-border text-sidebar-foreground text-xs h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.map(r => (
                <SelectItem key={r} value={r} className="text-xs">{t(`roles.${r}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-[11px] uppercase tracking-wider">
            {t('nav.section')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.titleKey + item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === '/admin' || item.url === '/student' || item.url === '/teacher' || item.url === '/hr'} className="text-sidebar-foreground/80 hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="h-4 w-4 mr-2" />
                      <span>{t(item.titleKey)}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarSeparator />
        <div className="flex items-center gap-2 pt-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-admin text-admin-foreground text-xs">
              {profile?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-sidebar-foreground truncate">{profile?.full_name || t('common.user')}</p>
            <p className="text-[11px] text-sidebar-foreground/50 truncate">{activeRole ? t(`roles.${activeRole}`) : t('common.noRole')}</p>
          </div>
          <button onClick={signOut} className="text-sidebar-foreground/50 hover:text-sidebar-foreground" aria-label="Sign out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
