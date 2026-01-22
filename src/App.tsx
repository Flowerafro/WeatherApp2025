import { useState } from 'react'
import './App.css'
import { getCoordinates } from './services/geoCodingService'
import { fetchWeatherData } from './services/weatherService'
import { getWeatherKey } from './utils/weatherMapper'
import activityList from './constants/activities.json'
import { SearchBar } from './Components/SearchBar'
import { WeatherCard } from './Components/WeatherCard'
import { WeatherDock } from './Components/WeatherDock'
import WeatherScene from './Components/WeatherScene'

const activities = activityList as Record<string, string>;

function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [lat, setLat] = useState<number>(0);

  // displayedCity stores the location ONLY after a successful search.
  const [displayedCity, setDisplayedCity] = useState('');

  const [weather, setWeather] = useState<any>(null);
  const [activity, setActivity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (term: string) => {
    if (!term.trim()) return;

    setLoading(true);
    setError('');

    try {
      const coords = await getCoordinates(term);
      setLat(coords.lat);
      const weatherData = await fetchWeatherData(coords.lat, coords.lon);

      setWeather(weatherData);
      console.log('Current Time Data:', weatherData);

      const weatherKey = getWeatherKey(weatherData, weatherData.current.is_day === 1);
      console.log('Final Activity Key:', weatherKey);

      const matchedActivity = activities[weatherKey] || "Enjoy the weather!";
      setActivity(matchedActivity);

      setDisplayedCity(coords.name);

      setView('dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const validDate = weather?.current?.time ? new Date(weather.current.time) : new Date();

  return (
    <div className={`app-container ${view === 'landing' ? 'landing-mode' : 'dashboard-mode'}`}>
      {weather && (
        <WeatherScene
          weatherCode={weather.current.weather_code}
          isDay={weather.current.is_day === 1}
          time={validDate}
          windSpeed={weather.current.wind_speed_10m}
          precipitationAmount={weather.current.rain + weather.current.showers + weather.current.snowfall}
          cloudCover={weather.current.cloud_cover}
          lat={lat}
          apparentTemperature={weather.current.apparent_temperature}
          temperature={weather.current.temperature_2m}
        />
      )}
      {view === 'landing' ? (
        <>
          <h1 className="landing-title">What's the weather like?</h1>
          <SearchBar onSearch={handleSearch} loading={loading} />
          {error && <p style={{ color: '#ff6b6b', marginTop: '1rem', position: 'absolute', bottom: '20%' }}>{error}</p>}
        </>
      ) : (
        <>
          <div className="dashboard-header">
            <h1>{displayedCity}</h1>
            <SearchBar onSearch={handleSearch} loading={loading} small={true} placeholder="Search city..." />
          </div>
          <div className="dashboard-main">
            <WeatherCard weather={weather} activity={activity} location={displayedCity} />
          </div>
          <WeatherDock weather={weather} />
        </>
      )}
    </div>
  )
}

export default App
