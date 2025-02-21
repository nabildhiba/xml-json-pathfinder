
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileCode, Search, Code, AlignLeft, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const CodeEditor = () => {
  const [xmlContent, setXmlContent] = useState('');
  const [jsonContent, setJsonContent] = useState('');
  const [selectedPath, setSelectedPath] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [foundPaths, setFoundPaths] = useState<string[]>([]);

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

  const encodeBase64 = (content: string) => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(content)));
      toast.success("Content encoded to Base64!");
      return encoded;
    } catch (error) {
      toast.error("Error encoding content!");
      return content;
    }
  };

  const decodeBase64 = (content: string) => {
    try {
      const decoded = decodeURIComponent(escape(atob(content)));
      toast.success("Content decoded from Base64!");
      return decoded;
    } catch (error) {
      toast.error("Error decoding content: Invalid Base64 string");
      return content;
    }
  };

  const handleEncode = (type: 'xml' | 'json') => {
    if (type === 'xml') {
      setXmlContent(encodeBase64(xmlContent));
    } else {
      setJsonContent(encodeBase64(jsonContent));
    }
  };

  const handleDecode = (type: 'xml' | 'json') => {
    if (type === 'xml') {
      setXmlContent(decodeBase64(xmlContent));
    } else {
      setJsonContent(decodeBase64(jsonContent));
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

  const handleSearch = (type: 'xml' | 'json') => {
    try {
      if (type === 'json') {
        const parsed = JSON.parse(jsonContent);
        const paths = findPaths(parsed);
        const filtered = paths.filter(path => 
          path.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFoundPaths(filtered);
        if (filtered.length === 0) {
          toast.info("No matching paths found");
        }
      } else {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
        const paths = [];
        const walkDOM = (node: Node, path: string = '') => {
          if (node.nodeType === 1) { // Element node
            const currentPath = path ? `${path}/${node.nodeName}` : node.nodeName;
            paths.push(currentPath);
            for (const child of node.childNodes) {
              walkDOM(child, currentPath);
            }
          }
        };
        walkDOM(xmlDoc.documentElement);
        const filtered = paths.filter(path => 
          path.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFoundPaths(filtered);
        if (filtered.length === 0) {
          toast.info("No matching paths found");
        }
      }
    } catch (error) {
      toast.error("Error searching paths");
    }
  };

  const handleTextSelect = (e: React.MouseEvent<HTMLTextAreaElement>, type: 'xml' | 'json') => {
    const textarea = e.currentTarget;
    const selectedText = textarea.value.substring(
      textarea.selectionStart,
      textarea.selectionEnd
    );

    if (selectedText) {
      try {
        if (type === 'json') {
          const parsed = JSON.parse(jsonContent);
          const paths = findPaths(parsed);
          const matchingPath = paths.find(path => 
            JSON.stringify(eval(`parsed.${path}`)) === selectedText.trim()
          );
          if (matchingPath) {
            setSelectedPath(matchingPath);
            toast.success("Path found for selection!");
          }
        } else {
          // For XML, we'll try to find the closest element path
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
            toast.success("Path found for selection!");
          }
        }
      } catch (error) {
        console.error('Error finding path:', error);
      }
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
            <div className="space-y-2">
              <label className="text-sm font-medium">XML Content</label>
              <Textarea
                value={xmlContent}
                onChange={(e) => setXmlContent(e.target.value)}
                onMouseUp={(e) => handleTextSelect(e, 'xml')}
                className="font-mono min-h-[400px] bg-editor-bg"
                placeholder="Paste your XML here..."
              />
            </div>
            <div className="space-y-4">
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
              <div className="p-4 border rounded-md bg-editor-bg">
                <h3 className="font-medium mb-2">Selected Path:</h3>
                <code className="text-sm break-all">{selectedPath || 'No path selected'}</code>
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
            <div className="space-y-2">
              <label className="text-sm font-medium">JSON Content</label>
              <Textarea
                value={jsonContent}
                onChange={(e) => setJsonContent(e.target.value)}
                onMouseUp={(e) => handleTextSelect(e, 'json')}
                className="font-mono min-h-[400px] bg-editor-bg"
                placeholder="Paste your JSON here..."
              />
            </div>
            <div className="space-y-4">
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
              <div className="p-4 border rounded-md bg-editor-bg">
                <h3 className="font-medium mb-2">Selected Path:</h3>
                <code className="text-sm break-all">{selectedPath || 'No path selected'}</code>
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
