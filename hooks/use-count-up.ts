'use client'

import { useState, useEffect } from 'react'

export function useCountUp(target: number, isInView: boolean = true) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return

    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current += increment
      if (step >= steps) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.round(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [target, isInView])

  return count
}