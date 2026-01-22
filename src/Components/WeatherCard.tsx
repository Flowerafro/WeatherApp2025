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

    // Safe time parsing from SDK
    const displayTime = weather?.current?.time instanceof Date ? weather.current.time : new Date(weather?.current?.time);
    const isValidDate = !isNaN(displayTime.getTime());
    const formattedTime = isValidDate ? displayTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--';


    if (!weather) return null;

    const isDay = weather.current.is_day === 1;
    const weatherKey = getWeatherKey(weather, isDay);
    const formattedCondition = weatherKey.split('_').slice(0, 2).reverse().join(' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

    return (
        <div className="glass-card main-weather-card">
            <div className="local-clock">
                {formattedTime}
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
