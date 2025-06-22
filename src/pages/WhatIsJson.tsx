import React from 'react';
import { Helmet } from 'react-helmet-async';
import HomeButton from '@/components/HomeButton';
import { Link } from 'react-router-dom';

const WhatIsJson = () => {
  return (
    <div className="min-h-screen bg-white relative">
      <Helmet>
        <title>What Is JSON? A Beginner-Friendly Introduction | JSONXMLKit</title>
        <meta name="description" content="Learn the basics of JSON with simple examples and practical use cases. Understand JavaScript Object Notation and how it's used in web development." />
        <link rel="canonical" href="https://jsonxmlkit.com/what-is-json" />
      </Helmet>
      
      <HomeButton />
      
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">What Is JSON? A Beginner-Friendly Introduction</h1>

        <p className="text-lg text-gray-700 mb-8">
          <strong>JSON</strong> stands for <em>JavaScript Object Notation</em>. It is a lightweight and easy-to-read format used to store and exchange data between systems, especially in web applications.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Why Is JSON So Popular?</h2>
          <p className="text-gray-700 mb-4">
            JSON is simple, readable by both humans and machines, and supported by all modern programming languages. It's the standard for most APIs and web services today.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Basic JSON Structure</h2>
          <p className="text-gray-700 mb-4">
            JSON is made up of <strong>key-value pairs</strong>. Each key is a string, and each value can be a string, number, boolean, array, or another object.
          </p>

          <h3 className="text-lg font-semibold mb-2">Example:</h3>
          <pre className="bg-gray-100 p-4 rounded border overflow-x-auto mb-6"><code>{`{
  "name": "Alice",
  "age": 30,
  "isStudent": false,
  "skills": ["HTML", "CSS", "JavaScript"]
}`}</code></pre>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What Can JSON Represent?</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Strings: <code className="bg-gray-100 px-2 py-1 rounded">"hello"</code></li>
            <li>Numbers: <code className="bg-gray-100 px-2 py-1 rounded">42</code></li>
            <li>Booleans: <code className="bg-gray-100 px-2 py-1 rounded">true</code> or <code className="bg-gray-100 px-2 py-1 rounded">false</code></li>
            <li>Arrays: <code className="bg-gray-100 px-2 py-1 rounded">["apple", "banana"]</code></li>
            <li>Objects: <code className="bg-gray-100 px-2 py-1 rounded">{"{"}"key": "value"{"}"}</code></li>
            <li>null values: <code className="bg-gray-100 px-2 py-1 rounded">null</code></li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Where Is JSON Used?</h2>
          <p className="text-gray-700 mb-4">JSON is widely used in:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>APIs (RESTful services)</li>
            <li>Web apps and mobile apps</li>
            <li>Configuration files</li>
            <li>Data storage and logging</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">JSON vs XML</h2>
          <p className="text-gray-700 mb-4">
            JSON is often compared to XML. While both are used to store and exchange data, JSON is cleaner and easier to parse. For a detailed comparison, read our article:{" "}
            <Link to="/json-vs-xml" className="text-primary hover:underline">JSON vs XML: What's the Difference?</Link>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Want to Try JSON Yourself?</h2>
          <p className="text-gray-700 mb-4">Use our free tools:</p>
          <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
            <li><Link to="/json-tester" className="text-primary hover:underline">JSON Formatter & Path Search</Link></li>
            <li><Link to="/xpath-tester" className="text-primary hover:underline">XML Formatter & XPath Tool</Link></li>
          </ul>

          <p className="text-gray-700">
            <strong>jsonxmlkit.com</strong> is a fast, private tool to help developers work with JSON and XML formats easily and securely.
          </p>
        </section>
      </div>
    </div>
  );
};

export default WhatIsJson;
