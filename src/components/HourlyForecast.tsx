import { FiClock } from "react-icons/fi";
import { WeatherWidget } from "./WeatherWidget";
import { WeatherIcon } from "./WeatherIcon";
import type { ForecastItem } from "./types";

interface HourlyForecastProps {
  forecast: ForecastItem[];
}

export const HourlyForecast = ({ forecast }: HourlyForecastProps) => {
  const hourlyForecast = forecast.slice(0, 8);

  return (
    <WeatherWidget
      className="span-two"
      title="HOURLY FORECAST"
      icon={<FiClock />}
    >
      <div className="hourly-scroll">
        {hourlyForecast.map((item) => (
          <div key={item.dt} className="hourly-item">
            <span>{new Date(item.dt * 1000).getHours()}:00</span>

            <span className="hourly-icon">
              <WeatherIcon weather={item.weather[0].main} />
            </span>

            <span>{Math.round(item.main.temp)}&deg;</span>
          </div>
        ))}
      </div>
    </WeatherWidget>
  );
};
