
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
  pathResult?: { values: any[]; path: string } | null;
}

const PathExtractionSection = ({
  hasSelection,
  selectedPath,
  searchQuery,
  onSearchQueryChange,
  onSearch,
  onExtractPath,
  foundPaths,
  onPathSelect,
  pathResult
}: PathExtractionSectionProps) => {
  console.log("PathExtractionSection render - hasSelection:", hasSelection, "selectedPath:", selectedPath);
  
  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-md bg-gray-50">
        <h3 className="font-medium mb-2">Path Extraction</h3>
        <p className="text-sm text-gray-600 mb-4">
          Select text in the editor to extract its path, or use modern syntax like <code>shop.products[].variants[].id</code> to get all matching values.
        </p>
        {hasSelection && (
          <Button onClick={onExtractPath} className="w-full mb-2">
            Extract Path for Selection
          </Button>
        )}
        <div className="p-3 border rounded bg-white">
          <code className="text-sm break-all">{selectedPath || 'No path selected'}</code>
        </div>
        
        {pathResult && pathResult.values && pathResult.values.length > 0 && (
          <div className="mt-3 p-3 border rounded bg-blue-50">
            <h4 className="font-medium text-sm mb-2">Path Results:</h4>
            <div className="text-sm">
              <code className="text-blue-800">
                [{pathResult.values.map(v => typeof v === 'string' ? `"${v}"` : v).join(', ')}]
              </code>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search paths or use shop.products[].name syntax..."
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
