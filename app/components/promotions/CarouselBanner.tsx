import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  link: string;
  badge: string;
}

const MOCK_SLIDES: Slide[] = [
  {
    id: 'slide-1',
    title: 'THE SPRING COLLECTION',
    subtitle: 'Heritage Meets Modernity',
    description: 'Discover handcrafted shweshwe designs from our top Maboneng artisans. Limited units available for this season.',
    image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=1600',
    ctaText: 'Explore Collection',
    link: '/shop?category=Fashion',
    badge: 'Seasonal Drop'
  },
  {
    id: 'slide-2',
    title: 'ARTISAN SPOTLIGHT',
    subtitle: 'Soweto Gold Jewelry',
    description: 'Hand-carved legacy pieces inspired by the streets of Orlando West. Own a piece of history today.',
    image: 'https://images.unsplash.com/photo-1610492317734-d0370bcc645b?auto=format&fit=crop&q=80&w=1600',
    ctaText: 'Meet the Makers',
    link: '/vendors/v2',
    badge: 'Featured Vendor'
  },
  {
    id: 'slide-3',
    title: 'MIDNIGHT CRAFT SALE',
    subtitle: 'Flash Deals: 48H Only',
    description: 'Up to 40% off premium home decor, ceramics, and textiles. The golden hour of shopping is here.',
    image: 'https://images.unsplash.com/photo-1611486212330-9199b0c0bc3f?auto=format&fit=crop&q=80&w=1600',
    ctaText: 'View All Deals',
    link: '/deals',
    badge: 'Limited Time'
  }
];

const CarouselBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % MOCK_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + MOCK_SLIDES.length) % MOCK_SLIDES.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <div 
      className="relative h-[500px] md:h-[650px] w-full overflow-hidden rounded-[3rem] shadow-2xl bg-jozi-dark group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={MOCK_SLIDES[currentSlide].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image with Zoom Effect */}
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "linear" }}
            className="absolute inset-0"
          >
            <img 
              src={MOCK_SLIDES[currentSlide].image} 
              alt={MOCK_SLIDES[currentSlide].title}
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Gradients for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-jozi-dark/80 via-jozi-dark/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-jozi-dark/60 via-transparent to-transparent" />

          {/* Content Wrapper */}
          <div className="relative h-full container mx-auto px-8 md:px-20 flex flex-col justify-center items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center bg-jozi-gold text-jozi-dark px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl mb-6"
            >
              <Sparkles className="w-3 h-3 mr-2" />
              {MOCK_SLIDES[currentSlide].badge}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-jozi-gold font-black text-sm md:text-lg uppercase tracking-[0.3em] mb-2"
            >
              {MOCK_SLIDES[currentSlide].subtitle}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-8xl font-black text-white leading-none tracking-tighter mb-6"
            >
              {MOCK_SLIDES[currentSlide].title.split(' ').map((word, i) => (
                <span key={i} className="block">{word}</span>
              ))}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-jozi-cream/70 text-lg max-w-lg mb-10 font-medium leading-relaxed"
            >
              {MOCK_SLIDES[currentSlide].description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Link 
                to={MOCK_SLIDES[currentSlide].link}
                className="bg-white text-jozi-dark px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center hover:bg-jozi-gold transition-all shadow-2xl group/btn"
              >
                {MOCK_SLIDES[currentSlide].ctaText}
                <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute inset-x-8 bottom-12 flex justify-between items-center z-20 pointer-events-none md:pointer-events-auto">
        <div className="flex space-x-2">
          {MOCK_SLIDES.map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 transition-all rounded-full ${currentSlide === i ? 'w-12 bg-jozi-gold' : 'w-2 bg-white/20'}`}
            />
          ))}
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={prevSlide}
            className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-jozi-dark transition-all pointer-events-auto shadow-lg border border-white/20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-jozi-dark transition-all pointer-events-auto shadow-lg border border-white/20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarouselBanner;