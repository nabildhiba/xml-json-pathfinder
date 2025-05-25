import React, { useState } from 'react';
import ToolsTabs from '@/components/tools/ToolsTabs';
import { HelpCircle, ShieldQuestion, MessageCircleQuestion } from 'lucide-react';
import HomeButton from '@/components/HomeButton';
import { toast } from "sonner";
import {
  formatXMLContent,
  formatJSONContent,
  encodeToBase64,
  decodeFromBase64,
  findJSONPaths,
  findXMLPaths
} from '@/utils/formatters';

const XMLTester = () => {
  const [xmlContent, setXMLContent] = useState('');
  const [jsonContent, setJSONContent] = useState('');
  const [encodedContent, setEncodedContent] = useState('');
  const [selectedPath, setSelectedPath] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [foundPaths, setFoundPaths] = useState<string[]>([]);
  const [hasSelection, setHasSelection] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [currentEditor, setCurrentEditor] = useState<'xml' | 'json'>('xml');
  const [showResult, setShowResult] = useState(false);

  const onSearchQueryChange = (query: string) => {
    setSearchQuery(query);
  };

  const onSearch = (type: 'xml' | 'json') => {
    try {
      let paths: string[] = [];
      if (type === 'json') {
        if (!jsonContent.trim()) {
          toast.error("No JSON content to search!");
          return;
        }
        const parsed = JSON.parse(jsonContent);
        paths = findJSONPaths(parsed);
      } else {
        if (!xmlContent.trim()) {
          toast.error("No XML content to search!");
          return;
        }
        console.log("Searching XML paths for:", searchQuery);
        paths = findXMLPaths(xmlContent);
        console.log("Found XML paths:", paths);
      }

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
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Error searching paths - please check your content format");
    }
  };

  const onExtractPath = () => {
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
        
        let matchingPath = paths.find(path => {
          const pathValue = path.split('.').pop() || '';
          return pathValue === selectedText || path.includes(selectedText);
        });
        
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
          const lowerSel = selectedText.toLowerCase();
          const pathLower = path.toLowerCase();
      
          return (
              pathLower.endsWith(`/${lowerSel}`) || // tag name exact match
              pathLower.includes(`/${lowerSel}`) || // tag name anywhere
              pathLower.includes(`@${lowerSel}`) || // attribute name
              pathLower.includes(`="${lowerSel}"`) || // attribute value exact match
              pathLower.includes(`"${lowerSel}"`) || // quoted value
              pathLower.includes(`[text()="${lowerSel}"]`) || // exact text node
              pathLower.includes(`[contains(text(),"${lowerSel}")]`) // partial text node
          );
      });
        
        if (!matchingPath) {
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

  const onPathSelect = (path: string) => {
    setSelectedPath(path);
  };

  const onFormatXML = () => {
    if (!xmlContent.trim()) {
      toast.error("No XML content to format!");
      return;
    }
    
    try {
      console.log("Formatting XML content:", xmlContent);
      const formatted = formatXMLContent(xmlContent);
      console.log("Formatted XML result:", formatted);
      setXMLContent(formatted);
      toast.success("XML formatted and validated successfully!");
    } catch (error) {
      console.error("XML formatting error:", error);
      toast.error(`${error instanceof Error ? error.message : 'Invalid XML content'}`);
    }
  };

  const onFormatJSON = () => {
    if (!jsonContent.trim()) {
      toast.error("No JSON content to format!");
      return;
    }
    
    try {
      const formatted = formatJSONContent(jsonContent);
      setJSONContent(formatted);
      toast.success("JSON formatted successfully in-place!");
    } catch (error) {
      toast.error("Invalid JSON content!");
    }
  };

  const onEncode = (type: 'xml' | 'json') => {
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

  const onDecode = (type: 'xml' | 'json') => {
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

  const onXMLContentChange = (content: string) => {
    setXMLContent(content);
  };

  const onJSONContentChange = (content: string) => {
    setJSONContent(content);
  };

  const onTextSelect = (e: React.MouseEvent<HTMLTextAreaElement>, type: 'xml' | 'json') => {
    const textarea = e.currentTarget;
    const selected = textarea.value.substring(
      textarea.selectionStart,
      textarea.selectionEnd
    );

    console.log("Text selected:", selected, "Type:", type);

    if (selected && selected.trim()) {
      let cleanedSelection = selected.trim();
      
      if (cleanedSelection.startsWith('</') && cleanedSelection.endsWith('>')) {
        cleanedSelection = cleanedSelection.replace('</', '').replace('>', '');
      }
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

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 relative">
      <HomeButton />
      <h1 className="text-3xl font-bold text-center mb-4">XML/JSON Path Finder & Base64 Converter - JSONXMLKit</h1>
      <p className="text-center text-gray-600 mb-8">
        Free online tool for code formatting, path lookup, and Base64 conversion
      </p>

      
      <ToolsTabs 
        xmlContent={xmlContent}
        jsonContent={jsonContent}
        encodedContent={encodedContent}
        showResult={showResult}
        hasSelection={hasSelection}
        selectedPath={selectedPath}
        searchQuery={searchQuery}
        foundPaths={foundPaths}
        onSearchQueryChange={onSearchQueryChange}
        onSearch={onSearch}
        onExtractPath={onExtractPath}
        onPathSelect={onPathSelect}
        onFormatXML={onFormatXML}
        onFormatJSON={onFormatJSON}
        onEncode={onEncode}
        onDecode={onDecode}
        onXMLContentChange={onXMLContentChange}
        onJSONContentChange={onJSONContentChange}
        onTextSelect={onTextSelect}
        defaultTab="xml"
      />

      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <HelpCircle className="w-6 h-6 text-primary mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Are these tools secure?</h3>
            </div>
            <p className="text-gray-600">Yes. All processing happens directly in your browser. Your data never leaves your device.</p>
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <ShieldQuestion className="w-6 h-6 text-primary mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Do the tools support large files?</h3>
            </div>
            <p className="text-gray-600">Yes, the tools are optimized for performance and can handle reasonably large XML files.</p>
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <MessageCircleQuestion className="w-6 h-6 text-primary mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Can I use these tools on mobile?</h3>
            </div>
            <p className="text-gray-600">Absolutely! JSONXMLKit is fully responsive and works seamlessly on phones and tablets.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XMLTester;
