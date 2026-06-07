import React, { useEffect, useState } from "react";
import "./news.css";
import { getSocket } from "./api";
import swancoreLogo from "./assets/logo.jpg";

function News() {
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
      <h2 className="feed-title">
        <span style={{ color: "#F0B90B" }}>Swancore</span>'s News
      </h2>

      {news.map((item) => {
        const isOpen = expandedId === item.id;

        return (
          <div key={item.id} className="news-wrapper">

            <div className="outside-header">
              <div className="header-left">
                <img
                  src={swancoreLogo}
                  className="avatar"
                  alt="source"
                />
                <span className="source">Swancore's News</span>
              </div>

              <span className="time">{item.time}</span>
            </div>

            <div className="card">

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
    </div>
  );
}

export default News;