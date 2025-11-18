import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  getDocs,
} from "firebase/firestore";

const OutgoingGoods = ({ onBack }) => {
  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [storeItems, setStoreItems] = useState([]);
  const [outgoingItems, setOutgoingItems] = useState([]);

  const [selectedName, setSelectedName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [editingId, setEditingId] = useState(null);

  // -----------------------------
  // 🔵 جلب المخزن العام
  // -----------------------------
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "storeItems"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setStoreItems(data);
    });
    return () => unsub();
  }, []);

  // -----------------------------
  // 🟢 جلب الصادر حسب التاريخ
  // -----------------------------
  useEffect(() => {
    const outgoingCollection = collection(
      db,
      "outgoingGoods",
      selectedDate,
      "items"
    );

    const unsub = onSnapshot(outgoingCollection, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOutgoingItems(data);
    });

    return () => unsub();
  }, [selectedDate]);

  // -----------------------------
  // عند اختيار الصنف، الوحدة تظهر تلقائيًا
  // -----------------------------
  const handleSelectChange = (e) => {
    const name = e.target.value;
    setSelectedName(name);
    const item = storeItems.find((i) => i.name === name);
    setUnit(item ? item.unit : "");
  };

  // -----------------------------
  // إضافة أو تعديل الصادر
  // -----------------------------
  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    if (!selectedName || !quantity || !unit) return alert("املأ البيانات كاملة");

    const storeItem = storeItems.find((i) => i.name === selectedName);
    if (!storeItem) return alert("الصنف غير موجود في المخزن!");
    if (quantity > storeItem.quantity) return alert("الكمية المطلوبة أكبر من الموجود في المخزن!");

    const now = new Date().toLocaleString();
    const outgoingCollection = collection(
      db,
      "outgoingGoods",
      selectedDate,
      "items"
    );

    if (editingId) {
      const docRef = doc(db, "outgoingGoods", selectedDate, "items", editingId);
      await updateDoc(docRef, { name: selectedName, quantity: Number(quantity), unit, date: now });
      setEditingId(null);
    } else {
      await addDoc(outgoingCollection, { name: selectedName, quantity: Number(quantity), unit, date: now });
    }

    // تحديث المخزن تلقائيًا
    const storeDocRef = doc(db, "storeItems", storeItem.id);
    await updateDoc(storeDocRef, { quantity: storeItem.quantity - Number(quantity), date: now });

    setSelectedName(""); setQuantity(""); setUnit("");
  };

  const handleEdit = (item) => {
    setSelectedName(item.name);
    setQuantity(item.quantity);
    setUnit(item.unit);
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    const pwd = prompt("أدخل كلمة المرور للحذف:");
    if (pwd !== "2991034") return alert("كلمة المرور غير صحيحة!");
    await deleteDoc(doc(db, "outgoingGoods", selectedDate, "items", id));
  };

  // -----------------------------
  // ⭐ تنسيق الصفحة
  // -----------------------------
  const inputStyle = { padding: "12px", fontSize: "16px" };

  return (
    <div style={{ padding: "20px", backgroundColor: "#ffe0b8", minHeight: "100vh" }}>
      <button onClick={onBack} style={{ marginBottom: "20px", padding: "8px 15px", backgroundColor: "#333", color: "white", border: "none", cursor: "pointer" }}>رجوع</button>
      <h1 style={{ textAlign: "center", marginBottom: "10px" }}>البضاعة الصادرة</h1>

      {/* 🟣 اختيار التاريخ */}
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={{ padding: "10px", fontSize: "18px", display: "block", margin: "10px auto" }}
      />

      <form onSubmit={handleAddOrEdit} style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginBottom: "20px" }}>
        <select value={selectedName} onChange={handleSelectChange} style={{ ...inputStyle, width: "220px" }}>
          <option value="">اختر اسم الصنف</option>
          {storeItems.map(item => <option key={item.id} value={item.name}>{item.name}</option>)}
        </select>

        <input type="number" placeholder="الكمية" value={quantity} onChange={e => setQuantity(e.target.value)} style={{ ...inputStyle, width: "120px" }} />
        <input type="text" placeholder="الوحدة" value={unit} readOnly style={{ ...inputStyle, width: "140px", backgroundColor: "#eee" }} />

        <button type="submit" style={{ padding: "12px 20px", backgroundColor: "#f57c00", color: "white", fontSize: "16px", border: "none" }}>
          {editingId ? "تحديث" : "صرف"}
        </button>
      </form>

      <table style={{ width: "90%", margin: "20px auto", borderCollapse: "collapse", backgroundColor: "white" }}>
        <thead>
          <tr style={{ backgroundColor: "#f57c00", color: "white" }}>
            <th style={{ padding: "10px" }}>اسم الصنف</th>
            <th style={{ padding: "10px" }}>الكمية</th>
            <th style={{ padding: "10px" }}>الوحدة</th>
            <th style={{ padding: "10px" }}>التاريخ</th>
            <th style={{ padding: "10px" }}>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {outgoingItems.map(item => (
            <tr key={item.id} style={{ textAlign: "center" }}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.unit}</td>
              <td>{item.date}</td>
              <td>
                <button onClick={() => handleEdit(item)}>تعديل</button>
                <button onClick={() => handleDelete(item.id)} style={{ marginLeft: "5px", color: "white", backgroundColor: "red", border: "none", padding: "5px 8px" }}>حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OutgoingGoods;
