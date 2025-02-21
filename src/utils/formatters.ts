
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
  return decodeURIComponent(escape(atob(content)));
};

export const findJSONPaths = (obj: any, currentPath: string = '', paths: string[] = []): string[] => {
  if (typeof obj !== 'object' || obj === null) {
    paths.push(currentPath);
    return paths;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      findJSONPaths(item, `${currentPath}[${index}]`, paths);
    });
  } else {
    Object.keys(obj).forEach(key => {
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      findJSONPaths(obj[key], newPath, paths);
    });
  }

  return paths;
};

export const findXMLPaths = (xmlContent: string): string[] => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
  const paths: string[] = [];
  
  const walkDOM = (node: Node, path: string = '') => {
    if (node.nodeType === 1) { // Element node
      const currentPath = path ? `${path}/${node.nodeName}` : node.nodeName;
      paths.push(currentPath);
      for (const child of node.childNodes) {
        walkDOM(child, currentPath);
      }
    }
  };
  
  walkDOM(xmlDoc.documentElement);
  return paths;
};
