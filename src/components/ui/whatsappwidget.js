// components/WhatsappWidget.js
'use client'
import { useEffect } from 'react';

const WhatsappWidget = () => {
  useEffect(() => {
    // Inject the script tag for the widget
    const script = document.createElement('script');
    script.src = 'https://d2mpatx37cqexb.cloudfront.net/delightchat-whatsapp-widget/embeds/embed.min.js';
    script.async = true;
    document.body.appendChild(script);

    // Set WhatsApp config once script is loaded
    script.onload = () => {
      const wa_btnSetting = {
        btnColor: "#16BE45",
        ctaText: "",
        cornerRadius: 40,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
        btnPosition: "right",
        whatsAppNumber: "234808270997",
        welcomeMessage: "Good day, Elite Support",
        zIndex: 999999,
        btnColorScheme: "light",
      };
      window._waEmbed && window._waEmbed(wa_btnSetting);
    };

    return () => {
      // Cleanup if needed (optional)
      document.body.removeChild(script);
    };
  }, []);

  return null; // this component only injects the script
};

export default WhatsappWidget;
