import { Routes, Route } from "react-router-dom";
import React from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EntryPoint from "./pages/Entrypoint";


function App() {
  return (
    <Routes>
      <Route path="/" element={<EntryPoint />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
    </Routes>
  );
}

export default App;
