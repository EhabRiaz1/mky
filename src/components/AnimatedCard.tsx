import { motion } from 'framer-motion';

export default function AnimatedCard({ children }: { children: any }) {
  return (
  <motion.div
    className="bg-white rounded-[32px] shadow-md overflow-hidden"
    style={{ 
      border: '2px solid var(--brand-bg-exact)',
      borderRadius: '32px'
    }}
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    whileHover={{ 
      y: -8, 
      boxShadow: '0 16px 30px rgba(0,0,0,0.12)',
      transition: { duration: 0.3, ease: "easeOut" }
    }}
  >
    {children}
  </motion.div>
  );
}


