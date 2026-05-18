import React from "react";
import { useNavigate } from "react-router-dom";

export default function HeroSection({ users }) {
  const navigate = useNavigate();

  return (
    <section className="landing-hero" aria-labelledby="landing-hero-title">
      <div className="landing-hero__content">
        <span className="eyebrow">Trusted by serious traders and institutions</span>
        <h1 id="landing-hero-title">
          Crypto execution that feels premium, secure, and built for scale.
        </h1>
        <p>
          Swipe between real-time markets, preserve funds with institutional-grade risk controls,
          and launch complex strategies without the distraction of a tired exchange interface.
        </p>

        <div className="landing-hero__meta">
          <div>
            <span className="meta-value">{users.toLocaleString()}</span>
            <span className="meta-label">verified users</span>
          </div>
          <div>
            <span className="meta-value">98%</span>
            <span className="meta-label">customer satisfaction</span>
          </div>
          <div>
            <span className="meta-value">4.9/5</span>
            <span className="meta-label">review score</span>
          </div>
        </div>

        <div className="landing-hero__actions">
          <button className="button button--primary" onClick={() => navigate("/register")}>Get Started</button>
          <button className="button button--secondary" onClick={() => navigate("/login")}>Start trading</button>
        </div>
      </div>

      <div className="landing-hero__panel" aria-hidden="true">
        <div className="panel-card panel-card--soft">
          <span className="panel-label">Live market snapshot</span>
          <div className="panel-value">Spot, Futures, Earn</div>
          <p>See the next generation crypto platform built for professional flow and clarity.</p>
        </div>
        <div className="panel-card panel-card--accent">
          <span className="panel-label">Fast execution</span>
          <div className="panel-value">0.08s average fill</div>
        </div>
        <div className="panel-card panel-card--soft panel-card--overlay">
          <span className="panel-label">Compliance-first</span>
          <div className="panel-value">Global licensing ready</div>
        </div>
      </div>
    </section>
  );
}
