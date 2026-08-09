import { AiOutlineCompass } from "react-icons/ai";
import { FaThermometerHalf, FaWind } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { FiSunrise } from "react-icons/fi";
import { WeatherWidget } from "./WeatherWidget";
import type { WeatherData } from "./types";

interface WeatherDetailsProps {
  weather: WeatherData;
  isMetric: boolean;
  formatTime: (unixTime: number) => string;
}

export const WeatherDetails = ({
  weather,
  isMetric,
  formatTime,
}: WeatherDetailsProps) => {
  const dewPoint = Math.round(
    weather.main.temp - (100 - weather.main.humidity) / 5,
  );

  const feelsLikeMessage =
    weather.main.feels_like > weather.main.temp
      ? "Humidity is making it feel warmer."
      : "Wind is making it feel cooler.";

  return (
    <div className="detail-widgets">
      <WeatherWidget title="WIND" icon={<FaWind />}>
        <div className="detail-value">
          {Math.round(weather.wind.speed)} {isMetric ? "km/h" : "mph"}
        </div>

        <div className="wind-direction">
          <AiOutlineCompass />
          {weather.wind.deg}&deg;
        </div>
      </WeatherWidget>

      <WeatherWidget title="HUMIDITY" icon={<WiHumidity />}>
        <div className="detail-value">{weather.main.humidity}%</div>
        <p className="detail-description">
          The dew point is {dewPoint}&deg; right now.
        </p>
      </WeatherWidget>

      <WeatherWidget title="FEELS LIKE" icon={<FaThermometerHalf />}>
        <div className="detail-value">
          {Math.round(weather.main.feels_like)}&deg;
        </div>
        <p className="detail-description">{feelsLikeMessage}</p>
      </WeatherWidget>

      <WeatherWidget title="SUNRISE" icon={<FiSunrise />}>
        <div className="detail-value">{formatTime(weather.sys.sunrise)}</div>
        <p className="detail-description">
          Sunset: {formatTime(weather.sys.sunset)}
        </p>
      </WeatherWidget>
    </div>
  );
};
