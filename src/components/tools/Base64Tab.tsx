
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, Upload, Download } from "lucide-react";
import EditorSection from '../EditorSection';
import { encodeToBase64, decodeFromBase64, downloadFile } from '@/utils/formatters';
import { toast } from "sonner";

interface Base64TabProps {
  content: string;
  encodedContent: string;
  showResult: boolean;
  onEncode: () => void;
  onDecode: () => void;
  onContentChange: (content: string) => void;
  onTextSelect: (e: React.MouseEvent<HTMLTextAreaElement>) => void;
}

const Base64Tab: React.FC<Base64TabProps> = ({
  content,
  encodedContent,
  showResult,
  onEncode,
  onDecode,
  onContentChange,
  onTextSelect,
}) => {
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onContentChange(content);
        toast.success(`File "${file.name}" uploaded successfully`);
      };
      reader.readAsText(file);
    }
  };

  const handleDirectEncode = () => {
    try {
      const encoded = encodeToBase64(content);
      downloadFile(encoded, `${fileName || 'encoded'}_base64.txt`);
      toast.success("Content encoded and downloaded");
    } catch (error) {
      toast.error("Error encoding content");
    }
  };

  const handleDirectDecode = () => {
    try {
      const decoded = decodeFromBase64(content);
      downloadFile(decoded, `${fileName || 'decoded'}_result.txt`);
      toast.success("Content decoded and downloaded");
    } catch (error) {
      toast.error("Error decoding content: Invalid Base64 string");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="p-4 border rounded-md bg-gray-50">
          <h3 className="text-lg font-medium mb-2">Direct File Processing</h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload a file and encode/decode it directly without showing its contents. Results will be automatically downloaded.
          </p>
          
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {fileName ? 'Change File' : 'Upload File'}
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            {fileName && (
              <span className="text-sm text-gray-600">
                Selected: {fileName}
              </span>
            )}
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button 
              onClick={handleDirectEncode} 
              variant="default"
              disabled={!content}
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Encode & Download
            </Button>
            <Button 
              onClick={handleDirectDecode}
              variant="default"
              disabled={!content} 
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Decode & Download
            </Button>
          </div>
        </div>
      
        <div className="p-4 border rounded-md bg-gray-50">
          <h3 className="text-lg font-medium mb-2">Manual Text Processing</h3>
          <p className="text-sm text-gray-600 mb-4">
            Enter or paste content to encode/decode and view the result in the textarea below.
          </p>
          <div className="flex gap-2">
            <Button onClick={onEncode} variant="outline" className="flex items-center gap-2">
              <Copy className="w-4 h-4" />
              Encode Base64
            </Button>
            <Button onClick={onDecode} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Decode Base64
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        <EditorSection
          originalContent={content}
          encodedContent={encodedContent}
          showResult={showResult}
          onContentChange={onContentChange}
          onTextSelect={onTextSelect}
        />
      </div>
    </div>
  );
};

export default Base64Tab;
