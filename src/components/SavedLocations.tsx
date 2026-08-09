import { AiOutlineClose, AiOutlineDelete } from "react-icons/ai";

interface SavedLocationsProps {
  locations: string[];
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (city: string) => void;
  onDeleteLocation: (city: string) => void;
}

export const SavedLocations = ({
  locations,
  isOpen,
  onClose,
  onSelectLocation,
  onDeleteLocation,
}: SavedLocationsProps) => {
  return (
    <>
      {/* Overlay to close the menu when clicking outside */}
      {isOpen && <div className="menu-overlay" onClick={onClose}></div>}

      <div className={`saved-locations-drawer ${isOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <h3>Saved Locations</h3>
          <button className="close-btn" onClick={onClose}>
            <AiOutlineClose />
          </button>
        </div>

        {locations.length === 0 ? (
          <p className="no-locations">No saved locations yet.</p>
        ) : (
          <ul className="locations-list">
            {locations.map((city) => (
              <li key={city} className="location-item">
                <button
                  className="location-name"
                  onClick={() => {
                    onSelectLocation(city);
                    onClose();
                  }}
                >
                  {city}
                </button>
                <button
                  className="delete-btn"
                  onClick={() => onDeleteLocation(city)}
                  title={`Delete ${city}`}
                >
                  <AiOutlineDelete />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};
