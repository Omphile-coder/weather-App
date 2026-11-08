import {
  BsCloudFog2Fill,
  BsCloudLightningRainFill,
  BsCloudSnowFill,
  BsCloudSunFill,
  BsCloudyFill,
  BsFillCloudRainFill,
  BsFillSunFill,
} from "react-icons/bs";

interface WeatherIconProps {
  weather: string;
}

// Gives the hourly and daily cards a consistent icon for each weather condition.
export const WeatherIcon = ({ weather }: WeatherIconProps) => {
  switch (weather) {
    case "Rain":
      return <BsFillCloudRainFill className="weather-icon rain" />;
    case "Snow":
      return <BsCloudSnowFill className="weather-icon rain" />;
    case "Thunderstorm":
      return <BsCloudLightningRainFill className="weather-icon rain" />;
    case "Clear":
      return <BsFillSunFill className="weather-icon clear" />;
    case "Clouds":
      return <BsCloudyFill className="weather-icon clouds" />;
    case "Mist":
      return <BsCloudFog2Fill className="weather-icon mist" />;
    default:
      return <BsCloudSunFill className="weather-icon partly-cloudy" />;
  }
};
