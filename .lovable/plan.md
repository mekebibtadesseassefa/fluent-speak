

# Feb3 — Phase 1: Admin Panel & Design System (UI with Mock Data)

## Overview
Build the Admin Command Center and core design system for Feb3 / Fluent with TED. This phase establishes the visual foundation, navigation structure, and admin UI — all with mock data so you can demo and iterate before adding the backend.

---

## 1. Design System & Brand Foundation
Apply the Feb3 brand tokens across the entire app:
- **Colors**: Navy (#0D2B4E), Teal (#0B6E6E), Gold (#B8770D), Coral (#C0392B), Green (#1A6B3A), Purple (#5C3D8F) plus grays
- **Typography**: Inter font with the specified heading/body hierarchy
- **Component theming**: Buttons (Primary/Secondary/Danger/Ghost/Admin), cards, badges, and form elements styled to match the spec
- **Dark mode support** via CSS variables

## 2. Role-Based Sidebar Navigation
A collapsible sidebar that adapts based on user role:
- **Super Admin** view (purple accent): Overview, Methodology, Companies, Content, Feature Flags, Audit Log, Analytics, Settings
- Role switcher dropdown in the top nav (mock: switch between Super Admin, Sub-Admin Ops, Sub-Admin Finance, Sub-Admin Content)
- User avatar + name + logout at sidebar bottom
- Feb3 wordmark/logo in sidebar header

## 3. Super Admin Command Center (Dashboard)
The main admin landing page with:
- **Top metrics bar**: Total MRR, Active Subscriptions, Active Teachers, Content Items Published (all mock data)
- **Platform health cards**: Activation rate, Teacher utilization, Content freshness, Cancellation rate
- **Recent activity feed**: A scrollable list of recent platform events (mock: new signups, cancellations, teacher onboarded, etc.)

## 4. Company Management Page
- Data table listing all companies with: Name, CNPJ, Plan, Employee Count, MRR, Renewal Date, Status
- Status badges: Active (green), Suspended (yellow), Terminated (red)
- Actions per row: View, Override Plan, Suspend, Terminate
- Filters: Status, Plan type, search by name
- Mock data for 8–10 sample companies

## 5. Methodology Builder Page
The drag-and-drop UIRF phase editor:
- List of methodology versions (draft/active/archived)
- Phase editor: reorderable list of phases, each with name, student instruction, teacher prompt, duration, and applies_to toggle
- Level adaptation fields (A2–C2)
- Publish/archive version controls
- Mock data: the default 7-phase UIRF cycle pre-populated

## 6. Feature Flags Manager
- Toggle grid for system features (mock flags like: AI Chat in Self-Study, Vocabulary Save, Group Class Auto-Create, ESG Reporting, Maintenance Mode)
- Each flag shows name, description, and on/off switch
- Changes reflected immediately in UI state

## 7. Audit Log Page
- Searchable, filterable table of admin actions
- Columns: Timestamp, Actor, Action, Resource, Details
- Filters: Date range, Actor, Action type
- Expandable rows showing before/after JSON diffs
- Mock data: 20+ sample audit entries

## 8. Sub-Admin Views (Permission-Gated)
Simplified dashboard views for each sub-admin role:
- **Ops**: User verification queue, teacher onboarding status, class capacity
- **Finance**: Subscription overview, payout queue, refund log
- **Content**: Publishing calendar, curator approval queue, framework list
Each view shows only what that role is permitted to see (enforced in UI with mock role switching)

## 9. Content Management Preview
- Content approval queue: cards showing submitted items with status, metadata, and approve/reject actions
- Publishing calendar: week-based grid view showing scheduled content
- Framework list: configurable content frameworks (TED, News, Global South, etc.)

## 10. Placeholder Pages for Future Modules
Simple placeholder pages with descriptions for:
- Student Dashboard, Teacher Platform, Scheduling, Payments, Analytics
- These will be built in subsequent phases

---

## What's NOT in this phase (coming later)
- Supabase/Cloud backend and database
- Authentication & CPF/CNPJ validation
- Payment integrations (PIX, Stripe)
- Jitsi video integration
- WhatsApp notifications
- Student & Teacher dashboards (full)
- Real data and API connections

