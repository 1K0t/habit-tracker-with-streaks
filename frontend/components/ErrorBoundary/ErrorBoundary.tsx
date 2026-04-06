'use client';

import { ReactNode, Component } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }): void {
    console.error(
      `[${this.props.name || 'ErrorBoundary'}] Error caught:`,
      error,
      errorInfo,
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-64 bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-center">
              <div className="text-lg font-semibold text-red-900 mb-2">
                Something went wrong
              </div>
              <p className="text-sm text-red-700 mb-4">
                {this.state.error?.message ||
                  'An unexpected error occurred. Please try refreshing the page.'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )
      );
    }

    return <>{this.props.children}</>;
  }
}
