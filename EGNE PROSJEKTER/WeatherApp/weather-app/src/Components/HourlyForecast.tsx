import { WiDaySunny, WiNightClear, WiSunrise, WiSunset } from 'react-icons/wi';

interface HourlyForecastProps {
    weather: any;
}

export const HourlyForecast = ({ weather }: HourlyForecastProps) => {
    if (!weather) return null;

    // Using standard Weather Icons as requested strict Io5 outlines were unavailable/incorrect
    const forecastTimes = [
        { label: 'Morning', hour: 9, Icon: WiSunrise },
        { label: 'Noon', hour: 13, Icon: WiDaySunny },
        { label: 'Evening', hour: 18, Icon: WiSunset },
        { label: 'Night', hour: 22, Icon: WiNightClear }
    ];

    const getForecast = (hour: number) => {
        // Find index for the specific hour today
        // The API returns strictly hourly data aligned to the hour.

        // We use getUTCHours because the time array is shifted by the offset, 
        // effectively making the "UTC" component match the wall clock hour.
        const index = weather.hourly.time.findIndex((t: Date) => t.getUTCHours() === hour);

        if (index === -1) return null;

        return {
            temp: weather.hourly.temperature_2m[index],
            code: weather.hourly.weather_code[index]
        };
    };

    const formatValue = (val: number) => val.toFixed(2);

    return (
        <div className="dock-section dock-left">
            {forecastTimes.map((item) => {
                const data = getForecast(item.hour);
                const Icon = item.Icon;
                return (
                    <div key={item.label} className="forecast-item">
                        <Icon size={30} style={{ opacity: 0.9 }} />
                        {/* Increased icon size slightly for Wi icons as they can be smaller */}
                        <span className="forecast-label">{item.label}</span>
                        <span className="forecast-temp">{data ? `${formatValue(data.temp)}°` : '--'}</span>
                    </div>
                )
            })}
        </div>
    );
};
