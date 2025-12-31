import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, ArrowRight, Music as MusicIcon, Heart, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ==========================================
// 1. IMPORT YOUR AUDIO FILE HERE
// ==========================================
// Make sure the file 'love.mpeg' (or .mp3) is actually inside 'src/assets/'
// If your file is .mp3, change the extension below to .mp3
import songFile from '../assets/love.mpeg'; 

const SONG_URL = songFile; 

/**
 * ============================================================================
 * CONFIGURATION & THEME
 * ============================================================================
 */
const THEME = {
  colors: {
    bg: '#05020a',         
    primary: '#ec4899',    
    secondary: '#8b5cf6',  
    text: '#ffffff',
    dim: 'rgba(255,255,255,0.3)'
  },
  fonts: {
    hand: "'Patrick Hand', cursive", 
    ui: "'Inter', sans-serif"
  }
};

// LYRICS DATA
const LYRICS = [
  { time: 0, text: "..." }, 
  { time: 10, text: "They say, you know when you know" },
  { time: 17, text: "So let's face it, you had me at hello" },
  { time: 25, text: "Hesitation never helps" },
  { time: 28, text: "How could this be anything, anything else?" },
  { time: 33, text: "When all I dream of is your eyes" },
  { time: 38, text: "All I long for is your touch" },
  { time: 41, text: "And, darlin', something tells me that's enough, mm" },
  { time: 48, text: "You can say that I'm a fool" },
  { time: 52, text: "And I don't know very much" },
  { time: 55, text: "But I think they call this love Akshaya" },
  { time: 60, text: "" } 
];

/**
 * ============================================================================
 * 3. COMPONENT: BACKGROUND PARTICLES
 * ============================================================================
 */
const BackgroundParticles = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,      
      delay: Math.random() * 20,   
      duration: Math.random() * 10 + 15, 
      size: Math.random() * 30 + 10, 
      rotation: Math.random() * 360,
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a0b2e_0%,#000000_100%)] opacity-80" />
      
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bottom-[-50px] text-pink-500/20 blur-[1px]"
          style={{
            left: `${p.x}%`,
            fontSize: p.size,
          }}
          animate={{
            y: [0, -1200], 
            opacity: [0, 0.5, 0],
            rotate: [p.rotation, p.rotation + 180]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
        >
          <Heart fill="currentColor" />
        </motion.div>
      ))}
      
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

/**
 * ============================================================================
 * 4. COMPONENT: INTERACTIVE TOUCH LAYER
 * ============================================================================
 */
