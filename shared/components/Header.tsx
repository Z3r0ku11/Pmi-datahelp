import React from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  title: string;
  user?: UserType | null;
  onLogout?: () => void;
  onSettings?: () => void;
  showUserMenu?: boolean;
  phase: 'phase1' | 'phase2';
}

export const Header: React.FC<HeaderProps> = ({
  title,
  user,
  onLogout,
  onSettings,
  showUserMenu = true,
  phase
}) => {
  const getPhaseColor = () => {
    return phase === 'phase1' 
      ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
      : 'bg-gradient-to-r from-purple-600 to-indigo-600';
  };

  return (
    <header className={`${getPhaseColor()} text-white shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold">{title}</h1>
            </div>
            {phase === 'phase1' && (
              <div className="hidden md:block">
                <span className="text-blue-100 text-sm">Portal Educativo PMI</span>
              </div>
            )}
            {phase === 'phase2' && (
              <div className="hidden md:block">
                <span className="text-purple-100 text-sm">PMO Executive Dashboard</span>
              </div>
            )}
          </div>

          {showUserMenu && (
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-gray-200">{user.email}</div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {user.avatar ? (
                      <img
                        className="h-8 w-8 rounded-full border-2 border-white/20"
                        src={user.avatar}
                        alt={user.name}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                    
                    <div className="flex space-x-1">
                      {onSettings && (
                        <button
                          onClick={onSettings}
                          className="p-2 rounded-md hover:bg-white/10 transition-colors"
                          title="Settings"
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                      )}
                      
                      {onLogout && (
                        <button
                          onClick={onLogout}
                          className="p-2 rounded-md hover:bg-white/10 transition-colors"
                          title="Logout"
                        >
                          <LogOut className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};