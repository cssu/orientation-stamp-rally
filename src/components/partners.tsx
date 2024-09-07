import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { StackedCarousel } from "react-card-stack-carousel";
import "react-card-stack-carousel/styles/styles.css";

const partnerData = [
    { name: "CSSU", logo: "../cssu.svg" },
    { name: "IEEE UofT", logo: "ieee.png" },
    { name: "UTGDDC", logo: "gddc.webp" },
    { name: "UTOSS", logo: "utoss.jpg" },
    { name: "UofT WiCS", logo: "wics.png" },
    { name: "UofT Esports", logo: "utes.jpg" },
    { name: "UTASR", logo: "utasr.jpg" },
    { name: "UoftHacks", logo: "uofthacks.png" },
    { name: "UofTCTF", logo: "uoftctf.png" },
    { name: "GDSC", logo: "dsc_utsg.png" },
    { name: "illuminaite UofT", logo: "illuminaite.jpg" },
    { name: "CSSA", logo: "cssa.jpg" },
    { name: "UTMIST", logo: "utmist.png" },
    { name: "UofT AI", logo: "uoft_ai.jpeg" },
    { name: "UofT Blueprint", logo: "uoftblueprint.jpeg" }
].map(partner => ({...partner, logo: `/logos/${partner.logo}`}));



const PartnerCardStack = () => {
    const [isAutoplay, setIsAutoplay] = useState(true);
    const [lastInteraction, setLastInteraction] = useState(Date.now());
    const [isMounted, setIsMounted] = useState(false); // New state to ensure component is mounted

    const handleNavigation = useCallback(() => {
        setIsAutoplay(false);
        setLastInteraction(Date.now());
    }, []);

    useEffect(() => {
        setIsMounted(true);  // Set mounted state to true when component is mounted

        const checkAutoplayResume = () => {
            const currentTime = Date.now();
            if (currentTime - lastInteraction > 2000) {
                setIsAutoplay(true);
            }
        };

        const intervalId = setInterval(checkAutoplayResume, 1000);

        return () => clearInterval(intervalId);
    }, [lastInteraction]);

    if (!isMounted) {
        return null;
    }

    return (
        <div className="w-80 h-80 relative">
            <StackedCarousel
                height="300"
                autoplay={isAutoplay}
                autoplayInterval={1000}
                scaleFactor={0.95}
                transitionDuration={400}
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
                            className="object-contain"
                        />
                        <p className="mt-2 text-center">{partner.name}</p>
                    </div>
                ))}
            </StackedCarousel>
        </div>
    );
};

export default PartnerCardStack;