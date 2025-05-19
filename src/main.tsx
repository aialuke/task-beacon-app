import { createRoot } from "react-dom/client";
import { StrictMode, Component, ReactNode } from "react";
import App from "./App.tsx";
import "./index.css";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <h1 className="text-2xl font-bold text-destructive">Something went wrong.</h1>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element with ID 'root' not found in the document.");
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);