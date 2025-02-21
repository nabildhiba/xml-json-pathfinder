import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileCode, Search, Code, AlignLeft, Copy, RefreshCw, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const CodeEditor = () => {
  const [xmlContent, setXmlContent] = useState('');
  const [xmlEncodedContent, setXmlEncodedContent] = useState('');
  const [jsonContent, setJsonContent] = useState('');
  const [jsonEncodedContent, setJsonEncodedContent] = useState('');
  const [selectedPath, setSelectedPath] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [foundPaths, setFoundPaths] = useState<string[]>([]);
  const [hasSelection, setHasSelection] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [currentEditor, setCurrentEditor] = useState<'xml' | 'json'>('xml');

  const formatXML = () => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
      const serializer = new XMLSerializer();
      const formatted = serializer.serializeToString(xmlDoc)
        .replace(/>/g, ">\n")
        .replace(/\n\s*\n/g, "\n")
        .trim();
      setXmlContent(formatted);
      toast.success("XML formatted successfully!");
    } catch (error) {
      toast.error("Invalid XML content!");
    }
  };

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(jsonContent);
      setJsonContent(JSON.stringify(parsed, null, 2));
      toast.success("JSON formatted successfully!");
    } catch (error) {
      toast.error("Invalid JSON content!");
    }
  };

  const findPaths = (obj: any, currentPath: string = '', paths: string[] = []): string[] => {
    if (typeof obj !== 'object' || obj === null) {
      paths.push(currentPath);
      return paths;
    }

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        findPaths(item, `${currentPath}[${index}]`, paths);
      });
    } else {
      Object.keys(obj).forEach(key => {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        findPaths(obj[key], newPath, paths);
      });
    }

    return paths;
  };

  const handleEncode = (type: 'xml' | 'json') => {
    try {
      const content = type === 'xml' ? xmlContent : jsonContent;
      const encoded = btoa(unescape(encodeURIComponent(content)));
      if (type === 'xml') {
        setXmlEncodedContent(encoded);
      } else {
        setJsonEncodedContent(encoded);
      }
      toast.success("Content encoded to Base64!");
    } catch (error) {
      toast.error("Error encoding content!");
    }
  };

  const handleDecode = (type: 'xml' | 'json') => {
    try {
      const content = type === 'xml' ? xmlContent : jsonContent;
      const decoded = decodeURIComponent(escape(atob(content)));
      if (type === 'xml') {
        setXmlEncodedContent(decoded);
      } else {
        setJsonEncodedContent(decoded);
      }
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

  const extractPath = () => {
    try {
      if (currentEditor === 'json') {
        const parsed = JSON.parse(jsonContent);
        const paths = findPaths(parsed);
        const matchingPath = paths.find(path => 
          JSON.stringify(eval(`parsed.${path}`)) === selectedText.trim()
        );
        if (matchingPath) {
          setSelectedPath(matchingPath);
          toast.success("Path extracted successfully!");
        } else {
          toast.error("Couldn't find path for selection");
        }
      } else {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
        const xpath = `//*[contains(text(),'${selectedText.trim()}')]`;
        const result = xmlDoc.evaluate(xpath, xmlDoc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        if (result.singleNodeValue) {
          let path = '';
          let node = result.singleNodeValue as Element;
          while (node && node !== xmlDoc.documentElement) {
            path = '/' + node.nodeName + path;
            node = node.parentElement!;
          }
          path = '/' + xmlDoc.documentElement.nodeName + path;
          setSelectedPath(path);
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
      <div className="w-full h-24 bg-gray-100 rounded-lg mb-8 flex items-center justify-center">
        <p className="text-gray-500">Advertisement Space</p>
      </div>

      <h1 className="text-3xl font-bold text-center mb-8">Code Editor & Formatter</h1>
      
      <Tabs defaultValue="xml" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="xml" className="flex items-center gap-2">
            <FileCode className="w-4 h-4" />
            XML Editor
          </TabsTrigger>
          <TabsTrigger value="json" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            JSON Editor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="xml" className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button onClick={formatXML} className="flex items-center gap-2">
              <AlignLeft className="w-4 h-4" />
              Format XML
            </Button>
            <Button onClick={() => handleEncode('xml')} variant="outline" className="flex items-center gap-2">
              <Copy className="w-4 h-4" />
              Encode Base64
            </Button>
            <Button onClick={() => handleDecode('xml')} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Decode Base64
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Original Content</label>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
                <Textarea
                  value={xmlContent}
                  onChange={(e) => setXmlContent(e.target.value)}
                  onMouseUp={(e) => handleTextSelect(e, 'xml')}
                  className="font-mono min-h-[400px] bg-editor-bg"
                  placeholder="Paste your XML here..."
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Encoded/Decoded Result</label>
                  <ArrowLeft className="w-4 h-4 text-gray-400" />
                </div>
                <Textarea
                  value={xmlEncodedContent}
                  readOnly
                  className="font-mono min-h-[400px] bg-editor-bg"
                  placeholder="Encoded/decoded content will appear here..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-gray-50">
                <h3 className="font-medium mb-2">Path Extraction</h3>
                <p className="text-sm text-gray-600 mb-4">Select text in the editor to extract its path. The extracted path will appear below.</p>
                {hasSelection && (
                  <Button 
                    onClick={extractPath}
                    className="w-full mb-2"
                  >
                    Extract Path for Selection
                  </Button>
                )}
                <div className="p-3 border rounded bg-white">
                  <code className="text-sm break-all">{selectedPath || 'No path selected'}</code>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search paths..."
                  className="flex-1 px-3 py-2 border rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => handleSearch('xml')}
                >
                  <Search className="w-4 h-4" />
                  Search
                </Button>
              </div>

              {foundPaths.length > 0 && (
                <div className="p-4 border rounded-md bg-editor-bg">
                  <h3 className="font-medium mb-2">Search Results:</h3>
                  <div className="max-h-48 overflow-y-auto">
                    {foundPaths.map((path, index) => (
                      <div 
                        key={index}
                        className="text-sm py-1 cursor-pointer hover:text-blue-600"
                        onClick={() => setSelectedPath(path)}
                      >
                        <code>{path}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="json" className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button onClick={formatJSON} className="flex items-center gap-2">
              <AlignLeft className="w-4 h-4" />
              Format JSON
            </Button>
            <Button onClick={() => handleEncode('json')} variant="outline" className="flex items-center gap-2">
              <Copy className="w-4 h-4" />
              Encode Base64
            </Button>
            <Button onClick={() => handleDecode('json')} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Decode Base64
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Original Content</label>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
                <Textarea
                  value={jsonContent}
                  onChange={(e) => setJsonContent(e.target.value)}
                  onMouseUp={(e) => handleTextSelect(e, 'json')}
                  className="font-mono min-h-[400px] bg-editor-bg"
                  placeholder="Paste your JSON here..."
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Encoded/Decoded Result</label>
                  <ArrowLeft className="w-4 h-4 text-gray-400" />
                </div>
                <Textarea
                  value={jsonEncodedContent}
                  readOnly
                  className="font-mono min-h-[400px] bg-editor-bg"
                  placeholder="Encoded/decoded content will appear here..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-gray-50">
                <h3 className="font-medium mb-2">Path Extraction</h3>
                <p className="text-sm text-gray-600 mb-4">Select text in the editor to extract its path. The extracted path will appear below.</p>
                {hasSelection && (
                  <Button 
                    onClick={extractPath}
                    className="w-full mb-2"
                  >
                    Extract Path for Selection
                  </Button>
                )}
                <div className="p-3 border rounded bg-white">
                  <code className="text-sm break-all">{selectedPath || 'No path selected'}</code>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search paths..."
                  className="flex-1 px-3 py-2 border rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => handleSearch('json')}
                >
                  <Search className="w-4 h-4" />
                  Search
                </Button>
              </div>

              {foundPaths.length > 0 && (
                <div className="p-4 border rounded-md bg-editor-bg">
                  <h3 className="font-medium mb-2">Search Results:</h3>
                  <div className="max-h-48 overflow-y-auto">
                    {foundPaths.map((path, index) => (
                      <div 
                        key={index}
                        className="text-sm py-1 cursor-pointer hover:text-blue-600"
                        onClick={() => setSelectedPath(path)}
                      >
                        <code>{path}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CodeEditor;
