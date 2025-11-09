import { useState } from "react";
import Login from "./pages/Login";
import StaffManagement from "./pages/StaffManagement";
import StaffDashboard from "./pages/StaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./components/PrivateRoute";
import { Routes, Route, Navigate } from "react-router-dom";
import VictimManagementForAdmin from "./pages/VictimManagementForAdmin";
import VictimManagementForStaff from "./pages/VictimManagementForStaff";
import AdminProfile from "./pages/AdminProfile";
import PageNotFound from "./pages/PageNotFound";
import VictimProfile from "./pages/VictimProfile";
import Audit from "./pages/Audit";
import StaffProfile from "./pages/StaffProfile";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/audit" element={<Audit />} />

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin/victims"
          element={
            <PrivateRoute>
              <VictimManagementForAdmin />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/staff-details"
          element={
            <PrivateRoute>
              <StaffManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <PrivateRoute>
              <AdminProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/staff/victim-details"
          element={
            <PrivateRoute>
              <VictimManagementForStaff />
            </PrivateRoute>
          }
        />
        <Route
          path="/staff/dashboard"
          element={
            <PrivateRoute>
              <StaffDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/victim-profile/:victimId"
          element={
            <PrivateRoute>
              <VictimProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/staff-profile/:staffId"
          element={
            <PrivateRoute>
              <StaffProfile />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
