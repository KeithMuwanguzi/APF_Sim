import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { isAuthenticated, getUser, migrateFromLocalStorage } from "./utils/authStorage";
// ... other imports ...

/* Public pages */
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import MembershipPage from "./pages/MembershipPage";
import EventsPage from "./pages/EventsPage";
import EventRegistrationPage from "./pages/EventRegistrationPage";
import NewsPage from "./pages/NewsPage";
import ContactPage from "./pages/ContactPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import OtpPage from "./pages/otpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import TestCMS from "./pages/TestCMS";

/* Member dashboard */
import MemberDashboard from "./pages/member/memberDashboard";
import DocumentsPage from "./pages/member/DocumentsPage";
import PaymentsPage from "./pages/member/PaymentsPage";
import ForumPage from "./pages/member/ForumPage";
import CreatePostPage from "./pages/member/CreatePostPage";
import MyPostsPage from "./pages/member/MyPostsPage";
import PostDetailPage from "./pages/member/PostDetailPage";
import NotificationsPage from "./pages/member/NotificationsPage";
import SettingsPage from "./pages/member/SettingsPage";

import PaymentHistoryPage from "./pages/member/PaymentHistoryPage";
import ProfilePage from "./pages/member/ProfilePage";

/* Admin pages */
import AdminDashboard from "./pages/admin/adminDashboard";
import AdminApproval from "./pages/admin/adminApproval";
import AdminProfilePage from "./pages/admin/profilePage";
import ReportsPage from "./pages/admin/reportsAnalytics";
import CmsContentPage from "./pages/admin/cmsPage";
import CommunityForum from "./pages/admin/communityForum";
import CreatePost from "./pages/admin/createPost";
import CommunicationsDashboard from "./pages/admin/announcements";
import CreateAnnouncement from "./pages/admin/createAnnouncement";
import SearchResults from "./pages/admin/SearchResults";
import NewsManagement from "./pages/admin/newsMgt";
import ManageUsers from "./pages/admin/manageusers";
import EventCreatePage from "./pages/admin/eventMgt";
import ManagePayments from "./pages/admin/payments";
import MembershipEditor from './components/admincms/editMembership';
import AboutPageEditor from './components/admincms/editAbout';
import HomePageEditor from './components/admincms/editLandingpage';

/* Auth guard with session validation */
const ProtectedRoute: React.FC<{
  children: JSX.Element;
  role?: "admin" | "member";
}> = ({ children, role }) => {
  // Check if authenticated and session is valid
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Check role if specified
  if (role) {
    const user = getUser();
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    const userRole = user.role === "1" || user.role === 1 ? "admin" : "member";
    if (userRole !== role) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

const App: React.FC = () => {
  // Migrate from localStorage to sessionStorage on app load
  useEffect(() => {
    migrateFromLocalStorage();
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route
            path="/event-registration"
            element={<EventRegistrationPage />}
          />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/test-cms" element={<TestCMS />} />
          <Route path="/cmspage" element={<CmsContentPage />} />
          <Route path="/communityforum" element={<CommunityForum />} />
          <Route path="/announcements" element={<CommunicationsDashboard />} />
          <Route path="/newsMgt" element={<NewsManagement />} />
          <Route path="/manageUsers" element={<ManageUsers />} />
          <Route path="/eventMgt" element={<EventCreatePage />} />
            <Route path="/editMembership" element={<MembershipEditor />} />
            <Route path="/editAbout" element={<AboutPageEditor />} />
            <Route path="/editLandingpage" element={<HomePageEditor />} />

          {/* Auth routes */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Member routes (protected) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="member">
                <MemberDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/documents"
            element={
              <ProtectedRoute role="member">
                <DocumentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute role="member">
                <PaymentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-history"
            element={
              <ProtectedRoute role="member">
                <PaymentHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forum"
            element={
              <ProtectedRoute role="member">
                <ForumPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forum/create-post"
            element={
              <ProtectedRoute role="member">
                <CreatePostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forum/post/:id/edit"
            element={
              <ProtectedRoute role="member">
                <CreatePostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forum/my-posts"
            element={
              <ProtectedRoute role="member">
                <MyPostsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forum/post/:id"
            element={
              <ProtectedRoute role="member">
                <PostDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute role="member">
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute role="member">
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/settings"
            element={
              <ProtectedRoute role="member">
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin routes (protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/eventMgt"
            element={
              <ProtectedRoute role="admin">
                <EventCreatePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/approval"
            element={
              <ProtectedRoute role="admin">
                <AdminApproval />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/cmsPage"
            element={
              <ProtectedRoute role="admin">
                <CmsContentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/newsMgt"
            element={
              <ProtectedRoute role="admin">
                <NewsManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/manageusers"
            element={
              <ProtectedRoute role="admin">
                <ManageUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute role="admin">
                <ManagePayments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/communityForum"
            element={
              <ProtectedRoute role="admin">
                <CommunityForum />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/communityForum/create-post"
            element={
              <ProtectedRoute role="admin">
                <CreatePost />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute role="admin">
                <ReportsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute role="admin">
                <AdminProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/announcements"
            element={
              <ProtectedRoute role="admin">
                <CommunicationsDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/create-announcement"
            element={
              <ProtectedRoute role="admin">
                <CreateAnnouncement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/search"
            element={
              <ProtectedRoute role="admin">
                <SearchResults />
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
};

export default App;
