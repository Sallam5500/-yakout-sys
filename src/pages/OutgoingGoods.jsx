import React, { useState } from "react";

const OutgoingGoods = ({ onBack, stockItems, setStockItems }) => {
  const [selectedName, setSelectedName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [records, setRecords] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAddOrEdit = (e) => {
    e.preventDefault();
    if (!selectedName || !quantity || !unit) return;

    const stockIndex = stockItems.findIndex(
      (i) => i.name === selectedName && i.unit === unit
    );

    if (stockIndex === -1) {
      alert("هذا الصنف غير موجود في المخزن أو الوحدة غير صحيحة!");
      return;
    }

    if (Number(quantity) > stockItems[stockIndex].quantity) {
      alert("الكمية المطلوبة أكبر من المخزن!");
      return;
    }

    const now = new Date().toLocaleString();

    if (editingIndex !== null) {
      const newRecords = [...records];
      newRecords[editingIndex] = {
        name: selectedName,
        quantity: Number(quantity),
        unit,
        date: now,
      };
      setRecords(newRecords);
      setEditingIndex(null);
    } else {
      setRecords([...records, { name: selectedName, quantity: Number(quantity), unit, date: now }]);
    }

    // خصم الكمية من المخزن
    const newStock = [...stockItems];
    newStock[stockIndex].quantity -= Number(quantity);
    setStockItems(newStock);

    setSelectedName("");
    setQuantity("");
    setUnit("");
  };

  const handleEdit = (index) => {
    const record = records[index];
    setSelectedName(record.name);
    setQuantity(record.quantity);
    setUnit(record.unit);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const pwd = prompt("أدخل كلمة المرور للحذف:");
    if (pwd === "2991034") {
      const record = records[index];
      // إرجاع الكمية للمخزن
      const stockIndex = stockItems.findIndex(
        (i) => i.name === record.name && i.unit === record.unit
      );
      if (stockIndex !== -1) {
        const newStock = [...stockItems];
        newStock[stockIndex].quantity += record.quantity;
        setStockItems(newStock);
      }

      const newRecords = records.filter((_, i) => i !== index);
      setRecords(newRecords);
    } else alert("كلمة المرور غير صحيحة!");
  };

  // فلترة الوحدات حسب الصنف
  const availableUnits = stockItems
    .filter((i) => i.name === selectedName)
    .map((i) => i.unit);

  return (
    <div style={{ padding: "20px", backgroundColor: "#b8e0b8", minHeight: "100vh" }}>
      <button
        onClick={onBack}
        style={{
          marginBottom: "20px",
          padding: "8px 15px",
          backgroundColor: "#333",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        رجوع
      </button>

      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>الصادر من المخزن</h1>

      <form onSubmit={handleAddOrEdit} style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
        <select value={selectedName} onChange={(e) => setSelectedName(e.target.value)} style={{ padding: "8px", width: "200px" }}>
          <option value="">اختر الصنف</option>
          {stockItems.map((item, i) => (
            <option key={i} value={item.name}>
              {item.name} (المتاح: {item.quantity})
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="الكمية"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={{ padding: "8px", width: "100px" }}
        />

        <select value={unit} onChange={(e) => setUnit(e.target.value)} style={{ padding: "8px", width: "120px" }}>
          <option value="">اختر الوحدة</option>
          {availableUnits.map((u, i) => (
            <option key={i} value={u}>{u}</option>
          ))}
        </select>

        <button type="submit" style={{ padding: "8px 15px", backgroundColor: "#4CAF50", color: "white", border: "none" }}>
          {editingIndex !== null ? "تحديث" : "إضافة"}
        </button>
      </form>

      <table style={{ width: "90%", margin: "20px auto", backgroundColor: "white", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#4CAF50", color: "white" }}>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>اسم الصنف</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>الكمية</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>الوحدة</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>التاريخ</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {records.map((item, index) => (
            <tr key={index} style={{ textAlign: "center", backgroundColor: item.quantity < 5 ? "#f8d7da" : "white" }}>
              <td style={{ padding: "8px" }}>{item.name}</td>
              <td style={{ padding: "8px" }}>{item.quantity}</td>
              <td style={{ padding: "8px" }}>{item.unit}</td>
              <td style={{ padding: "8px" }}>{item.date}</td>
              <td style={{ padding: "8px" }}>
                <button onClick={() => handleEdit(index)} style={{ marginRight: "5px", padding: "5px 10px", cursor: "pointer" }}>تعديل</button>
                <button onClick={() => handleDelete(index)} style={{ padding: "5px 10px", cursor: "pointer", backgroundColor: "red", color: "white", border: "none" }}>حذف</button>
              </td>
            </tr>
          ))}
          {records.length === 0 && (
            <tr>
              <td colSpan="5" style={{ padding: "10px" }}>لا يوجد أصناف مصروفة</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OutgoingGoods;
