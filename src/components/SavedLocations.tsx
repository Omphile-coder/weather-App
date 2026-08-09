interface SavedLocationsProps {
  locations: string[];
  onSelectLocation: (city: string) => void;
}

export const SavedLocations = ({
  locations,
  onSelectLocation,
}: SavedLocationsProps) => {
  if (locations.length === 0) {
    return null;
  }

  return (
    <div className="saved-locations">
      {locations.map((city) => (
        <button key={city} onClick={() => onSelectLocation(city)}>
          {city}
        </button>
      ))}
    </div>
  );
};
