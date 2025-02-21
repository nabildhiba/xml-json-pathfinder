
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface EditorSectionProps {
  originalContent: string;
  encodedContent: string;
  onContentChange: (content: string) => void;
  onTextSelect: (e: React.MouseEvent<HTMLTextAreaElement>) => void;
}

const EditorSection = ({
  originalContent,
  encodedContent,
  onContentChange,
  onTextSelect
}: EditorSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Original Content</label>
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </div>
        <Textarea
          value={originalContent}
          onChange={(e) => onContentChange(e.target.value)}
          onMouseUp={onTextSelect}
          className="font-mono min-h-[400px] bg-editor-bg"
          placeholder="Paste your content here..."
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Encoded/Decoded Result</label>
          <ArrowLeft className="w-4 h-4 text-gray-400" />
        </div>
        <Textarea
          value={encodedContent}
          readOnly
          className="font-mono min-h-[400px] bg-editor-bg"
          placeholder="Encoded/decoded content will appear here..."
        />
      </div>
    </div>
  );
};

export default EditorSection;
