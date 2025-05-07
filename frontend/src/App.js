import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import StudentPortal from './components/StudentPortal';
import AdminPortal from './components/AdminPortal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/student-portal" element={<StudentPortal />} />
        <Route path="/admin-portal" element={<AdminPortal />} />
      </Routes>
    </Router>
  );
}

export default App;
