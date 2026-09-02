import React from 'react'
import { motion } from 'framer-motion'
import { Settings, User, Bell, Search } from 'lucide-react'
import { getEnvironment, APP_CONFIG } from '@utils/config'

const Header: React.FC = () => {
  const env = getEnvironment()

  return (
    <header className="bg-white border-b border-morris-gray-200 sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-10 h-10 bg-gradient-morris rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient-morris">
                MorrisFlow
              </h1>
              <p className="text-xs text-morris-gray-500">
                Framework Morris v{APP_CONFIG.frameworkVersion}
              </p>
            </div>
          </motion.div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-morris-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar en MorrisFlow..."
                className="morris-input pl-10 w-full"
              />
            </div>
          </div>

          {/* Actions */}
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Environment Indicator */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                env.mode === 'production' ? 'bg-morris-success' :
                env.mode === 'staging' ? 'bg-morris-warning' :
                'bg-morris-primary'
              }`} />
              <span className="text-xs text-morris-gray-500 uppercase font-medium">
                {env.mode}
              </span>
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-morris-gray-400 hover:text-morris-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-morris-error rounded-full flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              </span>
            </button>

            {/* Settings */}
            <button className="p-2 text-morris-gray-400 hover:text-morris-gray-600 transition-colors">
              <Settings className="w-5 h-5" />
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-morris-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-morris-gray-900">Admin</p>
                <p className="text-xs text-morris-gray-500">Morris Framework</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  )
}

export default Header