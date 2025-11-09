import { useEffect, useRef, useState } from 'react';

interface NewSeasonSplitProps {
  logoSrc?: string;
  rightWidthVw?: number;
}

export default function NewSeasonSplit({
  logoSrc = '/logo.png',
  rightWidthVw = 45,
}: NewSeasonSplitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    const updateIsDesktop = () => setIsDesktop(window.innerWidth >= 768);
    updateIsDesktop();
    window.addEventListener('resize', updateIsDesktop);
    return () => window.removeEventListener('resize', updateIsDesktop);
  }, []);

  const leftWidthVw = 100 - rightWidthVw;

  return (
    <section
      ref={containerRef}
      className="relative -mx-4 md:-mx-6 my-0"
      style={{ marginLeft: 'calc(-50vw + 50%)' }}
    >
      {/* Desktop / Tablet: Split view - heading on left, logo on right */}
      <div
        className="hidden md:flex relative"
        style={{ height: '80vh', minHeight: 600, width: '100vw' }}
      >
        {/* Left: Text Section */}
        <div
          className="flex flex-col items-center justify-center"
          style={{ 
            width: `${leftWidthVw}vw`,
            backgroundColor: 'var(--brand-ink-exact)'
          }}
        >
          <h2 
            className="text-white text-4xl md:text-6xl tracking-tight text-center px-8"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            The New Season
          </h2>
        </div>

        {/* Right: Logo Section */}
        <div
          className="flex items-center justify-center"
          style={{ 
            width: `${rightWidthVw}vw`,
            backgroundColor: 'var(--brand-bg-exact)' 
          }}
        >
          <img src={logoSrc} alt="Maison MKY" className="w-40 h-40 lg:w-48 lg:h-48 object-contain" />
        </div>
      </div>

      {/* Mobile: Stacked layout - heading + logo centered below */}
      <div className="md:hidden relative flex flex-col">
        {/* Heading Section */}
        <div
          className="flex items-center justify-center py-16"
          style={{ 
            backgroundColor: 'var(--brand-ink-exact)',
            minHeight: 300
          }}
        >
          <h2 
            className="text-white text-3xl tracking-tight text-center px-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            The New Season
          </h2>
        </div>

        {/* Logo Section */}
        <div
          className="flex items-center justify-center py-16"
          style={{ backgroundColor: 'var(--brand-bg-exact)' }}
        >
          <img src={logoSrc} alt="Maison MKY" className="w-24 h-24 object-contain" />
        </div>
      </div>
    </section>
  );
}

