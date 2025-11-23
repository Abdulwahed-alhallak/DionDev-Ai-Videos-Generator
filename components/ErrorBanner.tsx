import React from 'react';

interface ErrorBannerProps {
  message: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ 
  message, 
  icon = "⚠️", 
  onClose,
  className = "" 
}) => {
  return (
    <div 
      className={`bg-red-500/10 border border-red-500/50 text-red-200 p-3 md:p-4 rounded-xl flex items-start gap-3 shadow-lg shadow-red-900/10 ${className}`} 
      role="alert"
    >
      <div className="text-lg md:text-xl flex-shrink-0 animate-pulse mt-0.5">
        {icon}
      </div>
      <div className="flex-1 text-sm md:text-base font-medium leading-relaxed">
        {message}
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className="flex-shrink-0 text-red-300 hover:text-white hover:bg-red-500/20 p-1 rounded-lg transition-colors mt-0.5"
          aria-label="إغلاق التنبيه"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};