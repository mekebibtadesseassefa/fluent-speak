import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AdminLayout } from "@/components/AdminLayout";

// Auth
import AuthPage from "@/pages/AuthPage";

// Role router
import RoleDashboard from "@/pages/RoleDashboard";

// Admin pages
import AdminDashboard from "@/pages/AdminDashboard";
import CompaniesPage from "@/pages/CompaniesPage";
import MethodologyPage from "@/pages/MethodologyPage";
import FeatureFlagsPage from "@/pages/FeatureFlagsPage";
import AuditLogPage from "@/pages/AuditLogPage";
import ContentManagementPage from "@/pages/ContentManagementPage";
import VerificationPage from "@/pages/VerificationPage";
import TeacherOnboardingPage from "@/pages/TeacherOnboardingPage";
import ClassCapacityPage from "@/pages/ClassCapacityPage";
import SubscriptionsPage from "@/pages/SubscriptionsPage";
import PayoutsPage from "@/pages/PayoutsPage";
import RefundsPage from "@/pages/RefundsPage";
import PublishingCalendarPage from "@/pages/PublishingCalendarPage";
import FrameworksPage from "@/pages/FrameworksPage";
import PlaceholderPage from "@/pages/PlaceholderPage";

// Student pages
import StudentDashboard from "@/pages/StudentDashboard";
import StudentContentFeed from "@/pages/StudentContentFeed";
import StudentSelfStudy from "@/pages/StudentSelfStudy";
import StudentBookingPage from "@/pages/StudentBookingPage";
import StudentClassHistory from "@/pages/StudentClassHistory";

// Facilitator pages
import TeacherDashboardPage from "@/pages/TeacherDashboardPage";
import TeacherSchedulePage from "@/pages/TeacherSchedulePage";
import TeacherIncomePage from "@/pages/TeacherIncomePage";

// HR pages
import HRDashboardPage from "@/pages/HRDashboardPage";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public auth route */}
            <Route path="/auth" element={<AuthRoute><AuthPage /></AuthRoute>} />

            {/* Role router */}
            <Route path="/" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />

            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/companies" element={<ProtectedRoute><AdminLayout><CompaniesPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/methodology" element={<ProtectedRoute><AdminLayout><MethodologyPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/feature-flags" element={<ProtectedRoute><AdminLayout><FeatureFlagsPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/audit-log" element={<ProtectedRoute><AdminLayout><AuditLogPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/content" element={<ProtectedRoute><AdminLayout><ContentManagementPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/verification" element={<ProtectedRoute><AdminLayout><VerificationPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/teacher-onboarding" element={<ProtectedRoute><AdminLayout><TeacherOnboardingPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/class-capacity" element={<ProtectedRoute><AdminLayout><ClassCapacityPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/subscriptions" element={<ProtectedRoute><AdminLayout><SubscriptionsPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/payouts" element={<ProtectedRoute><AdminLayout><PayoutsPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/refunds" element={<ProtectedRoute><AdminLayout><RefundsPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/publishing-calendar" element={<ProtectedRoute><AdminLayout><PublishingCalendarPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/frameworks" element={<ProtectedRoute><AdminLayout><FrameworksPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute><AdminLayout><PlaceholderPage title="Analytics" description="Platform analytics, social impact metrics, and reporting dashboards." /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><AdminLayout><PlaceholderPage title="Settings" description="Platform configuration, permission matrix, and system preferences." /></AdminLayout></ProtectedRoute>} />

            {/* Student routes */}
            <Route path="/student" element={<ProtectedRoute><AdminLayout><StudentDashboard /></AdminLayout></ProtectedRoute>} />
            <Route path="/student/content" element={<ProtectedRoute><AdminLayout><StudentContentFeed /></AdminLayout></ProtectedRoute>} />
            <Route path="/student/content/:id" element={<ProtectedRoute><AdminLayout><StudentSelfStudy /></AdminLayout></ProtectedRoute>} />
            <Route path="/student/book" element={<ProtectedRoute><AdminLayout><StudentBookingPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/student/classes" element={<ProtectedRoute><AdminLayout><StudentClassHistory /></AdminLayout></ProtectedRoute>} />

            {/* Teacher routes */}
            <Route path="/teacher" element={<ProtectedRoute><AdminLayout><TeacherDashboardPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/teacher/schedule" element={<ProtectedRoute><AdminLayout><TeacherSchedulePage /></AdminLayout></ProtectedRoute>} />
            <Route path="/teacher/agendas" element={<ProtectedRoute><AdminLayout><PlaceholderPage title="Student Agendas" description="Review submitted agendas for upcoming classes." /></AdminLayout></ProtectedRoute>} />
            <Route path="/teacher/income" element={<ProtectedRoute><AdminLayout><TeacherIncomePage /></AdminLayout></ProtectedRoute>} />

            {/* HR routes */}
            <Route path="/hr" element={<ProtectedRoute><AdminLayout><HRDashboardPage /></AdminLayout></ProtectedRoute>} />

            {/* Legacy redirects */}
            <Route path="/companies" element={<Navigate to="/admin/companies" replace />} />
            <Route path="/methodology" element={<Navigate to="/admin/methodology" replace />} />
            <Route path="/feature-flags" element={<Navigate to="/admin/feature-flags" replace />} />
            <Route path="/audit-log" element={<Navigate to="/admin/audit-log" replace />} />
            <Route path="/content" element={<Navigate to="/admin/content" replace />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
