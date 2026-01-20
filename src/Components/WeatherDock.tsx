import { HourlyForecast } from './HourlyForecast';
import { WeatherDetails } from './WeatherDetails';

interface WeatherDockProps {
    weather: any;
}

export const WeatherDock = ({ weather }: WeatherDockProps) => {
    return (
        <div className="data-dock">
            <HourlyForecast weather={weather} />
            <WeatherDetails weather={weather} />
        </div>
    );
};
