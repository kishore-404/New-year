import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { 
  Ticket, 
  Sparkles, 
  Headphones, 
  Heart, 
  ArrowRight, 
  Infinity as InfinityIcon,
  Calendar,
  Stars
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * ============================================================================
 * 1. CONFIGURATION & THEME
 * ============================================================================
 */
const THEME = {
  colors: {
    bg: '#020617',         // Slate 950 (Deep Space)
    ticketBg: '#0f172a',   // Slate 900
    goldPrimary: '#fbbf24', // Amber 400
    goldSecondary: '#d97706', // Amber 600
    goldText: '#fef3c7',    // Amber 100
    accentPink: '#ec4899',  // Pink 500
  },
  gradients: {
    goldBorder: 'linear-gradient(135deg, #fcd34d 0%, #b45309 50%, #fcd34d 100%)',
    goldText: 'linear-gradient(to bottom, #fef3c7, #fcd34d, #d97706)',
    glass: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
  }
};

/**
 * ============================================================================
 * 2. BACKGROUND & PARTICLES
 * ============================================================================
 */
const ParticleBackground = () => {
  // Generate stable random particles
  const particles = React.useMemo(() => {
    return [...Array(30)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-[#020617]" />
      <div 
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-amber-200/20 blur-[1px]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.5, 0],
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
 * 3. AUDIO VISUALIZER (DECORATIVE)
 * ============================================================================
 */
const AudioVisualizer = () => (
  <div className="flex items-center justify-center gap-1.5 h-12 mb-8">
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="w-2 bg-gradient-to-t from-pink-500 to-rose-300 rounded-full"
        animate={{
          height: [12, Math.random() * 32 + 12, 12],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.1,
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
);

/**
 * ============================================================================
 * 4. GOLDEN TICKET COMPONENT (RESPONSIVE)
 * ============================================================================
 */
const GoldenTicket = () => {
  const cardRef = useRef(null);
  
  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 });
  
  // Shine Effect
  const sheenGradient = useTransform(
    x,
    [-0.5, 0.5],
    [
      'linear-gradient(115deg, transparent 0%, rgba(255,255,255,0) 45%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 55%, transparent 100%)',
      'linear-gradient(115deg, transparent 40%, rgba(255,255,255,0) 45%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 55%, transparent 100%)'
    ]
  );

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
      animate={{ scale: 1, opacity: 1, rotateX: 0 }}
      transition={{ type: "spring", duration: 1.5 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      }}
      className="relative z-10 perspective-1000 w-full flex justify-center px-4"
    >
      {/* RESPONSIVE CONTAINER:
        - Mobile: w-[90vw] (90% of screen width)
        - Desktop: max-w-[500px] (Capped size)
        - Aspect Ratio: Keeps the ticket shape consistent
      */}
      <div 
        className="relative w-[min(88vw,520px)] aspect-[1.7/1] rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl"
        style={{
          background: THEME.colors.ticketBg,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
        }}
      >
        {/* Animated Sheen Overlay */}
        <motion.div 
          className="absolute inset-0 rounded-[1.5rem] sm:rounded-[2.5rem] z-20 pointer-events-none"
          style={{ background: sheenGradient }}
        />

        {/* Golden Border Gradient */}
        <div 
          className="absolute inset-0 p-[2px] sm:p-[4px] rounded-[1.5rem] sm:rounded-[2.5rem]"
          style={{ background: THEME.gradients.goldBorder }}
        >
          {/* Inner Ticket Content */}
          <div className="w-full h-full bg-[#0f172a] rounded-[1.3rem] sm:rounded-[2.2rem] flex flex-col relative overflow-hidden">
            
            {/* Texture Noise */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* --- TOP SECTION (HEADER) --- */}
            <div className="relative flex-[0.6] border-b-2 border-dashed border-amber-500/30 flex flex-col items-center justify-center p-2">
              
              {/* Semi-circle Cutouts */}
              <div className="absolute -left-3 bottom-[-12px] w-6 h-6 bg-[#020617] rounded-full border-r-2 border-amber-500/50 z-10" />
              <div className="absolute -right-3 bottom-[-12px] w-6 h-6 bg-[#020617] rounded-full border-l-2 border-amber-500/50 z-10" />

              {/* Icon Container */}
              <div className="mb-2 sm:mb-3 p-2 sm:p-3 rounded-full border border-amber-500/30 bg-amber-500/10 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                <Ticket className="w-5 h-5 sm:w-8 sm:h-8 text-amber-400" />
              </div>

              {/* Responsive Title using Clamp */}
              <h1 
                className="font-black text-transparent bg-clip-text text-center tracking-widest uppercase drop-shadow-sm"
                style={{ 
                  backgroundImage: THEME.gradients.goldText,
                  fontSize: 'clamp(1.2rem, 4vw, 2.2rem)', // FLUID FONT SIZE
                  fontFamily: "'Cinzel', serif"
                }}
              >
                Golden Ticket
              </h1>
              
              <p className="text-amber-200/60 text-[8px] sm:text-xs tracking-[0.3em] uppercase mt-1">
                Valid for every day ahead
              </p>
            </div>

            {/* --- BOTTOM SECTION (DETAILS) --- */}
            <div className="relative flex-[0.4] bg-black/20 flex flex-col items-center justify-center p-2 space-y-2">
              
              <h2 
                className="text-amber-100 italic font-medium text-center px-4"
                style={{ 
                  fontSize: 'clamp(0.9rem, 3vw, 1.5rem)', // FLUID FONT SIZE
                  fontFamily: "'Dancing Script', cursive"
                }}
              >
                "Unlimited Love & Smiles"
              </h2>

              <div className="flex gap-3 mt-1">
                 <Badge icon={InfinityIcon} text="No Expiration" />
                 <Badge icon={Calendar} text="Lifetime Access" />
              </div>

              <div className="text-[8px] sm:text-[10px] text-amber-500/40 font-mono mt-2">
                ID: 27-06-2006
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Helper for badges inside ticket
const Badge = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-amber-500/20 bg-amber-500/5">
    <Icon className="w-2 h-2 sm:w-3 sm:h-3 text-amber-400" />
    <span className="text-[8px] sm:text-[10px] text-amber-200/80 uppercase tracking-wider">{text}</span>
  </div>
);

/**
 * ============================================================================
 * 5. IMMERSIVE MODAL (POPUP)
 * ============================================================================
 */
const ImmersiveModal = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 sm:px-0">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        className="relative w-full max-w-sm sm:max-w-md bg-[#0f172a] border border-white/10 rounded-3xl p-6 sm:p-10 text-center overflow-hidden shadow-2xl"
      >
        {/* Glows */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-pink-500/20 rounded-full blur-[60px]" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-[60px]" />

        <div className="relative z-10 flex flex-col items-center">
          
          {/* Header Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 mb-6 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center shadow-lg shadow-pink-500/30">
            <Headphones className="text-white w-8 h-8 sm:w-10 sm:h-10" strokeWidth={2} />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-2">
            Akshaya <Heart className="text-pink-500 fill-pink-500 animate-pulse" size={24} />
          </h2>

          <div className="w-16 h-1 bg-white/10 rounded-full my-4 sm:my-6" />

          <p className="text-white/80 text-base sm:text-lg font-light mb-6">
            Find a quiet place, <br/> put on your headphones <span className="inline-block animate-bounce">🎧</span>
          </p>

          <AudioVisualizer />

          <p className="text-pink-200/90 text-sm sm:text-base font-medium italic mb-8">
            "And give me the next few minutes of your heart."
          </p>

          <button
            onClick={() => navigate('/music')}
            className="w-full py-3 sm:py-4 rounded-xl bg-white text-black font-bold text-sm sm:text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            Start Experience <ArrowRight size={20} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/**
 * ============================================================================
 * 6. MAIN PAGE COMPONENT
 * ============================================================================
 */
export default function TicketPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-[#020617] flex flex-col items-center justify-center overflow-hidden font-sans selection:bg-amber-500/30">
      
      {/* Background */}
      <ParticleBackground />

      {/* Main Content */}
      <div className="relative z-10 w-full flex flex-col items-center gap-8 sm:gap-12 px-4 py-8">
        
        {/* The Golden Ticket */}
        <GoldenTicket />

        {/* Claim Button */}
        <motion.button
          onClick={() => setShowModal(true)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-8 py-3 sm:px-10 sm:py-4 rounded-full bg-transparent border border-amber-500/30 overflow-hidden"
        >
          <div className="absolute inset-0 bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors" />
          <div className="flex items-center gap-3">
             <span className="text-amber-100 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase">
               Claim Ticket
             </span>
             <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-amber-500 text-[#020617] flex items-center justify-center">
               <ArrowRight size={14} strokeWidth={3} />
             </div>
          </div>
        </motion.button>

      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {showModal && <ImmersiveModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>

    </div>
  );
}