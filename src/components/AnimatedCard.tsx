import { motion } from 'framer-motion';

export default function AnimatedCard({ children }: { children: any }) {
  return (
  <motion.div
    className="bg-white overflow-hidden"
    style={{ 
      border: 'none',
      borderRadius: '0'
    }}
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    whileHover={{ 
      opacity: 0.9,
      transition: { duration: 0.3, ease: "easeOut" }
    }}
  >
    {children}
  </motion.div>
  );
}


