import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { HourlyForecast } from './HourlyForecast';
import { WeatherDetails } from './WeatherDetails';

interface WeatherDockProps {
    weather: any;
}

export const WeatherDock = ({ weather }: WeatherDockProps) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isDockOpen, setIsDockOpen] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia('(max-width: 600px)').matches);
        };

        checkMobile(); // Initial check

        const mediaQuery = window.matchMedia('(max-width: 600px)');
        mediaQuery.addEventListener('change', (e) => setIsMobile(e.matches));

        return () => mediaQuery.removeEventListener('change', (e) => setIsMobile(e.matches));
    }, []);

    // Desktop view or Mobile Open view
    const showDock = !isMobile || isDockOpen;

    return (
        <>
            {isMobile && (
                <button
                    className="dock-toggle-btn"
                    onClick={() => setIsDockOpen(!isDockOpen)}
                >
                    {isDockOpen ? 'Hide info' : 'See more info'}
                    {isDockOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                </button>
            )}

            <AnimatePresence>
                {showDock && (
                    <motion.div
                        className="data-dock"
                        initial={isMobile ? { y: '100%' } : { y: 0 }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <HourlyForecast weather={weather} />
                        <WeatherDetails weather={weather} />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
