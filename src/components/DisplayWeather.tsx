import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { WiHumidity } from "react-icons/wi";
import { FaWind } from "react-icons/fa";
import {
  BsFillSunFill,
  BsCloudyFill,
  BsFillCloudRainFill,
  BsCloudFog2Fill,
} from "react-icons/bs";
import { RiLoaderFill } from "react-icons/ri";
import { TiWeatherPartlySunny } from "react-icons/ti";
import axios from "axios";
interface WeatherDataProps {
  name: string;

  main: {
    temp: number;
    humidity: number;
  };

  sys: {
    country: string;
  };
  weather: {
    main: string;
    description: string;
  }[];

  wind: {
    speed: number;
  };
}

export const DisplayWeather = () => {
  const api_key = "0cc86d16bf572f78cdc96c096c7627e5";
  const api_endpoint = "https://api.openweathermap.org/data/2.5/";

  const [weatherData, setWeatherData] = React.useState<WeatherDataProps | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(false);

  const fetchCurrentWeather = async (lat: number, lon: number) => {
    const url = `${api_endpoint}weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
    const response = await axios.get(url);
    return response.data;
  };

  const iconChanger = (weather: string) => {
    let iconElement: React.ReactNode;
    let iconColor: string;

    switch (weather) {
      case "Rain":
        iconElement = <BsFillCloudRainFill />;
        iconColor = "#272829";
        break;

      case "Clear":
        iconElement = <BsFillSunFill />;
        iconColor = "#FFC436";
        break;

      case "Clouds":
        iconElement = <BsCloudyFill />;
        iconColor = "#102C57";
        break;

      case "Mist":
        iconElement = <BsCloudFog2Fill />;
        iconColor = "#279EFF";
        break;
      default:
        iconElement = <TiWeatherPartlySunny />;
        iconColor = "#7B2869";
    }

    return (
      <span className="icon" style={{ color: iconColor }}>
        {iconElement}
      </span>
    );
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      Promise.all([fetchCurrentWeather(latitude, longitude)]).then(
        ([currentWeather]) => {
          setWeatherData(currentWeather);
          console.log(currentWeather);
        },
      );
    });
  });

  return (
    <div className="container">
      <div className="searchArea">
        <input type="text" placeholder="Enter city name" />

        <div className="searchCircle">
          <AiOutlineSearch className="searchIcon" />
        </div>
      </div>
      {weatherData && (
        <>
          <div className="weatherArea">
            <h1>{weatherData.name}</h1>
            <span>{weatherData.sys.country}</span>

            <div className="icon">
              {iconChanger(weatherData.weather[0].main)}
            </div>

            <h1>{weatherData.main.temp}&deg;C</h1>
            <h2>{weatherData.weather[0].main}</h2>
          </div>

          <div className="bottomInfoArea">
            <div className="humidityLevel">
              <WiHumidity className="windIcon " />

              <div className="humidInfo">
                <h1>{weatherData.main.humidity}%</h1>
                <p>Humidity</p>
              </div>
            </div>
            <div className="wind">
              <FaWind className="windIcon" />
              <div className="humidInfo">
                <h1>{weatherData.wind.speed}km/h</h1>
                <p>Wind Speed</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
