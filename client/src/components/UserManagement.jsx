import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const initialFormState = {
    firstName: '',
    middleName: '',
    lastName: '',
    age: '',
    phoneNumber: '',
    gender: '',
    userId: '',
    password: '',
    type: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        const formattedUsers = response.data.map(user => ({
          name: `${user.firstName} ${user.middleName || ''} ${user.lastName}`.trim(),
          loginId: user.userId,
          clientMail: user.userId,
          mobile: user.phoneNumber,
          age: user.age,
          gender: user.gender,
          roleType: user.type === 'admin' ? 'System Admin' : 'Customer/User'
        }));
        setUsers(formattedUsers);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      const newUser = {
        name: `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim(),
        loginId: formData.userId,
        clientMail: formData.userId,
        mobile: formData.phoneNumber,
        age: formData.age,
        gender: formData.gender,
        roleType: formData.type === 'admin' ? 'System Admin' : 'Customer/User'
      };
      setUsers([...users, newUser]);
      setShowModal(false);
      setFormData(initialFormState);
    } catch (error) {
      console.error('Registration error:', error);
      alert('Error registering user');
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
  };

  const handleRemoveUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      setUsers(users.filter(user => user.loginId !== userId));
    } catch (error) {
      console.error('Error removing user:', error);
      alert('Error removing user');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm) ||
    user.loginId.toLowerCase().includes(searchTerm) ||
    user.clientMail.toLowerCase().includes(searchTerm) ||
    user.mobile.toString().includes(searchTerm) ||
    user.age.toString().includes(searchTerm) ||
    user.gender.toLowerCase().includes(searchTerm) ||
    user.roleType.toLowerCase().includes(searchTerm)
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl font-semibold">View User</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <input
            type="search"
            placeholder="Search..."
            className="px-4 py-2 border rounded-md w-full sm:w-64"
            onChange={handleSearch}
            value={searchTerm}
          />
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full sm:w-auto"
          >
            Add User
          </button>
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 sm:-mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Name</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Login Id</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Client Mail</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Mobile</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Age</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Gender</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Role Type</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user, index) => (
                <tr key={index}>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm whitespace-nowrap">{user.name}</td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm whitespace-nowrap">{user.loginId}</td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm whitespace-nowrap">{user.clientMail}</td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm whitespace-nowrap">{user.mobile}</td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm whitespace-nowrap">{user.age}</td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm whitespace-nowrap">{user.gender}</td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm whitespace-nowrap">{user.roleType}</td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm whitespace-nowrap">
                    <button 
                      className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-md hover:bg-red-600 text-xs sm:text-sm"
                      onClick={() => handleRemoveUser(user.loginId)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Add User</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                  <input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">User ID (Email)</label>
                  <input
                    type="email"
                    name="userId"
                    value={formData.userId}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 w-full sm:w-auto"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 w-full sm:w-auto"
                  onClick={handleReset}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-full sm:w-auto"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;