import React, { useState, useEffect } from 'react';
import "./App.css";
import "./i18n";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { DevicesProvider } from './context/DevicesContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import StreamsPage from './pages/StreamsPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <AuthProvider>
      <DevicesProvider>
        <div className={`App min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors`}>
          <BrowserRouter>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/streams" element={<StreamsPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
              </Routes>
            </main>
            <Footer />
          </BrowserRouter>
        </div>
      </DevicesProvider>
    </AuthProvider>
  );
}

export default App;
