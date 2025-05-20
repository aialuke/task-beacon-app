
import { createRoot } from "react-dom/client";
import { StrictMode, lazy, Suspense } from "react";
import "./index.css";
import "./styles/critical.css"; // Import critical CSS first

// Lazy load the main App component
const App = lazy(() => import("./App.tsx"));

// Simplified ErrorBoundary component
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error("Application error:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold text-destructive">Something went wrong.</h1>
      </div>
    );
  }
};

// Loading state while App loads
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element with ID 'root' not found in the document.");
}

// Hydrate the app with optimized settings
createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </StrictMode>
);
