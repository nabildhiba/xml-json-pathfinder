
import React, { useRef } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Upload, Download } from "lucide-react";
import { downloadFile } from '@/utils/formatters';

interface EditorSectionProps {
  originalContent: string;
  encodedContent: string;
  showResult: boolean;  // New prop to control result section visibility
  onContentChange: (content: string) => void;
  onTextSelect: (e: React.MouseEvent<HTMLTextAreaElement>) => void;
}

const EditorSection = ({
  originalContent,
  encodedContent,
  showResult,
  onContentChange,
  onTextSelect
}: EditorSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onContentChange(content);
      };
      reader.readAsText(file);
    }
  };

  const handleDownloadResult = () => {
    downloadFile(encodedContent, 'result.txt');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Original Content (Format, Encode, or Decode this content)</label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept=".txt,.xml,.json"
            />
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
        <Textarea
          value={originalContent}
          onChange={(e) => onContentChange(e.target.value)}
          onMouseUp={onTextSelect}
          className="font-mono min-h-[400px] bg-editor-bg"
          placeholder="Paste or upload your content here. Formatting will occur in this area."
        />
      </div>
      {showResult && (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Result (Encoded/Decoded content appears here)</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadResult}
                className="flex items-center gap-2"
                disabled={!encodedContent}
              >
                <Download className="w-4 h-4" />
                Download Result
              </Button>
              <ArrowLeft className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          <Textarea
            value={encodedContent}
            readOnly
            className="font-mono min-h-[400px] bg-editor-bg"
            placeholder="After clicking Encode or Decode, the result will appear here..."
          />
        </div>
      )}
    </div>
  );
};

export default EditorSection;
