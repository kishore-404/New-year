import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  CloudRain, 
  Brain, 
  MapPin, 
  Gift as GiftIcon 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

/**
 * ============================================================================
 * 1. CONFIGURATION & THEME
 * ============================================================================
 */

const THEME = {
  colors: {
    bg: '#0f0f11',        // Main Background
    board: '#151518',     // The Visual "Box"
    border: 'rgba(255,255,255,0.06)',
    giftGradient: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
    giftShadow: '0 10px 30px -5px rgba(225, 29, 72, 0.5)',
  }
};

const CARDS_DATA = [
  {
    id: 'work',
    label: 'Work',
    icon: Briefcase,
    bg: '#fcd34d',    
    border: '#fbbf24',
    text: '#78350f',
    rotate: -12,      
    zIndex: 40
  },
  {
    id: 'distance',
    label: 'Distance',
    icon: MapPin,
    bg: '#93c5fd',    
    border: '#60a5fa',
    text: '#1e3a8a',
    rotate: 12,       
    zIndex: 30
  },
  {
    id: 'bad_days',
    label: 'Bad Days',
    icon: CloudRain,
    bg: '#f9a8d4',    
    border: '#f472b6',
    text: '#831843',
    rotate: 6,        
    zIndex: 20
  },
  {
    id: 'stress',
    label: 'Stress',
    icon: Brain,
    bg: '#fef08a',    
    border: '#facc15',
    text: '#713f12',
    rotate: -6,       
    zIndex: 10
  }
];

/**
 * ============================================================================
 * 2. GLOBAL EFFECTS
 * ============================================================================
 */
const fireFullScreenConfetti = () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 100, zIndex: 99999 };

  const randomInRange = (min, max) => Math.random() * (max - min) + min;

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    confetti({ 
      ...defaults, 
      particleCount, 
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
    });
    confetti({ 
      ...defaults, 
      particleCount, 
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
    });
  }, 250);
};

/**
 * ============================================================================
 * 3. COMPONENT: THE GIFT BUTTON (CENTERED)
 * ============================================================================
 */
const GiftButton = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{ 
        y: [0, -5, 0],
        filter: ['brightness(1)', 'brightness(1.1)', 'brightness(1)']
      }}
      transition={{ 
        repeat: Infinity, 
        duration: 3, 
        ease: "easeInOut" 
      }}
      className="absolute flex items-center justify-center cursor-pointer outline-none z-10"
      style={{
        // RIGOROUS CENTERING:
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)', // This forces true center
        
        width: '18vmin', 
        height: '18vmin',
        background: THEME.colors.giftGradient,
        borderRadius: '25%',
        boxShadow: THEME.colors.giftShadow
      }}
    >
      <GiftIcon className="text-white w-[50%] h-[50%]" strokeWidth={2} />
    </motion.button>
  );
};

/**
 * ============================================================================
 * 4. COMPONENT: DRAGGABLE CARD
 * ============================================================================
 */
const DraggableCard = ({ data, constraintsRef }) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      drag
      dragConstraints={constraintsRef} // Allows throwing across full screen
      dragElastic={0.1}     
      dragMomentum={false}  
      
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}

      initial={{ scale: 0, opacity: 0, rotate: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1, 
        rotate: isDragging ? 0 : data.rotate 
      }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      
      whileHover={{ scale: 1.05, cursor: 'grab', zIndex: 100 }}
      whileDrag={{ scale: 1.1, cursor: 'grabbing', zIndex: 100 }}
      
      className="absolute flex flex-col items-center justify-center select-none shadow-xl will-change-transform"
      style={{
        // RIGOROUS CENTERING: Spawns from center, covers the gift
        top: '50%',
        left: '50%',
        marginLeft: '-16vmin', // Half of width (32vmin / 2)
        marginTop: '-21vmin',  // Half of height (42vmin / 2)
        
        width: '32vmin',     
        height: '42vmin',    
        backgroundColor: data.bg,
        border: `4px solid #fff`,
        borderRadius: '12%',
        zIndex: isDragging ? 999 : data.zIndex,
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)'
      }}
    >
      <div 
        className="rounded-full flex items-center justify-center mb-[8%]"
        style={{
          backgroundColor: 'rgba(255,255,255,0.4)',
          width: '35%', 
          aspectRatio: '1/1',
          color: data.text
        }}
      >
        <data.icon style={{ width: '60%', height: '60%' }} strokeWidth={2.5} />
      </div>

      <h3 
        className="font-bold tracking-tight text-center"
        style={{
          color: data.text,
          fontSize: 'clamp(14px, 2.5vmin, 32px)', 
        }}
      >
        {data.label}
      </h3>
    </motion.div>
  );
};

/**
 * ============================================================================
 * 5. MAIN PAGE
 * ============================================================================
 */
export default function GiftReveal() {
  const navigate = useNavigate();
  const fullScreenRef = useRef(null); // Used for drag boundaries
  
  const handleGiftClick = () => {
    fireFullScreenConfetti();
    setTimeout(() => {
      navigate('/ticket');
    }, 2000);
  };

  return (
    <div 
      ref={fullScreenRef} 
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-sans"
      style={{ backgroundColor: THEME.colors.bg }}
    >
      
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#fff 1.5px, transparent 1.5px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* --- HEADER --- */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 text-center mb-[6vmin] px-4"
      >
        <h1 
          className="font-bold text-white mb-2 font-[Quicksand]"
          style={{ fontSize: 'clamp(28px, 6vmin, 56px)' }}
        >
          Something is waiting for you
        </h1>
        <p 
          className="text-white/50 font-medium"
          style={{ fontSize: 'clamp(16px, 3vmin, 24px)' }}
        >
          Move the little distractions aside
        </p>
      </motion.div>

      {/* --- PLAY AREA --- */}
      {/* The Visual Box Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
        style={{
          width: '80vmin',
          height: '80vmin',
          backgroundColor: THEME.colors.board,
          border: `1px solid ${THEME.colors.border}`,
          borderRadius: '15%'
        }}
      >
        {/* 1. THE GIFT (Dead Center) */}
        <GiftButton onClick={handleGiftClick} />

        {/* 2. THE CARDS (Dead Center Stack) */}
        {/* Note: We render them here so they are visually related to the box, 
            but the drag logic allows them to leave via 'constraintsRef' */}
        {CARDS_DATA.map((card) => (
          <DraggableCard 
            key={card.id} 
            data={card} 
            constraintsRef={fullScreenRef} 
          />
        ))}

      </motion.div>

      {/* --- FOOTER HINT --- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 text-white uppercase tracking-[0.2em] font-medium animate-pulse pointer-events-none"
        style={{ fontSize: 'clamp(10px, 1.5vmin, 14px)' }}
      >
        Drag items to corners
      </motion.div>

    </div>
  );
}