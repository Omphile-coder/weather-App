import { FiMoon, FiSun } from "react-icons/fi";
import { TooltipButton } from "./TooltipButton";

interface SettingsControlsProps {
  isMetric: boolean;
  theme: "blue" | "dark";
  onToggleUnit: () => void;
  onToggleTheme: () => void;
}

// Displays the unit and theme controls and delegates changes to the dashboard.
export const SettingsControls = ({ isMetric, theme, onToggleUnit, onToggleTheme }: SettingsControlsProps) => {
  const unitLabel = isMetric ? "Switch to Fahrenheit" : "Switch to Celsius";
  const themeLabel = theme === "blue" ? "Switch to dark theme" : "Switch to light theme";

  return (
    <div className="settings-group">
      <TooltipButton className="icon-button" tooltip={unitLabel} aria-label={unitLabel} onClick={onToggleUnit}>
        °{isMetric ? "C" : "F"}
      </TooltipButton>
      <TooltipButton className="icon-button" tooltip={themeLabel} aria-label={themeLabel} onClick={onToggleTheme}>
        {theme === "blue" ? <FiMoon /> : <FiSun />}
      </TooltipButton>
    </div>
  );
};
