
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

const IconGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateIcon = async () => {
    setIsGenerating(true);

    try {
      // Pre-defined image URLs
      const faviconUrl = "https://images.unsplash.com/photo-1518770660439-4636190af475";
      const logoUrl = "https://images.unsplash.com/photo-1461749280684-dccba630e2f6";

      // Update the favicon link in index.html
      const faviconLink = document.querySelector("link[rel*='icon']");
      if (faviconLink) {
        faviconLink.setAttribute('href', faviconUrl);
      } else {
        // Create a new favicon link if it doesn't exist
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = faviconUrl;
        document.head.appendChild(newLink);
      }

      toast.success('Icons set successfully! The favicon has been updated.');
      
      // Display the generated images
      const previewContainer = document.getElementById('icon-preview');
      if (previewContainer) {
        previewContainer.innerHTML = `
          <div class="mt-4 space-y-4">
            <div>
              <p class="text-sm font-medium mb-2">Favicon:</p>
              <img src="${faviconUrl}" alt="Generated Favicon" class="w-16 h-16 object-cover rounded border" />
            </div>
            <div>
              <p class="text-sm font-medium mb-2">Logo:</p>
              <img src="${logoUrl}" alt="Generated Logo" class="w-full max-h-32 object-cover rounded border" />
            </div>
          </div>
        `;
      }
    } catch (error) {
      toast.error('Error setting icons. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 p-4">
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Set Site Icons</h2>
        <p className="text-sm text-gray-500">
          Click the button below to set a pre-defined favicon and logo for the site.
        </p>
      </div>
      <Button
        onClick={generateIcon}
        disabled={isGenerating}
        className="w-full"
      >
        {isGenerating ? 'Setting Icons...' : 'Set Icons'}
      </Button>
      <div id="icon-preview" className="mt-4"></div>
    </div>
  );
};

export default IconGenerator;
