import { useEffect, useState } from "react";
import { FiCloudRain } from "react-icons/fi";
import { CircleMarker, MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { WeatherWidget } from "./WeatherWidget";
import type { WeatherData } from "./types";

const MAP_ZOOM = 6;

// Keeps the map centered on the selected city when the location or panel size changes.
function MapViewport({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();

  // Updates Leaflet when the responsive dashboard resizes the map or reveals its tab.
  useEffect(() => {
    map.setView([lat, lon], MAP_ZOOM, { animate: false });
    map.attributionControl.setPrefix(false);
    const container = map.getContainer();
    const observer = new ResizeObserver(() => {
      if (container.clientWidth && container.clientHeight) {
        map.invalidateSize({ pan: false });
        map.setView([lat, lon], MAP_ZOOM, { animate: false });
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [map, lat, lon]);

  return null;
}

// Layers precipitation over a base map and marks the selected city with its current temperature.
export const WeatherMap = ({ weather, temperature, apiKey }: {
  weather: WeatherData;
  temperature: string;
  apiKey: string;
}) => {
  const { lat, lon } = weather.coord;
  const [mapUnavailable, setMapUnavailable] = useState(false);
  const [layerUnavailable, setLayerUnavailable] = useState(false);

  return (
    <WeatherWidget className="map-card" title="Precipitation" icon={<FiCloudRain />}>
      <div className="map-frame" role="region" aria-label={`Precipitation map for ${weather.name}`}>
        <MapContainer
          center={[lat, lon]}
          zoom={MAP_ZOOM}
          scrollWheelZoom={false}
          zoomControl={false}
          dragging={false}
          touchZoom={false}
          doubleClickZoom={false}
          boxZoom={false}
          keyboard={false}
          className="precipitation-map"
        >
          <TileLayer
            className="base-tiles"
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution={'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
            eventHandlers={{ tileerror: () => setMapUnavailable(true) }}
          />
          <TileLayer
            url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`}
            attribution={'<a href="https://openweathermap.org/">OpenWeather</a>'}
            eventHandlers={{ tileerror: () => setLayerUnavailable(true) }}
          />
          <CircleMarker center={[lat, lon]} radius={16} interactive={false} pathOptions={{ color: "white", weight: 2, fillColor: "#26384d", fillOpacity: 1 }} />
          <MapViewport lat={lat} lon={lon} />
        </MapContainer>
        <span className="map-temperature" aria-hidden="true">{temperature}</span>
        {(mapUnavailable || layerUnavailable) && (
          <span className="map-status">{mapUnavailable ? "Map tiles unavailable" : "Precipitation layer unavailable"}</span>
        )}
      </div>
    </WeatherWidget>
  );
};

