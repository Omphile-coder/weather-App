import { WeatherWidget } from "./WeatherWidget";
import { WiHumidity } from "react-icons/wi";
import type { WeatherData } from "./types";

interface HumidityWidgetProps {
  weather: WeatherData;
}

export const HumidityWidget = ({ weather }: HumidityWidgetProps) => {
  const dewPoint = Math.round(
    weather.main.temp - (100 - weather.main.humidity) / 5,
  );

  return (
    <WeatherWidget title="HUMIDITY" icon={<WiHumidity />}>
      <div className="humidity-widget">
        <div className="detail-value">{weather.main.humidity}%</div>

        <div className="dew-point-text">
          <WiHumidity className="humiIcon" size={20} />
          The dew point is {dewPoint}&deg; right now.
        </div>
      </div>
    </WeatherWidget>
  );
};
