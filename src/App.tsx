
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import XMLTester from "./pages/XMLTester";
import JSONTester from "./pages/JSONTester";
import Base64Converter from "./pages/Base64Converter";
import JsonVsXml from "./pages/JsonVsXml";
import WhatIsJson from "./pages/WhatIsJson";
import WhatIsXml from "./pages/WhatIsXml";
import JsonWebApisHistory from "./pages/JsonWebApisHistory";
import TopJsonTools2025 from "./pages/TopJsonTools2025";
import JsonApiSecurityBestPractices from "./pages/JsonApiSecurityBestPractices";
import JsonVulnerabilities from "./pages/JsonVulnerabilities";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
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
            <Route path="/what-is-json" element={<WhatIsJson />} />
            <Route path="/what-is-xml" element={<WhatIsXml />} />
            <Route path="/json-web-apis-history" element={<JsonWebApisHistory />} />
            <Route path="/top-json-tools-2025" element={<TopJsonTools2025 />} />
            <Route path="/json-api-security-best-practices" element={<JsonApiSecurityBestPractices />} />
            <Route path="/json-vulnerabilities" element={<JsonVulnerabilities />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE the CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
