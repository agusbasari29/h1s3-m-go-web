import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "online"
  | "offline"
  | "warning"
  | "error"
  | "maintenance";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-800",
  online: "bg-green-100 text-green-800",
  offline: "bg-gray-100 text-gray-600",
  warning: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
  maintenance: "bg-purple-100 text-purple-800",
};

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};
