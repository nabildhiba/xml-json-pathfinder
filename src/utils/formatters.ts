export const formatXMLContent = (content: string): string => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, "text/xml");
    
    // Check for parsing errors
    const parseError = xmlDoc.querySelector("parsererror");
    if (parseError) {
      throw new Error("Invalid XML syntax");
    }
    
    const serializer = new XMLSerializer();
    const serialized = serializer.serializeToString(xmlDoc);
    
    // Better formatting with proper indentation
    let formatted = serialized;
    formatted = formatted.replace(/></g, '>\n<');
    formatted = formatted.replace(/^\s*\n/gm, '');
    
    // Add proper indentation
    const lines = formatted.split('\n');
    let indentLevel = 0;
    const indentedLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      if (trimmed.startsWith('</')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const indented = '    '.repeat(indentLevel) + trimmed;
      
      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>') && !trimmed.includes('</')) {
        indentLevel++;
      }
      
      return indented;
    });
    
    return indentedLines.join('\n').trim();
  } catch (error) {
    throw new Error("Invalid XML content");
  }
};

export const formatJSONContent = (content: string): string => {
  const parsed = JSON.parse(content);
  return JSON.stringify(parsed, null, 2);
};

export const encodeToBase64 = (content: string): string => {
  return btoa(unescape(encodeURIComponent(content)));
};

export const decodeFromBase64 = (content: string): string => {
  try {
    // First try the standard decoding
    return decodeURIComponent(escape(atob(content)));
  } catch (error) {
    // If standard decoding fails, try a more robust approach for binary data
    try {
      return atob(content);
    } catch (innerError) {
      // If even this fails, throw an error with clear message
      throw new Error("The content is not a valid Base64 string");
    }
  }
};

// Improved binary content detection with better file type identification
export const isBinaryContent = (data: string): boolean => {
  // Check for common binary file signatures in the first bytes
  const patterns = [
    // ZIP files
    "UEs", "PK",
    // PDF files
    "JVBE", "%PDF", "JVBERi0",
    // PNG files
    "iVBO", "iVBOR",
    // JPG files
    "/9j/", "/9g=",
    // GIF files
    "R0lG", "GIF8",
    // Word documents
    "UEsD", "504B",
    // Excel files
    "UEsD", "504B",
  ];
  
  const startOfContent = data.substring(0, 20);
  return patterns.some(pattern => startOfContent.includes(pattern));
};

// Enhanced file type detection from Base64 content
export const detectFileType = (base64Content: string): { extension: string; mimeType: string } => {
  const startOfContent = base64Content.substring(0, 20);
  
  // PDF detection
  if (startOfContent.includes("JVBE") || startOfContent.includes("JVBERi0")) {
    return { extension: "pdf", mimeType: "application/pdf" };
  }
  
  // ZIP detection
  if (startOfContent.includes("UEs") || startOfContent.includes("PK")) {
    return { extension: "zip", mimeType: "application/zip" };
  }
  
  // PNG detection
  if (startOfContent.includes("iVBO") || startOfContent.includes("iVBOR")) {
    return { extension: "png", mimeType: "image/png" };
  }
  
  // JPG detection
  if (startOfContent.includes("/9j/") || startOfContent.includes("/9g=")) {
    return { extension: "jpg", mimeType: "image/jpeg" };
  }
  
  // GIF detection
  if (startOfContent.includes("R0lG") || startOfContent.includes("GIF8")) {
    return { extension: "gif", mimeType: "image/gif" };
  }
  
  // Default to binary file
  return { extension: "bin", mimeType: "application/octet-stream" };
};

export const downloadFile = (content: string, filename: string, isBinary = false) => {
  let blob;
  let finalFilename = filename;
  
  if (isBinary) {
    // For binary data, convert base64 to binary
    const byteCharacters = atob(content);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    // Detect file type and set appropriate extension and MIME type
    const fileInfo = detectFileType(content);
    
    blob = new Blob(byteArrays, { type: fileInfo.mimeType });
    
    // Update filename with correct extension if it ends with .txt or .zip
    if (finalFilename.endsWith('.txt') || finalFilename.endsWith('.zip')) {
      const baseName = finalFilename.replace(/\.(txt|zip)$/, '');
      finalFilename = `${baseName}.${fileInfo.extension}`;
    }
  } else {
    // For text data
    blob = new Blob([content], { type: 'text/plain' });
  }
  
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = finalFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const findJSONPaths = (obj: any, currentPath: string = '', paths: string[] = []): string[] => {
  if (obj === null) {
    paths.push(currentPath);
    return paths;
  }

  if (typeof obj === 'object') {
    Object.entries(obj).forEach(([key, value]) => {
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      // Add the key path itself
      paths.push(newPath);
      
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          findJSONPaths(item, `${newPath}[${index}]`, paths);
        });
      } else if (typeof value === 'object' && value !== null) {
        findJSONPaths(value, newPath, paths);
      } else {
        // Add the value path
        paths.push(newPath);
      }
    });
  } else {
    paths.push(currentPath);
  }

  return [...new Set(paths)]; // Remove duplicates
};

export const findXMLPaths = (xmlContent: string): string[] => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
    
    // Check for parsing errors
    const parseError = xmlDoc.querySelector("parsererror");
    if (parseError) {
      throw new Error("Invalid XML syntax");
    }
    
    const paths: string[] = [];
    
    const walkDOM = (node: Node, path: string = '') => {
      if (node.nodeType === 1) { // Element node
        const element = node as Element;
        const currentPath = path ? `${path}/${element.nodeName}` : element.nodeName;
        
        // Add the element path
        paths.push(`/${currentPath}`);
        
        // Add paths for attributes
        for (const attr of element.attributes) {
          paths.push(`/${currentPath}/@${attr.name}`);
        }
        
        // Check for text content (excluding whitespace-only text)
        const textContent = element.textContent?.trim();
        const hasOnlyTextContent = element.children.length === 0 && textContent;
        
        if (hasOnlyTextContent) {
          paths.push(`/${currentPath}/text()`);
          // Also add a path that includes the actual text value for easier matching
          paths.push(`/${currentPath}[text()="${textContent}"]`);
          // Add contains version for partial matches
          if (textContent.length > 10) {
            paths.push(`/${currentPath}[contains(text(),"${textContent.substring(0, 20)}")]`);
          }
        }
        
        // Process child elements
        for (const child of element.children) {
          walkDOM(child, currentPath);
        }
        
        // Add XPath-style paths for easier selection
        paths.push(`//${element.nodeName}`);
        
        // Add indexed paths for elements with same names
        const siblings = element.parentElement ? 
          Array.from(element.parentElement.children).filter(child => child.nodeName === element.nodeName) : [];
        if (siblings.length > 1) {
          const index = siblings.indexOf(element) + 1;
          paths.push(`/${currentPath}[${index}]`);
          paths.push(`//${element.nodeName}[${index}]`);
        }
      }
    };
    
    if (xmlDoc.documentElement) {
      walkDOM(xmlDoc.documentElement);
    }
    
    // Remove duplicates and sort
    const uniquePaths = [...new Set(paths)];
    return uniquePaths.sort();
  } catch (error) {
    console.error("Error parsing XML for path extraction:", error);
    return [];
  }
};
