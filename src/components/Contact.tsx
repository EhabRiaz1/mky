// src/components/Contact.tsx
import React, { useState } from 'react';

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  type: 'general' | 'support' | 'wholesale' | 'complaint' | 'other';
};

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error('Please fill in all required fields');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessage({
        type: 'success',
        text: 'Thank you for your message. Our luxury concierge will respond within 24 hours.'
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        type: 'general'
      });

    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'Failed to send message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--brand-ink-exact)', color: 'var(--brand-bg-exact)' }}>
      {/* Hero Section */}
      <div className="relative py-20 md:py-28 border-b" style={{ borderColor: 'rgba(243, 231, 223, 0.1)' }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-light tracking-wide mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Contact MKY
          </h1>
          <p className="text-xl md:text-2xl opacity-80 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
            Begin your journey with luxury. Our personal concierge awaits your inquiry.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Luxury Contact Information */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-light tracking-wide mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
                Personal Concierge
              </h2>
              <p className="text-lg opacity-80 leading-relaxed mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
                Experience the MKY standard of service. Our dedicated team ensures every interaction reflects our commitment to excellence.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 border rounded-full flex items-center justify-center" style={{ borderColor: 'rgba(243, 231, 223, 0.3)' }}>
                  <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-light mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Flagship Atelier</h3>
                  <p className="opacity-80 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                    123 Savile Row<br />
                    Mayfair, London W1S 3ER<br />
                    United Kingdom
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 border rounded-full flex items-center justify-center" style={{ borderColor: 'rgba(243, 231, 223, 0.3)' }}>
                  <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-light mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>By Appointment</h3>
                  <p className="opacity-80 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                    +44 (0)20 7123 4567<br />
                    Monday to Friday, 9:00 - 18:00 GMT
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 border rounded-full flex items-center justify-center" style={{ borderColor: 'rgba(243, 231, 223, 0.3)' }}>
                  <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-light mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Concierge Service</h3>
                  <p className="opacity-80 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                    concierge@mky-lifestyle.com<br />
                    Response within 24 hours
                  </p>
                </div>
              </div>
            </div>

            {/* Service Commitment */}
            <div className="pt-8 border-t" style={{ borderColor: 'rgba(243, 231, 223, 0.1)' }}>
              <h3 className="text-xl font-light mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Our Commitment</h3>
              <ul className="space-y-3 opacity-80" style={{ fontFamily: 'Inter, sans-serif' }}>
                <li className="flex items-center space-x-3">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--brand-bg-exact)', opacity: 0.6 }}></span>
                  <span>Personalized style consultations</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--brand-bg-exact)', opacity: 0.6 }}></span>
                  <span>Worldwide complimentary delivery</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--brand-bg-exact)', opacity: 0.6 }}></span>
                  <span>Private appointments available</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--brand-bg-exact)', opacity: 0.6 }}></span>
                  <span>Lifetime garment care service</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Luxury Contact Form */}
          <div className="bg-white bg-opacity-5 rounded-lg p-8 md:p-12 border" style={{ borderColor: 'rgba(243, 231, 223, 0.2)' }}>
            <h2 className="text-3xl font-light tracking-wide mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
              Enquire Now
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm tracking-wide mb-3 opacity-80 uppercase" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-transparent border rounded-sm focus:outline-none focus:border-opacity-100 transition-all duration-300"
                    style={{ borderColor: 'rgba(243, 231, 223, 0.3)', color: 'var(--brand-bg-exact)' }}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm tracking-wide mb-3 opacity-80 uppercase" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-transparent border rounded-sm focus:outline-none focus:border-opacity-100 transition-all duration-300"
                    style={{ borderColor: 'rgba(243, 231, 223, 0.3)', color: 'var(--brand-bg-exact)' }}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm tracking-wide mb-3 opacity-80 uppercase" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-transparent border rounded-sm focus:outline-none focus:border-opacity-100 transition-all duration-300"
                    style={{ borderColor: 'rgba(243, 231, 223, 0.3)', color: 'var(--brand-bg-exact)' }}
                    placeholder="+44 (0)20 7123 4567"
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm tracking-wide mb-3 opacity-80 uppercase" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }}>
                    Inquiry Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-transparent border rounded-sm focus:outline-none focus:border-opacity-100 transition-all duration-300"
                    style={{ borderColor: 'rgba(243, 231, 223, 0.3)', color: 'var(--brand-bg-exact)' }}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="support">Personal Styling</option>
                    <option value="wholesale">Bespoke Commission</option>
                    <option value="complaint">Client Services</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm tracking-wide mb-3 opacity-80 uppercase" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }}>
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-transparent border rounded-sm focus:outline-none focus:border-opacity-100 transition-all duration-300"
                  style={{ borderColor: 'rgba(243, 231, 223, 0.3)', color: 'var(--brand-bg-exact)' }}
                  placeholder="Nature of your inquiry"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm tracking-wide mb-3 opacity-80 uppercase" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }}>
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-transparent border rounded-sm focus:outline-none focus:border-opacity-100 transition-all duration-300 resize-none"
                  style={{ borderColor: 'rgba(243, 231, 223, 0.3)', color: 'var(--brand-bg-exact)' }}
                  placeholder="Please share the details of your inquiry..."
                />
              </div>

              {message && (
                <div className={`p-4 rounded-sm border ${
                  message.type === 'success' 
                    ? 'border-green-400 text-green-400 bg-green-400 bg-opacity-5'
                    : 'border-red-400 text-red-400 bg-red-400 bg-opacity-5'
                }`}>
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-8 border rounded-sm hover:bg-white hover:bg-opacity-10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide uppercase font-medium"
                style={{ 
                  borderColor: 'rgba(243, 231, 223, 0.3)', 
                  color: 'var(--brand-bg-exact)',
                  fontFamily: 'Inter, sans-serif', 
                  letterSpacing: '0.1em' 
                }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Submit Enquiry'
                )}
              </button>

              <p className="text-sm opacity-60 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                * Required fields. Your privacy is paramount to us.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Additional Luxury Section */}
      <div className="border-t" style={{ borderColor: 'rgba(243, 231, 223, 0.1)' }}>
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h3 className="text-2xl font-light mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Experience the MKY Difference
          </h3>
          <p className="text-lg opacity-80 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
            From bespoke tailoring to personalized style consultations, discover why MKY represents the pinnacle of luxury craftsmanship.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;