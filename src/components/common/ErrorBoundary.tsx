'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/utils/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught error:', { error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              エラーが発生しました
            </h2>
            <p className="text-gray-600 mb-4">
              申し訳ありませんが、予期せぬエラーが発生しました。
              ページを再読み込みするか、しばらく時間をおいて再度お試しください。
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              ページを再読み込み
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto text-sm">
                {this.state.error.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 