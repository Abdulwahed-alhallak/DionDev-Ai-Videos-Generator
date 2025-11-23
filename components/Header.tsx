import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg shadow-indigo-500/20">
            V
          </div>
          <h1 className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            صانع الفيديو الذكي
          </h1>
        </div>
        <div className="text-[10px] md:text-xs text-slate-400 px-2 md:px-3 py-1 bg-slate-800 rounded-full border border-slate-700 whitespace-nowrap">
          مدعوم بواسطة Veo
        </div>
      </div>
    </header>
  );
};