'use client'
import { motion } from 'framer-motion';

export default function ServicesSection() {
  const features = [
    {
      icon: '🔢',
      title: 'Advanced Functions',
      description: 'Perform complex calculations including trigonometry, logarithms, and more with ease.'
    },
    {
      icon: '📜',
      title: 'Calculation History',
      description: 'Keep track of your previous calculations with a detailed and accessible history log.'
    },
    {
      icon: '🎨',
      title: 'Custom Themes',
      description: 'Personalize your calculator experience with a variety of light and dark themes.'
    },
    {
      icon: '🖱️',
      title: 'Intuitive Interface',
      description: 'Enjoy a clean, uncluttered design that makes calculations quick and straightforward.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="services" className="py-24 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-70"></div>
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary opacity-10 rotate-45"></div>
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-secondary opacity-10 rotate-12"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            className="text-primary font-semibold tracking-wider uppercase text-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            What We Offer
          </motion.span>
          
          <motion.h2 
            className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Key Features
          </motion.h2>
          
          <motion.p
            className="mt-4 text-lg text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover the powerful features that make CalcPro the ideal calculator for Windows.
          </motion.p>
          
          <motion.div 
            className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mt-6"
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        </div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="card-hover bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-600"
            >
              <div className="p-8">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 