
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Base64Tab from '@/components/tools/Base64Tab';
import ToolsTabs from '@/components/tools/ToolsTabs';
import { encodeToBase64, decodeFromBase64, isBinaryContent } from '@/utils/formatters';
import { toast } from "sonner";
import HomeButton from '@/components/HomeButton';

const Base64Converter = () => {
  const [content, setContent] = useState('');
  const [encodedContent, setEncodedContent] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleEncode = () => {
    try {
      const encoded = encodeToBase64(content);
      setEncodedContent(encoded);
      setShowResult(true);
      toast.success("Content encoded successfully");
    } catch (error) {
      toast.error("Error encoding content");
      console.error("Encoding error:", error);
    }
  };

  const handleDecode = () => {
    if (!content || content.trim() === '') {
      toast.error("No content to decode");
      return;
    }

    try {
      // Check if this might be binary data
      const isBinary = isBinaryContent(content);
      
      if (isBinary) {
        // For binary data, we can just display the first part and indicate it's binary
        setEncodedContent("Binary content detected. Use 'Decode & Download' to save the file.");
        setShowResult(true);
        toast.success("Binary content detected. Use the download option to save the file.");
      } else {
        // For text data, proceed with normal decoding
        const decoded = decodeFromBase64(content);
        setEncodedContent(decoded);
        setShowResult(true);
        toast.success("Content decoded successfully");
      }
    } catch (error: any) {
      const errorMessage = error.message || "Invalid Base64 string";
      toast.error(`Error decoding content: ${errorMessage}`);
      console.error("Decoding error:", error);
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleTextSelect = () => {
    // Placeholder for text selection handler
  };

  // These are placeholder props needed by ToolsTabs
  const placeholderProps = {
    xmlContent: content,
    jsonContent: content,
    encodedContent: encodedContent,
    showResult: showResult,
    hasSelection: false,
    selectedPath: '',
    searchQuery: '',
    foundPaths: [],
    onSearchQueryChange: () => {},
    onSearch: () => {},
    onExtractPath: () => {},
    onPathSelect: () => {},
    onFormatXML: () => {},
    onFormatJSON: () => {},
    onEncode: handleEncode,
    onDecode: handleDecode,
    onXMLContentChange: handleContentChange,
    onJSONContentChange: () => {},
    onTextSelect: handleTextSelect,
    defaultTab: 'encodeDecode' as 'xml' | 'json' | 'encodeDecode'
  };

  return (
    <div className="container py-4 animate-fade-in relative">
      <HomeButton />
      <h1 className="text-3xl font-bold text-center mb-4">XML/JSON Path Finder & Base64 Converter - JSONXMLKit</h1>
      <p className="text-center text-gray-600 mb-8">
        Free online tool for code formatting, path lookup, and Base64 conversion
      </p>

      {/* Navigation tabs */}
      <ToolsTabs {...placeholderProps} />
    </div>
  );
};

export default Base64Converter;
