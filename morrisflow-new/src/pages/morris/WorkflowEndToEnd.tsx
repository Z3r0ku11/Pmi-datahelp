import React from 'react'
import { motion } from 'framer-motion'

const WorkflowEndToEnd: React.FC = () => {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">
          Workflow End-to-End
        </h1>
        <p className="text-xl text-white/90">
          Proceso corporativo completo desde recepción hasta cierre formal
        </p>
      </div>

      <div className="morris-card p-8 text-center">
        <img 
          src="/assets/workflow-end-to-end.png" 
          alt="Workflow End-to-End"
          className="w-full h-auto rounded-lg shadow-lg mb-6"
        />
        <h2 className="text-2xl font-bold text-morris-gray-900 mb-4">
          Workflow Corporativo PMO
        </h2>
        <p className="text-morris-gray-600 leading-relaxed max-w-4xl mx-auto">
          Workflow completo con 13 fases estructuradas, desde el ingreso comercial hasta el cierre formal. 
          Incluye gobernanza transversal, gates de validación y control de calidad en cada etapa.
        </p>
      </div>
    </motion.div>
  )
}

export default WorkflowEndToEnd