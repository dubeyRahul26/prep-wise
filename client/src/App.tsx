// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/HomePage";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { useAuthStore } from "./store/useAuthStore";
import Quiz from "./pages/Quiz";
import QuizHistory from "./pages/QuizHistory";
import Layout from "./components/Layout";
import StartMockTest from "./pages/StartMockTest";
import ResumeUpload from "./pages/ResumeUpload";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  return user ? <Navigate to="/" replace /> : <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public without layout */}
        <Route
          path="/login"
          element={
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRedirect>
              <SignUp />
            </AuthRedirect>
          }
        />

        {/* Pages with Navbar Layout */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route path="/mock-test" element={<StartMockTest />} />

        <Route
          path="/quiz/:subject"
          element={
            <ProtectedRoute>
              <Layout>
                <Quiz />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizHistory"
          element={
            <ProtectedRoute>
              <Layout>
                <QuizHistory />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/resumeUpload"
          element={
            <ProtectedRoute>
              <Layout>
                <ResumeUpload />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
