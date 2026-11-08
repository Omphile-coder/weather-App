import { FiSearch } from "react-icons/fi";
import { TooltipButton } from "./TooltipButton";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

// Displays the city search form and passes input changes and submissions to the dashboard.
export const SearchBar = ({ value, onChange, onSearch }: SearchBarProps) => (
  <form className="search-area" role="search" onSubmit={(event) => {
    event.preventDefault();
    onSearch();
  }}>
    <input
      type="search"
      aria-label="Search for a city"
      placeholder="Search city"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
    <TooltipButton type="submit" tooltip="Search for a city" aria-label="Search"><FiSearch /></TooltipButton>
  </form>
);
