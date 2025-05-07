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
    <div className="min-h-screen flex font-sans bg-foreground text-foreground">
      {/* Single container centered vertically and horizontally */}
      <div className="flex-1 flex flex-col justify-center items-center p-12">
        <div className="bg-foreground p-8 rounded-3xl shadow-xl max-w-md w-full space-y-6 text-center">
          <h1 className="text-4xl font-bold text-[#262840] mb-6 tracking-wide">Choose Your Token</h1>
          <div className="grid grid-cols-2 gap-6 mb-6 justify-center">
            {mealTypes.map((meal) => (
              <button
                key={meal}
                onClick={() => setSelectedMeal(meal)}
                className={`py-6 rounded-xl text-lg font-semibold transition-transform transform focus:outline-none focus:ring-4 focus:ring-neongreen ${
                  selectedMeal === meal
                    ? 'bg-neongreen text-background shadow-lg scale-105'
                    : 'bg-background text-foreground hover:bg-neongreen hover:text-background'
                }`}
              >
                {meal}
              </button>
            ))}
          </div>
          {error && <p className="text-neongreen text-center">{error}</p>}
          <button
            onClick={handleConfirm}
            disabled={confirming}
            className="w-full bg-neongreen text-background py-3 rounded-xl text-lg font-semibold hover:bg-primary-hover transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {confirming ? 'Confirming...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenSelection;
