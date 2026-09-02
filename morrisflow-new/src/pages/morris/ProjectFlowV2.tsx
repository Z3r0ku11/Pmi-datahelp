import React from 'react'
import { motion } from 'framer-motion'

const ProjectFlowV2: React.FC = () => {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-gradient-to-br from-green-600 to-teal-700 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">
          Flujo Proyectos v2
        </h1>
        <p className="text-xl text-white/90">
          Gestión PMO tradicional/híbrida para proyectos superiores a 6 semanas
        </p>
      </div>

      <div className="morris-card p-8 text-center">
        <img 
          src="/assets/flujo-proyectos-v2.png" 
          alt="Flujo Proyectos v2"
          className="w-full h-auto rounded-lg shadow-lg mb-6"
        />
        <h2 className="text-2xl font-bold text-morris-gray-900 mb-4">
          Gestión PMO Tradicional/Híbrida
        </h2>
        <p className="text-morris-gray-600 leading-relaxed max-w-4xl mx-auto">
          Flujo optimizado para proyectos de mediana y gran escala con duración superior a 6 semanas. 
          Combina metodología tradicional con enfoques híbridos según las necesidades del proyecto.
        </p>
      </div>
    </motion.div>
  )
}

export default ProjectFlowV2