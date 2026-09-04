export class FileNameService {
  private static sanitize(str: string): string {
    return str
      .replace(/[^a-zA-Z0-9\s\-_]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  static generateFileName(
    type: string,
    projectName?: string,
    version: string = '1.0',
    extension: string = 'docx'
  ): string {
    const sanitizedProject = projectName ? this.sanitize(projectName) : 'project';
    const timestamp = new Date().toISOString().split('T')[0];
    
    return `MO-PMO-${type.toUpperCase()}-${sanitizedProject}-v${version}-${timestamp}.${extension}`;
  }

  static generateProjectInfoFileName(projectName?: string): string {
    return this.generateFileName('INFO', projectName, '1.0', 'docx');
  }

  static generateStatusReportFileName(projectName?: string): string {
    return this.generateFileName('STATUS', projectName, '1.0', 'docx');
  }

  static generateMinutesFileName(projectName?: string): string {
    return this.generateFileName('MINUTES', projectName, '1.0', 'docx');
  }

  static generateGovernanceFileName(projectName?: string): string {
    return this.generateFileName('GOVERNANCE', projectName, '1.0', 'xlsx');
  }
}