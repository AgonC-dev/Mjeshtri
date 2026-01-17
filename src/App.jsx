import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HelmetProvider, Helmet } from "react-helmet-async";

import MainLayout from "./components/MainLayout";
import ErrorPage from "./components/Error/Error";
import Maintenance from "./pages/Maintenance/Maintenance";
// ... other imports

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />, // This handles errors while keeping Header/Footer if desired
    children: [
      { index: true, element: <Home /> },
      { path: "workers", element: <WorkerList /> },
      { path: "worker/:id", element: <WorkerProfile /> },
      { path: "register", element: <WorkerRegister /> },
      { path: "login", element: <Login /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "settings", element: <ProfileSettings /> },
      { path: "profile", element: <UserProfile /> },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

function App() {
  const MAINTENANCE = false;

  if (MAINTENANCE) return <Maintenance />;

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        {/* Global SEO / Viewport fix */}
        <Helmet>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        </Helmet>
        
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;