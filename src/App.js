import React, { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StoreDashboard from "./pages/StoreDashboard";
import StockPage from "./pages/StockPage";
import IncomingGoods from "./pages/IncomingGoods";
import OutgoingGoods from "./pages/OutgoingGoods";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [section, setSection] = useState(null);
  const [subSection, setSubSection] = useState(null);

  const [stockItems, setStockItems] = useState([]); // المصدر الوحيد للبيانات

  const handleLogin = () => setIsLoggedIn(true);
  
  const handleSelectSection = (sec) => {
    setSection(sec);
    setSubSection(null);
  };

  const handleSelectSubSection = (subSec) => setSubSection(subSec);

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  if (section === "stock") {
    if (!subSection)
      return (
        <StoreDashboard
          onSelectSection={handleSelectSubSection}
          showBackButton={() => setSection(null)}
        />
      );

    if (subSection === "stock-main")
      return (
        <StockPage
          stockItems={stockItems}
          setStockItems={setStockItems}
          onBack={() => setSubSection(null)}
        />
      );

    if (subSection === "incoming")
      return (
        <IncomingGoods
          stockItems={stockItems}
          setStockItems={setStockItems}
          onBack={() => setSubSection(null)}
        />
      );

    if (subSection === "outgoing")
      return (
        <OutgoingGoods
          stockItems={stockItems}
          setStockItems={setStockItems}
          onBack={() => setSubSection(null)}
        />
      );
  }

  return <Dashboard onSelectSection={handleSelectSection} />;
}

export default App;
