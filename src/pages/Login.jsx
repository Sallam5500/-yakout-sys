import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // بيانات الدخول التجريبية
    if (username === "admin" && password === "1234") {
      onLogin(); // تغير حالة تسجيل الدخول في App.jsx
    } else {
      setError("اسم المستخدم أو كلمة المرور خطأ");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", width: "300px" }}>
        <h2 style={{ textAlign: "center" }}>تسجيل الدخول</h2>
        <input
          type="text"
          placeholder="اسم المستخدم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: "10px", padding: "8px" }}
        />
        {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
        <button type="submit" style={{ padding: "10px", backgroundColor: "#4CAF50", color: "white", border: "none" }}>
          تسجيل الدخول
        </button>
      </form>
    </div>
  );
};

export default Login;
