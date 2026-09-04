/**
 * CloudFrontService - Generates URLs for document downloads
 * 
 * Currently uses relative paths for development
 * Will be updated to actual CloudFront URLs in BLOQUE C
 */
export class CloudFrontService {
  private baseUrl: string;

  constructor() {
    // For now, use relative path - will be configured for CloudFront in BLOQUE C
    this.baseUrl = '/downloads';
  }

  generateDownloadUrl(documentPath: string): string {
    if (!documentPath) return '';
    
    // Ensure path starts with /
    const normalizedPath = documentPath.startsWith('/') ? documentPath : `/${documentPath}`;
    
    return `${this.baseUrl}${normalizedPath}`;
  }

  generateTemplateUrl(templateName: string): string {
    return this.generateDownloadUrl(`/templates/${templateName}`);
  }

  generateFrameworkDocumentUrl(frameworkId: string, documentName: string): string {
    return this.generateDownloadUrl(`/frameworks/${frameworkId}/${documentName}`);
  }

  // Validate if a document URL is available
  async validateDocumentAvailability(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Get document metadata from source reference
  getDocumentMetadata(source?: { document: string; version?: string }) {
    if (!source?.document) return null;
    
    return {
      filename: source.document,
      version: source.version || '1.0',
      url: this.generateDownloadUrl(`/${source.document}`)
    };
  }
}

export const cloudFrontService = new CloudFrontService();