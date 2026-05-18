import React from "react";

export default function FAQSection({ faqs, activeIndex, onToggle }) {
  return (
    <section className="faq-section" aria-labelledby="faq-section-title">
      <div className="section-header">
        <p className="eyebrow">Questions answered</p>
        <h2 id="faq-section-title">Straightforward answers for the modern trader.</h2>
      </div>

      <div className="faq-grid">
        {faqs.map((item, index) => (
          <div key={item.q} className={`faq-card ${activeIndex === index ? "faq-card--active" : ""}`}>
            <button
              type="button"
              className="faq-card__question"
              onClick={() => onToggle(index)}
              aria-expanded={activeIndex === index}
            >
              <span>{item.q}</span>
              <span className="faq-toggle">{activeIndex === index ? "−" : "+"}</span>
            </button>
            {activeIndex === index && (
              <div className="faq-card__answer" dangerouslySetInnerHTML={{ __html: item.a }} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
