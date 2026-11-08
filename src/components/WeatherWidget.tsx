import React from "react";

interface WeatherWidgetProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

// Provides a shared card layout for weather details, with a heading, icon, and content area.
export const WeatherWidget = ({
  title,
  icon,
  children,
  className = "",
}: WeatherWidgetProps) => {
  return (
    <section className={`widget ${className}`}>
      <h2 className="widget-header">
        {icon}
        <span>{title}</span>
      </h2>
      {children}
    </section>
  );
};
