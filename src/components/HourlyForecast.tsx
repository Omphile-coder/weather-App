import { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiClock } from "react-icons/fi";
import { TooltipButton } from "./TooltipButton";
import { WeatherIcon } from "./WeatherIcon";
import type { ForecastItem, HourlyWeather, Temperature, WeatherData } from "./types";

interface HourlyForecastProps {
  forecast: ForecastItem[];
  hourly?: HourlyWeather;
  weather: WeatherData;
  temperature: Temperature;
}

const PAGE_SIZE = 8;

// Displays 24 hourly readings in pages of eight so the dashboard fits without scrolling.
// Uses labeled three-hour intervals when the hourly feed is unavailable.
export const HourlyForecast = ({ forecast, hourly, weather, temperature }: HourlyForecastProps) => {
  const [page, setPage] = useState(0);
  const periods = hourly?.periods ?? forecast.filter(
    (item) => item.dt > weather.dt && item.dt <= weather.dt + 24 * 3600,
  ).map((item) => ({
    time: item.dt,
    condition: item.weather[0].main,
    temp: item.main.temp,
    pop: item.pop == null ? undefined : Math.round(item.pop * 100),
  }));
  const first = page * PAGE_SIZE;
  const last = Math.min(first + PAGE_SIZE, periods.length);
  const clock = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: hourly?.timezone ?? "UTC",
  });
  const offset = hourly ? 0 : weather.timezone;

  return (
    <section className="widget hourly-card">
      <div className="forecast-heading">
        <h2 className="widget-header"><FiClock />{hourly ? "24-hour forecast" : "24-hour forecast · 3-hour steps"}</h2>
        {hourly && (
          <div className="hourly-pages" aria-label="Forecast hours" role="group">
            <TooltipButton tooltip="Previous 8 hours" aria-label="Previous 8 hours" disabled={page === 0} onClick={() => setPage(page - 1)}>
              <FiChevronLeft />
            </TooltipButton>
            <span aria-live="polite">{first + 1}–{last} of {periods.length}</span>
            <TooltipButton tooltip="Next 8 hours" aria-label="Next 8 hours" disabled={last >= periods.length} onClick={() => setPage(page + 1)}>
              <FiChevronRight />
            </TooltipButton>
          </div>
        )}
      </div>
      {periods.length ? (
        <div className="hourly-list">
          {periods.slice(first, last).map(({ time, condition, temp, pop }) => (
            <div key={time} className="hourly-item">
              <span className="hourly-time">{clock.format(new Date((time + offset) * 1000))}</span>
              <span className="hourly-icon" role="img" aria-label={condition}><WeatherIcon weather={condition} /></span>
              <span className="rain-chance" aria-label={pop == null ? undefined : `${pop}% chance of precipitation`}>{pop ? `${pop}%` : ""}</span>
              <span className="hourly-temperature">{temperature(temp)}</span>
            </div>
          ))}
        </div>
      ) : <p className="detail-description">Forecast temporarily unavailable.</p>}
    </section>
  );
};
