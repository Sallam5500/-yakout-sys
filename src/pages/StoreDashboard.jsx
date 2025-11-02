import React from "react";
import "./Dashboard.css"; // نفس CSS الخاص بالداش بورد

const StoreDashboard = ({ onSelectSection, showBackButton }) => {
  const cards = [
    { title: "المخزن العام", section: "stock-main", emoji: "📦" },
    { title: "الوارد", section: "incoming", emoji: "📥" },
    { title: "الصادر", section: "outgoing", emoji: "📤" },
  ];

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">المخزن</h1>

      {showBackButton && (
        <button
          style={{ marginBottom: "20px", padding: "8px 15px", cursor: "pointer" }}
          onClick={showBackButton}
        >
          ← رجوع
        </button>
      )}

      <div className="cards-container">
        {cards.map((card, index) => (
          <div
            key={index}
            className="card"
            onClick={() => onSelectSection(card.section)}
          >
            <div className="card-emoji">{card.emoji}</div>
            <h2>{card.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreDashboard;
