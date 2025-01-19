import React, { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// Import the logo
import logo3 from '../assets/logo3.png'; // Adjust the path if `assets` is in a different folder

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        sessionStorage.removeItem('userInfo');
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="fixed inset-0 flex m-0 p-0">
            {/* Sidebar for both desktop and mobile */}
            <aside
                className={`
          fixed lg:relative
          lg:flex flex-col
          w-64 h-full
          bg-purple-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          z-20
          border-r border-gray-200
          m-0
        `}
            >
                {/* Logo section */}
                <div className="p-4 border-b border-gray-200 flex items-center">
                    <img src={logo3} alt="SmartDwell.Technologies" className="h-20 w-auto mr-2" />
                    <h1 className="text-4xl font-bold text-gray-800">Gloria</h1>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col">
                    <NavItem icon="👤" label="User" link="/user" active />
                    <NavItem icon="📊" label="Meter" link="/meter" />
                    <NavItem icon="👥" label="Client View" link="/client-view" />
                </nav>

                {/* Mobile close button */}
                <button
                    onClick={toggleMenu}
                    className="lg:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                >
                    <X size={24} />
                </button>
            </aside>

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top header bar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
                    <button
                        className="lg:hidden text-gray-600 hover:text-gray-800"
                        onClick={toggleMenu}
                    >
                        <Menu size={24} />
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors ml-auto"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </header>

                {/* Main content */}
                <main className="flex-1 bg-gray-50">
                    {/* Your page content goes here */}
                </main>
            </div>

            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
                    onClick={toggleMenu}
                />
            )}
        </div>
    );
};

// Helper component for navigation items
const NavItem = ({ icon, label, link, active }) => (
    <a
        href={link}
        className={`flex items-center gap-3 px-4 py-3 border-b border-gray-200 ${active
            ? 'bg-purple-100 text-purple-800'
            : 'hover:bg-purple-50 text-gray-700 hover:text-purple-800'
            }`}
    >
        <span>{icon}</span>
        <span>{label}</span>
    </a>
);

export default Navbar;
