import React from "react";
import "./Dashboard.css";

const Dashboard = ({ onSelectSection }) => {
  const sections = [
    { id: "stock", title: "المخزن 🏪" },
    { id: "factory", title: "المصنع 🏭" },
    { id: "store", title: "المحلات 🏬" },
    { id: "purchases", title: "المشتريات 🧾" },
    { id: "maintenance", title: "الصيانة والنظافة 🧹" },
    { id: "employees", title: "العبيد 👨‍💼" }, // ✅ تم إضافة هذا القسم
  ];

  return (
    <div className="dashboard fade-in">
      <h1 className="dashboard-title">📊 اللوحة الرئيسية 📊</h1>

      <div className="cards-container">
        {sections.map((sec, index) => (
          <div
            key={sec.id}
            className="card bounce"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => onSelectSection(sec.id)}
          >
            <h2>{sec.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
