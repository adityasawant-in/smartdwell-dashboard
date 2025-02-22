import React, { useState, useEffect } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo3 from "../assets/logo3.png";
import UserManagement from "./UserManagement";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfileCards from "./ProfileCards";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const [selectedView, setSelectedView] = useState(() => {
        return localStorage.getItem("selectedView") || "userManagement";
    });

    useEffect(() => {
        localStorage.setItem("selectedView", selectedView);
    }, [selectedView]);

    const handleLogout = () => {
        toast.info("Logging out...", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
        });

        setTimeout(() => {
            localStorage.removeItem("authToken");
            sessionStorage.removeItem("authToken");
            localStorage.removeItem("userInfo");
            sessionStorage.removeItem("userInfo");
            localStorage.removeItem("selectedView");
            navigate("/login");
        }, 2500);
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden absolute top-0 left-0 right-0 bottom-0 bg-white">
            {/* Sidebar */}
            <aside
                className={`fixed lg:static w-45 h-full bg-orange-100 transition-transform duration-300 ease-in-out z-50
                    ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                {/* Logo section */}
                <div className="border-b border-gray-200 flex items-center justify-center">
                    <img
                        src={logo3}
                        alt="Gloria"
                        className="h-28 w-auto rounded-full drop-shadow-[0_0_20px_rgba(255,165,0,0.8)] transition duration-300"
                    />
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col">
                    <NavItem 
                        icon="👤" 
                        label="Create User" 
                        onClick={() => { setSelectedView("userManagement"); setIsOpen(false); }} 
                        active={selectedView === "userManagement"} 
                    />
                    <NavItem 
                        icon="🧑‍💻🔧" 
                        label="Profile Cards" 
                        onClick={() => { setSelectedView("Profile_Cards"); setIsOpen(false); }} 
                        active={selectedView === "Profile_Cards"} 
                    />
                    <NavItem 
                        icon="👥" 
                        label="Data" 
                        onClick={() => { setSelectedView("userManagement"); setIsOpen(false); }} 
                        active={selectedView === "userManagement"} 
                    />
                </nav>

                {/* Mobile close button */}
                <button
                    onClick={toggleMenu}
                    className="lg:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                >
                    <X size={24} />
                </button>
            </aside>

            {/* Main content wrapper */}
            <div className="flex-1 flex flex-col w-full overflow-hidden">
                {/* Top header bar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-40">
                    <button
                        className="lg:hidden text-gray-600 hover:text-gray-800"
                        onClick={toggleMenu}
                    >
                        <Menu size={24} />
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-orange-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors ml-auto"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </header>

                {/* Main scrollable content area */}
                <main className="flex-1 overflow-auto bg-gray-50 relative z-0">
                    {selectedView === "Profile_Cards" ? <ProfileCards/> : <UserManagement />}
                </main>
            </div>

            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleMenu}
                />
            )}

            {/* Toast Container */}
            <ToastContainer />
        </div>
    );
};

// Helper component for navigation items
const NavItem = ({ icon, label, onClick, active }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 border-b border-gray-200 w-full text-left
        ${active ? "bg-purple-100 text-purple-800" : "hover:bg-purple-50 text-gray-700 hover:text-purple-800"}`}
    >
        <span>{icon}</span>
        <span>{label}</span>
    </button>
);

export default Navbar;
