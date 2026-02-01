import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Helmet, HelmetProvider } from "react-helmet-async";

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
import ReviewPage from "./pages/Review/ReviewPage";
import Contact from "./pages/Contact/Contact";
import Privacy from "./pages/Privacy/Privacy";
import Terms from "./pages/Terms/Terms";
import About from "./pages/About/About";
import ReviewDropDown from "./pages/ReviewDropDown/ReviewDropDown";
import Help from "./pages/Help/Help";


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
      { path: "contact", element: <Contact />},
      { path: "privacy", element: <Privacy />},
      { path: "terms", element: <Terms />},
      { path: "about", element: <About />},
      { path: "review", element: <ReviewDropDown />},
      { path: "help", element: <Help />}
    ],
  },
    {path: "review/:token", element: <ReviewPage />},
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