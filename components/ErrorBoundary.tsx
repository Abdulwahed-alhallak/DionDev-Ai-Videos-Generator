import React, { ErrorInfo, ReactNode } from "react";
import { logError } from "../services/loggingService";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    logError(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-center font-[Tajawal]" dir="rtl">
          <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl border border-red-500/30 shadow-2xl space-y-6 animate-fade-in-up">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-4xl border border-red-500/20 shadow-lg shadow-red-500/10">
              ⚠️
            </div>
            
            <h1 className="text-2xl font-bold text-white">عذراً، حدث خطأ غير متوقع</h1>
            
            <p className="text-slate-400 leading-relaxed">
              واجه التطبيق مشكلة تقنية مفاجئة. تم تسجيل تفاصيل الخطأ وسنعمل على إصلاحه. يرجى محاولة إعادة تحميل الصفحة.
            </p>

            {this.state.error && (
              <div className="bg-black/30 p-4 rounded-lg border border-slate-700 text-left" dir="ltr">
                <code className="text-xs text-red-300 font-mono break-words block">
                  {this.state.error.message}
                </code>
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-900/20 active:scale-95"
            >
              🔄 إعادة تحميل الصفحة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}