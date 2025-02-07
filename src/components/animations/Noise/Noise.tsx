'use client'

import { useRef, useEffect } from 'react'
import { cn } from '@/utilities/cn'

interface NoiseProps {
  patternSize?: number
  patternScaleX?: number
  patternScaleY?: number
  patternRefreshInterval?: number
  patternAlpha?: number
  className?: string
}

const Noise = ({
  patternSize = 250,
  patternScaleX = 1,
  patternScaleY = 1,
  patternRefreshInterval = 2,
  patternAlpha = 15,
  className,
}: NoiseProps) => {
  const grainRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = grainRef.current!
    const ctx = canvas.getContext('2d')!
    let frame = 0

    const patternCanvas = document.createElement('canvas')
    patternCanvas.width = patternSize
    patternCanvas.height = patternSize
    const patternCtx = patternCanvas.getContext('2d')!
    const patternData = patternCtx.createImageData(patternSize, patternSize)
    const patternPixelDataLength = patternSize * patternSize * 4

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio
      canvas.height = window.innerHeight * window.devicePixelRatio

      ctx.scale(patternScaleX, patternScaleY)
    }

    const updatePattern = () => {
      for (let i = 0; i < patternPixelDataLength; i += 4) {
        const value = Math.random() * 255
        patternData.data[i] = value
        patternData.data[i + 1] = value
        patternData.data[i + 2] = value
        patternData.data[i + 3] = patternAlpha
      }
      patternCtx.putImageData(patternData, 0, 0)
    }

    const drawGrain = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = ctx.createPattern(patternCanvas, 'repeat') as CanvasPattern
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const loop = () => {
      if (frame % patternRefreshInterval === 0) {
        updatePattern()
        drawGrain()
      }
      frame++
      window.requestAnimationFrame(loop)
    }

    window.addEventListener('resize', resize)
    resize()
    loop()

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [patternSize, patternScaleX, patternScaleY, patternRefreshInterval, patternAlpha])

  return <canvas className={cn("absolute inset-0 w-full h-full z-[999]", className)} ref={grainRef} />
}

export default Noise
