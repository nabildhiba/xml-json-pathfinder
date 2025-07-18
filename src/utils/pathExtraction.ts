
// Helper function to find matching paths by selected text
import { lastJSONData } from './formatters';

export const findPathForSelectedText = (
  paths: string[],
  selectedText: string,
  jsonData?: any
): string | null => {
  // If no JSON data is provided, fall back to the last object processed by
  // `findJSONPaths`. This makes the helper more forgiving in environments where
  // the JSON object isn't always passed along (e.g. our unit tests).
  const dataSource = jsonData ?? lastJSONData;
  const cleanText = selectedText.trim().toLowerCase();
  
  // Strategy 1: Direct property name match (exact match at end of path)
  let matchingPath = paths.find(path => {
    const segments = path.split('.');
    const lastSegment = segments[segments.length - 1].toLowerCase();
    // Handle array indices like "name" in "accounts[0].image.name"
    const cleanLastSegment = lastSegment.replace(/\[\d+\]$/, '');
    return cleanLastSegment === cleanText;
  });
  
  if (matchingPath) return matchingPath;
  
  // Strategy 2: Property name anywhere in path with dot notation
  matchingPath = paths.find(path => 
    path.toLowerCase().includes(`.${cleanText}`) || 
    path.toLowerCase().endsWith(cleanText)
  );
  
  if (matchingPath) return matchingPath;
  
  // Strategy 3: Property name in array context
  matchingPath = paths.find(path => {
    const pathLower = path.toLowerCase();
    // Match patterns like "accounts[0].image.name" when searching for "name"
    const indexRegex = new RegExp(`\\[\\d+\\]\\.${cleanText.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}`);
    return pathLower.includes(`].${cleanText}`) || indexRegex.test(pathLower);
  });
  
  if (matchingPath) return matchingPath;
  
  // Strategy 4: Search for actual values in the JSON data
  if (dataSource) {
    matchingPath = findPathByValue(dataSource, selectedText, paths);
    if (matchingPath) return matchingPath;
  }
  
  // Strategy 5: Partial match anywhere in path
  matchingPath = paths.find(path => 
    path.toLowerCase().includes(cleanText)
  );
  
  return matchingPath || null;
};

// Helper function to find path by actual value in JSON data
const findPathByValue = (obj: any, searchValue: string, allPaths: string[]): string | null => {
  const searchLower = searchValue.toLowerCase();
  
  const traverse = (current: any, currentPath: string = ''): string | null => {
    if (current === null || current === undefined) {
      return null;
    }
    
    // Check if current value matches the search text
    if (typeof current === 'string' && current.toLowerCase() === searchLower) {
      return currentPath;
    }
    
    if (typeof current === 'object') {
      if (Array.isArray(current)) {
        for (let i = 0; i < current.length; i++) {
          const itemPath = currentPath ? `${currentPath}[${i}]` : `[${i}]`;
          const result = traverse(current[i], itemPath);
          if (result) return result;
        }
      } else {
        for (const [key, value] of Object.entries(current)) {
          const newPath = currentPath ? `${currentPath}.${key}` : key;
          const result = traverse(value, newPath);
          if (result) return result;
        }
      }
    }
    
    return null;
  };
  
  return traverse(obj);
};
