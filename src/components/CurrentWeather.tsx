import type { WeatherData } from "./types";

interface CurrentWeatherProps {
  weather: WeatherData;
  isMetric: boolean;
}

export const CurrentWeather = ({ weather, isMetric }: CurrentWeatherProps) => {
  const unit = isMetric ? "C" : "F";

  return (
    <header className="main-header">
      <h1>{weather.name}</h1>
      <h2>
        {Math.round(weather.main.temp)}&deg;{unit}
      </h2>
      <p>{weather.weather[0].main}</p>
      <p>
        H:{Math.round(weather.main.temp_max)}&deg;{unit} L:
        {Math.round(weather.main.temp_min)}&deg;{unit}
      </p>
    </header>
  );
};
