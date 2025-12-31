import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Ticket from "./pages/Ticket"
// Import your pages
import PageOne from './pages/Page_one';
import Gift from './pages/Gift';
import Music from "./pages/Music";
import VideoPage from "./pages/Video"
import Playlist from './pages/Playlist';
import LetterPage from './pages/Letter';
// A simple placeholder for the final page
const FinalPage = () => {
  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center text-white text-center p-4">
      <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 mb-4">
        Happy New Year 2026!
      </h1>
      <p className="text-gray-400">Your journey begins now.</p>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <div className="w-full min-h-screen bg-black">
        <Routes>
          {/* Route 1: Hold Button Page */}
          <Route path="/" element={<PageOne />} />
          
          {/* Route 2: Draggable Cards Page */}
          <Route path="/gift" element={<Gift />} />
          <Route path="/ticket" element={<Ticket/>}/>
            <Route path="/music" element={<Music/>}/>
            <Route path="/video" element={<VideoPage/>}/>
            <Route path="/playlist" element={<Playlist/>}/>
            <Route path="/letter" element={<LetterPage/>}/>
          {/* Route 3: Final Surprise Page */}
          <Route path="/birthday" element={<FinalPage />} />
        </Routes>
      </div>
    </Router>
  );
}