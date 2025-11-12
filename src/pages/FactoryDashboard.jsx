import React from "react";
import "./Dashboard.css";

const FactoryDashboard = ({ onSelectSection, onBack }) => {
  const sections = [
    { title: "الحلويات الشرقية", id: "oriental" },
    { title: "التورت", id: "tort" },
    { title: "الجاتوه", id: "gateau" },
    { title: "الموس", id: "mousse" },
    { title: "الموس الفرنسي", id: "french-mousse" },
    { title: "التقطيعات", id: "pieces" },
  ];

  return (
    <div className="dashboard">
      <button className="back-btn" onClick={onBack} style={{ marginBottom: "15px" }}>
        ← رجوع
      </button>

      <h1 className="dashboard-title">إدارة المصنع</h1>

      <div className="cards-container">
        {sections.map((sec) => (
          <div
            key={sec.id}
            className="card"
            onClick={() => onSelectSection(sec.id)}
          >
            <div className="card-emoji">🏭</div>
            <h2>{sec.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FactoryDashboard;
