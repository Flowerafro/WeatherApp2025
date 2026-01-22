import { getWeatherKey } from '../utils/weatherMapper';
import { CloudRain, Snowflake, Cloud, CloudMoon, Sun, Moon, CloudLightning, Wind, CloudFog, CloudDrizzle } from 'lucide-react';

interface WeatherCardProps {
    weather: any;
    activity: string;
    location: string;
}

const getWeatherIcon = (condition: string, isDay: boolean) => {
    const props = { size: 64, strokeWidth: 1.5, style: { filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.4))' } };

    switch (condition) {
        case 'rainy': return <CloudRain {...props} color="#4FC3F7" />; // Light Blue
        case 'snowy': return <Snowflake {...props} color="#ADD8E6" />; // Ice Blue
        case 'cloudy': return isDay ? <Cloud {...props} color="#B0BEC5" /> : <CloudMoon {...props} color="#90A4AE" />; // Grey / Dark Grey
        case 'sunny': return isDay ? <Sun {...props} color="#FFD700" /> : <Moon {...props} color="#FFFACD" />; // Gold / Lemon Chiffon
        case 'thunder': return <CloudLightning {...props} color="#FFEB3B" />; // Yellow
        case 'windy': return <Wind {...props} color="#E0E0E0" />; // Light Grey
        case 'foggy': return <CloudFog {...props} color="#CFD8DC" />; // Blue Grey
        case 'drizzle': return <CloudDrizzle {...props} color="#81D4FA" />; // Light Blue
        case 'clear-night': return <Moon {...props} color="#FFFACD" />;
        default: return isDay ? <Sun {...props} color="#FFD700" /> : <Moon {...props} color="#FFFACD" />;
    }
};

export const WeatherCard = ({ weather, activity, location }: WeatherCardProps) => {
    if (!weather) return null;

    const isDay = weather.current.is_day === 1;
    const weatherKey = getWeatherKey(weather, isDay);

    // Extract main condition for icon mapping (e.g. "sunny" from "sunny_light_hot_day")
    const conditionKey = weatherKey.split('_')[0];

    const formattedCondition = weatherKey.split('_').slice(0, 2).reverse().join(' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

    return (
        <div className="glass-card main-weather-card">
            <div className="location-display" style={{
                textAlign: 'right',
                marginBottom: '10px',
                opacity: 0.9,
            }}>
                <span style={{
                    color: '#373734ff',
                    fontSize: '1rem',
                    fontWeight: '400',
                    fontFamily: 'Open Sans'
                }} >Current weather in:</span> <span style={{
                    fontWeight: '700',
                    fontSize: '2rem',
                    display: 'block',
                    color: '#484747ff',
                    fontFamily: 'Montserrat',
                    marginRight: '10px'
                }}>{location}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div className="main-temp">{Math.round(weather.current.temperature_2m)}°</div>
                <div className="weather-icon">
                    {getWeatherIcon(conditionKey, isDay)}
                </div>
            </div>

            <div className="main-condition">
                {formattedCondition}
            </div>

            <div className="main-activity" style={{
                textAlign: 'left',
                fontSize: '1rem',
                fontWeight: '400',
                fontFamily: 'Open Sans',
                letterSpacing: '1px'
            }}>
                "{activity}"
            </div>
        </div>
    );
};