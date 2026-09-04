import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout/MainLayout';
import { ErrorBoundary } from '@/components/common/ErrorBoundary/ErrorBoundary';

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('@/pages/HomePage/HomePage').then(m => ({ default: m.HomePage })));
const FrameworkExplorer = React.lazy(() => import('@/pages/FrameworkExplorer/FrameworkExplorer').then(m => ({ default: m.FrameworkExplorer })));
const FrameworkDetail = React.lazy(() => import('@/pages/FrameworkDetail/FrameworkDetail').then(m => ({ default: m.FrameworkDetail })));
const ProjectLifecycle = React.lazy(() => import('@/pages/ProjectLifecycle/ProjectLifecycle').then(m => ({ default: m.ProjectLifecycle })));
const PhaseDetail = React.lazy(() => import('@/pages/PhaseDetail/PhaseDetail').then(m => ({ default: m.PhaseDetail })));
const GovernancePage = React.lazy(() => import('@/pages/GovernancePage/GovernancePage').then(m => ({ default: m.GovernancePage })));
const RolesPage = React.lazy(() => import('@/pages/RolesPage/RolesPage').then(m => ({ default: m.RolesPage })));
const RoleDetail = React.lazy(() => import('@/pages/RoleDetail/RoleDetail').then(m => ({ default: m.RoleDetail })));
const ArtifactLibrary = React.lazy(() => import('@/pages/ArtifactLibrary/ArtifactLibrary').then(m => ({ default: m.ArtifactLibrary })));
const ArtifactDetail = React.lazy(() => import('@/pages/ArtifactDetail/ArtifactDetail').then(m => ({ default: m.ArtifactDetail })));
const DownloadCenter = React.lazy(() => import('@/pages/DownloadCenter/DownloadCenter').then(m => ({ default: m.DownloadCenter })));
const SearchPage = React.lazy(() => import('@/pages/SearchPage').then(m => ({ default: m.SearchPage })));
const ToolsPage = React.lazy(() => import('@/pages/ToolsPage/ToolsPage').then(m => ({ default: m.ToolsPage })));
const ProjectInfoTool = React.lazy(() => import('@/pages/tools/PMOProjectInformationGenerator').then(m => ({ default: m.PMOProjectInformationGenerator })));
const StatusReportTool = React.lazy(() => import('@/pages/tools/PMOStatusReportGenerator').then(m => ({ default: m.PMOStatusReportGenerator })));
const MinutesTool = React.lazy(() => import('@/pages/tools/PMOMinutesGenerator').then(m => ({ default: m.PMOMinutesGenerator })));
const GovernanceTool = React.lazy(() => import('@/pages/tools/PMOGovernanceChecklist').then(m => ({ default: m.PMOGovernanceChecklist })));
const AdminPage = React.lazy(() => import('@/pages/admin/AdminPage').then(m => ({ default: m.default })));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// Loading component
function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );
}

// Layout wrapper for all routes
function RootLayout() {
  return (
    <ErrorBoundary>
      <MainLayout>
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </MainLayout>
    </ErrorBoundary>
  );
}

// Router configuration
export const router = createBrowserRouter([
  {
    path: '/admin',
    element: (
      <ErrorBoundary>
        <Suspense fallback={<PageLoading />}>
          <AdminPage />
        </Suspense>
      </ErrorBoundary>
    )
  },
  {
    path: '/',
    element: <RootLayout />,
    errorElement: (
      <ErrorBoundary>
        <MainLayout>
          <NotFoundPage />
        </MainLayout>
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'frameworks',
        element: <FrameworkExplorer />
      },
      {
        path: 'frameworks/:frameworkId',
        element: <FrameworkDetail />
      },
      {
        path: 'lifecycle',
        element: <ProjectLifecycle />
      },
      {
        path: 'lifecycle/:frameworkId/:phaseId',
        element: <PhaseDetail />
      },
      {
        path: 'governance',
        element: <GovernancePage />
      },
      {
        path: 'roles',
        element: <RolesPage />
      },
      {
        path: 'roles/:roleId',
        element: <RoleDetail />
      },
      {
        path: 'artifacts',
        element: <ArtifactLibrary />
      },
      {
        path: 'artifacts/:artifactId',
        element: <ArtifactDetail />
      },
      {
        path: 'downloads',
        element: <DownloadCenter />
      },
      {
        path: 'search',
        element: <SearchPage />
      },
      {
        path: 'tools',
        element: <ToolsPage />
      },
      {
        path: 'tools/project-information',
        element: <ProjectInfoTool />
      },
      {
        path: 'tools/status-report', 
        element: <StatusReportTool />
      },
      {
        path: 'tools/minutes',
        element: <MinutesTool />
      },
      {
        path: 'tools/governance-checklist',
        element: <GovernanceTool />
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}