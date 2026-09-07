/**
 * ok so this just gets the saved settings and
 * shits all over the page making it look cool yuh
 */

const cloakPresets = {
  vapor: { title: "VAPOR v3", favicon: "/_a/logo.new.png" },
  google: { title: "Google", favicon: "https://www.google.com/favicon.ico" },
  gmail: {
    title: "Gmail",
    favicon: "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico",
  },
  "google-docs": {
    title: "Google Docs",
    favicon: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico",
  },
  "google-sheets": {
    title: "Google Sheets",
    favicon: "https://ssl.gstatic.com/docs/spreadsheets/favicon_jfk2.png",
  },
  "google-slides": {
    title: "Google Slides",
    favicon: "https://ssl.gstatic.com/docs/presentations/images/favicon5.ico",
  },
  "google-drive": {
    title: "My Drive - Google Drive",
    favicon:
      "https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png",
  },
  "google-classroom": {
    title: "Google Classroom",
    favicon: "https://ssl.gstatic.com/classroom/favicon.png",
  },
  youtube: { title: "YouTube", favicon: "https://www.youtube.com/favicon.ico" },

  schoology: {
    title: "Schoology",
    favicon:
      "https://asset-cdn.schoology.com/sites/all/themes/schoology_theme/favicon.ico",
  },
  canvas: {
    title: "Canvas",
    favicon:
      "https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico",
  },
  canva: {
    title: "Canva",
    favicon: "https://static.canva.com/static/images/favicon.ico",
  },
  clever: {
    title: "Clever | Select your School",
    favicon:
      "https://www.clever.com/wp-content/uploads/2023/06/cropped-Favicon-512px-192x192.png",
  },
  "khan-academy": {
    title: "Khan Academy",
    favicon: "https://www.khanacademy.org/favicon.ico",
  },
  kahoot: {
    title: "Enter Game PIN - Kahoot!",
    favicon: "https://assets-cdn.kahoot.it/controller/v2/favicon.ico",
  },
  gimkit: {
    title: "Play Gimkit! - Enter game code here | Gimkit",
    favicon: "https://www.gimkit.com/favicon.33200140.png",
  },
  blooket: {
    title: "Play Blooket | Blooket",
    favicon: "https://play.blooket.com/favicon.ico",
  },

  github: { title: "GitHub", favicon: "https://github.com/favicon.ico" },
  wikipedia: {
    title: "Wikipedia",
    favicon: "https://www.wikipedia.org/favicon.ico",
  },
  "stack-overflow": {
    title: "Stack Overflow",
    favicon: "https://stackoverflow.com/favicon.ico",
  },
  microsoft: {
    title: "Microsoft",
    favicon: "https://www.microsoft.com/favicon.ico",
  },
  office365: {
    title: "Microsoft 365",
    favicon:
      "https://res.cdn.office.net/assets/mail/fabric-icons-0-8-0_font_base64.woff",
  },
  news: {
    title: "BBC News",
    favicon:
      "https://static.bbc.co.uk/meta/lives/cps-public/images/icon_114x114.png",
  },
  cnn: { title: "CNN", favicon: "https://www.cnn.com/favicon.ico" },
  reuters: { title: "Reuters", favicon: "https://www.reuters.com/favicon.ico" },
  nytimes: {
    title: "The New York Times",
    favicon: "https://www.nytimes.com/favicon.ico",
  },
};

window.cloakPresets = cloakPresets;

function applyTabCloak(presetKey) {
  const preset = cloakPresets[presetKey];

  if (!preset) {
    return;
  }

  if (preset.title) {
    document.title = preset.title;
  }

  if (preset.favicon) {
    const existingFavicon = document.querySelector("link[rel*='icon']");
    if (existingFavicon) {
      existingFavicon.remove();
    }

    const newFavicon = document.createElement("link");
    newFavicon.rel = "icon";
    newFavicon.href = preset.favicon;
    document.head.appendChild(newFavicon);
  }
}

(function () {
  const reducedMotion = localStorage.getItem("reducedMotion");

  if (reducedMotion === "true") {
    const style = document.createElement("style");
    style.innerHTML = `
      * {
        animation: none !important;
        transition: none !important;
      }
      @keyframes none {
        from { opacity: 1; }
        to { opacity: 1; }
      }
      *[style*="animation"] {
        animation-duration: 0.001s !important;
      }
    `;
    document.head.appendChild(style);
  }

  if (window !== window.top) {
    return;
  }
  const savedTabCloak = localStorage.getItem("tabCloak");
  if (savedTabCloak) {
    applyTabCloak(savedTabCloak);
  }

  const abCloak = localStorage.getItem("abCloak");

  if (abCloak === "true") {
    const cloakUrl = localStorage.getItem("abCloakUrl") || "https://google.com";
    const originalHostname = location.hostname;

    const newTab = window.open("about:blank", "_blank");
    if (newTab) {
      newTab.document.write(`
            <style>
              body { margin: 0; padding: 0; overflow: hidden; }
              iframe { width: 100vw; height: 100vh; border: none; }
            </style>
            <iframe src="https://${originalHostname}"></iframe>
      `);
      newTab.document.close();

      window.location.href = cloakUrl;
    }

  }

  const closePrevent = localStorage.getItem("closePrevent");

  if (closePrevent === "true") {
    window.addEventListener("beforeunload", (event) => {
      event.returnValue = true;
    });
  } else {
    window.removeEventListener("beforeunload", (event) => {
      event.returnValue = true;
    });
  }
})();