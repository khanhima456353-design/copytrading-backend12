import React from "react";

const metrics = [
  { label: "Liquidity depth", value: "$3.2B" },
  { label: "Uptime", value: "99.99%" },
  { label: "Coverage", value: "150+ markets" },
];

export default function TrustBar() {
  return (
    <section className="trust-bar" aria-label="Trust and performance metrics">
      <div className="trust-bar__copy">
        <p className="trust-bar__eyebrow">Enterprise-grade, customer-focused execution</p>
        <p>Secure fund custody, transparent fees, and global support for advanced crypto flows.</p>
      </div>

      <div className="trust-bar__metrics">
        {metrics.map((metric) => (
          <div key={metric.label} className="trust-bar__metric">
            <span className="trust-bar__value">{metric.value}</span>
            <span className="trust-bar__label">{metric.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
