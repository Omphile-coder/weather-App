import React from "react";

interface WeatherWidgetProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const WeatherWidget = ({
  title,
  icon,
  children,
  className = "",
}: WeatherWidgetProps) => {
  return (
    <section className={`widget ${className}`}>
      <div className="widget-header">
        {icon}
        <span>{title}</span>
      </div>
      {children}
    </section>
  );
};
