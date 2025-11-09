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

  const rightInitialLeft = `${leftWidthVw}vw`;
  const rightInitialWidth = `${100 - leftWidthVw}vw`;

  const handleScrollDown = () => {
    // Scroll down by one viewport height
    window.scrollBy({ 
      top: window.innerHeight, 
      behavior: 'smooth' 
    });
  };

  return (
    <section
      ref={containerRef}
      className="relative -mx-4 md:-mx-6 my-0"
      style={{ marginLeft: 'calc(-50vw + 50%)' }}
    >
      {/* Desktop / Tablet: Split view - video loops infinitely on left, logo on right */}
      <div
        className="hidden md:block relative"
        style={{ height: '100vh', minHeight: 700 }}
      >
        <div className="absolute inset-0">
          {/* Left: Portrait video (looping, never ends) */}
          <div className="absolute left-0 top-0 h-full" style={{ width: `${leftWidthVw}vw` }}>
            <video
              ref={desktopVideoRef}
              src={videoSrc}
              playsInline
              muted
              preload="auto"
              loop
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>

          {/* Right: Brand panel with logo and explore button */}
          <div
            className="absolute top-0 h-full flex flex-col items-center justify-center gap-8"
            style={{ 
              left: rightInitialLeft, 
              width: rightInitialWidth,
              backgroundColor: 'var(--brand-bg-exact)' 
            }}
          >
            <img src={logoSrc} alt="Maison MKY" className="w-32 h-32 lg:w-40 lg:h-40 object-contain" />
            
            {/* Elegant Explore Button */}
            <button
              onClick={handleScrollDown}
              className="group px-6 py-3 border border-white/60 hover:border-white transition-all duration-300 rounded-full"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'white'
              }}
            >
              <span className="relative inline-block group-hover:font-medium">
                Click to Explore
                <span className="block h-[1px] bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-0.5"></span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: Video full width (looping, never ends), logo centered below */}
      <div className="md:hidden relative flex flex-col">
        {/* Video Section */}
        <div className="relative" style={{ height: '100vh', minHeight: 560 }}>
          <video
            ref={mobileVideoRef}
            src={videoSrc}
            playsInline
            muted
            preload="auto"
            loop
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>

        {/* Logo Section - Centered below video */}
        <div
          className="flex items-center justify-center py-12"
          style={{ backgroundColor: 'var(--brand-bg-exact)' }}
        >
          <img src={logoSrc} alt="Maison MKY" className="w-24 h-24 object-contain" />
        </div>
      </div>
    </section>
  );
}


