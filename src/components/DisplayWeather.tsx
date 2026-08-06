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

  // for loading state
  const [isLoading, setIsLoading] = useState(false);
  const [searchCity, setSearchCity] = useState<string>("");

  // To fetch the current weather data based on latitude and longitude
  const fetchCurrentWeather = async (lat: number, lon: number) => {
    const url = `${api_endpoint}weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
    const response = await axios.get(url);

    return response.data;
  };

  // To fetch the weather data based on the city name entered by the user
  const fetchWeatherData = async (city: string) => {
    try {
      const url = `${api_endpoint}weather?q=${city}&appid=${api_key}&units=metric`;
      const searchResponse = await axios.get(url);

      const currentWeatherData: WeatherDataProps = searchResponse.data;
      setIsLoading(true);
      return { currentWeatherData };
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  };

  // Handle the search functionality when the user clicks the search icon or presses enter
  const handleSearch = async () => {
    if (searchCity.trim() === "") {
      return; // Do not perform search if the input is empty
    }

    try {
      const { currentWeatherData } = await fetchWeatherData(searchCity);
      setWeatherData(currentWeatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  // Function to change the weather icon based on the weather condition
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

  // UseEffect to get the user's current location and fetch the weather data based on that location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      Promise.all([fetchCurrentWeather(latitude, longitude)]).then(
        ([currentWeather]) => {
          setIsLoading(true);
          setWeatherData(currentWeather);
          console.log(currentWeather);
        },
      );
    });
  }, []);

  // Render the component
  return (
    <div className="container">
      {/* Search Area */}
      <div className="searchArea">
        <input
          type="text"
          placeholder="Enter city name"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
        />

        <div className="searchCircle">
          <AiOutlineSearch className="searchIcon" onClick={handleSearch} />
        </div>
      </div>

      {/* Weather Information/Content */}
      {weatherData && isLoading ? (
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
      ) : (
        <div className="loading">
          <RiLoaderFill className="loadingIcon" />
          <p>Loading</p>
        </div>
      )}
    </div>
  );
};
