'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

interface CityHeroProps {
  title: string
  imageUrl: string
}

export function CityHero({ title, imageUrl }: CityHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative h-[40vh] sm:h-[50vh] w-full"
    >
      {/* Background Image */}
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover"
        priority
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-background" />

      {/* City Title */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-6xl font-bold mb-2 sm:mb-4 text-white drop-shadow-lg"
          >
            {title}
          </motion.h1>
        </div>
      </div>
    </motion.div>
  )
}
