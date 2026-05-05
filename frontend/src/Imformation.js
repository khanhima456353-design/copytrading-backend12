
import React, { useState } from "react";
import "./imformation.css";
import { Link } from "react-router-dom";

export default function Imformation() {
  const [activePdf, setActivePdf] = useState(null);

  return (
    <div className="imformation-page">

      <h1>Legal & Regulatory</h1>

      <div className="imformation-grid">

        <div className="imformation-item">
          <span>Licenses, Registrations and Other Legal Matters</span>
          <a href="/legal/licenses">Here</a>
        </div>

        <div className="imformation-item">
  <span>SwanCore Terms of Use</span>

  <button
  className="link-btn"
  onClick={() => setActivePdf("terms")}
>
  Here
</button>
</div>

        <div className="imformation-item">
          <span>SwanCore Privacy Notice</span>

<Link to="/legal/privacy" className="link-btn">
  Here
</Link>
</div>

        <div className="imformation-item">
  <span>General Risk Warning</span>

  <button
    className="link-btn"
    onClick={() => setActivePdf("risk")}
  >
    Here
  </button>
</div>


        <div className="imformation-item">
          <span>Prohibited Use Policy</span>
          <button
    className="link-btn"
    onClick={() => setActivePdf("prohibited")}
  >
    Here
  </button>
</div>

        <div className="imformation-item">
          <span>Exchange Rules</span>
          <a href="/legal/exchange-rules">Here</a>
        </div>

        <div className="imformation-item">
          <span>Clearing Rules</span>
          <a href="/legal/clearing-rules">Here</a>
        </div>

        <div className="imformation-item">
          <span>Exchange Procedures</span>
          <a href="/legal/exchange-procedures">Here</a>
        </div>

        <div className="imformation-item">
          <span>Clearing Procedures</span>
          <a href="/legal/clearing-procedures">Here</a>
        </div>

        <div className="imformation-item">
          <span>Product Terms</span>
          <a href="/legal/product-terms">Here</a>
        </div>

        <div className="imformation-item">
          <span>Promotion/Campaign Terms</span>
          <a href="/legal/campaign-terms">Here</a>
        </div>

        <div className="imformation-item">
          <span>Referrals/Affiliate Terms</span>
          <a href="/legal/referrals">Here</a>
        </div>

        <div className="imformation-item">
          <span>Contract Specifications</span>
          <a href="/legal/contracts">Here</a>
        </div>

        <div className="imformation-item">
          <span>Digital Securities Documentation</span>
          <a href="/legal/digital-securities">Here</a>
        </div>

        <div className="imformation-item">
          <span>Consultation Notices</span>
          <a href="/legal/consultation">Here</a>
        </div>

        <div className="imformation-item">
          <span>Amendment Notices</span>
          <a href="/legal/amendments">Here</a>
        </div>

        <div className="imformation-item">
          <span>Policy</span>
        </div>

        <div className="imformation-item">
          <span>Regulatory Engagement</span>
          <a href="/legal/regulatory">Here</a>
        </div>

        <div className="imformation-item">
          <span>Thought Leadership</span>
          <a href="/legal/thought-leadership">Here</a>
        </div>

    </div>

  
 {/* ✅ MODAL INSIDE RETURN */}
      {activePdf && (
  <div className="pdf-overlay" onClick={() => setActivePdf(null)}>
    <div className="pdf-modal" onClick={(e) => e.stopPropagation()}>

      <button className="close-btn" onClick={() => setActivePdf(null)}>
        ✕
      </button>

      {activePdf === "terms" && (
        <iframe
          src="/swancore_terms.pdf"
          className="pdf-frame"
          title="Terms of Use"
        />
      )}

      {activePdf === "risk" && (
        <iframe
          src="/swancore_risk_warning.pdf"
          className="pdf-frame"
          title="Risk Warning"
        />
      )}

      {activePdf === "prohibited" && (
  <iframe
    src="/prohibited_use_policy_swancore.pdf"
    className="pdf-frame"
    title="Prohibited Use Policy"
  />
)}

    </div>
  </div>
)}
 </div>
  );
}