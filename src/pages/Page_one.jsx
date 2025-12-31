import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { Heart, Sparkles, Stars, ArrowRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ==========================================
// 1. CONFIGURATION & THEME
// ==========================================

const APP_CONFIG = {
  // Timing configurations (in milliseconds)
  holdDuration: 2500, // Time required to hold the button
  particleSpawnRate: 300, // How often hearts appear
  
  // Visual Constraints
  maxParticles: 40,
  
  // Colors matching the image exactly
  theme: {
    textPrimary: "text-pink-300",
    textSecondary: "text-pink-100/60",
    heartColor: "text-pink-400",
    ringColor: "#ec4899", // Tailwind Pink-500
    bgGradient: "from-[#0f0518] via-[#1a0b2e] to-[#000000]",
  }
};

// ==========================================
// 2. UTILITY HELPER FUNCTIONS
// ==========================================

/** Generates a random number between min and max */
const random = (min, max) => Math.random() * (max - min) + min;

/** Selects a random item from an array */
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

/** Generates a unique ID for React keys */
const generateId = () => `particle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// ==========================================
// 3. BACKGROUND COMPONENTS (VISUALS)
// ==========================================

/**
 * GridBackground
 * Adds the subtle grid texture seen in the reference image
 */
const GridBackground = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-20">
    <div 
      className="absolute inset-0" 
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), 
                          linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
      }}
    />
  </div>
);

/**
 * StarField
 * Adds depth with static stars in the deep background
 */
const StarField = () => {
  // UseMemo to calculate star positions only once to save performance
  const stars = useMemo(() => {
    return Array.from({ length: 50 }).map(() => ({
      id: generateId(),
      top: `${random(0, 100)}%`,
      left: `${random(0, 100)}%`,
      size: random(1, 3),
      opacity: random(0.2, 0.7)
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
       {stars.map((star) => (
         <div
           key={star.id}
           className="absolute bg-white rounded-full animate-pulse"
           style={{
             top: star.top,
             left: star.left,
             width: `${star.size}px`,
             height: `${star.size}px`,
             opacity: star.opacity,
             animationDuration: `${random(3, 8)}s`
           }}
         />
       ))}
    </div>
  );
};

// ==========================================
// 4. ANIMATED PARTICLE SYSTEM (FLOATING HEARTS)
// ==========================================

/**
 * FloatingHeart
 * Individual particle component that floats upward
 */
const FloatingHeart = ({ id, onComplete }) => {
  const size = random(10, 25);
  const startX = random(0, 100); // Percentage across screen
  const duration = random(10, 20); // Slow float
  
  return (
    <motion.div
      initial={{ y: "110vh", x: `${startX}vw`, opacity: 0, scale: 0, rotate: 0 }}
      animate={{ 
        y: "-20vh", 
        opacity: [0, 0.6, 0.6, 0], // Fade in, hold, fade out
        scale: [0, 1, 0.8],
        rotate: random(-45, 45) // Gentle rotation
      }}
      transition={{ 
        duration: duration, 
        ease: "linear",
      }}
      onAnimationComplete={() => onComplete(id)}
      className="absolute z-10 pointer-events-none text-pink-500/30 blur-[1px]"
      style={{ width: size, height: size }}
    >
      <Heart className="w-full h-full fill-current" />
    </motion.div>
  );
};

// ==========================================
// 5. UI COMPONENTS (BUTTONS & CARDS)
// ==========================================

/**
 * CircularProgress
 * The ring that fills up when holding the button
 */
const CircularProgress = ({ progress, size = 100, strokeWidth = 3 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track - Subtle */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Active Progress - Pink */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={APP_CONFIG.theme.ringColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.1, ease: "linear" }} // Instant response
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 4px #ec4899)" }}
        />
      </svg>
    </div>
  );
};

/**
 * MainCard
 * The exact replica of the glassmorphism card from the image
 */
const MainCard = ({ onHoldComplete }) => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Refs for animation loop
  const requestRef = useRef();
  const startTimeRef = useRef();
  
  // --- Hold Logic using RequestAnimationFrame for 60fps smoothness ---
  const animate = (time) => {
    if (!startTimeRef.current) startTimeRef.current = time;
    const timeElapsed = time - startTimeRef.current;
    
    // Calculate percentage
    const newProgress = Math.min((timeElapsed / APP_CONFIG.holdDuration) * 100, 100);
    setProgress(newProgress);

    if (newProgress < 100) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      // Completed!
      setIsHolding(false);
      onHoldComplete();
    }
  };

  const startHold = () => {
    setIsHolding(true);
    startTimeRef.current = null;
    requestRef.current = requestAnimationFrame(animate);
  };

  const stopHold = () => {
    setIsHolding(false);
    setProgress(0); // Reset progress immediately
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-30 flex flex-col items-center justify-center"
    >
      {/* GLASS CARD CONTAINER 
        Matches the dark, rounded, bordered look of the screenshot
      */}
      <div className="
        relative w-[18rem] xs:w-[20rem] sm:w-[24rem] aspect-square 
        rounded-[3rem] 
        bg-white/[0.03] 
        backdrop-blur-2xl 
        border border-white/[0.08] 
        shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_30px_rgba(255,255,255,0.02)]
        flex flex-col items-center justify-center
        p-6 sm:p-8
        text-center
        overflow-hidden
      ">
        {/* Inner Glow Effect */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-pink-500/10 blur-[80px] rounded-full pointer-events-none" />

        {/* --- TEXT CONTENT --- */}
        <div className="relative z-10 space-y-3 mb-8 sm:mb-12">
          <motion.h1 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className={`text-2xl sm:text-3xl font-bold tracking-tight ${APP_CONFIG.theme.textPrimary} drop-shadow-lg`}
             style={{ fontFamily: '"Quicksand", sans-serif' }} // Suggesting a rounded font
          >
            A little surprise for you Akshaya
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-sm sm:text-base ${APP_CONFIG.theme.textSecondary} font-light tracking-wide`}
          >
            Before this year begins
          </motion.p>
        </div>

        {/* --- INTERACTIVE BUTTON AREA --- */}
        <div className="relative z-10 flex flex-col items-center gap-4">
          
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
             
             {/* 1. The Progress Ring SVG */}
             <div className={`absolute inset-0 -m-2 transition-opacity duration-300 ${isHolding ? 'opacity-100' : 'opacity-40'}`}>
               <CircularProgress 
                  progress={progress} 
                  size={window.innerWidth < 640 ? 110 : 130} // Responsive ring sizing
                  strokeWidth={2} 
               />
             </div>

             {/* 2. The Button Itself */}
             <motion.button
               onMouseDown={startHold}
               onMouseUp={stopHold}
               onMouseLeave={stopHold}
               onTouchStart={startHold}
               onTouchEnd={stopHold}
               whileTap={{ scale: 0.92 }}
               animate={isHolding ? { scale: 0.95 } : { scale: 1 }}
               className="
                 relative w-20 h-20 sm:w-24 sm:h-24 
                 rounded-full 
                 bg-[#12081f] 
                 border border-white/10 
                 shadow-lg 
                 flex items-center justify-center 
                 group 
                 outline-none 
                 select-none
               "
               style={{ WebkitTapHighlightColor: "transparent" }}
             >
                {/* Glow behind heart */}
                <div className={`absolute inset-0 bg-pink-500/20 blur-xl rounded-full transition-opacity duration-500 ${isHolding ? 'opacity-100' : 'opacity-0'}`} />
                
                {/* The Heart Icon */}
                <Heart 
                  className={`w-8 h-8 sm:w-10 sm:h-10 text-pink-500 fill-pink-500 transition-transform duration-300 ${isHolding ? 'scale-110' : 'group-hover:scale-105'}`} 
                  strokeWidth={0} // Solid fill
                />
             </motion.button>
          </div>

          {/* 3. Instruction Label */}
          <motion.span 
             animate={{ opacity: isHolding ? 0.8 : 0.4 }}
             className="text-xs sm:text-sm uppercase tracking-[0.2em] text-pink-200/50 font-medium"
          >
            {isHolding ? "Keep holding..." : "Tap and hold"}
          </motion.span>

        </div>
      </div>
    </motion.div>
  );
};

