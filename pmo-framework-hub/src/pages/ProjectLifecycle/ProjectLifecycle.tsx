import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTraceabilityData } from '@/app/providers/TraceabilityProvider';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { FrameworkBadge } from '@/components/common/Badge';

export function ProjectLifecycle() {
  const { data, service } = useTraceabilityData();
  const [searchParams] = useSearchParams();
  const initial = searchParams.get('framework') || data?.frameworks[0]?.id || '';
  const [frameworkId, setFrameworkId] = useState(initial);
  const framework = service.getFramework(frameworkId);
  const phases = useMemo(() => service.getPhasesByFramework(frameworkId), [frameworkId, service]);

  return (
    <div className="container hub-page">
      <Breadcrumbs items={[{ label: 'Inicio', path: '/' }, { label: 'Gestionar mi proyecto', isActive: true }]} />
      <section className="hub-page-header"><p className="hub-eyebrow">Guía operativa</p><h1>Ciclo de vida del proyecto</h1><p>Selecciona un framework y abre cada fase para revisar el proceso, responsables, artefactos y gates asociados.</p></section>
      <div className="hub-segmented" role="group" aria-label="Seleccionar framework">
        {data?.frameworks.map(item => <button key={item.id} type="button" className={item.id === frameworkId ? 'active' : ''} onClick={() => setFrameworkId(item.id)}>{item.name}</button>)}
      </div>
      {framework && <div className="hub-inline-summary"><FrameworkBadge framework={framework.type} /><strong>{framework.version}</strong><span>{phases.length} fases</span><span>{framework.traceabilityCoverage}% de cobertura</span></div>}
      <div className="hub-lifecycle-grid">
        {phases.map((phase, index) => {
          const processes = service.getProcessesByPhase(phase.id);
          const artifacts = service.getArtifacts().filter(item => item.phaseIds.includes(phase.id));
          const gates = service.getGatesByPhase(phase.id);
          return <Link className="hub-phase-card" key={phase.id} to={`/lifecycle/${frameworkId}/${phase.id}`}><div className="hub-phase-number">{String(index + 1).padStart(2, '0')}</div><div><h2>{phase.name}</h2><p>{phase.description}</p><div className="hub-meta"><span>{processes.length} proceso{processes.length === 1 ? '' : 's'}</span><span>{artifacts.length} artefacto{artifacts.length === 1 ? '' : 's'}</span>{gates.length > 0 && <span>{gates.length} gate</span>}</div></div><span className="hub-arrow" aria-hidden="true">→</span></Link>;
        })}
      </div>
    </div>
  );
}
