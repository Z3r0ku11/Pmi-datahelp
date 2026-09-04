import React, { useState } from 'react';
import { WordExportService } from '@/services/WordExportService';
import { ExcelExportService } from '@/services/ExcelExportService';
import { FileNameService } from '@/services/FileNameService';
import { Button } from '@/components/common/Button';

interface ExportPanelProps {
  data: any;
  formats: string[];
  fileName: string;
  toolId?: string;
}

export function ExportPanel({ data, formats, fileName, toolId }: ExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(formats[0] || 'JSON');

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const finalFileName = FileNameService.generateFromToolData(
        toolId || 'TOOL-GENERIC',
        data,
        selectedFormat
      );

      const exportOptions = {
        data,
        fileName: finalFileName,
        toolId
      };

      switch (selectedFormat.toUpperCase()) {
        case 'DOCX':
          await WordExportService.exportDocument(exportOptions);
          break;
        case 'XLSX':
          await ExcelExportService.exportDocument(exportOptions);
          break;
        case 'PDF':
        case 'JSON':
        case 'PPTX':
          // Use mock service for formats not yet implemented
          const { MockExportService } = await import('@/services/MockExportService');
          await MockExportService.exportData({
            fileName: finalFileName.split('.')[0],
            format: selectedFormat,
            data: data,
            toolId: toolId
          });
          break;
        default:
          throw new Error(`Formato no soportado: ${selectedFormat}`);
      }
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al exportar el documento. Por favor, intente nuevamente.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Exportar Documento
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Formato de Exportación
          </label>
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {formats.map(format => (
              <option key={format} value={format}>
                {format}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Archivo (se genera automáticamente)
          </label>
          <input
            type="text"
            value={FileNameService.generateFromToolData(toolId || 'TOOL-GENERIC', data, selectedFormat)}
            readOnly
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700"
          />
          <p className="text-xs text-gray-500 mt-1">
            Formato: MO-PMO-[PROYECTO]-[TIPO]-[NOMBRE]-[VERSION].{selectedFormat.toLowerCase()}
          </p>
        </div>

        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full"
          variant="primary"
        >
          {isExporting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Exportando...
            </div>
          ) : (
            `Exportar como ${selectedFormat}`
          )}
        </Button>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Los documentos siguen los estándares corporativos Morris & Opazo</p>
          <p>• La información del proyecto se incluye automáticamente</p>
          <p>• Los borradores se guardan automáticamente en su navegador</p>
        </div>
      </div>
    </div>
  );
}