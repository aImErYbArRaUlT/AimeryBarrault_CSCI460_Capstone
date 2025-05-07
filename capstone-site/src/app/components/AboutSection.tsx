'use client'
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutSection() {
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      }
    })
  };

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-white dark:bg-gray-900">
      {/* Background decoration */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary opacity-5 rounded-full"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary opacity-5 rounded-full"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            className="text-primary font-semibold tracking-wider uppercase text-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            About CalcPro
          </motion.span>
          
          <motion.h2 
            className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Simple & Powerful
          </motion.h2>
          
          <motion.div 
            className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mt-4"
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-20"></div>
              <div className="relative h-full w-full rounded-2xl overflow-hidden">
                <Image
                  src="/assets/CalcAdd.png"
                  alt="CalcPro Screenshot"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-2xl" 
                />
              </div>
            </div>
          </motion.div>
          
          <div className="space-y-6">
            {[
              "CalcPro was built with a single goal: to provide a clean, efficient, and feature-rich calculator experience for Windows users.",
              "Tired of cluttered interfaces and basic functionality? CalcPro offers advanced mathematical functions, history tracking, customizable themes, and a user-friendly design.",
              "Whether you're a student, professional, or just need quick calculations, CalcPro is designed to be your go-to calculator."
            ].map((text, i) => (
              <motion.p 
                key={i}
                className="text-gray-600 dark:text-gray-300 text-lg"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUpVariants}
              >
                {text}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 