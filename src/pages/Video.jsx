import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Sparkles, 
  Music, 
  Play, 
  RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// IMPORT YOUR VIDEO ASSET
// Ensure this file exists in your project
import Love from "../assets/love.mp4";
const VIDEO_SRC = Love; 

/**
 * ============================================================================
 * 1. CONFIGURATION & ASSETS
 * ============================================================================
 */
const THEME = {
  colors: {
    bg: '#000000',
    primary: '#ec4899',   
    secondary: '#f59e0b', 
    text: '#ffffff',
    glass: 'rgba(255, 255, 255, 0.1)'
  },
  fonts: {
    hand: "'Patrick Hand', cursive",
    ui: "'Inter', sans-serif"
  }
};

/**
 * ============================================================================
 * 2. BACKGROUND: STARDUST ENGINE
 * ============================================================================
 */
const StardustBackground = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1,
      duration: Math.random() * 20 + 10
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.05)_0%,#000000_100%)]" />
      
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            opacity: [p.opacity, 1, p.opacity],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

/**
 * ============================================================================
 * 3. COMPONENT: DRAMATIC COUNTDOWN (WITH CLICK TRIGGER)
 * ============================================================================
 */
const CountdownOverlay = ({ onComplete }) => {
  const [count, setCount] = useState(5);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount(c => c - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsReady(true);
    }
  }, [count]);

  return (
    <motion.div 
      className="absolute inset-0 z-50 flex items-center justify-center bg-black"
      exit={{ opacity: 0, pointerEvents: 'none' }}
      transition={{ duration: 0.8 }}
    >
      <AnimatePresence mode='wait'>
        {!isReady ? (
          <motion.div
            key={count} 
            initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
            animate={{ scale: 1.2, opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 2, opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }} 
            className="flex flex-col items-center justify-center"
          >
            <span 
              className="text-9xl sm:text-[12rem] font-black text-white leading-none"
              style={{ 
                fontFamily: THEME.fonts.ui,
                textShadow: "0 0 60px rgba(236,72,153,0.8)" 
              }}
            >
              {count}
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="button"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center px-4"
          >
            <h1 
              className="text-4xl sm:text-6xl font-bold text-white mb-8"
              style={{ fontFamily: THEME.fonts.hand }}
            >
              Are you ready?
            </h1>
            
            {/* THIS BUTTON IS KEY: It triggers the user interaction needed for audio */}
            <motion.button
              onClick={onComplete}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-black font-bold text-xl rounded-full shadow-[0_0_30px_rgba(255,255,255,0.4)]"
            >
              YES, SHOW ME
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/**
 * ============================================================================
 * 4. COMPONENT: MINIMALIST PLAYER
 * ============================================================================
 */
const CustomPlayer = ({ onEnded }) => {
  const videoRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Auto-play immediately when this component mounts
  // (Because the user just clicked "YES", this will work!)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setHasStarted(true);
        })
        .catch(err => {
          console.error("Autoplay failed:", err);
          setIsPlaying(false);
        });
    }
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        setHasStarted(true);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      // Use min-h-screen to ensure the container is never 0 height
      className="relative w-full min-h-[50vh] flex items-center justify-center bg-black"
    >
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        // w-full and h-auto allows the video to be its natural size
        // max-h-screen keeps it from being too tall
        className="w-full h-auto max-h-[85vh] object-contain" 
        onEnded={() => {
          setIsPlaying(false);
          onEnded();
        }}
        onClick={handlePlayPause}
        playsInline
      />

      {/* --- PLAY BUTTON OVERLAY --- */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] z-20 cursor-pointer"
            onClick={handlePlayPause}
          >
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all hover:scale-110">
              {hasStarted ? (
                 <RotateCcw className="text-white w-10 h-10" />
              ) : (
                 <Play fill="white" className="text-white w-10 h-10 ml-1" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/**
 * ============================================================================
 * 5. COMPONENT: EMOTIONAL MODAL (FINAL POPUP)
 * ============================================================================
 */
const FinalModal = ({ onNavigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />

      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-10 text-center shadow-2xl"
      >
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-pink-500 flex items-center justify-center mb-6">
            <Heart className="text-white w-8 h-8 animate-pulse" fill="currentColor" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: THEME.fonts.hand }}>
            For the days I miss you
          </h2>

          <div className="space-y-4 mb-8">
  
            <p className="text-pink-300 font-medium text-lg italic">
               There are moments when all I need is to hear you.
            </p>
          </div>

          <motion.button
            onClick={onNavigate}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg flex items-center justify-center gap-3"
          >
            Listen With Me <Music size={20} className="text-pink-600" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/**
 * ============================================================================
 * 6. MAIN PAGE COMPONENT
 * ============================================================================
 */
export default function VideoPage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState('countdown'); 

  const handleStartVideo = () => {
    setStage('video');
  };

  const handleVideoEnded = () => {
    setTimeout(() => {
      setStage('finished');
    }, 1000);
  };

  const handleNavigate = () => {
    navigate('/playlist');
  };

  return (
    <div className="relative min-h-screen w-full bg-black flex flex-col items-center justify-center font-sans overflow-hidden">
      
      <StardustBackground />

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <AnimatePresence mode='wait'>
          
          {stage === 'countdown' && (
            <CountdownOverlay key="countdown" onComplete={handleStartVideo} />
          )}

          {stage === 'video' && (
            <CustomPlayer key="player" onEnded={handleVideoEnded} />
          )}

        </AnimatePresence>

        <AnimatePresence>
          {stage === 'finished' && (
            <FinalModal onNavigate={handleNavigate} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}