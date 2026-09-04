import React from 'react';
import { Routes, Route } from 'react-router-dom';

// PMO Portal Pages
import PMODashboard from './pages/PMODashboard';
import ProjectFramework from './pages/ProjectFramework';
import ProjectFlow from './pages/ProjectFlow';
import Portfolio from './pages/Portfolio';
import Projects from './pages/Projects';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const PMOPortal: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PMODashboard />} />
      <Route path="/framework" element={<ProjectFramework />} />
      <Route path="/flow" element={<ProjectFlow />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};

export default PMOPortal;