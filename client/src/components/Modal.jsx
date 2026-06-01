import React from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ open, title, onClose, children, footer }) => {
  if (!open) return null;

  const node = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-20 w-full max-w-2xl rounded-xl bg-slate-900 border border-white/10 p-6 shadow-lg">
        {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}
        <div className="space-y-4">{children}</div>
        {footer && <div className="mt-6">{footer}</div>}
      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(node, document.body);
  }

  return null;
};

export default Modal;
