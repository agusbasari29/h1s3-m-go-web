import React from "react";
import { cn } from "@/lib/utils";
import { Server } from "lucide-react";

export interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header
      className={cn("sticky top-0 z-40 w-full border-b bg-white", className)}
    >
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-2">
          <Server className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">
            Device Monitor
          </span>
        </div>
        <nav className="ml-8 hidden md:flex items-center gap-6">
          <a
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Dashboard
          </a>
          <a
            href="/devices"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Devices
          </a>
          <a
            href="/settings"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Settings
          </a>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">U</span>
          </div>
        </div>
      </div>
    </header>
  );
};
