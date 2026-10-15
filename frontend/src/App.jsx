import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StartupDashboard from "./pages/StartupDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import StartupMentors from "./pages/StartupMentors";
import StartupMentorProfile from "./pages/StartupMentorProfile";
import StartupJobs from "./pages/StartupJobs";
import MentorStats from "./pages/MentorStats";
import MentorJobFeed from "./pages/MentorJobFeed";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/:accountType/login" element={<Login />} />
      <Route path="/:accountType/register" element={<Register />} />
      <Route
        path="/startup/dashboard"
        element={
          <ProtectedRoute accountType="startup">
            <StartupDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/dashboard"
        element={
          <ProtectedRoute accountType="mentor">
            <MentorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/startup/mentors"
        element={
          <ProtectedRoute accountType="startup">
            <StartupMentors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/startup/jobs"
        element={
          <ProtectedRoute accountType="startup">
            <StartupJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/startup/mentors/:mentorId"
        element={
          <ProtectedRoute accountType="startup">
            <StartupMentorProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/stats"
        element={
          <ProtectedRoute accountType="mentor">
            <MentorStats />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/jobs"
        element={
          <ProtectedRoute accountType="mentor">
            <MentorJobFeed />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
export default App;
