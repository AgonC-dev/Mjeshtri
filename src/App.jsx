import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HelmetProvider } from "react-helmet-async";

// Layouts & Components
import MainLayout from "./components/MainLayout";
import ErrorPage from "./components/Error/Error";
import Maintenance from "./pages/Maintenance/Maintenance";

// Pages
import Home from "./pages/Home/Home";
import WorkerList from "./pages/WorkerList/WorkerList";
import WorkerProfile from "./pages/WorkerProfile/WorkerProfile";
import WorkerRegister from "./pages/WorkerRegister/WorkerRegister";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProfileSettings from "./pages/ProfileSettings/ProfileSettings";
import UserProfile from './pages/ViewProfile/UserProfile';


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