import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import AppRoutes from "./AppRoutes";
import Maintenance from "./pages/Maintenance/Maintenance";
import SuspensionGuard from "./components/SusoensionGuard/SuspensionGuard";
import CookieConsent from "./CookieConsent";
import GoogleAnalytics from "./GoogleAnalytics";

export function AppProviders({ children, helmetContext }) {

  // A separate QueryClient for each App instance/request.
  const [queryClient] = useState(() => new QueryClient());
  

  return (
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <Helmet>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
        </Helmet>

        {children}
      </QueryClientProvider>
    </HelmetProvider>
  );
}

function App({ initialData = null }) {
     const [analyticsAllowed, setAnalyticsAllowed] = useState(false);
  const MAINTENANCE = false;

  if (MAINTENANCE) return <Maintenance />;

  return (
    <AppProviders>
      <BrowserRouter>
      <SuspensionGuard>
         <AppRoutes initialData={initialData} />
      </SuspensionGuard>
      <CookieConsent onAccept={() => setAnalyticsAllowed(true)} />
      { analyticsAllowed && <GoogleAnalytics />}

      </BrowserRouter>

       <Analytics />
       <SpeedInsights />

      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </AppProviders>
  );
}

export default App;