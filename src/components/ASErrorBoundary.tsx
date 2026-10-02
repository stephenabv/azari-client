import { Component, type ErrorInfo, type ReactNode } from "react";

const CHUNK_RELOAD_FLAG = "azari_chunk_reload_v1";

function isChunkLoadError(error: Error): boolean {
  return (
    error.name === "ChunkLoadError" ||
    /loading chunk \d+ failed/i.test(error.message) ||
    /failed to fetch dynamically imported module/i.test(error.message) ||
    /error loading dynamically imported module/i.test(error.message)
  );
}

function generateErrorId(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

interface Props {
  children: ReactNode;
  context?: string;
  className?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
  isChunkError: boolean;
}

export default class ASErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null, errorId: null, isChunkError: false };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: generateErrorId(),
      isChunkError: isChunkLoadError(error),
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (isChunkLoadError(error)) {
      const alreadyTried = sessionStorage.getItem(CHUNK_RELOAD_FLAG);
      if (!alreadyTried) {
        sessionStorage.setItem(CHUNK_RELOAD_FLAG, "1");
        window.location.reload();
        return;
      }
    }
    if (import.meta.env.DEV) {
      console.error("[ASErrorBoundary]", error, info.componentStack);
    }
  }

  handleReset = () => {
    sessionStorage.removeItem(CHUNK_RELOAD_FLAG);
    this.setState({ hasError: false, error: null, errorId: null, isChunkError: false });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const { context = "this section", className } = this.props;
    const { error, errorId, isChunkError } = this.state;
    const isDev = import.meta.env.DEV;

    return (
      <div className={`as-error-boundary${className ? ` ${className}` : ""}`} role="alert">
        <div className="as-error-boundary-inner">
          <div className="as-error-boundary-icon" aria-hidden="true">⚠</div>
          <h2 className="as-error-boundary-title">Something went wrong</h2>

          {isChunkError ? (
            <p className="as-error-boundary-msg">
              A new version of the app is available. Reload to continue.
            </p>
          ) : (
            <p className="as-error-boundary-msg">
              {`We couldn't load ${context}. This is likely a temporary issue.`}
            </p>
          )}

          {isDev && error && (
            <pre className="as-error-boundary-stack">
              {error.message}
              {"\n\n"}
              {error.stack}
            </pre>
          )}

          {!isDev && errorId && (
            <p className="as-error-boundary-code">Error code: {errorId}</p>
          )}

          <button
            className="as-error-boundary-retry"
            onClick={isChunkError ? () => window.location.reload() : this.handleReset}
          >
            {isChunkError ? "Reload page" : "Try again"}
          </button>
        </div>
      </div>
    );
  }
}
