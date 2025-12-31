import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Music, 
  ArrowRight,
  MailOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// MAKE SURE THIS PATH IS CORRECT IN YOUR FOLDER STRUCTURE
import Meow from "../assets/meow.mpeg"; 
import Food from "../assets/food.mpeg"; 
import Care from "../assets/care.mpeg"; 
import Day_went from "../assets/Day_went.mpeg"; 
import Day_Night from "../assets/Day_Night.mpeg"; 

/**
 * ============================================================================
 * 1. CONFIGURATION & DATA
 * ============================================================================
 */

const SONGS = [
  {
    id: 1,
    title: "First Meow",
    artist: "Good Vibes Only",
    duration: "0:02",
    color: "bg-red-600", // Cassette Color
    labelColor: "bg-white",
    type: "19 Aug at 1:14 PM",
    url: Meow // <--- This now gets used correctly
  },
  {
    id: 2,
    title: "Every Morning, Every Night",
    artist: "The words that start and end my days",
    duration: "4:20",
    color: "bg-blue-900",
    labelColor: "bg-blue-100",
    type: "19 Aug at 2:01 PM",
    url: Day_Night// Placeholder: using same file for demo
  },
  {
    id: 3,
    title: "That Sad Little Voice",
    artist: "I wish I could’ve fed you myself",
    duration: "3:12",
    color: "bg-amber-500",
    labelColor: "bg-yellow-50",
    type: "24 Aug at 10:05 AM",
    url: Food
  },
  {
    id: 4,
    title: "Tell Me Everything",
    artist: "I love listening to you",
    duration: "4:05",
    color: "bg-emerald-700",
    labelColor: "bg-emerald-50",
    type: "17 Aug at 7:32 PM",
    url: Day_went
  },
  {
    id: 5,
    title: "Little Questions",
    artist: "They mean more than you know",
    duration: "4:40",
    color: "bg-pink-600",
    labelColor: "bg-pink-50",
    type: "3rd Sept at 8:19 PM",
    url: Care
  }
];

const THEME = {
  colors: {
    bg: '#f2e8cf', // Vintage Paper
    text: '#38302e', // Ink Black
    accent: '#bc4749', // Retro Red
  },
  fonts: {
    script: "'Dancing Script', cursive",
    sans: "'Inter', sans-serif",
    mono: "'Courier New', monospace" // For cassette text
  }
};

/**
 * ============================================================================
 * 2. COMPONENT: BACKGROUND TEXTURE
 * ============================================================================
 */
const VintageBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black">
    {/* Vignette */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.1)_100%)]" />
    
    {/* Floating Notes */}
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute text-white opacity-5"
        initial={{
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          rotate: Math.random() * 360,
          scale: 0.5
        }}
        animate={{
          y: [null, Math.random() * -200],
          rotate: [null, Math.random() * 360],
          opacity: [0.05, 0.1, 0]
        }}
        transition={{
          duration: Math.random() * 20 + 10,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <Music size={Math.random() * 40 + 20} />
      </motion.div>
    ))}
  </div>
);

/**
 * ============================================================================
 * 3. COMPONENT: CASSETTE REEL (ANIMATED)
 * ============================================================================
 */
