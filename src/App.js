// src/App.jsx
import React, { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StoreDashboard from "./pages/StoreDashboard";
import Distribution from "./pages/Distribution";
import StockPage from "./pages/StockPage";
import IncomingGoods from "./pages/IncomingGoods";
import OutgoingGoods from "./pages/OutgoingGoods";
import BranchPage from "./pages/BranchPage";
import FactoryDashboard from "./pages/FactoryDashboard";
import FactorySection from "./pages/FactorySection";
import EmployeesDashboard from "./pages/EmployeesDashboard"; // تم التغيير

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [section, setSection] = useState(null);          
  const [subSection, setSubSection] = useState(null);    
  const [branch, setBranch] = useState(null);            
  const [branchSubPage, setBranchSubPage] = useState(null);
  const [stockItems, setStockItems] = useState([]);      
  const [factorySection, setFactorySection] = useState(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setSection(null);
  };

  const handleSelectSection = (sec) => {
    setSection(sec);
    setSubSection(null);
    setBranch(null);
    setBranchSubPage(null);
    setFactorySection(null);
  };

  const handleSelectSubSection = (subSec) => setSubSection(subSec);
  const handleSelectBranch = (branchId) => {
    setBranch(branchId);
    setBranchSubPage(null);
  };
  const handleSelectBranchSubPage = (pageId) => setBranchSubPage(pageId);

  // ================== الصفحات ==================

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;
  if (!section) return <Dashboard onSelectSection={handleSelectSection} />;

  // إدارة المخزن
  if (section === "stock") {
    if (!subSection)
      return <StoreDashboard onSelectSection={handleSelectSubSection} onBack={() => setSection(null)} />;
    if (subSection === "stock-main")
      return <StockPage stockItems={stockItems} setStockItems={setStockItems} onBack={() => setSubSection(null)} />;
    if (subSection === "incoming")
      return <IncomingGoods stockItems={stockItems} setStockItems={setStockItems} onBack={() => setSubSection(null)} />;
    if (subSection === "outgoing")
      return <OutgoingGoods stockItems={stockItems} setStockItems={setStockItems} onBack={() => setSubSection(null)} />;
  }

  // إدارة المصنع
  if (section === "factory") {
    if (!factorySection)
      return <FactoryDashboard onSelectSection={(id) => setFactorySection(id)} onBack={() => setSection(null)} />;
    return <FactorySection section={factorySection} onBack={() => setFactorySection(null)} />;
  }

  // إدارة المحلات
  if (section === "store") {
    if (!branch)
      return <Distribution onSelectStore={handleSelectBranch} onBack={() => setSection(null)} />;
    if (branchSubPage)
      return <BranchPage branch={branch} page={branchSubPage} onBack={() => setBranchSubPage(null)} />;

    return (
      <div className="dashboard">
        <h1 className="dashboard-title">{branch === "barkaselba" ? "فرع بركة السبع 🏪" : "فرع قويسنا 🏬"}</h1>
        <button className="back-btn" onClick={() => setBranch(null)}>← رجوع</button>
        <div className="cards-container">
          <div className="card" onClick={() => handleSelectBranchSubPage("from-factory")}><h2>تحميل من المصنع</h2></div>
          <div className="card" onClick={() => handleSelectBranchSubPage("store-receive")}><h2>استلام محلات</h2></div>
          <div className="card" onClick={() => handleSelectBranchSubPage("daily-stock")}><h2>الجرد اليومي</h2></div>
          <div className="card" onClick={() => handleSelectBranchSubPage("daily-order")}><h2>الأوردر اليومي</h2></div>
        </div>
      </div>
    );
  }

  // باقي الأقسام
  if (section === "purchases")
    return <div className="dashboard"><h1>صفحة المشتريات</h1></div>;

  if (section === "employees")
    return <EmployeesDashboard onBack={() => setSection(null)} />; // هنا عرض Dashboard للموظفين

  if (section === "maintenance")
    return <div className="dashboard"><h1>صفحة الصيانة والنظافة</h1></div>;

  return <Dashboard onSelectSection={handleSelectSection} />;
}

export default App;
