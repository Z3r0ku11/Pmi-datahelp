// Mock export service for BLOQUE B - will be replaced with real DOCX/XLSX in BLOQUE C
export class MockExportService {
  static async exportAsJSON(data: any, filename: string): Promise<void> {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}