import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  Workflow, 
  GitBranch, 
  BarChart3, 
  CheckSquare, 
  BookOpen,
  Award,
  FileText,
  HelpCircle,
  Settings,
  Users
} from 'lucide-react'

interface NavItem {
  path: string
  label: string
  icon: React.ReactNode
  badge?: string
  children?: NavItem[]
}

const navigationItems: NavItem[] = [
  {
    path: '/',
    label: 'Inicio',
    icon: <Home className="w-5 h-5" />
  },
  {
    path: '/morris',
    label: 'Framework Morris',
    icon: <Workflow className="w-5 h-5" />,
    badge: 'v3.1',
    children: [
      {
        path: '/morris/framework',
        label: 'Resumen Framework',
        icon: <BarChart3 className="w-4 h-4" />
      },
      {
        path: '/morris/workflow',
        label: 'Workflow End-to-End',
        icon: <GitBranch className="w-4 h-4" />
      },
      {
        path: '/morris/project-flow',
        label: 'Flujo Proyectos v2',
        icon: <Workflow className="w-4 h-4" />
      },
      {
        path: '/morris/assessment',
        label: 'Flujo Assessment v5',
        icon: <CheckSquare className="w-4 h-4" />
      }
    ]
  },
  {
    path: '/pmi',
    label: 'Portal Ayuda PMI',
    icon: <BookOpen className="w-5 h-5" />,
    children: [
      {
        path: '/pmi/resources',
        label: 'Recursos PMI',
        icon: <FileText className="w-4 h-4" />
      },
      {
        path: '/pmi/certifications',
        label: 'Certificaciones',
        icon: <Award className="w-4 h-4" />
      },
      {
        path: '/pmi/guides',
        label: 'Guías y Templates',
        icon: <HelpCircle className="w-4 h-4" />
      }
    ]
  }
]

const Sidebar: React.FC = () => {
  return (
    <motion.aside 
      className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-morris-gray-200 pt-20 morris-scrollbar overflow-y-auto"
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <nav className="p-4 space-y-2">
        {navigationItems.map((item, index) => (
          <NavGroup key={item.path} item={item} index={index} />
        ))}

        {/* Separator */}
        <div className="border-t border-morris-gray-200 my-6" />

        {/* Additional Links */}
        <div className="space-y-2">
          <NavLink
            to="/team"
            className={({ isActive }) =>
              isActive ? 'morris-nav-link-active' : 'morris-nav-link-inactive'
            }
          >
            <Users className="w-5 h-5 mr-3" />
            Equipo
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? 'morris-nav-link-active' : 'morris-nav-link-inactive'
            }
          >
            <Settings className="w-5 h-5 mr-3" />
            Configuración
          </NavLink>
        </div>

        {/* Framework Info */}
        <div className="mt-8 p-4 bg-morris-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-morris-gray-900 mb-2">
            Framework Morris 3.1
          </h4>
          <p className="text-xs text-morris-gray-600 leading-relaxed">
            Sistema completo de gestión de proyectos con metodologías ágiles e híbridas.
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-morris-gray-500">
            <span>Versión 3.1.0</span>
            <span className="morris-badge-success">Activo</span>
          </div>
        </div>
      </nav>
    </motion.aside>
  )
}

interface NavGroupProps {
  item: NavItem
  index: number
}

const NavGroup: React.FC<NavGroupProps> = ({ item, index }) => {
  const [isExpanded, setIsExpanded] = React.useState(true)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
    >
      {/* Main Item */}
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `${isActive ? 'morris-nav-link-active' : 'morris-nav-link-inactive'} ${
            item.children ? 'cursor-pointer' : ''
          }`
        }
        onClick={(e) => {
          if (item.children) {
            e.preventDefault()
            setIsExpanded(!isExpanded)
          }
        }}
      >
        {item.icon}
        <span className="ml-3 flex-1">{item.label}</span>
        {item.badge && (
          <span className="morris-badge morris-badge-primary ml-2">
            {item.badge}
          </span>
        )}
        {item.children && (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="ml-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </motion.div>
        )}
      </NavLink>

      {/* Children Items */}
      {item.children && (
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="ml-6 mt-2 space-y-1">
            {item.children.map((child) => (
              <NavLink
                key={child.path}
                to={child.path}
                className={({ isActive }) =>
                  `${isActive ? 'morris-nav-link-active' : 'morris-nav-link-inactive'} text-sm`
                }
              >
                {child.icon}
                <span className="ml-3">{child.label}</span>
              </NavLink>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Sidebar