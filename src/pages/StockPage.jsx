import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const StockPage = ({ onBack }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "storeItems"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(data);
    });
    return () => unsub();
  }, []);

  const handleAdd = async () => {
    const name = prompt("اسم الصنف:");
    const quantity = Number(prompt("الكمية:"));
    const unit = prompt("الوحدة:");
    if (!name || !quantity || !unit) return;

    await addDoc(collection(db, "storeItems"), {
      name,
      quantity,
      unit,
      date: new Date().toLocaleString(),
    });
  };

  const handleEdit = async (item) => {
    const newName = prompt("تعديل الاسم:", item.name) || item.name;
    const newQuantity =
      Number(prompt("تعديل الكمية:", item.quantity)) || item.quantity;
    const newUnit = prompt("تعديل الوحدة:", item.unit) || item.unit;

    await updateDoc(doc(db, "storeItems", item.id), {
      name: newName,
      quantity: newQuantity,
      unit: newUnit,
      date: new Date().toLocaleString(),
    });
  };

  const handleDelete = async (id) => {
    const pwd = prompt("أدخل كلمة المرور للحذف:");
    if (pwd !== "2991034") return alert("كلمة المرور غلط!");
    await deleteDoc(doc(db, "storeItems", id));
  };

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

      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>المخزن العام</h1>

      <button
        onClick={handleAdd}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        ➕ إضافة صنف جديد
      </button>

      <table style={{ width: "90%", margin: "0 auto", borderCollapse: "collapse", backgroundColor: "white" }}>
        <thead>
          <tr style={{ backgroundColor: "#4CAF50", color: "white" }}>
            <th style={{ padding: "10px" }}>اسم الصنف</th>
            <th style={{ padding: "10px" }}>الكمية</th>
            <th style={{ padding: "10px" }}>الوحدة</th>
            <th style={{ padding: "10px" }}>التاريخ</th>
            <th style={{ padding: "10px" }}>إجراءات</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id} style={{ textAlign: "center", backgroundColor: item.quantity < 5 ? "#f8d7da" : "white" }}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.unit}</td>
              <td>{item.date}</td>
              <td>
                <button onClick={() => handleEdit(item)}>تعديل</button>
                <button
                  style={{ marginLeft: "5px", color: "white", backgroundColor: "red", border: "none", padding: "5px 8px", cursor: "pointer" }}
                  onClick={() => handleDelete(item.id)}
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}

          {items.length === 0 && (
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
