'use client'

import { motion } from 'framer-motion'
import { City, ProductSearch } from '@/payload-types'
import { LoadMoreProducts } from '@/components/products/LoadMoreProducts'

interface CityContentProps {
  title: string
  city: City
  initialProducts: ProductSearch[]
  hasMoreProducts: boolean
  loadMoreLimit?: number
}

export function CityContent({ title, city, initialProducts, hasMoreProducts, loadMoreLimit = 8 }: CityContentProps) {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {/* Decorative Line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '6rem' }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="h-1 mb-4 sm:mb-8 rounded-full bg-primary/50"
        />

        {/* City Description */}
        <div className="prose prose-sm sm:prose-lg max-w-none">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-base sm:text-xl text-muted-foreground"
          >
            Explore the unique charm of {title}...
          </motion.p>
        </div>

        {/* Products Recommendation */}
        <div className="mt-8 sm:mt-16">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8">Featured Products</h2>
          <LoadMoreProducts
            initialProducts={initialProducts}
            initHasMore={hasMoreProducts}
            mode="auto"
            filterType="city"
            city={city}
            enableLoadMore="auto"
            loadMoreLimit={loadMoreLimit}
          />
        </div>
      </motion.div>
    </div>
  )
}
