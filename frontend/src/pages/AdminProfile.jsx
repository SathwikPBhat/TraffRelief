import React, { useEffect, useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { HiOutlineLogout } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function AdminProfile() {
  const token = localStorage.getItem("token");
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogout = () =>{
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Logged  out successfully");
  }
  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/admin/profile`,{
          headers:{
            "Authorization" : `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch admin details');
        setAdmin(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDetails();
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AdminNavbar />
      <div className="flex-grow p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className='flex justify-between items-center gap-6 p-4'>
            <h1 className="text-4xl font-bold text-teal-600 mb-6">Admin Profile</h1>
            <HiOutlineLogout className=' text-3xl text-red-800 hover:cursor-pointer' onClick = {handleLogout}/>
          </div>

          <div className="border-b border-gray-300 pb-4 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">{admin.fullName}</h2>
            <p className="text-gray-600">{admin.role || 'Administrator'}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h3 className="font-semibold text-teal-600 text-lg">Email</h3>
              <p className="text-gray-700">{admin.email}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h3 className="font-semibold text-teal-600 text-lg">Mobile No</h3>
              <p className="text-gray-700">{admin.mobileNo}</p>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-semibold text-teal-600 text-lg">Admin ID</h3>
            <p className="bg-gray-50 p-4 rounded-lg shadow text-gray-700">{admin.adminId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;