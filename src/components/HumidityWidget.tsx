import { WeatherWidget } from "./WeatherWidget";
import { WiHumidity } from "react-icons/wi";
import { WiMoonFull } from "react-icons/wi";
import type { WeatherData } from "./types";
import { useEffect, useState } from "react";

interface humidityWidgetProps {
  weather: WeatherData;
}

export const HumidityWidget = ({ weather }: humidityWidgetProps) => {
  const dewPoint = Math.round(
    weather.main.temp - (100 - weather.main.humidity) / 5,
  );
  return (
    <WeatherWidget title="HUMIDITY" icon={<WiHumidity />}>
      <div className="humidity-widget">
        <div className="detail-value">{weather.main.humidity}%</div>
        <p className="detail-description">
          <WiHumidity className="humiIcon" size={20} />
          <div className="dew-point-text">
            The dew point is {dewPoint}&deg; right now.
          </div>
        </p>
      </div>
    </WeatherWidget>
  );
};
