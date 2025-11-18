// src/pages/Employees.jsx
import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./Employees.css";

const sections = [
  "الإدارة",
  "الحلويات الشرقية",
  "التورت",
  "الجاتوه",
  "النظافة",
  "الموس",
  "الموس الفرنسي",
  "العربيات",
  "الفرن",
];

const Employees = ({ onBack }) => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    age: "",
    status: "أعزب",
    tasks: "",
    section: sections[0],
    photoFile: null,
  });

  // -----------------------------
  // 🟢 جلب الموظفين بشكل لحظي من Firestore
  // -----------------------------
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "employees"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEmployees(data);
    });
    return () => unsub();
  }, []);

  // -----------------------------
  // 🔵 رفع الصورة على Storage
  // -----------------------------
  const handlePhotoUpload = async (file) => {
    if (!file) return null;
    const storageRef = ref(storage, `employees/${file.name}_${Date.now()}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  // -----------------------------
  // 🟡 إضافة أو تعديل موظف
  // -----------------------------
  const handleAddOrEditEmployee = async () => {
    if (!newEmployee.name || !newEmployee.age) return alert("املأ البيانات كاملة");

    let photoURL = null;
    if (newEmployee.photoFile) {
      photoURL = await handlePhotoUpload(newEmployee.photoFile);
    }

    if (editingId) {
      // تعديل
      const docRef = doc(db, "employees", editingId);
      await updateDoc(docRef, {
        name: newEmployee.name,
        age: newEmployee.age,
        status: newEmployee.status,
        tasks: newEmployee.tasks,
        section: newEmployee.section,
        ...(photoURL && { photo: photoURL }),
      });
      setEditingId(null);
    } else {
      // إضافة جديد
      await addDoc(collection(db, "employees"), {
        name: newEmployee.name,
        age: newEmployee.age,
        status: newEmployee.status,
        tasks: newEmployee.tasks,
        section: newEmployee.section,
        photo: photoURL,
        createdAt: new Date().toISOString(),
      });
    }

    setNewEmployee({
      name: "",
      age: "",
      status: "أعزب",
      tasks: "",
      section: sections[0],
      photoFile: null,
    });
  };

  // -----------------------------
  // ✏️ تعديل الموظف
  // -----------------------------
  const handleEditEmployee = (emp) => {
    setEditingId(emp.id);
    setNewEmployee({
      name: emp.name,
      age: emp.age,
      status: emp.status,
      tasks: emp.tasks,
      section: emp.section,
      photoFile: null, // رفع صورة جديدة فقط
    });
  };

  // -----------------------------
  // ❌ حذف الموظف
  // -----------------------------
  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("هل أنت متأكد من الحذف؟")) return;
    await deleteDoc(doc(db, "employees", id));
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="employees-page">
      <button className="back-btn" onClick={onBack}>← رجوع</button>
      <h1 className="dashboard-title">الموظفين 👥</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="ابحث باسم الموظف..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="add-employee-form">
        <input
          type="text"
          placeholder="الاسم"
          value={newEmployee.name}
          onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="العمر"
          value={newEmployee.age}
          onChange={(e) => setNewEmployee({ ...newEmployee, age: e.target.value })}
        />
        <select
          value={newEmployee.status}
          onChange={(e) => setNewEmployee({ ...newEmployee, status: e.target.value })}
        >
          <option value="أعزب">أعزب</option>
          <option value="متزوج">متزوج</option>
        </select>
        <input
          type="text"
          placeholder="المهام"
          value={newEmployee.tasks}
          onChange={(e) => setNewEmployee({ ...newEmployee, tasks: e.target.value })}
        />
        <select
          value={newEmployee.section}
          onChange={(e) => setNewEmployee({ ...newEmployee, section: e.target.value })}
        >
          {sections.map((sec) => (
            <option key={sec} value={sec}>{sec}</option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewEmployee({ ...newEmployee, photoFile: e.target.files[0] })}
        />
        <button onClick={handleAddOrEditEmployee}>
          {editingId ? "تحديث الموظف" : "إضافة موظف"}
        </button>
      </div>

      <div className="employees-cards">
        {filteredEmployees.map((emp) => (
          <div key={emp.id} className="employee-card">
            {emp.photo && <img src={emp.photo} alt={emp.name} className="employee-photo" />}
            <h3>{emp.name}</h3>
            <p>العمر: {emp.age}</p>
            <p>الحالة: {emp.status}</p>
            <p>المهام: {emp.tasks}</p>
            <p>القسم: {emp.section}</p>
            <button onClick={() => handleEditEmployee(emp)}>تعديل</button>
            <button onClick={() => handleDeleteEmployee(emp.id)}>حذف</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Employees;
