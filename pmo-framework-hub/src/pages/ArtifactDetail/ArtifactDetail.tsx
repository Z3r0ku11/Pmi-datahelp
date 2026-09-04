import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTraceabilityData } from '@/app/providers/TraceabilityProvider';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { FrameworkBadge, MandatoryBadge, PriorityBadge, StatusBadge } from '@/components/common/Badge';
import { getDownloadForArtifact } from '@/data/downloadCatalog';
import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage';

const toolRoutes: Record<string, string> = {
  'TOOL-PMO-001': '/tools/project-information',
  'TOOL-PMO-003': '/tools/status-report',
  'TOOL-PMO-004': '/tools/governance-checklist',
  'TOOL-PMO-005': '/tools/minutes',
};

export function ArtifactDetail() {
  const { artifactId = '' } = useParams();
  const { service } = useTraceabilityData();
  const artifact = service.getArtifact(artifactId);
  if (!artifact) return <NotFoundPage />;
  const framework = service.getFramework(artifact.frameworkId);
  const phases = artifact.phaseIds.map(id => service.getPhase(id)).filter(Boolean);
  const processes = artifact.processIds.map(id => service.getProcess(id)).filter(Boolean);
  const owners = artifact.ownerRoleIds.map(id => service.getRole(id)).filter(Boolean);
  const tool = artifact.toolId ? service.getTool(artifact.toolId) : null;
  const download = getDownloadForArtifact(artifact.id);
  return (
    <div className="container hub-page">
      <Breadcrumbs items={[{ label: 'Inicio', path: '/' }, { label: 'Artefactos', path: '/artifacts' }, { label: artifact.name, isActive: true }]} />
      <section className="hub-hero-panel"><div><div className="hub-inline-badges">{framework && <FrameworkBadge framework={framework.type} />}<MandatoryBadge mandatory={artifact.mandatoryStatus} />{artifact.templatePriority && <PriorityBadge priority={artifact.templatePriority} />}</div><h1>{artifact.name}</h1><p>{artifact.description || `Artefacto ${artifact.type.toLowerCase()} definido en la matriz de trazabilidad.`}</p><p className="hub-source">{artifact.id} · Fuente: {artifact.source?.document} {artifact.source?.page && `· página ${artifact.source.page}`}</p></div><div className="hub-actions">{download && <a className="hub-button" href={download.href} download>Descargar {download.format}</a>}{tool && toolRoutes[tool.id] && <Link className="hub-button hub-button-secondary" to={toolRoutes[tool.id]}>Abrir generador</Link>}</div></section>
      <section className="hub-two-column"><div className="hub-panel"><h2>Uso en el framework</h2><dl className="hub-definition"><div><dt>Formato propuesto</dt><dd>{artifact.proposedFormat || 'Variable'}</dd></div><div><dt>Plantilla</dt><dd>{download ? 'Disponible para descarga' : artifact.templateCandidate ? 'Candidata, aún sin archivo publicado' : 'No aplica'}</dd></div><div><dt>Generador</dt><dd>{tool && toolRoutes[tool.id] ? 'Disponible' : artifact.onlineGenerator ? 'Definido, pendiente de implementación' : 'No aplica'}</dd></div></dl></div><div className="hub-panel"><h2>Responsables</h2>{owners.map(owner => <Link className="hub-row-link" to={`/roles/${owner!.id}`} key={owner!.id}><span>{owner!.name}</span><small>{owner!.level || 'Rol'}</small></Link>)}</div></section>
      <section className="hub-two-column"><div className="hub-panel"><h2>Fases</h2>{phases.map(phase => <Link className="hub-row-link" to={`/lifecycle/${artifact.frameworkId}/${phase!.id}`} key={phase!.id}><span>{phase!.name}</span><small>Fase {phase!.sequence}</small></Link>)}</div><div className="hub-panel"><h2>Procesos</h2>{processes.map(process => <div className="hub-row-static" key={process!.id}><strong>{process!.name}</strong><p>{process!.objective || process!.description}</p></div>)}</div></section>
      {tool && <section className="hub-panel"><div className="hub-card-top"><StatusBadge status={tool.readiness} /><span>{tool.exportFormats.join(', ')}</span></div><h2>{tool.name}</h2><p>{tool.description}</p></section>}
    </div>
  );
}
