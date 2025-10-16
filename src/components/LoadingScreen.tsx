import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading time or wait for resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ 
            background: 'var(--brand-bg-exact)'
          }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-center"
          >
            {/* Logo container with subtle fade effect */}
            <div className="w-64 h-64 flex items-center justify-center relative">
              {/* Logo with mask for subtle edge fade */}
              <div className="w-48 h-48 relative">
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
                    // Hide the image if it fails to load
                    e.currentTarget.style.display = 'none';
                    // Show the text fallback
                    const parent = e.currentTarget.parentElement?.parentElement;
                    if (parent) {
                      const fallback = parent.querySelector('.logo-fallback');
                      if (fallback) fallback.style.display = 'block';
                    }
                  }}
                />
              </div>
              
              {/* Text fallback that shows if image fails to load */}
              <div 
                className="logo-fallback text-[#F3E7DF] font-light tracking-widest text-3xl absolute"
                style={{ display: 'none' }}
              >
                MAISON MKY
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
