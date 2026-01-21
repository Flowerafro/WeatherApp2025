import { fetchWeatherApi } from "openmeteo";

export const fetchWeatherData = async (lat: number, lon: number) => {
    const params = {
        latitude: lat,
        longitude: lon,
        daily: ["weather_code", "sunrise", "sunset", "daylight_duration", "sunshine_duration", "uv_index_max", "temperature_2m_max", "temperature_2m_min", "snowfall_sum", "showers_sum", "rain_sum", "precipitation_sum", "uv_index_clear_sky_max", "precipitation_hours", "precipitation_probability_max", "wind_speed_10m_max", "wind_gusts_10m_max", "et0_fao_evapotranspiration"],
        hourly: ["relative_humidity_2m", "temperature_2m", "uv_index", "is_day", "sunshine_duration", "wind_speed_10m", "wind_speed_80m", "wind_direction_10m", "wind_direction_80m", "wind_gusts_10m", "temperature_80m", "temperature_120m", "visibility", "weather_code", "precipitation_probability", "rain", "showers", "snowfall", "cloud_cover", "cloud_cover_low", "cloud_cover_mid", "cloud_cover_high", "wind_speed_120m", "wind_speed_180m", "wind_direction_120m", "wind_direction_180m", "temperature_180m", "precipitation", "uv_index_clear_sky", "wet_bulb_temperature_2m", "cape", "lifted_index", "convective_inhibition", "freezing_level_height", "boundary_layer_height"],
        current: ["weather_code", "is_day", "temperature_2m", "relative_humidity_2m", "apparent_temperature", "precipitation", "showers", "rain", "snowfall", "cloud_cover", "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m"],
    };

    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const current = response.current()!;
    const hourly = response.hourly()!;
    const daily = response.daily()!;
    const sunrise = daily.variables(1)!;
    const sunset = daily.variables(2)!;

    const weatherData = {
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
            time: Array.from(
                { length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() },
                (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
            ),
            relative_humidity_2m: hourly.variables(0)!.valuesArray(),
            temperature_2m: hourly.variables(1)!.valuesArray(),
            uv_index: hourly.variables(2)!.valuesArray(),
            is_day: hourly.variables(3)!.valuesArray(),
            sunshine_duration: hourly.variables(4)!.valuesArray(),
            wind_speed_10m: hourly.variables(5)!.valuesArray(),
            wind_speed_80m: hourly.variables(6)!.valuesArray(),
            wind_direction_10m: hourly.variables(7)!.valuesArray(),
            wind_direction_80m: hourly.variables(8)!.valuesArray(),
            wind_gusts_10m: hourly.variables(9)!.valuesArray(),
            temperature_80m: hourly.variables(10)!.valuesArray(),
            temperature_120m: hourly.variables(11)!.valuesArray(),
            visibility: hourly.variables(12)!.valuesArray(),
            weather_code: hourly.variables(13)!.valuesArray(),
            precipitation_probability: hourly.variables(14)!.valuesArray(),
            rain: hourly.variables(15)!.valuesArray(),
            showers: hourly.variables(16)!.valuesArray(),
            snowfall: hourly.variables(17)!.valuesArray(),
            cloud_cover: hourly.variables(18)!.valuesArray(),
            cloud_cover_low: hourly.variables(19)!.valuesArray(),
            cloud_cover_mid: hourly.variables(20)!.valuesArray(),
            cloud_cover_high: hourly.variables(21)!.valuesArray(),
            wind_speed_120m: hourly.variables(22)!.valuesArray(),
            wind_speed_180m: hourly.variables(23)!.valuesArray(),
            wind_direction_120m: hourly.variables(24)!.valuesArray(),
            wind_direction_180m: hourly.variables(25)!.valuesArray(),
            temperature_180m: hourly.variables(26)!.valuesArray(),
            precipitation: hourly.variables(27)!.valuesArray(),
            uv_index_clear_sky: hourly.variables(28)!.valuesArray(),
            wet_bulb_temperature_2m: hourly.variables(29)!.valuesArray(),
            cape: hourly.variables(30)!.valuesArray(),
            lifted_index: hourly.variables(31)!.valuesArray(),
            convective_inhibition: hourly.variables(32)!.valuesArray(),
            freezing_level_height: hourly.variables(33)!.valuesArray(),
            boundary_layer_height: hourly.variables(34)!.valuesArray(),
        },
        daily: {
            time: Array.from(
                { length: (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval() },
                (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
            ),
            weather_code: daily.variables(0)!.valuesArray(),
            sunrise: [...Array(sunrise.valuesInt64Length())].map(
                (_, i) => new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000)
            ),
            sunset: [...Array(sunset.valuesInt64Length())].map(
                (_, i) => new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000)
            ),
            daylight_duration: daily.variables(3)!.valuesArray(),
            sunshine_duration: daily.variables(4)!.valuesArray(),
            uv_index_max: daily.variables(5)!.valuesArray(),
            temperature_2m_max: daily.variables(6)!.valuesArray(),
            temperature_2m_min: daily.variables(7)!.valuesArray(),
            snowfall_sum: daily.variables(8)!.valuesArray(),
            showers_sum: daily.variables(9)!.valuesArray(),
            rain_sum: daily.variables(10)!.valuesArray(),
            precipitation_sum: daily.variables(11)!.valuesArray(),
            uv_index_clear_sky_max: daily.variables(12)!.valuesArray(),
            precipitation_hours: daily.variables(13)!.valuesArray(),
            precipitation_probability_max: daily.variables(14)!.valuesArray(),
            wind_speed_10m_max: daily.variables(15)!.valuesArray(),
            wind_gusts_10m_max: daily.variables(16)!.valuesArray(),
            et0_fao_evapotranspiration: daily.variables(17)!.valuesArray(),
        },
    };

    return weatherData;
};