import React from "react";

const StockPage = ({ stockItems, setStockItems, onBack }) => {

  const handleEdit = (index) => {
    const item = stockItems[index];
    const newName = prompt("تعديل اسم الصنف:", item.name) || item.name;
    const newQuantity = Number(prompt("تعديل الكمية:", item.quantity)) || item.quantity;
    const newUnit = prompt("تعديل الوحدة:", item.unit) || item.unit;
    const now = new Date().toLocaleString();

    const newStock = [...stockItems];
    newStock[index] = { name: newName, quantity: newQuantity, unit: newUnit, date: now };
    setStockItems(newStock);
  };

  const handleDelete = (index) => {
    const pwd = prompt("أدخل كلمة المرور للحذف:");
    if (pwd === "2991034") {
      const newStock = stockItems.filter((_, i) => i !== index);
      setStockItems(newStock);
    } else alert("كلمة المرور غير صحيحة!");
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#b8e0b8", minHeight: "100vh" }}>
      <button
        onClick={onBack}
        style={{ marginBottom: "20px", padding: "8px 15px", backgroundColor: "#333", color: "white", border: "none", cursor: "pointer" }}
      >
        رجوع
      </button>

      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>المخزن العام</h1>

      <table style={{ width: "90%", margin: "0 auto", borderCollapse: "collapse", backgroundColor: "white" }}>
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
          {stockItems.map((item, index) => (
            <tr key={index} style={{
              textAlign: "center",
              backgroundColor: item.quantity < 5 ? "#f8d7da" : "white",
            }}>
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
          {stockItems.length === 0 && (
            <tr>
              <td colSpan="5" style={{ padding: "10px" }}>لا يوجد أصناف في المخزن</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StockPage;
