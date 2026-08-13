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
      <div className="detail-value">{weather.main.humidity}%</div>
      <p className="detail-description">
        The dew point is {dewPoint}&deg; right now.
      </p>
    </WeatherWidget>
  );
};
