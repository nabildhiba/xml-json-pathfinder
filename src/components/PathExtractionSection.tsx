
import React from 'react';
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface PathExtractionSectionProps {
  hasSelection: boolean;
  selectedPath: string;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
  onExtractPath: () => void;
  foundPaths: string[];
  onPathSelect: (path: string) => void;
}

const PathExtractionSection = ({
  hasSelection,
  selectedPath,
  searchQuery,
  onSearchQueryChange,
  onSearch,
  onExtractPath,
  foundPaths,
  onPathSelect
}: PathExtractionSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-md bg-gray-50">
        <h3 className="font-medium mb-2">Path Extraction</h3>
        <p className="text-sm text-gray-600 mb-4">
          Select text in the editor to extract its path. The extracted path will appear below.
        </p>
        {hasSelection && (
          <Button onClick={onExtractPath} className="w-full mb-2">
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
          onChange={(e) => onSearchQueryChange(e.target.value)}
        />
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={onSearch}
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
                onClick={() => onPathSelect(path)}
              >
                <code>{path}</code>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PathExtractionSection;
