
export const formatXMLContent = (content: string): string => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, "text/xml");

    const parseError = xmlDoc.querySelector("parsererror");
    if (parseError) {
      throw new Error("Invalid XML");
    }

    const originalDeclaration = '<?xml version="1.0" encoding="UTF-8"?>';

    const beautify = (node: Node, indent: string = ''): string => {
      let xml = '';

      const children = Array.from(node.childNodes);
      const hasElementChildren = children.some(n => n.nodeType === 1);

      if (node.nodeType === 1) {
        const el = node as Element;
        const tagName = el.tagName;
        const attrs = Array.from(el.attributes)
          .map(attr => ` ${attr.name}="${attr.value}"`)
          .join('');

        if (!hasElementChildren && !el.textContent?.trim()) {
          xml += `${indent}<${tagName}${attrs}/>\n`;
        } else if (!hasElementChildren) {
          xml += `${indent}<${tagName}${attrs}>${el.textContent?.trim()}</${tagName}>\n`;
        } else {
          xml += `${indent}<${tagName}${attrs}>\n`;
          for (const child of children) {
            xml += beautify(child, indent + '  ');
          }
          xml += `${indent}</${tagName}>\n`;
        }
      } else if (node.nodeType === 3) {
        const text = node.textContent?.trim();
        if (text) {
          xml += `${indent}${text}\n`;
        }
      }

      return xml;
    };

    const root = xmlDoc.documentElement;
    const formatted = beautify(root).trim();

    return `${originalDeclaration}\n${formatted}`;
  } catch (error: any) {
    console.error("XML formatting error:", error.message);
    return content;
  }
};

import { evaluateJSONPath, isModernPathSyntax, findMatchingPaths } from './jsonPathEvaluator';

// Store the last JSON object processed by `findJSONPaths` so that other
// utilities (like `findPathForSelectedText`) can access the data even when it
// isn't explicitly provided again.
export let lastJSONData: any = null;

export { evaluateJSONPath, isModernPathSyntax };

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
  // Keep a reference to the most recently parsed JSON object. This allows
  // helper utilities to access the JSON data even if it's not passed along
  // explicitly (useful in tests and some UI interactions).
  if (currentPath === '') {
    lastJSONData = obj;
  }
  if (obj === null || obj === undefined) {
    if (currentPath) paths.push(currentPath);
    return paths;
  }

  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      // Add the array path itself
      if (currentPath) {
        paths.push(currentPath);
        paths.push(`${currentPath}[]`);
      }
      
      // Process each array item
      obj.forEach((item, index) => {
        const itemPath = currentPath ? `${currentPath}[${index}]` : `[${index}]`;
        findJSONPaths(item, itemPath, paths);
      });
    } else {
      // Add the object path itself
      if (currentPath) {
        paths.push(currentPath);
      }
      
      // Process each property
      Object.entries(obj).forEach(([key, value]) => {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        findJSONPaths(value, newPath, paths);
      });
    }
  } else {
    // For primitive values, add the path
    if (currentPath) {
      paths.push(currentPath);
    }
  }

  return [...new Set(paths)].sort();
};

export const searchJSONPaths = (obj: any, query: string): string[] => {
  return findMatchingPaths(obj, query);
};

export const findXMLPaths = (xmlContent: string): string[] => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

  const paths: string[] = [];

  const traverse = (node: Node, path: string) => {
    if (node.nodeType === 1) { // Element node
      const element = node as Element;
      const currentPath = path ? `${path}/${element.nodeName}` : `/${element.nodeName}`;
      paths.push(currentPath);

      // 🎯 ATTRIBUTS
      Array.from(element.attributes).forEach(attr => {
        paths.push(`${currentPath}/@${attr.name}`);
        paths.push(`${currentPath}[@${attr.name}="${attr.value}"]`);
      });

      // 🎯 TEXT CONTENT
      const text = element.textContent?.trim();
      if (text) {
        paths.push(`${currentPath}[text()="${text}"]`);
        paths.push(`${currentPath}[contains(text(),"${text.substring(0, 10)}")]`);
      }

      Array.from(element.children).forEach(child => {
        traverse(child, currentPath);
      });
    }
  };

  traverse(xmlDoc.documentElement, '');
  return paths;
};
