
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import ToolsTabs from './tools/ToolsTabs';
import {
  formatXMLContent,
  formatJSONContent,
  encodeToBase64,
  decodeFromBase64,
  findJSONPaths,
  findXMLPaths
} from '@/utils/formatters';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const CodeEditor = () => {
  const [xmlContent, setXmlContent] = useState('');
  const [jsonContent, setJsonContent] = useState('');
  const [encodedContent, setEncodedContent] = useState('');
  const [selectedPath, setSelectedPath] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [foundPaths, setFoundPaths] = useState<string[]>([]);
  const [hasSelection, setHasSelection] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [currentEditor, setCurrentEditor] = useState<'xml' | 'json'>('xml');
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  const formatXML = () => {
    try {
      const formatted = formatXMLContent(xmlContent);
      setXmlContent(formatted);
      toast.success("XML formatted successfully in-place!");
    } catch (error) {
      toast.error("Invalid XML content!");
    }
  };

  const formatJSON = () => {
    try {
      const formatted = formatJSONContent(jsonContent);
      setJsonContent(formatted);
      toast.success("JSON formatted successfully in-place!");
    } catch (error) {
      toast.error("Invalid JSON content!");
    }
  };

  const handleEncode = (type: 'xml' | 'json') => {
    try {
      const content = type === 'xml' ? xmlContent : jsonContent;
      const encoded = encodeToBase64(content);
      setEncodedContent(encoded);
      setShowResult(true);
      toast.success("Content encoded to Base64!");
    } catch (error) {
      toast.error("Error encoding content!");
    }
  };

  const handleDecode = (type: 'xml' | 'json') => {
    try {
      const content = type === 'xml' ? xmlContent : jsonContent;
      const decoded = decodeFromBase64(content);
      setEncodedContent(decoded);
      setShowResult(true);
      toast.success("Content decoded from Base64!");
    } catch (error) {
      toast.error("Error decoding content: Invalid Base64 string");
    }
  };

  const handleTextSelect = (e: React.MouseEvent<HTMLTextAreaElement>, type: 'xml' | 'json') => {
    const textarea = e.currentTarget;
    const selected = textarea.value.substring(
      textarea.selectionStart,
      textarea.selectionEnd
    );

    if (selected) {
      setSelectedText(selected);
      setHasSelection(true);
      setCurrentEditor(type);
    } else {
      setHasSelection(false);
      setSelectedText('');
    }
  };

  const handleSearch = (type: 'xml' | 'json') => {
    try {
      let paths: string[] = [];
      if (type === 'json') {
        const parsed = JSON.parse(jsonContent);
        paths = findJSONPaths(parsed);
      } else {
        paths = findXMLPaths(xmlContent);
      }

      const searchLower = searchQuery.toLowerCase();
      const filtered = paths.filter(path =>
        path.toLowerCase().includes(searchLower)
      );

      setFoundPaths(filtered);

      if (filtered.length === 0) {
        toast.info("No matching paths found");
      }
    } catch (error) {
      toast.error("Error searching paths");
    }
  };

  const extractPath = () => {
    try {
      if (currentEditor === 'json') {
        const parsed = JSON.parse(jsonContent);
        const paths = findJSONPaths(parsed);
        const matchingPath = paths.find(path => path.endsWith(selectedText.trim()));
        if (matchingPath) {
          setSelectedPath(matchingPath);
          toast.success("Path extracted successfully!");
        } else {
          toast.error("Couldn't find path for selection");
        }
      } else {
        const paths = findXMLPaths(xmlContent);
        const matchingPath = paths.find(path => path.endsWith(selectedText.trim()));
        if (matchingPath) {
          setSelectedPath(matchingPath);
          toast.success("Path extracted successfully!");
        } else {
          toast.error("Couldn't find path for selection");
        }
      }
    } catch (error) {
      toast.error("Error extracting path");
    }
  };

  return (
    <div className="container py-4 animate-fade-in">
      {/* Ad Space */}
      <div className="w-full mb-8">
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-7479735239636417"
             data-ad-slot="auto"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>

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
        onSearchQueryChange={setSearchQuery}
        onSearch={handleSearch}
        onExtractPath={extractPath}
        onPathSelect={setSelectedPath}
        onFormatXML={formatXML}
        onFormatJSON={formatJSON}
        onEncode={handleEncode}
        onDecode={handleDecode}
        onXMLContentChange={setXmlContent}
        onJSONContentChange={setJsonContent}
        onTextSelect={handleTextSelect}
      />
    </div>
  );
};

export default CodeEditor;
