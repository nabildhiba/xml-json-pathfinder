
// Helper function to find matching paths by selected text
export const findPathForSelectedText = (paths: string[], selectedText: string): string | null => {
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
    return pathLower.includes(`].${cleanText}`) || 
           pathLower.includes(`[0].${cleanText}`) ||
           pathLower.includes(`[1].${cleanText}`) ||
           pathLower.includes(`[2].${cleanText}`);
  });
  
  if (matchingPath) return matchingPath;
  
  // Strategy 4: Partial match anywhere in path
  matchingPath = paths.find(path => 
    path.toLowerCase().includes(cleanText)
  );
  
  return matchingPath || null;
};
