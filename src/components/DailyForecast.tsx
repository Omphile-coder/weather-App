import { BsCalendar3 } from "react-icons/bs";
import { WeatherWidget } from "./WeatherWidget";
import { WeatherIcon } from "./WeatherIcon";
import type { DailyForecast as DailyForecastItem } from "./types";

interface DailyForecastProps {
  forecast: DailyForecastItem[];
  getDayName: (date: string) => string;
}

export const DailyForecast = ({ forecast, getDayName }: DailyForecastProps) => {
  return (
    <WeatherWidget title="5-DAY FORECAST" icon={<BsCalendar3 />}>
      <div className="daily-list">
        {forecast.map((item, index) => (
          <div key={item.dt_txt} className="daily-item">
            <span className="daily-day">
              {index === 0 ? "Today" : getDayName(item.dt_txt)}
            </span>

            <span className="daily-icon">
              <WeatherIcon weather={item.weather} />
            </span>

            <div className="daily-temps">
              <span className="muted-text">{Math.round(item.min)}&deg;</span>

              <div className="temperature-bar" />

              <span>{Math.round(item.max)}&deg;</span>
            </div>
          </div>
        ))}
      </div>
    </WeatherWidget>
  );
};
