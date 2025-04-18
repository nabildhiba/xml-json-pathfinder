
import React from 'react';
import CodeEditor from "@/components/CodeEditor";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Index = () => {
  return (
    <div className="container max-w-6xl mx-auto px-4">
      <div className="py-8">
        <h1 className="text-4xl font-bold text-center mb-4">
          Free Online JSON to XML Converter
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Use our free online tool to convert JSON data into clean, well-structured XML. 
          Works directly in your browser, no upload required. Ideal for developers and analysts.
        </p>
      </div>

      <CodeEditor />

      <div className="mt-12 mb-16">
        <h2 className="text-2xl font-semibold mb-6">FAQ</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="security">
            <AccordionTrigger>Is this JSON to XML converter secure?</AccordionTrigger>
            <AccordionContent>
              Yes. All processing happens in your browser. Your data never leaves your device.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="usage">
            <AccordionTrigger>How do I use the JSON to XML converter?</AccordionTrigger>
            <AccordionContent>
              Simply paste your JSON data into the input field, click the convert button, and your XML output will be generated instantly. You can then copy or download the result.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="free">
            <AccordionTrigger>Is this tool really free?</AccordionTrigger>
            <AccordionContent>
              Yes, our JSON to XML converter is completely free to use. There are no hidden fees or usage limits.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Index;
