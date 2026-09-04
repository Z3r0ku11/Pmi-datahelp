interface ExportOptions {
  fileName: string;
  format: string;
  data: any;
  toolId?: string;
}

export class MockExportService {
  static async exportData(options: ExportOptions): Promise<void> {
    const { fileName, format, data, toolId } = options;
    
    // Create downloadable content based on format
    let content: string;
    let mimeType: string;
    let fileExtension: string;

    switch (format.toUpperCase()) {
      case 'JSON':
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
        fileExtension = 'json';
        break;
        
      case 'PDF':
        content = this.generatePDFContent(data, toolId);
        mimeType = 'application/pdf';
        fileExtension = 'pdf';
        break;
        
      case 'DOCX':
        content = this.generateDOCXContent(data, toolId);
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        fileExtension = 'docx';
        break;
        
      case 'XLSX':
        content = this.generateXLSXContent(data, toolId);
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        fileExtension = 'xlsx';
        break;
        
      case 'PPTX':
        content = this.generatePPTXContent(data, toolId);
        mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        fileExtension = 'pptx';
        break;
        
      default:
        throw new Error(`Formato no soportado: ${format}`);
    }

    // Create and download file
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  private static generatePDFContent(data: any, toolId?: string): string {
    // Mock PDF content - in real implementation would use PDF library
    return `[MOCK PDF CONTENT - ${toolId}]\n\nData:\n${JSON.stringify(data, null, 2)}`;
  }

  private static generateDOCXContent(data: any, toolId?: string): string {
    // Mock DOCX content - in real implementation would use docx library
    let content = `[MOCK DOCX CONTENT - ${toolId}]\n\n`;
    
    switch (toolId) {
      case 'TOOL-PMO-005': // Minutes
        content += this.formatMinutesContent(data);
        break;
      default:
        content += `Data:\n${JSON.stringify(data, null, 2)}`;
    }
    
    return content;
  }
  private static generateXLSXContent(data: any, toolId?: string): string {
    // Mock XLSX content - in real implementation would use exceljs library
    let content = `[MOCK XLSX CONTENT - ${toolId}]\n\n`;
    
    switch (toolId) {
      case 'TOOL-PMO-004': // Governance Checklist
        content += this.formatGovernanceChecklistContent(data);
        break;
      default:
        content += `Data:\n${JSON.stringify(data, null, 2)}`;
    }
    
    return content;
  }

  private static generatePPTXContent(data: any, toolId?: string): string {
    // Mock PPTX content - in real implementation would use PowerPoint library
    return `[MOCK PPTX CONTENT - ${toolId}]\n\nData:\n${JSON.stringify(data, null, 2)}`;
  }

  private static formatMinutesContent(data: any): string {
    const { meetingInfo, participantes, agenda, puntosTratados, acuerdos, tareasPendientes } = data;
    
    return `MINUTA DE REUNIÓN

Título: ${meetingInfo?.titulo || 'N/A'}
Fecha: ${meetingInfo?.fecha || 'N/A'}
Hora: ${meetingInfo?.horaInicio || 'N/A'} - ${meetingInfo?.horaFin || 'N/A'}
Modalidad: ${meetingInfo?.modalidad || 'N/A'}
Organizador: ${meetingInfo?.organizador || 'N/A'}

OBJETIVO:
${meetingInfo?.objetivo || 'N/A'}

PARTICIPANTES:
${participantes?.map((p: any) => `- ${p.nombre} (${p.rol}) - ${p.presente ? 'Presente' : 'Ausente'}`).join('\n') || 'Ninguno'}

AGENDA:
${agenda?.map((a: any) => `${a.orden}. ${a.tema} - ${a.responsable} (${a.tiempoEstimado} min)`).join('\n') || 'Sin agenda definida'}

PUNTOS TRATADOS:
${puntosTratados?.map((p: any) => `- ${p.tema}: ${p.descripcion}`).join('\n') || 'Ninguno'}

ACUERDOS:
${acuerdos?.map((a: any) => `- ${a.descripcion} (Responsable: ${a.responsable}, Fecha: ${a.fechaCompromiso})`).join('\n') || 'Ninguno'}

TAREAS PENDIENTES:
${tareasPendientes?.map((t: any) => `- ${t.descripcion} (Responsable: ${t.responsable}, Vencimiento: ${t.fechaVencimiento})`).join('\n') || 'Ninguna'}
`;
  }

  private static formatGovernanceChecklistContent(data: any): string {
    const { checklistInfo, controles, gates } = data;
    
    return `GOVERNANCE CHECKLIST

Fecha de Evaluación: ${checklistInfo?.fechaEvaluacion || 'N/A'}
Evaluador: ${checklistInfo?.evaluador || 'N/A'}
Fase del Proyecto: ${checklistInfo?.faseProyecto || 'N/A'}

CONTROLES DE GOVERNANCE:
${controles?.map((c: any) => `- ${c.controlId}: ${c.cumplido ? 'CUMPLIDO' : 'PENDIENTE'} - ${c.comentarios || 'Sin comentarios'}`).join('\n') || 'Ninguno'}

GATES DEL PROYECTO:
${gates?.map((g: any) => `- ${g.gateId}: ${g.status} - ${g.comentarios || 'Sin comentarios'}`).join('\n') || 'Ninguno'}

Comentarios Generales:
${checklistInfo?.comentariosGenerales || 'Ninguno'}
`;
  }
}