/**
 * SuccessModal
 * Appears after the hold is complete to guide user to next page
 */
const SuccessModal = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative z-40 w-[85%] max-w-sm bg-white/10 backdrop-blur-xl border border-pink-500/30 rounded-[2.5rem] p-8 text-center shadow-2xl overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-pink-500/20 to-transparent blur-2xl" />

      <div className="relative z-10 flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }} type="spring"
          className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-rose-400 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/40 mb-6"
        >
          <Sparkles className="text-white w-8 h-8" />
        </motion.div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Unlocked!</h2>
        <p className="text-pink-100/70 text-base mb-8 leading-relaxed">
          The surprise is ready for you. <br/> Are you ready to see it?
        </p>

        <motion.button
          onClick={() => navigate('/gift')} 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="
            group w-full py-4 px-6 
            rounded-2xl 
            bg-white 
            text-pink-900 
            font-bold text-lg 
            flex items-center justify-center gap-2 
            shadow-xl hover:shadow-2xl hover:shadow-white/10
            transition-all
          "
        >
          Open Gift 
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </motion.button>
      </div>
    </motion.div>
  );
};

// ==========================================
// 6. MAIN PAGE COMPONENT
// ==========================================

const Page_one = () => {
  const [hearts, setHearts] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // --- Particle System Loop ---
  useEffect(() => {
    const interval = setInterval(() => {
      setHearts(current => {
        // Limit max particles
        if (current.length > APP_CONFIG.maxParticles) return current;
        return [...current, { id: generateId() }];
      });
    }, APP_CONFIG.particleSpawnRate);

    return () => clearInterval(interval);
  }, []);

  const handleHeartComplete = useCallback((id) => {
    setHearts(current => current.filter(h => h.id !== id));
  }, []);

  // --- Completion Handler ---
  const handleSuccess = () => {
    setIsCompleted(true);
  };

  return (
    <div className={`
      relative min-h-screen w-full 
      bg-gradient-to-b ${APP_CONFIG.theme.bgGradient}
      overflow-hidden 
      flex items-center justify-center 
      font-sans antialiased selection:bg-pink-500/30
    `}>
      
      {/* 1. Static Background Layers */}
      <GridBackground />
      <StarField />

      {/* 2. Floating Hearts Layer */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        <AnimatePresence>
          {hearts.map(heart => (
             <FloatingHeart 
               key={heart.id} 
               id={heart.id} 
               onComplete={handleHeartComplete} 
             />
          ))}
        </AnimatePresence>
      </div>

      {/* 3. Main Content Layer */}
      <div className="relative z-20 w-full flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <MainCard key="main-card" onHoldComplete={handleSuccess} />
          ) : (
            <SuccessModal key="success-modal" />
          )}
        </AnimatePresence>
      </div>

      {/* 4. Overlay Vignette for Cinematic Feel */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,_transparent_10%,_black_120%)] opacity-60" />

    </div>
  );
};

export default Page_one;