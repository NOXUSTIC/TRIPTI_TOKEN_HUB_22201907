import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const operations = [
  { op: 'add', symbol: '+' },
  { op: 'subtract', symbol: '-' },
  { op: 'multiply', symbol: '*' },
  { op: 'divide', symbol: '/' },
];

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operation, setOperation] = useState('add');
  const [captchaInput, setCaptchaInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    if (num1 !== 0 && num2 !== 0) {
      // Do not generate new captcha if one already exists
      return;
    }
    const n1 = getRandomInt(1, 20);
    const n2 = getRandomInt(1, 20);
    const opIndex = getRandomInt(0, operations.length - 1);
    setNum1(n1);
    setNum2(n2);
    setOperation(operations[opIndex].op);
    setCaptchaInput('');
    setError('');
    setSuccess('');
  };

  const calculateResult = () => {
    switch (operation) {
      case 'add':
        return num1 + num2;
      case 'subtract':
        return num1 - num2;
      case 'multiply':
        return num1 * num2;
      case 'divide':
        return num2 !== 0 ? num1 / num2 : null;
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Email is required');
      return;
    }
    if (!newPassword) {
      setError('New password is required');
      return;
    }
    if (captchaInput === '') {
      setError('Captcha result is required');
      return;
    }

    const expectedResult = calculateResult();
    if (expectedResult === null) {
      setError('Invalid captcha operation');
      return;
    }

    // For division, allow some tolerance for floating point
    const userResult = parseFloat(captchaInput);
    if (
      (operation === 'divide' && Math.abs(userResult - expectedResult) > 0.0001) ||
      (operation !== 'divide' && userResult !== expectedResult)
    ) {
      setError('Captcha validation failed');
      generateCaptcha();
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/reset-password', {
        email,
        newPassword,
        captchaResult: userResult,
        num1,
        num2,
        operation,
      });

      if (response.data.success) {
        setSuccess('Password reset successful. You can now sign in with your new password.');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setError(response.data.message || 'Password reset failed');
        generateCaptcha();
      }
    } catch (err) {
      setError('Server error. Please try again later.');
      generateCaptcha();
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-background text-foreground justify-center items-center p-12">
      <form onSubmit={handleSubmit} className="bg-foreground p-8 rounded-3xl shadow-xl max-w-md w-full space-y-6">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 rounded-xl bg-background text-foreground placeholder-cream focus:outline-none focus:ring-4 focus:ring-neongreen transition"
        />
        <div className="text-lg font-semibold text-black">
        Solve: {num1} {operations.find((o) => o.op === operation)?.symbol} {num2} = ?
        </div>
        <input
          type="number"
          placeholder="Enter captcha result"
          value={captchaInput}
          onChange={(e) => setCaptchaInput(e.target.value)}
          required
          className="w-full p-3 rounded-xl bg-background text-foreground placeholder-cream focus:outline-none focus:ring-4 focus:ring-neongreen transition"
        />
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full p-3 rounded-xl bg-background text-foreground placeholder-cream focus:outline-none focus:ring-4 focus:ring-neongreen transition"
        />
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
        <button
          type="submit"
          className="w-full bg-neongreen text-background py-3 rounded-xl text-lg font-semibold hover:bg-primary-hover transition shadow-lg"
        >
          Reset Password
        </button>
        <button
          type="button"
          onClick={generateCaptcha}
          className="w-full bg-gray-500 text-background py-2 rounded-xl text-md font-semibold hover:bg-gray-600 transition shadow-lg"
        >
          Refresh Captcha
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
