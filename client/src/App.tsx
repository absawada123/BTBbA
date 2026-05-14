// client/src/App.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import PublicNav       from './components/layout/PublicNav';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute  from './components/layout/ProtectedRoute';

// Auth
import { AuthProvider } from './context/AuthContext';

// Public pages
import Landing      from './components/pages/Landing';
import Home         from './components/pages/public/Home';
import About        from './components/pages/public/About';
import Projects     from './components/pages/public/Projects';
import InquiryForm  from './components/pages/public//inquiry/InquiryForm';
import TrackInquiry from './components/pages/public/TrackInquiry';

// Dashboard pages  (create these files as we build each module)
import Dashboard    from './components/pages/Dashboard';

// ─── App ──────────────────────────────────────────────────────────────────────

const App: React.FC = () => {
  return (
    // AuthProvider wraps everything — any component can call useAuth()
    <AuthProvider>
      <Routes>

        {/* ── Landing — no nav ── */}
        <Route path="/" element={<Landing />} />

        {/* ── Public pages — shared PublicNav ── */}
        <Route element={<PublicNav />}>
          <Route path="/home"     element={<Home />} />
          <Route path="/about"    element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/inquiry"  element={<InquiryForm />} />
          <Route path="/track"    element={<TrackInquiry />} />
        </Route>

        {/* ── Admin dashboard — protected ──
            ProtectedRoute checks auth status:
              loading         → loading screen (no flash)
              unauthenticated → redirect to /
              authenticated   → render DashboardLayout + child routes       */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard"            element={<Dashboard />} />
            {/*
              Future modules — uncomment as each is built:
              <Route path="/dashboard/inquiries"  element={<Inquiries />} />
              <Route path="/dashboard/orders"     element={<Orders />} />
              <Route path="/dashboard/sales"      element={<Sales />} />
              <Route path="/dashboard/inventory"  element={<Inventory />} />
              <Route path="/dashboard/products"   element={<ProductList />} />
              <Route path="/dashboard/expenses"   element={<Expenses />} />
              <Route path="/dashboard/accounts"   element={<Accounts />} />
              <Route path="/dashboard/cashflow"   element={<CashFlow />} />
              <Route path="/dashboard/savings"    element={<Savings />} />
              <Route path="/dashboard/reports"    element={<Reports />} />
              <Route path="/dashboard/analytics"  element={<Analytics />} />
              <Route path="/dashboard/customers"  element={<Customers />} />
              <Route path="/dashboard/import"     element={<ImportData />} />
              <Route path="/dashboard/logs"       element={<ActivityLogs />} />
              <Route path="/dashboard/settings"   element={<Settings />} />
            */}
          </Route>
        </Route>

        {/* ── Catch-all ── */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </AuthProvider>
  );
};

export default App;