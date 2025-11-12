import React from "react";
import "./Distribution.css";

const Distribution = ({ onSelectStore, onBack }) => {
  const stores = [
    { title: "فرع بركة السبع", id: "barkaselba", emoji: "🏪" },
    { title: "فرع قويسنا", id: "qwesna", emoji: "🏬" },
  ];

  return (
    <div className="distribution">
      <h1 className="distribution-title">إدارة المحلات</h1>

      <button className="back-btn" onClick={onBack}>
        ← رجوع
      </button>

      <div className="cards-container">
        {stores.map((store) => (
          <div
            key={store.id}
            className="card"
            onClick={() => onSelectStore(store.id)}
          >
            <div className="card-emoji">{store.emoji}</div>
            <h2>{store.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Distribution;
