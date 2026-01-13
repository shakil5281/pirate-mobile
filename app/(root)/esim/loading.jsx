'use client'

import { motion } from 'framer-motion'
import { Wifi, Signal, Smartphone } from 'lucide-react'

export default function ESimLoading() {
  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 bottom-0 w-full h-full min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 flex items-center justify-center p-4 px-4 sm:px-6 lg:px-8 z-50"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center max-w-md w-full">
        {/* Animated eSIM Card */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mx-auto mb-6 sm:mb-8">
          {/* Outer Ring - Rotating */}
          <motion.div
            className="absolute inset-0 rounded-full border-3 sm:border-4 border-yellow-200 border-t-yellow-500"
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Middle Ring - Rotating Opposite */}
          <motion.div
            className="absolute inset-2 sm:inset-3 rounded-full border-3 sm:border-4 border-orange-200 border-t-orange-500"
            animate={{ rotate: -360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Inner Circle with SIM Icon */}
          <motion.div
            className="absolute inset-4 sm:inset-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Smartphone className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" strokeWidth={2} />
          </motion.div>
          
          {/* Floating Signal Waves */}
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [0.8, 1.8, 2.2],
                opacity: [0.6, 0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.4,
                ease: "easeOut"
              }}
            >
              <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full border-2 border-yellow-400" />
            </motion.div>
          ))}
        </div>

        {/* Animated Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="px-4"
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Loading eSIM Plans
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Finding the best connectivity options for you...
          </p>
        </motion.div>

        {/* Animated Feature Icons */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-8">
          {[
            { Icon: Signal, delay: 0 },
            { Icon: Wifi, delay: 0.2 },
            { Icon: Smartphone, delay: 0.4 }
          ].map(({ Icon, delay }, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: [0.3, 1, 0.3],
                y: [10, 0, 10]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay,
                ease: "easeInOut"
              }}
              className="p-2 sm:p-3 rounded-full bg-white shadow-md"
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
            </motion.div>
          ))}
        </div>

        {/* Loading Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
          {[0, 1, 2, 3].map((index) => (
            <motion.div
              key={index}
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Loading Status Text */}
        <motion.div
          className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Fetching data from server...
        </motion.div>
      </div>
    </motion.div>
  )
}

