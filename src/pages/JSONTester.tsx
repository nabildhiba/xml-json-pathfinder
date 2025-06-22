
import React from 'react';
import { Helmet } from 'react-helmet-async';
import CodeEditor from "@/components/CodeEditor";
import HomeButton from '@/components/HomeButton';

const JSONTester = () => {
  return (
    <div className="relative">
      <Helmet>
        <title>JSON Formatter & Path Search Tool | JSONXMLKit</title>
        <meta name="description" content="Free online JSON formatter and path search tool. Pretty-print JSON, extract values with JSONPath, and quickly navigate JSON structures." />
        <link rel="canonical" href="https://jsonxmlkit.com/json-tester" />
      </Helmet>
      
      <HomeButton />
      <CodeEditor defaultTab="json" hideHeader={false} />
    </div>
  );
};

export default JSONTester;
