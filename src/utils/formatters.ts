export const formatXMLContent = (content: string): string => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(content, "text/xml");
  const serializer = new XMLSerializer();
  return serializer.serializeToString(xmlDoc)
    .replace(/>/g, ">\n")
    .replace(/\n\s*\n/g, "\n")
    .trim();
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

// Check if the content appears to be binary (non-text) data
export const isBinaryContent = (data: string): boolean => {
  // Check for common binary file signatures in the first bytes
  const patterns = [
    // ZIP files
    "UEs", "PK",
    // PDF files
    "JVBE", "%PDF",
    // PNG files
    "iVBO", "iVBOR",
    // JPG files
    "/9j/", "/9g=",
    // GIF files
    "R0lG", "GIF8",
  ];
  
  const startOfContent = data.substring(0, 20);
  return patterns.some(pattern => startOfContent.includes(pattern));
};

export const downloadFile = (content: string, filename: string, isBinary = false) => {
  let blob;
  
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
    
    blob = new Blob(byteArrays);
    
    // Try to determine file extension based on binary signature
    if (filename.endsWith('.txt')) {
      // Check first bytes for common file signatures
      const firstBytes = byteCharacters.substring(0, 4);
      if (firstBytes.startsWith('PK')) {
        filename = filename.replace(/\.txt$/, '.zip');
      } else if (firstBytes.startsWith('%PDF')) {
        filename = filename.replace(/\.txt$/, '.pdf');
      } else if (firstBytes.includes('PNG')) {
        filename = filename.replace(/\.txt$/, '.png');
      } else if (firstBytes.includes('JFIF') || firstBytes.includes('Exif')) {
        filename = filename.replace(/\.txt$/, '.jpg');
      } else if (firstBytes.includes('GIF8')) {
        filename = filename.replace(/\.txt$/, '.gif');
      }
    }
  } else {
    // For text data
    blob = new Blob([content], { type: 'text/plain' });
  }
  
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
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
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
  const paths: string[] = [];
  
  const walkDOM = (node: Node, path: string = '') => {
    if (node.nodeType === 1) { // Element node
      const currentPath = path ? `${path}/${node.nodeName}` : node.nodeName;
      paths.push(currentPath);
      
      // Add paths for attributes
      const element = node as Element;
      for (const attr of element.attributes) {
        paths.push(`${currentPath}/@${attr.name}`);
      }
      
      // Add paths for text content
      if (element.textContent?.trim()) {
        paths.push(`${currentPath}/text()`);
      }
      
      for (const child of node.childNodes) {
        walkDOM(child, currentPath);
      }
    }
  };
  
  walkDOM(xmlDoc.documentElement);
  return [...new Set(paths)]; // Remove duplicates
};
