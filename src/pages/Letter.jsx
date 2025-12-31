import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Stars, 
  Sparkles, 
  Quote,
  ArrowLeft,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Cover from "../assets/cover.webp"
// ============================================================================
// IMPORT YOUR COVER IMAGE HERE
// ============================================================================
// import coverImage from '../assets/cover.webp'; 
// For demo purposes, using a placeholder if you haven't imported yours yet:
const coverImage = Cover;

// ============================================================================
// 1. CONTENT CONFIGURATION (THE STORY)
// ============================================================================

const PAGES = [
  {
    title: "Before You Begin",
    content: [
      "Please don’t rush this.",
  "Each page holds something I wanted you to know.",
  "You don’t have to understand everything at once.",
  "Just be here, and let my words find you."
    ]
  },
  {
    title: "When You’re Happy",
content: [
  "When you’re happy, I want to be part of it madam",
  "I want to listen to your stories, celebrate your good moments, and stand with you in everything that makes you smile."
]

  },
  {
    title: "When You’re Angry",
content: [
  "When you’re angry, you don’t have to hide it from me madam",
  "You can tell me everything, even when you’re upset or frustrated.",
  "I’ll listen patiently and stay with you until things feel better."
]

  },
   {
    title: "When You’re Sad",
    content: [
      "When you’re sad, you don’t have to carry it alone.",
      "You don’t have to explain or pretend you’re okay. I want the quiet moments, the heavy silences, the days when everything feels too much.",
      "I’ll sit with you there, patiently, gently, choosing you even in your hardest moments."
    ]
  },
  {
    title: "Every Part of You",
    content: [
      "I don’t just want the easy parts of you.",
      "I want every broken piece, every scar, every moment that shaped you. You don’t need to be perfect with me.",
      "I want to grow with you, heal with you, and love you exactly as you are  unfinished, real, and beautiful."
    ]
  },
 
  {
    title: "Happy New Year",
    content: [
      "As this year ends and a new one begins, I don’t wish for perfection.",
      "I wish for us choosing each other through happiness, anger, sadness, and everything in between.",
      "No matter what the new year brings, I want you to remember this you’re not alone, and you never have to be.",
      "I’m here  today, tomorrow, and into every year that comes next.",
      "Happy New Year, my Akshaya."
    ]
  }
];

const THEME = {
  fonts: {
    hand: "'Patrick Hand', cursive", // Handwriting font
    ui: "'Inter', sans-serif"
  }
};

/**
 * ============================================================================
 * 2. UTILITY: MAGICAL BACKGROUND (Unchanged)
 * ============================================================================
 */
const MagicalBackground = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#05020a]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.2),rgba(0,0,0,1))]" />
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: 0.2
          }}
          animate={{
            y: [0, -120],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

/**
 * ============================================================================
 * 3. COMPONENT: CONFETTI EXPLOSION (Unchanged)
 * ============================================================================
 */
const ConfettiExplosion = ({ isActive }) => {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (isActive) {
      const newPieces = Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        x: 50, y: 50,
        destX: Math.random() * 100,
        destY: Math.random() * 100,
        color: ['#e879f9', '#a855f7', '#fbbf24', '#60a5fa'][Math.floor(Math.random() * 4)],
        rotation: Math.random() * 720,
        delay: Math.random() * 0.2
      }));
      setPieces(newPieces);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: p.color, left: `${p.x}%`, top: `${p.y}%` }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ 
            left: `${p.destX}%`, top: `${p.destY}%`, 
            rotate: p.rotation, opacity: 0, scale: 0.5 
          }}
          transition={{ duration: 2, ease: "easeOut", delay: p.delay }}
        />
      ))}
    </div>
  );
};

/**
 * ============================================================================
 * 4. COMPONENT: 3D LETTER CARD WITH PAGINATION (MODIFIED)
 * ============================================================================
 */
const LetterCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // State for Pagination
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleToggle = () => setIsOpen(!isOpen);

  // Pagination Logic
  const paginate = (newDirection) => {
    const nextIndex = pageIndex + newDirection;
    if (nextIndex >= 0 && nextIndex < PAGES.length) {
      setDirection(newDirection);
      setPageIndex(nextIndex);
    }
  };

  // Animation Variants for Page Slide
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 20 : -20,
      opacity: 0,
    })
  };

  return (
    <div className="relative flex items-center justify-center perspective-2000 w-full h-full p-2 sm:p-6">

      {/* 3D Scene Container */}
      <motion.div
        className="relative w-full max-w-[340px] sm:max-w-[450px] aspect-[3/4]"
        initial={false}
        animate={{
          x: isOpen ? (window.innerWidth < 640 ? -15 : 0) : 0,
        }}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >

        {/* ============================================================
            LAYER 1: THE INSIDE RIGHT (Content)
           ============================================================ */}
        <div
          className="absolute inset-0 bg-[#fffbf0] rounded-r-xl rounded-l-md shadow-2xl border-r-4 border-b-4 border-purple-900/20 flex flex-col"
          style={{
            // FIX 1: Removed negative Z, keeping it at 0 base.
            transformStyle: 'preserve-3d', 
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, #fffbf0, #fdf6e3)`,
            backgroundSize: '24px 24px',
          }}
          // IMPORTANT: Stop clicks from bubbling to the card flipper
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative Inner Border */}
          <div className="absolute inset-2 border-2 border-purple-300/40 rounded-lg pointer-events-none" />

          {/* --- CONTENT AREA --- */}
          <div className="flex-1 overflow-hidden p-5 sm:p-8 relative z-10 flex flex-col">

            {/* Header Icon */}
            <div className="mb-2 text-purple-400 opacity-60 flex justify-center">
              <Quote size={20} className="transform rotate-180" />
            </div>

            {/* ANIMATED TEXT CONTAINER */}
            <div className="flex-1 relative w-full">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={pageIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="absolute inset-0 overflow-y-auto custom-scrollbar pr-2"
                >
                  {/* Page Title */}
                  <h3
                    className="text-lg sm:text-2xl font-bold text-purple-600 mb-4 text-center underline decoration-purple-300/50 underline-offset-4"
                    style={{ fontFamily: THEME.fonts.hand }}
                  >
                    {PAGES[pageIndex].title}
                  </h3>

                  {/* Paragraphs */}
                  <div className="space-y-4 pb-12">
                    {PAGES[pageIndex].content.map((paragraph, idx) => (
                      <p
                        key={idx}
                        className="text-base sm:text-xl font-medium leading-relaxed text-gray-700"
                        style={{ fontFamily: THEME.fonts.hand }}
                      >
                        {paragraph}
                      </p>
                    ))}

                    {/* SIGNATURE (Only on last page) */}
                    {pageIndex === PAGES.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 pt-4 border-t border-purple-200 flex justify-end"
                      >
                        <div className="text-right">
                          <p className="text-xs text-pink-400 font-sans uppercase tracking-widest mb-1">From my heart  ❤️</p>
                          <div className="text-2xl text-pink-600" style={{ fontFamily: "'Dancing Script', cursive" }}>
                            Kishore
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* --- PAGINATION CONTROLS (FIXED) --- */}
            <div 
              className="mt-auto pt-4 border-t border-purple-200/50 flex justify-between items-center bg-[#fffbf0]"
              style={{ 
                // FIX 2: Force buttons to pop out in 3D space so they are ALWAYS clickable
                transform: 'translateZ(50px)', 
                zIndex: 9999 
              }}
            >

              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  paginate(-1);
                }}
                disabled={pageIndex === 0}
                className={`flex items-center gap-1 text-sm font-bold uppercase tracking-wide transition-colors cursor-pointer ${
                  pageIndex === 0
                    ? 'text-gray-300 cursor-default'
                    : 'text-purple-500 hover:text-purple-700 hover:scale-105 active:scale-95'
                }`}
                style={{ fontFamily: THEME.fonts.ui }}
              >
                <ChevronLeft size={16} /> Prev
              </button>

              {/* Page Indicator */}
              <span className="text-xs text-purple-300 font-mono">
                {pageIndex + 1} / {PAGES.length}
              </span>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  paginate(1);
                }}
                disabled={pageIndex === PAGES.length - 1}
                className={`flex items-center gap-1 text-sm font-bold uppercase tracking-wide transition-colors cursor-pointer ${
                  pageIndex === PAGES.length - 1
                    ? 'text-gray-300 cursor-default'
                    : 'text-purple-500 hover:text-purple-700 hover:scale-105 active:scale-95'
                }`}
                style={{ fontFamily: THEME.fonts.ui }}
              >
                Next <ChevronRight size={16} />
              </button>

            </div>

          </div>

          {/* Spine Shadow Gradient */}
          <div className="absolute top-0 bottom-0 left-0 w-6 bg-gradient-to-r from-black/10 to-transparent pointer-events-none z-20" />
        </div>


        {/* ============================================================
            LAYER 2: THE FRONT COVER (Flap)
           ============================================================ */}
        <motion.div
          className="absolute inset-0 origin-left"
          style={{ 
            transformStyle: "preserve-3d",
            // FIX 3: Push the cover slightly forward so it sits on top naturally
            transform: 'translateZ(2px)' 
          }}
          animate={{ rotateY: isOpen ? -180 : 0 }}
          transition={{ type: "spring", stiffness: 45, damping: 15 }}
          onClick={handleToggle}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          {/* Front Side */}
          <div
            className="absolute inset-0 bg-[#fffbf0] rounded-r-xl rounded-l-md shadow-xl backface-hidden flex items-center justify-center overflow-hidden cursor-pointer"
            style={{ backfaceVisibility: 'hidden', zIndex: 20 }}
          >
            <div className="relative w-full h-full p-2">
              <div className="w-full h-full border-[10px] border-purple-200 rounded-lg overflow-hidden relative bg-white shadow-inner">
                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent"
                  animate={{ x: isHovered ? ['100%', '-100%'] : '100%' }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          </div>

          {/* Inner Left Side */}
          <div
            className="absolute inset-0 bg-[#fffbf0] rounded-l-xl rounded-r-md shadow-inner flex items-center justify-center"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', zIndex: 20 }}
          >
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />
            <div className="w-full h-full p-6 flex items-center justify-center">
              <div className="text-center opacity-50 space-y-2 border-4 border-dashed border-purple-200 w-full h-full rounded-lg flex flex-col items-center justify-center">
                <Stars className="w-10 h-10 text-purple-300" />
                <p className="text-sm font-handwriting text-purple-400 px-4" style={{ fontFamily: THEME.fonts.hand }}>
                  "A letter is a hug you can keep."
                </p>
              </div>
            </div>
          </div>
        </motion.div>

      </motion.div>

      {/* Confetti Trigger */}
      <ConfettiExplosion isActive={isOpen} />

    </div>
  );
};

