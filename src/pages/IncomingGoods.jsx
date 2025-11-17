// src/pages/IncomingGoods.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

const IncomingGoods = ({ onBack }) => {
  const [stockItems, setStockItems] = useState([]); // الوارد
  const [mainStockItems, setMainStockItems] = useState([]); // المخزن العام لأسماء الأصناف
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const stockCollection = collection(db, "incomingGoods");
  const mainStockCollection = collection(db, "storeItems");

  // جلب بيانات المخزن العام للأسماء (Dropdown)
  useEffect(() => {
    const unsub = onSnapshot(mainStockCollection, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMainStockItems(data);
    });
    return () => unsub();
  }, []);

  // جلب بيانات الوارد
  useEffect(() => {
    const unsub = onSnapshot(stockCollection, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setStockItems(data);
    });
    return () => unsub();
  }, []);

  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    if (!name || !quantity || !unit) return;

    const now = new Date().toLocaleString();

    if (editingId) {
      const docRef = doc(db, "incomingGoods", editingId);
      await updateDoc(docRef, { name, quantity: Number(quantity), unit, date: now });
      setStockItems(stockItems.map(item => item.id === editingId ? { ...item, name, quantity: Number(quantity), unit, date: now } : item));
      setEditingId(null);
    } else {
      // تحقق إذا الصنف موجود بنفس الوحدة
      const q = query(stockCollection, where("name", "==", name), where("unit", "==", unit));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const existingDoc = querySnapshot.docs[0];
        const updatedQty = existingDoc.data().quantity + Number(quantity);
        const docRef = doc(db, "incomingGoods", existingDoc.id);
        await updateDoc(docRef, { quantity: updatedQty, date: now });
        setStockItems(stockItems.map(item => item.id === existingDoc.id ? { ...item, quantity: updatedQty, date: now } : item));
      } else {
        const docRef = await addDoc(stockCollection, { name, quantity: Number(quantity), unit, date: now });
        setStockItems([...stockItems, { id: docRef.id, name, quantity: Number(quantity), unit, date: now }]);
      }

      // تحديث المخزن العام تلقائيًا عند إضافة صنف جديد
      const existsInMainStock = mainStockItems.find(item => item.name === name && item.unit === unit);
      if (!existsInMainStock) {
        await addDoc(mainStockCollection, { name, unit, quantity: Number(quantity), date: now });
      }
    }

    setName(""); setQuantity(""); setUnit("");
  };

  const handleEdit = (item) => {
    setName(item.name);
    setQuantity(item.quantity);
    setUnit(item.unit);
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    const pwd = prompt("أدخل كلمة المرور للحذف:");
    if (pwd === "2991034") {
      await deleteDoc(doc(db, "incomingGoods", id));
    } else alert("كلمة المرور غير صحيحة!");
  };

  const filteredStock = stockItems.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ padding: "20px", backgroundColor: "#b8e0b8", minHeight: "100vh" }}>
      <button onClick={onBack} style={{ marginBottom: "20px", padding: "10px 20px", backgroundColor: "#333", color: "white", border: "none", cursor: "pointer" }}>رجوع</button>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>البضاعة الواردة</h1>

      <input
        type="text"
        placeholder="بحث باسم الصنف..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ padding: "10px", width: "300px", marginBottom: "20px", display: "block", marginLeft: "auto", marginRight: "auto", fontSize: "16px" }}
      />

      <form onSubmit={handleAddOrEdit} style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginBottom: "20px" }}>
        {/* Dropdown من المخزن العام */}
        <select
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "10px", width: "220px", fontSize: "16px" }}
        >
          <option value="">اختر اسم الصنف من المخزن</option>
          {mainStockItems.map((item) => (
            <option key={item.id} value={item.name}>{item.name}</option>
          ))}
        </select>

        {/* خانة تسجيل صنف جديد */}
        <input
          type="text"
          placeholder="أو سجل صنف جديد"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "10px", width: "220px", fontSize: "16px" }}
        />

        <input type="number" placeholder="الكمية" value={quantity} onChange={e => setQuantity(e.target.value)} style={{ padding: "10px", width: "150px", fontSize: "16px" }} />

        <select value={unit} onChange={e => setUnit(e.target.value)} style={{ padding: "10px", width: "180px", fontSize: "16px" }}>
          <option value="">اختر الوحدة</option>
          <option value="كيلو">كيلو</option>
          <option value="جرامات">جرامات</option>
          <option value="عدد">عدد</option>
          <option value="شيكارة">شيكارة</option>
          <option value="كيس">كيس</option>
        </select>

        <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", border: "none", fontSize: "16px" }}>
          {editingId ? "تحديث" : "إضافة"}
        </button>
      </form>

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
          {filteredStock.map(item => (
            <tr key={item.id} style={{ textAlign: "center", backgroundColor: item.quantity < 5 ? "#f8d7da" : "white" }}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.unit}</td>
              <td>{item.date}</td>
              <td>
                <button onClick={() => handleEdit(item)} style={{ marginRight: "5px", padding: "5px 10px", cursor: "pointer" }}>تعديل</button>
                <button onClick={() => handleDelete(item.id)} style={{ padding: "5px 10px", cursor: "pointer", backgroundColor: "red", color: "white", border: "none" }}>حذف</button>
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
