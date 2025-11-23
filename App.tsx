import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Button } from './components/Button';
import { LoadingScreen } from './components/LoadingScreen';
import { VideoPlayer } from './components/VideoPlayer';
import { ErrorBanner } from './components/ErrorBanner';
import { enhancePromptWithScript, generateVideo, generateImagePreview, setManualApiKey } from './services/geminiService';
import { GeneratedVideo, VideoConfig } from './types';

function App() {
  const [hasKey, setHasKey] = useState(false);
  const [isLoadingKey, setIsLoadingKey] = useState(true);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualKeyInput, setManualKeyInput] = useState('');
  
  // App State
  const [topic, setTopic] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [explanation, setExplanation] = useState('');
  
  // New state to manage the confirmation phase
  const [isConfirmingImage, setIsConfirmingImage] = useState(false);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Image Preview State
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Config
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [videoModel, setVideoModel] = useState<'veo-3.1-fast-generate-preview' | 'veo-3.1-generate-preview'>('veo-3.1-fast-generate-preview');

  // Check API Key on Mount
  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    setIsLoadingKey(true);
    try {
      // 1. Check for manually saved key first
      const localKey = localStorage.getItem("gemini_custom_key");
      if (localKey) {
        setHasKey(true);
        setIsLoadingKey(false);
        return;
      }

      // 2. Check for AI Studio environment key
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const has = await window.aistudio.hasSelectedApiKey();
        setHasKey(has);
      } else {
        // Fallback for dev environments without the specific wrapper
        console.warn("AI Studio wrapper not found.");
        setHasKey(false);
      }
    } catch (e) {
      console.error(e);
      setHasKey(false);
    } finally {
      setIsLoadingKey(false);
    }
  };

  const handleSelectKey = async () => {
    setError(null);
    try {
      if (window.aistudio && window.aistudio.openSelectKey) {
        await window.aistudio.openSelectKey();
        // Assume success to avoid race condition
        setHasKey(true);
      } else {
        setError("بيئة العمل هذه لا تدعم تحديد المفتاح تلقائياً. يرجى إدخاله يدوياً.");
      }
    } catch (e) {
      console.error("Error selecting key:", e);
      setError("حدث خطأ أثناء تحديد المفتاح. يرجى المحاولة مرة أخرى.");
    }
  };

  const handleManualKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualKeyInput.trim()) return;
    
    setManualApiKey(manualKeyInput.trim());
    setHasKey(true);
    setError(null);
  };

  const handleEnhance = async () => {
    if (!topic.trim()) return;
    setIsEnhancing(true);
    setImagePreviewUrl(null);
    setError(null);
    // Reset confirmation state at start of new enhancement
    setIsConfirmingImage(false); 

    try {
      const result = await enhancePromptWithScript(topic);
      setEnhancedPrompt(result.visualPrompt);
      setExplanation(result.explanation);
      
      // Stop blocking main enhancement state to show step 2
      setIsEnhancing(false);
      // Enable confirmation step
      setIsConfirmingImage(true);

      // Start Image Preview Generation
      setIsGeneratingImage(true);
      try {
        const previewUrl = await generateImagePreview(result.visualPrompt, aspectRatio);
        setImagePreviewUrl(previewUrl);
      } catch (imgErr) {
        console.error("Failed to generate preview image:", imgErr);
        // We don't block the flow if image fails, just log it
      } finally {
        setIsGeneratingImage(false);
      }

    } catch (err) {
      setError("فشل في تحسين الوصف. تأكد من الاتصال بالإنترنت وصلاحية مفتاح API.");
      setIsEnhancing(false);
      setIsConfirmingImage(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!enhancedPrompt) return;
    setIsGenerating(true);
    setError(null);
    // Ensure we start with a clean slate for the new video
    setGeneratedVideo(null);
    
    const config: VideoConfig = {
      prompt: enhancedPrompt,
      resolution,
      aspectRatio,
      model: videoModel
    };

    try {
      const url = await generateVideo(config);
      setGeneratedVideo({
        id: Date.now().toString(),
        url,
        prompt: enhancedPrompt,
        timestamp: Date.now(),
        config
      });
      // Success: UI will automatically switch to VideoPlayer view because generatedVideo is set.
    } catch (err: any) {
      console.error("Video Generation Error:", err);
      
      // Explicitly clear generated video to ensure we stay in/return to the settings view
      setGeneratedVideo(null);
      
      // Handle "Requested entity was not found" error by resetting key
      if (err.message && (err.message.includes("Requested entity was not found") || err.message.includes("403"))) {
        setHasKey(false);
        setError("انتهت صلاحية الجلسة أو المفتاح غير صالح. يرجى إعادة إدخال المفتاح.");
        localStorage.removeItem("gemini_custom_key");
      } else {
        // General error
        setError("فشل توليد الفيديو. " + (err.message || "يرجى التحقق من الإعدادات."));
      }
      // Note: We deliberately leave isConfirmingImage as true so the user stays on Step 2
      // and can retry easily without re-entering the prompt.
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoadingKey) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">جاري التحميل...</div>;
  }

  if (!hasKey) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-center">
        <div className="max-w-md w-full bg-slate-800 p-6 md:p-8 rounded-2xl border border-slate-700 shadow-2xl space-y-6">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto text-3xl md:text-4xl shadow-lg shadow-indigo-600/30">
            🎬
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">أهلاً بك</h1>
          <p className="text-slate-400 text-sm md:text-base">
            لتوليد فيديوهات عالية الجودة باستخدام نموذج Veo، يجب توفر مفتاح Google Cloud API فعال.
          </p>
          <div className="p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg text-xs md:text-sm text-yellow-200">
            يرجى التأكد من تفعيل الفوترة في مشروعك.
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline mr-1 font-bold block sm:inline mt-1 sm:mt-0">اقرأ المزيد</a>
          </div>
          
          {error && <ErrorBanner message={error} onClose={() => setError(null)} />}
          
          {!showManualInput ? (
            <div className="space-y-4">
               {window.aistudio && (
                <Button onClick={handleSelectKey} className="w-full justify-center text-base md:text-lg">
                  ربط الحساب تلقائياً
                </Button>
               )}
               
               <button 
                onClick={() => setShowManualInput(true)}
                className="text-slate-400 text-sm hover:text-white underline decoration-slate-600 hover:decoration-white underline-offset-4 transition-all"
               >
                 أو أدخل مفتاح API يدوياً
               </button>
            </div>
          ) : (
            <form onSubmit={handleManualKeySubmit} className="space-y-3 animate-fade-in">
              <div className="text-right">
                <label className="text-xs text-slate-400 mb-1 block">مفتاح API</label>
                <input 
                  type="password" 
                  value={manualKeyInput}
                  onChange={(e) => setManualKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono"
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 justify-center py-2" disabled={!manualKeyInput}>
                  حفظ ودخول
                </Button>
                <button 
                  type="button"
                  onClick={() => setShowManualInput(false)}
                  className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-20 font-[Tajawal]">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
        
        {/* Error Alert */}
        {error && (
          <ErrorBanner 
            message={error} 
            onClose={() => setError(null)}
            className="animate-fade-in-up"
          />
        )}

        {/* Step 1: Topic Input */}
        {/* Shown when not generating video and no video result */}
        {!generatedVideo && !isGenerating && (
          <div className={`bg-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-700 shadow-xl space-y-4 md:space-y-6 transition-all ${isConfirmingImage ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-indigo-600 text-white w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-sm md:text-base">1</span>
              <h2 className="text-lg md:text-xl font-bold text-white">فكرة الفيديو</h2>
            </div>
            
            <div className="space-y-4">
              <label className="block text-slate-400 text-sm">عن ماذا تريد أن يكون الفيديو؟</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="مثال: غروب الشمس فوق الأهرامات، أو شرح بصري لعملية البناء الضوئي..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 md:p-4 text-white text-base focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all h-28 md:h-32 resize-none placeholder:text-sm"
              />
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                {isConfirmingImage && (
                  <Button 
                    variant="secondary"
                    onClick={() => setIsConfirmingImage(false)}
                    className="w-full sm:w-auto"
                  >
                    تعديل الفكرة
                  </Button>
                )}
                <Button 
                  onClick={handleEnhance} 
                  isLoading={isEnhancing}
                  disabled={!topic || isEnhancing}
                  className="w-full sm:w-auto"
                >
                  {isConfirmingImage ? 'إعادة التوليد ✨' : 'تحسين الوصف وتوليد الشرح ✨'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Review & Settings (Confirmation Phase) */}
        {isConfirmingImage && !generatedVideo && !isGenerating && (
          <div className="bg-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-700 shadow-xl space-y-5 md:space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-indigo-600 text-white w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-sm md:text-base">2</span>
              <h2 className="text-lg md:text-xl font-bold text-white">إعدادات المشهد والمعاينة</h2>
            </div>

            {/* Preview Section */}
            <div className="bg-slate-900/50 rounded-xl p-3 md:p-4 border border-slate-700">
              <h3 className="text-xs md:text-sm font-semibold text-slate-400 mb-3">معاينة النمط البصري (Gemini Image)</h3>
              <div className="relative w-full rounded-lg overflow-hidden bg-black/50 border border-slate-700 flex items-center justify-center min-h-[180px] md:min-h-[300px]">
                {isGeneratingImage ? (
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs animate-pulse">جاري رسم معاينة للمشهد...</span>
                  </div>
                ) : imagePreviewUrl ? (
                  <img 
                    src={imagePreviewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-contain max-h-[300px] md:max-h-[400px]"
                  />
                ) : (
                  <div className="text-slate-500 text-sm">
                    تعذرت المعاينة
                  </div>
                )}
              </div>
              <p className="text-[10px] md:text-xs text-slate-500 mt-2 text-center">
                هذه الصورة تم توليدها بواسطة Gemini Flash Image لتوضيح النمط البصري، قد يختلف الفيديو النهائي قليلاً.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-slate-400 text-sm font-semibold">الشرح المقترح:</label>
                <div className="bg-slate-900/50 p-3 md:p-4 rounded-xl border border-slate-700 text-slate-300 text-sm leading-relaxed min-h-[80px] md:min-h-[100px]">
                  {explanation}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-slate-400 text-sm font-semibold">الوصف البصري (إنجليزي):</label>
                <textarea 
                  value={enhancedPrompt}
                  onChange={(e) => setEnhancedPrompt(e.target.value)}
                  className="w-full bg-slate-900/50 p-3 md:p-4 rounded-xl border border-slate-700 text-slate-300 text-base md:text-sm leading-relaxed min-h-[80px] md:min-h-[100px] font-mono resize-y"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700 space-y-5">
              
              {/* Model Selection */}
              <div>
                <label className="block text-slate-400 text-sm mb-3 font-semibold">نموذج التوليد</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setVideoModel('veo-3.1-fast-generate-preview')}
                    className={`p-3 md:p-4 rounded-xl border text-right transition-all flex flex-col gap-1 relative overflow-hidden group ${videoModel === 'veo-3.1-fast-generate-preview' ? 'bg-indigo-900/40 border-indigo-500 ring-1 ring-indigo-500' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}
                  >
                    <div className="flex justify-between items-center w-full z-10 relative">
                      <span className={`font-bold text-sm md:text-base ${videoModel === 'veo-3.1-fast-generate-preview' ? 'text-indigo-200' : 'text-slate-300'}`}>Veo Fast</span>
                      {videoModel === 'veo-3.1-fast-generate-preview' && <span className="text-indigo-400">✓</span>}
                    </div>
                    <span className="text-xs text-slate-400 z-10 relative">سريع • مثالي للتجربة (افتراضي)</span>
                    {videoModel === 'veo-3.1-fast-generate-preview' && <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-transparent pointer-events-none" />}
                  </button>
                  
                  <button
                    onClick={() => setVideoModel('veo-3.1-generate-preview')}
                    className={`p-3 md:p-4 rounded-xl border text-right transition-all flex flex-col gap-1 relative overflow-hidden group ${videoModel === 'veo-3.1-generate-preview' ? 'bg-purple-900/40 border-purple-500 ring-1 ring-purple-500' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}
                  >
                    <div className="flex justify-between items-center w-full z-10 relative">
                      <span className={`font-bold text-sm md:text-base ${videoModel === 'veo-3.1-generate-preview' ? 'text-purple-200' : 'text-slate-300'}`}>Veo Professional</span>
                      {videoModel === 'veo-3.1-generate-preview' && <span className="text-purple-400">✓</span>}
                    </div>
                    <span className="text-xs text-slate-400 z-10 relative">جودة سينمائية • يستغرق وقتاً</span>
                    {videoModel === 'veo-3.1-generate-preview' && <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent pointer-events-none" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-slate-400 text-sm mb-2 font-semibold">الدقة</label>
                  <div className="flex gap-2 bg-slate-900 p-1 rounded-lg border border-slate-700">
                    <button 
                      onClick={() => setResolution('720p')}
                      className={`flex-1 py-2 rounded-md text-xs md:text-sm font-bold transition-all ${resolution === '720p' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      720p
                    </button>
                    <button 
                      onClick={() => setResolution('1080p')}
                      className={`flex-1 py-2 rounded-md text-xs md:text-sm font-bold transition-all ${resolution === '1080p' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      1080p
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2 font-semibold">الأبعاد</label>
                  <div className="flex gap-2 bg-slate-900 p-1 rounded-lg border border-slate-700">
                    <button 
                      onClick={() => setAspectRatio('16:9')}
                      className={`flex-1 py-2 rounded-md text-xs md:text-sm font-bold transition-all ${aspectRatio === '16:9' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      16:9
                    </button>
                    <button 
                      onClick={() => setAspectRatio('9:16')}
                      className={`flex-1 py-2 rounded-md text-xs md:text-sm font-bold transition-all ${aspectRatio === '9:16' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      9:16
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleGenerateVideo} 
              className="w-full justify-center text-lg mt-4 md:mt-6"
              variant={error ? 'danger' : 'primary'}
            >
              {error ? '🔄 المحاولة مرة أخرى' : '🎥 توليد الفيديو الآن'}
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="bg-slate-800 rounded-xl md:rounded-2xl p-4 md:p-8 border border-slate-700 shadow-xl">
             <LoadingScreen status={videoModel === 'veo-3.1-generate-preview' ? "جاري الإنتاج السينمائي..." : "جاري صناعة الفيديو..."} />
          </div>
        )}

        {/* Result */}
        {generatedVideo && (
          <VideoPlayer 
            video={generatedVideo} 
            explanation={explanation}
            onClose={() => {
              setGeneratedVideo(null);
              setEnhancedPrompt('');
              setExplanation('');
              setTopic('');
              setImagePreviewUrl(null);
              setIsConfirmingImage(false); // Reset flow
            }} 
          />
        )}
      </main>
    </div>
  );
}

export default App;