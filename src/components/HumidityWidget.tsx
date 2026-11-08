import { WeatherWidget } from "./WeatherWidget";
import { WiHumidity } from "react-icons/wi";
import type { Temperature, WeatherData } from "./types";

interface HumidityWidgetProps {
  weather: WeatherData;
  temperature: Temperature;
}

// Shows relative humidity and calculates the dew point for the weather details panel.
export const HumidityWidget = ({ weather, temperature }: HumidityWidgetProps) => {
  const { temp, humidity } = weather.main;
  const gamma = Math.log(humidity / 100) + (17.62 * temp) / (243.12 + temp);
  const dewPoint = (243.12 * gamma) / (17.62 - gamma);

  return (
    <WeatherWidget title="Humidity" icon={<WiHumidity />}>
      <div className="detail-value">{humidity}%</div>
      <p className="detail-description">
        {Number.isFinite(dewPoint) ? `Dew point ${temperature(dewPoint)}` : "Dew point unavailable"}
      </p>
    </WeatherWidget>
  );
};
