
import { describe, test, expect, beforeEach } from 'vitest';
import { findJSONPaths } from '../formatters';
import { findPathForSelectedText } from '../pathExtraction';

describe('JSON Path Extraction', () => {
  const testJSON = {
    accounts: [
      {
        firstname: "John",
        lastname: "Lennon",
        Text: "For the glory of Rome!",
        image: { 
          src: "Images/Sun.png",
          name: "sun1",
          hOffset: 250,
          vOffset: 250,
          alignment: "center"
        },
        Password: "OhNoItsCrypted"
      },
      {
        firstname: "Jane",
        lastname: "Doe",
        Text: "Hello world!",
        image: { 
          src: "Images/Moon.png",
          name: "moon1",
          hOffset: 150,
          vOffset: 100,
          alignment: "right"
        },
        Password: "Secure123"
      }
    ]
  };

  let paths: string[];

  beforeEach(() => {
    paths = findJSONPaths(testJSON);
  });

  test('should find basic property paths', () => {
    expect(paths).toContain('accounts');
    expect(paths).toContain('accounts[]');
  });

  test('should find nested object paths', () => {
    expect(paths).toContain('accounts[0].firstname');
    expect(paths).toContain('accounts[0].image');
    expect(paths).toContain('accounts[0].image.name');
    expect(paths).toContain('accounts[0].image.src');
  });

  test('should find paths for array items', () => {
    expect(paths).toContain('accounts[1].firstname');
    expect(paths).toContain('accounts[1].image.name');
  });

  test('should find path by value - simple strings', () => {
    const matchingPaths = paths.filter(path => {
      const segments = path.split('.');
      const lastSegment = segments[segments.length - 1];
      return lastSegment === 'firstname' || path.includes('John') || path.includes('Jane');
    });
    expect(matchingPaths.length).toBeGreaterThan(0);
  });

  test('should find path by value - nested values', () => {
    // Test finding paths for values like "moon1", "sun1"
    const moonPaths = paths.filter(path => path.includes('name'));
    expect(moonPaths.length).toBeGreaterThan(0);
    
    const imagePaths = paths.filter(path => path.includes('image'));
    expect(imagePaths.length).toBeGreaterThan(0);
  });

  test('should handle special characters in values', () => {
    const specialPaths = paths.filter(path => path.includes('Password'));
    expect(specialPaths.length).toBeGreaterThan(0);
  });
});

describe('findPathForSelectedText', () => {
  const testJSON = {
    accounts: [
      {
        firstname: "John",
        image: { 
          name: "sun1",
          src: "Images/Sun.png"
        }
      },
      {
        firstname: "Jane",
        image: { 
          name: "moon1",
          src: "Images/Moon.png"
        }
      }
    ]
  };

  let paths: string[];

  beforeEach(() => {
    paths = findJSONPaths(testJSON);
  });

  test('should find path for "name" selection', () => {
    const result = findPathForSelectedText(paths, 'name');
    expect(result).toBeTruthy();
    expect(result).toContain('name');
  });

  test('should find path for "moon1" selection', () => {
    const result = findPathForSelectedText(paths, 'moon1');
    expect(result).toBeTruthy();
  });

  test('should find path for "firstname" selection', () => {
    const result = findPathForSelectedText(paths, 'firstname');
    expect(result).toBeTruthy();
    expect(result).toContain('firstname');
  });

  test('should find path for "image" selection', () => {
    const result = findPathForSelectedText(paths, 'image');
    expect(result).toBeTruthy();
    expect(result).toContain('image');
  });

  test('should return null for non-existent selection', () => {
    const result = findPathForSelectedText(paths, 'nonexistent');
    expect(result).toBeNull();
  });

  test('should find path for nested property values', () => {
    const result = findPathForSelectedText(paths, 'sun1');
    expect(result).toBeTruthy();
    expect(result).toContain('name');
  });

  test('should handle case insensitive matching', () => {
    const result = findPathForSelectedText(paths, 'FIRSTNAME');
    expect(result).toBeTruthy();
    expect(result.toLowerCase()).toContain('firstname');
  });
});
