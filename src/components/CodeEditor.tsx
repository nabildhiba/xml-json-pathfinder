
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileCode, Code, AlignLeft, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import EditorSection from './EditorSection';
import PathExtractionSection from './PathExtractionSection';
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

  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const encodeAndDownload = (content, filename) => {
    const encoded = encodeToBase64(content);
    downloadFile(encoded, `${filename}.base64`);
  };

  const decodeAndDownload = (content, filename) => {
    try {
      const decoded = decodeFromBase64(content);
      downloadFile(decoded, filename);
    } catch (error) {
      toast.error('Invalid Base64 string for decoding.');
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
        path.toLowerCase().includes(searchLower) ||
        (type === 'json' && getValue(path, jsonContent)?.toString().toLowerCase().includes(searchLower)) ||
        (type === 'xml' && getXMLValue(path, xmlContent)?.toLowerCase().includes(searchLower))
      );

      setFoundPaths(filtered);

      if (filtered.length === 0) {
        toast.info("No matching paths found");
      }
    } catch (error) {
      toast.error("Error searching paths");
    }
  };

  const getValue = (path: string, jsonStr: string) => {
    try {
      const obj = JSON.parse(jsonStr);
      return path.split('.').reduce((acc: any, curr) => {
        if (curr.includes('[')) {
          const [arrayName, indexStr] = curr.split('[');
          const index = parseInt(indexStr.replace(']', ''));
          return acc[arrayName][index];
        }
        return acc[curr];
      }, obj);
    } catch {
      return null;
    }
  };

  const getXMLValue = (path: string, xmlStr: string) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlStr, "text/xml");
      if (path.endsWith('text()')) {
        const element = xmlDoc.evaluate(
          path.slice(0, -7), // Remove text()
          xmlDoc,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        return element?.textContent || '';
      } else if (path.includes('@')) {
        const attr = xmlDoc.evaluate(
          path,
          xmlDoc,
          null,
          XPathResult.STRING_TYPE,
          null
        );
        return attr.stringValue;
      }
      return '';
    } catch {
      return '';
    }
  };

  const extractPath = () => {
    try {
      if (currentEditor === 'json') {
        const parsed = JSON.parse(jsonContent);
        const paths = findJSONPaths(parsed);
        const matchingPath = paths.find(path => {
          const value = getValue(path, jsonContent);
          return value?.toString() === selectedText.trim() || path.endsWith(selectedText.trim());
        });
        if (matchingPath) {
          setSelectedPath(matchingPath);
          toast.success("Path extracted successfully!");
        } else {
          toast.error("Couldn't find path for selection");
        }
      } else {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
        const paths = findXMLPaths(xmlContent);
        const matchingPath = paths.find(path => {
          const value = getXMLValue(path, xmlContent);
          return value === selectedText.trim() || path.endsWith(selectedText.trim());
        });
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

      <h1 className="text-3xl font-bold text-center mb-4">XML/JSON Format Converter & Path Finder</h1>
      <p className="text-center text-gray-600 mb-8">
        Free online tool for code formatting, path lookup, and Base64 conversion
      </p>

      <Tabs defaultValue="xml" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100">
          <TabsTrigger 
            value="xml" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <FileCode className="w-4 h-4" />
            XML Beautifier & Path Finder
          </TabsTrigger>
          <TabsTrigger 
            value="json" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <Code className="w-4 h-4" />
            JSON Beautifier & Path Finder
          </TabsTrigger>
          <TabsTrigger 
            value="encodeDecode" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <RefreshCw className="w-4 h-4" />
            Base64 Converter
          </TabsTrigger>
        </TabsList>

        <TabsContent value="xml" className="space-y-4">
          <PathExtractionSection
            hasSelection={hasSelection}
            selectedPath={selectedPath}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSearch={() => handleSearch('xml')}
            onExtractPath={extractPath}
            foundPaths={foundPaths}
            onPathSelect={setSelectedPath}
          />

          <div className="flex gap-2 mb-4">
            <Button onClick={formatXML} title="Format XML content directly in the editor" className="flex items-center gap-2">
              <AlignLeft className="w-4 h-4" />
              Format & Validate XML
            </Button>
          </div>

          <EditorSection
            originalContent={xmlContent}
            encodedContent={encodedContent}
            showResult={showResult}
            onContentChange={setXmlContent}
            onTextSelect={(e) => handleTextSelect(e, 'xml')}
          />
        </TabsContent>

        <TabsContent value="json" className="space-y-4">
          <PathExtractionSection
            hasSelection={hasSelection}
            selectedPath={selectedPath}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSearch={() => handleSearch('json')}
            onExtractPath={extractPath}
            foundPaths={foundPaths}
            onPathSelect={setSelectedPath}
          />

          <div className="flex gap-2 mb-4">
            <Button onClick={formatJSON} title="Format JSON content directly in the editor" className="flex items-center gap-2">
              <AlignLeft className="w-4 h-4" />
              Format JSON
            </Button>
          </div>

          <EditorSection
            originalContent={jsonContent}
            encodedContent={encodedContent}
            showResult={showResult}
            onContentChange={setJsonContent}
            onTextSelect={(e) => handleTextSelect(e, 'json')}
          />
        </TabsContent>

        <TabsContent value="encodeDecode" className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => handleEncode('xml')} variant="outline" className="flex items-center gap-2">
              <Copy className="w-4 h-4" />
              Encode Base64
            </Button>
            <Button onClick={() => handleDecode('xml')} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Decode Base64
            </Button>
          </div>
          <div className="flex flex-col space-y-4">
            <EditorSection
              originalContent={xmlContent}
              encodedContent={encodedContent}
              showResult={showResult}
              onContentChange={setXmlContent}
              onTextSelect={(e) => handleTextSelect(e, 'xml')}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CodeEditor;
