import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoleProvider } from "@/contexts/RoleContext";
import { AdminLayout } from "@/components/AdminLayout";
import RoleDashboard from "@/pages/RoleDashboard";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RoleProvider>
        <BrowserRouter>
          <AdminLayout>
            <Routes>
              <Route path="/" element={<RoleDashboard />} />
              <Route path="/companies" element={<CompaniesPage />} />
              <Route path="/methodology" element={<MethodologyPage />} />
              <Route path="/feature-flags" element={<FeatureFlagsPage />} />
              <Route path="/audit-log" element={<AuditLogPage />} />
              <Route path="/content" element={<ContentManagementPage />} />
              <Route path="/verification" element={<VerificationPage />} />
              <Route path="/teacher-onboarding" element={<TeacherOnboardingPage />} />
              <Route path="/class-capacity" element={<ClassCapacityPage />} />
              <Route path="/subscriptions" element={<SubscriptionsPage />} />
              <Route path="/payouts" element={<PayoutsPage />} />
              <Route path="/refunds" element={<RefundsPage />} />
              <Route path="/publishing-calendar" element={<PublishingCalendarPage />} />
              <Route path="/frameworks" element={<FrameworksPage />} />
              <Route path="/analytics" element={<PlaceholderPage title="Analytics" description="Platform analytics, social impact metrics, and reporting dashboards." />} />
              <Route path="/settings" element={<PlaceholderPage title="Settings" description="Platform configuration, permission matrix, and system preferences." />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AdminLayout>
        </BrowserRouter>
      </RoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
