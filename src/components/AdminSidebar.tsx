import {
  LayoutDashboard, Building2, BookOpen, FileText, Flag, ClipboardList, BarChart3, Settings, Users, DollarSign, Calendar, CheckSquare, LogOut,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useRole } from '@/contexts/RoleContext';
import { ROLE_LABELS, type AdminRole } from '@/lib/mock-data';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator,
} from '@/components/ui/sidebar';

const superAdminNav = [
  { title: 'Overview', url: '/', icon: LayoutDashboard },
  { title: 'Methodology', url: '/methodology', icon: BookOpen },
  { title: 'Companies', url: '/companies', icon: Building2 },
  { title: 'Content', url: '/content', icon: FileText },
  { title: 'Feature Flags', url: '/feature-flags', icon: Flag },
  { title: 'Audit Log', url: '/audit-log', icon: ClipboardList },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
  { title: 'Settings', url: '/settings', icon: Settings },
];

const opsNav = [
  { title: 'Overview', url: '/', icon: LayoutDashboard },
  { title: 'User Verification', url: '/verification', icon: CheckSquare },
  { title: 'Teacher Onboarding', url: '/teacher-onboarding', icon: Users },
  { title: 'Class Capacity', url: '/class-capacity', icon: Calendar },
];

const financeNav = [
  { title: 'Overview', url: '/', icon: LayoutDashboard },
  { title: 'Subscriptions', url: '/subscriptions', icon: DollarSign },
  { title: 'Payouts', url: '/payouts', icon: DollarSign },
  { title: 'Refunds', url: '/refunds', icon: ClipboardList },
];

const contentNav = [
  { title: 'Overview', url: '/', icon: LayoutDashboard },
  { title: 'Approval Queue', url: '/content', icon: CheckSquare },
  { title: 'Publishing Calendar', url: '/publishing-calendar', icon: Calendar },
  { title: 'Frameworks', url: '/frameworks', icon: BookOpen },
];

const NAV_BY_ROLE: Record<AdminRole, typeof superAdminNav> = {
  super_admin: superAdminNav,
  sub_admin_ops: opsNav,
  sub_admin_finance: financeNav,
  sub_admin_content: contentNav,
};

export function AdminSidebar() {
  const { role, setRole } = useRole();
  const navItems = NAV_BY_ROLE[role];

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

      <div className="px-3 py-2">
        <Select value={role} onValueChange={(v) => setRole(v as AdminRole)}>
          <SelectTrigger className="w-full bg-sidebar-accent border-sidebar-border text-sidebar-foreground text-xs h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(ROLE_LABELS) as [AdminRole, string][]).map(([key, label]) => (
              <SelectItem key={key} value={key} className="text-xs">{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
                    <NavLink to={item.url} end={item.url === '/'} className="text-sidebar-foreground/80 hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
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
            <AvatarFallback className="bg-admin text-admin-foreground text-xs">AU</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-sidebar-foreground truncate">Admin User</p>
            <p className="text-[11px] text-sidebar-foreground/50 truncate">{ROLE_LABELS[role]}</p>
          </div>
          <button className="text-sidebar-foreground/50 hover:text-sidebar-foreground">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
