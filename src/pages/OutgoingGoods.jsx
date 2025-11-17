import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

const OutgoingGoods = ({ onBack }) => {
  const [storeItems, setStoreItems] = useState([]);
  const [outgoingItems, setOutgoingItems] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [editingId, setEditingId] = useState(null);

  const outgoingCollection = collection(db, "outgoingGoods");
  const storeCollection = collection(db, "storeItems");

  // جلب بيانات المخزن والصادر
  useEffect(() => {
    const fetchData = async () => {
      const storeSnap = await getDocs(storeCollection);
      setStoreItems(storeSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const outgoingSnap = await getDocs(outgoingCollection);
      setOutgoingItems(outgoingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  // عند اختيار الصنف، الوحدة تظهر تلقائيًا
  const handleSelectChange = (e) => {
    const name = e.target.value;
    setSelectedName(name);
    const item = storeItems.find(i => i.name === name);
    setUnit(item ? item.unit : "");
  };

  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    if (!selectedName || !quantity || !unit) return;

    const storeItem = storeItems.find(i => i.name === selectedName);
    if (!storeItem) return alert("الصنف غير موجود في المخزن!");
    if (quantity > storeItem.quantity) return alert("الكمية المطلوبة أكبر من الموجود في المخزن!");

    const now = new Date().toLocaleString();

    // تحديث أو إضافة في الصادر
    if (editingId) {
      const docRef = doc(db, "outgoingGoods", editingId);
      await updateDoc(docRef, { name: selectedName, quantity: Number(quantity), unit, date: now });
      setOutgoingItems(outgoingItems.map(item => item.id === editingId ? { ...item, name: selectedName, quantity: Number(quantity), unit, date: now } : item));
      setEditingId(null);
    } else {
      const docRef = await addDoc(outgoingCollection, { name: selectedName, quantity: Number(quantity), unit, date: now });
      setOutgoingItems([...outgoingItems, { id: docRef.id, name: selectedName, quantity: Number(quantity), unit, date: now }]);
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
    await deleteDoc(doc(db, "outgoingGoods", id));
    setOutgoingItems(outgoingItems.filter(item => item.id !== id));
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#ffe0b8", minHeight: "100vh" }}>
      <button onClick={onBack} style={{ marginBottom: "20px", padding: "8px 15px", backgroundColor: "#333", color: "white", border: "none", cursor: "pointer" }}>رجوع</button>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>البضاعة الصادرة</h1>

      <form onSubmit={handleAddOrEdit} style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
        <select value={selectedName} onChange={handleSelectChange} style={{ padding: "12px", width: "220px", fontSize: "16px" }}>
          <option value="">اختر اسم الصنف</option>
          {storeItems.map(item => (
            <option key={item.id} value={item.name}>{item.name}</option>
          ))}
        </select>

        <input type="number" placeholder="الكمية" value={quantity} onChange={e => setQuantity(e.target.value)} style={{ padding: "12px", width: "120px", fontSize: "16px" }} />

        <input type="text" placeholder="الوحدة" value={unit} readOnly style={{ padding: "12px", width: "140px", fontSize: "16px", backgroundColor: "#eee" }} />

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
