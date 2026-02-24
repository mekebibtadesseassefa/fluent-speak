import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function RoleDashboard() {
  const { activeRole, loading } = useAuth();

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>;

  // Redirect based on active role
  switch (activeRole) {
    case 'student':
      return <Navigate to="/student" replace />;
    case 'teacher':
      return <Navigate to="/teacher" replace />;
    case 'company_hr':
    case 'company_finance':
      return <Navigate to="/hr" replace />;
    case 'super_admin':
    case 'sub_admin_ops':
    case 'sub_admin_finance':
    case 'sub_admin_content':
    case 'pedagogical_lead':
    case 'content_curator':
      return <Navigate to="/admin" replace />;
    default:
      // No role assigned yet, show a placeholder
      return (
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold text-navy">Welcome to Feb3</h2>
          <p className="text-muted-foreground mt-2">Your account is being set up. Please wait for role assignment.</p>
        </div>
      );
  }
}
