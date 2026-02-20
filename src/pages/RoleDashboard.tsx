import { useRole } from '@/contexts/RoleContext';
import AdminDashboard from '@/pages/AdminDashboard';
import OpsDashboard from '@/pages/OpsDashboard';
import FinanceDashboard from '@/pages/FinanceDashboard';
import ContentDashboard from '@/pages/ContentDashboard';

const DASHBOARD_BY_ROLE = {
  super_admin: AdminDashboard,
  sub_admin_ops: OpsDashboard,
  sub_admin_finance: FinanceDashboard,
  sub_admin_content: ContentDashboard,
} as const;

export default function RoleDashboard() {
  const { role } = useRole();
  const Dashboard = DASHBOARD_BY_ROLE[role];
  return <Dashboard />;
}
