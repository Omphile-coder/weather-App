import {
  BsCloudFog2Fill,
  BsCloudSunFill,
  BsCloudyFill,
  BsFillCloudRainFill,
  BsFillSunFill,
} from "react-icons/bs";

interface WeatherIconProps {
  weather: string;
}

export const WeatherIcon = ({ weather }: WeatherIconProps) => {
  switch (weather) {
    case "Rain":
      return <BsFillCloudRainFill className="weather-icon rain" />;
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
