import { Workbook, Worksheet } from 'exceljs';
import { FileNameService } from './FileNameService';

interface ExportOptions {
  data: any;
  fileName: string;
  toolId?: string;
}

export class ExcelExportService {
  static async exportDocument(options: ExportOptions): Promise<void> {
    const { data, fileName, toolId } = options;

    const workbook = new Workbook();
    workbook.creator = 'PMO Framework Hub - Morris & Opazo';
    workbook.created = new Date();
    workbook.modified = new Date();

    switch (toolId) {
      case 'TOOL-PMO-004':
        this.createGovernanceChecklistWorkbook(workbook, data);
        break;
      case 'TOOL-PMO-003':
        this.createStatusReportWorkbook(workbook, data);
        break;
      default:
        this.createGenericWorkbook(workbook, data);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    this.downloadFile(buffer, fileName);
  }

  private static createGovernanceChecklistWorkbook(workbook: Workbook, data: any): void {
    const { checklistInfo, controles, gates } = data;

    // Project Information Sheet
    const infoSheet = workbook.addWorksheet('Información del Proyecto');
    this.setupWorksheetStyles(infoSheet);

    // Project info section
    infoSheet.addRow(['INFORMACIÓN DEL PROYECTO']);
    infoSheet.getCell('A1').font = { name: 'Poppins', size: 14, bold: true };
    infoSheet.addRow([]);

    const projectInfo = [
      ['Fecha de Evaluación:', checklistInfo?.fechaEvaluacion || 'N/A'],
      ['Evaluador:', checklistInfo?.evaluador || 'N/A'],
      ['Fase del Proyecto:', checklistInfo?.faseProyecto || 'N/A']
    ];

    projectInfo.forEach(([label, value]) => {
      const row = infoSheet.addRow([label, value]);
      row.getCell(1).font = { name: 'Poppins', size: 11, bold: true };
      row.getCell(2).font = { name: 'Poppins', size: 11 };
    });

    if (checklistInfo?.comentariosGenerales) {
      infoSheet.addRow([]);
      infoSheet.addRow(['Comentarios Generales:']);
      infoSheet.getCell('A' + infoSheet.lastRow?.number).font = { name: 'Poppins', size: 11, bold: true };
      infoSheet.addRow([checklistInfo.comentariosGenerales]);
      infoSheet.getCell('A' + infoSheet.lastRow?.number).font = { name: 'Poppins', size: 11 };
    }

    // Auto-fit columns
    infoSheet.getColumn(1).width = 25;
    infoSheet.getColumn(2).width = 50;

    // Controls Sheet
    if (controles && controles.length > 0) {
      const controlsSheet = workbook.addWorksheet('Controles de Governance');
      this.setupWorksheetStyles(controlsSheet);

      // Headers
      const headers = ['ID Control', 'Estado', 'Evidencia', 'Responsable', 'Fecha Cumplimiento', 'Comentarios'];
      const headerRow = controlsSheet.addRow(headers);
      
      headerRow.eachCell((cell) => {
        cell.font = { name: 'Poppins', size: 11, bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE6E6FA' }
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      // Data rows
      controles.forEach((control: any) => {
        const row = controlsSheet.addRow([
          control.controlId,
          control.cumplido ? 'CUMPLIDO' : 'PENDIENTE',
          control.evidencia || '',
          control.responsable || '',
          control.fechaCumplimiento || '',
          control.comentarios || ''
        ]);

        row.eachCell((cell, colNumber) => {
          cell.font = { name: 'Poppins', size: 10 };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };

          // Color code status
          if (colNumber === 2) {
            if (control.cumplido) {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF90EE90' }
              };
            } else {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFCCCB' }
              };
            }
          }
        });
      });

      // Auto-fit columns
      controlsSheet.getColumn(1).width = 15;
      controlsSheet.getColumn(2).width = 12;
      controlsSheet.getColumn(3).width = 30;
      controlsSheet.getColumn(4).width = 20;
      controlsSheet.getColumn(5).width = 15;
      controlsSheet.getColumn(6).width = 40;

      // Freeze first row
      controlsSheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

      // Add filters
      controlsSheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: controles.length + 1, column: headers.length }
      };
    }

