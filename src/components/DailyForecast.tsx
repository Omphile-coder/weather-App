import { BsCalendar3 } from "react-icons/bs";
import { WeatherIcon } from "./WeatherIcon";
import type { DailyForecast as DailyForecastItem, Temperature } from "./types";

interface DailyForecastProps {
  forecast: DailyForecastItem[];
  temperature: Temperature;
  includesToday: boolean;
  hasOpenMeteoData: boolean;
}

const weekday = new Intl.DateTimeFormat(undefined, { weekday: "short", timeZone: "UTC" });

// Displays five forecast days with weather icons and temperature bars on a shared scale.
export const DailyForecast = ({ forecast, temperature, includesToday, hasOpenMeteoData }: DailyForecastProps) => {
  const min = Math.min(...forecast.map((day) => day.min));
  const max = Math.max(...forecast.map((day) => day.max));
  const range = Math.max(1, max - min);

  return (
    <section className="widget daily-card">
      <div className="forecast-heading">
        <h2 className="widget-header"><BsCalendar3 />5-day forecast</h2>
        {hasOpenMeteoData && <a className="forecast-source" href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a>}
      </div>
      <div className="daily-list">
        {forecast.map((item, index) => (
          <div key={item.day} className="daily-item">
            <span>{index === 0 && includesToday ? "Today" : weekday.format(new Date(item.day))}</span>
            <span className="daily-icon" role="img" aria-label={item.weather}><WeatherIcon weather={item.weather} /></span>
            <span className="muted-text">{temperature(item.min)}</span>
            <div className="temperature-track" aria-hidden="true">
              <div className="temperature-bar" style={{
                left: `${(item.min - min) / range * 100}%`,
                width: `${(item.max - item.min) / range * 100}%`,
              }} />
            </div>
            <span>{temperature(item.max)}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
