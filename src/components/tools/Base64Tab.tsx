
import React from 'react';
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw } from "lucide-react";
import EditorSection from '../EditorSection';

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
  return (
    <div className="space-y-4">
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
