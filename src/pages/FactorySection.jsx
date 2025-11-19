import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  doc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import "./FactorySection.css";

const FactorySection = ({ section, onBack }) => {
  // الأصناف
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [newItemName, setNewItemName] = useState("");

  // الأوردرات
  const [type, setType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [rows, setRows] = useState([]);

  // الاستلام
  const [receivedRows, setReceivedRows] = useState([]);
  const [receivedItem, setReceivedItem] = useState("");
  const [receivedQty, setReceivedQty] = useState("");

  // مشرف
  const [password, setPassword] = useState("");
  const [isSupervisor, setIsSupervisor] = useState(false);
  const supervisorPassword = "2468";

  // اختيار التاريخ
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  ); // YYYY-MM-DD

  const sectionTitles = {
    oriental: "الحلويات الشرقية",
    tort: "قسم التورت",
    gateau: "قسم الجاتوه",
    mousse: "قسم الموس",
    "french-mousse": "قسم الموس الفرنسي",
    pieces: "قسم التقطيعات",
  };

  // Firestore Collections
  const itemsRef = collection(db, "factory-items");

  const getOrdersCollection = () =>
    collection(db, "factory-orders", selectedDate, "orders");
  const getReceivedCollection = () =>
    collection(db, "factory-received", selectedDate, "received");

  // جلب الأصناف
  useEffect(() => {
    const unsubscribe = onSnapshot(itemsRef, (snapshot) => {
      const fetchedItems = snapshot.docs.map((doc) => doc.data().name);
      setItems(fetchedItems);
    });
    return () => unsubscribe();
  }, []);

  // جلب الأوردرات حسب التاريخ
  useEffect(() => {
    const ordersRef = getOrdersCollection();
    const q = query(ordersRef, orderBy("time", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedRows = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRows(fetchedRows);
    });
    return () => unsubscribe();
  }, [selectedDate]);

  // جلب الاستلام حسب التاريخ
  useEffect(() => {
    const receivedRef = getReceivedCollection();
    const q = query(receivedRef, orderBy("time", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReceived = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReceivedRows(fetchedReceived);
    });
    return () => unsubscribe();
  }, [selectedDate]);

  // إضافة صنف جديد
  const handleAddItem = async () => {
    if (newItemName && !items.includes(newItemName)) {
      try {
        await addDoc(itemsRef, { name: newItemName });
        setSelectedItem(newItemName);
        setNewItemName("");
      } catch (err) {
        console.error(err);
      }
    }
  };

  // إضافة أوردر
  const handleAddRow = async () => {
    if (!selectedItem || !quantity) return;
    try {
      const ordersRef = getOrdersCollection();
      await addDoc(ordersRef, {
        item: selectedItem,
        quantity: Number(quantity),
        type,
        time: new Date().toLocaleTimeString(),
        section,
      });
      setQuantity("");
      setType("");
      setTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(err);
    }
  };

  // تسجيل استلام
  const handleAddReceived = async () => {
    if (!receivedItem || !receivedQty) return;
    try {
      const receivedRef = getReceivedCollection();
      await addDoc(receivedRef, {
        item: receivedItem,
        received: Number(receivedQty),
        time: new Date().toLocaleTimeString(),
        section,
      });
      setReceivedQty("");
    } catch (err) {
      console.error(err);
    }
  };

  // حساب الملخص
  const summary = items.map((item) => {
    const orderQty = rows
      .filter((r) => r.item === item)
      .reduce((acc, r) => acc + Number(r.quantity), 0);

    const receivedQty = receivedRows
      .filter((r) => r.item === item)
      .reduce((acc, r) => acc + Number(r.received), 0);

    return { item, orderQty, receivedQty, diff: receivedQty - orderQty };
  });

  return (
    <div className="factory-section">
      <button
        className="back-btn"
        onClick={onBack}
        style={{ marginBottom: "15px" }}
      >
        ← رجوع
      </button>

      <h1>{sectionTitles[section]}</h1>

      {/* اختيار التاريخ */}
      <div className="date-picker">
        <label>اختر اليوم:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* إضافة صنف وأوردر */}
      <div className="controls">
        <div className="dropdown-control">
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
          >
            <option value="">-- اختر صنف --</option>
            {items.map((item, i) => (
              <option key={i} value={item}>
                {item}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="أضف صنف جديد"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <button onClick={handleAddItem}>إضافة صنف</button>
        </div>

        <div className="input-control">
          <input
            type="number"
            placeholder="الكمية"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <input
            type="text"
            placeholder="النوع"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <button onClick={handleAddRow}>إضافة صف</button>
        </div>
      </div>

      {/* جدول الأوردرات */}
      <table className="styled-table">
        <thead>
          <tr>
            <th>الصنف</th>
            <th>الكمية</th>
            <th>النوع</th>
            <th>الوقت</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.item}</td>
              <td>{row.quantity}</td>
              <td>{row.type}</td>
              <td>{row.time}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔐 تسجيل دخول المشرف */}
      {!isSupervisor && (
        <div className="supervisor-login">
          <h3>تسجيل دخول المشرف</h3>
          <input
            type="password"
            placeholder="ادخل كلمة السر"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={() => {
              if (password === supervisorPassword) setIsSupervisor(true);
              else alert("كلمة السر غير صحيحة");
            }}
          >
            دخول
          </button>
        </div>
      )}

      {/* قسم الاستلام والملخص */}
      {isSupervisor && (
        <>
          <h2>تسجيل الاستلام من المشرف</h2>
          <div className="input-control">
            <select
              value={receivedItem}
              onChange={(e) => setReceivedItem(e.target.value)}
            >
              <option value="">-- اختر صنف --</option>
              {items.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="الكمية المستلمة"
              value={receivedQty}
              onChange={(e) => setReceivedQty(e.target.value)}
            />
            <button onClick={handleAddReceived}>تسجيل استلام</button>
          </div>

          <h2 style={{ marginTop: "20px" }}>ملخص اليوم</h2>
          <table className="styled-table">
            <thead>
              <tr>
                <th>الصنف</th>
                <th>أوردر المصنع</th>
                <th>الاستلام</th>
                <th>العجز / الفائض</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((s, i) => (
                <tr key={i}>
                  <td>{s.item}</td>
                  <td>{s.orderQty}</td>
                  <td>{s.receivedQty}</td>
                  <td style={{ color: s.diff < 0 ? "red" : "green" }}>
                    {s.diff}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default FactorySection;
