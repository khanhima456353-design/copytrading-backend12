import React from "react";

export default function MarketSnapshot({ coins, news, onViewNews }) {
  return (
    <section className="market-snapshot" aria-labelledby="market-snapshot-title">
      <div className="market-snapshot__header">
        <div>
          <p className="eyebrow">Market pulse</p>
          <h2 id="market-snapshot-title">Live performance, curated for decisive moves.</h2>
        </div>
        <button className="button button--ghost" onClick={onViewNews}>View all news</button>
      </div>

      <div className="market-snapshot__content">
        <div className="market-snapshot__panel">
          <div className="panel-heading">Top movers</div>
          <div className="quote-list">
            {coins.map((coin) => (
              <div key={coin.id} className="quote-row">
                <div className="quote-name">
                  <img src={coin.image} alt={coin.symbol} />
                  <span>{coin.symbol.toUpperCase()}</span>
                </div>
                <span className="quote-price">${coin.current_price.toLocaleString()}</span>
                <span className={`quote-change ${coin.price_change_percentage_24h > 0 ? "quote-change--positive" : "quote-change--negative"}`}>
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="market-snapshot__panel market-snapshot__panel--news">
          <div className="panel-heading">Latest market news</div>
          <div className="news-list">
            {news.length === 0 ? (
              <p className="news-empty">Loading news...</p>
            ) : (
              news.slice(0, 4).map((item, index) => (
                <article key={`${item.title}-${index}`} className="news-card">
                  <p>{item.title}</p>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
