'use client'

import { animate, useInView, useIsomorphicLayoutEffect } from 'framer-motion'
import { useRef } from 'react'

// All credits go to https://www.youtube.com/watch?v=Q78i8TRIxMk
// and https://github.com/VladislavDegtyarenko/tutorial-animated-number-counter/blob/main/src/app/AnimatedCounter.tsx
export default function CountUp({
    start,
    end,
    duration,
}: Readonly<{
    start: number
    end: number
    duration: number
}>) {
    const ref = useRef<HTMLSpanElement>(null)
    const inView = useInView(ref, { once: true })

    useIsomorphicLayoutEffect(() => {
        const element = ref.current

        if (!element) return
        if (!inView) return

        // Set initial value
        element.textContent = String(start)

        // If reduced motion is enabled in system's preferences
        if (window.matchMedia('(prefers-reduced-motion)').matches) {
            element.textContent = String(end)
            return
        }

        const controls = animate(start, end, {
            duration: duration,
            ease: 'easeOut',
            onUpdate(value) {
                element.textContent = value.toFixed(0)
            },
        })

        // Cancel on unmount
        return () => {
            controls.stop()
        }
    }, [ref, inView, start, end, duration])

    if (!inView) return <span ref={ref}>{start}</span>

    return <span ref={ref} />
}
