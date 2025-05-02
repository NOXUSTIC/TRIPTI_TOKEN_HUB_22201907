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
    <div className="min-h-screen p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">{student.name}</h2>
          <p>{student.dormName}</p>
          <p>ID: {student.studentId}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>

      <div className="mb-6">
        <p className="text-lg font-medium mb-2">Do you want to take token?</p>
        <div className="space-x-4">
          <button
            onClick={handleYes}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            YES
          </button>
          <button
            onClick={handleNo}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            NO
          </button>
        </div>
        {message && <p className="mt-2 text-red-600">{message}</p>}
      </div>

      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-2">Meal Type</h3>
          <p>{tokenInfo.mealType || 'N/A'}</p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-2">Used Tokens</h3>
          <p>{tokenInfo.usedTokens}</p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-2">Remaining Tokens</h3>
          <p>{tokenInfo.remainingTokens}</p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-2">Total Tokens</h3>
          <p>{tokenInfo.totalTokens}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;
