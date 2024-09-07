import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { StackedCarousel } from "react-card-stack-carousel";
import "react-card-stack-carousel/styles/styles.css";

const partnerData = [
    { name: 'CSSU', logo: 'cssu.svg'},
    { name: 'Partner 1', logo: '/logos/bacsa.jpg' },
    { name: 'Partner 2', logo: '/logos/cssa.jpg' },
    { name: 'Partner 3', logo: '/logos/dsc_utsg.png' },
    { name: 'Partner 4', logo: '/logos/gddc.webp' },
    { name: 'Partner 5', logo: '/logos/helloworld.png' },
    // Add more partners as needed
];


const PartnerCardStack = () => {
    const [isAutoplay, setIsAutoplay] = useState(true);
    const [lastInteraction, setLastInteraction] = useState(Date.now());

    const handleNavigation = useCallback(() => {
        setIsAutoplay(false);
        setLastInteraction(Date.now());
    }, []);

    useEffect(() => {
        const checkAutoplayResume = () => {
            const currentTime = Date.now();
            if (currentTime - lastInteraction > 5000) {
                setIsAutoplay(true);
            }
        };

        const intervalId = setInterval(checkAutoplayResume, 1000);

        return () => clearInterval(intervalId);
    }, [lastInteraction]);

    return (
        <div className="w-80 h-80">
            <StackedCarousel
                height="300"
                autoplay={isAutoplay}
                autoplayInterval={3000}
                scaleFactor={0.95}
                transitionDuration={800}
                verticalOffset={10}
                easingFunction="cubic-bezier(0.91, 0.01, 0.6, 0.99)"
                onNext={handleNavigation}
                onPrevious={handleNavigation}
            >
                {partnerData.map((partner, index) => (
                    <div key={index} className="border bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center">
                        <Image
                            src={partner.logo}
                            alt={`${partner.name} logo`}
                            width={200}
                            height={200}
                            className="object-contain mb-2"
                        />
                        <p className="text-center font-semibold">{partner.name}</p>
                    </div>
                ))}
            </StackedCarousel>
        </div>
    );
};

export default PartnerCardStack;