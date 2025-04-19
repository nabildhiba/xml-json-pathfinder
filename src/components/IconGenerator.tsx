
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RunwareService } from '@/services/RunwareService';
import { toast } from 'sonner';

const IconGenerator = () => {
  const [apiKey, setApiKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateIcon = async () => {
    if (!apiKey) {
      toast.error('Please enter your Runware API key');
      return;
    }

    setIsGenerating(true);
    const runware = new RunwareService(apiKey);

    try {
      const faviconPrompt = "A minimalist icon for a JSON and XML web tool. Simple, modern, abstract representation of code or data structure. Use vivid purple (#8B5CF6) as the main color. Clean vector style, suitable for favicon.";
      const logoPrompt = "A modern, professional logo for JSONXMLKit - a web tool for JSON and XML formatting. Incorporate coding symbols or brackets. Use vivid purple (#8B5CF6) as the main color. Clean vector style.";

      const [favicon, logo] = await Promise.all([
        runware.generateImage({ positivePrompt: faviconPrompt, width: 512, height: 512 }),
        runware.generateImage({ positivePrompt: logoPrompt, width: 1024, height: 512 })
      ]);

      // Update the favicon link in index.html
      const faviconLink = document.querySelector("link[rel*='icon']");
      if (faviconLink) {
        faviconLink.setAttribute('href', favicon.imageURL);
      }

      toast.success('Icons generated successfully! Check the preview below.');
    } catch (error) {
      toast.error('Error generating icons. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 p-4">
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Generate Site Icons</h2>
        <p className="text-sm text-gray-500">
          Enter your Runware API key to generate a favicon and logo for the site.
          Get your API key at <a href="https://runware.ai" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">runware.ai</a>
        </p>
      </div>
      <Input
        type="password"
        placeholder="Enter your Runware API key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />
      <Button
        onClick={generateIcon}
        disabled={isGenerating}
        className="w-full"
      >
        {isGenerating ? 'Generating...' : 'Generate Icons'}
      </Button>
    </div>
  );
};

export default IconGenerator;
