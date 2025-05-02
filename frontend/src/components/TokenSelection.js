import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const TokenSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMeal, setSelectedMeal] = useState('');
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);

  const mealTypes = ['Beef', 'Chicken', 'Mutton', 'Duck'];

  // Get studentId from location state
  const studentId = location.state?.studentId;

  useEffect(() => {
    if (!studentId) {
      // If no studentId, redirect to sign in
      navigate('/');
    }
  }, [studentId, navigate]);

  const handleConfirm = async () => {
    if (!selectedMeal) {
      setError('Please select a meal type');
      return;
    }
    setError('');
    setConfirming(true);
    try {
      const response = await axios.post('http://localhost:5000/api/submit-token', {
        studentId,
        mealType: selectedMeal,
      });
      alert('Token confirmed!');
      navigate('/student-portal');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Server error. Please try again later.');
      }
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Choose Your Token</h1>
      <div className="grid grid-cols-2 gap-4 mb-6 w-full max-w-md">
        {mealTypes.map((meal) => (
          <button
            key={meal}
            onClick={() => setSelectedMeal(meal)}
            className={`p-4 rounded border text-center ${
              selectedMeal === meal ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'
            }`}
          >
            {meal}
          </button>
        ))}
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        onClick={handleConfirm}
        disabled={confirming}
        className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition"
      >
        {confirming ? 'Confirming...' : 'Confirm'}
      </button>
    </div>
  );
};

export default TokenSelection;
