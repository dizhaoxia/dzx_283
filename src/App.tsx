import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import EmotionCards from "@/pages/EmotionCards";
import Situations from "@/pages/Situations";
import EmotionWheel from "@/pages/EmotionWheel";
import BreathingExercise from "@/pages/BreathingExercise";
import MoodDiary from "@/pages/MoodDiary";
import ParentDashboard from "@/pages/ParentDashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/emotion-cards" element={<EmotionCards />} />
        <Route path="/situations" element={<Situations />} />
        <Route path="/emotion-wheel" element={<EmotionWheel />} />
        <Route path="/breathing" element={<BreathingExercise />} />
        <Route path="/diary" element={<MoodDiary />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
      </Routes>
    </Router>
  );
}
