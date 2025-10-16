import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.7]);

  return (
    <div id="hero-section" ref={ref} className="relative overflow-hidden photo-frame mx-4" style={{ height: 700 }}>
      <motion.img
        src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2574&auto=format&fit=crop"
        alt="Season Hero"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ y, opacity }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
      <div className="relative h-full flex items-end p-12 md:p-16">
        <div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }} 
            whileInView={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.8 }} 
            className="text-white text-5xl md:text-7xl font-light tracking-tight"
          >
            The New Season
          </motion.h1>
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            whileInView={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.3, duration: 0.8 }} 
            className="mt-4 text-white/90 text-lg md:text-xl max-w-xl"
          >
            Cashmere, silk and leather — crafted in Italy.
          </motion.div>
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            whileInView={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.6, duration: 0.8 }} 
            className="mt-8 flex gap-4"
          >
            <a href="/products" className="btn btn-primary">Shop Collection</a>
            <a href="/search" className="btn btn-outline text-white border-white/30">Discover</a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}


