'use client'
import { motion } from 'framer-motion';

export default function DownloadSection() {
  const downloadPath = "/downloads/CalcPro.exe"; // Replace with your actual path

  return (
    <section id="download" className="py-24 bg-gray-800 dark:bg-gray-900 text-white relative overflow-hidden">
      {/* Background elements (optional, adjust as needed) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-50"></div>
      <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-primary opacity-10 rotate-45"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.h2 
          className="text-3xl sm:text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Download CalcPro
        </motion.h2>
        
        <motion.p
          className="mt-4 text-lg text-gray-300 dark:text-gray-400 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Get the latest version of CalcPro for your Windows desktop. Simple, fast, and powerful.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.a
            href={downloadPath}
            download // This attribute triggers the download
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-10 py-4 rounded-lg bg-primary text-white text-lg font-semibold shadow-lg hover:bg-primary-dark transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Now (.exe)
          </motion.a>
        </motion.div>
        
        <motion.p
          className="mt-6 text-sm text-gray-400 dark:text-gray-500"
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5, delay: 0.3 }}
        >
          Requires Windows 7 or later.
        </motion.p>
      </div>
    </section>
  );
} 