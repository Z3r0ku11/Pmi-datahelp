import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'

// Layout Components
import Header from '@components/layout/Header'
import Sidebar from '@components/layout/Sidebar'
import Footer from '@components/layout/Footer'

// Pages
import HomePage from '@pages/HomePage'
import MorrisFrameworkPortal from '@pages/morris/MorrisFrameworkPortal'
import WorkflowEndToEnd from '@pages/morris/WorkflowEndToEnd'
import ProjectFlowV2 from '@pages/morris/ProjectFlowV2'
import AssessmentFlowV5 from '@pages/morris/AssessmentFlowV5'
import FrameworkOverview from '@pages/morris/FrameworkOverview'
import PMIHelpPortal from '@pages/pmi/PMIHelpPortal'
import PMIResources from '@pages/pmi/PMIResources'
import PMICertifications from '@pages/pmi/PMICertifications'
import PMIGuides from '@pages/pmi/PMIGuides'

// Utils
import { getEnvironment } from '@utils/config'

function App() {
  const env = getEnvironment()

  return (
    <div className="min-h-screen bg-morris-gray-50 flex flex-col">
      {/* Environment Banner for Staging */}
      {env.mode === 'staging' && (
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-morris-warning text-white px-4 py-2 text-center text-sm font-medium"
        >
          🚧 AMBIENTE DE STAGE - {env.name} v{env.frameworkVersion || '3.1'}
        </motion.div>
      )}

      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Page Content */}
        <main className="flex-1 p-6 ml-64 morris-scrollbar overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Routes>
              {/* Home */}
              <Route path="/" element={<HomePage />} />

              {/* Morris Framework Portal */}
              <Route path="/morris" element={<MorrisFrameworkPortal />} />
              <Route path="/morris/framework" element={<FrameworkOverview />} />
              <Route path="/morris/workflow" element={<WorkflowEndToEnd />} />
              <Route path="/morris/project-flow" element={<ProjectFlowV2 />} />
              <Route path="/morris/assessment" element={<AssessmentFlowV5 />} />

              {/* PMI Help Portal */}
              <Route path="/pmi" element={<PMIHelpPortal />} />
              <Route path="/pmi/resources" element={<PMIResources />} />
              <Route path="/pmi/certifications" element={<PMICertifications />} />
              <Route path="/pmi/guides" element={<PMIGuides />} />

              {/* 404 Route */}
              <Route path="*" element={
                <div className="text-center py-12">
                  <h1 className="text-2xl font-bold text-morris-gray-900 mb-4">
                    Página no encontrada
                  </h1>
                  <p className="text-morris-gray-600 mb-8">
                    La página que buscas no existe en MorrisFlow.
                  </p>
                  <a href="/" className="morris-button-primary">
                    Volver al Inicio
                  </a>
                </div>
              } />
            </Routes>
          </motion.div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App