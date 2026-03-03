import { useState } from 'react';

export function Settings() {
  const [language, setLanguage] = useState(
    () => localStorage.getItem('settings-language') ?? 'en'
  );
  const [theme, setTheme] = useState(
    () => localStorage.getItem('settings-theme') ?? 'light'
  );

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setLanguage(val);
    localStorage.setItem('settings-language', val);
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setTheme(val);
    localStorage.setItem('settings-theme', val);
  };

  return (
    <div>
      <select
        data-testid="settings-language-dropdown"
        value={language}
        onChange={handleLanguageChange}
      >
        <option value="en">English</option>
        <option value="af">Afrikaans</option>
        <option value="zu">Zulu</option>
      </select>
      <select
        data-testid="settings-theme-dropdown"
        value={theme}
        onChange={handleThemeChange}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}

export default Settings;
