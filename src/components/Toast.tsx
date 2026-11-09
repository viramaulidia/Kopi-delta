import React from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info';
  title: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-24 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#1C120C] text-[#FAF7F2] p-4 rounded-xl shadow-xl border border-[#C59A6F]/40 flex items-start justify-between gap-3 animate-in slide-in-from-top-2 duration-300"
        >
          <div className="flex items-start gap-2.5">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-[#C59A6F] shrink-0 mt-0.5" />
            )}
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-white">{toast.title}</p>
              <p className="text-[11px] text-[#D8C7BC] leading-relaxed">{toast.message}</p>
            </div>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-[#A8988C] hover:text-white transition-colors p-0.5"
            aria-label="Tutup Notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
