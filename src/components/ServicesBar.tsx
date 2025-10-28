import { motion } from 'framer-motion';

export default function ServicesBar() {
  const services = [
    {
      title: 'Complimentary Shipping',
      description: 'Free express delivery on all orders',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      )
    },
    {
      title: 'Personalisation',
      description: 'Bespoke monogramming available',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      title: 'Expert Care',
      description: 'Lifetime product care & repairs',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-16 border-t border-b" style={{ borderColor: 'rgba(38,19,21,0.1)' }}>
      <div className="mb-10 text-center">
        <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-3" style={{ color: 'var(--brand-bg-exact)' }}>
          Maison MKY Services
        </h2>
        <p className="text-base max-w-2xl mx-auto" style={{ color: 'rgba(38,19,21,0.7)' }}>
          We offer an array of tailored services — including complimentary shipping, bespoke personalisation, and lifetime product care.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {services.map((service, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex justify-center mb-4" style={{ color: 'var(--brand-bg-exact)' }}>
              {service.icon}
            </div>
            <h3 className="text-lg font-medium mb-2 tracking-wide" style={{ color: 'var(--brand-bg-exact)' }}>
              {service.title}
            </h3>
            <p className="text-sm" style={{ color: 'rgba(38,19,21,0.6)' }}>
              {service.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

