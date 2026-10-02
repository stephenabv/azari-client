import { Component, type ErrorInfo, type ReactNode } from "react";
import { useT } from "../i18n";

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

    const { context, className } = this.props;
    const { error, errorId, isChunkError } = this.state;

    return (
      <ErrorFallback
        context={context}
        className={className}
        error={error}
        errorId={errorId}
        isChunkError={isChunkError}
        onRetry={this.handleReset}
      />
    );
  }
}

interface FallbackProps {
  context?: string;
  className?: string;
  error: Error | null;
  errorId: string | null;
  isChunkError: boolean;
  onRetry: () => void;
}

/** Function component so the fallback can read the active locale via hooks. */
function ErrorFallback({ context, className, error, errorId, isChunkError, onRetry }: FallbackProps) {
  const t = useT();
  const isDev = import.meta.env.DEV;

  return (
    <div className={`as-error-boundary${className ? ` ${className}` : ""}`} role="alert">
      <div className="as-error-boundary-inner">
        <div className="as-error-boundary-icon" aria-hidden="true">⚠</div>
        <h2 className="as-error-boundary-title">{t("system.errorBoundary.title")}</h2>

        <p className="as-error-boundary-msg">
          {isChunkError
            ? t("system.errorBoundary.chunkMessage")
            : t("system.errorBoundary.message", {
                context: context ?? t("system.errorBoundary.defaultContext"),
              })}
        </p>

        {isDev && error && (
          <pre className="as-error-boundary-stack">
            {error.message}
            {"\n\n"}
            {error.stack}
          </pre>
        )}

        {!isDev && errorId && (
          <p className="as-error-boundary-code">
            {t("system.errorBoundary.errorCode", { code: errorId })}
          </p>
        )}

        <button
          type="button"
          className="as-error-boundary-retry"
          onClick={isChunkError ? () => window.location.reload() : onRetry}
        >
          {isChunkError ? t("system.errorBoundary.reload") : t("system.errorBoundary.retry")}
        </button>
      </div>
    </div>
  );
}