const InteractionLayer = ({ isActive }) => {
  const [bursts, setBursts] = useState([]);

  useEffect(() => {
    if (!isActive) return;

    const handleInteraction = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const id = Date.now();
      const type = Math.random() > 0.5 ? 'heart' : 'sparkle';
      
      setBursts(prev => [...prev, { id, x: clientX, y: clientY, type }]);

      setTimeout(() => {
        setBursts(prev => prev.filter(b => b.id !== id));
      }, 1000);
    };

    window.addEventListener('mousedown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      window.removeEventListener('mousedown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [isActive]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {bursts.map((burst) => (
          <BurstEffect key={burst.id} x={burst.x} y={burst.y} type={burst.type} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const BurstEffect = ({ x, y, type }) => {
  return (
    <motion.div
      initial={{ x, y, scale: 0, opacity: 1 }}
      animate={{ scale: 1.5, opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="absolute flex items-center justify-center"
    >
      <div className={`w-12 h-12 rounded-full ${type === 'heart' ? 'bg-pink-500/30' : 'bg-white/20'} blur-md`} />
      
      {type === 'heart' ? (
        <Heart fill="#ec4899" className="w-8 h-8 text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
      ) : (
        <Sparkles fill="#fff" className="w-8 h-8 text-yellow-200 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
      )}

      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          initial={{ x: 0, y: 0 }}
          animate={{
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            opacity: 0
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </motion.div>
  );
};

/**
 * ============================================================================
 * 5. COMPONENT: LYRIC RENDERER (Fluid Typography)
 * ============================================================================
 */
const LyricRenderer = ({ activeIndex }) => {
  return (
    <div className="relative w-full h-[60vh] flex flex-col items-center justify-center perspective-1000">
      <AnimatePresence mode='popLayout'>
        {LYRICS.map((line, index) => {
          const offset = index - activeIndex;
          // Show 1 past, current, and 1 future line
          if (Math.abs(offset) > 1 && index !== LYRICS.length - 1) return null;

          return (
            <LyricLine 
              key={index} 
              text={line.text} 
              state={offset === 0 ? 'active' : offset < 0 ? 'past' : 'future'} 
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};

const LyricLine = ({ text, state }) => {
  const variants = {
    active: {
      scale: 1.1,
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      textShadow: "0 0 30px rgba(236, 72, 153, 0.6), 0 0 10px rgba(255, 255, 255, 0.8)",
      color: "#ffffff"
    },
    past: {
      scale: 0.9,
      opacity: 0,
      y: -60,
      filter: "blur(10px)",
      textShadow: "none",
      color: "rgba(255,255,255,0.2)"
    },
    future: {
      scale: 0.9,
      opacity: 0,
      y: 60,
      filter: "blur(10px)",
      textShadow: "none",
      color: "rgba(255,255,255,0.2)"
    }
  };

  return (
    <motion.div
      layout
      initial="future"
      animate={state}
      exit="past"
      variants={variants}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="absolute w-full px-4 text-center"
    >
      <h2 
        className="font-bold leading-tight tracking-wide"
        style={{
          fontFamily: THEME.fonts.hand,
          fontSize: "clamp(1rem, 6vw, 4.5rem)", 
        }}
      >
        {text}
      </h2>
    </motion.div>
  );
};

/**
 * ============================================================================
 * 6. COMPONENT: FINAL MODAL (Magnificent UI)
 * ============================================================================
 */
const FinalModal = ({ onContinue }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center px-6"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-sm bg-[#111] border border-white/10 rounded-[2.5rem] p-10 text-center shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-pink-500/20 to-transparent blur-2xl" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center mb-6 shadow-lg shadow-pink-500/30">
            <Sparkles className="text-white w-10 h-10 animate-[spin_5s_linear_infinite]" />
          </div>
          
          <h3 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: THEME.fonts.hand }}>
            Wonderful...
          </h3>
          
          <p className="text-white/60 mb-8 text-base font-light leading-relaxed">
            The song has ended, but the memories remain. <br/>
           I don’t always say everything,
so I tried to show it instead.
This is my way of saying how much you mean to me.
Headphones on…
          </p>

          <button
            onClick={onContinue}
            className="group w-full py-4 rounded-2xl bg-white text-black font-bold text-lg flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Watch Visual Treat 
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/**
 * ============================================================================
 * 7. COMPONENT: START SCREEN
 * ============================================================================
 */
const StartScreen = ({ onStart }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md px-6 text-center"
  >
    <div className="relative group cursor-pointer mb-8" onClick={onStart}>
      <div className="absolute inset-0 bg-white/30 rounded-full animate-ping opacity-75" />
      <div className="relative w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.5)] transition-transform group-hover:scale-110 group-active:scale-95">
         <Play fill="black" className="w-8 h-8 ml-1" />
      </div>
    </div>
    
    <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 drop-shadow-xl" style={{ fontFamily: THEME.fonts.hand }}>
      Special Song
    </h1>
    
    <p className="text-pink-200/80 text-sm uppercase tracking-[0.2em] animate-pulse">
      Tap to Listen
    </p>
  </motion.div>
);

/**
 * ============================================================================
 * 8. MAIN CONTROLLER
 * ============================================================================
 */
export default function MusicPage() {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  // --- AUDIO INIT ---
  const handleStart = () => {
    if (!audioRef.current) {
       audioRef.current = new Audio(SONG_URL);
       audioRef.current.volume = 1.0;
       
       // CRITICAL FIX: Handle Song End Naturally
       audioRef.current.onended = () => {
         setIsCompleted(true);
         setIsPlaying(false);
       };
    }
    
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.error("Audio Error:", err);
        setDemoMode(true);
        setIsPlaying(true);
      });
  };

  // --- SYNC LOOP ---
  useEffect(() => {
    let interval;
    if (isPlaying && !isCompleted) {
      interval = setInterval(() => {
        let currentTime = 0;
        
        // 1. Determine Time
        if (demoMode) {
          if (!audioRef.current.demoStartTime) audioRef.current.demoStartTime = Date.now();
          currentTime = (Date.now() - audioRef.current.demoStartTime) / 1000;
        } else {
          currentTime = audioRef.current.currentTime;
        }

        // 2. Find Active Lyric
        const newIndex = LYRICS.reduce((prev, curr, i) => {
           return curr.time <= currentTime ? i : prev;
        }, 0);

        if (newIndex !== activeIndex) {
          setActiveIndex(newIndex);
        }

        // 3. Fallback Completion Check
        // If audio file is longer than lyrics, we end when lyrics end + buffer
        const lastLyricTime = LYRICS[LYRICS.length - 1].time;
        if (currentTime > lastLyricTime + 3) {
           setIsCompleted(true);
           setIsPlaying(false);
        }

      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isCompleted, demoMode, activeIndex]);

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden select-none" style={{ fontFamily: THEME.fonts.ui }}>
      
      <BackgroundParticles />
      <InteractionLayer isActive={isPlaying && !isCompleted} />

      <div className="relative z-10 h-screen flex flex-col items-center justify-center">
        
        {/* Start Screen */}
        {!isPlaying && !isCompleted && (
          <StartScreen onStart={handleStart} />
        )}

        {/* Lyrics */}
        {isPlaying && !isCompleted && (
          <LyricRenderer activeIndex={activeIndex} />
        )}

        {/* Hint Footer */}
        {isPlaying && !isCompleted && (
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 0.6 }}
             transition={{ delay: 2, duration: 1 }}
             className="fixed bottom-8 flex flex-col items-center gap-2 pointer-events-none"
          >
             <div className="flex items-center gap-2 text-pink-300/50 text-xs uppercase tracking-widest bg-pink-900/10 px-3 py-1 rounded-full border border-pink-500/10">
               
               <span>Tap screen</span>
             </div>
          </motion.div>
        )}

        {/* Completion Modal */}
        <AnimatePresence>
          {isCompleted && (
            <FinalModal onContinue={() => navigate('/video')} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}