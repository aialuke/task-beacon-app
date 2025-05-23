
// src/App.tsx
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import { AuthProvider } from "./contexts/AuthContext";
import { BorderRadiusProvider } from "./contexts/BorderRadiusContext";
import { UIContextProvider } from "./contexts/UIContext";

const NotFound = lazy(() => import("./pages/NotFound"));
const TaskDetailsPage = lazy(() => import("./features/tasks/pages/TaskDetailsPage"));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: true,
    },
  },
});

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <UIContextProvider>
        <BorderRadiusProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/tasks/:id" element={<TaskDetailsPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </BorderRadiusProvider>
      </UIContextProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
