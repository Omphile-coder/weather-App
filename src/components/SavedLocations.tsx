import { AiOutlineClose } from "react-icons/ai";
import { IoIosClose } from "react-icons/io";
import { TooltipButton } from "./TooltipButton";

interface SavedLocationsProps {
  locations: string[];
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (city: string) => void;
  onDeleteLocation: (city: string) => void;
}

// Lists saved cities and calls the dashboard when the user selects or removes one.
export const SavedLocations = ({
  locations,
  isOpen,
  onClose,
  onSelectLocation,
  onDeleteLocation,
}: SavedLocationsProps) => {
  if (!isOpen) return null;

  return (
    <>

      <div className="menu-overlay" onClick={onClose} />

      <div className="saved-locations-drawer">
        <div className="drawer-header">
          <h3>Saved Locations</h3>
          <TooltipButton className="close-btn" tooltip="Close saved locations" aria-label="Close saved locations" onClick={onClose}>
            <AiOutlineClose />
          </TooltipButton>
        </div>

        {locations.length === 0 ? (
          <p className="no-locations">No saved locations yet.</p>
        ) : (
          <ul className="locations-list">
            {locations.map((city) => (
              <li key={city} className="location-item">
                <TooltipButton
                  className="location-name"
                  tooltip={`Show weather for ${city}`}
                  onClick={() => {
                    onSelectLocation(city);
                    onClose();
                  }}
                >
                  {city}
                </TooltipButton>
                <TooltipButton
                  className="delete-btn"
                  onClick={() => onDeleteLocation(city)}
                  tooltip={`Remove ${city}`}
                  aria-label={`Remove ${city}`}
                >

                  <IoIosClose />
                </TooltipButton>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};
