import React from 'react';
import { Button } from '@/components/common/Button';

interface Column {
  key: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'date' | 'textarea' | 'select' | 'boolean';
  required?: boolean;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
}

interface DynamicTableProps {
  title: string;
  data: any[];
  columns: Column[];
  onDataChange: (data: any[]) => void;
  onAddNew: () => void;
  addButtonText: string;
}

export function DynamicTable({
  title,
  data,
  columns,
  onDataChange,
  onAddNew,
  addButtonText
}: DynamicTableProps) {

  const updateItem = (index: number, field: string, value: any) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onDataChange(newData);
  };

  const removeItem = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onDataChange(newData);
  };

  const renderInput = (item: any, column: Column, index: number) => {
    const value = item[column.key] ?? '';
    const inputProps = {
      value: column.type === 'boolean' ? undefined : value,
      checked: column.type === 'boolean' ? Boolean(value) : undefined,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const newValue = column.type === 'boolean' 
          ? (e.target as HTMLInputElement).checked
          : column.type === 'number' 
          ? parseFloat(e.target.value) || 0
          : e.target.value;
        updateItem(index, column.key, newValue);
      },
      className: column.type === 'boolean' 
        ? "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        : "w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500",
      placeholder: column.required ? `${column.label} (requerido)` : column.label,
      required: column.required,
      min: column.min,
      max: column.max
    };

    switch (column.type) {
      case 'textarea':
        return (
          <textarea
            {...inputProps}
            rows={2}
          />
        );
      case 'select':
        return (
          <select {...inputProps}>
            <option value="">Seleccione...</option>
            {column.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'boolean':
        return (
          <input
            type="checkbox"
            {...inputProps}
          />
        );
      default:
        return (
          <input
            type={column.type}
            {...inputProps}
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <Button onClick={onAddNew} variant="outline" size="sm">
          + {addButtonText}
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No hay elementos agregados.</p>
          <p className="text-sm">Haga clic en "{addButtonText}" para comenzar.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={item.id || index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  {title.slice(0, -1)} #{index + 1}
                </span>
                <Button
                  onClick={() => removeItem(index)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  Eliminar
                </Button>
              </div>
              
              <div className="grid gap-3 md:grid-cols-2">
                {columns.map(column => (
                  <div key={column.key} className={column.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {column.label}
                      {column.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderInput(item, column, index)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}