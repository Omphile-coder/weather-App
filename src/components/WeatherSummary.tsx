import { BsCloudSun } from "react-icons/bs";
import { WeatherWidget } from "./WeatherWidget";
import type { WeatherData } from "./types";

interface WeatherSummaryProps {
  weather: WeatherData;
  isMetric: boolean;
}

export const WeatherSummary = ({ weather, isMetric }: WeatherSummaryProps) => {
  const unit = isMetric ? "°C" : "°F";

  return (
    <WeatherWidget
      title="Weather Summary"
      icon={<BsCloudSun />}
      className="weather-summary"
    >
      <div className="summary-content">
        <p className="summary-condition">{weather.weather[0].description}</p>
        <div className="summary-temperature">
          {Math.round(weather.main.temp)}
          {unit}
        </div>
        <div className="summary-details">
          <span>
            H: {Math.round(weather.main.temp_max)}
            {unit}
          </span>

          <span>
            L:{Math.round(weather.main.temp_min)}
            {unit}
          </span>

          <span>Humidity: {weather.main.humidity}%</span>
        </div>
      </div>
    </WeatherWidget>
  );
};
