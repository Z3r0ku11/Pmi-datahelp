import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@shared/components/AuthProvider';
import { ProtectedRoute } from '@shared/components/ProtectedRoute';
import { LoginForm } from '@shared/components/LoginForm';
import { Header } from '@shared/components/Header';
import { useAuth } from '@shared/hooks/useAuth';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Portfolio from './pages/Portfolio';
import Resources from './pages/Resources';
import Risks from './pages/Risks';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import './App.css';

const LoginPage = () => (
  <LoginForm 
    redirectTo="/" 
    showGoogleAuth={true}
    phase="2"
  />
);

const AuthenticatedApp = () => {
  const { authState, logout } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="PMO Dashboard"
        user={authState.user}
        onLogout={logout}
        showUserMenu={true}
        phase="phase2"
      />
      
      <div className="flex">
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          onToggle={toggleSidebar}
        />
        
        <main className={`flex-1 transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}>
          <div className="p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route 
                path="/portfolio" 
                element={
                  <ProtectedRoute requiredPermissions={[{ resource: 'portfolio', action: 'read' }]}>
                    <Portfolio />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/projects" 
                element={
                  <ProtectedRoute requiredPermissions={[{ resource: 'projects', action: 'read' }]}>
                    <Projects />
                  </ProtectedRoute>
                } 
              />
              <Route path="/resources" element={<Resources />} />
              <Route 
                path="/risks" 
                element={
                  <ProtectedRoute requiredPermissions={[{ resource: 'risks', action: 'read' }]}>
                    <Risks />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reports" 
                element={
                  <ProtectedRoute requiredRoles={['admin', 'pmo', 'executive']}>
                    <Reports />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute requiredRoles={['admin']}>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <footer className={`bg-white border-t border-gray-200 transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <div className="px-6 py-4">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>
              &copy; 2026 PMO Dashboard - Proyectos Morris | Versión {__VERSION__}
            </div>
            <div className="flex space-x-4">
              <span>AWS Cloud Native</span>
              <span>•</span>
              <span>Región: us-east-1</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/*" 
            element={
              <ProtectedRoute 
                requireAuth={true} 
                phase="2"
                requiredRoles={['admin', 'pmo', 'executive']}
                fallbackPath="/login"
              >
                <AuthenticatedApp />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;