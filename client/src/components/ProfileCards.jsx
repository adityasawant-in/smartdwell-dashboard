import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-black bg-opacity-0 flex justify-center items-center z-50">
    <div className="w-16 h-16 border-8 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ProfileCards = () => {
  const navigate = useNavigate();
  const { userType } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleCardClick = async (route) => {
    // Only allow direct navigation if user is admin
    if (userType === 'admin') {
      setIsLoading(true);

      // Simulate loading for 2 seconds
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsLoading(false);
      navigate(route, {
        state: { fromDashboard: true }
      });
    } else {
      navigate('/login');
    }
  };

  const cards = [
    {
      title: "Water level",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="80"
          height="80"
        >
          <defs>
            <radialGradient id="dropletGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#a0d8ff" />
              <stop offset="100%" stop-color="#0077be" />
            </radialGradient>
          </defs>
          <path
            d="M12 2C12 2 5 10 5 15a7 7 0 1 0 14 0c0-5-7-13-7-13z"
            fill="url(#dropletGradient)"
            stroke="#005a9c"
            stroke-width="1"
          />
          <circle cx="10" cy="8" r="2" fill="white" opacity="0.5" />
        </svg>
      ),
      onClick: () => handleCardClick('/Readwater'),
      bgColor: "bg-blue-300"
    },
    {
      title: "Complaints",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="80"
          height="80"
          fill="#ff9800"
        >
          <path
            d="M4 24C4 12.95 13.95 4 24 4s20 8.95 20 20-8.95 20-20 20c-3 0-5.85-.55-8.5-1.6L8 44l2.4-7.5C6.55 32.85 4 28.7 4 24z"
            stroke="#e65100"
            stroke-width="2"
          />
          <circle cx="24" cy="18" r="3" fill="#fff" />
          <rect x="22" y="23" width="4" height="10" fill="#fff" />
        </svg>
      ),
      onClick: () => handleCardClick('/Complaints'),
      bgColor: "bg-orange-300"
    },
    {
      title: "Patrolling",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          width="100"
          height="100"
          fill="none"
          stroke="blue"
          stroke-width="3"
        >
          <path
            d="M32 4L12 14v18c0 12 8 22 20 26 12-4 20-14 20-26V14L32 4z"
            fill="red"
            stroke="blue"
          />
          <path
            d="M22 32l6 6 14-14"
            fill="none"
            stroke="white"
            stroke-width="4"
          />
        </svg>

      ),
      onClick: () => handleCardClick('/Patrolling'),
      bgColor: "bg-red-300"
    }
  ];

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={card.onClick}
              className={`
                ${card.bgColor}
                rounded-lg p-6
                transform transition-all duration-300
                hover:scale-105 hover:shadow-xl
                cursor-pointer
                flex flex-col items-center justify-center
                space-y-4
                min-h-[200px]
                border-2 border-transparent
                hover:border-gray-300
              `}
            >
              <div className="text-gray-800">
                {card.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                {card.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProfileCards;