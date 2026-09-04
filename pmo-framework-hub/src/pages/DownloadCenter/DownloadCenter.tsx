import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTraceabilityData } from '@/app/providers/TraceabilityProvider';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { DOWNLOAD_CATALOG } from '@/data/downloadCatalog';

export function DownloadCenter() {
  const { service } = useTraceabilityData();
  const [kind, setKind] = useState<'all' | 'framework' | 'template'>('all');
  const resources = useMemo(() => DOWNLOAD_CATALOG.filter(resource => kind === 'all' || resource.kind === kind), [kind]);
  const publishedIds = new Set(DOWNLOAD_CATALOG.map(resource => resource.artifactId).filter(Boolean));
  const pendingTemplates = service.getArtifacts({ hasTemplate: true }).filter(artifact => !publishedIds.has(artifact.id));
  return (
    <div className="container hub-page">
      <Breadcrumbs items={[{ label: 'Inicio', path: '/' }, { label: 'Descargas', isActive: true }]} />
      <section className="hub-page-header"><p className="hub-eyebrow">Archivos publicados</p><h1>Centro de descargas</h1><p>Descarga los documentos fuente y las plantillas editables disponibles. Cada botón apunta a un archivo real incluido en la aplicación.</p></section>
      <div className="hub-segmented"><button type="button" className={kind === 'all' ? 'active' : ''} onClick={() => setKind('all')}>Todos</button><button type="button" className={kind === 'framework' ? 'active' : ''} onClick={() => setKind('framework')}>Frameworks</button><button type="button" className={kind === 'template' ? 'active' : ''} onClick={() => setKind('template')}>Plantillas</button></div>
      <div className="hub-download-list">{resources.map(resource => <article className="hub-download-row" key={resource.id}><div className="hub-file-icon">{resource.format}</div><div><p className="hub-eyebrow">{resource.kind === 'framework' ? 'Documento oficial' : 'Plantilla editable'}</p><h2>{resource.title}</h2><p>{resource.description}</p>{resource.artifactId && <Link to={`/artifacts/${resource.artifactId}`}>Ver trazabilidad</Link>}</div><a className="hub-button" href={resource.href} download>Descargar</a></article>)}</div>
      {pendingTemplates.length > 0 && <section className="hub-section"><div className="hub-section-heading"><div><p className="hub-eyebrow">Catálogo controlado</p><h2>Candidatos aún no publicados</h2></div><span>{pendingTemplates.length} registros</span></div><p>Estos artefactos aparecen como candidatos en la fuente, pero no se presentan como descarga hasta que exista un archivo utilizable.</p><div className="hub-chip-list">{pendingTemplates.map(artifact => <Link key={artifact.id} to={`/artifacts/${artifact.id}`}>{artifact.name}</Link>)}</div></section>}
    </div>
  );
}
