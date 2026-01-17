import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer';

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="container" style={{ flex: 1, padding: "2rem 0" }}>
        <Outlet /> {/* This is where WorkerList, Dashboard, etc. will show up */}
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;