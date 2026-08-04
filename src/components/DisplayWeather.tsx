import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { WiHumidity } from "react-icons/wi";
import { FaWind } from "react-icons/fa";

export const DisplayWeather = () => {
  return (
    <div>
      <div className="container">
        <div className="searchArea">
          <input type="text" placeholder="Enter city name" />

          <div className="searchCircle">
            <AiOutlineSearch className="searchIcon" />
          </div>
        </div>

        <div className="weatherArea">
          <h1>Polokwane</h1>
          <span>South Africa</span>
          <div className="icon">icon</div>
          <h1>18^o</h1>
          <h2>cloudy</h2>
        </div>

        <div className="bottomInfoArea">
          <div className="humidityLevel">
            <WiHumidity className="windIcon " />

            <div className="humidInfo">
              <h1>60%</h1>
              <p>Humidity</p>
            </div>
          </div>
          <div className="wind">
            <FaWind className="windIcon" />
            <div className="humidInfo">
              <h1>10 km/h</h1>
              <p>Wind Speed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
