
import React from 'react';
import HomeButton from '@/components/HomeButton';
import { Link } from 'react-router-dom';

const WhatIsXml = () => {
  return (
    <div className="min-h-screen bg-white relative">
      <HomeButton />
      
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">What Is XML? Explained Simply With Examples</h1>

        <p className="text-lg text-gray-700 mb-8">
          <strong>XML</strong> stands for <em>eXtensible Markup Language</em>. It is a text-based format used to store and transport data in a structured, human-readable way.
        </p>

        <p className="text-gray-700 mb-8">
          Unlike JSON, which is primarily used in web APIs, XML was widely adopted in the early days of the web and is still used in many systems today—including enterprise software, banking, and configuration files.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Why Was XML Created?</h2>
          <p className="text-gray-700 mb-4">XML was designed to be:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Platform-independent</strong></li>
            <li><strong>Human-readable</strong></li>
            <li><strong>Structured and self-descriptive</strong></li>
          </ul>

          <p className="text-gray-700 mt-4">
            It allowed different systems to exchange complex data in a way that both machines and developers could understand.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Basic XML Structure</h2>
          <p className="text-gray-700 mb-4">
            XML documents use tags—just like HTML—but the tags are custom and describe the data.
          </p>

          <h3 className="text-lg font-semibold mb-2">Example XML Document</h3>
          <pre className="bg-gray-100 p-4 rounded border overflow-x-auto mb-6"><code>{`<person>
  <name>Alice</name>
  <age>30</age>
  <city>New York</city>
</person>`}</code></pre>

          <p className="text-gray-700">
            Each tag must be opened and closed. The structure is hierarchical, forming a tree.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Key Features of XML</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Custom Tags</strong>: You define the tag names.</li>
            <li><strong>Nested Elements</strong>: Data is grouped into a tree-like structure.</li>
            <li><strong>Attributes</strong>: Elements can include attributes for extra information.</li>
            <li><strong>Self-closing tags</strong>: Possible when no content is needed inside.</li>
          </ul>

          <h3 className="text-lg font-semibold mb-2 mt-6">Example with Attributes</h3>
          <pre className="bg-gray-100 p-4 rounded border overflow-x-auto mb-6"><code>{`<book id="123">
  <title>Intro to XML</title>
  <author>Jane Doe</author>
</book>`}</code></pre>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What Is XML Used For?</h2>
          <p className="text-gray-700 mb-4">Although less popular for modern web APIs, XML is still widely used in:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Document formats (e.g., Office files use XML internally)</li>
            <li>RSS and Atom feeds</li>
            <li>SOAP web services</li>
            <li>Configuration files (e.g., Android <code className="bg-gray-100 px-2 py-1 rounded">AndroidManifest.xml</code>)</li>
            <li>Data storage and exchange in enterprise systems</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">XML vs JSON: Which One to Use?</h2>
          <p className="text-gray-700 mb-4">
            XML and JSON are both used to represent structured data, but JSON is generally more concise and better suited for web APIs.
          </p>

          <p className="text-gray-700">
            👉 Read our full comparison:{" "}
            <Link to="/json-vs-xml" className="text-primary hover:underline">JSON vs XML: What's the Difference?</Link>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Convert XML to JSON Instantly</h2>
          <p className="text-gray-700 mb-4">If you have XML data and want to convert it to JSON format (or vice versa), try our free tools:</p>
          <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
            <li><Link to="/xpath-tester" className="text-primary hover:underline">XML Formatter & XPath Tool</Link></li>
            <li><Link to="/json-tester" className="text-primary hover:underline">JSON Formatter & Path Search</Link></li>
          </ul>

          <p className="text-gray-700">
            <strong>jsonxmlkit.com</strong> provides simple, fast, and private tools to work with both XML and JSON—no data is stored or shared.
          </p>
        </section>
      </div>
    </div>
  );
};

export default WhatIsXml;
