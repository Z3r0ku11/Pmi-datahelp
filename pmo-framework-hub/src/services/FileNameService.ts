interface FileNameOptions {
  type: string;
  name: string;
  version?: string;
  extension: string;
  projectCode?: string;
  toolId?: string;
}

export class FileNameService {
  private static readonly PREFIX = 'MO-PMO';
  private static readonly DEFAULT_VERSION = 'v1.0';

  static generateFileName(options: FileNameOptions): string {
    const {
      type,
      name,
      version = this.DEFAULT_VERSION,
      extension,
      projectCode,
      toolId
    } = options;

    // Sanitize inputs
    const sanitizedType = this.sanitize(type);
    const sanitizedName = this.sanitize(name);
    const sanitizedVersion = this.sanitize(version);
    const sanitizedProjectCode = projectCode ? this.sanitize(projectCode) : null;

    // Build filename components
    const components = [this.PREFIX];
    
    if (sanitizedProjectCode) {
      components.push(sanitizedProjectCode);
    }
    
    components.push(sanitizedType, sanitizedName, sanitizedVersion);

    // Join and add extension
    const baseName = components.join('-');
    return `${baseName}.${extension.replace('.', '')}`;
  }

  static generateFromToolData(toolId: string, projectData: any, format: string): string {
    const toolNames: Record<string, string> = {
      'TOOL-PMO-001': 'InfoBase',
      'TOOL-PMO-003': 'StatusReport',
      'TOOL-PMO-005': 'Minuta',
      'TOOL-PMO-004': 'GovernanceChecklist'
    };

    const toolTypes: Record<string, string> = {
      'TOOL-PMO-001': 'TPL',
      'TOOL-PMO-003': 'RPT',
      'TOOL-PMO-005': 'MIN',
      'TOOL-PMO-004': 'CHK'
    };

    const name = toolNames[toolId] || 'Document';
    const type = toolTypes[toolId] || 'DOC';
    const projectCode = projectData?.codigo || projectData?.projectId || 'PROJ';

    return this.generateFileName({
      type,
      name,
      extension: format.toLowerCase(),
      projectCode
    });
  }

  static generateDateSuffix(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  static generateWithDate(options: FileNameOptions): string {
    const baseName = this.generateFileName(options);
    const dateSuffix = this.generateDateSuffix();
    
    const parts = baseName.split('.');
    const extension = parts.pop();
    const nameWithoutExt = parts.join('.');
    
    return `${nameWithoutExt}-${dateSuffix}.${extension}`;
  }

  private static sanitize(input: string): string {
    return input
      .replace(/[<>:"/\\|?*\x00-\x1f]/g, '') // Remove invalid filename characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^\w\-\.]/g, '') // Keep only word characters, hyphens, and dots
      .replace(/\-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      .substring(0, 100); // Limit length
  }

  static validateFileName(fileName: string): boolean {
    // Check for invalid characters
    const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
    if (invalidChars.test(fileName)) {
      return false;
    }

    // Check length
    if (fileName.length === 0 || fileName.length > 255) {
      return false;
    }

    // Check for reserved names (Windows)
    const reservedNames = [
      'CON', 'PRN', 'AUX', 'NUL',
      'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
      'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
    ];

    const nameWithoutExt = fileName.split('.')[0].toUpperCase();
    if (reservedNames.includes(nameWithoutExt)) {
      return false;
    }

    return true;
  }

  static extractComponents(fileName: string): Partial<FileNameOptions> | null {
    // Expected format: MO-PMO-[PROJECT]-[TYPE]-[NAME]-[VERSION].ext
    const match = fileName.match(/^MO-PMO-(.+)\.([^.]+)$/);
    if (!match) return null;

    const [, namePart, extension] = match;
    const components = namePart.split('-');

    if (components.length < 3) return null;

    // Try to extract version (should be last and start with 'v')
    let version = this.DEFAULT_VERSION;
    let nameComponents = [...components];

    if (components[components.length - 1].startsWith('v')) {
      version = components[components.length - 1];
      nameComponents = components.slice(0, -1);
    }

    // Extract type and name (last two components)
    if (nameComponents.length < 2) return null;

    const type = nameComponents[nameComponents.length - 2];
    const name = nameComponents[nameComponents.length - 1];
    const projectCode = nameComponents.length > 2 
      ? nameComponents.slice(0, -2).join('-') 
      : undefined;

    return {
      type,
      name,
      version,
      extension,
      projectCode
    };
  }
}