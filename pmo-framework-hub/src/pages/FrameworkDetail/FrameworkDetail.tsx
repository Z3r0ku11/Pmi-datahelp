import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTraceabilityData } from '@/app/providers/TraceabilityProvider';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { FrameworkBadge } from '@/components/common/Badge';
import { getDownloadForFramework } from '@/data/downloadCatalog';
import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage';

export function FrameworkDetail() {
  const { frameworkId = '' } = useParams();
  const { service } = useTraceabilityData();
  const framework = service.getFramework(frameworkId);

  if (!framework) return <NotFoundPage />;

  const phases = service.getPhasesByFramework(framework.id);
  const processes = service.getProcessesByFramework(framework.id);
  const roles = service.getRoles(framework.id);
  const artifacts = service.getArtifacts({ frameworkId: framework.id });
  const controls = service.getControlsByFramework(framework.id);
  const gates = service.getGatesByFramework(framework.id);
  const download = getDownloadForFramework(framework.id);

  return (
    <div className="container hub-page">
      <Breadcrumbs items={[{ label: 'Inicio', path: '/' }, { label: 'Frameworks', path: '/frameworks' }, { label: framework.name, isActive: true }]} />
      <section className="hub-hero-panel">
        <div>
          <FrameworkBadge framework={framework.type} />
          <h1>{framework.name}</h1>
          <p>{framework.description}</p>
          <p className="hub-source">Fuente: {framework.source?.document} · versión {framework.version}</p>
        </div>
        <div className="hub-actions">
          <Link className="hub-button" to={`/lifecycle?framework=${framework.id}`}>Recorrer ciclo de vida</Link>
          {download && <a className="hub-button hub-button-secondary" href={download.href} download>Descargar documento</a>}
        </div>
      </section>

      <section className="hub-stat-grid" aria-label="Resumen del framework">
        {[['Fases', phases.length], ['Procesos', processes.length], ['Roles', roles.length], ['Artefactos', artifacts.length], ['Controles', controls.length], ['Gates', gates.length]].map(([label, value]) => (
          <div className="hub-stat" key={label}><strong>{value}</strong><span>{label}</span></div>
        ))}
      </section>

      <section className="hub-section">
        <div className="hub-section-heading"><div><p className="hub-eyebrow">Secuencia operativa</p><h2>Fases del proceso de gestión</h2></div></div>
        <div className="hub-timeline">
          {phases.map(phase => (
            <Link key={phase.id} to={`/lifecycle/${framework.id}/${phase.id}`} className="hub-timeline-item">
              <span>{phase.sequence}</span><div><h3>{phase.name}</h3><p>{phase.description}</p></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="hub-two-column">
        <div className="hub-panel"><h2>Responsables</h2>{roles.map(role => <Link className="hub-row-link" key={role.id} to={`/roles/${role.id}`}><span>{role.name}</span><small>{role.level || 'Rol del framework'}</small></Link>)}</div>
        <div className="hub-panel"><h2>Recursos</h2><Link className="hub-row-link" to={`/artifacts?framework=${framework.id}`}><span>Artefactos del framework</span><small>{artifacts.length} registros trazables</small></Link><Link className="hub-row-link" to="/governance"><span>Governance y gates</span><small>{controls.length} controles y {gates.length} gates</small></Link><Link className="hub-row-link" to="/downloads"><span>Centro de descargas</span><small>Frameworks y plantillas editables</small></Link></div>
      </section>
    </div>
  );
}
