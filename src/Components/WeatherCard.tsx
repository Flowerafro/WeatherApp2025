import { useEffect, useState } from 'react';
import { getWeatherKey } from '../utils/weatherMapper';

interface WeatherCardProps {
    weather: any;
    activity: string;
    location: string;
}

export const WeatherCard = ({ weather, activity }: WeatherCardProps) => {
    // Note: 'location' prop is intentionally unused here if the user wanted it in the Header instead.
    // However, the prompt says "Main Card ... with Temp, Condition, Suggested Activity, and a new Local Clock".
    // AND "Top-Left Header: Location name and search bar". 
    // So the Location Name (H2) I added previously should likely be REMOVED from here and controlled by App.tsx in the header.
    // I will remove the 'location' h2 from here to strictly follow "Top-Left Header: Location name and search bar".

    const [localTime, setLocalTime] = useState<string>('');

    useEffect(() => {
        if (!weather) return;

        const updateTime = () => {
            // weather.utcOffsetSeconds is the offset in seconds from UTC.
            // We want to display the current time in that timezone.

            // Current UTC time in ms
            const now = new Date();
            const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);

            // Target city time
            const cityTime = new Date(utcMs + (weather.utcOffsetSeconds * 1000));

            setLocalTime(cityTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000); // Update every second

        return () => clearInterval(interval);
    }, [weather]);

    if (!weather) return null;

    const weatherKey = getWeatherKey(weather);
    const formattedCondition = weatherKey.split('_').slice(0, 2).reverse().join(' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

    return (
        <div className="glass-card main-weather-card">
            {/* Clock at the top-right of the card or just top */}
            <div className="local-clock" style={{ fontSize: '1.2rem', fontWeight: 500, opacity: 0.8, marginBottom: '1rem', textAlign: 'right' }}>
                {localTime}
            </div>

            <div className="main-temp">{Math.round(weather.current.temperature_2m)}°</div>
            <div className="main-condition">
                {formattedCondition}
            </div>
            <div className="main-activity">
                "{activity}"
            </div>
        </div>
    );
};
