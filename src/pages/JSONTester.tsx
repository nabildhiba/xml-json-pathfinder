
import React from 'react';
import CodeEditor from "@/components/CodeEditor";

const JSONTester = () => {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-4">XML/JSON Path Finder & Base64 Converter - JSONXMLKit</h1>
      <p className="text-center text-gray-600 mb-8">
        Free online tool for code formatting, path lookup, and Base64 conversion
      </p>
      <CodeEditor defaultTab="json" />
    </div>
  );
};

export default JSONTester;
