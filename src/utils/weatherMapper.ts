export interface WeatherData {
    current: {
        weather_code: number;
        wind_speed_10m: number;
        rain: number;
        showers: number;
        snowfall: number;
        time: Date | string; // Handle both Date objects and string types if needed
    };
}

export const getWeatherKey = (weather: WeatherData, isDay: boolean): string => {
    // 1. Condition (WMO codes)
    const code = weather.current.weather_code;
    let condition = "sunny"; // default

    if (code === 0 || code === 1) {
        if (!isDay) condition = "clear-night";
        else condition = "sunny";
    }
    else if (code === 2 || code === 3) condition = "cloudy";
    else if (code >= 40 && code <= 49) condition = "foggy";
    else if (code >= 50 && code <= 59) condition = "drizzle";
    else if ((code >= 60 && code <= 69) || (code >= 80 && code <= 84)) condition = "rainy";
    else if ((code >= 70 && code <= 79) || (code >= 85 && code <= 86)) condition = "snowy";
    else if (code >= 95 && code <= 99) condition = "thunder";

    // Windy override? (Example: if wind is very high, maybe condition becomes 'windy' 
    // or we just handle it via intensity. The prompt asked for 'windy' as a condition map, 
    // but WMO codes don't have a specific 'windy' code without precipitation usually, 
    // except perhaps contextually. Let's stick to clear WMO mappings for now, 
    // but if wind speed is extreme we could force 'windy'.)
    if (weather.current.wind_speed_10m > 30 && condition === "sunny") {
        condition = "windy";
    }

    // 2. Intensity (Light, Medium, Heavy)
    // Based on wind or precipitation amounts
    let intensity = "light";
    const windSpeed = weather.current.wind_speed_10m;
    const precip = weather.current.rain + weather.current.showers + weather.current.snowfall;

    if (windSpeed > 40 || precip > 5) {
        intensity = "heavy";
    } else if (windSpeed > 20 || precip > 1) {
        intensity = "medium";
    }

    // 3. Time of Day
    const date = new Date(weather.current.time);
    const hour = date.getHours();
    let timeOfDay = "night";

    if (hour >= 6 && hour < 12) timeOfDay = "morning";
    else if (hour >= 12 && hour < 18) timeOfDay = "noon";
    else if (hour >= 18 && hour < 24) timeOfDay = "evening";
    // else night (0-6)

    return `${condition}_${intensity}_${timeOfDay}`;
};
