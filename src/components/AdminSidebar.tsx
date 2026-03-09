import {
  LayoutDashboard, Building2, BookOpen, FileText, Flag, ClipboardList, BarChart3, Settings, Users, DollarSign, Calendar, CheckSquare, LogOut, Mic, Flame, GraduationCap,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth, type AppRole } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator,
} from '@/components/ui/sidebar';

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

const superAdminNav = [
  { title: 'Overview', url: '/admin', icon: LayoutDashboard },
  { title: 'Methodology', url: '/admin/methodology', icon: BookOpen },
  { title: 'Companies', url: '/admin/companies', icon: Building2 },
  { title: 'Content', url: '/admin/content', icon: FileText },
  { title: 'Feature Flags', url: '/admin/feature-flags', icon: Flag },
  { title: 'Audit Log', url: '/admin/audit-log', icon: ClipboardList },
  { title: 'Analytics', url: '/admin/analytics', icon: BarChart3 },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

const opsNav = [
  { title: 'Overview', url: '/admin', icon: LayoutDashboard },
  { title: 'User Verification', url: '/admin/verification', icon: CheckSquare },
  { title: 'Teacher Onboarding', url: '/admin/teacher-onboarding', icon: Users },
  { title: 'Class Capacity', url: '/admin/class-capacity', icon: Calendar },
];

const financeNav = [
  { title: 'Overview', url: '/admin', icon: LayoutDashboard },
  { title: 'Subscriptions', url: '/admin/subscriptions', icon: DollarSign },
  { title: 'Payouts', url: '/admin/payouts', icon: DollarSign },
  { title: 'Refunds', url: '/admin/refunds', icon: ClipboardList },
];

const contentNav = [
  { title: 'Overview', url: '/admin', icon: LayoutDashboard },
  { title: 'Approval Queue', url: '/admin/content', icon: CheckSquare },
  { title: 'Publishing Calendar', url: '/admin/publishing-calendar', icon: Calendar },
  { title: 'Frameworks', url: '/admin/frameworks', icon: BookOpen },
];

const studentNav = [
  { title: 'Dashboard', url: '/student', icon: LayoutDashboard },
  { title: 'Content Library', url: '/student/content', icon: BookOpen },
  { title: 'Book a Class', url: '/student/book', icon: Calendar },
  { title: 'My Classes', url: '/student/classes', icon: Mic },
];

const teacherNav = [
  { title: 'Dashboard', url: '/teacher', icon: LayoutDashboard },
  { title: 'Schedule', url: '/teacher/schedule', icon: Calendar },
  { title: 'Student Agendas', url: '/teacher/agendas', icon: FileText },
  { title: 'Income', url: '/teacher/income', icon: DollarSign },
];

const hrNav = [
  { title: 'HR Dashboard', url: '/hr', icon: LayoutDashboard },
];

function getNavForRole(role: AppRole | null) {
  switch (role) {
    case 'super_admin': return superAdminNav;
    case 'sub_admin_ops': return opsNav;
    case 'sub_admin_finance': return financeNav;
    case 'sub_admin_content': return contentNav;
    case 'content_curator': return contentNav;
    case 'pedagogical_lead': return superAdminNav;
    case 'teacher': return teacherNav;
    case 'student': return studentNav;
    case 'company_hr': return hrNav;
    case 'company_finance': return hrNav;
    default: return studentNav;
  }
}

export function AdminSidebar() {
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
            <p className="text-[11px] text-sidebar-foreground/60">Fluent with TED</p>
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
                <SelectItem key={r} value={r} className="text-xs">{ROLE_LABELS[r]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-[11px] uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === '/admin' || item.url === '/student' || item.url === '/teacher' || item.url === '/hr'} className="text-sidebar-foreground/80 hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="h-4 w-4 mr-2" />
                      <span>{item.title}</span>
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
            <p className="text-xs font-medium text-sidebar-foreground truncate">{profile?.full_name || 'User'}</p>
            <p className="text-[11px] text-sidebar-foreground/50 truncate">{activeRole ? ROLE_LABELS[activeRole] : 'No role'}</p>
          </div>
          <button onClick={signOut} className="text-sidebar-foreground/50 hover:text-sidebar-foreground">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
