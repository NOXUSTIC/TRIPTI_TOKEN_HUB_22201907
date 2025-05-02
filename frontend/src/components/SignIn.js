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
        } else {
          setError('Email domain not authorized for Student portal');
        }
      }else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">TRIPTI TOKEN HUB</h1>
      <form onSubmit={handleSignIn} className="bg-white p-8 rounded shadow-md w-80">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Sign In
        </button>
        <div className="flex justify-between mt-4 text-sm">
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
          <a href="#" className="text-blue-600 hover:underline">
            Forgot password?
          </a>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
