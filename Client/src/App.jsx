import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "../components/Chat";
import Home from "../pages/Home";
import Login from "../pages/Login";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
};

export default App;
