
import React, { useState } from 'react';
import ToolsTabs from '@/components/tools/ToolsTabs';
import { HelpCircle, ShieldQuestion, MessageCircleQuestion } from 'lucide-react';

const XMLTester = () => {
  const [xmlContent, setXMLContent] = useState('');
  const [jsonContent, setJSONContent] = useState('');
  const [encodedContent, setEncodedContent] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);
  const [selectedPath, setSelectedPath] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [foundPaths, setFoundPaths] = useState<string[]>([]);

  const onSearchQueryChange = (query: string) => {
    setSearchQuery(query);
  };

  const onSearch = (type: 'xml' | 'json') => {
    // Placeholder for search logic
    console.log(`Search ${type} for: ${searchQuery}`);
    setFoundPaths(['/path/to/element1', '/path/to/element2']); // Example paths
  };

  const onExtractPath = () => {
    // Placeholder for extract path logic
    console.log('Extract path');
  };

  const onPathSelect = (path: string) => {
    setSelectedPath(path);
  };

  const onFormatXML = () => {
    // Placeholder for format XML logic
    console.log('Format XML');
  };

  const onFormatJSON = () => {
    // Placeholder for format JSON logic
    console.log('Format JSON');
  };

  const onEncode = (type: 'xml' | 'json') => {
    // Placeholder for encode logic
    console.log(`Encode ${type}`);
  };

  const onDecode = (type: 'xml' | 'json') => {
    // Placeholder for decode logic
    console.log(`Decode ${type}`);
  };

  const onXMLContentChange = (content: string) => {
    setXMLContent(content);
  };

  const onJSONContentChange = (content: string) => {
    setJSONContent(content);
  };

  const onTextSelect = (e: React.MouseEvent<HTMLTextAreaElement>, type: 'xml' | 'json') => {
    // Placeholder for text selection logic
    console.log(`Text selected in ${type}`);
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-4">XML/JSON Path Finder & Base64 Converter - JSONXMLKit</h1>
      <p className="text-center text-gray-600 mb-8">
        Free online tool for code formatting, path lookup, and Base64 conversion
      </p>

      <ToolsTabs 
        xmlContent={xmlContent}
        jsonContent={jsonContent}
        encodedContent={encodedContent}
        showResult={showResult}
        hasSelection={hasSelection}
        selectedPath={selectedPath}
        searchQuery={searchQuery}
        foundPaths={foundPaths}
        onSearchQueryChange={onSearchQueryChange}
        onSearch={() => onSearch('xml')}
        onExtractPath={onExtractPath}
        onPathSelect={onPathSelect}
        onFormatXML={onFormatXML}
        onFormatJSON={onFormatJSON}
        onEncode={() => onEncode('xml')}
        onDecode={() => onDecode('xml')}
        onXMLContentChange={onXMLContentChange}
        onJSONContentChange={onJSONContentChange}
        onTextSelect={(e) => onTextSelect(e, 'xml')}
        defaultTab="xml"
      />

      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <HelpCircle className="w-6 h-6 text-primary mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Are these tools secure?</h3>
            </div>
            <p className="text-gray-600">Yes. All processing happens directly in your browser. Your data never leaves your device.</p>
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <ShieldQuestion className="w-6 h-6 text-primary mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Do the tools support large files?</h3>
            </div>
            <p className="text-gray-600">Yes, the tools are optimized for performance and can handle reasonably large XML files.</p>
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <MessageCircleQuestion className="w-6 h-6 text-primary mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Can I use these tools on mobile?</h3>
            </div>
            <p className="text-gray-600">Absolutely! JSONXMLKit is fully responsive and works seamlessly on phones and tablets.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XMLTester;
