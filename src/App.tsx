import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoleProvider } from "@/contexts/RoleContext";
import { AdminLayout } from "@/components/AdminLayout";
import AdminDashboard from "@/pages/AdminDashboard";
import CompaniesPage from "@/pages/CompaniesPage";
import MethodologyPage from "@/pages/MethodologyPage";
import FeatureFlagsPage from "@/pages/FeatureFlagsPage";
import AuditLogPage from "@/pages/AuditLogPage";
import ContentManagementPage from "@/pages/ContentManagementPage";
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
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/companies" element={<CompaniesPage />} />
              <Route path="/methodology" element={<MethodologyPage />} />
              <Route path="/feature-flags" element={<FeatureFlagsPage />} />
              <Route path="/audit-log" element={<AuditLogPage />} />
              <Route path="/content" element={<ContentManagementPage />} />
              <Route path="/analytics" element={<PlaceholderPage title="Analytics" description="Platform analytics, social impact metrics, and reporting dashboards." />} />
              <Route path="/settings" element={<PlaceholderPage title="Settings" description="Platform configuration, permission matrix, and system preferences." />} />
              <Route path="/verification" element={<PlaceholderPage title="User Verification" description="CPF/CNPJ verification queue for Ops admins." />} />
              <Route path="/teacher-onboarding" element={<PlaceholderPage title="Teacher Onboarding" description="Teacher application review and onboarding status." />} />
              <Route path="/class-capacity" element={<PlaceholderPage title="Class Capacity" description="Group class capacity management and overflow handling." />} />
              <Route path="/subscriptions" element={<PlaceholderPage title="Subscriptions" description="Subscription overview and management for Finance admins." />} />
              <Route path="/payouts" element={<PlaceholderPage title="Payouts" description="Teacher payout queue and batch processing." />} />
              <Route path="/refunds" element={<PlaceholderPage title="Refunds" description="Refund processing log and management." />} />
              <Route path="/publishing-calendar" element={<PlaceholderPage title="Publishing Calendar" description="Weekly content publishing schedule." />} />
              <Route path="/frameworks" element={<PlaceholderPage title="Frameworks" description="Content framework management (TED, News, Global South, etc.)." />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AdminLayout>
        </BrowserRouter>
      </RoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
