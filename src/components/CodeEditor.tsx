import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import ToolsTabs from './tools/ToolsTabs';
import {
  formatXMLContent,
  formatJSONContent,
  encodeToBase64,
  decodeFromBase64,
  findJSONPaths,
  findXMLPaths,
  evaluateJSONPath,
  isModernPathSyntax
} from '@/utils/formatters';
import { findPathForSelectedText } from '@/utils/pathExtraction';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface CodeEditorProps {
  defaultTab?: 'xml' | 'json' | 'encodeDecode';
  hideHeader?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ defaultTab = 'xml', hideHeader = false }) => {
  const [xmlContent, setXmlContent] = useState('');
  const [jsonContent, setJsonContent] = useState('');
  const [encodedContent, setEncodedContent] = useState('');
  const [selectedPath, setSelectedPath] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [foundPaths, setFoundPaths] = useState<string[]>([]);
  const [hasSelection, setHasSelection] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [currentEditor, setCurrentEditor] = useState<'xml' | 'json'>('xml');
  const [showResult, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState<'xml' | 'json' | 'encodeDecode'>(defaultTab);
  const [pathResult, setPathResult] = useState<{ values: any[]; path: string } | null>(null);

  useEffect(() => {
    try {
      const pushAd = () => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      };
      pushAd();
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  const formatXML = () => {
    if (!xmlContent.trim()) {
      toast.error("No XML content to format!");
      return;
    }
    
    try {
      console.log("Formatting XML content:", xmlContent);
      const formatted = formatXMLContent(xmlContent);
      console.log("Formatted XML result:", formatted);
      setXmlContent(formatted);
      toast.success("XML formatted and validated successfully!");
    } catch (error) {
      console.error("XML formatting error:", error);
      toast.error(`${error instanceof Error ? error.message : 'Invalid XML content'}`);
    }
  };

  const formatJSON = () => {
    if (!jsonContent.trim()) {
      toast.error("No JSON content to format!");
      return;
    }
    
    try {
      const formatted = formatJSONContent(jsonContent);
      setJsonContent(formatted);
      toast.success("JSON formatted successfully in-place!");
    } catch (error) {
      toast.error("Invalid JSON content!");
    }
  };

  const handleEncode = (type: 'xml' | 'json') => {
    try {
      const content = type === 'xml' ? xmlContent : jsonContent;
      const encoded = encodeToBase64(content);
      setEncodedContent(encoded);
      setShowResult(true);
      toast.success("Content encoded to Base64!");
    } catch (error) {
      toast.error("Error encoding content!");
    }
  };

  const handleDecode = (type: 'xml' | 'json') => {
    try {
      const content = type === 'xml' ? xmlContent : jsonContent;
      const decoded = decodeFromBase64(content);
      setEncodedContent(decoded);
      setShowResult(true);
      toast.success("Content decoded from Base64!");
    } catch (error) {
      toast.error("Error decoding content: Invalid Base64 string");
    }
  };

  const handleTextSelect = (e: React.MouseEvent<HTMLTextAreaElement>, type: 'xml' | 'json') => {
    const textarea = e.currentTarget;
    const selected = textarea.value.substring(
      textarea.selectionStart,
      textarea.selectionEnd
    );

    console.log("Text selected:", selected, "Type:", type, "Active tab:", activeTab);

    if (selected && selected.trim()) {
      let cleanedSelection = selected.trim();
      
      // Handle closing tags by extracting just the tag name
      if (cleanedSelection.startsWith('</') && cleanedSelection.endsWith('>')) {
        cleanedSelection = cleanedSelection.replace('</', '').replace('>', '');
      }
      // Handle opening tags by extracting just the tag name
      else if (cleanedSelection.startsWith('<') && cleanedSelection.endsWith('>')) {
        cleanedSelection = cleanedSelection.replace('<', '').replace('>', '').split(' ')[0];
      }
      
      setSelectedText(cleanedSelection);
      setHasSelection(true);
      setCurrentEditor(type);
      console.log("Cleaned selection set:", cleanedSelection, "Editor:", type, "Has selection:", true);
    } else {
      setHasSelection(false);
      setSelectedText('');
      console.log("No selection - clearing selection state");
    }
  };

  const handleSearch = (type: 'xml' | 'json') => {
    try {
      if (type === 'json') {
        if (!jsonContent.trim()) {
          toast.error("No JSON content to search!");
          return;
        }
        
        const parsed = JSON.parse(jsonContent);
        
        // Check if it's a modern path syntax query
        if (isModernPathSyntax(searchQuery)) {
          const result = evaluateJSONPath(parsed, searchQuery);
          setPathResult({
            values: result.values || [],
            path: result.path
          });
          setSelectedPath(searchQuery);
          toast.success(`Found ${result.values?.length || 0} matching values`);
          return;
        }
        
        // Regular path search
        const paths = findJSONPaths(parsed);
        const searchLower = searchQuery.toLowerCase();
        const filtered = paths.filter(path =>
          path.toLowerCase().includes(searchLower)
        );
        setFoundPaths(filtered);
        setPathResult(null);
        
        if (filtered.length === 0) {
          toast.info("No matching paths found");
        } else {
          toast.success(`Found ${filtered.length} matching paths`);
        }
      } else {
        if (!xmlContent.trim()) {
          toast.error("No XML content to search!");
          return;
        }
        console.log("Searching XML paths for:", searchQuery);
        const paths = findXMLPaths(xmlContent);
        console.log("Found XML paths:", paths);

        const searchLower = searchQuery.toLowerCase();
        const filtered = paths.filter(path =>
          path.toLowerCase().includes(searchLower)
        );

        setFoundPaths(filtered);

        if (filtered.length === 0) {
          toast.info("No matching paths found");
        } else {
          toast.success(`Found ${filtered.length} matching paths`);
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Error searching paths - please check your content format");
    }
  };

  const handlePathSelect = (path: string) => {
    setSelectedPath(path);
    
    // If it's a modern path syntax, evaluate it
    if (isModernPathSyntax(path) && jsonContent.trim()) {
      try {
        const parsed = JSON.parse(jsonContent);
        const result = evaluateJSONPath(parsed, path);
        setPathResult({
          values: result.values || [],
          path: result.path
        });
      } catch (error) {
        console.error("Path evaluation error:", error);
      }
    } else {
      setPathResult(null);
    }
  };

  const extractPath = () => {
    if (!selectedText) {
      toast.error("No text selected for path extraction");
      return;
    }

    try {
      console.log("Extracting path for:", selectedText, "in editor:", currentEditor);
      
      if (currentEditor === 'json') {
        if (!jsonContent.trim()) {
          toast.error("No JSON content available");
          return;
        }
        const parsed = JSON.parse(jsonContent);
        const paths = findJSONPaths(parsed);
        console.log("JSON paths found:", paths);
        
        // Use the improved path finding logic with JSON data
        const matchingPath = findPathForSelectedText(paths, selectedText, parsed);
        
        if (matchingPath) {
          setSelectedPath(matchingPath);
          toast.success("JSON path extracted successfully!");
        } else {
          toast.error("Couldn't find path for the selected text");
        }
      } else {
        if (!xmlContent.trim()) {
          toast.error("No XML content available");
          return;
        }
        console.log("Extracting XML path for:", selectedText);
        const paths = findXMLPaths(xmlContent);
        console.log("XML paths found:", paths);
        
      let matchingPath = paths.find(path => {
        const sel = selectedText.trim().replace(/^['"]|['"]$/g, '').toLowerCase(); // nettoie guillemets
        const pathLower = path.toLowerCase();
      
        return (
          pathLower.endsWith(`/${sel}`) ||                  // balise
          pathLower.includes(`/${sel}`) ||                  // balise partielle
          pathLower.includes(`@${sel}`) ||                  // nom d'attribut
          pathLower.includes(`="${sel}"`) ||                // valeur exacte
          pathLower.includes(`="${sel.toLowerCase()}"`) ||  // valeur minuscule
          pathLower.includes(`[text()="${sel}"]`) ||        // contenu texte
          pathLower.includes(`[contains(text(),"${sel}")]`) // contenu partiel
        );
      });
        if (!matchingPath) {
          // Try a more flexible search for element names
          matchingPath = paths.find(path => 
            path.toLowerCase().includes(selectedText.toLowerCase())
          );
        }
        
        if (matchingPath) {
          setSelectedPath(matchingPath);
          toast.success("XML path extracted successfully!");
        } else {
          toast.error("Could not find exact path for selected text");
        }
      }
    } catch (error) {
      console.error("Path extraction error:", error);
      toast.error("Error extracting path - please check your content format");
    }
  };

  return (
    <div className="container py-4 animate-fade-in">
      {/* Top AdSense Banner */}
      <div className="w-full mb-8">
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            width: '100%',
            height: '90px',
            marginBottom: '1rem'
          }}
          data-ad-client="ca-pub-7479735239636417"
          data-ad-slot="2770178735"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>

      {!hideHeader && (
        <>
          <h1 className="text-3xl font-bold text-center mb-4">XML/JSON Path Finder & Base64 Converter - JSONXMLKit</h1>
          <p className="text-center text-gray-600 mb-8">
            Free online tool for code formatting, path lookup, and Base64 conversion
          </p>
        </>
      )}

      <ToolsTabs
        xmlContent={xmlContent}
        jsonContent={jsonContent}
        encodedContent={encodedContent}
        showResult={showResult}
        hasSelection={hasSelection}
        selectedPath={selectedPath}
        searchQuery={searchQuery}
        foundPaths={foundPaths}
        onSearchQueryChange={setSearchQuery}
        onSearch={handleSearch}
        onExtractPath={extractPath}
        onPathSelect={handlePathSelect}
        onFormatXML={formatXML}
        onFormatJSON={formatJSON}
        onEncode={handleEncode}
        onDecode={handleDecode}
        onXMLContentChange={setXmlContent}
        onJSONContentChange={setJsonContent}
        onTextSelect={handleTextSelect}
        defaultTab={defaultTab}
        onTabChange={setActiveTab}
        pathResult={pathResult}
      />
    </div>
  );
};

export default CodeEditor;
