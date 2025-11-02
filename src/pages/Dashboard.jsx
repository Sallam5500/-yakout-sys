import React from "react";
import "./Dashboard.css";

const Dashboard = ({ onSelectSection }) => {
  const cards = [
    { title: "المخزن", section: "stock", emoji: "🏪" },
    { title: "المصنع", section: "factory", emoji: "🏭" },
    { title: "المشتريات", section: "purchases", emoji: "🛒" },
    { title: "الموظفين", section: "employees", emoji: "👥" },
    { title: "الصيانة والنظافة", section: "maintenance", emoji: "🧹" },
    { title: "المحلات", section: "stores", emoji: "🏬" },
  ];

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">لوحة التحكم</h1>
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

export default Dashboard;
