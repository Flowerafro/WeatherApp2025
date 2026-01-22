export interface WeatherData {
    current: {
        weather_code: number;
        temperature_2m: number;
        wind_speed_10m: number;
        rain: number;
        showers: number;
        snowfall: number;
        time: Date | string;
    };
}

export const getWeatherKey = (weather: WeatherData, isDay: boolean): string => {
    // Condition (WMO codes)
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

    if (weather.current.wind_speed_10m > 30 && condition === "sunny") {
        condition = "windy";
    }

    // Temperature Level (NY LOGIKK)
    const temp = weather.current.temperature_2m;
    let tempLevel = "mild"; // 10°C til 25°C
    if (temp >= 25) tempLevel = "hot";
    else if (temp <= 0) tempLevel = "freezing";
    else if (temp < 10) tempLevel = "cold";

    // Intensity (Light, Medium, Heavy)
    // Based on wind or precipitation amounts
    let intensity = "light";
    const windSpeed = weather.current.wind_speed_10m;
    const precip = weather.current.rain + weather.current.showers + weather.current.snowfall;

    if (windSpeed > 40 || precip > 5) {
        intensity = "heavy";
    } else if (windSpeed > 20 || precip > 1) {
        intensity = "medium";
    }

    // Time of Day
    const date = new Date(weather.current.time);
    const hour = date.getHours();
    let timeOfDay = "night";

    if (hour >= 6 && hour < 10) timeOfDay = "morning";
    else if (hour >= 10 && hour < 14) timeOfDay = "noon";
    else if (hour >= 14 && hour < 21) timeOfDay = "evening";
    // else night (0-6)

    return `${condition}_${intensity}_${tempLevel}_${timeOfDay}`;
};
