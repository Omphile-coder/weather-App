import { AiOutlineCompass } from "react-icons/ai";
import { FaThermometerHalf, FaWind } from "react-icons/fa";
import { FiSunrise } from "react-icons/fi";
import { WeatherWidget } from "./WeatherWidget";
import type { WeatherData } from "./types";
import { BsMoon } from "react-icons/bs";
import * as SunCalc from "suncalc";
import fullMoon from "../assets/full-moon.webp";
import { WiMoonNew } from "react-icons/wi";
import { WiMoonAltWaxingCrescent3 } from "react-icons/wi";
import { WiMoonWaningCrescent4 } from "react-icons/wi";
import { WiMoonFirstQuarter } from "react-icons/wi";
import { WiMoonAltFirstQuarter } from "react-icons/wi";
import { WiMoonAltWaxingGibbous1 } from "react-icons/wi";
import { WiMoonWaxingGibbous1 } from "react-icons/wi";
import { WiMoonWaningGibbous5 } from "react-icons/wi";
import { WiMoonWaningGibbous6 } from "react-icons/wi";
import { WiMoonAltWaningCrescent5 } from "react-icons/wi";
import { WiMoonFull } from "react-icons/wi";
import { useEffect, useState } from "react";

interface WeatherDetailsProps {
  weather: WeatherData;
  isMetric: boolean;
  formatTime: (unixTime: number) => string;
}

export const WeatherDetails = ({
  weather,
  isMetric,
  formatTime,
}: WeatherDetailsProps) => {
  const feelsLikeMessage =
    weather.main.feels_like > weather.main.temp
      ? "Humidity is making it feel warmer."
      : "Wind is making it feel cooler.";

  // Moon phase widget
  const [phaseName, setPhaseName] = useState(" ");
  const [icon, setIcon] = useState(<WiMoonNew />);
  const [illumination, setIllumination] = useState("0%");
  const [daysToFull, setDaysToFull] = useState("0 Days");
  const [moonrise, setMoonrise] = useState("--:--");

  useEffect(() => {
    const today = new Date();
    const lat = weather.coord.lat;
    const lon = weather.coord.lon;

    const moonIllumination = SunCalc.getMoonIllumination(today);
    const phase = moonIllumination.phase;
    const fraction = Math.round(moonIllumination.fraction * 10);

    const moonTimes = SunCalc.getMoonTimes(today, lat, lon);

    if (moonTimes.rise) {
      setMoonrise(
        moonTimes.rise.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    } else {
      setMoonrise("No rise today");
    }

    let daysUntilFull = 0;

    // Calculate Days to Full Moon
    // A full moon occurs precisely at phase 0.5 in the 29.53 day lunar cycle
    if (phase <= 0.5) {
      daysUntilFull = Math.round((0.5 - phase) * 29.53);
    } else {
      daysUntilFull = Math.round((1.5 - phase) * 29.53);
    }
    const isSouthern = lat < 0;
    let currentPhaseName = "";
    let currentIcon = <WiMoonNew />;
    if (phase === 0 || phase === 1) {
      currentPhaseName = "NEW MOON";
      currentIcon = <WiMoonNew />;
    } else if (phase < 0.25) {
      currentPhaseName = "WAXING CRESCENT";
      currentIcon = isSouthern ? (
        <WiMoonWaningCrescent4 />
      ) : (
        <WiMoonAltWaxingCrescent3 />
      );
    } else if (phase === 0.25) {
      currentPhaseName = "FIRST QUARTER";
      currentIcon = isSouthern ? (
        <WiMoonFirstQuarter />
      ) : (
        <WiMoonAltFirstQuarter />
      );
    } else if (phase < 0.5) {
      currentPhaseName = "WAXING GIBBOUS";
      currentIcon = isSouthern ? (
        <WiMoonAltWaxingGibbous1 />
      ) : (
        <WiMoonWaxingGibbous1 />
      );
    } else if (phase === 0.5) {
      currentPhaseName = "FULL MOON";
      currentIcon = <WiMoonFull />;
    } else if (phase < 0.75) {
      currentPhaseName = "WANING GIBBOUS";
      currentIcon = isSouthern ? (
        <WiMoonWaningGibbous5 />
      ) : (
        <WiMoonWaningGibbous6 />
      );
    } else if (phase === 0.75) {
      currentPhaseName = "LAST QUARTER";
      currentIcon = isSouthern ? (
        <WiMoonAltFirstQuarter />
      ) : (
        <WiMoonFirstQuarter />
      );
    } else {
      currentPhaseName = "WANING CRESCENT";
      currentIcon = isSouthern ? (
        <WiMoonAltWaningCrescent5 />
      ) : (
        <WiMoonAltWaxingCrescent3 />
      );
    }

    setPhaseName(currentPhaseName);
    setIcon(currentIcon);
    setIllumination(`${fraction}%`);
    setDaysToFull(`${daysUntilFull} DAYS`);
  }, [weather]);

  return (
    <div className="detail-widgets">
      <WeatherWidget title="WIND" icon={<FaWind />}>
        <div className="detail-value">
          {Math.round(weather.wind.speed)} {isMetric ? "km/h" : "mph"}
        </div>

        <div className="wind-direction">
          <AiOutlineCompass />
          {weather.wind.deg}&deg;
        </div>
      </WeatherWidget>

      <WeatherWidget title="FEELS LIKE" icon={<FaThermometerHalf />}>
        <div className="detail-value">
          {Math.round(weather.main.feels_like)}&deg;
        </div>
        <p className="detail-description">{feelsLikeMessage}</p>
      </WeatherWidget>

      <WeatherWidget title="SUNRISE" icon={<FiSunrise />}>
        <div className="detail-value">{formatTime(weather.sys.sunrise)}</div>
        <p className="detail-description">
          Sunset: {formatTime(weather.sys.sunset)}
        </p>
      </WeatherWidget>

      <WeatherWidget title="NEW MOON" icon={<BsMoon />} className="moon-widget">
        <div className="moon-content">
          <div className="moon-stats">
            <div className="moon-stat-row">
              <span className="stat-label">Illumination</span>
              <span className="stat-value">{illumination}</span>
            </div>

            <div className="moon-stat-row">
              <span className="stat-label">Moonset</span>
              <span className="stat-value"> {moonrise}</span>
            </div>

            <div className="moon-stat-row">
              <span className="stat-label">Next Full Moon</span>
              <span className="stat-value"> {daysToFull}</span>
            </div>
          </div>

          <div className="moon-image-container">
            <div className="moon-placeholder"></div>
          </div>
        </div>
      </WeatherWidget>
    </div>
  );
};
