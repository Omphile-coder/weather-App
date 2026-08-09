import type { WeatherData } from "./types";

interface CurrentWeatherProps {
  weather: WeatherData;
}

export const CurrentWeather = ({ weather }: CurrentWeatherProps) => {
  return (
    <header className="main-header">
      <h1>{weather.name}</h1>
      <h2>{Math.round(weather.main.temp)}&deg;</h2>
      <p>{weather.weather[0].main}</p>
      <p>
        H:{Math.round(weather.main.temp_max)}&deg; L:
        {Math.round(weather.main.temp_min)}&deg;
      </p>
    </header>
  );
};
