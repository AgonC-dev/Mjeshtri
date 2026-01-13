import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import WorkerList from "./pages/WorkerList/WorkerList";
import WorkerProfile from "./pages/WorkerProfile/WorkerProfile";
import WorkerRegister from "./pages/WorkerRegister/WorkerRegister";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import styles from "./App.module.css";
import ProfileSettings from "./pages/ProfileSettings/ProfileSettings";
import Maintenance from "./pages/Maintenance/Maintenance";

const queryClient = new QueryClient();

function App() {

 const MAINTENANCE = true;

 if (MAINTENANCE) {
    return <Maintenance />
 }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className={styles.app}>
          <Header />
          <main className={styles.main}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/workers" element={<WorkerList />} />
              <Route path="/worker/:fullName" element={<WorkerProfile />} />
              <Route path="/register" element={<WorkerRegister />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<ProfileSettings />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
