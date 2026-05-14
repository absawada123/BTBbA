// ── Add these imports to client/src/App.tsx ──
// import InquiriesPage     from './components/pages/admin/inquiries/InquiriesPage';
// import InquiryDetailPage from './components/pages/admin/inquiries/InquiryDetailPage';

// ── Add these routes inside the DashboardLayout <Route> block ──
// <Route path="/dashboard/inquiries"      element={<InquiriesPage />} />
// <Route path="/dashboard/inquiries/:id"  element={<InquiryDetailPage />} />

// ── Full updated App.tsx ──────────────────────────────────────────────────────
// client/src/App.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import PublicNav           from './components/layout/PublicNav';
import DashboardLayout     from './components/layout/DashboardLayout';
import ProtectedRoute      from './components/layout/ProtectedRoute';
import { AuthProvider }    from './context/AuthContext';

import Landing             from './components/pages/Landing';
import Home                from './components/pages/public/Home';
import About               from './components/pages/public/About';
import Projects            from './components/pages/public/Projects';
import InquiryForm         from './components/pages/public/inquiry/InquiryForm';
import TrackInquiry        from './components/pages/public/TrackInquiry';
import Dashboard           from './components/pages/Dashboard';

// ── Admin Inquiry Module
import InquiriesPage       from './components/pages/admin/inquiries/InquiriesPage';
import InquiryDetailPage   from './components/pages/admin/inquiries/InquiryDetailPage';

const App: React.FC = () => (
  <AuthProvider>
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route element={<PublicNav />}>
        <Route path="/home"     element={<Home />} />
        <Route path="/about"    element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/inquiry"  element={<InquiryForm />} />
        <Route path="/track"    element={<TrackInquiry />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard"                    element={<Dashboard />} />
          <Route path="/dashboard/inquiries"          element={<InquiriesPage />} />
          <Route path="/dashboard/inquiries/:id"      element={<InquiryDetailPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </AuthProvider>
);

export default App;