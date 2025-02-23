
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlignLeft } from "lucide-react";
import EditorSection from '../EditorSection';
import PathExtractionSection from '../PathExtractionSection';

interface XMLTabProps {
  content: string;
  encodedContent: string;
  showResult: boolean;
  hasSelection: boolean;
  selectedPath: string;
  searchQuery: string;
  foundPaths: string[];
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
  onExtractPath: () => void;
  onPathSelect: (path: string) => void;
  onFormat: () => void;
  onContentChange: (content: string) => void;
  onTextSelect: (e: React.MouseEvent<HTMLTextAreaElement>) => void;
}

const XMLTab: React.FC<XMLTabProps> = ({
  content,
  encodedContent,
  showResult,
  hasSelection,
  selectedPath,
  searchQuery,
  foundPaths,
  onSearchQueryChange,
  onSearch,
  onExtractPath,
  onPathSelect,
  onFormat,
  onContentChange,
  onTextSelect,
}) => {
  return (
    <div className="space-y-4">
      <PathExtractionSection
        hasSelection={hasSelection}
        selectedPath={selectedPath}
        searchQuery={searchQuery}
        onSearchQueryChange={onSearchQueryChange}
        onSearch={onSearch}
        onExtractPath={onExtractPath}
        foundPaths={foundPaths}
        onPathSelect={onPathSelect}
      />

      <div className="flex gap-2 mb-4">
        <Button onClick={onFormat} title="Format XML content directly in the editor" className="flex items-center gap-2">
          <AlignLeft className="w-4 h-4" />
          Format & Validate XML
        </Button>
      </div>

      <EditorSection
        originalContent={content}
        encodedContent={encodedContent}
        showResult={showResult}
        onContentChange={onContentChange}
        onTextSelect={onTextSelect}
      />
    </div>
  );
};

export default XMLTab;
