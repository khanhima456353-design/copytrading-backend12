import React from "react";
import { useNavigate } from "react-router-dom";

const footerLinks = [
  { label: "About", path: "/about" },
  { label: "Careers", path: "/careers" },
  { label: "Privacy", path: "/privacy" },
  { label: "Trading", path: "/trade" },
];

export default function FooterSection() {
  const navigate = useNavigate();

  return (
    <footer className="landing-footer" aria-label="Footer navigation">
      <div className="landing-footer__top">
        <div>
          <p className="eyebrow">Ready to move forward?</p>
          <h2>Trusted infrastructure for crypto teams and ambitious traders.</h2>
        </div>
        <button className="button button--primary" onClick={() => navigate("/register")}>Create your account</button>
      </div>

      <div className="landing-footer__links">
        {footerLinks.map((link) => (
          <button key={link.label} type="button" className="link-button" onClick={() => navigate(link.path)}>
            {link.label}
          </button>
        ))}
      </div>

      <p className="landing-footer__note">SwanCore is designed for serious traders who expect clarity, speed, and institutional-grade controls.</p>
    </footer>
  );
}
