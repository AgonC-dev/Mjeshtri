
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";

import { AppProviders } from "./App.jsx";
import AppRoutes from "./AppRoutes.jsx";

export function render(url, initialData) {
  const helmetContext = {};

  const appHtml = renderToString(
    <React.StrictMode>
      <AppProviders helmetContext={helmetContext}>
        <StaticRouter location={url}>
          <AppRoutes initialData={initialData} />
        </StaticRouter>
      </AppProviders>
    </React.StrictMode>
  );

  return {
    appHtml,
    helmet: helmetContext.helmet,
  };
}
