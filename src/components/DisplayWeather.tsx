import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { TbLayoutSidebarLeftExpand, TbPlus } from "react-icons/tb";
import { TooltipButton } from "./TooltipButton";
import { SearchBar } from "./SearchBar";
import { SettingsControls } from "./SettingsControls";
import { SavedLocations } from "./SavedLocations";
import { CurrentWeather } from "./CurrentWeather";
import { HourlyForecast } from "./HourlyForecast";
import { fetchDetailedForecast } from "./detailedForecast";
import { DailyForecast } from "./DailyForecast";
import { WeatherDetails } from "./WeatherDetails";
import { WeatherMap } from "./WeatherMap";
import { LoadingWeather } from "./LoadingWeather";
import type { DailyForecast as DailyForecastItem, ForecastItem, HourlyWeather, WeatherData } from "./types";

const API_KEY = "0cc86d16bf572f78cdc96c096c7627e5";
const API_ENDPOINT = "https://api.openweathermap.org/data/2.5/";
const CACHE_KEY = "weatherDashboardMetric";
const DEFAULT_CITY = "Polokwane";

// Converts forecast timestamps to local dates so readings are grouped by the selected city's day.
const localDay = (timestamp: number, offset: number) =>
  new Date((timestamp + offset) * 1000).toISOString().slice(0, 10);

// Groups OpenWeather readings into five daily summaries when the detailed daily feed is unavailable.
function getDailyForecast(list: ForecastItem[], weather: WeatherData) {
  const today = localDay(weather.dt, weather.timezone);
  const days = new Map<string, DailyForecastItem>([
    [today, {
      day: today,
      min: weather.main.temp_min,
      max: weather.main.temp_max,
      weather: weather.weather[0].main,
    }],
  ]);

  for (const item of list) {
    const day = localDay(item.dt, weather.timezone);
    if (day < today) continue;
    const previous = days.get(day);
    const localHour = new Date((item.dt + weather.timezone) * 1000).getUTCHours();
    days.set(day, {
      day,
      min: Math.min(previous?.min ?? Infinity, item.main.temp_min),
      max: Math.max(previous?.max ?? -Infinity, item.main.temp_max),
      weather: !previous || (day !== today && localHour >= 11 && localHour < 14)
        ? item.weather[0].main
        : previous.weather,
    });
  }

  return Array.from(days.values()).slice(0, 5);
}

interface WeatherSnapshot {
  weather: WeatherData;
  forecast: ForecastItem[];
  aqi?: number;
  hourly?: HourlyWeather;
  daily?: DailyForecastItem[];
}

// Restores cached weather or saved cities and supplies a default if local storage cannot be read.
function readStorage<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback;
  } catch {
    return fallback;
  }
}

const views = ["Forecast", "Details", "Map"] as const;

