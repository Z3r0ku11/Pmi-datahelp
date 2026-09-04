import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@shared/components/AuthProvider';
import { ProtectedRoute } from '@shared/components/ProtectedRoute';
import { LoginForm } from '@shared/components/LoginForm';
import { Header } from '@shared/components/Header';
import { useAuth } from '@shared/hooks/useAuth';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Modules from './pages/Modules';
import Tools from './pages/Tools';
import Resources from './pages/Resources';
import Login from './pages/Login';
import './App.css';

const LoginPage = () => (
  <LoginForm 
    redirectTo="/" 
    showGoogleAuth={true}
    phase="1"
  />
);

const AuthenticatedApp = () => {
  const { authState, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="PMI-DataHelp"
        user={authState.user}
        onLogout={logout}
        showUserMenu={true}
        phase="phase1"
      />
      
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/modules" element={<Modules />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2026 PMI-DataHelp. Portal educativo de gestión de proyectos.</p>
            <p className="mt-2">Versión {__VERSION__} | AWS Cloud Native</p>
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
              <ProtectedRoute phase="1">
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