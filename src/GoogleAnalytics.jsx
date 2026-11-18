
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GA_ID = import.meta.env.VITE_GA_ID;

export default function GoogleAnalytics() {
  const location = useLocation();

  // Initialize Google Analytics once
  useEffect(() => {
    if (!GA_ID || window.gtag) return;

    window.dataLayer = window.dataLayer || [];

    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());

    window.gtag("config", GA_ID, {
      send_page_view: false,
    });

    const script = document.createElement("script");
    script.id = "ga-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;

    document.head.appendChild(script);
  }, []);

  // Track SPA navigation
  useEffect(() => {
    if (!window.gtag || !GA_ID) return;

    window.gtag("event", "page_view", {
      page_path: location.pathname + location.search,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [location]);

  return null;
}
