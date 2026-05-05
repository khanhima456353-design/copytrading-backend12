import React from "react";
import "./privacy.css";

export default function PrivacyHero() {
  return (
    <div className="privacy-hero">

      <div className="hero-text">
        <h1>Swancore Privacy Portal</h1>
        <h3>Your Data, Your Control</h3>
        <p>
          Welcome to our Privacy Portal.

This page is designed to help you easily understand the key aspects of our Privacy Program and clearly know your rights regarding your personal data.

At SwanCore, we are fully committed to protecting your privacy and securing your information. Safeguarding your personal data is a top priority for us. We follow strict internal controls, global regulatory standards, and industry-leading security practices to ensure your data remains protected, confidential, and used only for legitimate and authorized financial purposes.
        </p>
      </div>

      <div className="hero-image">
        <img src="/privacy/lock.png" alt="Privacy Lock" />
      </div>

    </div>
  );
}