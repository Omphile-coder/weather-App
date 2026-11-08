export interface WeatherData {
  name: string;
  dt: number;
  timezone: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  weather: {
    main: string;
    description: string;
  }[];
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  coord: {
    lat: number;
    lon: number;
  };
}

export interface ForecastItem {
  dt: number;
  pop?: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: {
    main: string;
  }[];
}

export interface DailyForecast {
  day: string;
  min: number;
  max: number;
  weather: string;
}

export type Temperature = (celsius: number) => string;

export interface HourlyPeriod {
  time: number;
  temp: number;
  condition: string;
  pop?: number;
}

export interface HourlyWeather {
  periods: HourlyPeriod[];
  timezone: string;
}
