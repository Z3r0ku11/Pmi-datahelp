import React from 'react';

interface PreviewPanelProps {
  title: string;
  data: any;
  exportFormats: string[];
}

export function PreviewPanel({ title, data, exportFormats }: PreviewPanelProps) {
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Sí' : 'No';
    if (typeof value === 'object') {
      if (Array.isArray(value)) return `${value.length} elementos`;
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const renderObjectPreview = (obj: any, level = 0): JSX.Element => {
    if (!obj || typeof obj !== 'object') {
      return <span className="text-gray-600">{formatValue(obj)}</span>;
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return <span className="text-gray-400 italic">Sin elementos</span>;
      }
      
      return (
        <div className="space-y-2">
          {obj.slice(0, 3).map((item, index) => (
            <div key={index} className="border-l-2 border-gray-200 pl-3">
              <div className="text-xs text-gray-500 mb-1">Item #{index + 1}</div>
              {renderObjectPreview(item, level + 1)}
            </div>
          ))}
          {obj.length > 3 && (
            <div className="text-sm text-gray-500 italic">
              ... y {obj.length - 3} elementos más
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {Object.entries(obj).slice(0, 5).map(([key, value]) => (
          <div key={key} className="flex">
            <div className="w-1/3 text-sm font-medium text-gray-700 capitalize">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
            </div>
            <div className="w-2/3 text-sm">
              {level < 2 ? renderObjectPreview(value, level + 1) : formatValue(value)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Vista Previa: {title}
      </h3>
      
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
          {renderObjectPreview(data)}
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Información de Exportación
          </h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• Formatos disponibles: {exportFormats.join(', ')}</p>
            <p>• Fecha de generación: {new Date().toLocaleDateString()}</p>
            <p>• Elementos procesados: {JSON.stringify(data).length} caracteres</p>
          </div>
        </div>
      </div>
    </div>
  );
}