import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function RoleDashboard() {
  const { t } = useTranslation();
  const { activeRole, loading } = useAuth();

  if (loading) return <div className="p-6 text-muted-foreground">{t('common.loading')}</div>;

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
      return (
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold text-navy">{t('common.welcome')} Feb3</h2>
          <p className="text-muted-foreground mt-2">{t('roleDashboard.accountSetup')}</p>
        </div>
      );
  }
}
