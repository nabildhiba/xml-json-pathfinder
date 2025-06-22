
export interface JSONPathResult {
  path: string;
  value: any;
  values?: any[];
}

export const evaluateJSONPath = (obj: any, path: string): JSONPathResult => {
  const pathParts = path.split('.');
  const values: any[] = [];
  
  const traverse = (current: any, parts: string[], currentPath: string = ''): void => {
    if (parts.length === 0) {
      values.push(current);
      return;
    }
    
    const [head, ...tail] = parts;
    
    if (head.endsWith('[]')) {
      // Handle array wildcard
      const arrayKey = head.slice(0, -2);
      const newPath = currentPath ? `${currentPath}.${arrayKey}` : arrayKey;
      
      if (current && typeof current === 'object' && current[arrayKey] && Array.isArray(current[arrayKey])) {
        current[arrayKey].forEach((item: any, index: number) => {
          traverse(item, tail, `${newPath}[${index}]`);
        });
      }
    } else {
      // Handle regular property access
      const newPath = currentPath ? `${currentPath}.${head}` : head;
      
      if (current && typeof current === 'object' && current.hasOwnProperty(head)) {
        traverse(current[head], tail, newPath);
      }
    }
  };
  
  traverse(obj, pathParts);
  
  return {
    path,
    value: values.length === 1 ? values[0] : values,
    values
  };
};

export const isModernPathSyntax = (path: string): boolean => {
  return path.includes('[]');
};

export const findMatchingPaths = (obj: any, searchQuery: string): string[] => {
  const allPaths = findAllPaths(obj);
  const searchLower = searchQuery.toLowerCase();
  
  return allPaths.filter(path =>
    path.toLowerCase().includes(searchLower)
  );
};

const findAllPaths = (obj: any, currentPath: string = '', paths: string[] = []): string[] => {
  if (obj === null || obj === undefined) {
    return paths;
  }

  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      // Add array wildcard path
      if (currentPath) {
        paths.push(`${currentPath}[]`);
      }
      
      obj.forEach((item, index) => {
        findAllPaths(item, `${currentPath}[${index}]`, paths);
      });
    } else {
      Object.entries(obj).forEach(([key, value]) => {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        paths.push(newPath);
        
        if (Array.isArray(value)) {
          paths.push(`${newPath}[]`);
        }
        
        findAllPaths(value, newPath, paths);
      });
    }
  }

  return [...new Set(paths)];
};
