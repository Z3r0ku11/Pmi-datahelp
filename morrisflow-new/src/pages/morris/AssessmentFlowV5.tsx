import React from 'react'
import { motion } from 'framer-motion'

const AssessmentFlowV5: React.FC = () => {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-gradient-to-br from-red-600 to-pink-700 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">
          Flujo Assessment v5
        </h1>
        <p className="text-xl text-white/90">
          Evaluación integral PMO ágil para proyectos de 4-6 semanas
        </p>
      </div>

      <div className="morris-card p-8 text-center">
        <img 
          src="/assets/flujo-assessment-v5.png" 
          alt="Flujo Assessment v5"
          className="w-full h-auto rounded-lg shadow-lg mb-6"
        />
        <h2 className="text-2xl font-bold text-morris-gray-900 mb-4">
          Gestión PMO Ágil
        </h2>
        <p className="text-morris-gray-600 leading-relaxed max-w-4xl mx-auto">
          Flujo especializado en evaluación y gestión ágil para proyectos de corta duración (4-6 semanas). 
          Optimizado para assessment rápido y entrega de valor incremental.
        </p>
      </div>
    </motion.div>
  )
}

export default AssessmentFlowV5