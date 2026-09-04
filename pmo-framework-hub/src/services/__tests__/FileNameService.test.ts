import { describe, it, expect } from 'vitest';
import { FileNameService } from '../FileNameService';

describe('FileNameService', () => {
  describe('generateFileName', () => {
    it('should generate basic filename with required fields', () => {
      const result = FileNameService.generateFileName({
        type: 'RPT',
        name: 'StatusReport',
        extension: 'docx'
      });
      expect(result).toBe('MO-PMO-RPT-StatusReport-v1.0.docx');
    });

    it('should include project code when provided', () => {
      const result = FileNameService.generateFileName({
        type: 'MIN',
        name: 'Minuta',
        extension: 'docx',
        projectCode: 'PRJ-2024-001'
      });
      expect(result).toBe('MO-PMO-PRJ-2024-001-MIN-Minuta-v1.0.docx');
    });

    it('should use custom version when provided', () => {
      const result = FileNameService.generateFileName({
        type: 'TPL',
        name: 'Template',
        version: 'v2.1',
        extension: 'xlsx'
      });
      expect(result).toBe('MO-PMO-TPL-Template-v2.1.xlsx');
    });

    it('should sanitize invalid characters', () => {
      const result = FileNameService.generateFileName({
        type: 'RPT<>',
        name: 'Status Report/Test',
        extension: 'pdf'
      });
      expect(result).toBe('MO-PMO-RPT-Status-Report-Test-v1.0.pdf');
    });

    it('should handle extension with dot', () => {
      const result = FileNameService.generateFileName({
        type: 'DOC',
        name: 'Document',
        extension: '.docx'
      });
      expect(result).toBe('MO-PMO-DOC-Document-v1.0.docx');
    });
  });

  describe('generateFromToolData', () => {
    it('should generate filename for TOOL-PMO-001', () => {
      const result = FileNameService.generateFromToolData(
        'TOOL-PMO-001',
        { codigo: 'PRJ-001' },
        'PDF'
      );
      expect(result).toBe('MO-PMO-PRJ-001-TPL-InfoBase-v1.0.pdf');
    });

    it('should generate filename for TOOL-PMO-005', () => {
      const result = FileNameService.generateFromToolData(
        'TOOL-PMO-005',
        { codigo: 'TEST-2024' },
        'docx'
      );
      expect(result).toBe('MO-PMO-TEST-2024-MIN-Minuta-v1.0.docx');
    });

    it('should handle missing project code', () => {
      const result = FileNameService.generateFromToolData(
        'TOOL-PMO-003',
        {},
        'xlsx'
      );
      expect(result).toBe('MO-PMO-PROJ-RPT-StatusReport-v1.0.xlsx');
    });

    it('should handle unknown tool', () => {
      const result = FileNameService.generateFromToolData(
        'TOOL-UNKNOWN',
        { codigo: 'TEST' },
        'pdf'
      );
      expect(result).toBe('MO-PMO-TEST-DOC-Document-v1.0.pdf');
    });
  });

  describe('validateFileName', () => {
    it('should validate correct filenames', () => {
      expect(FileNameService.validateFileName('MO-PMO-Test-v1.0.docx')).toBe(true);
      expect(FileNameService.validateFileName('normal-file.txt')).toBe(true);
      expect(FileNameService.validateFileName('file_with_underscore.pdf')).toBe(true);
    });

    it('should reject filenames with invalid characters', () => {
      expect(FileNameService.validateFileName('file<name>.txt')).toBe(false);
      expect(FileNameService.validateFileName('file>name.txt')).toBe(false);
      expect(FileNameService.validateFileName('file:name.txt')).toBe(false);
      expect(FileNameService.validateFileName('file"name.txt')).toBe(false);
      expect(FileNameService.validateFileName('file/name.txt')).toBe(false);
      expect(FileNameService.validateFileName('file\\name.txt')).toBe(false);
      expect(FileNameService.validateFileName('file|name.txt')).toBe(false);
      expect(FileNameService.validateFileName('file?name.txt')).toBe(false);
      expect(FileNameService.validateFileName('file*name.txt')).toBe(false);
    });

    it('should reject empty or too long filenames', () => {
      expect(FileNameService.validateFileName('')).toBe(false);
      expect(FileNameService.validateFileName('a'.repeat(256))).toBe(false);
    });

    it('should reject reserved names', () => {
      expect(FileNameService.validateFileName('CON.txt')).toBe(false);
      expect(FileNameService.validateFileName('PRN.txt')).toBe(false);
      expect(FileNameService.validateFileName('AUX.txt')).toBe(false);
      expect(FileNameService.validateFileName('COM1.txt')).toBe(false);
      expect(FileNameService.validateFileName('LPT1.txt')).toBe(false);
    });
  });

  describe('extractComponents', () => {
    it('should extract components from valid filename', () => {
      const result = FileNameService.extractComponents('MO-PMO-PRJ-001-RPT-Status-v2.0.docx');
      expect(result).toEqual({
        type: 'RPT',
        name: 'Status',
        version: 'v2.0',
        extension: 'docx',
        projectCode: 'PRJ-001'
      });
    });

    it('should handle filename without project code', () => {
      const result = FileNameService.extractComponents('MO-PMO-DOC-Document-v1.0.pdf');
      expect(result).toEqual({
        type: 'DOC',
        name: 'Document',
        version: 'v1.0',
        extension: 'pdf',
        projectCode: undefined
      });
    });

    it('should handle filename without version', () => {
      const result = FileNameService.extractComponents('MO-PMO-RPT-Status.docx');
      expect(result).toEqual({
        type: 'RPT',
        name: 'Status',
        version: 'v1.0',
        extension: 'docx',
        projectCode: undefined
      });
    });

    it('should return null for invalid filenames', () => {
      expect(FileNameService.extractComponents('invalid-file.txt')).toBe(null);
      expect(FileNameService.extractComponents('MO-PMO.txt')).toBe(null);
      expect(FileNameService.extractComponents('MO-PMO-ONLY-ONE.txt')).toBe(null);
    });
  });

  describe('generateDateSuffix', () => {
    it('should generate date suffix in YYYYMMDD format', () => {
      const result = FileNameService.generateDateSuffix();
      expect(result).toMatch(/^\d{8}$/);
      expect(result.length).toBe(8);
    });
  });

  describe('generateWithDate', () => {
    it('should append date suffix to filename', () => {
      const result = FileNameService.generateWithDate({
        type: 'RPT',
        name: 'Status',
        extension: 'docx'
      });
      expect(result).toMatch(/^MO-PMO-RPT-Status-v1\.0-\d{8}\.docx$/);
    });
  });
});