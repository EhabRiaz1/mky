import { motion, useScroll, useTransform } from 'framer-motion';
import Marquee from './Marquee';
import { useRef } from 'react';

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-1%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1.01, 1.0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.7]);

  return (
    <div id="hero-section" ref={ref} className="relative overflow-hidden w-screen" style={{ height: '90vh', minHeight: 700, marginLeft: 'calc(-50vw + 50%)' }}>
      <motion.img
        src="/images/hero.png"
        alt="Season Hero"
        className="absolute inset-0 w-full h-full object-cover object-[50%_0%]"
        style={{ y, opacity, scale }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute inset-0 flex items-end justify-end px-8 pt-8 pb-12 md:p-16">
        <div id="hero-text" className="relative text-right max-w-xl">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 rounded-3xl"
            style={{
              background: 'radial-gradient(70% 85% at 60% 60%, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.10) 40%, rgba(0,0,0,0) 100%)'
            }}
          />
          <div id="hero-logo-anchor" className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-40 w-0 h-0" />
          <motion.h1 
            initial={{ y: 20, opacity: 0 }} 
            whileInView={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.8 }} 
            id="hero-heading"
            className="text-white text-4xl md:text-6xl tracking-tight"
            style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400 }}
          >
            The New Season
          </motion.h1>
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            whileInView={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.3, duration: 0.8 }} 
            className="mt-3 md:mt-6 text-white/90 text-base md:text-lg max-w-xl tracking-wide"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
          >
            Cashmere, silk and leather — fabrics of Italy.
          </motion.div>
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            whileInView={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.6, duration: 0.8 }} 
            className="mt-4 md:mt-10 flex gap-4 justify-end"
          >
            <a href="/products" className="inline-flex items-center justify-center rounded-full border border-white/80 bg-transparent text-white px-6 py-2.5 md:py-3 hover:bg-white/10 transition">Shop Collection</a>
            <a href="/search" className="inline-flex items-center justify-center rounded-full border border-white/60 bg-transparent text-white/90 px-6 py-2.5 md:py-3 hover:bg-white/10 transition">Discover</a>
          </motion.div>
        </div>
      </div>
      <div className="absolute left-0 right-0 bottom-0">
        <Marquee embedded />
      </div>
    </div>
  );
}


