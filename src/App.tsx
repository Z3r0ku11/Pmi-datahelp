import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './shared/components/AuthProvider';
import { ProtectedRoute } from './shared/components/ProtectedRoute';

// Main Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

// Portal de Ayuda (Public Educational Content)
import HelpPortal from './portals/help/HelpPortal';
import HelpLayout from './portals/help/layout/HelpLayout';

// Portal PMO Morris (Executive Dashboard)
import PMOPortal from './portals/pmo/PMOPortal';
import PMOLayout from './portals/pmo/layout/PMOLayout';

// Global Layout
import MainLayout from './components/layout/MainLayout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Página Principal - Índice */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Portal de Ayuda - Público */}
          <Route path="/help/*" element={
            <HelpLayout>
              <Routes>
                <Route path="/*" element={<HelpPortal />} />
              </Routes>
            </HelpLayout>
          } />
          
          {/* Portal PMO Morris - Restringido */}
          <Route path="/pmo/*" element={
            <ProtectedRoute 
              requireAuth={true}
              requiredRoles={['admin', 'pmo', 'executive']}
              fallbackPath="/login"
            >
              <PMOLayout>
                <Routes>
                  <Route path="/*" element={<PMOPortal />} />
                </Routes>
              </PMOLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;