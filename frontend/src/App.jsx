import { Routes, Route } from "react-router-dom";
import React from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EntryPoint from "./pages/Entrypoint";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyResetOtp from "./pages/verifyResetOtp";


function App() {
  return (
    <Routes>
      <Route path="/" element={<EntryPoint />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-reset-otp" element={<VerifyResetOtp/>}/>
      <Route path="/reset-password" element={<ResetPassword />} />
      
    </Routes>
  );
}

export default App;
