import { Routes, Route } from "react-router-dom";

// Layout & shared components
import MainLayout from "./components/MainLayout";
import ErrorPage from "./components/Error/Error";

// Pages
import Home from "./pages/Home/Home";
import WorkerList from "./pages/WorkerList/WorkerList";
import WorkerProfile from "./pages/WorkerProfile/WorkerProfile";
import WorkerRegister from "./pages/WorkerRegister/WorkerRegister";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProfileSettings from "./pages/ProfileSettings/ProfileSettings";
import UserProfile from "./pages/ViewProfile/UserProfile";
import ReviewPage from "./pages/Review/ReviewPage";
import Contact from "./pages/Contact/Contact";
import Privacy from "./pages/Privacy/Privacy";
import Terms from "./pages/Terms/Terms";
import About from "./pages/About/About";
import Help from "./pages/Help/Help";
import AdminDashboard from "./pages/Admin/Admin";
import AdminEnroll from "./components/AdminEnroll";
import MostWanted from "./pages/MostWanted/MostWanted";
import PricingPage from "./pages/Pricing/Price";
import Refund from "./pages/Refund/Refund";
import WhyGjejnjerin from "./pages/Why/Why";
import Email from "./pages/Email/Email";

function AppRoutes({ initialData = null }) {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="workers" element={<WorkerList />} />
        <Route
          path="worker/:id"
          element={<WorkerProfile initialData={initialData} />}
        />
        <Route path="register" element={<WorkerRegister />} />
        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="settings" element={<ProfileSettings />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="about" element={<About />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="help" element={<Help />} />
        <Route path="refund" element={<Refund />} />
        <Route
          path=":slug"
          element={<WorkerProfile initialData={initialData} />}
        />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="enroll" element={<AdminEnroll />} />
        <Route path="wanted" element={<MostWanted />} />
        <Route path="bashkohu" element={<WhyGjejnjerin />} />
        <Route path="email/:action" element={<Email />} />
      </Route>

      {/* Review pages intentionally remain outside MainLayout */}
      <Route path="review/:token" element={<ReviewPage />} />

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default AppRoutes;