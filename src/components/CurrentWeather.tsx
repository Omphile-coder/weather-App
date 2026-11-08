import type { DailyForecast, Temperature, WeatherData } from "./types";

interface CurrentWeatherProps {
  weather: WeatherData;
  today: DailyForecast;
  temperature: Temperature;
  isMetric: boolean;
}

// Shows the selected city, current conditions, and today's high and low in the dashboard header.
export const CurrentWeather = ({ weather, today, temperature, isMetric }: CurrentWeatherProps) => (
  <header className="main-header">
    <h1>{weather.name}</h1>
    <div className="current-temperature" aria-label={`${temperature(weather.main.temp)} ${isMetric ? "Celsius" : "Fahrenheit"}`}>
      {temperature(weather.main.temp)}
    </div>
    <p className="current-condition">{weather.weather[0].description}</p>
    <p className="current-range">H: {temperature(today.max)} &nbsp; L: {temperature(today.min)}</p>
  </header>
);
