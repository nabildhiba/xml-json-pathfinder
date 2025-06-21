
import React from 'react';
import HomeButton from '@/components/HomeButton';
import { Link } from 'react-router-dom';

const JsonVulnerabilities = () => {
  return (
    <div className="min-h-screen bg-white relative">
      <HomeButton />
      
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">Common JSON Vulnerabilities Every Developer Should Know</h1>

        <p className="text-lg text-gray-700 mb-8">
          JSON is the default format for modern APIs, web applications, and microservices. But while it's lightweight and easy to use, it's not immune to security risks. Improper use of JSON can lead to serious vulnerabilities in your applications.
        </p>

        <p className="text-gray-700 mb-8">
          In this article, we'll explore the most common JSON-related security issues and how to prevent them.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. JSON Injection</h2>
          <p className="text-gray-700 mb-4">
            JSON injection occurs when untrusted input is directly embedded into a JSON structure without validation or sanitization. This can allow attackers to manipulate the logic of a request or response.
          </p>
          
          <h3 className="text-xl font-semibold mb-2">Example</h3>
          <pre className="bg-gray-100 p-4 rounded mb-4 overflow-x-auto">
            <code>{`// Dangerous
const payload = \`{ "user": "\${input}" }\`;`}</code>
          </pre>

          <p className="text-gray-700">
            <strong>Fix:</strong> Always use safe JSON encoding libraries or stringify data properly.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Excessive Data Exposure</h2>
          <p className="text-gray-700 mb-4">
            Some APIs return full user objects, including internal or sensitive fields such as passwords, tokens, or roles. JSON makes this easy to overlook—especially if you're returning database objects directly.
          </p>
          <p className="text-gray-700">
            <strong>Fix:</strong> Use serialization filters or DTOs to limit what gets returned in JSON responses.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Mass Assignment (Over-posting)</h2>
          <p className="text-gray-700 mb-4">
            Attackers can add unexpected fields to JSON payloads (e.g., <code className="bg-gray-100 px-2 py-1 rounded">"isAdmin": true</code>) and exploit backend models that bind incoming data directly to database entities.
          </p>
          <p className="text-gray-700">
            <strong>Fix:</strong> Explicitly whitelist allowed fields when parsing JSON, and avoid blind mapping.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Large JSON Payloads (DoS Risk)</h2>
          <p className="text-gray-700 mb-4">
            APIs that don't limit input size can be overwhelmed by large or deeply nested JSON payloads, leading to memory exhaustion or parser crashes.
          </p>
          <p className="text-gray-700">
            <strong>Fix:</strong> Enforce maximum payload size on the server and limit recursion depth if using custom parsers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. JSON Hijacking</h2>
          <p className="text-gray-700 mb-4">
            This legacy attack targets older browsers by exploiting insecure JSON responses (especially when using <code className="bg-gray-100 px-2 py-1 rounded">text/html</code> content-type). The attacker tricks the browser into loading JSON via a script tag.
          </p>
          <p className="text-gray-700">
            <strong>Fix:</strong> Always set <code className="bg-gray-100 px-2 py-1 rounded">Content-Type: application/json</code>, and avoid returning JSON arrays as top-level objects.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Lack of JSON Schema Validation</h2>
          <p className="text-gray-700 mb-4">
            Without strict schema validation, APIs may accept malformed or malicious JSON structures that could cause undefined behavior.
          </p>
          <p className="text-gray-700">
            <strong>Fix:</strong> Use tools like <a href="https://ajv.js.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">AJV</a> to enforce schemas on all incoming payloads.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Log Leakage</h2>
          <p className="text-gray-700 mb-4">
            JSON payloads often include sensitive info like emails, tokens, or full names. If logs are not filtered, attackers (or employees) could access this information via logs.
          </p>
          <p className="text-gray-700">
            <strong>Fix:</strong> Sanitize logs and exclude fields like passwords, secrets, or personal data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">🛠️ Need to Convert JSON Safely?</h2>
          <p className="text-gray-700 mb-4">
            Looking for a secure way to convert JSON to XML or vice versa? Use a <strong>client-side tool</strong> that doesn't send your data to a remote server.
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
            <li><Link to="/json-tester" className="text-primary hover:underline">Convert JSON to XML</Link></li>
            <li><Link to="/xpath-tester" className="text-primary hover:underline">Convert XML to JSON</Link></li>
          </ul>
          <p className="text-gray-700">
            <strong>jsonxmlkit.com</strong> processes everything locally in your browser—no server logs, no data stored.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Further Reading</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><Link to="/json-api-security-best-practices" className="text-primary hover:underline">JSON + REST APIs: Best Practices for Secure Data Exchange</Link></li>
            <li><Link to="/what-is-json" className="text-primary hover:underline">What Is JSON?</Link></li>
            <li><Link to="/top-json-tools-2025" className="text-primary hover:underline">Top 5 JSON Tools You Should Be Using in 2025</Link></li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default JsonVulnerabilities;
