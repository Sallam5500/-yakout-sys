import React, { useState } from "react";

const IncomingGoods = ({ onBack, stockItems, setStockItems }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // لحقل البحث

  // قائمة الأصناف للدروب داون
  const [dropdownItems, setDropdownItems] = useState(stockItems.map(i => i.name));

  const handleAddOrEdit = (e) => {
    e.preventDefault();
    if (!name || !quantity || !unit) return;

    const now = new Date().toLocaleString();

    if (editingIndex !== null) {
      const newStock = [...stockItems];
      newStock[editingIndex] = { name, quantity: Number(quantity), unit, date: now };
      setStockItems(newStock);
      setEditingIndex(null);
    } else {
      const index = stockItems.findIndex(i => i.name === name && i.unit === unit);
      if (index !== -1) {
        const newStock = [...stockItems];
        newStock[index].quantity += Number(quantity);
        newStock[index].date = now;
        setStockItems(newStock);
      } else {
        setStockItems([...stockItems, { name, quantity: Number(quantity), unit, date: now }]);
      }
    }

    if (!dropdownItems.includes(name)) setDropdownItems([...dropdownItems, name]);
    setName(""); setQuantity(""); setUnit("");
  };

  const handleEdit = (index) => {
    const item = stockItems[index];
    setName(item.name);
    setQuantity(item.quantity);
    setUnit(item.unit);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const pwd = prompt("أدخل كلمة المرور للحذف:");
    if (pwd === "2991034") {
      const newStock = stockItems.filter((_, i) => i !== index);
      setStockItems(newStock);
    } else alert("كلمة المرور غير صحيحة!");
  };

  // تصفية الجدول حسب السيرش
  const filteredStock = stockItems.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // فلتر الدروب داون حسب الكتابة
  const filteredDropdown = dropdownItems.filter(item => item.includes(name));

  return (
    <div style={{ padding: "20px", backgroundColor: "#b8e0b8", minHeight: "100vh" }}>
      <button onClick={onBack} style={{ marginBottom: "20px", padding: "8px 15px", backgroundColor: "#333", color: "white", border: "none", cursor: "pointer" }}>
        رجوع
      </button>

      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>البضاعة الواردة</h1>

      {/* حقل السيرش */}
      <input
        type="text"
        placeholder="بحث باسم الصنف..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ padding: "8px", width: "250px", marginBottom: "20px", display: "block", marginLeft: "auto", marginRight: "auto" }}
      />

      <form onSubmit={handleAddOrEdit} style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
        <input list="stock-list" placeholder="اسم الصنف" value={name} onChange={e => setName(e.target.value)} style={{ padding: "8px", width: "200px" }} />
        <datalist id="stock-list">
          {filteredDropdown.map((item, i) => <option key={i} value={item} />)}
        </datalist>

        <input type="number" placeholder="الكمية" value={quantity} onChange={e => setQuantity(e.target.value)} style={{ padding: "8px", width: "100px" }} />

        <select value={unit} onChange={e => setUnit(e.target.value)} style={{ padding: "8px", width: "120px" }}>
          <option value="">اختر الوحدة</option>
          <option value="كيلو">كيلو</option>
          <option value="جرامات">جرامات</option>
          <option value="عدد">عدد</option>
          <option value="شيكارة">شيكارة</option>
          <option value="كيس">كيس</option>
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
          {filteredStock.map((item, index) => (
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
          {filteredStock.length === 0 && (
            <tr>
              <td colSpan="5" style={{ padding: "10px" }}>لا يوجد أصناف مطابقة للبحث</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IncomingGoods;
