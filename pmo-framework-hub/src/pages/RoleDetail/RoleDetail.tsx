import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTraceabilityData } from '@/app/providers/TraceabilityProvider';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { FrameworkBadge, MandatoryBadge } from '@/components/common/Badge';
import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage';

export function RoleDetail() {
  const { roleId = '' } = useParams();
  const { service } = useTraceabilityData();
  const role = service.getRole(roleId);
  if (!role) return <NotFoundPage />;
  const framework = service.getFramework(role.frameworkId);
  const processes = service.getProcessesByFramework(role.frameworkId).filter(process => process.ownerRoleId === role.id);
  const artifacts = service.getArtifactsByRole(role.id);
  const controls = service.getControls().filter(control => control.ownerRoleId === role.id || control.participantRoleIds.includes(role.id));
  const gates = service.getGates().filter(gate => gate.ownerRoleId === role.id || gate.approverRoleId === role.id);
  return (
    <div className="container hub-page">
      <Breadcrumbs items={[{ label: 'Inicio', path: '/' }, { label: 'Roles', path: '/roles' }, { label: role.name, isActive: true }]} />
      <section className="hub-hero-panel"><div>{framework && <FrameworkBadge framework={framework.type} />}<h1>{role.name}</h1><p>{role.description}</p>{role.purpose && <p><strong>Propósito:</strong> {role.purpose}</p>}<p className="hub-source">Nivel: {role.level || 'No especificado'} · Fuente: {role.source?.document}</p></div></section>
      <section className="hub-two-column"><div className="hub-panel"><h2>Procesos bajo responsabilidad</h2>{processes.length ? processes.map(process => <div className="hub-row-static" key={process.id}><strong>{process.name}</strong><p>{process.objective || process.description}</p></div>) : <p>No hay procesos con ownership explícito.</p>}</div><div className="hub-panel"><h2>Artefactos asociados</h2>{artifacts.length ? artifacts.map(artifact => <Link className="hub-row-link" key={artifact.id} to={`/artifacts/${artifact.id}`}><span>{artifact.name}</span><small><MandatoryBadge mandatory={artifact.mandatoryStatus} /></small></Link>) : <p>No hay artefactos asociados.</p>}</div></section>
      <section className="hub-section"><h2>Participación en governance</h2><div className="hub-card-grid">{controls.map(control => <article className="hub-card" key={control.id}><p className="hub-eyebrow">Control</p><h3>{control.name}</h3><p>{control.evidenceDescription}</p></article>)}{gates.map(gate => <article className="hub-card" key={gate.id}><p className="hub-eyebrow">Gate</p><h3>{gate.name}</h3><p>{gate.criteria}</p></article>)}{controls.length + gates.length === 0 && <p>No existe participación explícita en controles o gates.</p>}</div></section>
    </div>
  );
}
