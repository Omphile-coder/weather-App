import { useEffect, useState } from "react";
import axios from "axios";

import { SearchBar } from "./SearchBar";
import { SettingsControls } from "./SettingsControls";
import { SavedLocations } from "./SavedLocations";
import { CurrentWeather } from "./CurrentWeather";
import { HourlyForecast } from "./HourlyForecast";
import { DailyForecast } from "./DailyForecast";
import { WeatherDetails } from "./WeatherDetails";
import { LoadingWeather } from "./LoadingWeather";
import type {
  ForecastItem,
  WeatherData,
  DailyForecast as DailyForecastItem,
} from "./types";

const API_KEY = "0cc86d16bf572f78cdc96c096c7627e5";
const API_ENDPOINT = "https://api.openweathermap.org/data/2.5/";

export const DisplayWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastList, setForecastList] = useState<ForecastItem[]>([]);
  const [savedLocations, setSavedLocations] = useState<string[]>([]);
  const [searchCity, setSearchCity] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [isMetric, setIsMetric] = useState(true);
  const [theme, setTheme] = useState<"blue" | "dark">("blue");

  const saveLocationToLocal = (city: string) => {
    const updatedLocations = [...new Set([...savedLocations, city])];

    setSavedLocations(updatedLocations);
    localStorage.setItem("weatherLocations", JSON.stringify(updatedLocations));
  };

  const fetchAllWeatherData = async (query: string, isCoords = false) => {
    setIsLoading(true);

    const units = isMetric ? "metric" : "imperial";

    try {
      const currentUrl = isCoords
        ? `${API_ENDPOINT}weather?${query}&appid=${API_KEY}&units=${units}`
        : `${API_ENDPOINT}weather?q=${query}&appid=${API_KEY}&units=${units}`;

      const forecastUrl = isCoords
        ? `${API_ENDPOINT}forecast?${query}&appid=${API_KEY}&units=${units}`
        : `${API_ENDPOINT}forecast?q=${query}&appid=${API_KEY}&units=${units}`;

      const [currentRes, forecastRes] = await Promise.all([
        axios.get(currentUrl),
        axios.get(forecastUrl),
      ]);

      setWeatherData(currentRes.data);
      setForecastList(forecastRes.data.list);

      if (!isCoords) {
        saveLocationToLocal(currentRes.data.name);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const locations = localStorage.getItem("weatherLocations");

    if (locations) {
      setSavedLocations(JSON.parse(locations));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchAllWeatherData(`lat=${latitude}&lon=${longitude}`, true);
      },
      (error) => {
        console.error("Geolocation denied or failed.", error);
        fetchAllWeatherData("Polokwane");
      },
    );
  }, []);

  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  useEffect(() => {
    if (weatherData) {
      fetchAllWeatherData(`q=${weatherData.name}`);
    }
  }, [isMetric]);

  const handleSearch = () => {
    if (searchCity.trim() === "") {
      return;
    }

    fetchAllWeatherData(searchCity);
    setSearchCity("");
  };

  const formatTime = (unixTime: number) =>
    new Date(unixTime * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const getDayName = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
    });

  const processDailyForecast = (list: ForecastItem[]): DailyForecastItem[] => {
    const dailyData: Record<string, DailyForecastItem> = {};

    list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];

      if (!dailyData[date]) {
        dailyData[date] = {
          min: item.main.temp_min,
          max: item.main.temp_max,
          weather: item.weather[0].main,
          dt_txt: item.dt_txt,
        };
        return;
      }

      if (item.main.temp_min < dailyData[date].min) {
        dailyData[date].min = item.main.temp_min;
      }

      if (item.main.temp_max > dailyData[date].max) {
        dailyData[date].max = item.main.temp_max;
      }

      if (item.dt_txt.includes("12:00:00")) {
        dailyData[date].weather = item.weather[0].main;
      }
    });

    return Object.values(dailyData).slice(0, 5);
  };

  const dailyForecast = processDailyForecast(forecastList);

  return (
    <main className="app-container">
      <div className="controls-header">
        <SearchBar
          value={searchCity}
          onChange={setSearchCity}
          onSearch={handleSearch}
        />

        <SettingsControls
          isMetric={isMetric}
          theme={theme}
          onToggleUnit={() => setIsMetric((current) => !current)}
          onToggleTheme={() =>
            setTheme((current) => (current === "blue" ? "dark" : "blue"))
          }
        />
      </div>

      <SavedLocations
        locations={savedLocations}
        onSelectLocation={(city) => fetchAllWeatherData(`q=${city}`)}
      />

      {isLoading || !weatherData ? (
        <LoadingWeather />
      ) : (
        <>
          <CurrentWeather weather={weatherData} />

          <div className="dashboard-grid">
            <HourlyForecast forecast={forecastList} />

            <DailyForecast forecast={dailyForecast} getDayName={getDayName} />

            <WeatherDetails
              weather={weatherData}
              isMetric={isMetric}
              formatTime={formatTime}
            />
          </div>
        </>
      )}
    </main>
  );
};
