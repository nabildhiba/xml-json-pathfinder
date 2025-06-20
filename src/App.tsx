
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import XMLTester from "./pages/XMLTester";
import JSONTester from "./pages/JSONTester";
import Base64Converter from "./pages/Base64Converter";
import JsonVsXml from "./pages/JsonVsXml";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/xpath-tester" element={<XMLTester />} />
          <Route path="/json-tester" element={<JSONTester />} />
          <Route path="/base64-encoder-decoder" element={<Base64Converter />} />
          <Route path="/json-vs-xml" element={<JsonVsXml />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
