import React from 'react';
import { useApp } from '../../context/AppContext';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC<{ orderId?: string }> = ({ orderId }) => {
  const { settings } = useApp();
  
  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const messageText = orderId
    ? `Hello Reza Enterprise, I need help regarding my PVC Card Order ID: ${orderId}`
    : `Hello Reza Enterprise, I need help regarding PVC card printing.`;

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 group">
      <a
        id="btn-floating-whatsapp"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-full shadow-lg shadow-emerald-600/30 transition-all duration-300 transform hover:scale-105 active:scale-95"
      >
        <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
        <span className="text-sm font-semibold tracking-wide hidden sm:inline">WhatsApp Us</span>
      </a>
      
      {/* Quick tooltip */}
      <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-slate-900 text-white text-xs py-1.5 px-3 rounded-lg shadow-md whitespace-nowrap">
        Quick support on WhatsApp
      </div>
    </div>
  );
};
