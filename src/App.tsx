import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import { AdminLayout } from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import SyllabusManagement from "./pages/admin/SyllabusManagement";
import QRCodeGenerator from "./pages/admin/QRCodeGenerator";
import FacultyManagement from "./pages/admin/FacultyManagement";
import ContentManagement from "./pages/admin/ContentManagement";
import SyllabusView from "./pages/SyllabusView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="syllabus" element={<SyllabusManagement />} />
              <Route path="qr-generator" element={<QRCodeGenerator />} />
              <Route path="faculties" element={<FacultyManagement />} />
              <Route path="content" element={<ContentManagement />} />
            </Route>
            <Route path="/syllabus/:slugOrId" element={<SyllabusView />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
