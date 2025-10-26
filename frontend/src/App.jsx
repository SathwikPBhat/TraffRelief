import { useState } from 'react';
import Login from './pages/Login';
import StaffManagement from './pages/StaffManagement';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { ToastContainer } from 'react-toastify';
import PrivateRoute from './components/PrivateRoute';
import { Routes, Route, Navigate } from 'react-router-dom';
import VictimManagementForAdmin from './pages/VictimManagementForAdmin';
import VictimManagementForStaff from './pages/VictimManagementForStaff';
import AdminProfile from './pages/AdminProfile';

function App() {

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
      <Route path = '/admin/profile' element = {
        <PrivateRoute>
          <AdminProfile/>
        </PrivateRoute>
      }/>
      <Route path ='/staff/victim-details' element = {
        <PrivateRoute>
          <VictimManagementForStaff/>
        </PrivateRoute>
      }/>

    </Routes>
    </>
  )
}

export default App
