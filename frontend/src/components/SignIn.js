import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/signin', { email, password });
      if (response.data.success) {
        if (email.endsWith('@g.bracu.ac.bd')) {
          localStorage.setItem('studentInfo', JSON.stringify(response.data.student));
          navigate('/student-portal');
        } else if (email.endsWith('@bracu.ac.bd')) {
          navigate('/admin-portal');
        } else {
          setError('Email domain not authorized');
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-background text-foreground">
      {/* Left side with title and designs */}
      <div className="flex-1 flex flex-col justify-center items-start p-16 space-y-8 bg-gradient-to-br from-neongreen via-milkywhite to-cream animate-black-green-pulse">
        <div className="flex flex-col items-start text-7xl font-extrabold tracking-wide leading-tight text-[#262840]">
          <span>TRIPTI Token Management System</span>
        </div>
        {/* Add some decorative vector-style shapes */}
        <div className="flex space-x-4 mt-8">
          <div className="w-16 h-16 bg-white rounded-full opacity-70 animate-pulse"></div>
          <div className="w-24 h-24 bg-white rounded-lg opacity-60 animate-pulse"></div>
          <div className="w-12 h-12 bg-white rounded-full opacity-50 animate-pulse"></div>
        </div>
      </div>

      {/* Right side with sign-in form */}
      <div className="flex-1 flex justify-center items-center p-12">
        <form onSubmit={handleSignIn} className="bg-foreground p-8 rounded-3xl shadow-xl max-w-md w-full space-y-6">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-background text-foreground placeholder-cream focus:outline-none focus:ring-4 focus:ring-neongreen transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-background text-foreground placeholder-cream focus:outline-none focus:ring-4 focus:ring-neongreen transition"
          />
          {error && <p className="text-neongreen">{error}</p>}
          <button
            type="submit"
            className="w-full bg-neongreen text-background py-3 rounded-xl text-lg font-semibold hover:bg-primary-hover transition shadow-lg"
          >
            Sign In
          </button>
          <div className="flex justify-between text-sm text-foreground">
            <Link to="/signup" className="text-green-900 hover:underline">
              Sign Up
            </Link>
            <Link to="/forgot-password" className="text-green-900 hover:underline">
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
