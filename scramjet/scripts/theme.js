// FONT AAAAA
function applyCustomFont(fontFamily) {
    const oldFontStyle = document.getElementById('custom-font-style');
    if (oldFontStyle) oldFontStyle.remove();

    if (fontFamily === 'Default' || !fontFamily) {
        return;
    }

    const fontNameForUrl = fontFamily.replace(/ /g, '+');
    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontNameForUrl}:wght@400;700&display=swap`;

    const fontStyle = document.createElement('style');
    fontStyle.id = 'custom-font-style';
    fontStyle.innerHTML = `
        @import url('${fontUrl}');
        * {
            font-family: '${fontFamily}', sans-serif;
        }
    `;
    document.head.appendChild(fontStyle);
}

function loadPresetTheme(themeName) {
  const root = document.documentElement;
  const existingStylesheet = document.getElementById("themeStylesheet");
  const themeVars = ['--primary', '--secondary', '--bg', '--secondary-bg', '--third-bg', '--fourth-bg', '--text-color', '--secondary-text-color', '--button-bg', '--button-hover'];
  themeVars.forEach(varName => root.style.removeProperty(varName));

  if (existingStylesheet) {
    existingStylesheet.remove();
  }

  const themeElement = document.createElement("link");
  themeElement.id = "themeStylesheet";
  themeElement.rel = "stylesheet";
  themeElement.href = `styles/themes/${themeName}.css`;

  themeElement.onload = () => {
    window.dispatchEvent(new Event("themeLoaded"));
  };
  themeElement.onerror = () => {
    console.error(`theme "${themeName}" failed to load (styles/themes/${themeName}.css not found)`);
    themeElement.remove();
  };

  document.head.appendChild(themeElement);
};

function applyCustomThemeColors(themeObject) {
  const root = document.documentElement;
  const existingStylesheet = document.getElementById("themeStylesheet");

  if (existingStylesheet) {
    existingStylesheet.remove();
  }
  
  for (const [key, value] of Object.entries(themeObject)) {
    root.style.setProperty(key, value);
  }
};

function initializeTheme() {
    const livePreviewJson = localStorage.getItem('livePreviewTheme');
    if (livePreviewJson) {
        try {
            const liveData = JSON.parse(livePreviewJson);
            applyCustomThemeColors(liveData.colors);
            applyCustomFont(liveData.settings.font || 'Default');
            window.dispatchEvent(new Event("themeLoaded"));
        } catch (e) {
            console.error("Failed to parse live preview theme.", e);
            loadSavedTheme();
        }
    } else {
        loadSavedTheme();
    }
}

function loadSavedTheme() {
    const activeTheme = localStorage.getItem("theme") || "vapor";
    const customThemeJson = localStorage.getItem("customTheme");
    const customSettingsJson = localStorage.getItem("customThemeSettings");

    if (activeTheme === "custom" && customThemeJson) {
        try {
            const customThemeObject = JSON.parse(customThemeJson);
            applyCustomThemeColors(customThemeObject);

            if (customSettingsJson) {
                const customSettings = JSON.parse(customSettingsJson);
                applyCustomFont(customSettings.font || 'Default');
            } else {
                applyCustomFont('Default');
            }
            
            window.dispatchEvent(new Event("themeLoaded"));
        } catch (e) {
            console.error("failed to parse custom theme!!!", e);
            loadPresetTheme("vapor");
            applyCustomFont('Default');
        }
    } else {
        loadPresetTheme(activeTheme);
        applyCustomFont('Default');
    }
}

window.addEventListener("DOMContentLoaded", initializeTheme);

window.addEventListener("storage", () => {
    initializeTheme();
});