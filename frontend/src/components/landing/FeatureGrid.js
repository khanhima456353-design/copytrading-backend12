import React from "react";

const features = [
  {
    title: "Signal clarity",
    description: "Focus on the outcome with a calm interface designed for fast decisions and easy portfolio risk control.",
  },
  {
    title: "Institutional safety",
    description: "Multi-layer encryption, cold storage, and audit-ready reporting keep funds protected and compliant.",
  },
  {
    title: "Real-time intelligence",
    description: "Live market insights, news, and order flow that help traders move with confidence.",
  },
];

export default function FeatureGrid() {
  return (
    <section className="feature-grid" aria-labelledby="feature-grid-title">
      <div className="section-header">
        <p className="eyebrow">Core platform advantages</p>
        <h2 id="feature-grid-title">A refined trading experience built for growth.</h2>
      </div>

      <div className="feature-grid__cards">
        {features.map((feature) => (
          <article key={feature.title} className="feature-card">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
