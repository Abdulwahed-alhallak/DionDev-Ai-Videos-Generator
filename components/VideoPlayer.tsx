import React from 'react';
import { GeneratedVideo } from '../types';

interface VideoPlayerProps {
  video: GeneratedVideo;
  explanation?: string;
  onClose: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, explanation, onClose }) => {
  
  const formatAspectRatio = (ratio: string) => {
    if (ratio === '16:9') return '16:9 (Landscape)';
    if (ratio === '9:16') return '9:16 (Portrait)';
    return ratio;
  };

  return (
    <div className="bg-slate-800 rounded-xl md:rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
      <div className="p-3 md:p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
        <h3 className="font-bold text-slate-200 text-sm md:text-base">النتيجة النهائية</h3>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors text-sm md:text-base"
        >
          ✕ إغلاق
        </button>
      </div>
      
      <div className="relative bg-black flex justify-center aspect-video w-full">
        <video 
          src={video.url} 
          controls 
          autoPlay 
          className="h-full w-full object-contain"
        />
      </div>

      <div className="p-4 md:p-6 space-y-4">
        {explanation && (
          <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-3 md:p-4">
            <h4 className="text-indigo-400 font-bold mb-2 text-xs md:text-sm">شرح الموضوع:</h4>
            <p className="text-slate-200 leading-relaxed text-sm md:text-base">
              {explanation}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-xs text-slate-400">
          <div className="bg-slate-900 p-3 rounded-lg">
            <span className="block font-semibold mb-1 text-slate-500">الوصف البصري (Prompt):</span>
            <div className="max-h-20 overflow-y-auto">
              {video.prompt}
            </div>
          </div>
          <div className="space-y-2">
             <div className="bg-slate-900 p-3 rounded-lg flex justify-between">
                <span>الدقة:</span>
                <span className="text-slate-200">{video.config.resolution}</span>
             </div>
             <div className="bg-slate-900 p-3 rounded-lg flex justify-between">
                <span>الأبعاد:</span>
                <span className="text-slate-200" style={{direction: 'ltr'}}>
                  {formatAspectRatio(video.config.aspectRatio)}
                </span>
             </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
            <a 
                href={video.url} 
                download={`video-${video.id}.mp4`}
                className="w-full sm:w-auto justify-center bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 md:py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
            >
                <span>⬇️</span> تحميل الفيديو
            </a>
        </div>
      </div>
    </div>
  );
};