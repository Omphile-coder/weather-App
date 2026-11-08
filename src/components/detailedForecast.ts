import axios from "axios";
import type { DailyForecast, HourlyPeriod, WeatherData } from "./types";

interface ForecastResponse {
  timezone: string;
  hourly: {
    time: number[];
    temperature_2m: (number | null)[];
    weather_code: (number | null)[];
    precipitation_probability: (number | null)[];
  };
  daily: {
    time: number[];
    temperature_2m_min: (number | null)[];
    temperature_2m_max: (number | null)[];
    weather_code: (number | null)[];
  };
}

// Maps Open-Meteo weather codes to the condition names used by the dashboard's icons.
function condition(code: number) {
  if (code === 0) return "Clear";
  if (code < 3) return "Partly cloudy";
  if (code === 3) return "Clouds";
  if (code < 50) return "Mist";
  if (code >= 95) return "Thunderstorm";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "Snow";
  return "Rain";
}

// Fetches and normalizes the hourly and daily readings used by both forecast cards.
export async function fetchDetailedForecast(weather: WeatherData, signal: AbortSignal) {
  const { data } = await axios.get<ForecastResponse>("https://api.open-meteo.com/v1/forecast", {
    params: {
      latitude: weather.coord.lat,
      longitude: weather.coord.lon,
      hourly: "temperature_2m,weather_code,precipitation_probability",
      daily: "temperature_2m_min,temperature_2m_max,weather_code",
      timezone: "auto",
      timeformat: "unixtime",
      forecast_days: 6,
    },
    signal,
    timeout: 6500,
  });

  const now = Date.now() / 1000;
  // Keeps the next 24 hours and skips readings with missing temperatures or weather codes.
  const hourly: HourlyPeriod[] = data.hourly.time.flatMap((time, index) => {
    if (time <= now || time > now + 24 * 3600) return [];
    const temp = data.hourly.temperature_2m[index];
    const code = data.hourly.weather_code[index];
    if (temp == null || code == null) return [];
    return [{ time, temp, condition: condition(code), pop: data.hourly.precipitation_probability[index] ?? undefined }];
  });

  const localDate = new Intl.DateTimeFormat("sv-SE", {
    timeZone: data.timezone, year: "numeric", month: "2-digit", day: "2-digit",
  });
  // Converts daily readings to local dates for the header and five-day card.
  const daily: DailyForecast[] = data.daily.time.flatMap((time, index) => {
    const min = data.daily.temperature_2m_min[index];
    const max = data.daily.temperature_2m_max[index];
    const code = data.daily.weather_code[index];
    if (min == null || max == null || code == null) return [];
    const day = localDate.format(new Date(time * 1000));
    return [{ day, min, max, weather: condition(code) }];
  });

  return {
    hourly: hourly.length === 24 ? { periods: hourly, timezone: data.timezone } : undefined,
    daily: daily.length === 6 ? daily : undefined,
  };
}
