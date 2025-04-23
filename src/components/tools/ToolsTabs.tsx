
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCode, Code, RefreshCw } from "lucide-react";
import XMLTab from './XMLTab';
import JSONTab from './JSONTab';
import Base64Tab from './Base64Tab';
import { Link, useLocation } from 'react-router-dom';

interface ToolsTabsProps {
  xmlContent: string;
  jsonContent: string;
  encodedContent: string;
  showResult: boolean;
  hasSelection: boolean;
  selectedPath: string;
  searchQuery: string;
  foundPaths: string[];
  onSearchQueryChange: (query: string) => void;
  onSearch: (type: 'xml' | 'json') => void;
  onExtractPath: () => void;
  onPathSelect: (path: string) => void;
  onFormatXML: () => void;
  onFormatJSON: () => void;
  onEncode: (type: 'xml' | 'json') => void;
  onDecode: (type: 'xml' | 'json') => void;
  onXMLContentChange: (content: string) => void;
  onJSONContentChange: (content: string) => void;
  onTextSelect: (e: React.MouseEvent<HTMLTextAreaElement>, type: 'xml' | 'json') => void;
  defaultTab?: 'xml' | 'json' | 'encodeDecode';
}

const ToolsTabs: React.FC<ToolsTabsProps> = ({
  xmlContent,
  jsonContent,
  encodedContent,
  showResult,
  hasSelection,
  selectedPath,
  searchQuery,
  foundPaths,
  onSearchQueryChange,
  onSearch,
  onExtractPath,
  onPathSelect,
  onFormatXML,
  onFormatJSON,
  onEncode,
  onDecode,
  onXMLContentChange,
  onJSONContentChange,
  onTextSelect,
  defaultTab = 'xml',
}) => {
  const location = useLocation();
  
  const determineActiveTab = () => {
    if (location.pathname === '/xpath-tester') return 'xml';
    if (location.pathname === '/json-tester') return 'json';
    if (location.pathname === '/base64-encoder-decoder') return 'encodeDecode';
    return defaultTab;
  };
  
  return (
    <Tabs defaultValue={determineActiveTab()} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100 h-12"> {/* Added fixed height */}
        <TabsTrigger 
          value="xml" 
          className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white px-4" // Added padding
          asChild
        >
          <Link to="/xpath-tester" className="flex items-center gap-2 w-full justify-center">
            <FileCode className="w-4 h-4" />
            XML Beautifier & Path Finder
          </Link>
        </TabsTrigger>
        <TabsTrigger 
          value="json" 
          className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white px-4" // Added padding
          asChild
        >
          <Link to="/json-tester" className="flex items-center gap-2 w-full justify-center">
            <Code className="w-4 h-4" />
            JSON Beautifier & Path Finder
          </Link>
        </TabsTrigger>
        <TabsTrigger 
          value="encodeDecode" 
          className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white px-4" // Added padding
          asChild
        >
          <Link to="/base64-encoder-decoder" className="flex items-center gap-2 w-full justify-center">
            <RefreshCw className="w-4 h-4" />
            Base64 Converter
          </Link>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="xml">
        <XMLTab
          content={xmlContent}
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
          onFormat={onFormatXML}
          onContentChange={onXMLContentChange}
          onTextSelect={(e) => onTextSelect(e, 'xml')}
        />
      </TabsContent>

      <TabsContent value="json">
        <JSONTab
          content={jsonContent}
          encodedContent={encodedContent}
          showResult={showResult}
          hasSelection={hasSelection}
          selectedPath={selectedPath}
          searchQuery={searchQuery}
          foundPaths={foundPaths}
          onSearchQueryChange={onSearchQueryChange}
          onSearch={() => onSearch('json')}
          onExtractPath={onExtractPath}
          onPathSelect={onPathSelect}
          onFormat={onFormatJSON}
          onContentChange={onJSONContentChange}
          onTextSelect={(e) => onTextSelect(e, 'json')}
        />
      </TabsContent>

      <TabsContent value="encodeDecode">
        <Base64Tab
          content={xmlContent}
          encodedContent={encodedContent}
          showResult={true}
          onEncode={() => onEncode('xml')}
          onDecode={() => onDecode('xml')}
          onContentChange={onXMLContentChange}
          onTextSelect={(e) => onTextSelect(e, 'xml')}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ToolsTabs;
