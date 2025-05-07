import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentPortal = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    name: '',
    dormName: '',
    studentId: '',
  });
  const [tokenInfo, setTokenInfo] = useState({
    mealType: null,
    usedTokens: 0,
    remainingTokens: 13,
    totalTokens: 13,
    tokenWeekYear: null,
  });
  const [message, setMessage] = useState('');

  // For demo, get student info from localStorage or hardcoded
  useEffect(() => {
    // In real app, get student info from auth context or API
    const storedStudent = JSON.parse(localStorage.getItem('studentInfo'));
    if (storedStudent) {
      setStudent(storedStudent);
      fetchTokenInfo(storedStudent.studentId);
    } else {
      // Redirect to sign in if no student info
      navigate('/');
    }
  }, [navigate]);

  const fetchTokenInfo = async (studentId) => {
    try {
      const response = await axios.get("http://localhost:5000/api/token-info/" + studentId);
      setTokenInfo(response.data);
    } catch (err) {
      console.error('Error fetching token info:', err);
    }
  };

  const handleYes = () => {
    if (tokenInfo.tokenWeekYear) {
      setMessage('Token limit reached for this week');
    } else {
      navigate('/token-selection', { state: { studentId: student.studentId } });
    }
  };

  const handleNo = () => {
    if (tokenInfo.tokenWeekYear) {
      setMessage('Token limit reached for this week');
      return;
    }
    // If NO, update tokens accordingly (usedTokens +1, remainingTokens -1)
    axios.post('http://localhost:5000/api/submit-token', {
      studentId: student.studentId,
      mealType: 'No Token',
    })
    .then((res) => {
      setMessage('Token updated for this week');
      fetchTokenInfo(student.studentId);
    })
    .catch((err) => {
      setMessage(err.response?.data?.message || 'Server error');
    });
  };

  const handleSignOut = () => {
    localStorage.removeItem('studentInfo');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 font-sans text-foreground">
      <div className="bg-foreground rounded-3xl shadow-xl max-w-4xl w-full p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold border border-green-900 px-3 py-1 rounded-full inline-block text-shadow-deep-green">{student.name}</h2>
            <p className="text-[#262840]">{student.dormName}</p>
            <p className="text-[#262840]">ID: {student.studentId}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="bg-[#274B07] px-6 py-2 rounded-xl hover:bg-primary-hover shadow-lg transition text-white"
          >
            Sign Out
          </button>
        </header>

        <section className="mb-10">
          <p className="text-xl font-semibold mb-4">Do you want to take token?</p>
          <div className="space-x-8">
            <button
              onClick={handleYes}
              className="bg-[#274B07] px-8 py-3 rounded-xl hover:bg-primary-hover shadow-lg transition text-white font-semibold"
            >
              YES
            </button>
            <button
              onClick={handleNo}
              className="bg-cream px-8 py-3 rounded-xl hover:bg-milkywhite shadow-lg transition text-background font-semibold"
            >
              NO
            </button>
          </div>
          {message && (
            <p
              className={`mt-6 font-semibold ${
                message === 'Token limit reached for this week' ? 'text-red-600' : 'text-neongreen'
              }`}
            >
              {message}
            </p>
          )}
        </section>

        <section className="grid grid-cols-4 gap-8 text-center">
          <div className="bg-cream rounded-xl p-6 shadow-md">
            <h3 className="font-semibold text-[#274B07] mb-3">Meal Type</h3>
            <p className="text-background">{tokenInfo.mealType || 'N/A'}</p>
          </div>
          <div className="bg-cream rounded-xl p-6 shadow-md">
            <h3 className="font-semibold text-[#274B07] mb-3">Used Tokens</h3>
            <p className="text-background">{tokenInfo.usedTokens}</p>
          </div>
          <div className="bg-cream rounded-xl p-6 shadow-md">
            <h3 className="font-semibold text-[#274B07] mb-3">Remaining Tokens</h3>
            <p className="text-background">{tokenInfo.remainingTokens}</p>
          </div>
          <div className="bg-cream rounded-xl p-6 shadow-md">
            <h3 className="font-semibold text-[#274B07] mb-3">Total Tokens</h3>
            <p className="text-background">{tokenInfo.totalTokens}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudentPortal;
