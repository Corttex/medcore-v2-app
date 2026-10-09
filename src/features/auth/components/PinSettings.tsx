import React from 'react';

export function PinSettings() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-on-surface">PIN de Acesso Rápido</h4>
        <p className="text-sm text-on-surface-variant font-medium">Use um PIN de 4 dígitos para agilizar o desbloqueio.</p>
      </div>
      <button className="px-4 py-2 bg-surface-container-highest border border-outline-variant/30 rounded-xl text-xs font-semibold text-on-surface hover:bg-outline-variant/10 transition-colors">
        Configurar PIN
      </button>
    </div>
  );
}
