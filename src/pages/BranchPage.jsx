import React, { useState } from "react";
import "./BranchSection.css";

const BranchSection = ({ title, onBack, initialItems = [] }) => {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [units, setUnits] = useState(["سرفيس", "برنيكة", "صاج", "عدد"]);
  const [items, setItems] = useState(initialItems);

  const PASSWORD = "2991034";

  const addRow = () => {
    const currentTime = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setRows([
      ...rows,
      { id: Date.now(), name: "", quantity: "", unit: "", time: currentTime, editable: true },
    ]);
  };

  const updateRow = (id, field, value) => {
    setRows(rows.map(row => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const saveRow = (id) => {
    const row = rows.find(r => r.id === id);
    if (!row.name) { alert("ادخل اسم الصنف قبل الحفظ!"); return; }
    if (!items.includes(row.name)) setItems([...items, row.name]);
    setRows(rows.map(r => (r.id === id ? { ...r, editable: false } : r)));
    alert("تم حفظ الصف!");
  };

  const editRow = (id) => setRows(rows.map(r => (r.id === id ? { ...r, editable: true } : r)));

  const deleteRow = (id) => {
    const input = prompt("أدخل كلمة السر لحذف الصف:");
    if (input === PASSWORD) setRows(rows.filter(row => row.id !== id));
    else alert("كلمة السر غير صحيحة، لا يمكن الحذف!");
  };

  const clearTable = () => {
    const input = prompt("أدخل كلمة السر لمسح كل الصفوف:");
    if (input === PASSWORD) setRows([]);
    else alert("كلمة السر غير صحيحة، لا يمكن مسح الجدول!");
  };

  const filteredRows = rows.filter(row => row.name.toLowerCase().includes(search.toLowerCase()));

  // حساب مجموع الكمية لكل صنف
  const summary = rows.reduce((acc, row) => {
    if (!row.name) return acc;
    if (!acc[row.name]) acc[row.name] = { quantity: 0, unit: row.unit || "" };
    acc[row.name].quantity += Number(row.quantity) || 0;
    return acc;
  }, {});

  return (
    <div className="branch-section">
      <button className="back-btn" onClick={onBack} style={{ marginBottom: "15px" }}>← رجوع</button>
      <h2>{title}</h2>

      <div className="controls">
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        <input type="text" placeholder="بحث بالاسم..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button onClick={addRow}>إضافة صف</button>
        <button onClick={clearTable}>مسح الكل</button>
      </div>

      {/* كروت ملخص الأصناف */}
      <div className="cards-summary">
        {Object.entries(summary).map(([name, data]) => (
          <div key={name} className="summary-card">
            <h3>{name}</h3>
            <p>الكمية: {data.quantity}</p>
            <p>الوحدة: {data.unit}</p>
          </div>
        ))}
      </div>

      <table>
        <thead>
          <tr>
            <th>الصنف</th>
            <th>الكمية</th>
            <th>الوحدة</th>
            <th>الوقت</th>
            <th>حفظ</th>
            <th>تعديل</th>
            <th>حذف</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map(row => (
            <tr key={row.id}>
              <td>
                <input
                  list="items-list"
                  value={row.name}
                  onChange={(e) => updateRow(row.id, "name", e.target.value)}
                  placeholder="اختر أو اكتب صنف جديد"
                  disabled={!row.editable}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.quantity}
                  onChange={(e) => updateRow(row.id, "quantity", e.target.value)}
                  disabled={!row.editable}
                />
              </td>
              <td>
                <input
                  list="units-list"
                  value={row.unit}
                  onChange={(e) => updateRow(row.id, "unit", e.target.value)}
                  disabled={!row.editable}
                />
              </td>
              <td>
                <input
                  type="time"
                  value={row.time}
                  onChange={(e) => updateRow(row.id, "time", e.target.value)}
                  disabled={!row.editable}
                />
              </td>
              <td><button onClick={() => saveRow(row.id)}>حفظ</button></td>
              <td><button onClick={() => editRow(row.id)}>تعديل</button></td>
              <td><button onClick={() => deleteRow(row.id)}>حذف</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <datalist id="items-list">{items.map((item, idx) => <option key={idx} value={item} />)}</datalist>
      <datalist id="units-list">{units.map((unit, idx) => <option key={idx} value={unit} />)}</datalist>
    </div>
  );
};

export default BranchSection;
