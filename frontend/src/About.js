import React, { useState, useRef } from "react";
import "./about.css";
import { Link } from "react-router-dom";

export default function About() {
  const [activeMember, setActiveMember] = useState(null);

  /* ================= REFS ================= */
  const zakirRef = useRef(null);
  const tinRef = useRef(null);

  /* ================= MEMBERS ================= */
  const members = [
    "Zakir Khan",
    "Tin Wang",
    "Max Zang",
    "Richard Jeng",
    "Roger Smith",
    "Salman Hussain"
  ];

  /* ================= DETAILS ================= */
  const zakirDetails = `
Zakir Khan is a globally recognized technology entrepreneur, experienced board member, and former diplomat known for his work at the intersection of regulatory innovation and financial technology. With over 13 years in the blockchain sector, he has navigated complex financial systems across Asia, the Middle East, Europe, and the United States, working within diverse regulatory environments and industries.

Mr. Khan played a key role in strengthening international relations by helping establish Barbados’ diplomatic presence in the Middle East, serving as Ambassador to the United Arab Emirates and Non-Resident Ambassador to Kuwait.

In 2013, he became the founding CEO of Bitt, a pioneering company behind one of the earliest Central Bank Digital Currency (CBDC) initiatives. He later co-founded Digital Asset Capital Management (DACM) in 2016, a hedge fund that quickly gained recognition as a top performer in the digital asset space.

In April 2018, he was appointed Special Technology Advisor to Bermuda’s Prime Minister, David Burt. He also contributed to global policy discussions as part of the World Economic Forum’s Global Future Council on Cryptocurrencies.

He holds a Bachelor’s Degree in Information Technology with a specialization in Network Security from Ontario Tech University and has received an Honorary Doctorate in Law from the University of the West Indies.

As Chairman of SwanCore’s Board of Directors, he focuses on collaboration between governments, regulators, and technology leaders worldwide.
`;

  const tinDetails = `
Tin Wang is a highly qualified legal and financial professional, recognized for her expertise across Asian and international markets. She is admitted to practice law in the State of California and is also a Solicitor of England and Wales. With extensive experience in leveraged finance, acquisitions, project financing, and mergers & acquisitions (M&A), she brings a strong financial and regulatory perspective to cross-border transactions.

Ms. Wang serves as an independent board member of SwanCore’s Board of Directors, focusing on financial structuring, compliance, and global expansion.

She is the CEO of Bayview Acquisition Corp and a consulting partner at BHR Partners.

She holds a Bachelor of Commerce from McGill University and a Juris Doctor from Boston University School of Law.
`;

  /* ================= CLICK HANDLER ================= */
  const handleClick = (name) => {
    setActiveMember(name);

    setTimeout(() => {
      if (name === "Zakir Khan") {
        zakirRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

      if (name === "Tin Wang") {
        tinRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }, 100);
  };

  return (
    <div className="about-page">

      {/* HERO */}
      <div className="about-hero">
        <h1>Welcome to SwanCore</h1>
        <p>
          At SwanCore, we believe everyone deserves the freedom to earn, store,
          spend, share, and transfer their money—regardless of who they are or where they come from.
        </p>
      </div>

      {/* STATS */}
      <div className="about-stats">
        <div>
          <h2>$65 bn</h2>
          <p>Average daily trading volume</p>
        </div>
        <div>
          <h2>300 bn</h2>
          <p>Spot transactions in 2022</p>
        </div>
        <div>
          <h2>24/7</h2>
          <p>Customer support in 40+ languages</p>
        </div>
      </div>

      {/* MISSION */}
      <div className="about-section">
        <h2>Our Mission</h2>
        <p>
          Today, SwanCore stands as a leading blockchain ecosystem, offering a wide
          range of products including one of the largest digital asset exchanges.
          Our mission is to build the infrastructure that will power the future of crypto and digital finance.
        </p>
      </div>

      {/* ECOSYSTEM */}
      <div className="about-section">
        <h2>Our Ecosystem</h2>

        <div className="grid">
          <div className="card"><h3>SwanCore Exchange</h3><p>SwanCore ranks among the largest digital asset exchanges by trading volume and is regulated by the ADGM Financial Services Regulatory Authority, ensuring compliance within the crypto and digital finance ecosystem.</p></div>
          <div className="card"><h3>SwanCore Research</h3><p>SwanCore Research offers institutional-grade research, comprehensive market insights, and unbiased intelligence for stakeholders across the digital asset and cryptocurrency markets.</p></div>
          <div className="card"><h3>SwanCore Academy</h3><p>SwanCore Academy is a global open-learning platform delivering free education in blockchain technology, cryptocurrency, and digital financial systems in 10+ languages.</p></div>
          <div className="card"><h3>SwanCore Charity</h3><p>Swancore Charity is a non-profit initiative focused on leveraging Web3, blockchain, and digital finance innovations to create positive global social impact and drive meaningful change.</p></div>
          <div className="card"><h3>SwanCore NFT</h3><p>Swancore NFT is the official digital asset marketplace within the Swancore ecosystem, designed to support a community-driven platform that enhances user experience in crypto, blockchain, and digital asset trading.</p></div>
          <div className="card"><h3>SwanCore Square</h3><p>Swancore Square is a unified real-time hub for the latest trends in Web3, crypto markets, and digital finance, bringing together insights from industry experts, analysts, enthusiasts, and media sources as they emerge live across the ecosystem.</p></div>
        </div>
      </div>

      {/* VALUES SECTION */}
<div className="bg-[#0b0e11] text-[#EAECEF] py-20 px-6 md:px-16">

  {/* Title */}
  <div className="text-center mb-14">
    <h2 className="text-4xl font-semibold">
      Putting Our Users First
    </h2>
    <p className="text-gray-400 mt-3 max-w-2xl mx-auto text-sm">
      Security, compliance, and trust built into every layer of SwanCore.
    </p>
  </div>

  {/* HORIZONTAL GRID */}
  <div className="space-y-8">

    {/* ROW 1 */}
    <div className="grid md:grid-cols-2 gap-6">

      <div className="bg-[#1a1f2b] border border-[#2a2f3a] rounded-2xl p-6 hover:border-yellow-400/40 transition">
        <h3 className="text-white font-medium mb-2">
          Our Commitment to User Protection
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          Users are at the core of everything we build. We prioritize security, privacy,
          and compliance across the SwanCore ecosystem with global regulatory alignment.
        </p>
      </div>

      <div className="bg-[#1a1f2b] border border-[#2a2f3a] rounded-2xl p-6 hover:border-yellow-400/40 transition">
        <h3 className="text-white font-medium mb-2">
          Secure From Day One
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          Real-time monitoring, advanced risk systems, and continuous protection ensure
          a safe trading environment at all times.
        </p>
      </div>

    </div>

    {/* ROW 2 */}
    <div className="grid md:grid-cols-4 gap-4">
      {[
        { title: "Secure Storage", desc: "Cold storage protects majority of user assets." },
        { title: "Real-Time Monitoring", desc: "Risk engine tracks all sensitive account actions." },
        { title: "Organizational Security", desc: "Multisig + TSS infrastructure for fund safety." },
        { title: "Encryption", desc: "End-to-end encrypted data protection." }
      ].map((item, i) => (
        <div key={i} className="bg-[#1a1f2b] border border-[#2a2f3a] rounded-xl p-5 hover:border-yellow-400/40 hover:-translate-y-1 transition">
          <h4 className="text-white text-sm font-medium mb-2">{item.title}</h4>
          <p className="text-gray-400 text-xs">{item.desc}</p>
        </div>
      ))}
    </div>

    {/* ROW 3 */}
    <div className="grid md:grid-cols-3 gap-6">

      <div className="bg-[#1a1f2b] border border-[#2a2f3a] rounded-2xl p-6">
        <h3 className="text-white font-medium mb-3">Safe Sign-In</h3>
        <p className="text-gray-400 text-sm">Multi-factor authentication and hardware keys.</p>
      </div>

      <div className="bg-[#1a1f2b] border border-[#2a2f3a] rounded-2xl p-6">
        <h3 className="text-white font-medium mb-3">Access Control</h3>
        <p className="text-gray-400 text-sm">IP + wallet whitelist + device controls.</p>
      </div>

      <div className="bg-[#1a1f2b] border border-[#2a2f3a] rounded-2xl p-6">
        <h3 className="text-white font-medium mb-3">Security Alerts</h3>
        <p className="text-gray-400 text-sm">Instant fraud detection notifications.</p>
      </div>

    </div>

    {/* ROW 4 */}
    <div className="bg-[#1a1f2b] border border-[#2a2f3a] rounded-2xl p-8">

      <h3 className="text-white font-medium mb-4">
        Opening New Doors for Digital Finance
      </h3>

      <p className="text-gray-400 text-sm mb-6">
        We maintain strict global compliance standards to ensure transparency and trust.
      </p>

      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="bg-[#0f141c] border border-[#2a2f3a] rounded-xl p-4 text-center">
          <p className="text-white text-lg font-semibold">500%</p>
          <p className="text-gray-500 text-xs">Team Growth</p>
        </div>

        <div className="bg-[#0f141c] border border-[#2a2f3a] rounded-xl p-4 text-center">
          <p className="text-white text-lg font-semibold">5,600+</p>
          <p className="text-gray-500 text-xs">Legal Requests</p>
        </div>

        <div className="bg-[#0f141c] border border-[#2a2f3a] rounded-xl p-4 text-center">
          <p className="text-white text-lg font-semibold">80+</p>
          <p className="text-gray-500 text-xs">Countries</p>
        </div>

      </div>

      <div className="flex flex-wrap gap-2">
        {["KYC", "AML", "Sanctions", "Compliance"].map((tag, i) => (
          <span key={i} className="px-3 py-1 text-xs rounded-full bg-[#0f141c] border border-[#2a2f3a] text-gray-300">
            {tag}
          </span>
        ))}
      </div>

    </div>

  </div>

  {/* CTA BUTTON */}
  <div
  style={{
    display: "flex",
    alignItems: "flex-start",   // 👈 move upward
    justifyContent: "center",
    paddingTop: "5vh"          // 👈 control how high it is
  }}
>
  <Link
    to="/legal"
    style={{
      background: "#ff8c32",
      color: "black",
      padding: "12px 30px",
      borderRadius: "8px",
      fontWeight: "600"
    }}
  >
    Learn More
  </Link>
</div>
</div>


      {/* FOUNDERS */}
      <div className="about-section">
        <h2>Our Founders</h2>

        <div className="grid">
          <div className="card"><h3>CZ (Changpeng Zhao)</h3><p>Founder & visionary leader.</p></div>
          <div className="card"><h3>Yi He</h3><p>Co-founder & strategist.</p></div>
        </div>
      </div>

      {/* BOARD */}
      <div className="about-section">
        <h2>SwanCore Board of Directors</h2>

        {/* MEMBERS */}
        <div className="grid">
          {members.map((name, i) => (
            <div
              key={i}
              className={`card ${activeMember === name ? "active" : ""}`}
              onClick={() => handleClick(name)}
              style={{ cursor: "pointer" }}
            >
              <h3>{name}</h3>
              <p>Click to view details</p>
            </div>
          ))}
        </div>

        {/* DETAILS - ZAKIR */}
        {activeMember === "Zakir Khan" && (
          <div ref={zakirRef} className="details-box">
            <h2>Zakir Khan</h2>
            <p style={{ whiteSpace: "pre-line" }}>{zakirDetails}</p>
          </div>
        )}

        {/* DETAILS - TIN */}
        {activeMember === "Tin Wang" && (
          <div ref={tinRef} className="details-box">
            <h2>Tin Wang</h2>
            <p style={{ whiteSpace: "pre-line" }}>{tinDetails}</p>
          </div>
        )}
      </div>

    </div>
  );
}