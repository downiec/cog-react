import * as React from "react";

export interface IErrorBoundaryProps {
  errorRender?: JSX.Element;
}

export interface IErrorBoundaryState {
  hasError: boolean;
}

// An error boundary to catch errors without killing the UI
export default class ErrorBoundary extends React.Component<
  IErrorBoundaryProps,
  IErrorBoundaryState
> {
  public static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  public componentDidCatch(error: any, info: any): void {
    // You can also log the error to an error reporting service
    console.error(error, info);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.errorRender
        ? this.props.errorRender
        : this.props.children;
    }
    return this.props.children;
  }
}
