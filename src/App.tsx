import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Finance from "./pages/Finance";
import LearnerProfile from "./pages/LearnerProfile";
import Activities from "./pages/Activities";
import Awards from "./pages/Awards";
import Assignments from "./pages/Assignments";
import DataHub from "./pages/DataHub";
import Timetables from "./pages/Timetables";
import Classes from "./pages/Classes";
import StaffAdmin from "./pages/StaffAdmin";
import Disciplinary from "./pages/Disciplinary";
import ParentCommunication from "./pages/ParentCommunication";
import Reports from "./pages/Reports";
import Planning from "./pages/Planning";
import LessonArchive from "./pages/LessonArchive";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/learner-profile" element={<LearnerProfile />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/awards" element={<Awards />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/data-hub" element={<DataHub />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/lesson-archive" element={<LessonArchive />} />
            <Route path="/timetables" element={<Timetables />} />
            <Route path="/classes" element={<Classes />} />
          <Route path="/staff-admin" element={<StaffAdmin />} />
          <Route path="/disciplinary" element={<Disciplinary />} />
          <Route path="/parent-communication" element={<ParentCommunication />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