// Coordinates weather requests, saved cities, and display settings for the dashboard panels.
export const DisplayWeather = () => {
  const [snapshot, setSnapshot] = useState(() => readStorage<WeatherSnapshot | null>(CACHE_KEY, null));
  const [savedLocations, setSavedLocations] = useState(() => readStorage<string[]>("weatherLocations", []));
  const [searchCity, setSearchCity] = useState("");
  const [isLoading, setIsLoading] = useState(!snapshot);
  const [isMetric, setIsMetric] = useState(true);
  const [theme, setTheme] = useState<"blue" | "dark">("blue");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [view, setView] = useState<(typeof views)[number]>("Forecast");
  const request = useRef<AbortController | null>(null);
  const weather = snapshot?.weather;

  // Keeps the saved-location drawer and the browser's stored list in sync.
  const updateLocations = (locations: string[]) => {
    setSavedLocations(locations);
    localStorage.setItem("weatherLocations", JSON.stringify(locations));
  };

  // Loads weather for a city or coordinates and cancels any older request.
  // Shares results with the dashboard cards and caches them for the next visit.
  const fetchWeather = useCallback(async (location: { q: string } | { lat: number; lon: number }) => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setIsLoading(true);

    const params = { ...location, appid: API_KEY, units: "metric" };
    const { signal } = controller;
    try {
      const [current, forecast] = await Promise.all([
        axios.get<WeatherData>(API_ENDPOINT + "weather", { params, signal, timeout: 10000 }),
        axios.get<{ list: ForecastItem[] }>(API_ENDPOINT + "forecast", { params, signal, timeout: 10000 }),
      ]);
      if (signal.aborted) return;

      const next: WeatherSnapshot = { weather: current.data, forecast: forecast.data.list };
      setSnapshot(next);
      setIsLoading(false);
      const [air, detailed] = await Promise.all([
        axios.get<{ list: { main: { aqi: number } }[] }>(
          API_ENDPOINT + "air_pollution",
          { params: { ...current.data.coord, appid: API_KEY }, signal, timeout: 6000 },
        ).then(({ data }) => data.list[0]?.main.aqi).catch(() => undefined),
        fetchDetailedForecast(current.data, signal).catch(() => undefined),
      ]);

      if (!signal.aborted) {
        const updated = { ...next, aqi: air, ...detailed };
        setSnapshot(updated);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
        } catch {
          // The dashboard can still display fresh data when storage is unavailable.
        }
      }
    } catch {
      if (!signal.aborted) {
        toast.error("Weather is unavailable for that location.");
      }
    } finally {
      if (!signal.aborted) setIsLoading(false);
    }
  }, []);

  // Loads the initial location and listens for changes in connectivity.
  useEffect(() => {
    let active = true;
    // Applies the geolocation result if the dashboard is still mounted and no search has started.
    const loadInitial = (location: { q: string } | { lat: number; lon: number }) => {
      if (active && !request.current) void fetchWeather(location);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => loadInitial({ lat: coords.latitude, lon: coords.longitude }),
        () => loadInitial({ q: DEFAULT_CITY }),
        { timeout: 5000 },
      );
    } else {
      queueMicrotask(() => loadInitial({ q: DEFAULT_CITY }));
    }

    // Tells the user that weather already on screen may be out of date.
    const offline = () => toast.error("You are offline. Weather may be out of date.");
    // Confirms that the browser has regained its network connection.
    const online = () => toast.success("Back online");
    window.addEventListener("offline", offline);
    window.addEventListener("online", online);
    // Cancels pending requests and removes browser listeners when the dashboard unmounts.
    return () => {
      active = false;
      request.current?.abort();
      request.current = null;
      window.removeEventListener("offline", offline);
      window.removeEventListener("online", online);
    };
  }, [fetchWeather]);

  // Applies the selected theme class so the stylesheet can switch the background.
  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  // Formats temperatures consistently across cards using the selected unit.
  const temperature = (celsius: number) => `${Math.round(isMetric ? celsius : celsius * 9 / 5 + 32)}°`;
  // Displays event times such as sunrise and sunset in the selected city's local time.
  const formatTime = (timestamp: number) =>
    new Date((timestamp + (weather?.timezone ?? 0)) * 1000).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "UTC",
    });

  // Submits the city entered in the search bar and clears the field.
  const handleSearch = () => {
    const q = searchCity.trim();
    if (!q) return;
    void fetchWeather({ q });
    setSearchCity("");
  };

  const dailyForecast = snapshot ? getDailyForecast(snapshot.forecast, snapshot.weather) : [];

  return (
    <main className="app-container">
      <div className="controls-header">
        <TooltipButton className="icon-button" tooltip="Open saved locations" aria-label="Open saved locations" aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen(true)}>
          <TbLayoutSidebarLeftExpand />
        </TooltipButton>
        <SearchBar value={searchCity} onChange={setSearchCity} onSearch={handleSearch} />
        {weather && (
          <TooltipButton className="icon-button" tooltip={`Save ${weather.name}`} aria-label={`Save ${weather.name}`} onClick={() => {
            updateLocations([...new Set([...savedLocations, weather.name])]);
            setIsMenuOpen(true);
          }}>
            <TbPlus />
          </TooltipButton>
        )}
        <SettingsControls
          isMetric={isMetric}
          theme={theme}
          onToggleUnit={() => setIsMetric((metric) => !metric)}
          onToggleTheme={() => setTheme((current) => current === "blue" ? "dark" : "blue")}
        />
      </div>

      <SavedLocations
        locations={savedLocations}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelectLocation={(q) => void fetchWeather({ q })}
        onDeleteLocation={(city) => updateLocations(savedLocations.filter((location) => location !== city))}
      />

      {snapshot && weather ? (
        <>
          <CurrentWeather weather={weather} today={snapshot.daily?.[0] ?? dailyForecast[0]} temperature={temperature} isMetric={isMetric} />
          <nav className="view-switch" aria-label="Weather panels">
            {views.map((name) => (
              <TooltipButton key={name} tooltip={`Show ${name.toLowerCase()}`} aria-pressed={name === view} onClick={() => setView(name)}>{name}</TooltipButton>
            ))}
          </nav>
          <div className="dashboard-grid" data-view={view} aria-busy={isLoading}>
            <HourlyForecast key={`${weather.coord.lat},${weather.coord.lon},${weather.dt},${Boolean(snapshot.hourly)}`} forecast={snapshot.forecast} hourly={snapshot.hourly} weather={weather} temperature={temperature} />
            <DailyForecast forecast={snapshot.daily?.slice(1) ?? dailyForecast} includesToday={!snapshot.daily} hasOpenMeteoData={Boolean(snapshot.hourly || snapshot.daily)} temperature={temperature} />
            <WeatherDetails
              weather={weather}
              isMetric={isMetric}
              temperature={temperature}
              formatTime={formatTime}
              aqi={snapshot.aqi}
            />
            <WeatherMap key={`${weather.coord.lat},${weather.coord.lon}`} weather={weather} temperature={temperature(weather.main.temp)} apiKey={API_KEY} />
          </div>
        </>
      ) : isLoading ? (
        <LoadingWeather />
      ) : (
        <div className="loading" role="status">
          <p>Weather is temporarily unavailable.</p>
          <TooltipButton tooltip="Retry loading weather" onClick={() => void fetchWeather({ q: DEFAULT_CITY })}>Try again</TooltipButton>
        </div>
      )}
    </main>
  );
};
