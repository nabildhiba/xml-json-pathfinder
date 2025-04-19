
import React from 'react';

interface CodeEditorHeaderProps {
  hideHeader: boolean;
}

export const CodeEditorHeader = ({ hideHeader }: CodeEditorHeaderProps) => {
  if (hideHeader) return null;

  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-4">XML/JSON Path Finder & Base64 Converter - JSONXMLKit</h1>
      <p className="text-center text-gray-600 mb-8">
        Free online tool for code formatting, path lookup, and Base64 conversion
      </p>
    </>
  );
};
