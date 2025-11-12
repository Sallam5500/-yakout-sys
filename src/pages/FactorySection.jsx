import React, { useState } from "react";
import "./FactorySection.css";

const FactorySection = ({ section, onBack }) => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [type, setType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [rows, setRows] = useState([]);

  const handleAddItem = () => {
    if (newItemName && !items.includes(newItemName)) {
      setItems([...items, newItemName]);
      setSelectedItem(newItemName);
      setNewItemName("");
    }
  };

  const handleAddRow = () => {
    if (!selectedItem || !quantity) return;
    setRows([...rows, { id: Date.now(), item: selectedItem, quantity, type, time }]);
    setQuantity("");
    setType("");
    setTime(new Date().toLocaleTimeString());
  };

  const handleDeleteRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  // تحويل id القسم إلى عنوان عربي
  const sectionTitles = {
    oriental: "الحلويات الشرقية",
    tort: "قسم التورت",
    gateau: "قسم الجاتوه",
    mousse: "قسم الموس",
    "french-mousse": "قسم الموس الفرنسي",
    pieces: "قسم التقطيعات"
  };

  return (
    <div className="factory-section">
      <button className="back-btn" onClick={onBack} style={{ marginBottom: "15px" }}>
        ← رجوع
      </button>

      <h1>{sectionTitles[section]}</h1>

      <div className="controls">
        <div className="dropdown-control">
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
          >
            <option value="">-- اختر صنف --</option>
            {items.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="أضف صنف جديد"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <button onClick={handleAddItem}>إضافة صنف</button>
        </div>

        <div className="input-control">
          <input
            type="number"
            placeholder="الكمية"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <input
            type="text"
            placeholder="النوع"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <button onClick={handleAddRow}>إضافة صف</button>
        </div>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>الصنف</th>
            <th>الكمية</th>
            <th>النوع</th>
            <th>الوقت</th>
            <th>حذف</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.item}</td>
              <td>{row.quantity}</td>
              <td>{row.type}</td>
              <td>{row.time}</td>
              <td>
                <button onClick={() => handleDeleteRow(row.id)}>حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FactorySection;
