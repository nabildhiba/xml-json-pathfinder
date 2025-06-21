
import React from 'react';
import HomeButton from '@/components/HomeButton';
import { Link } from 'react-router-dom';

const JsonApiSecurityBestPractices = () => {
  return (
    <div className="min-h-screen bg-white relative">
      <HomeButton />
      
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">JSON + REST APIs: Best Practices for Secure Data Exchange</h1>

        <p className="text-lg text-gray-700 mb-8">
          JSON is the most widely used format for exchanging data in RESTful APIs. But just using JSON doesn't make your API secure. To prevent data leaks, injection attacks, and misuse, developers must implement proper best practices at every layer of the API stack.
        </p>

        <p className="text-gray-700 mb-8">
          This article covers the most important things you should be doing when working with JSON and REST APIs in 2025.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Always Use HTTPS</h2>
          <p className="text-gray-700 mb-4">
            It might seem obvious, but it's still worth repeating: all API traffic should go over HTTPS, not HTTP. This ensures the encryption of JSON payloads in transit, protecting user credentials, tokens, and sensitive data from sniffing.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Set Content-Type Headers Properly</h2>
          <p className="text-gray-700 mb-4">
            Always specify the <code className="bg-gray-100 px-2 py-1 rounded">Content-Type: application/json</code> header for both requests and responses. This allows clients and servers to parse the data correctly and reject invalid content types.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Validate Incoming JSON</h2>
          <p className="text-gray-700 mb-4">
            Never trust the client. Even if you provide a frontend, a malicious user can bypass it and send malformed or dangerous payloads. Use JSON Schema validation to ensure that all incoming data follows the expected structure.
          </p>
          
          <h3 className="text-xl font-semibold mb-2">Useful Tools</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li><a href="https://ajv.js.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">AJV (Another JSON Validator)</a></li>
            <li><a href="https://json-schema.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">JSON Schema official site</a></li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Sanitize Input and Escape Output</h2>
          <p className="text-gray-700 mb-4">
            Even validated JSON may contain content that could be used in injection attacks (e.g., SQL injection, XSS if injected in HTML). Sanitize strings where needed and escape output when inserting into documents or UI.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Use Authentication and Authorization (JWT, OAuth2)</h2>
          <p className="text-gray-700 mb-4">
            Use modern authentication mechanisms like OAuth2 and JWTs (JSON Web Tokens) to protect your endpoints. Never expose sensitive JSON data from unauthenticated or unauthorized requests.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Limit Payload Size</h2>
          <p className="text-gray-700 mb-4">
            JSON can become a vector for DoS attacks if no limits are enforced. Always configure your server to reject excessively large JSON payloads, and define maximum length on individual fields where possible.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Avoid Sending Sensitive Data</h2>
          <p className="text-gray-700 mb-4">
            Do not return passwords, tokens, or PII in API responses. Double-check what your API is exposing before pushing to production.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Log with Caution</h2>
          <p className="text-gray-700 mb-4">
            Don't blindly log full JSON payloads—especially not in production. Use logging filters to exclude fields like tokens, credit card numbers, or personal data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Use Versioning in Your API URLs</h2>
          <p className="text-gray-700 mb-4">
            Include version identifiers like <code className="bg-gray-100 px-2 py-1 rounded">/api/v1/</code> in your routes. This allows you to update your JSON schema without breaking clients using older formats.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Monitor and Rate-Limit Requests</h2>
          <p className="text-gray-700 mb-4">
            Use API gateways or middlewares to implement rate limiting, IP blacklisting, and behavior-based alerts. Even the most secure JSON endpoint can be misused if left exposed to unlimited requests.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Bonus: Convert JSON Securely</h2>
          <p className="text-gray-700 mb-4">
            If you need to convert JSON to other formats (like XML), make sure to use tools that work entirely in your browser so your data stays local.
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li><Link to="/json-tester" className="text-primary hover:underline">Convert JSON to XML</Link></li>
            <li><Link to="/xpath-tester" className="text-primary hover:underline">Convert XML to JSON</Link></li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Further Reading</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><Link to="/what-is-json" className="text-primary hover:underline">What Is JSON? A Beginner-Friendly Introduction</Link></li>
            <li><Link to="/json-vs-xml" className="text-primary hover:underline">JSON vs XML: What's the Difference?</Link></li>
            <li><Link to="/json-web-apis-history" className="text-primary hover:underline">How JSON Changed Web APIs</Link></li>
          </ul>

          <p className="text-gray-700 mt-4">
            <strong>jsonxmlkit.com</strong> offers fast and secure JSON tools that run fully in your browser—no data sent, no server-side processing.
          </p>
        </section>
      </div>
    </div>
  );
};

export default JsonApiSecurityBestPractices;
