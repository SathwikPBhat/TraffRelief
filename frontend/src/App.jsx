import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./components/PrivateRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProfile from "./pages/AdminProfile";
import AudioInterviewPage from "./pages/AudioInterviewPage";
import Audit from "./pages/Audit";
import AuditList from "./pages/AuditList";
import AuditSummary from "./pages/AuditSummary";
import InterviewResultsPage from "./pages/InterviewResultsPage";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import PendingAuditsPage from "./pages/PendingAuditsPage";
import ReleasedVictimsPage from "./pages/ReleasedVictimsPage";
import StaffDashboard from "./pages/StaffDashboard";
import StaffManagement from "./pages/StaffManagement";
import StaffProfile from "./pages/StaffProfile";
import VictimManagementForAdmin from "./pages/VictimManagementForAdmin";
import VictimManagementForStaff from "./pages/VictimManagementForStaff";
import VictimProfile from "./pages/VictimProfile";
import ViewReleasesByVictim from "./pages/ViewReleasesByVictim";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
    

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
        <Route
          path="/audit/:victimId"
          element={
            <PrivateRoute>
              <Audit />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/audit-list"
          element={
            <PrivateRoute>
              <AuditList/>
            </PrivateRoute>
          }
        />
        <Route
          path="/staff/audit-list"
          element={
            <PrivateRoute>
              <AuditList/>
            </PrivateRoute>
          }
        />
        <Route
          path="/audit-summary/:auditId"
          element={
            <PrivateRoute>
              <AuditSummary/>
            </PrivateRoute>
          }
        />

        <Route
          path="/victim/:hashId"
          element={
            
              <AudioInterviewPage />
            
          }
        />
        <Route
          path="/staff/:staffId/pending-audits"
          element={
            <PrivateRoute>
              <PendingAuditsPage />
            </PrivateRoute>
          }
        />

       <Route
          path="/staff/:staffId/released-victims"
          element={
            <PrivateRoute>
              <ReleasedVictimsPage />
            </PrivateRoute>
          }
        />

        <Route path="/view-releases/:staffId/:victimId" element={
          <PrivateRoute>
          <ViewReleasesByVictim />
          </PrivateRoute>}
          />
   <Route path="/interview-results/:hashId" element={<InterviewResultsPage />} />
        <Route path="*" element={<PageNotFound />
      } />
      </Routes>
    </>
  );
}

export default App;
