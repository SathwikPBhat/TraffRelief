import { useState } from 'react';
import logo from './assets/logo.png';
import Login from './pages/Login';
import StaffManagement from './pages/StaffManagement';
import Table from './components/Table';
import StaffDashboard from './pages/StaffDashboard';

function App() {
  
  

  const StaffData = [
    { name: "Alice", id: "C-101",status: "Active" },
    { name: "Bob", id: "C-102", status: "Inactive" },
    { name: "Charlie", id: "C-103",status: "Active" },
    { name: "David", id: "C-104", status: "Active" },
   
  ];

  const handleSubmit = () => {}
  return (
    <>
    <StaffDashboard/>
    </>
  )
}

export default App
