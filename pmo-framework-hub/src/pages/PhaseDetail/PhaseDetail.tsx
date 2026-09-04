import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTraceabilityData } from '@/app/providers/TraceabilityProvider';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { MandatoryBadge } from '@/components/common/Badge';
import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage';

export function PhaseDetail() {
  const { frameworkId = '', phaseId = '' } = useParams();
  const { service } = useTraceabilityData();
  const framework = service.getFramework(frameworkId);
  const phase = service.getPhase(phaseId);
  if (!framework || !phase || phase.frameworkId !== framework.id) return <NotFoundPage />;
  const phases = service.getPhasesByFramework(frameworkId);
  const phaseIndex = phases.findIndex(item => item.id === phase.id);
  const processes = service.getProcessesByPhase(phase.id);
  const artifacts = service.getArtifacts().filter(item => item.phaseIds.includes(phase.id));
  const gates = service.getGatesByPhase(phase.id);

  return (
    <div className="container hub-page">
      <Breadcrumbs items={[{ label: 'Inicio', path: '/' }, { label: 'Ciclo de vida', path: `/lifecycle?framework=${frameworkId}` }, { label: phase.name, isActive: true }]} />
      <section className="hub-page-header"><p className="hub-eyebrow">Fase {phase.sequence} · {framework.version}</p><h1>{phase.name}</h1><p>{phase.description}</p><p className="hub-source">Fuente: {phase.source?.document} · {phase.source?.page ? `páginas ${phase.source.page}` : `sección ${phase.source?.section}`}</p></section>
      <section className="hub-section"><h2>Proceso de trabajo</h2><div className="hub-card-grid">{processes.map(process => { const owner = process.ownerRoleId ? service.getRole(process.ownerRoleId) : null; return <article className="hub-card" key={process.id}><p className="hub-eyebrow">{process.id}</p><h3>{process.name}</h3><p>{process.description}</p>{process.objective && <p><strong>Objetivo:</strong> {process.objective}</p>}{process.trigger && <p><strong>Inicio:</strong> {process.trigger}</p>}{owner && <Link to={`/roles/${owner.id}`}>Responsable: {owner.name}</Link>}</article>; })}</div></section>
      <section className="hub-two-column"><div className="hub-panel"><h2>Artefactos</h2>{artifacts.length ? artifacts.map(artifact => <Link className="hub-row-link" key={artifact.id} to={`/artifacts/${artifact.id}`}><span>{artifact.name}</span><small><MandatoryBadge mandatory={artifact.mandatoryStatus} /> · {artifact.proposedFormat || artifact.type}</small></Link>) : <p>No hay artefactos asociados en la matriz.</p>}</div><div className="hub-panel"><h2>Gates</h2>{gates.length ? gates.map(gate => <div className="hub-row-static" key={gate.id}><strong>{gate.name}</strong><p>{gate.criteria}</p><small>{gate.approverRoleId ? `Aprobador: ${service.getRole(gate.approverRoleId)?.name}` : 'Aprobador pendiente de definición PMO'}</small></div>) : <p>Esta fase no tiene un gate explícito en la matriz.</p>}</div></section>
      <nav className="hub-prev-next" aria-label="Navegación entre fases">{phaseIndex > 0 ? <Link to={`/lifecycle/${frameworkId}/${phases[phaseIndex - 1].id}`}>← {phases[phaseIndex - 1].name}</Link> : <span />}{phaseIndex < phases.length - 1 && <Link to={`/lifecycle/${frameworkId}/${phases[phaseIndex + 1].id}`}>{phases[phaseIndex + 1].name} →</Link>}</nav>
    </div>
  );
}
