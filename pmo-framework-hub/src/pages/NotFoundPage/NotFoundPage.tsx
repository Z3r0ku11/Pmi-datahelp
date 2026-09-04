import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-96 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Página no encontrada
          </h2>
          <p className="text-gray-600 mb-8">
            La página que buscas no existe o ha sido movida.
          </p>
        </div>

        <div className="space-y-3">
          <Link to="/">
            <Button className="w-full">
              Ir al inicio
            </Button>
          </Link>
          
          <Link to="/frameworks">
            <Button variant="outline" className="w-full">
              Ver frameworks
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}