    // Gates Sheet
    if (gates && gates.length > 0) {
      const gatesSheet = workbook.addWorksheet('Gates del Proyecto');
      this.setupWorksheetStyles(gatesSheet);

      // Headers
      const headers = ['ID Gate', 'Status', 'Evaluador', 'Fecha Evaluación', 'Comentarios'];
      const headerRow = gatesSheet.addRow(headers);
      
      headerRow.eachCell((cell) => {
        cell.font = { name: 'Poppins', size: 11, bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE6E6FA' }
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      // Data rows
      gates.forEach((gate: any) => {
        const row = gatesSheet.addRow([
          gate.gateId,
          gate.status || 'NO_EVALUADO',
          gate.evaluador || '',
          gate.fechaEvaluacion || '',
          gate.comentarios || ''
        ]);

        row.eachCell((cell, colNumber) => {
          cell.font = { name: 'Poppins', size: 10 };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };

          // Color code status
          if (colNumber === 2) {
            switch (gate.status) {
              case 'APROBADO':
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FF90EE90' }
                };
                break;
              case 'RECHAZADO':
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFFFCCCB' }
                };
                break;
              case 'EN_REVISION':
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFFFFF99' }
                };
                break;
              case 'PENDIENTE_DEFINICION_PMO':
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFFFA500' }
                };
                break;
            }
          }
        });
      });

      // Auto-fit columns
      gatesSheet.getColumn(1).width = 15;
      gatesSheet.getColumn(2).width = 20;
      gatesSheet.getColumn(3).width = 20;
      gatesSheet.getColumn(4).width = 15;
      gatesSheet.getColumn(5).width = 40;

      // Freeze first row
      gatesSheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

      // Add filters
      gatesSheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: gates.length + 1, column: headers.length }
      };
    }
  }

  private static createStatusReportWorkbook(workbook: Workbook, data: any): void {
    const { reportInfo, actividades, riesgos, issues, kpis } = data;

    // Report Info Sheet
    const infoSheet = workbook.addWorksheet('Información del Reporte');
    this.setupWorksheetStyles(infoSheet);

    // Report info
    const reportData = [
      ['Período:', reportInfo?.periodo || 'N/A'],
      ['Fecha del Reporte:', reportInfo?.fechaReporte || 'N/A'],
      ['Semana #:', reportInfo?.semana || 'N/A'],
      ['Status General:', reportInfo?.statusGeneral || 'N/A']
    ];

    reportData.forEach(([label, value]) => {
      const row = infoSheet.addRow([label, value]);
      row.getCell(1).font = { name: 'Poppins', size: 11, bold: true };
      row.getCell(2).font = { name: 'Poppins', size: 11 };
    });

    infoSheet.getColumn(1).width = 20;
    infoSheet.getColumn(2).width = 30;

    // Activities Sheet
    if (actividades && actividades.length > 0) {
      const actSheet = workbook.addWorksheet('Actividades');
      this.setupWorksheetStyles(actSheet);

      const headers = ['Nombre', 'Descripción', 'Fecha Inicio', 'Fecha Fin', 'Progreso (%)', 'Responsable', 'Status'];
      const headerRow = actSheet.addRow(headers);
      
      this.styleHeaderRow(headerRow);

      actividades.forEach((actividad: any) => {
        const row = actSheet.addRow([
          actividad.nombre,
          actividad.descripcion,
          actividad.fechaInicio,
          actividad.fechaFin,
          actividad.progreso,
          actividad.responsable,
          actividad.status
        ]);

        this.styleDataRow(row);
      });

      this.autoFitColumns(actSheet, [20, 40, 12, 12, 10, 20, 15]);
      this.addFilters(actSheet, actividades.length + 1, headers.length);
    }
  }

  private static createGenericWorkbook(workbook: Workbook, data: any): void {
    const sheet = workbook.addWorksheet('Data');
    this.setupWorksheetStyles(sheet);

    // Add data as key-value pairs
    Object.entries(data).forEach(([key, value]) => {
      const row = sheet.addRow([key, typeof value === 'object' ? JSON.stringify(value) : value]);
      row.getCell(1).font = { name: 'Poppins', size: 11, bold: true };
      row.getCell(2).font = { name: 'Poppins', size: 11 };
    });

    sheet.getColumn(1).width = 25;
    sheet.getColumn(2).width = 50;
  }

  private static setupWorksheetStyles(worksheet: Worksheet): void {
    worksheet.properties.defaultRowHeight = 18;
  }

  private static styleHeaderRow(row: any): void {
    row.eachCell((cell: any) => {
      cell.font = { name: 'Poppins', size: 11, bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6E6FA' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  }

  private static styleDataRow(row: any): void {
    row.eachCell((cell: any) => {
      cell.font = { name: 'Poppins', size: 10 };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  }

  private static autoFitColumns(worksheet: Worksheet, widths: number[]): void {
    widths.forEach((width, index) => {
      worksheet.getColumn(index + 1).width = width;
    });
  }

  private static addFilters(worksheet: Worksheet, rowCount: number, colCount: number): void {
    worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: rowCount, column: colCount }
    };
  }

  private static downloadFile(buffer: ArrayBuffer, fileName: string): void {
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}