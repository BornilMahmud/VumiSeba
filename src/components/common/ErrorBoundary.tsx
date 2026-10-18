import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Home, RefreshCw, LifeBuoy, ChevronDown, ChevronUp, Copy, Check, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      showDetails: false,
      copied: false,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    // Log error details for telemetry/debugging
    if (import.meta.env.DEV) {
      console.error('Bhumisathi Uncaught React Error:', error);
      console.error('Component Stack Trace:', errorInfo.componentStack);
    }
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copied: false,
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleGoHome = () => {
    // Navigate cleanly to home
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleCopyError = () => {
    const errorText = `Error: ${this.state.error?.message}\n\nStack:\n${this.state.error?.stack}\n\nComponent Stack:\n${this.state.errorInfo?.componentStack}`;
    navigator.clipboard.writeText(errorText);
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2000);
  };

  private toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDev = Boolean(import.meta.env.DEV);

      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 font-bengali text-slate-800 dark:text-slate-100 transition-colors duration-200">
          <div className="max-w-xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-center space-y-6 relative overflow-hidden">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-500" />

            {/* Glowing Error Icon */}
            <div className="relative inline-flex items-center justify-center mx-auto">
              <div className="w-20 h-20 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center shadow-lg border border-rose-200 dark:border-rose-900/60">
                <AlertTriangle className="w-10 h-10 animate-pulse" />
              </div>
            </div>

            {/* Main Headings */}
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold font-mono">
                500 • RUNTIME_EXCEPTION
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                কিছু একটা ঠিকমতো কাজ করেনি (Something Went Wrong)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                এই অংশটি প্রক্রিয়াকরণ করার সময় একটি অপ্রত্যাশিত সিস্টেম ত্রুটি ঘটেছে। আপনার ডেটা সুরক্ষিত রয়েছে। পুনরায় চেষ্টা করতে নিচের বাটন ব্যবহার করুন।
              </p>
            </div>

            {/* Recovery Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer"
              >
                <RefreshCw size={15} />
                <span>পুনরায় চেষ্টা করুন (Try Again)</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm border border-slate-300 dark:border-slate-700 transition active:scale-95 cursor-pointer"
              >
                <Home size={15} />
                <span>হোমপেজে ফিরে যান (Home)</span>
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-semibold text-xs transition cursor-pointer"
                title="সম্পূর্ণ পেজ রিফ্রেশ করুন"
              >
                <span>পেজ রিলোড</span>
              </button>
            </div>

            {/* Developer Diagnostics Box (Expanded in Dev mode or togglable) */}
            {isDev && (
              <div className="pt-2 text-left">
                <button
                  type="button"
                  onClick={this.toggleDetails}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <span className="flex items-center gap-2">
                    <Bug size={14} className="text-amber-500" />
                    <span>প্রযুক্তিগত ত্রুটির বিবরণ (Developer Diagnostics)</span>
                  </span>
                  {this.state.showDetails ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>

                {this.state.showDetails && (
                  <div className="mt-2 p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-auto max-h-56 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-rose-400 font-bold">
                        {this.state.error?.name || 'Error'}: {this.state.error?.message}
                      </span>
                      <button
                        type="button"
                        onClick={this.handleCopyError}
                        className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 transition"
                      >
                        {this.state.copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        <span>{this.state.copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                      </button>
                    </div>

                    {this.state.error?.stack && (
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Stack Trace:</div>
                        <pre className="text-[10px] whitespace-pre-wrap leading-tight text-slate-400">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}

                    {this.state.errorInfo?.componentStack && (
                      <div className="pt-2 border-t border-slate-800">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Component Stack:</div>
                        <pre className="text-[10px] whitespace-pre-wrap leading-tight text-slate-400">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Helpline and Support Banner */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
              <LifeBuoy size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span>সহায়তা প্রয়োজন? ভূমি সেবা হেল্পলাইন ১৬১২২ (টোল ফ্রি)</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
