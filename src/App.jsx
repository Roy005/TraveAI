import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Planner from './pages/Planner';
import Results from './pages/Results';
import Explorer from './pages/Explorer';
import Bookings from './pages/Bookings';
import Destinations from './pages/Destinations';
import Login from './pages/Login';
import Register from './pages/Register';
import TripHistory from './pages/TripHistory';
import NotFound from './pages/NotFound';

const AnimatedRoutes = () => {
  const location = useLocation();

  // Pages that should hide navbar/footer
  const authPages = ['/login', '/register'];
  const isAuthPage = authPages.includes(location.pathname);

  return (
    <>
      {!isAuthPage && <Navbar />}
      <main style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/results" element={<Results />} />
            <Route path="/explorer" element={<Explorer />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/trips" element={<TripHistory />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isAuthPage && <Footer />}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
