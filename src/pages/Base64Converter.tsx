
import React, { useState } from 'react';
import CodeEditor from "@/components/CodeEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Base64Tab from '@/components/tools/Base64Tab';
import { encodeToBase64, decodeFromBase64 } from '@/utils/formatters';

const Base64Converter = () => {
  const [content, setContent] = useState('');
  const [encodedContent, setEncodedContent] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleEncode = () => {
    try {
      const encoded = encodeToBase64(content);
      setEncodedContent(encoded);
      setShowResult(true);
    } catch (error) {
      console.error("Encoding error:", error);
    }
  };

  const handleDecode = () => {
    try {
      const decoded = decodeFromBase64(content);
      setEncodedContent(decoded);
      setShowResult(true);
    } catch (error) {
      console.error("Decoding error:", error);
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleTextSelect = () => {
    // Placeholder for text selection handler
  };

  return (
    <div className="container py-4 animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-4">Base64 Encoder/Decoder</h1>
      <p className="text-center text-gray-600 mb-8">
        Encode or decode text to/from Base64 format with option to process files directly
      </p>

      <Base64Tab
        content={content}
        encodedContent={encodedContent}
        showResult={showResult}
        onEncode={handleEncode}
        onDecode={handleDecode}
        onContentChange={handleContentChange}
        onTextSelect={handleTextSelect}
      />
    </div>
  );
};

export default Base64Converter;
