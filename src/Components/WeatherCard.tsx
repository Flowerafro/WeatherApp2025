import { getWeatherKey } from '../utils/weatherMapper';

interface WeatherCardProps {
    weather: any;
    activity: string;
    location: string;
}

export const WeatherCard = ({ weather, activity }: WeatherCardProps) => {
    const displayTime = weather?.current?.time instanceof Date ? weather.current.time : new Date(weather?.current?.time);
    const isValidDate = !isNaN(displayTime.getTime());
    const formattedTime = isValidDate
        ? displayTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })
        : '--:--';


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
