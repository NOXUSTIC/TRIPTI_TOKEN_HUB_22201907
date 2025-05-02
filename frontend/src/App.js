import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import StudentPortal from './components/StudentPortal';
import TokenSelection from './components/TokenSelection';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/student-portal" element={<StudentPortal />} />
        <Route path="/token-selection" element={<TokenSelection />} />
      </Routes>
    </Router>
  );
}

export default App;
