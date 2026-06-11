import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { House, BriefcaseBusiness, Store, ShieldUser } from "lucide-react";
import "./news.css";
import { getSocket } from "./api";
import swancoreLogo from "./assets/logo.jpg";

function News() {
  const navigate = useNavigate();
  const location = useLocation();
  const embedded = location.state?.embed;
  const [news, setNews] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    let socket = null;

    (async () => {
      socket = await getSocket();

      const cached = localStorage.getItem("news-cache");
      if (cached) {
        setNews(JSON.parse(cached));
      }

      socket.on("news-update", (data) => {
        const safe = Array.isArray(data) ? data : [];

        setNews(safe);
        localStorage.setItem("news-cache", JSON.stringify(safe));
      });
    })();

    return () => {
      if (socket) {
        socket.off("news-update");
        socket.disconnect();
      }
    };
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="feed">
      <header className="news-header">
        <div className="news-header-left">
          <img src={swancoreLogo} alt="SwanCore" className="news-header-logo" />
          <div className="news-header-text">
            <span className="news-header-brand">SwanCore</span>
            <span className="news-header-label">News</span>
          </div>
        </div>
      </header>

      {news.map((item) => {
        const isOpen = expandedId === item.id;

        return (
          <div key={item.id} className="news-wrapper">

            <div className="card">
              <span className="time">{item.time}</span>

              {!isOpen && item.image && (
                <img className="card-img" src={item.image} alt="" />
              )}

              <div className="title">
                {item.title}
              </div>

              {isOpen ? (
                <div className="expanded-scroll">
                  <p>{item.content || "No article content available."}</p>

                  <div className="read-more" onClick={() => toggleExpand(item.id)}>
                    Hide Article
                  </div>
                </div>
              ) : (
                <div className="read-more" onClick={() => toggleExpand(item.id)}>
                  Read More
                </div>
              )}

            </div>
          </div>
        );
      })}

      {embedded && (
        <nav className="mk-bottom-nav">
          <button className="mk-bottom-nav-item" onClick={() => navigate("/", { state: { targetScreen: "home" } })}>
            <span><House size={18} /></span>
            <span>Home</span>
          </button>
          <button className="mk-bottom-nav-item" onClick={() => navigate("/", { state: { targetScreen: "portfolio" } })}>
            <span><BriefcaseBusiness size={18} /></span>
            <span>Portfolio</span>
          </button>
          <button className="mk-bottom-nav-item" onClick={() => navigate("/markets", { state: { embed: true } })}>
            <span><Store size={18} /></span>
            <span>Markets</span>
          </button>
          <button className="mk-bottom-nav-item" onClick={() => navigate("/", { state: { targetScreen: "account" } })}>
            <span><ShieldUser size={18} /></span>
            <span>Account</span>
          </button>
        </nav>
      )}
    </div>
  );
}

export default News;