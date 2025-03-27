import { Routes, Route } from "react-router-dom";
import React from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import EntryPoint from "./components/Entrypoint";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import VerifyResetOtp from "./components/verifyResetOtp";
import Dashboard from "./components/Dashboard";


function App() {
  return (
    <Routes>
      <Route path="/" element={<EntryPoint />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-reset-otp" element={<VerifyResetOtp/>}/>
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      
      
    </Routes>
  );
}

export default App;
