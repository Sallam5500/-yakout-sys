// src/pages/Employees.jsx
import React, { useState } from "react";
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
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    age: "",
    status: "أعزب",
    tasks: "",
    photo: null,
    section: sections[0],
  });

  // إضافة موظف
  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.age) return;
    setEmployees([...employees, { ...newEmployee, id: Date.now() }]);
    setNewEmployee({ name: "", age: "", status: "أعزب", tasks: "", photo: null, section: sections[0] });
  };

  // حذف موظف
  const handleDeleteEmployee = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  // تحميل صورة
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setNewEmployee({ ...newEmployee, photo: reader.result });
      reader.readAsDataURL(file);
    }
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
        <input type="file" accept="image/*" onChange={handlePhotoChange} />
        <button onClick={handleAddEmployee}>إضافة موظف</button>
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
            <button onClick={() => handleDeleteEmployee(emp.id)}>حذف</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Employees;
