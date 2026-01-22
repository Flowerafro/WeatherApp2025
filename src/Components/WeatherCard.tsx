import { getWeatherKey } from '../utils/weatherMapper';

interface WeatherCardProps {
    weather: any;
    activity: string;
    location: string;
}

export const WeatherCard = ({ weather, activity, location }: WeatherCardProps) => {
    if (!weather) return null;

    const isDay = weather.current.is_day === 1;
    const weatherKey = getWeatherKey(weather, isDay);

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

            <div className="main-temp">{Math.round(weather.current.temperature_2m)}°</div>

            <div className="main-condition">
                {formattedCondition}
            </div>

            <div className="main-activity" style={{
                textAlign: 'center',
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