const TapeReel = ({ isPlaying, speed = 2 }) => {
  return (
    <div className="relative w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-gray-700 bg-white flex items-center justify-center overflow-hidden">
      {/* The Spindle */}
      <motion.div
        className="w-full h-full relative"
        animate={{ rotate: isPlaying ? 360 : 0 }}
        transition={{ 
          duration: isPlaying ? speed : 0, 
          ease: "linear", 
          repeat: Infinity 
        }}
      >
        {/* Teeth */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <div
            key={deg}
            className="absolute top-1/2 left-1/2 w-1.5 h-3 bg-white -translate-x-1/2 -translate-y-1/2 origin-center"
            style={{ transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-8px)` }}
          />
        ))}
        {/* Center Hole */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gray-200 rounded-full -translate-x-1/2 -translate-y-1/2 border border-gray-400" />
      </motion.div>
    </div>
  );
};

/**
 * ============================================================================
 * 4. COMPONENT: CASSETTE TAPE (THE HERO)
 * ============================================================================
 */
const CassetteTape = ({ song, isPlaying, onClick }) => {
  return (
    <motion.div
      layout
      onClick={onClick}
      whileHover={{ scale: 1.02, rotate: 1 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`
        relative w-full max-w-md mx-auto
        aspect-[1.6/1] 
        ${song.color} 
        rounded-xl sm:rounded-2xl 
        shadow-xl shadow-black/20 
        overflow-hidden 
        cursor-pointer
        border-t-2 border-white/20 border-b-4 border-black/30
        group
      `}
    >
      {/* Screw Holes */}
      <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-white shadow-inner" />
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white shadow-inner" />
      <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-white shadow-inner" />
      <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-white shadow-inner" />

      {/* --- LABEL AREA --- */}
      <div className={`
        absolute top-4 left-4 right-4 bottom-8 
        ${song.labelColor} 
        rounded-lg 
        shadow-md 
        flex flex-col
        p-3 sm:p-4
      `}>
        
        {/* Top Text */}
        <div className="flex justify-between items-start mb-2 border-b-2 border-gray-200 pb-1">
          <div className="flex flex-col">
            <span className="text-[8px] sm:text-[10px] font-bold text-gray-400 font-mono tracking-widest">
              {song.type}
            </span>
            <h3 className="font-handwriting text-lg sm:text-xl text-gray-800 leading-none" style={{ fontFamily: "'Patrick Hand', cursive" }}>
              {song.title}
            </h3>
          </div>
          <span className="text-[10px] font-bold text-gray-400 font-mono">SIDE A</span>
        </div>

        {/* Artist / Subtitle */}
        <p className="text-xs sm:text-sm text-gray-500 font-medium mb-3 truncate">
          {song.artist}
        </p>

        {/* --- TAPE WINDOW (The clear plastic part) --- */}
        <div className="relative flex-1 bg-gray-800 rounded-md shadow-inner flex items-center justify-between px-3 sm:px-6 py-2 overflow-hidden border-2 border-gray-600">
          
          {/* Tape Texture Behind */}
          <div className="absolute inset-0 bg-gray-900 opacity-80" />
          
          {/* Left Reel */}
          <div className="relative z-10">
             <TapeReel isPlaying={isPlaying} />
             {/* Tape Roll Left (Shrinks as played) */}
             <motion.div 
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-900/50 border border-amber-800"
               animate={{ width: isPlaying ? [30, 20] : 30, height: isPlaying ? [30, 20] : 30 }}
               transition={{ duration: 100, ease: "linear" }} 
             />
          </div>

          {/* Center Window */}
          <div className="relative z-10 w-16 h-8 sm:w-24 sm:h-10 bg-transparent flex items-center justify-center">
             {/* The Tape Bridge */}
             <div className="w-full h-4 bg-black/60 backdrop-blur-sm border-t border-b border-gray-700/50" />
             {isPlaying && (
               <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-50">
                 <div className="w-1 h-1 bg-white rounded-full animate-ping" />
                 <div className="w-1 h-1 bg-white rounded-full animate-ping delay-100" />
               </div>
             )}
          </div>

          {/* Right Reel */}
          <div className="relative z-10">
             <TapeReel isPlaying={isPlaying} />
             {/* Tape Roll Right (Grows as played) */}
             <motion.div 
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-900/50 border border-amber-800"
               animate={{ width: isPlaying ? [20, 30] : 20, height: isPlaying ? [20, 30] : 20 }}
               transition={{ duration: 100, ease: "linear" }}
             />
          </div>

        </div>

      </div>

      {/* --- BOTTOM EDGE --- */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-black/20 flex items-center justify-center gap-8">
         <div className="w-12 h-1 bg-black/30 rounded-full" />
      </div>

      {/* Play Overlay (Visible when playing) */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-2 right-4 bg-green-500/90 text-white text-[10px] px-2 py-0.5 rounded shadow-lg animate-pulse font-mono tracking-widest z-20"
          >
            PLAYING
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

/**
 * ============================================================================
 * 5. COMPONENT: LETTER MODAL
 * ============================================================================
 */
const LetterModal = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
    >
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <motion.div
        initial={{ scale: 0.9, y: 50, rotate: -2 }}
        animate={{ scale: 1, y: 0, rotate: 0 }}
        exit={{ scale: 0.9, y: 50, rotate: 2 }}
        className="
          relative w-full max-w-sm 
          bg-[#fffbf0] 
          p-8 rounded-sm shadow-2xl 
          border border-[#e6dcc0]
          text-center
        "
        style={{
          backgroundImage: "radial-gradient(#dbcbbd 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      >
        {/* Envelope Seal Icon */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-red-800 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20">
          <Heart className="text-white w-6 h-6 fill-current" />
        </div>

        <div className="mt-4 space-y-6">
          <h2 
            className="text-3xl text-red-900 font-bold"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            From my heart to yours
          </h2>

          <div className="w-16 h-0.5 bg-red-900/20 mx-auto rounded-full" />

          <p className="text-[#5c504d] text-lg font-medium leading-relaxed font-sans">
            I saved my words for this moment.
          </p>

          <motion.button
            onClick={() => navigate('/letter')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="
              w-full py-3 mt-4
              bg-red-800 text-[#fffbf0]
              font-bold text-lg tracking-wide
              rounded shadow-lg 
              flex items-center justify-center gap-2
              hover:bg-red-900 transition-colors
            "
            style={{ fontFamily: "'Patrick Hand', cursive" }}
          >
            <span>Read It</span>
            <MailOpen size={20} />
          </motion.button>
        </div>

        {/* Paper Fold Effect */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-black/5 -z-10 transform rotate-45 translate-x-4 -translate-y-4" />
      </motion.div>
    </motion.div>
  );
};

/**
 * ============================================================================
 * 6. MAIN PAGE: PLAYLIST
 * ============================================================================
 */
export default function Playlist() {
  const [activeSongId, setActiveSongId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFooter, setShowFooter] = useState(false); 

  // --- AUDIO LOGIC ---
  const audioRef = useRef(null);

  const handlePlaySong = (song) => {
    // If playing same song, toggle
    if (activeSongId === song.id) {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setActiveSongId(null); 
      } else if (audioRef.current) {
        audioRef.current.play();
        setActiveSongId(song.id); 
      }
      return;
    }

    // New song selected
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    // --- FIX IS HERE ---
    // Use 'song.url' (the imported file) instead of the hardcoded "/song.mp3" string
    audioRef.current = new Audio(song.url); 
    
    audioRef.current.volume = 0.5;
    
    audioRef.current.play()
      .then(() => {
        // Success
        setActiveSongId(song.id);
        setShowFooter(true);
      })
      .catch(e => {
        console.error("Audio playback error:", e);
        // Fallback or error handling can go here
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full font-sans text-white overflow-x-hidden">
      
      <VintageBackground />

      {/* --- HEADER --- */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 pt-12 pb-8 px-6 text-center"
      >
        <p className="text-blue-300 font-bold tracking-[0.25em] text-xs uppercase mb-2">
          This Is Where I Miss You
        </p>

        <h1 
          className="text-3xl sm:text-4xl text-white mb-4 drop-shadow-sm"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Your Voice, <br />
          On Repeat
          <Music className="inline-block mb-2 ml-2 text-pink-300 animate-pulse" size={32} />
        </h1>

        <p className="text-gray-300/80 text-sm max-w-md mx-auto font-medium">
          When everything feels heavy, your voice softens it.
        </p>
      </motion.div>

      {/* --- PLAYLIST CONTAINER --- */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 pb-10 space-y-8">
        {SONGS.map((song, index) => (
          <motion.div
            key={song.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <CassetteTape 
              song={song} 
              isPlaying={activeSongId === song.id} 
              onClick={() => handlePlaySong(song)}
            />
          </motion.div>
        ))}
      </div>

      {/* --- FINAL MOMENT FOOTER (Sticky) --- */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 2, type: "spring" }}
        className=" z-40 p-4 bg-gradient-to-t from-[#f2e8cf] via-[#f2e8cf]/90 to-transparent"
      >
        <div className="max-w-md mx-auto">
          <motion.button
            onClick={() => setShowModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="
              relative w-full overflow-hidden
              bg-[#38302e] text-[#f2e8cf]
              py-4 rounded-full
              shadow-2xl shadow-black/30
              flex items-center justify-center gap-3
              group
            "
          >
            {/* Animated Gradient Border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            <Heart className="fill-red-500 text-red-500 animate-pulse" size={20} />
            <span className="font-bold tracking-widest uppercase text-sm">One Final Message</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </motion.div>

      {/* --- MODAL --- */}
      <AnimatePresence>
        {showModal && (
          <LetterModal onClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>

    </div>
  );
}