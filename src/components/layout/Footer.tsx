import React from "react";
import { cn } from "@/lib/utils";

export interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn("border-t bg-white px-6 py-4", className)}>
      <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
        <p className="text-sm text-gray-600">
          © {currentYear} Device Monitor. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="/privacy"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Privacy
          </a>
          <a
            href="/terms"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Terms
          </a>
          <a
            href="/contact"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};
