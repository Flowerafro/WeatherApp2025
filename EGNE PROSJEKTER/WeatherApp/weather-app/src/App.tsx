import { useState } from 'react'
import './App.css'
import { getCoordinates } from './services/geoCodingService'
import { fetchWeatherData } from './services/weatherService'
import { getWeatherKey } from './utils/weatherMapper'
import activityList from './constants/activities.json'
import { SearchBar } from './Components/SearchBar'
import { WeatherCard } from './Components/WeatherCard'
import { WeatherDock } from './Components/WeatherDock'

const activities = activityList as Record<string, string>;

function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');

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
      const weatherData = await fetchWeatherData(coords.lat, coords.lon);

      setWeather(weatherData);

      const weatherKey = getWeatherKey(weatherData);
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

  return (
    <div className={`app-container ${view === 'landing' ? 'landing-mode' : 'dashboard-mode'}`}>

      {/* Landing View */}
      {view === 'landing' ? (
        <>
          <h1 className="landing-title">Check out the weather</h1>
          <SearchBar onSearch={handleSearch} loading={loading} />
          {error && <p style={{ color: '#ff6b6b', marginTop: '1rem', position: 'absolute', bottom: '20%' }}>{error}</p>}
        </>
      ) : (
        /* Dashboard Layout */
        <>
          {/* Header: Top Left */}
          <div className="dashboard-header">
            <h1>{displayedCity}</h1>
            <SearchBar onSearch={handleSearch} loading={loading} small={true} placeholder="Search city..." />
          </div>

          {/* Main Center Viewport - Card High-Top-Left */}
          <div className="dashboard-main">
            <WeatherCard weather={weather} activity={activity} location={displayedCity} />
          </div>

          {/* Data Dock */}
          <WeatherDock weather={weather} />
        </>
      )}
    </div>
  )
}

export default App
