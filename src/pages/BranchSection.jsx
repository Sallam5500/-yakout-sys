import React, { useState } from "react";
import "./BranchSection.css";

const BranchSection = ({ title, allItems }) => {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const addRow = () => {
    setRows([
      ...rows,
      { id: Date.now(), name: "", quantity: "", unit: "", date: selectedDate },
    ]);
  };

  const updateRow = (id, field, value) => {
    setRows(rows.map(row => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const deleteRow = (id) => setRows(rows.filter(row => row.id !== id));

  const clearTable = () => setRows([]);

  const filteredRows = rows.filter(row => row.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="branch-section">
      <h2>{title}</h2>

      {/* Calendar + Search + Buttons */}
      <div className="controls">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="بحث بالاسم..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={addRow}>إضافة صف</button>
        <button onClick={clearTable}>مسح الكل</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>الصنف</th>
            <th>الكمية</th>
            <th>الوحدة</th>
            <th>التاريخ</th>
            <th>حذف</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map(row => (
            <tr key={row.id}>
              <td>
                <select
                  value={row.name}
                  onChange={(e) => updateRow(row.id, "name", e.target.value)}
                >
                  <option value="">اختر الصنف</option>
                  {allItems.map(item => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  value={row.quantity}
                  placeholder="الكمية"
                  onChange={(e) => updateRow(row.id, "quantity", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.unit}
                  placeholder="الوحدة"
                  onChange={(e) => updateRow(row.id, "unit", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="date"
                  value={row.date}
                  onChange={(e) => updateRow(row.id, "date", e.target.value)}
                />
              </td>
              <td>
                <button className="delete-btn" onClick={() => deleteRow(row.id)}>حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BranchSection;
