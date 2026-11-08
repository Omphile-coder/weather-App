import type { ComponentProps } from "react";

interface TooltipButtonProps extends ComponentProps<"button"> {
  tooltip: string;
}

// Gives dashboard buttons a consistent tooltip on pointer hover and keyboard focus.
export const TooltipButton = ({ tooltip, children, type = "button", ...props }: TooltipButtonProps) => (
  <span className="tooltip-control">
    <button type={type} {...props}>{children}</button>
    <span className="button-tooltip" aria-hidden="true">{tooltip}</span>
  </span>
);
