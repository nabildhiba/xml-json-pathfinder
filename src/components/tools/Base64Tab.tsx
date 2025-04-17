
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, Upload, Download } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { encodeToBase64, decodeFromBase64, downloadFile, isBinaryContent } from '@/utils/formatters';
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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const noPreviewInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, preview: boolean = true) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setUploadedFile(file);

      if (preview) {
        const reader = new FileReader();
        if (file.type.startsWith('text/') || file.type === 'application/json' || file.type === 'application/xml') {
          // For text-based files, use readAsText
          reader.onload = (e) => {
            const content = e.target?.result as string;
            onContentChange(content);
            toast.success(`File "${file.name}" uploaded and previewed`);
          };
          reader.readAsText(file);
        } else {
          // For binary files, use readAsDataURL to get base64 encoding
          reader.onload = (e) => {
            const result = e.target?.result as string;
            // Remove the data URL prefix (e.g., "data:application/zip;base64,")
            const base64Content = result.substring(result.indexOf(',') + 1);
            onContentChange(base64Content);
            toast.success(`File "${file.name}" uploaded and previewed as Base64`);
          };
          reader.readAsDataURL(file);
        }
      } else {
        toast.success(`File "${file.name}" uploaded without preview`);
      }
    }
  };

  const handleDirectProcess = (isEncode: boolean) => {
    // If we have an uploaded file without preview, process that file
    if (uploadedFile && !content) {
      if (isEncode) {
        // For encoding files, we need to read them first
        const reader = new FileReader();
        
        if (uploadedFile.type.startsWith('text/') || 
            uploadedFile.type === 'application/json' || 
            uploadedFile.type === 'application/xml') {
          // For text files
          reader.onload = (e) => {
            try {
              const fileContent = e.target?.result as string;
              const result = encodeToBase64(fileContent);
              downloadFile(result, `${fileName.split('.')[0] || 'encoded'}.txt`);
              toast.success(`Content encoded and downloaded`);
            } catch (error) {
              toast.error(`Error encoding content`);
              console.error(error);
            }
          };
          reader.readAsText(uploadedFile);
        } else {
          // For binary files
          reader.onload = (e) => {
            try {
              const result = e.target?.result as string;
              const base64Content = result.substring(result.indexOf(',') + 1);
              downloadFile(base64Content, `${fileName.split('.')[0] || 'encoded'}.txt`);
              toast.success(`Binary file encoded and downloaded`);
            } catch (error) {
              toast.error(`Error encoding binary file`);
              console.error(error);
            }
          };
          reader.readAsDataURL(uploadedFile);
        }
      } else {
        // For decoding directly to a file
        // We assume the file contains BASE64 text to be decoded
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const fileContent = e.target?.result as string;
            const decodedContent = decodeFromBase64(fileContent);
            
            // Check if the decoded content appears to be binary
            const isBinary = isBinaryContent(fileContent);
            downloadFile(fileContent, `${fileName.split('.')[0] || 'decoded'}_result.${isBinary ? 'zip' : 'txt'}`, isBinary);
            toast.success(`Content decoded and downloaded`);
          } catch (error: any) {
            toast.error(`Error decoding: ${error.message || 'Invalid Base64 input'}`);
            console.error(error);
          }
        };
        reader.readAsText(uploadedFile);
      }
    } 
    // Otherwise process the text content from the textarea
    else if (content) {
      try {
        if (isEncode) {
          const result = encodeToBase64(content);
          downloadFile(result, `${fileName.split('.')[0] || 'encoded'}_result.txt`);
          toast.success(`Content encoded and downloaded`);
        } else {
          // Decode and check if the input appears to be binary data
          const isBinary = isBinaryContent(content);
          
          try {
            // For binary content, download directly as binary
            if (isBinary) {
              downloadFile(content, `${fileName.split('.')[0] || 'decoded'}_result.zip`, true);
            } else {
              // For text content, decode and download as text
              const decodedContent = decodeFromBase64(content);
              downloadFile(decodedContent, `${fileName.split('.')[0] || 'decoded'}_result.txt`);
            }
            toast.success(`Content decoded and downloaded`);
          } catch (error: any) {
            toast.error(`Error decoding: ${error.message || 'Invalid Base64 input'}`);
            console.error(error);
          }
        }
      } catch (error: any) {
        toast.error(`Error processing: ${error.message}`);
        console.error(error);
      }
    } else {
      toast.error("No content to process");
    }
  };

  const handleDownloadResult = () => {
    if (encodedContent) {
      // Check if the result appears to be binary
      const isBinary = isBinaryContent(content) && !content.startsWith("data:");
      downloadFile(encodedContent, `${fileName.split('.')[0] || 'result'}.${isBinary ? 'zip' : 'txt'}`, isBinary);
      toast.success("Result downloaded successfully");
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-md bg-gray-50">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Input Content</h3>
              <p className="text-sm text-gray-600">
                Enter text or upload a file to encode/decode
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                {fileName ? 'Change File' : 'Upload File'}
              </Button>

              <Button
                onClick={() => noPreviewInputRef.current?.click()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload File (No Preview)
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => handleFileUpload(e, true)}
                className="hidden"
              />
              <input
                ref={noPreviewInputRef}
                type="file"
                onChange={(e) => handleFileUpload(e, false)}
                className="hidden"
              />
            </div>
          </div>
          
          {fileName && (
            <div className="text-sm text-gray-600 p-2 bg-gray-100 rounded">
              Selected file: <strong>{fileName}</strong>
            </div>
          )}
          
          <Textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            onMouseUp={onTextSelect}
            className="font-mono min-h-[200px]"
            placeholder="Paste your content here or upload a file"
          />
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={onEncode} 
              variant="outline"
              disabled={!content}
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Encode & View
            </Button>
            
            <Button 
              onClick={onDecode}
              variant="outline"
              disabled={!content} 
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Decode & View
            </Button>
            
            <Button 
              onClick={() => handleDirectProcess(true)} 
              variant="default"
              disabled={!content && !uploadedFile}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Encode & Download
            </Button>
            
            <Button 
              onClick={() => handleDirectProcess(false)}
              variant="default"
              disabled={!content && !uploadedFile} 
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Decode & Download
            </Button>
          </div>
        </div>
      </div>

      {showResult && (
        <div className="p-4 border rounded-md bg-gray-50">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Result</h3>
              <Button
                onClick={handleDownloadResult}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Result
              </Button>
            </div>
            
            <Textarea
              value={encodedContent}
              readOnly
              className="font-mono min-h-[200px] bg-gray-50"
              placeholder="Encoded/decoded result will appear here..."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Base64Tab;
