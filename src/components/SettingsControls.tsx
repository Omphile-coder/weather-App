interface SettingsControlsProps {
  isMetric: boolean;
  theme: "blue" | "dark";
  onToggleUnit: () => void;
  onToggleTheme: () => void;
}

export const SettingsControls = ({
  isMetric,
  theme,
  onToggleUnit,
  onToggleTheme,
}: SettingsControlsProps) => {
  return (
    <div className="settings-group">
      <button onClick={onToggleUnit}>
        &deg;{isMetric ? "C" : "F"} Switch Unit
      </button>

      <button onClick={onToggleTheme}>
        {theme === "blue" ? "Dark Theme" : "Light Theme"}
      </button>
    </div>
  );
};
