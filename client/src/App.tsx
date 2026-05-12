// client/src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicNav     from './components/layout/PublicNav';
import Landing       from './components/pages/Landing';
import Home          from './components/pages/public/Home';
import About         from './components/pages/public/About';
import Projects      from './components/pages/public/Projects';
import InquiryForm   from './components/pages/public/InquiryForm';
import TrackInquiry  from './components/pages/public/TrackInquiry';

const App: React.FC = () => {
  return (
    <Routes>
      {/* Landing — no nav */}
      <Route path="/" element={<Landing />} />

      {/* All public pages — shared nav */}
      <Route element={<PublicNav />}>
        <Route path="/home"     element={<Home />} />
        <Route path="/about"    element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/inquiry"  element={<InquiryForm />} />
        <Route path="/track"    element={<TrackInquiry />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;