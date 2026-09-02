import React from 'react'
import { APP_CONFIG, getEnvironment } from '@utils/config'

const Footer: React.FC = () => {
  const env = getEnvironment()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-morris-gray-200 mt-auto">
      <div className="px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          {/* Left Side */}
          <div className="flex items-center space-x-4 text-sm text-morris-gray-600">
            <span>
              © {currentYear} MorrisFlow - Framework Morris v{APP_CONFIG.frameworkVersion}
            </span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">
              Sistema de Gestión de Proyectos
            </span>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4 text-sm text-morris-gray-500">
            <span>
              Versión {APP_CONFIG.version}
            </span>
            <span>|</span>
            <span className="capitalize">
              {env.mode}
            </span>
            {env.features.debugMode && (
              <>
                <span>|</span>
                <span className="text-morris-warning font-medium">
                  Debug Mode
                </span>
              </>
            )}
          </div>
        </div>

        {/* Build Info (Debug Mode Only) */}
        {env.features.debugMode && (
          <div className="mt-2 pt-2 border-t border-morris-gray-100">
            <div className="text-xs text-morris-gray-400 space-x-4">
              <span>Build: {APP_CONFIG.buildTime}</span>
              <span>Framework: {APP_CONFIG.frameworkVersion}</span>
              <span>API: {env.apiUrl || 'Local'}</span>
            </div>
          </div>
        )}
      </div>
    </footer>
  )
}

export default Footer