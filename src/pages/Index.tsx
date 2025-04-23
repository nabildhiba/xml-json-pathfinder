
import React from 'react';
import CodeEditor from "@/components/CodeEditor";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileJson, FileCode, RefreshCw, HelpCircle, ShieldQuestion, MessageCircleQuestion, BookOpen } from "lucide-react";

const Index = () => {
  return (
    <div className="container max-w-6xl mx-auto px-4">
      <div className="py-8">
        <h1 className="text-4xl font-bold text-center mb-4">
          Developer Tools for JSON, XML, and Base64 – All in One Place
        </h1>
        <p className="text-center text-gray-600 mb-8">
          JSONXMLKit offers fast and privacy-friendly online tools to format and analyze JSON and XML data, 
          extract values using path expressions, and encode/decode files with Base64. All tools run directly 
          in your browser. Built for developers, QA testers, analysts, and anyone working with structured data.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Available Tools</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <FileJson className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">JSON Formatter & Path Search</h3>
              </div>
              <p className="text-gray-600 mb-4">Pretty-print your JSON, extract values with JSONPath, and quickly navigate structures.</p>
              <Link to="/json-tester" className="text-primary hover:underline">Open Tool →</Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <FileCode className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">XML Formatter & XPath Tool</h3>
              </div>
              <p className="text-gray-600 mb-4">Beautify XML and extract values using XPath expressions.</p>
              <Link to="/xpath-tester" className="text-primary hover:underline">Open Tool →</Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <RefreshCw className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Base64 Encoder/Decoder</h3>
              </div>
              <p className="text-gray-600 mb-4">Upload any file or paste content to encode or decode with Base64, supporting images, text, PDFs, and more.</p>
              <Link to="/base64-encoder-decoder" className="text-primary hover:underline">Open Tool →</Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-12 mb-16">
        <h2 className="text-2xl font-semibold mb-6">FAQ</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="security">
            <AccordionTrigger>Are these tools safe?</AccordionTrigger>
            <AccordionContent>
              Yes. All tools run in your browser. Your data stays on your machine and is not uploaded to any server.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="mobile">
            <AccordionTrigger>Can I use these tools on mobile?</AccordionTrigger>
            <AccordionContent>
              Yes. JSONXMLKit is responsive and works well on phones and tablets.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="performance">
            <AccordionTrigger>Do the tools support large files?</AccordionTrigger>
            <AccordionContent>
              Yes, the tools are optimized for performance and can handle reasonably large JSON, XML, and file uploads.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="backstory">
            <AccordionTrigger>
              <div className="flex items-center">
                <BookOpen className="w-6 h-6 text-primary mr-3" />
                Why did you create JSONXMLKit?
              </div>
            </AccordionTrigger>
            <AccordionContent>
              I built JSONXMLKit to make quick data formatting and extraction easier — without uploading files or dealing with heavy tools. 
              <a 
                href="https://dev.to/makertoo/why-i-built-jsonxmlkit-free-jsonxml-tools-that-run-in-your-browser-53b7" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="ml-2 text-primary hover:underline"
              >
                Read the full backstory →
              </a>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Index;