/**
 * ============================================================================
 * 5. MAIN PAGE COMPONENT
 * ============================================================================
 */
export default function LetterPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full bg-[#05020a] flex flex-col items-center overflow-hidden font-sans selection:bg-purple-500/30">
      
      {/* Background */}
      <MagicalBackground />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 pt-8 pb-2 text-center px-4"
      >
        <h1 
          className="text-3xl sm:text-5xl font-bold text-white mb-2"
          style={{ fontFamily: THEME.fonts.hand }}
        >
          For my Cutiepie :)
        </h1>
        <div className="flex items-center justify-center gap-2 text-purple-300/50 text-xs uppercase tracking-widest">
          <Sparkles size={12} />
          <span>Tap card to read</span>
          <Sparkles size={12} />
        </div>
      </motion.div>

      {/* Letter Card Area */}
      <div className="relative z-10 flex-1 w-full flex items-center justify-center pb-20">
        <LetterCard />
      </div>

      {/* Footer Navigation */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 3 }}
        className="fixed bottom-6 left-0 right-0 flex justify-center gap-6 text-white/30 text-xs z-50 pointer-events-none"
      >
        <button onClick={() => navigate('/')} className="hover:text-white pointer-events-auto transition-colors flex items-center gap-1">
          <ArrowLeft size={12} /> Home
        </button>
      </motion.div>

      {/* CSS for custom scrollbar (Injecting here for simplicity) */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.3);
          border-radius: 10px;
        }
        .backface-hidden {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        .perspective-2000 {
          perspective: 2000px;
        }
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Inter:wght@300;400;600&family=Patrick+Hand&display=swap');
      `}</style>

    </div>
  );
}