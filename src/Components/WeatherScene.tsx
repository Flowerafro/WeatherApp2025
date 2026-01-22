import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { weatherSignatures } from '../constants/weatherSignatures';
import './WeatherScene.css';

interface WeatherSceneProps {
    weatherCode: number;
    isDay: boolean;
    time: Date;
    windSpeed: number;
    precipitationAmount: number;
    cloudCover: number;
    lat: number;
    apparentTemperature: number;
    temperature: number;
}

const WeatherScene: React.FC<WeatherSceneProps> = ({
    weatherCode,
    isDay,
    time,
    windSpeed,

    cloudCover,
    lat,
    apparentTemperature,
    temperature
}) => {
    console.log('WeatherScene Props:', { weatherCode, isDay, time, windSpeed });

    // Finn riktig visuell signatur basert på WMO-kode
    const signature = useMemo(() => {
        return weatherSignatures[weatherCode] || weatherSignatures[0];
    }, [weatherCode]);

    const timeOfDay = useMemo(() => {
        const hour = time.getHours();
        if (hour >= 6 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 18) return 'noon';
        if (hour >= 18 && hour < 22) return 'evening';
        return 'night';
    }, [time]);

    // --- 1. Dynamic Gradient Logic ---
    const skyGradient = useMemo(() => {
        // Bruk signatur-gradient hvis den finnes, ellers fallback til din tid-logikk
        if (signature.skyGradient && typeof signature.skyGradient === 'string') return signature.skyGradient;

        if (weatherCode >= 95) return isDay ? 'linear-gradient(to bottom, #232526, #414345)' : 'linear-gradient(to bottom, #0F1010, #2C2D2E)';
        if (weatherCode >= 70) return isDay ? 'linear-gradient(to bottom, #E6DADA, #274046)' : 'linear-gradient(to bottom, #1E2224, #394245)';
        if (!isDay) return 'linear-gradient(to bottom, #000428, #004e92)';

        switch (timeOfDay) {
            case 'morning': return 'linear-gradient(to bottom, #FFDEE9, #B5FFFC)';
            case 'noon': return 'linear-gradient(to bottom, #2980B9, #6DD5FA, #FFFFFF)';
            case 'evening': return 'linear-gradient(to bottom, #501575ff, #f55419ff)';
            default: return 'linear-gradient(to bottom, #2980B9, #6DD5FA)';
        }
    }, [weatherCode, timeOfDay, isDay, signature]);

    const finalSkyGradient = skyGradient || (isDay ? 'linear-gradient(to bottom, #2980B9, #6DD5FA)' : 'linear-gradient(to bottom, #000428, #004e92)');


    // --- 2. Lightning Logic ---
    const [showLightning, setShowLightning] = useState(false);
    useEffect(() => {
        if (signature.lightning) {
            const interval = setInterval(() => {
                if (Math.random() > 0.7) {
                    setShowLightning(true);
                    setTimeout(() => setShowLightning(false), 100 + Math.random() * 200);
                }
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [signature.lightning]);

    // --- 3. Aurora Logic ---
    const showAurora = !isDay && lat >= 60;

    // --- 4. Memoized Data for Particles (Performance) ---
    const cloudData = useMemo(() => {
        const cloudCount = Math.floor(cloudCover / 10);
        return Array.from({ length: cloudCount }).map((_, i) => ({
            id: i,
            duration: Math.max(20, 100 - windSpeed),
            top: Math.random() * 60,
            scale: 0.5 + Math.random() * 1.5,
            delay: -Math.random() * 100
        }));
    }, [cloudCover, windSpeed]);

    const precipData = useMemo(() => {
        const count = signature.particleCount || 0;
        return Array.from({ length: count }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            duration: signature.particleSpeed + Math.random() * 0.5,
            delay: Math.random() * 2,
            opacity: 0.3 + Math.random() * 0.4
        }));
    }, [weatherCode, signature]);

    const frostCrystals = useMemo(() => {
        return Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            top: Math.random() * 100,
            left: Math.random() * 100,
            size: Math.random() * 70 + 10,
            rotationDirection: Math.random() > 0.1 ? 360 : -360,
            duration: 10 + Math.random() * 25,
            delay: Math.random() * 5,
            opacity: 0.2 + Math.random() * 0.6
        }));
    }, []);

    // --- Render Methods ---
    const renderCelestialBodies = () => (
        <AnimatePresence>
            {isDay ? (
                <motion.div key="sun" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="celestial-body sun">
                    <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#FFD700" /></svg>
                </motion.div>
            ) : (
                <React.Fragment key="night">
                    <div className="stars-container">
                        {Array.from({ length: 50 }).map((_, i) => (
                            <motion.div key={i} className="star" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }} style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, position: 'absolute', width: '2px', height: '2px', background: 'white', borderRadius: '50%' }} />
                        ))}
                    </div>
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="celestial-body moon">
                        <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#FFFACD" /></svg>
                    </motion.div>
                </React.Fragment>
            )}
        </AnimatePresence>
    );

    const renderFrost = () => {
        if (apparentTemperature >= 0) return null;
        return (
            <div className="frost-overlay active">
                {frostCrystals.map(c => (
                    <motion.div key={c.id} className="ice-crystal" animate={{ opacity: [0.1, 0.4, 0.1], rotate: 360 }} transition={{ duration: c.duration, repeat: Infinity, ease: "linear" }} style={{ top: `${c.top}%`, left: `${c.left}%`, width: `${c.size}px`, height: `${c.size}px` }} />
                ))}
            </div>
        );
    };



    const renderAurora = () => (
        <div className="aurora-container" style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: 0.6, overflow: 'hidden' }}>
            <motion.div
                className="aurora-beam"
                style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(ellipse at center, rgba(0, 255, 128, 0.4) 0%, rgba(0, 128, 255, 0) 70%)',
                    filter: 'blur(60px)',
                    transform: 'rotate(20deg)',
                }}
                animate={{
                    transform: ['rotate(20deg) translateX(-10%)', 'rotate(25deg) translateX(10%)', 'rotate(20deg) translateX(-10%)'],
                    opacity: [0.4, 0.7, 0.4]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="aurora-beam-2"
                style={{
                    position: 'absolute',
                    top: '-30%',
                    left: '-20%',
                    width: '150%',
                    height: '150%',
                    background: 'radial-gradient(ellipse at center, rgba(144, 10, 255, 0.3) 0%, rgba(0, 128, 255, 0) 70%)',
                    filter: 'blur(50px)',
                    transform: 'rotate(-45deg)',
                }}
                animate={{
                    transform: ['rotate(-45deg) translateY(0%)', 'rotate(-35deg) translateY(10%)', 'rotate(-45deg) translateY(0%)'],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
            />
        </div>
    );

    const renderHeatWave = () => {
        const isHot = temperature >= 29;
        if (!isHot) return null;

        return (
            <motion.div
                className="heat-wave-overlay"
                animate={{
                    opacity: [0.2, 0.6, 0.2],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at 70% 100%, rgba(255, 140, 0, 0.71), transparent 40%)',
                    mixBlendMode: 'multiply',
                    filter: 'blur(30px)'
                }}
            />
        );
    };

    const renderLightning = () => (
        <AnimatePresence>
            {showLightning && (
                <>
                    <motion.div
                        className="lightning-flash-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.6, 0.2, 0.8, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'white',
                            zIndex: 25,
                            pointerEvents: 'none',
                            mixBlendMode: 'overlay'
                        }}
                    />
                    <motion.svg
                        viewBox="0 0 50 300"
                        className="lightning-bolt"
                        initial={{ opacity: 0, pathLength: 0 }}
                        animate={{ opacity: [0, 1, 0, 1, 0], pathLength: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: 'absolute',
                            top: '5%',
                            left: `${20 + Math.random() * 60}%`,
                            width: '100px',
                            height: '400px',
                            zIndex: 26,
                            filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 30px rgba(200, 220, 255, 0.6))',
                            overflow: 'visible',
                            pointerEvents: 'none'
                        }}
                    >
                        <motion.path
                            d="M30,0 L25,80 L35,80 L20,150 L30,150 L15,300"
                            stroke="white"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </motion.svg>
                </>
            )}
        </AnimatePresence>
    );

    return (
        <div className={`weather-scene-container ${temperature >= 29 ? 'heat-active' : ''}`} style={{
            filter: `contrast(${1 - signature.mistOpacity * 0.3})`,
            overflow: 'hidden',
            width: '100%',
            height: '100%',
            minWidth: '100vw',
            minHeight: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            inset: 0
        }}>
            <motion.div
                className="sky-background"
                animate={{ background: finalSkyGradient }}
                transition={{ duration: 2 }}
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: -1,
                    background: finalSkyGradient, // Forced explicit background to ensure immediate update
                    width: '100%',
                    height: '100%'
                }}
            />

            {renderCelestialBodies()}

            {/* Clouds */}
            {cloudData.map(cloud => (
                <motion.div key={cloud.id} className="cloud-organic" initial={{ x: -200 }} animate={{ x: '120vw' }} transition={{ duration: cloud.duration, repeat: Infinity, ease: "linear", delay: cloud.delay }} style={{ position: 'absolute', top: `${cloud.top}%`, zIndex: 5, opacity: signature.cloudOpacity, transform: `scale(${cloud.scale})`, filter: `blur(${signature.cloudBlur}px)` }}>
                    <svg width="300" height="120" viewBox="0 0 200 120" fill={isDay ? '#FFFFFF' : 'rgba(40, 40, 60, 0.85)'}>
                        <circle cx="50" cy="80" r="40" /><circle cx="90" cy="60" r="50" /><circle cx="140" cy="80" r="40" /><ellipse cx="100" cy="90" rx="80" ry="30" />
                    </svg>
                </motion.div>
            ))}

            {/* Precipitation */}
            {precipData.map(p => (
                <div key={p.id} className={signature.particleType} style={{ left: `${p.left}%`, animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`, opacity: p.opacity, zIndex: 6, height: signature.particleLength ? `${signature.particleLength}px` : undefined }} />
            ))}

            {renderFrost()}
            {showAurora && renderAurora()}
            {renderHeatWave()}
            {renderLightning()}
        </div>
    );
};

export default WeatherScene;