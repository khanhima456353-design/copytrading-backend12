import React from "react";
import "./privacy.css";

export default function RegionTable() {
  return (
    <div className="region-container">
      <h1 className="title">Privacy Notice Dashboard</h1>

      <div className="region-table">

        {/* GLOBAL */}
        <div className="row full">GLOBAL</div>

        {/* APAC */}
        <div className="row full section">APAC</div>

        <div className="row">
          <div className="cell">Australia</div>
          <div className="cell">Japan (Japanese | English)</div>
        </div>

        <div className="row">
          <div className="cell">New Zealand</div>
          <div className="cell"></div>
        </div>

        {/* EUROPE */}
        <div className="row full section">Europe</div>

        <div className="row">
          <div className="cell">France</div>
          <div className="cell">Italy</div>
        </div>

        <div className="row">
          <div className="cell">Poland</div>
          <div className="cell">Portugal</div>
        </div>

        <div className="row">
          <div className="cell">Spain</div>
          <div className="cell">UK</div>
        </div>

        {/* LATAM */}
        <div className="row full section highlight">LATAM</div>

        <div className="row">
          <div className="cell">Argentina</div>
          <div className="cell">Brazil</div>
        </div>

        <div className="row">
          <div className="cell wide">
            Latin America, excluding Argentina, Mexico and Brazil
          </div>
          <div className="cell">Mexico</div>
        </div>

        {/* MENA */}
        <div className="row full section">MENA</div>

        <div className="row">
          <div className="cell">Bahrain (Arabic | English)</div>
          <div className="cell">Dubai</div>
        </div>

        <div className="row">
          <div className="cell">Kazakhstan (Kazakh | Russian)</div>
          <div className="cell"></div>
        </div>

      </div>
    </div>
  );
}