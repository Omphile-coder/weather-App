import { FiSunrise, FiWind, FiThermometer, FiMoon } from "react-icons/fi";
import { BsActivity } from "react-icons/bs";
import * as SunCalc from "suncalc";
import { HumidityWidget } from "./HumidityWidget";
import { WeatherWidget } from "./WeatherWidget";
import type { Temperature, WeatherData } from "./types";

interface WeatherDetailsProps {
  weather: WeatherData;
  isMetric: boolean;
  temperature: Temperature;
  formatTime: (timestamp: number) => string;
  aqi?: number;
}

const airLevels = ["Good", "Fair", "Moderate", "Poor", "Very poor"];
const moonPhases = [
  "New moon", "Waxing crescent", "First quarter", "Waxing gibbous",
  "Full moon", "Waning gibbous", "Last quarter", "Waning crescent",
];

// Groups air quality, wind, feels-like temperature, humidity, daylight, and moon phase into detail cards.
export const WeatherDetails = ({ weather, isMetric, temperature, formatTime, aqi }: WeatherDetailsProps) => {
  // Converts the API's wind readings to km/h or mph for the wind and gust labels.
  const speedFactor = isMetric ? 3.6 : 2.23694;
  const speed = (value: number) => `${Math.round(value * speedFactor)} ${isMetric ? "km/h" : "mph"}`;
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const direction = directions[Math.round(weather.wind.deg / 45) % directions.length];
  const moon = SunCalc.getMoonIllumination(new Date(weather.dt * 1000));
  const phase = moonPhases[Math.round(moon.phase * 8) % moonPhases.length];
  const airLevel = aqi ? airLevels[aqi - 1] : undefined;
  const feelsWarmer = Math.abs(weather.main.temp - weather.main.feels_like) < 1
    ? "Close to actual temperature"
    : weather.main.feels_like > weather.main.temp ? "Feels warmer" : "Feels cooler";

  return (
    <div className="detail-widgets">
      <WeatherWidget title="Air quality" icon={<BsActivity />}>
        <div className="detail-value">{airLevel ?? "Unavailable"}</div>
        {airLevel && (
          <>
            <p className="detail-description">OpenWeather AQI {aqi} / 5</p>
            <div className="air-scale" aria-hidden="true">
              <span style={{ left: `${(Number(aqi) - 0.5) * 20}%` }} />
            </div>
          </>
        )}
      </WeatherWidget>
      <WeatherWidget title="Wind" icon={<FiWind />}>
        <div className="detail-value">{speed(weather.wind.speed)}</div>
        <p className="detail-description">
          {direction} {weather.wind.deg}°
          {weather.wind.gust != null && ` · Gusts ${speed(weather.wind.gust)}`}
        </p>
      </WeatherWidget>
      <WeatherWidget title="Feels like" icon={<FiThermometer />}>
        <div className="detail-value">{temperature(weather.main.feels_like)}</div>
        <p className="detail-description">{feelsWarmer}</p>
      </WeatherWidget>
      <HumidityWidget weather={weather} temperature={temperature} />
      <WeatherWidget title="Sunset" icon={<FiSunrise />}>
        <div className="detail-value">{formatTime(weather.sys.sunset)}</div>
        <p className="detail-description">Sunrise {formatTime(weather.sys.sunrise)}</p>
      </WeatherWidget>
      <WeatherWidget title="Moon phase" icon={<FiMoon />}>
        <div className="detail-value moon-phase">{phase}</div>
        <p className="detail-description">{Math.round(moon.fraction * 100)}% illuminated</p>
      </WeatherWidget>
    </div>
  );
};
