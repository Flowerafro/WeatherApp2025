import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './WeatherScene.css';

interface WeatherSceneProps {
    weatherCode: number;
    isDay: boolean;
    time: Date;
    windSpeed: number;
    precipitationAmount: number;
    cloudCover: number;
    lat: number;
}

const WeatherScene: React.FC<WeatherSceneProps> = ({
    weatherCode,
    isDay,
    time,
    windSpeed,
    precipitationAmount,
    cloudCover,
    lat
}) => {
    // Determine Time of Day strictly for gradient selection labels
    const timeOfDay = useMemo(() => {
        const hour = time.getHours();
        if (hour >= 6 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 18) return 'noon';
        if (hour >= 18 && hour < 22) return 'evening';
        return 'night';
    }, [time]);

    // --- 1. Dynamic Gradient Logic ---
    const getSkyGradient = (code: number, timePeriod: string, dayStatus: boolean) => {
        // HIERARCHY: Severe -> Precip -> Clear (Day/Night)

        // 1. Severe Weather (Thunder)
        if (code >= 95 && code <= 99) {
            return dayStatus
                ? 'linear-gradient(to bottom, #232526, #414345)' // Dark charcoal
                : 'linear-gradient(to bottom, #0F1010, #2C2D2E)'; // Deep purple-black (Night)
        }

        // 2. Precipitation (Snow)
        if ((code >= 70 && code <= 79) || (code >= 85 && code <= 86)) {
            return dayStatus
                ? 'linear-gradient(to bottom, #E6DADA, #274046)' // Whitish/Desaturated grey
                : 'linear-gradient(to bottom, #1E2224, #394245)'; // Darker snowy night
        }

        // 3. Precipitation (Rain/Drizzle/Cloudy)
        if ((code >= 50 && code <= 69) || (code >= 80 && code <= 84) || (code >= 1 && code <= 3) || (code >= 45 && code <= 49)) {
            if (!dayStatus) return 'linear-gradient(to bottom, #141E30, #243B55)'; // Night Rain
            return 'linear-gradient(to bottom, #3E5151, #DECBA4)'; // Day Rain (Grey-blue)
        }

        // 4. Clear Sky Fallback

        // Critical Fix: If API says Night, force Night Gradient regardless of local time hour
        if (!dayStatus) {
            return 'linear-gradient(to bottom, #000428, #004e92)'; // Deep midnight blue to black
        }

        // If API says Day, use time of day nuances
        switch (timePeriod) {
            case 'morning': return 'linear-gradient(to bottom, #FFDEE9 0%, #B5FFFC 100%)';
            case 'noon': return 'linear-gradient(to bottom, #2980B9, #6DD5FA, #FFFFFF)';
            case 'evening': return 'linear-gradient(to bottom, #501575ff, #f55419ff)';
            default: return 'linear-gradient(to bottom, #2980B9, #6DD5FA, #FFFFFF)';
        }
    };

    const skyGradient = useMemo(() => getSkyGradient(weatherCode, timeOfDay, isDay), [weatherCode, timeOfDay, isDay]);

    // --- 2. Lightning Logic ---
    const [showLightning, setShowLightning] = useState(false);
    useEffect(() => {
        if (weatherCode >= 95 && weatherCode <= 99) {
            const interval = setInterval(() => {
                // Random flash chance
                if (Math.random() > 0.7) {
                    setShowLightning(true);
                    setTimeout(() => setShowLightning(false), 200 + Math.random() * 300);
                }
            }, 3000); // Check every 3s
            return () => clearInterval(interval);
        } else {
            setShowLightning(false);
        }
    }, [weatherCode]);

    // --- 3. Aurora Logic ---
    // Aurora visible if night AND northern latitude (> 60 approx for demo)
    const showAurora = !isDay && lat >= 60;

    // --- Helpers ---
    // Fix: Cloud color logic from Figma
    const getCloudColor = () => isDay ? '#FFFFFF' : 'rgba(40, 40, 60, 0.85)';

    // --- Render Methods ---

    const renderCelestialBodies = () => {
        return (
            <AnimatePresence>
                {isDay ? (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 1 }}
                        className="celestial-body sun"
                        style={{ zIndex: 1 }}
                    >
                        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="40" fill="#FFD700" />
                        </svg>
                    </motion.div>
                ) : (
                    <>
                        {/* Stars */}
                        <div className="stars-container" style={{ zIndex: 0 }}>
                            {Array.from({ length: 50 }).map((_, i) => (
                                <motion.div
                                    key={`star-${i}`}
                                    className="star"
                                    initial={{ opacity: 0.2, scale: 0.5 }}
                                    animate={{
                                        opacity: [0.2, 1, 0.2],
                                        scale: [0.8, 1.2, 0.8]
                                    }}
                                    transition={{
                                        duration: 2 + Math.random() * 3,
                                        repeat: Infinity,
                                        delay: Math.random() * 2
                                    }}
                                    style={{
                                        top: `${Math.random() * 100}%`,
                                        left: `${Math.random() * 100}%`,
                                        position: 'absolute',
                                        width: '2px',
                                        height: '2px',
                                        background: 'white',
                                        borderRadius: '50%'
                                    }}
                                />
                            ))}
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            transition={{ duration: 1 }}
                            className="celestial-body moon"
                            style={{ zIndex: 1 }}
                        >
                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="50" r="40" fill="#FFFACD" />
                            </svg>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        );
    };

    const renderOrganicClouds = () => {
        const cloudCount = Math.floor(cloudCover / 10);
        if (cloudCount === 0) return null;

        const clouds = [];
        for (let i = 0; i < cloudCount; i++) {
            const duration = Math.max(20, 100 - windSpeed);
            const topPos = Math.random() * 60; // 0-60%
            const scale = 0.5 + Math.random() * 1.5;

            clouds.push(
                <motion.div
                    key={`cloud-organic-${i}`}
                    className="cloud-organic"
                    initial={{ x: -200 }}
                    animate={{ x: '120vw' }}
                    transition={{
                        duration: duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: -Math.random() * duration // Start at random positions
                    }}
                    style={{
                        position: 'absolute',
                        top: `${topPos}%`,
                        zIndex: 5,
                        opacity: 0.8,
                        transform: `scale(${scale})`
                    }}
                >
                    {/* Multi-puff Organic SVG */}
                    <svg width="200" height="120" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <filter id="cloud-blur" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
                            </filter>
                        </defs>
                        <g fill={getCloudColor()} filter="url(#cloud-blur)">
                            <circle cx="50" cy="80" r="40" />
                            <circle cx="90" cy="60" r="50" />
                            <circle cx="140" cy="80" r="40" />
                            <ellipse cx="100" cy="90" rx="80" ry="30" />
                        </g>
                    </svg>
                </motion.div>
            );
        }
        return clouds;
    };

    const renderAurora = () => {
        if (!showAurora) return null;
        return (
            <motion.div
                className="aurora-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 2 }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '60%',
                    zIndex: 8,
                    filter: 'blur(30px)',
                    background: 'linear-gradient(90deg, transparent, rgba(0, 255, 128, 0.3), rgba(148, 0, 211, 0.3), transparent)'
                }}
            >
                <motion.div
                    animate={{ x: [-100, 100], scaleY: [1, 1.5, 1] }}
                    transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
                    style={{ width: '100%', height: '100%' }}
                />
            </motion.div>
        );
    };

    const renderPrecipitation = () => {
        // Keep CSS for performance on particles, wrapped in simple check
        const isRainy = (weatherCode >= 50 && weatherCode <= 69) || (weatherCode >= 80 && weatherCode <= 84);
        const isSnowy = (weatherCode >= 70 && weatherCode <= 79) || (weatherCode >= 85 && weatherCode <= 86);

        if (!isRainy && !isSnowy) return null;

        const elements = [];
        const dropCount = Math.min(100, Math.floor(precipitationAmount * 30)) + 20;

        for (let i = 0; i < dropCount; i++) {
            const className = isRainy ? 'rain' : 'snow';
            const duration = isRainy ? 0.5 + Math.random() * 0.5 : 2 + Math.random() * 3;

            elements.push(
                <div
                    key={`precip-${i}`}
                    className={className}
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDuration: `${duration}s`,
                        animationDelay: `${Math.random() * 2}s`,
                        opacity: 0.3 + Math.random() * 0.5,
                        zIndex: 6 // Above clouds
                    }}
                />
            );
        }
        return elements;
    };

    return (
        <div className="weather-scene-container">
            <motion.div
                className="sky-background"
                animate={{ background: skyGradient }}
                transition={{ duration: 1.5 }}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}
            />

            {renderCelestialBodies()}
            {renderAurora()}
            {renderOrganicClouds()}
            {renderPrecipitation()}

            {/* Lightning */}
            <AnimatePresence>
                {showLightning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.8 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="lightning-flash"
                        style={{ zIndex: 25, background: 'white' }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default WeatherScene;
