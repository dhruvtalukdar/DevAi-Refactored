import React from "react";

const themes = ["light", "dark", "dracula", "night", "cyberpunk", "cupcake"];

const ThemeSwitcher = ({
  theme,
  setTheme,
}: {
  theme: string;
  setTheme: (t: string) => void;
}) => {
  return (
    <select
      className="select select-bordered w-full max-w-xs"
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
    >
      {themes.map((t) => (
        <option key={t} value={t}>
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </option>
      ))}
    </select>
  );
};

export default ThemeSwitcher;
