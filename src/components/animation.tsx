'use client'

import { motion } from 'framer-motion'

const particleVariants = {
    animate: {
        x: [0, 20, -20, 0],
        y: [0, -10, 10, 0],
        opacity: [0.8, 0.9, 0.7],
        transition: {
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
}

const ParticleFlow = () => (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        {[...Array(30)].map((_, i) => (
            <motion.div
                key={i}
                variants={particleVariants}
                animate="animate"
                style={{
                    position: 'absolute',
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'rgba(180, 180, 180, 0.5)',
                    borderRadius: '50%',
                }}
            />
        ))}
    </div>
)

export default ParticleFlow
