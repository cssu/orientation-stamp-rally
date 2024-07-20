'use client'

import { motion } from 'framer-motion'

const CAREFULLY_CHOSEN_AWESOME_RANDOM_TOP_LEFT_RIGHT_VALUES_DONT_CHANGE_PLEASE_THANK_YOU_WHY_ARE_YOU_READING_THE_SOURCE_CODE =
    [
        [0.8737040903106228, 0.8115108063490928],
        [0.3990545823403904, 0.5879144962356713],
        [0.345785977298553, 0.6532067593963853],
        [0.3858377474750523, 0.3235692489756734],
        [0.9197048970435426, 0.15918178176223785],
        [0.9839737677615488, 0.08475980469517763],
        [0.8194524345757419, 0.42475159875462976],
        [0.15949911888963175, 0.031696712811131844],
        [0.1934506973707779, 0.10710598665885285],
        [0.37114184625809776, 0.2127670581097505],
        [0.5670859778047037, 0.42648467908502874],
        [0.7114205705534353, 0.3064903716003442],
        [0.7762974793197222, 0.8238147917009804],
        [0.4748945747493425, 0.8696955991094706],
        [0.5421103452991058, 0.9414851243616476],
        [0.22395494700995955, 0.09147451782073057],
        [0.9034499868133401, 0.4907713595346841],
        [0.29784963598078407, 0.17861760973224472],
        [0.3250073430638396, 0.19355694159186188],
        [0.8610760862067566, 0.759098909663759],
        [0.8256811859990703, 0.1965547964700476],
        [0.3006612872539878, 0.6364661288790208],
        [0.9208880689265568, 0.7961018693701059],
        [0.7156120050936903, 0.9086720442310914],
        [0.8960632955580266, 0.9904339241180187],
        [0.4317597702296765, 0.7909235178729128],
        [0.7388041139860073, 0.8118255997692674],
        [0.7219792353609022, 0.33246065774519473],
        [0.16405281619642165, 0.36708618751819655],
        [0.21260181181998905, 0.7354724220123263]
    ]

const particleVariants = {
    animate: {
        x: [0, 30, -30, 0],
        y: [0, -20, 20, 0],
        opacity: [0.8, 0.9, 0.7],
        transition: {
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
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
                    top: `${
                        CAREFULLY_CHOSEN_AWESOME_RANDOM_TOP_LEFT_RIGHT_VALUES_DONT_CHANGE_PLEASE_THANK_YOU_WHY_ARE_YOU_READING_THE_SOURCE_CODE[
                            i
                        ][0] * 100
                    }%`,
                    left: `${
                        CAREFULLY_CHOSEN_AWESOME_RANDOM_TOP_LEFT_RIGHT_VALUES_DONT_CHANGE_PLEASE_THANK_YOU_WHY_ARE_YOU_READING_THE_SOURCE_CODE[
                            i
                        ][1] * 100
                    }%`,
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'rgba(180, 180, 180, 0.5)',
                    borderRadius: '50%'
                }}
            />
        ))}
    </div>
)

export default ParticleFlow
