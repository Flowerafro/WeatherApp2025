import { FiWind, FiEye } from 'react-icons/fi';
import { WiHumidity } from 'react-icons/wi';

interface WeatherDetailsProps {
    weather: any;
}

export const WeatherDetails = ({ weather }: WeatherDetailsProps) => {
    if (!weather) return null;

    const getMetric = (key: string): number | string => {
        if (!weather) return '-';

        if (key === 'humidity') return weather.current.relative_humidity_2m;
        if (key === 'wind') return weather.current.wind_speed_10m;

        // For hourly metrics (Visibility, UV), use index 0 as approximation for current
        const index = 0;

        if (key === 'vis') return weather.hourly.visibility[index];
        if (key === 'uv') return weather.hourly.uv_index[index];

        return '-';
    };

    const formatValue = (val: number | string) => {
        if (typeof val === 'number') {
            return val.toFixed(2);
        }
        return val;
    }

    // Specific UV Logic
    // 0: Grey/White | 1-2: Green | 3-5: Yellow-Green | 6-7: Yellow-Orange | 8-10: Red-Orange | 11+: Signal Red.
    const getUVColor = (uv: number) => {
        if (uv === 0) return '#e0e0e0'; // Grey/White
        if (uv <= 2) return '#00ff00'; // Green
        if (uv <= 5) return '#9acd32'; // Yellow-Green
        if (uv <= 7) return '#ffae00'; // Yellow-Orange
        if (uv <= 10) return '#ff4500'; // Red-Orange
        return '#ff0000'; // Signal Red
    };

    const uvValue = Number(getMetric('uv')) || 0;

    return (
        <div className="dock-section dock-right">
            <div className="metrics-grid">
                <div className="metric-item">
                    <span className="metric-label"><FiWind size={18} /> Wind</span>
                    <span className="metric-value">{formatValue(getMetric('wind'))} km/h</span>
                </div>
                <div className="metric-item">
                    <span className="metric-label"><WiHumidity size={24} /> Humidity</span>
                    <span className="metric-value">{formatValue(getMetric('humidity'))}%</span>
                </div>
                <div className="metric-item">
                    <span className="metric-label"><FiEye size={18} /> Visibility</span>
                    <span className="metric-value">{formatValue(Number(getMetric('vis')) / 1000)} km</span>
                </div>
                <div className="metric-item" style={{ alignItems: 'center' }}>
                    <span className="metric-label">UV Index</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="metric-value">{formatValue(uvValue)}</span>
                        <div
                            style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                backgroundColor: getUVColor(uvValue),
                                border: '1px solid rgba(255,255,255,0.4)',
                                boxShadow: '0 0 4px rgba(0,0,0,0.3)'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
