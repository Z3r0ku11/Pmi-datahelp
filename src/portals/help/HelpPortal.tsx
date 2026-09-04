import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Help Portal Pages
import HelpHome from './pages/HelpHome';
import Resources from './pages/Resources';
import Tools from './pages/Tools';
import Guides from './pages/Guides';
import Courses from './pages/Courses';
import Templates from './pages/Templates';

const HelpPortal: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HelpHome />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/guides" element={<Guides />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/templates" element={<Templates />} />
    </Routes>
  );
};

export default HelpPortal;