'use client'
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden">
      {/* Content Grid - Applying min-h-screen here */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-screen">
        {/* Left Column (Text Content) */}
        <div className="md:col-span-7 bg-white text-center md:text-left relative flex flex-col justify-center p-12 md:p-24">
           {/* Subtle grid pattern for left column */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center z-0 opacity-10"></div>
          
          {/* Ensure content is above the pattern */}
          <div className="relative z-10">
            <motion.h2 
              className="text-base font-semibold text-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Welcome to
            </motion.h2>
            
            <motion.h1 
              className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="block">CalcPro</span>
              <span className="block text-gray-700">for Windows</span>
            </motion.h1>
            
            <motion.p 
              className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto md:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              The most intuitive and powerful calculator for your Windows desktop. 
              Streamline your calculations with a clean interface and advanced features.
            </motion.p>
            
            <motion.div 
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-lg bg-transparent text-primary font-medium border border-primary hover:bg-primary hover:text-white transition duration-300"
              >
                Download Now
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-lg bg-transparent text-primary font-medium border border-primary hover:bg-primary hover:text-white transition duration-300"
              >
                Features
              </motion.button>
            </motion.div>
          </div>
        </div>
        
        {/* Right Column (Image) */}
        {/* TODO: Add circuit pattern background image here */}
        <div className="md:col-span-5 bg-black flex justify-center items-center p-12 relative"> 
           {/* Placeholder for circuit pattern - you might apply it via background-image */}
           {/* <div className="absolute inset-0 bg-[url('/path/to/circuit-pattern.png')] opacity-20 z-0"></div> */}
           
          <motion.div 
            className="relative z-10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="relative w-full max-w-sm md:max-w-xs rounded-lg overflow-hidden shadow-2xl">
              {/* Optional decorative glow - adjust as needed */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-20"></div> 
              <Image
                src="/assets/CalcPowerAdd.png"
                alt="CalcPro Power Features Screenshot"
                width={500} 
                height={400} 
                className="relative rounded-lg w-full h-auto object-contain"
              />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator - Keep at bottom relative to section */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
          <motion.div 
            className="w-1.5 h-1.5 bg-white rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>
      </motion.div>
    </section>
  );
} 