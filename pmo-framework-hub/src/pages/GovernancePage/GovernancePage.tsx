import React from 'react';
import { Link } from 'react-router-dom';
import { useTraceabilityData } from '@/app/providers/TraceabilityProvider';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';

export function GovernancePage() {
  const { service } = useTraceabilityData();
  const controls = service.getControls();
  const gates = service.getGates();
  const governanceGap = service.getGovernanceGap();
  return (
    <div className="container hub-page">
      <Breadcrumbs items={[{ label: 'Inicio', path: '/' }, { label: 'Governance', isActive: true }]} />
      <section className="hub-page-header"><p className="hub-eyebrow">Control y decisiones</p><h1>Governance del proyecto</h1><p>Los controles y gates se presentan desde la matriz de trazabilidad. Cada registro mantiene sus responsables y evidencias asociadas.</p></section>
      {governanceGap && <section className="hub-notice" aria-labelledby="governance-gap-title"><div><p className="hub-eyebrow">Limitación documentada</p><h2 id="governance-gap-title">{governanceGap.title}</h2><p>{governanceGap.description}</p></div><span>{governanceGap.status}</span></section>}
      <section className="hub-section"><div className="hub-section-heading"><div><p className="hub-eyebrow">Ejecución</p><h2>Controles</h2></div><span>{controls.length} definidos</span></div><div className="hub-card-grid">{controls.map(control => { const owner = control.ownerRoleId ? service.getRole(control.ownerRoleId) : null; const evidence = control.evidenceArtifactIds.map(id => service.getArtifact(id)).filter(Boolean); return <article className="hub-card" key={control.id}><div className="hub-card-top"><span>{control.id}</span><strong>{control.mandatory ? 'Obligatorio' : 'Opcional'}</strong></div><h3>{control.name}</h3><p>{control.evidenceDescription || 'Validación definida por el framework.'}</p>{owner && <Link to={`/roles/${owner.id}`}>Responsable: {owner.name}</Link>}<div className="hub-chip-list">{evidence.map(item => item && <Link key={item.id} to={`/artifacts/${item.id}`}>{item.name}</Link>)}</div></article>; })}</div></section>
      <section className="hub-section"><div className="hub-section-heading"><div><p className="hub-eyebrow">Aprobación</p><h2>Gates</h2></div><span>{gates.length} definidos</span></div><div className="hub-card-grid">{gates.map(gate => { const owner = service.getRole(gate.ownerRoleId); const approver = gate.approverRoleId ? service.getRole(gate.approverRoleId) : null; return <article className="hub-card" key={gate.id}><div className="hub-card-top"><span>{gate.id}</span><strong>{gate.mandatory ? 'Obligatorio' : 'Opcional'}</strong></div><h3>{gate.name}</h3><p>{gate.criteria}</p><dl className="hub-definition"><div><dt>Owner</dt><dd>{owner?.name || 'Sin definir'}</dd></div><div><dt>Aprobador</dt><dd>{approver?.name || 'Pendiente de definición PMO'}</dd></div><div><dt>Evidencias</dt><dd>{gate.evidenceArtifactIds.length}</dd></div></dl>{gate.gaps?.includes('GAP-GOV-001') && <p className="hub-warning-text">La autoridad de aprobación requiere resolución de GAP-GOV-001.</p>}</article>; })}</div></section>
    </div>
  );
}
