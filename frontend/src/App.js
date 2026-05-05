import React from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";

// Pages
import Login from "./pages/Login";
import Markets from "./Markets";
import Discover from "./Discover";
import Privacy from "./Privacy";
import Terms from "./Terms";
import Cookies from "./Cookies";
import Landing from "./Landing";
import News from "./News";
import About from "./About";
import LegalPage from "./LegalPage";
import Careers from "./pages/Careers";
import Imformation from "./Imformation";
import BuildingTrust from "./pages/BuildingTrust";
import Trading from './pages/Trading.tsx';



export default function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/news" element={<News />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/about" element={<About />} />
        <Route path="/legal" element={<LegalPage />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/imformation" element={<Imformation />} />
        <Route path="/legal/privacy" element={<Privacy />} />
        <Route path="/trade" element={<Trading />} />
        <Route path="/building-trust" element={<BuildingTrust />} />
      </Routes>
    </>
  );
}