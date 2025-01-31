import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileCode, Search, Code, AlignLeft, Copy } from "lucide-react";
import { toast } from "sonner";

const CodeEditor = () => {
  const [xmlContent, setXmlContent] = useState('');
  const [jsonContent, setJsonContent] = useState('');
  const [selectedPath, setSelectedPath] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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
      return btoa(content);
    } catch (error) {
      toast.error("Error encoding content!");
      return content;
    }
  };

  const decodeBase64 = (content: string) => {
    try {
      return atob(content);
    } catch (error) {
      toast.error("Error decoding content!");
      return content;
    }
  };

  const handleEncode = (type: 'xml' | 'json') => {
    if (type === 'xml') {
      setXmlContent(encodeBase64(xmlContent));
    } else {
      setJsonContent(encodeBase64(jsonContent));
    }
    toast.success("Content encoded to Base64!");
  };

  const handleDecode = (type: 'xml' | 'json') => {
    if (type === 'xml') {
      setXmlContent(decodeBase64(xmlContent));
    } else {
      setJsonContent(decodeBase64(jsonContent));
    }
    toast.success("Content decoded from Base64!");
  };

  return (
    <div className="container py-8 animate-fade-in">
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
              <Copy className="w-4 h-4" />
              Decode Base64
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">XML Content</label>
              <Textarea
                value={xmlContent}
                onChange={(e) => setXmlContent(e.target.value)}
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
                <Button variant="outline" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search
                </Button>
              </div>
              <div className="p-4 border rounded-md bg-editor-bg">
                <h3 className="font-medium mb-2">Selected Path:</h3>
                <code className="text-sm">{selectedPath || 'No path selected'}</code>
              </div>
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
              <Copy className="w-4 h-4" />
              Decode Base64
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">JSON Content</label>
              <Textarea
                value={jsonContent}
                onChange={(e) => setJsonContent(e.target.value)}
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
                <Button variant="outline" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search
                </Button>
              </div>
              <div className="p-4 border rounded-md bg-editor-bg">
                <h3 className="font-medium mb-2">Selected Path:</h3>
                <code className="text-sm">{selectedPath || 'No path selected'}</code>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CodeEditor;