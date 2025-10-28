import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface IntroVideoProps {
  videoSrc?: string;
  logoSrc?: string;
  leftWidthVw?: number;
}

export default function IntroVideo({
  videoSrc = '/videos/intro.mp4',
  logoSrc = '/logo.png',
  leftWidthVw = 45,
}: IntroVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [hasEnded, setHasEnded] = useState<boolean>(false);
  const [inView, setInView] = useState<boolean>(false);

  useEffect(() => {
    const updateIsDesktop = () => setIsDesktop(window.innerWidth >= 768);
    updateIsDesktop();
    window.addEventListener('resize', updateIsDesktop);
    return () => window.removeEventListener('resize', updateIsDesktop);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        setInView(entry.isIntersecting && entry.intersectionRatio >= 0.5);
      },
      { threshold: [0, 0.5, 0.75, 1] }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const videoEl = (isDesktop ? desktopVideoRef.current : mobileVideoRef.current);
    if (!videoEl) return;
    if (inView && !hasStarted) {
      try {
        videoEl.muted = true; // Autoplay compliance
        // On some browsers play returns a promise
        const playPromise = videoEl.play();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.then(() => setHasStarted(true)).catch(() => {/* ignored */});
        } else {
          setHasStarted(true);
        }
      } catch {
        // ignore autoplay errors
      }
    }
  }, [inView, hasStarted, isDesktop]);

  const handleEnded = () => {
    setHasEnded(true);
  };

  const rightInitialLeft = `${leftWidthVw}vw`;
  const rightInitialWidth = `${100 - leftWidthVw}vw`;

  return (
    <section
      ref={containerRef}
      className="relative -mx-4 md:-mx-6 my-0"
      style={{ marginLeft: 'calc(-50vw + 50%)' }}
    >
      {/* Desktop / Tablet: Split view with expanding right panel */}
      <motion.div
        className="hidden md:block relative"
        initial={false}
        animate={{ height: hasEnded ? '50vh' : '100vh' }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        style={{ minHeight: hasEnded ? 350 : 700 }}
      >
        <div className="absolute inset-0">
          {/* Left: Portrait video fixed within viewport */}
          <div className="absolute left-0 top-0 h-full" style={{ width: `${leftWidthVw}vw` }}>
            <video
              ref={desktopVideoRef}
              src={videoSrc}
              playsInline
              muted
              preload="auto"
              onEnded={handleEnded}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>

          {/* Right: Brand panel that expands to full width on end */}
          <motion.div
            initial={{ left: rightInitialLeft, width: rightInitialWidth }}
            animate={hasEnded ? { left: 0, width: '100vw' } : { left: rightInitialLeft, width: rightInitialWidth }}
            transition={{ duration: 1.0, ease: 'easeInOut' }}
            className="absolute top-0 h-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--brand-bg-exact)' }}
          >
            <img src={logoSrc} alt="Maison MKY" className="w-32 h-32 lg:w-40 lg:h-40 object-contain" />
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile: Video blurs out then brand background with centered logo fades in */}
      <motion.div
        className="md:hidden relative"
        initial={false}
        animate={{ height: hasEnded ? '50vh' : '100vh' }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        style={{ minHeight: hasEnded ? 280 : 560 }}
      >
        <video
          ref={mobileVideoRef}
          src={videoSrc}
          playsInline
          muted
          preload="auto"
          onEnded={handleEnded}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ${hasEnded ? 'blur-md scale-105' : ''}`}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hasEnded ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: 'var(--brand-bg-exact)' }}
        >
          <img src={logoSrc} alt="Maison MKY" className="w-24 h-24 object-contain" />
        </motion.div>
      </motion.div>
    </section>
  );
}


