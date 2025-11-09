import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DareToEnterProps {
  onEnter?: () => void;
}

export default function DareToEnter({ onEnter }: DareToEnterProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already clicked enter in this session
    const hasEnteredSession = sessionStorage.getItem('mky_dare_to_enter_clicked');
    
    if (!hasEnteredSession) {
      // Show the splash screen
      setIsVisible(true);
    }
  }, []);

  const handleEnter = () => {
    // Mark that user clicked enter in this session
    sessionStorage.setItem('mky_dare_to_enter_clicked', 'true');
    
    // Hide splash screen
    setIsVisible(false);
    
    // Call callback if provided
    onEnter?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ 
            background: 'var(--brand-bg-exact)',
            height: '100%',
            width: '100%',
            overflow: 'hidden'
          }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center justify-center gap-8"
          >
            {/* Logo container */}
            <div className="w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center relative">
              <div className="w-32 h-32 sm:w-48 sm:h-48 relative">
                <img 
                  src="/logo.png" 
                  alt="Maison MKY" 
                  className="w-full h-full object-contain"
                  style={{ 
                    opacity: 0.95,
                    maskImage: 'radial-gradient(circle, black 65%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(circle, black 65%, transparent 100%)'
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement?.parentElement;
                    if (parent) {
                      const fallback = parent.querySelector('.logo-fallback');
                      if (fallback) fallback.style.display = 'block';
                    }
                  }}
                />
              </div>
              
              {/* Text fallback */}
              <div 
                className="logo-fallback text-[#F3E7DF] font-light tracking-widest text-3xl absolute"
                style={{ display: 'none' }}
              >
                MAISON MKY
              </div>
            </div>

            {/* Dare to Enter Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl md:text-2xl tracking-wider text-center"
              style={{
                color: '#F3E7DF',
                fontFamily: 'Playfair Display, serif',
                letterSpacing: '0.05em'
              }}
            >
              Dare to Enter?
            </motion.p>

            {/* Enter Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              onClick={handleEnter}
              className="group px-8 py-3 border border-[#F3E7DF]/60 hover:border-[#F3E7DF] transition-all duration-300 rounded-full mt-4"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#F3E7DF'
              }}
            >
              <span className="relative inline-block group-hover:font-medium">
                Enter
                <span 
                  className="block h-[1px] bg-[#F3E7DF] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-0.5"
                ></span>
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

