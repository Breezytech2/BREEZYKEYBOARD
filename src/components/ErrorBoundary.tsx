import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

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
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 space-y-6 text-center shadow-2xl">
            <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/30">
              <AlertCircle className="w-8 h-8 text-rose-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">Something went wrong</h2>
              <p className="text-sm text-white/60">
                The application encountered an unexpected error. We've logged the issue and you can try refreshing the page.
              </p>
            </div>
            
            {this.state.error && (
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-[10px] font-mono text-white/40 text-left overflow-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl text-white font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-lg active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
