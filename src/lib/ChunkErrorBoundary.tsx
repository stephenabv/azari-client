import React from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  isChunkError: boolean;
}

function isChunkLoadError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return (
    msg.includes("failed to fetch dynamically imported module") ||
    msg.includes("loading chunk") ||
    msg.includes("loading css chunk") ||
    msg.includes("dynamically imported module") ||
    (err.name === "TypeError" && msg.includes("import"))
  );
}

export class ChunkErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, isChunkError: false };
  }

  static getDerivedStateFromError(err: unknown): State {
    return { hasError: true, isChunkError: isChunkLoadError(err) };
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleRetry = () => {
    this.setState({ hasError: false, isChunkError: false });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    if (this.state.isChunkError) {
      return (
        <div className="as-chunk-error">
          <p className="as-chunk-error__msg">
            A newer version of this page is available.
          </p>
          <button className="as-chunk-error__btn" onClick={this.handleReload}>
            Reload to update
          </button>
        </div>
      );
    }

    return (
      <div className="as-chunk-error">
        <p className="as-chunk-error__msg">Something went wrong loading this section.</p>
        <button className="as-chunk-error__btn" onClick={this.handleRetry}>
          Try again
        </button>
      </div>
    );
  }
}
