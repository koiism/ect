import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container min-h-[80vh] flex items-center justify-center py-10 md:py-28">
      <div className="text-center">
        <div className="prose mx-auto">
          <h1 style={{ marginBottom: 0 }}>404</h1>
          <p className="mb-4">This page could not be found.</p>
        </div>
        <Button asChild variant="default" className="mt-4">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  )
}
