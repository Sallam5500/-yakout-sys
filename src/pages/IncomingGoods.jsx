// src/pages/IncomingGoods.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

const IncomingGoods = ({ onBack }) => {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [stockItems, setStockItems] = useState([]);
  const [mainStockItems, setMainStockItems] = useState([]);

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // -----------------------------
  // 🔵 تحميل المخزن العام (ثابت)
  // -----------------------------
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "storeItems"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMainStockItems(data);
    });

    return () => unsub();
  }, []);

  // -----------------------------
  // 🟢 تحميل الوارد حسب التاريخ
  // -----------------------------
  useEffect(() => {
    const stockCollection = collection(
      db,
      "incomingGoods",
      selectedDate,
      "items"
    );

    const unsub = onSnapshot(stockCollection, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setStockItems(data);
    });

    return () => unsub();
  }, [selectedDate]);

  // -----------------------------
  // 🟡 إضافة أو تعديل صنف
  // -----------------------------
  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    if (!name || !quantity || !unit) return alert("املأ البيانات كاملة");

    const now = new Date().toLocaleString();
    const stockCollection = collection(
      db,
      "incomingGoods",
      selectedDate,
      "items"
    );

    if (editingId) {
      const docRef = doc(db, "incomingGoods", selectedDate, "items", editingId);
      await updateDoc(docRef, { name, quantity: Number(quantity), unit, date: now });
    } else {
      await addDoc(stockCollection, { name, quantity: Number(quantity), unit, date: now });

      // -----------------------------
      // 🔵 تحديث المخزن العام أو إضافته لو جديد
      // -----------------------------
      const exists = mainStockItems.find((i) => i.name === name);
      if (exists) {
        // لو الصنف موجود بالفعل → زود الكمية
        const docRef = doc(db, "storeItems", exists.id);
        await updateDoc(docRef, {
          quantity: Number(exists.quantity) + Number(quantity),
          date: now,
        });
        setMainStockItems(
          mainStockItems.map((i) =>
            i.id === exists.id
              ? { ...i, quantity: Number(i.quantity) + Number(quantity), date: now }
              : i
          )
        );
      } else {
        // لو الصنف جديد → أضفه
        const docRef = await addDoc(collection(db, "storeItems"), {
          name,
          unit,
          quantity: Number(quantity),
          date: now,
        });
        setMainStockItems([
          ...mainStockItems,
          { id: docRef.id, name, unit, quantity: Number(quantity), date: now },
        ]);
      }
    }

    setName("");
    setQuantity("");
    setUnit("");
    setEditingId(null);
  };

  // -----------------------------
  // ✏️ تعديل
  // -----------------------------
  const handleEdit = (item) => {
    setName(item.name);
    setQuantity(item.quantity);
    setUnit(item.unit);
    setEditingId(item.id);
  };

  // -----------------------------
  // ❌ حذف
  // -----------------------------
  const handleDelete = async (id) => {
    const pwd = prompt("أدخل كلمة المرور للحذف:");
    if (pwd !== "2991034") return alert("كلمة المرور غلط!");
    await deleteDoc(doc(db, "incomingGoods", selectedDate, "items", id));
  };

  const filteredStock = stockItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // -----------------------------
  // ⭐ تنسيق الصفحة
  // -----------------------------
  const container = { padding: "20px", backgroundColor: "#b8e0b8", minHeight: "100vh" };
  const inputStyle = { padding: "10px", width: "220px", fontSize: "18px" };

  return (
    <div style={container}>
      <button onClick={onBack} style={{ padding: "10px 20px", background: "#222", color: "#fff" }}>
        رجوع
      </button>

      <h1 style={{ textAlign: "center", marginBottom: "10px" }}>البضاعة الواردة</h1>

      {/* 🟣 اختيار التاريخ */}
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={{ padding: "10px", fontSize: "18px", display: "block", margin: "10px auto" }}
      />

      {/* 🔍 بحث */}
      <input
        type="text"
        placeholder="بحث..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "10px", width: "300px", margin: "10px auto", display: "block", fontSize: "18px" }}
      />

      {/* 🟢 فورم الإدخال */}
      <form
        onSubmit={handleAddOrEdit}
        style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", marginBottom: "20px" }}
      >
        <select value={name} onChange={(e) => setName(e.target.value)} style={inputStyle}>
          <option value="">اختر صنف من المخزن</option>
          {mainStockItems.map((item) => (
            <option key={item.id} value={item.name}>{item.name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="أو سجل صنف جديد"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="الكمية"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={{ ...inputStyle, width: "150px" }}
        />

        <select value={unit} onChange={(e) => setUnit(e.target.value)} style={{ ...inputStyle, width: "150px" }}>
          <option value="">الوحدة</option>
          <option value="شكارة">شكارة</option>
          <option value="كيلو">كيلو</option>
          <option value="جرام">جرام</option>
          <option value="عدد">عدد</option>
          <option value="كيس">كيس</option>
        </select>

        <button type="submit" style={{ padding: "10px 20px", background: "#4CAF50", color: "#fff", fontSize: "18px" }}>
          {editingId ? "تحديث" : "إضافة"}
        </button>
      </form>

      {/* 🟤 الجدول */}
      <table style={{ width: "90%", margin: "20px auto", background: "white", borderCollapse: "collapse", fontSize: "18px" }}>
        <thead>
          <tr style={{ background: "#4CAF50", color: "#fff" }}>
            <th>الصنف</th>
            <th>الكمية</th>
            <th>الوحدة</th>
            <th>التاريخ</th>
            <th>إجراءات</th>
          </tr>
        </thead>

        <tbody>
          {filteredStock.map((item) => (
            <tr key={item.id} style={{ textAlign: "center" }}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.unit}</td>
              <td>{item.date}</td>
              <td>
                <button onClick={() => handleEdit(item)}>تعديل</button>
                <button onClick={() => handleDelete(item.id)} style={{ background: "red", color: "#fff", marginLeft: "5px" }}>
                  حذف
                </button>
              </td>
            </tr>
          ))}
          {filteredStock.length === 0 && (
            <tr>
              <td colSpan="5" style={{ padding: "10px" }}>لا يوجد أصناف في هذا اليوم</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IncomingGoods;
