import React from 'react';
import { TraceabilityProvider } from './providers/TraceabilityProvider';
import { ProjectContextProvider } from './providers/ProjectContextProvider';
import { AppRouter } from './Router';
import { ErrorBoundary } from '@/components/common/ErrorBoundary/ErrorBoundary';

// Import global styles
import '@/styles/globals.css';

function App() {
  return (
    <ErrorBoundary>
      <TraceabilityProvider>
        <ProjectContextProvider>
          <AppRouter />
        </ProjectContextProvider>
      </TraceabilityProvider>
    </ErrorBoundary>
  );
}

export default App;