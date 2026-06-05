import React from "react";
import "./Careers.css";
import logo from "../assets/head.png";

const teams = [
  "Business Development",
  "Communications",
  "Customer Support",
  "Data & Research",
  "Editorial & Video",
  "Engineering",
  "Finance & Administration",
  "Legal & Compliance",
  "Marketing",
  "Operations, Strategy & Project Management",
  "Product & Design",
  "Quantitative Strategy",
  "Security & IT Helpdesk",
  "HR",
  "Binance Seeds",
];

export default function Careers() {
  return (
    <div className="careers">

      {/* HERO1 */}
      {/* HERO1 */}
<section className="hero1">
  <div className="hero1-content">
    
    <div className="hero1-text">
      <h1>Careers at SwanCore</h1>
      <p>Join our quest to increase the Freedom of Money</p>
    </div>

    <div className="hero1-image">
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 14px", borderRadius: 10, background: "#ff8c32", border: "1px solid #ff8c32" }}>
        <img src={logo} alt="SwanCore Logo" style={{ width: 32, height: 32, borderRadius: 4, objectFit: "contain", background: "#0b0e11", padding: 2 }} />
        <span style={{ color: "var(--text-current)", fontSize: 18, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif" }}>SwanCore</span>
      </div>
    </div>

  </div>
</section>

      {/* SEEDS */}
      <section className="card-section">
        <h2>Binance Seeds</h2>
        <p>
          Are you an early-career professional eager to launch your career?
          Discover programs designed to help you get started!
        </p>
      </section>

      {/* EXCHANGE WORLD */}
      <section className="card-section">
        <h2>Exchange the World with SwanCore</h2>
        <p>Five values. One team. Infinite impact.</p>
      </section>

      {/* VALUES */}
      <section className="values">
        <h2>Our Values</h2>
        <p className="sub">
          Core values guide our behavior and decisions across global teams.
        </p>

        <div className="grid">

          <div className="box">
            <h3>User-Focused</h3>
            <p>We protect users by delivering quality and putting them first.</p>
          </div>

          <div className="box">
            <h3>Collaboration</h3>
            <p>We communicate openly and build together as one team.</p>
          </div>

          <div className="box">
            <h3>Hardcore</h3>
            <p>We are results-driven and learn fast from failure.</p>
          </div>

          <div className="box">
            <h3>Freedom</h3>
            <p>We act responsibly, empower others, and challenge norms.</p>
          </div>

          <div className="box">
            <h3>Humility</h3>
            <p>We accept feedback and treat everyone equally.</p>
          </div>

        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div>
          <h2>110+</h2>
          <p>Nationalities</p>
        </div>
        <div>
          <h2>5000+</h2>
          <p>Employees</p>
        </div>
        <div>
          <h2>100+</h2>
          <p>Locations</p>
        </div>
      </section>

      {/* TEAMS */}
      <section className="teams">
        <h2>Choose Your Team</h2>
        <p>Select a team relevant to your interests.</p>

        <div className="team-grid">
          {teams.map((team, index) => (
            <div key={index} className="team-card">
              {team}
            </div>
          ))}
        </div>
      </section>

      {/* WORK WITH US */}
      <section className="work">
        <h2>Work With Us</h2>

        <div className="grid">

          <div className="box">
            <h3>Thrive with SwanCore</h3>
            <p>
              Our success comes from talented, hardworking and passionate people.
            </p>
          </div>

          <div className="box">
            <h3>Inspire through Innovation</h3>
            <p>
              Build the future of crypto, blockchain and distributed systems.
            </p>
          </div>

          <div className="box">
            <h3>Bridge the Gap</h3>
            <p>
              Transform products and grow in a fast expanding environment.
            </p>
          </div>

        </div>
      </section>

      {/* BENEFITS */}
      <section className="benefits">
        <h2>Why Work Here</h2>

        <div className="grid3">

          <div className="box">
            <h3>1</h3>
            <ul>
              <li>Competitive salary</li>
              <li>Paid in crypto option</li>
              <li>Health insurance</li>
              <li>Flexible hours</li>
            </ul>
          </div>

          <div className="box">
            <h3>2</h3>
            <ul>
              <li>Remote work</li>
              <li>Company holidays</li>
              <li>Team activities</li>
              <li>Extra perks</li>
            </ul>
          </div>

          <div className="box">
            <h3>3</h3>
            <ul>
              <li>Learning programs</li>
              <li>Language classes</li>
              <li>Relocation support</li>
              <li>International growth</li>
            </ul>
          </div>

        </div>
      </section>

      {/* HIRING */}
      <section className="hiring">
        <h2>How We Hire</h2>
        <p>2–4 week process with 4 interviews</p>

        <div className="steps">
          <div>01<br />Application Review</div>
          <div>02<br />Interviews</div>
          <div>03<br />Offer</div>
          <div>04<br />Onboarding</div>
        </div>
      </section>

    </div>
  );
}