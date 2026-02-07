import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertOctagon, RefreshCw, Home } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-6 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto">
              <AlertOctagon className="w-10 h-10 text-red-600" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">Something went wrong</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                We encountered an unexpected error. Don't worry, our team has been notified.
              </p>
            </div>

            {this.state.error && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-left border border-slate-100 dark:border-slate-700">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Error Details</p>
                <p className="text-xs font-mono text-red-500 break-all">{this.state.error.message}</p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary-500/20"
              >
                <RefreshCw className="w-5 h-5" />
                Reload Application
              </button>
              
              <a
                href="/"
                className="w-full py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <Home className="w-5 h-5" />
                Return to Dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
