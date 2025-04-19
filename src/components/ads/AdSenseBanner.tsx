
import React, { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const AdSenseBanner = () => {
  useEffect(() => {
    try {
      const pushAd = () => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      };
      pushAd();
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className="w-full mb-8">
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          height: '90px',
          marginBottom: '1rem'
        }}
        data-ad-client="ca-pub-7479735239636417"
        data-ad-slot="2770178735"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
