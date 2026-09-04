import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTraceabilityData } from '@/app/providers/TraceabilityProvider';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { FrameworkBadge } from '@/components/common/Badge';

export function RolesPage() {
  const { data, service } = useTraceabilityData();
  const [frameworkId, setFrameworkId] = useState('');
  const roles = service.getRoles(frameworkId || undefined);
  return (
    <div className="container hub-page">
      <Breadcrumbs items={[{ label: 'Inicio', path: '/' }, { label: 'Roles', isActive: true }]} />
      <section className="hub-page-header"><p className="hub-eyebrow">Responsabilidades</p><h1>Roles del modelo PMO</h1><p>Consulta el propósito de cada rol y su relación con procesos, controles y artefactos.</p></section>
      <label className="hub-field">Framework<select value={frameworkId} onChange={event => setFrameworkId(event.target.value)}><option value="">Todos</option>{data?.frameworks.map(framework => <option key={framework.id} value={framework.id}>{framework.name}</option>)}</select></label>
      <div className="hub-card-grid">{roles.map(role => { const framework = service.getFramework(role.frameworkId); const processCount = service.getProcessesByFramework(role.frameworkId).filter(process => process.ownerRoleId === role.id).length; const artifactCount = service.getArtifactsByRole(role.id).length; return <Link className="hub-card hub-card-link" to={`/roles/${role.id}`} key={role.id}><div className="hub-card-top">{framework && <FrameworkBadge framework={framework.type} />}<span>{role.level || 'ROL'}</span></div><h2>{role.name}</h2><p>{role.description}</p><div className="hub-meta"><span>{processCount} procesos</span><span>{artifactCount} artefactos</span></div></Link>; })}</div>
    </div>
  );
}
