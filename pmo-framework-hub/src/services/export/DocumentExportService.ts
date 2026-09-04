import { MockExportService } from '@/services/export/MockExportService';
import { FileNameService } from './FileNameService';

export class DocumentExportService {
  static async exportProjectInformation(data: any, projectContext: any): Promise<void> {
    await MockExportService.exportAsJSON({ data, projectContext }, 
      FileNameService.generateProjectInfoFileName(projectContext.projectName).replace('.docx', ''));
  }

  static async exportStatusReport(data: any, projectContext: any): Promise<void> {
    await MockExportService.exportAsJSON({ data, projectContext }, 
      FileNameService.generateStatusReportFileName(projectContext.projectName).replace('.docx', ''));
  }

  static async exportMinutes(data: any, projectContext: any): Promise<void> {
    await MockExportService.exportAsJSON({ data, projectContext }, 
      FileNameService.generateMinutesFileName(projectContext.projectName).replace('.docx', ''));
  }

  static async exportGovernanceChecklist(data: any, projectContext: any, controls: any[]): Promise<void> {
    await MockExportService.exportAsJSON({ data, projectContext, controls }, 
      FileNameService.generateGovernanceFileName(projectContext.projectName).replace('.xlsx', ''));
  }

  private static downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}