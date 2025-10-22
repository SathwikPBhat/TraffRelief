import { useState } from 'react';
import logo from './assets/logo.png';
import Login from './pages/Login';
import StaffManagement from './pages/StaffManagement';
import Table from './components/Table';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AddStaffModal from './components/AddStaffModal';
import { ToastContainer } from 'react-toastify';
import AddVictimModalForAdmin from './components/AddVictimModalForAdmin';
import PrivateRoute from './components/PrivateRoute';
import { Routes, Route, Navigate } from 'react-router-dom';
import VictimManagementForAdmin from './pages/VictimManagementForAdmin';

function App() {
  

  const StaffData = [
    { name: "Alice", id: "C-101",status: "Active" },
    { name: "Bob", id: "C-102", status: "Inactive" },
    { name: "Charlie", id: "C-103",status: "Active" },
    { name: "David", id: "C-104", status: "Active" },
   
  ];

  return (
    <>
    <ToastContainer/>
    <Routes>
      <Route path = '/' element = {<Navigate to="/login"/>}/>
      <Route path ='/login' element = {<Login/>}/>
      <Route path = '/admin/victims' element = {
        <PrivateRoute>
          <VictimManagementForAdmin/>
          </PrivateRoute>
      }/>
      <Route path ='/admin/dashboard' element = {
        <PrivateRoute>
          <AdminDashboard/>
        </PrivateRoute>
      }/>
      <Route path ='/staff/dashboard' element = {
        <PrivateRoute>
          <StaffDashboard/>
        </PrivateRoute>
      }/>
      <Route path ='/admin/staff-details' element = {
        <PrivateRoute>
          <StaffManagement/>
        </PrivateRoute>
      }/>
    </Routes>
    </>
  )
}

export default App
