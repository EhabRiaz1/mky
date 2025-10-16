import { motion } from 'framer-motion';

export default function Marquee() {
  const items = ['Maison MKY', 'Made in Italy', 'Silk', 'Wool', 'Leather'];
  return (
    <div className="mx-4 my-4 overflow-hidden border-2 border-[var(--brand-bg-exact)] rounded-[32px] bg-[rgba(38,19,21,0.90)] backdrop-blur">
      <motion.div
        className="flex gap-12 whitespace-nowrap py-3 text-sm tracking-wide"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} className="text-[var(--brand-ink-exact)]">{t}</span>
        ))}
      </motion.div>
    </div>
  );
}


