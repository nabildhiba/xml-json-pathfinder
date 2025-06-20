
import React from 'react';
import HomeButton from '@/components/HomeButton';
import { Link } from 'react-router-dom';

const JsonWebApisHistory = () => {
  return (
    <div className="min-h-screen bg-white relative">
      <HomeButton />
      
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">How JSON Changed Web APIs: A Brief History</h1>

        <p className="text-lg text-gray-700 mb-8">
          JSON (JavaScript Object Notation) wasn't always the standard for web APIs. In fact, before JSON, data was mostly exchanged using <strong>XML</strong> and protocols like <strong>SOAP</strong> and <strong>XML-RPC</strong>. So how did JSON become the default format for modern APIs?
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">The Early Days: XML and SOAP</h2>
          <p className="text-gray-700 mb-4">
            In the early 2000s, web services were typically built on complex protocols like <em>SOAP (Simple Object Access Protocol)</em>. These used XML to format messages, and were often difficult to debug, heavy, and slow to parse.
          </p>

          <h3 className="text-lg font-semibold mb-2">Example SOAP Message</h3>
          <pre className="bg-gray-100 p-4 rounded border overflow-x-auto mb-6"><code>{`<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <getUser>
      <id>123</id>
    </getUser>
  </soap:Body>
</soap:Envelope>`}</code></pre>

          <p className="text-gray-700 mb-4">
            While XML was powerful, it was also verbose, rigid, and hard for developers to work with—especially in browsers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">The Rise of JSON</h2>
          <p className="text-gray-700 mb-4">
            JSON was created by <strong>Douglas Crockford</strong> in the early 2000s. It quickly gained popularity due to its simplicity and its perfect fit with JavaScript, which dominated web development.
          </p>

          <p className="text-gray-700 mb-4">Instead of bulky XML, developers could now send this:</p>

          <pre className="bg-gray-100 p-4 rounded border overflow-x-auto mb-6"><code>{`{
  "id": 123,
  "name": "Alice"
}`}</code></pre>

          <p className="text-gray-700 mb-4">
            JSON was faster to parse, easier to read, and better suited for JavaScript environments. As AJAX became common, so did JSON.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">REST + JSON = Simplicity Wins</h2>
          <p className="text-gray-700 mb-4">
            With the rise of <strong>RESTful APIs</strong>, developers embraced simpler and lighter protocols. REST, combined with JSON, made it incredibly easy to build scalable APIs using HTTP verbs (GET, POST, etc.)
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Try Our Tools</h2>
          <p className="text-gray-700 mb-4">Want to explore JSON and XML formats? Use our free tools:</p>
          <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
            <li><Link to="/json-tester" className="text-primary hover:underline">JSON Formatter & Path Search</Link></li>
            <li><Link to="/xpath-tester" className="text-primary hover:underline">XML Formatter & XPath Tool</Link></li>
            <li><Link to="/json-vs-xml" className="text-primary hover:underline">JSON vs XML: What's the Difference?</Link></li>
          </ul>

          <p className="text-gray-700">
            <strong>jsonxmlkit.com</strong> is a fast, private tool to help developers work with JSON and XML formats easily and securely.
          </p>
        </section>
      </div>
    </div>
  );
};

export default JsonWebApisHistory;
