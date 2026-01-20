import { fetchWeatherApi } from "openmeteo";

export const fetchWeatherData = async (lat: number, lon: number) => {
    const params = {
        latitude: lat,
        longitude: lon,
        timezone: "auto",
        current: [
            "weather_code", "is_day", "temperature_2m", "relative_humidity_2m",
            "apparent_temperature", "precipitation", "showers", "rain",
            "snowfall", "cloud_cover", "wind_speed_10m", "wind_direction_10m",
            "wind_gusts_10m"
        ],
        hourly: [
            "relative_humidity_2m", "temperature_2m", "uv_index", "is_day",
            "sunshine_duration", "wind_speed_10m", "wind_speed_80m",
            "wind_direction_10m", "wind_gusts_10m", "temperature_80m",
            "temperature_120m", "visibility", "weather_code",
            "precipitation_probability", "rain", "showers", "snowfall"
        ],
        daily: [
            "weather_code", "sunrise", "sunset", "daylight_duration",
            "sunshine_duration", "uv_index_max", "temperature_2m_max",
            "temperature_2m_min", "snowfall_sum", "showers_sum",
            "rain_sum", "precipitation_sum"
        ]
    };

    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];

    const utcOffsetSeconds = response.utcOffsetSeconds();
    const current = response.current()!;
    const hourly = response.hourly()!;
    const daily = response.daily()!;

    return {
        utcOffsetSeconds: utcOffsetSeconds,
        current: {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            weather_code: current.variables(0)!.value(),
            is_day: current.variables(1)!.value(),
            temperature_2m: current.variables(2)!.value(),
            relative_humidity_2m: current.variables(3)!.value(),
            apparent_temperature: current.variables(4)!.value(),
            precipitation: current.variables(5)!.value(),
            showers: current.variables(6)!.value(),
            rain: current.variables(7)!.value(),
            snowfall: current.variables(8)!.value(),
            cloud_cover: current.variables(9)!.value(),
            wind_speed_10m: current.variables(10)!.value(),
            wind_direction_10m: current.variables(11)!.value(),
            wind_gusts_10m: current.variables(12)!.value(),
        },
        hourly: {
            time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                (t) => new Date((t + utcOffsetSeconds) * 1000)
            ),
            relative_humidity_2m: hourly.variables(0)!.valuesArray()!,
            temperature_2m: hourly.variables(1)!.valuesArray()!,
            uv_index: hourly.variables(2)!.valuesArray()!,
            is_day: hourly.variables(3)!.valuesArray()!,
            sunshine_duration: hourly.variables(4)!.valuesArray()!,
            wind_speed_10m: hourly.variables(5)!.valuesArray()!,
            wind_speed_80m: hourly.variables(6)!.valuesArray()!,
            wind_direction_10m: hourly.variables(7)!.valuesArray()!,
            wind_gusts_10m: hourly.variables(8)!.valuesArray()!,
            temperature_80m: hourly.variables(9)!.valuesArray()!,
            temperature_120m: hourly.variables(10)!.valuesArray()!,
            visibility: hourly.variables(11)!.valuesArray()!,
            weather_code: hourly.variables(12)!.valuesArray()!,
            precipitation_probability: hourly.variables(13)!.valuesArray()!,
            rain: hourly.variables(14)!.valuesArray()!,
            showers: hourly.variables(15)!.valuesArray()!,
            snowfall: hourly.variables(16)!.valuesArray()!,
        },
        daily: {
            time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                (t) => new Date((t + utcOffsetSeconds) * 1000)
            ),
            weather_code: daily.variables(0)!.valuesArray()!,
            sunrise: daily.variables(1)!.valuesArray()!,
            sunset: daily.variables(2)!.valuesArray()!,
            daylight_duration: daily.variables(3)!.valuesArray()!,
            sunshine_duration: daily.variables(4)!.valuesArray()!,
            uv_index_max: daily.variables(5)!.valuesArray()!,
            temperature_2m_max: daily.variables(6)!.valuesArray()!,
            temperature_2m_min: daily.variables(7)!.valuesArray()!,
            snowfall_sum: daily.variables(8)!.valuesArray()!,
            showers_sum: daily.variables(9)!.valuesArray()!,
            rain_sum: daily.variables(10)!.valuesArray()!,
            precipitation_sum: daily.variables(11)!.valuesArray()!,
        }
    };
};

const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);