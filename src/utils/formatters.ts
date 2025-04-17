
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
    // If standard decoding fails, try a more robust approach
    try {
      // For binary data that cannot be properly URI decoded
      return atob(content);
    } catch (innerError) {
      // If even this fails, throw an error with clear message
      throw new Error("The content is not a valid Base64 string");
    }
  }
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

export const downloadFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
