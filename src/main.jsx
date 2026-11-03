import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";

import App from "./App.jsx";
import "./index.css";

const rootElement = document.getElementById("root");

const initialData =
  window.__GJEJNJERIN_INITIAL_DATA__ || null;

const app = (
  <React.StrictMode>
    <App initialData={initialData} />
  </React.StrictMode>
);

if (window.__GJEJNJERIN_SSR__ === true) {
  // Attach React to the HTML already rendered by the server.
  hydrateRoot(rootElement, app);
} else {
  // Normal SPA behavior for pages that aren't server-rendered.
  createRoot(rootElement).render(app);
}