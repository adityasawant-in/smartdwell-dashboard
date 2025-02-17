import React, { useState, useEffect } from 'react';

const MotorControl = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [error, setError] = useState(null);

  const controlMotor = async (status, timer) => {
    try {
      const response = await fetch('/motor-api/motor/control', {
        method: 'POST',
        headers: {
          'Authorization': `TOKEN ${import.meta.env.VITE_Auth_Token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: "64ff0770-6549-4c50-b4ad-36bc8f922c90",
          status: status,
          timer: timer
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Motor control response:', data);

      if (status === 1) {
        setIsRunning(true);
        setRemainingTime(timer);
      } else {
        setIsRunning(false);
        setRemainingTime(0);
      }
    } catch (err) {
      console.error('Motor control error:', err);
      setError(err.message);
      // Reset state if there's an error
      setIsRunning(false);
      setRemainingTime(0);
    }
  };

  const handleStart = () => {
    if (hours === 0 && minutes === 0) {
      setError('Please set a valid time');
      return;
    }
    const totalSeconds = (hours * 3600) + (minutes * 60);
    controlMotor(1, totalSeconds);
  };

  const handleStop = () => {
    controlMotor(0, 0);
  };

  useEffect(() => {
    let timer;
    if (isRunning && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            handleStop();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, remainingTime]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8">
      <div className="text-4xl font-bold text-gray-800 mb-8">Motor</div>
      
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Hours</label>
            <input
              type="number"
              min="0"
              value={hours}
              onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
              className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Minutes</label>
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={handleStart}
          disabled={isRunning}
          className="px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start
        </button>
        <button
          onClick={handleStop}
          disabled={!isRunning}
          className="px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Stop
        </button>
      </div>

      {isRunning && (
        <div className="text-xl font-semibold text-gray-700">
          Time Remaining: {formatTime(remainingTime)}
        </div>
      )}
    </div>
  );
};

export default MotorControl;