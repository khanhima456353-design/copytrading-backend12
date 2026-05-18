import React from "react";
import { useTheme } from "./ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span className="theme-toggle__track">
        <span className={`theme-toggle__thumb ${isDark ? "theme-toggle__thumb--dark" : "theme-toggle__thumb--light"}`} />
      </span>
      <span className="theme-toggle__label">{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}
