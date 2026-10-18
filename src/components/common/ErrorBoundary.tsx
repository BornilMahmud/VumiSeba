import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, Home, RefreshCw, LifeBuoy } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Bhumisathi Uncaught React Error:', error, errorInfo);
  }

  private handleGoHome = () => {
    // Hard navigate to '/' to clear any broken in-memory route/component state
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 font-bengali text-slate-800 dark:text-slate-100 transition-colors">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-red-200 dark:border-red-900/60">
              <AlertOctagon size={34} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                সাময়িক ত্রুটি দেখা দিয়েছে
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                পেজটি রেন্ডার করার সময় একটি অপ্রত্যাশিত সমস্যা হয়েছে। অনুগ্রহ করে নিচের বাটন ব্যবহার করে মূল হোমপেজে ফিরে যান অথবা পেজটি পুনরায় লোড করুন।
              </p>
            </div>

            {this.state.error?.message && (
              <div className="bg-slate-100 dark:bg-slate-800/60 p-3 rounded-lg text-[11px] text-slate-600 dark:text-slate-400 font-mono text-left overflow-auto max-h-24 border border-slate-200 dark:border-slate-700">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleGoHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
              >
                <Home size={15} />
                <span>হোমপেজে ফিরে যান</span>
              </button>

              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-xl font-bold text-xs border border-slate-300 dark:border-slate-700 transition active:scale-95 cursor-pointer"
              >
                <RefreshCw size={15} />
                <span>পুনরায় লোড করুন</span>
              </button>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
              <LifeBuoy size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span>সহায়তা প্রয়োজন? ১৬১২২ হেল্পলাইনে কল করুন</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
