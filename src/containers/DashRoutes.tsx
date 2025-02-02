/* eslint-disable */
/* istanbul ignore file */

import React, { Suspense, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashHeader from '../components/DashHeader';
import Sidebar from '../components/Sidebar';

const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Settings = React.lazy(() => import('../pages/Settings'));
const PerformanceDetails = React.lazy(
  () => import('../containers/Trainee/PerformanceDetails'),
);

const TraineePerfomance = React.lazy(
  () => import('../components/TraineePerformance'),
);
const TraineeAttendance = React.lazy(
  () => import('../components/TraineeAttendance'),
);
const AttendanceDetails = React.lazy(
  () => import('../containers/Trainee/AttendanceDetails'),
);
const AdminTeams = React.lazy(() => import('./admin-dashBoard/Teams'));
const AdminCohorts = React.lazy(() => import('./admin-dashBoard/Cohorts'));
const AdminPrograms = React.lazy(() => import('./admin-dashBoard/Programs'));
const AdminSession = React.lazy(() => import('./admin-dashBoard/Sessions'));
const AdminPhases = React.lazy(() => import('./admin-dashBoard/Phases'));
const AdminManageRoles = React.lazy(
  () => import('./admin-dashBoard/ManagerRoles'),
);
import Error from '../pages/Error';
import PrivateRoute from '../utils/PrivateRoute';

const AdminTraineeDashboard = React.lazy(
  () => import('../pages/AdminTraineeDashboard'),
);
const TraineeRatingDashboard = React.lazy(
  () => import('../pages/TraineeRatingDashboard'),
);

const AdminRatings = React.lazy(() => import('../pages/AdminRatings'));

const UpdatedRatingDashboard = React.lazy(
  () => import('../pages/UpdatedRatingDashboard'),
);
const SupAdDashboard = React.lazy(() => import('../pages/SupAdDashboard'));
const Calendar = React.lazy(() => import('../components/Calendar'));

const GradingSystem = React.lazy(() => import('../pages/GradingSystem'));
const Profile = React.lazy(() => import('../pages/Profile'));
const EditProfile = React.lazy(() => import('../pages/ProfileEdit'));
const Organizations = React.lazy(() => import('../components/Organizations'));
import Skeleton from '../components/Skeleton';
import Square from '../Skeletons/Square';

function DashRoutes() {
  const [nav, setNav] = useState(false);
  const handleClick = () => setNav(!nav);
  return (
    <PrivateRoute>
      <div data-testid="cohorts-route" className="flex flex-col  min-h-screen">
        <DashHeader />
        <Sidebar toggle={handleClick} style="hidden lg:flex" />
        <Suspense fallback={<Square />}>
          <Routes>
            <Route path="" element={<Dashboard />} />
            <Route path="/trainees" element={<AdminTraineeDashboard />} />
            <Route path="/ratings" element={<TraineeRatingDashboard />} />
            <Route path="/admin/ratings" element={<AdminRatings />} />
            <Route
              path="/updated-ratings"
              element={<UpdatedRatingDashboard />}
            />
            <Route path="/settings" element={<Settings />} />
            <Route path="/performance" element={<TraineePerfomance />} />
            <Route path="/attendance" element={<TraineeAttendance />} />
            <Route path="/attendance-details" element={<AttendanceDetails />} />
            <Route path="/teams"   element={<AdminTeams />} />
            <Route path="/cohorts"   element={<AdminCohorts />} />
            <Route path="/phases" element={<AdminPhases />} />
            <Route path="/programs" element={<AdminPrograms />} />
            <Route path="/sessions" element={<AdminSession />} />
            <Route path="/manage" element={<AdminManageRoles />} />
            <Route path="/grading" element={<GradingSystem />} />
            <Route
              path="/performance-details"
              element={<PerformanceDetails />}
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="*" element={<Error />} />
            <Route path="/super-admin" element={<SupAdDashboard />} />
            <Route path="/settings"  element={<Settings />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/organizations" element={<Organizations />} />
          </Routes>
        </Suspense>
      </div>
    </PrivateRoute>
  );
}

export default DashRoutes;
