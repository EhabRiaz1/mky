// src/components/FAQ.tsx
import React, { useState } from 'react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'shipping' | 'returns' | 'products' | 'account' | 'general';
}

const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | FAQItem['category']>('all');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const faqData: FAQItem[] = [
    // Shipping FAQs
    {
      id: 'shipping-1',
      question: 'What are your shipping options and delivery times?',
      answer: 'We offer complimentary express shipping worldwide. UK orders are delivered next business day if placed before 2:00 PM GMT. International orders typically take 3-7 business days depending on the destination. All orders are processed within 1-2 business days.',
      category: 'shipping'
    },
    {
      id: 'shipping-2',
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. International shipping is complimentary and typically takes 3-7 business days. Please note that customers are responsible for any customs fees or import duties in their country.',
      category: 'shipping'
    },
    {
      id: 'shipping-3',
      question: 'How can I track my order?',
      answer: 'Once your order ships, you will receive a tracking number via email. You can also track your order by logging into your account on our website or using the tracking tool on our shipping page.',
      category: 'shipping'
    },
    {
      id: 'shipping-4',
      question: 'What is your white-glove delivery service?',
      answer: 'Our white-glove service includes personal delivery, unpacking, and setup of your items. This premium service is available by appointment and includes additional care instructions for delicate items.',
      category: 'shipping'
    },

    // Returns FAQs
    {
      id: 'returns-1',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy from the delivery date. Items must be unworn, unwashed, and in original condition with all tags attached. We provide complimentary returns for UK customers.',
      category: 'returns'
    },
    {
      id: 'returns-2',
      question: 'How do I initiate a return?',
      answer: 'You can start a return through our returns portal using your order number. Simply select the items you wish to return, choose your reason, and print the prepaid return label. Our system will guide you through the entire process.',
      category: 'returns'
    },
    {
      id: 'returns-3',
      question: 'How long does it take to process a refund?',
      answer: 'Refunds are processed within 5-7 business days after we receive your return at our warehouse. The refund will be issued to your original payment method. You will receive an email confirmation once the refund is processed.',
      category: 'returns'
    },
    {
      id: 'returns-4',
      question: 'Can I exchange an item instead of returning it?',
      answer: 'Yes, we offer exchanges for different sizes or colors of the same item. During the return process, you can select the exchange option and choose your preferred alternative. If the exchange item is more expensive, you will be charged the difference.',
      category: 'returns'
    },

    // Product FAQs
    {
      id: 'products-1',
      question: 'How do I care for my MKY garments?',
      answer: 'Each garment comes with specific care instructions. Generally, we recommend dry cleaning for wool and silk items, and cold gentle washing for cotton pieces. Always check the care label and avoid excessive heat or harsh chemicals.',
      category: 'products'
    },
    {
      id: 'products-2',
      question: 'Do you offer bespoke or custom tailoring?',
      answer: 'Yes, we offer bespoke tailoring services through our personal concierge. This includes custom measurements, fabric selection, and personalized styling. Please contact our concierge team to schedule a consultation.',
      category: 'products'
    },
    {
      id: 'products-3',
      question: 'What materials do you use in your collections?',
      answer: 'We source the finest materials from around the world, including Italian wool, Egyptian cotton, Japanese denim, and French silk. All materials are carefully selected for their quality, durability, and sustainability.',
      category: 'products'
    },
    {
      id: 'products-4',
      question: 'How do I determine my size?',
      answer: 'We provide detailed size guides for each product. For the best fit, we recommend referring to our measurement charts and comparing them to your own measurements. If you need assistance, our styling team is available to help.',
      category: 'products'
    },

    // Account FAQs
    {
      id: 'account-1',
      question: 'How do I create an account?',
      answer: 'You can create an account during checkout or by visiting the account registration page. Having an account allows you to track orders, save your preferences, and receive personalized recommendations.',
      category: 'account'
    },
    {
      id: 'account-2',
      question: 'I forgot my password. How can I reset it?',
      answer: 'Click on "Forgot Password" on the login page and enter your email address. You will receive a password reset link via email. If you do not receive the email, please check your spam folder.',
      category: 'account'
    },
    {
      id: 'account-3',
      question: 'How do I update my account information?',
      answer: 'Log into your account and navigate to the "Account Settings" section. Here you can update your personal information, shipping addresses, payment methods, and communication preferences.',
      category: 'account'
    },

    // General FAQs
    {
      id: 'general-1',
      question: 'What is your sustainability policy?',
      answer: 'We are committed to sustainable luxury. This includes using eco-friendly materials, ethical manufacturing practices, carbon-neutral shipping, and recyclable packaging. We continuously work to reduce our environmental impact.',
      category: 'general'
    },
    {
      id: 'general-2',
      question: 'How can I contact customer service?',
      answer: 'You can reach our customer service team through our contact form, via email at concierge@mky-lifestyle.com, or by phone at +44 (0)20 7123 4567. Our team is available Monday to Friday, 9:00 AM to 6:00 PM GMT.',
      category: 'general'
    },
    {
      id: 'general-3',
      question: 'Do you offer gift wrapping and personal messages?',
      answer: 'Yes, we offer complimentary gift wrapping and can include a personalized message with your order. Simply select the gift wrapping option during checkout and add your message in the provided field.',
      category: 'general'
    },
    {
      id: 'general-4',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers for larger orders. All payments are processed securely through encrypted channels.',
      category: 'general'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Questions', count: faqData.length },
    { id: 'shipping', name: 'Shipping & Delivery', count: faqData.filter(item => item.category === 'shipping').length },
    { id: 'returns', name: 'Returns & Exchanges', count: faqData.filter(item => item.category === 'returns').length },
    { id: 'products', name: 'Products & Care', count: faqData.filter(item => item.category === 'products').length },
    { id: 'account', name: 'Account & Orders', count: faqData.filter(item => item.category === 'account').length },
    { id: 'general', name: 'General Information', count: faqData.filter(item => item.category === 'general').length }
  ];

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    const icons = {
      shipping: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
        </svg>
      ),
      returns: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      products: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      account: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      general: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    };
    return icons[category as keyof typeof icons];
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--brand-ink-exact)', color: 'var(--brand-bg-exact)' }}>
      {/* Hero Section */}
      <div className="relative py-20 md:py-28 border-b" style={{ borderColor: 'rgba(243, 231, 223, 0.1)' }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-light tracking-wide mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Frequently Asked Questions
          </h1>
          <p className="text-xl md:text-2xl opacity-80 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
            Find answers to common questions about shopping with MKY
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for answers..."
              className="w-full px-6 py-4 bg-transparent border rounded-lg focus:outline-none focus:border-opacity-100 transition-all duration-300 pl-12"
              style={{ borderColor: 'rgba(243, 231, 223, 0.3)', color: 'var(--brand-bg-exact)' }}
            />
            <svg 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-80" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 justify-center mb-16">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id as any)}
              className={`flex items-center space-x-3 px-6 py-3 border rounded-full transition-all duration-300 ${
                activeCategory === category.id 
                  ? 'bg-white bg-opacity-10 border-opacity-100' 
                  : 'border-opacity-30 hover:bg-white hover:bg-opacity-5'
              }`}
              style={{ borderColor: 'rgba(243, 231, 223, 0.3)' }}
            >
              <span className="opacity-80">
                {getCategoryIcon(category.id === 'all' ? 'general' : category.id)}
              </span>
              <span style={{ fontFamily: 'Inter, sans-serif' }}>{category.name}</span>
              <span 
                className={`px-2 py-1 rounded-full text-xs ${
                  activeCategory === category.id 
                    ? 'bg-white bg-opacity-20' 
                    : 'bg-white bg-opacity-10'
                }`}
              >
                {category.count}
              </span>
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 opacity-40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-light mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                No questions found
              </h3>
              <p className="opacity-80" style={{ fontFamily: 'Inter, sans-serif' }}>
                Try adjusting your search or browse different categories
              </p>
            </div>
          ) : (
            filteredFAQs.map((item) => (
              <div 
                key={item.id} 
                className="border rounded-lg transition-all duration-300 overflow-hidden"
                style={{ 
                  borderColor: openItems.has(item.id) 
                    ? 'rgba(243, 231, 223, 0.5)' 
                    : 'rgba(243, 231, 223, 0.2)',
                  backgroundColor: openItems.has(item.id) 
                    ? 'rgba(243, 231, 223, 0.05)' 
                    : 'transparent'
                }}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-6 text-left flex justify-between items-center hover:bg-white hover:bg-opacity-5 transition-all duration-300"
                >
                  <h3 
                    className="text-lg font-medium pr-8 flex-1 text-left"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {item.question}
                  </h3>
                  <svg 
                    className={`flex-shrink-0 w-5 h-5 opacity-80 transition-transform duration-300 ${
                      openItems.has(item.id) ? 'rotate-180' : ''
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {openItems.has(item.id) && (
                  <div 
                    className="px-6 pb-6"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <div 
                      className="prose prose-invert max-w-none opacity-80 leading-relaxed"
                      style={{ color: 'var(--brand-bg-exact)' }}
                    >
                      <p>{item.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Contact Support Section */}
        <div className="max-w-4xl mx-auto mt-20">
          <div className="bg-white bg-opacity-5 rounded-lg p-8 md:p-12 border text-center" style={{ borderColor: 'rgba(243, 231, 223, 0.2)' }}>
            <div className="w-16 h-16 border rounded-full flex items-center justify-center mx-auto mb-6" style={{ borderColor: 'rgba(243, 231, 223, 0.3)' }}>
              <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-light tracking-wide mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Still have questions?
            </h2>
            
            <p className="text-lg opacity-80 max-w-2xl mx-auto mb-8 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              Our dedicated concierge team is here to provide personalized assistance and answer any questions you may have.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-8 py-4 border rounded-sm hover:bg-white hover:bg-opacity-10 transition-all duration-300 tracking-wide uppercase font-medium"
                style={{ 
                  borderColor: 'rgba(243, 231, 223, 0.3)', 
                  color: 'var(--brand-bg-exact)',
                  fontFamily: 'Inter, sans-serif', 
                  letterSpacing: '0.1em' 
                }}
              >
                Contact Support
              </a>
              
              <a 
                href="tel:+442071234567" 
                className="inline-flex items-center justify-center px-8 py-4 border rounded-sm hover:bg-white hover:bg-opacity-10 transition-all duration-300 tracking-wide uppercase font-medium"
                style={{ 
                  borderColor: 'rgba(243, 231, 223, 0.3)', 
                  color: 'var(--brand-bg-exact)',
                  fontFamily: 'Inter, sans-serif', 
                  letterSpacing: '0.1em' 
                }}
              >
                Call +44 (0)20 7123 4567
              </a>
            </div>

            <div className="mt-8 pt-8 border-t" style={{ borderColor: 'rgba(243, 231, 223, 0.1)' }}>
              <p className="text-sm opacity-60" style={{ fontFamily: 'Inter, sans-serif' }}>
                Available Monday to Friday, 9:00 AM - 6:00 PM GMT
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;