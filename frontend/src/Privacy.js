import React, { useState } from "react";
import "./privacy.css";

// ✅ IMPORTS
import PrivacyHero from "./PrivacyHero";
import RegionTable from "./RegionTable";
import PrivacyPrinciples from "./PrivacyPrinciples";

function DataUsageSection() {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div className="data-section">

      <h2 className="section-title">How Swancore uses your data</h2>

      {/* 🔥 TABS */}
      <div className="tabs">
        <span className={activeTab === "personal" ? "active" : ""} onClick={() => setActiveTab("personal")}>
          What is Personal Data?
        </span>

        <span className={activeTab === "usage" ? "active" : ""} onClick={() => setActiveTab("usage")}>
          Using your Data
        </span>

        <span className={activeTab === "retention" ? "active" : ""} onClick={() => setActiveTab("retention")}>
          Retention
        </span>

        <span className={activeTab === "sharing" ? "active" : ""} onClick={() => setActiveTab("sharing")}>
          Sharing
        </span>

        <span className={activeTab === "cookies" ? "active" : ""} onClick={() => setActiveTab("cookies")}>
          Cookies
        </span>
      </div>

      {/* 🔥 CONTENT */}
      <div className="tab-content">

        {activeTab === "personal" && (
          <div className="tab-box">
            <h3>Definition of personal data</h3>
            <p>Personal data refers to any information that identifies an individual or can be used to recognize an identifiable person. This includes details you directly share with us, information collected automatically through your use of our services, and data obtained from trusted third-party sources. Such information may include your name, Swancore ID, location data, email address, and any other data points which, when combined, could reasonably be used to identify an individual.</p>
          </div>
        )}

        {activeTab === "usage" && (
          <div className="tab-box">
            <h3>How we use your data?</h3>
            <p>We collect and process your personal data to deliver secure, reliable, and efficient services. This includes maintaining and managing your account, fulfilling legal and regulatory obligations such as Anti-Money Laundering requirements, and communicating important service-related updates. We also use this information to protect the safety, security, and integrity of our platform and its users.

In addition, your personal data may be used to provide customer support, enhance and improve our services, send relevant marketing communications where permitted, and facilitate smooth and efficient transaction processing across our platform.</p>
          </div>
        )}

        {activeTab === "retention" && (
          <div className="tab-box">
            <h3>Data retention</h3>
            <p>We retain your personal data for as long as it is necessary to provide you with continued access to SwanCore services and to ensure a secure and compliant user experience. This retention is based on the purposes outlined in our Privacy Notice, including fulfilling legal and regulatory obligations such as taxation, accounting standards, Anti-Money Laundering requirements, as well as managing disputes, legal claims, and other compliance-related needs where applicable.

For detailed information on how long specific categories of personal data are stored, please refer to the Privacy Notice relevant to your jurisdiction by selecting your country of residence through the link below.</p>
          </div>
        )}

        {activeTab === "sharing" && (
          <div className="tab-box">
            <h3>Is my data shared with third parties?</h3>
            <p>In accordance with applicable laws, regulations, and compliance requirements, we may share your personal data with trusted third parties, including other SwanCore affiliated entities, where necessary to fulfill contractual obligations, meet legal and regulatory duties, or support essential business operations.

Whenever such sharing takes place, we ensure your data remains protected through our Privacy Notice provisions or other appropriate safeguard mechanisms designed to maintain the highest standards of privacy, security, and data integrity.</p>
          </div>
        )}

        {activeTab === "cookies" && (
          <div className="tab-box">
            <h3>How do we use cookies?</h3>
            <p>We utilize cookies and similar technologies to improve your overall experience, optimize the delivery of our services, and support more effective marketing strategies. These tools also help us understand how users interact with our platform, enabling us to continuously enhance performance, usability, and customer satisfaction.

Depending on the applicable regulations in your region, the cookie consent banner on your browser allows you to manage your preferences, including accepting or rejecting certain types of cookies. For more detailed information, you can refer to our full Cookie Policy.</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default function Privacy() {
  return (
    <div className="privacy-page">

      {/* 🔥 HERO */}
      <section className="section-block">
        <PrivacyHero />
      </section>

      {/* 🔥 REGION TABLE */}
      <section className="section-block">
        <RegionTable />
      </section>

      {/* 🔥 PRINCIPLES */}
      <section className="section-block">
        <PrivacyPrinciples />
      </section>

      {/* 🔥 DATA USAGE */}
      <section className="section-block">
        <DataUsageSection />
      </section>

    </div>
  );
}