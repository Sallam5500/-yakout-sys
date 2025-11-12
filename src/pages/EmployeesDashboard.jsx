// src/pages/EmployeesDashboard.jsx
import React, { useState } from "react";
import "./EmployeesDashboard.css";

const initialDepartments = [
  { id: "oriental", title: "الحلويات الشرقية" },
  { id: "tort", title: "التورت" },
  { id: "gateau", title: "الجاتوه" },
  { id: "mousse", title: "الموس" },
  { id: "french-mousse", title: "الموس الفرنسي" },
  { id: "cleaning", title: "النظافة والصيانة" },
  { id: "cars", title: "العربيات" },
  { id: "oven", title: "الفرن" },
  { id: "admin", title: "الإدارة" },
];

const EmployeesDashboard = ({ onBack }) => {
  const [selectedDept, setSelectedDept] = useState(null);
  const [employees, setEmployees] = useState({});
  const [search, setSearch] = useState("");

  const [newEmp, setNewEmp] = useState({
    name: "",
    age: "",
    status: "أعزب",
    tasks: "",
    photo: null,
  });

  const handleAddEmployee = () => {
    if (!newEmp.name || !newEmp.age) return;
    const deptEmployees = employees[selectedDept] || [];
    setEmployees({
      ...employees,
      [selectedDept]: [...deptEmployees, { ...newEmp, id: Date.now() }],
    });
    setNewEmp({ name: "", age: "", status: "أعزب", tasks: "", photo: null });
  };

  const handleDeleteEmployee = (id) => {
    setEmployees({
      ...employees,
      [selectedDept]: employees[selectedDept].filter(emp => emp.id !== id),
    });
  };

  const filteredEmployees =
    selectedDept && employees[selectedDept]
      ? employees[selectedDept].filter(emp =>
          emp.name.toLowerCase().includes(search.toLowerCase())
        )
      : [];

  // الصفحة الرئيسية للأقسام
  if (!selectedDept)
    return (
      <div className="dashboard">
        <button className="back-btn" onClick={onBack}>← رجوع</button>
        <h1 className="dashboard-title">أقسام المصنع</h1>
        <div className="cards-container">
          {initialDepartments.map((dept) => (
            <div
              key={dept.id}
              className="card"
              onClick={() => setSelectedDept(dept.id)}
            >
              <h2>{dept.title}</h2>
            </div>
          ))}
        </div>
      </div>
    );

  // صفحة الموظفين لقسم معين
  return (
    <div className="dashboard">
      <button className="back-btn" onClick={() => setSelectedDept(null)}>← رجوع للأقسام</button>
      <h1 className="dashboard-title">{initialDepartments.find(d => d.id === selectedDept).title}</h1>

      {/* إضافة موظف جديد */}
      <div className="employee-form">
        <input
          type="text"
          placeholder="الاسم"
          value={newEmp.name}
          onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="العمر"
          value={newEmp.age}
          onChange={(e) => setNewEmp({ ...newEmp, age: e.target.value })}
        />
        <select
          value={newEmp.status}
          onChange={(e) => setNewEmp({ ...newEmp, status: e.target.value })}
        >
          <option value="أعزب">أعزب</option>
          <option value="متزوج">متزوج</option>
        </select>
        <input
          type="text"
          placeholder="المهام"
          value={newEmp.tasks}
          onChange={(e) => setNewEmp({ ...newEmp, tasks: e.target.value })}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setNewEmp({ ...newEmp, photo: URL.createObjectURL(e.target.files[0]) });
            }
          }}
        />
        <button onClick={handleAddEmployee}>إضافة موظف</button>
      </div>

      {/* البحث */}
      <input
        type="text"
        placeholder="بحث عن موظف"
        className="search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* جدول الموظفين */}
      <table className="styled-table">
        <thead>
          <tr>
            <th>الصورة</th>
            <th>الاسم</th>
            <th>العمر</th>
            <th>الحالة</th>
            <th>المهام</th>
            <th>حذف</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp) => (
            <tr key={emp.id}>
              <td>
                {emp.photo ? <img src={emp.photo} alt={emp.name} className="emp-photo" /> : "لا توجد صورة"}
              </td>
              <td>{emp.name}</td>
              <td>{emp.age}</td>
              <td>{emp.status}</td>
              <td>{emp.tasks}</td>
              <td>
                <button onClick={() => handleDeleteEmployee(emp.id)}>حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeesDashboard;
