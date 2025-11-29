import { motion } from 'framer-motion';

type MarqueeProps = {
  embedded?: boolean;
};

export default function Marquee({ embedded = false }: MarqueeProps) {
  // Replace "Maison MKY" with the logo image
  const items: Array<{ type: 'text'; value: string } | { type: 'image'; src: string; alt: string }>= [
    { type: 'image', src: '/logo.png', alt: 'Maison MKY' },
    { type: 'text', value: 'British & Italian Fabrics' },
    { type: 'text', value: 'Cashmere' },
    { type: 'text', value: 'Silk' },
    { type: 'text', value: 'Wool' },
  ];
  const wrapperClass = embedded
    ? 'overflow-hidden bg-transparent'
    : 'my-12 overflow-hidden border-y border-[var(--brand-bg-exact)] bg-transparent';

  return (
    <div className={wrapperClass}>
      <motion.div
        className="flex gap-16 whitespace-nowrap py-4 text-sm tracking-widest uppercase"
        style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.2em' }}
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      >
        {[...items, ...items, ...items, ...items].map((item, i) => (
          item.type === 'text' ? (
            <span key={`t-${i}`} className="text-white/90">{item.value}</span>
          ) : (
            <img key={`i-${i}`} src={item.src} alt={item.alt} className="h-5 md:h-6 w-auto opacity-90" />
          )
        ))}
      </motion.div>
    </div>
  );
}


