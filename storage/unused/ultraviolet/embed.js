<!DOCTYPE html>
<html lang="en">

<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Home - Classroom</title>

   <link rel="icon" href="/storage/images/googleclassroom.png" type="image/png">
   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Comfortaa&display=swap">
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
   <link rel="stylesheet" href="../storage/css/proxy.css">
   <link id="loading-css" rel="stylesheet" href="/storage/css/loading.css">

   <style>
:root {
         --bg: #111;
         --panel: #111;
         --panel-2: #1d1d22;
         --hover: #2c2c33;
         --text: #f1f1f3;
         --muted: #b8b8c0;
         --border: rgba(255, 255, 255, 0.16);
         --border-hover: rgba(255, 255, 255, 0.58);
         --shadow: rgba(0, 0, 0, 0.34);
         --top-height: 46px;
         --bottom-height: 76px;
      }

      html,
      body {
         width: 100%;
         height: 100%;
         min-height: 100%;
         margin: 0;
         overflow: hidden;
         background: var(--bg);
      }

      body {
         font-family: Arial, sans-serif;
         color: var(--text);
         text-shadow: 0 0 0.8px #000;
         box-sizing: border-box;
         user-select: none;
         cursor: url("/storage/icons/cursor/cursor.png") 0 0, auto;
      }

      html.in-frame,
      html.in-frame body,
      html.in-frame.theme-minecraft,
      html.in-frame.theme-minecraft body {
         background: transparent !important;
         background-color: transparent !important;
         background-image: none !important;
      }

      html.in-frame.theme-minecraft body::before,
      html.in-frame.theme-minecraft body::after,
      html.in-frame.theme-minecraft #particles-js,
      html.in-frame.theme-minecraft .particles-js-canvas-el,
      html.in-frame.theme-minecraft #minecraft-theme-layer {
         display: none !important;
         content: none !important;
      }

      button,
      input {
         font-family: Arial, sans-serif;
      }

      button,
      a,
      .proxy-tab,
      .proxy-tab-close {
         cursor: url("/storage/icons/cursor/pointer.png") 0 0, pointer;
         -webkit-tap-highlight-color: transparent;
      }

      input {
         cursor: url("/storage/icons/cursor/cursor.png") 0 0, text;
      }

      html,
      body,
      #frames,
      #tabs-list,
      .proxy-actions,
      .history-body {
         scrollbar-width: none;
      }

      html::-webkit-scrollbar,
      body::-webkit-scrollbar,
      #frames::-webkit-scrollbar,
      #tabs-list::-webkit-scrollbar,
      .proxy-actions::-webkit-scrollbar,
      .history-body::-webkit-scrollbar {
         width: 0;
         height: 0;
         display: none;
      }

      #tabbar {
         position: fixed;
         top: 0;
         left: 0;
         right: 0;
         height: var(--top-height);
         display: flex;
         align-items: center;
         gap: 8px;
         padding: 7px 10px;
         background: var(--panel);
         border-bottom: 2px solid var(--border);
         box-sizing: border-box;
         z-index: 10050;
      }

      #tabs-list {
         flex: 1;
         min-width: 0;
         display: flex;
         align-items: center;
         gap: 8px;
         overflow-x: auto;
         overflow-y: hidden;
         scrollbar-width: none;
      }

      #tabs-list::-webkit-scrollbar {
         display: none;
      }

      .proxy-tab {
         width: 190px;
         min-width: 138px;
         max-width: 230px;
         height: 32px;
         display: flex;
         align-items: center;
         gap: 8px;
         padding: 0 8px;
         border: 2px solid var(--border);
         border-radius: 10px;
         background: var(--panel);
         color: var(--text);
         box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
         box-sizing: border-box;
         transition:
            transform 0.15s ease,
            border-color 0.15s ease,
            background 0.15s ease,
            box-shadow 0.15s ease;
      }

      .proxy-tab:hover {
         background: var(--hover);
         border-color: var(--border-hover);
      }

      .proxy-tab.is-active {
         background: var(--hover);
         border-color: rgba(255, 255, 255, 0.7);
         box-shadow: 0 12px 26px var(--shadow);
      }

      .proxy-tab.is-dragging {
         opacity: 0.72;
         transform: scale(1.025);
      }

      .proxy-tab-icon {
         width: 18px;
         height: 18px;
         flex: 0 0 18px;
         display: inline-flex;
         align-items: center;
         justify-content: center;
      }

      .proxy-tab-icon img {
         width: 16px;
         height: 16px;
         display: block;
         object-fit: contain;
         border-radius: 3px;
      }

      .proxy-tab-title {
         min-width: 0;
         flex: 1;
         overflow: hidden;
         text-overflow: ellipsis;
         white-space: nowrap;
         font-size: 12px;
         line-height: 1;
      }

      .proxy-tab-close {
         width: 20px;
         height: 20px;
         flex: 0 0 20px;
         display: inline-flex;
         align-items: center;
         justify-content: center;
         border: 0;
         border-radius: 50%;
         background: transparent;
         color: var(--text);
         opacity: 0.72;
      }

      .proxy-tab-close:hover {
         background: rgba(255, 255, 255, 0.1);
         opacity: 1;
      }

      #new-tab-button,
      #top-home-button {
         width: 36px;
         height: 32px;
         flex: 0 0 36px;
         display: inline-flex;
         align-items: center;
         justify-content: center;
         border: 2px solid var(--border);
         border-radius: 10px;
         background: var(--panel);
         color: var(--text);
         transition:
            transform 0.15s ease,
            border-color 0.15s ease,
            background 0.15s ease,
            box-shadow 0.15s ease;
      }

      #new-tab-button:hover,
      #top-home-button:hover {
         transform: scale(1.04);
         border-color: var(--border-hover);
         background: var(--hover);
         box-shadow: 0 12px 26px var(--shadow);
      }

      #frames {
         position: fixed;
         top: var(--top-height);
         left: 0;
         right: 0;
         bottom: var(--bottom-height);
         z-index: 1;
         background: var(--bg);
      }

      body.proxy-bar-hidden #frames {
         bottom: 0;
      }

      .proxy-frame {
         position: absolute;
         inset: 0;
         width: 100%;
         height: 100%;
         border: 0;
         background: var(--bg);
         color-scheme: dark;
         visibility: hidden;
         opacity: 0;
         pointer-events: none;
      }

      .proxy-frame.is-active {
         visibility: visible;
         opacity: 1;
         pointer-events: auto;
      }

      #bar-toggle {
         position: fixed;
         left: 50%;
         bottom: calc(var(--bottom-height) - 1px);
         width: 46px;
         height: 25px;
         display: inline-flex;
         align-items: center;
         justify-content: center;
         transform: translateX(-50%);
         border: 2px solid var(--border);
         border-bottom: 0;
         border-radius: 12px 12px 0 0;
         background: var(--panel);
         color: var(--muted);
         z-index: 10045;
         box-shadow: 0 -8px 18px rgba(0, 0, 0, 0.18);
         transition:
            bottom 0.18s ease,
            background 0.15s ease,
            border-color 0.15s ease,
            color 0.15s ease;
      }

      #bar-toggle:hover {
         background: var(--hover);
         border-color: var(--border-hover);
         color: var(--text);
      }

      body.proxy-bar-hidden #bar-toggle {
         bottom: 0;
         border-bottom: 2px solid var(--border);
      }

      body.proxy-bar-hidden #bar-toggle i {
         transform: rotate(180deg);
      }

      .proxy-bar {
         position: fixed;
         left: 0;
         right: 0;
         bottom: 0;
         height: var(--bottom-height);
         display: grid;
         grid-template-columns: minmax(360px, 1fr) max-content;
         align-items: center;
         gap: 16px;
         padding: 12px 18px;
         background: var(--panel);
         border-top: 2px solid var(--border);
         box-sizing: border-box;
         z-index: 10040;
         transition: transform 0.18s ease;
      }

      body.proxy-bar-hidden .proxy-bar {
         transform: translateY(100%);
      }

      .proxy-form {
         min-width: 0;
         margin: 0;
      }

      #proxy-address {
         width: 100%;
         height: 44px;
         border-radius: 18px;
         border: 2px solid var(--border);
         background: var(--panel);
         color: var(--text);
         outline: none;
         padding: 0 18px;
         box-sizing: border-box;
         font-size: 14px;
         text-shadow: 0 0 0.8px #000;
         transition:
            border-color 0.2s ease,
            background 0.2s ease,
            box-shadow 0.2s ease;
      }

      #proxy-address:hover,
      #proxy-address:focus {
         border-color: var(--border-hover);
         background: var(--hover);
         box-shadow: 0 12px 26px var(--shadow);
      }

      .proxy-actions {
         display: flex;
         align-items: center;
         justify-content: flex-end;
         gap: 10px;
         min-width: max-content;
      }

      .proxy-actions button {
         width: 44px;
         height: 44px;
         display: inline-flex;
         align-items: center;
         justify-content: center;
         border: 2px solid var(--border);
         border-radius: 14px;
         background: var(--panel);
         color: var(--text);
         transition:
            transform 0.15s ease,
            border-color 0.15s ease,
            background 0.15s ease,
            box-shadow 0.15s ease;
      }

      .proxy-actions button:hover {
         transform: scale(1.04);
         border-color: var(--border-hover);
         background: var(--hover);
         box-shadow: 0 12px 26px var(--shadow);
      }

      .history-overlay {
         position: fixed;
         inset: 0;
         z-index: 10100;
         display: none;
         align-items: center;
         justify-content: center;
         padding: 18px;
         box-sizing: border-box;
         background: rgba(0, 0, 0, 0.66);
      }

      .history-overlay.is-open {
         display: flex;
      }

      .history-card {
         width: min(700px, 100%);
         max-height: min(660px, calc(100vh - 36px));
         display: flex;
         flex-direction: column;
         border-radius: 18px;
         border: 2px solid var(--border);
         background: var(--panel);
         box-shadow: 0 18px 50px rgba(0, 0, 0, 0.42);
         overflow: hidden;
      }

      .history-head {
         display: flex;
         align-items: center;
         justify-content: space-between;
         gap: 12px;
         padding: 16px 18px;
         border-bottom: 2px solid var(--border);
      }

      .history-head h2 {
         margin: 0;
         font-size: 18px;
         color: var(--text);
      }

      .history-close,
      .history-clear,
      .history-password-form button {
         border: 2px solid var(--border);
         border-radius: 12px;
         background: var(--panel);
         color: var(--text);
         cursor: url("/storage/icons/cursor/pointer.png") 0 0, pointer;
      }

      .history-close {
         width: 36px;
         height: 36px;
      }

      .history-clear {
         height: 36px;
         padding: 0 12px;
      }

      .history-close:hover,
      .history-clear:hover,
      .history-password-form button:hover {
         background: var(--hover);
         border-color: var(--border-hover);
      }

      .history-body {
         padding: 14px;
         overflow: auto;
      }

      .history-password-form {
         display: grid;
         gap: 10px;
      }

      .history-password-form label {
         color: var(--muted);
         font-size: 13px;
      }

      .history-password-form input {
         height: 42px;
         border-radius: 14px;
         border: 2px solid var(--border);
         background: var(--panel);
         color: var(--text);
         outline: none;
         padding: 0 13px;
         box-sizing: border-box;
      }

      .history-password-form input:focus {
         background: var(--hover);
         border-color: var(--border-hover);
      }

      .history-password-form button {
         width: fit-content;
         min-height: 40px;
         padding: 0 16px;
      }

      .history-error {
         min-height: 18px;
         color: #d59d9d;
         font-size: 12px;
      }

      .history-list {
         display: grid;
         gap: 8px;
      }

      .history-item {
         width: 100%;
         display: grid;
         grid-template-columns: 22px 1fr auto;
         align-items: center;
         gap: 10px;
         padding: 10px;
         border-radius: 14px;
         border: 2px solid var(--border);
         background: var(--panel);
         color: var(--text);
         text-align: left;
         cursor: url("/storage/icons/cursor/pointer.png") 0 0, pointer;
      }

      .history-item:hover {
         background: var(--hover);
         border-color: var(--border-hover);
      }

      .history-item img {
         width: 18px;
         height: 18px;
         object-fit: contain;
         border-radius: 3px;
      }

      .history-title {
         overflow: hidden;
         text-overflow: ellipsis;
         white-space: nowrap;
         font-size: 13px;
      }

      .history-url {
         overflow: hidden;
         text-overflow: ellipsis;
         white-space: nowrap;
         color: var(--muted);
         font-size: 11px;
         margin-top: 3px;
      }

      .history-time {
         color: var(--muted);
         font-size: 11px;
         white-space: nowrap;
      }

      .history-empty {
         color: var(--muted);
         font-size: 13px;
         padding: 12px;
      }

      @media (max-width: 760px) {
         :root {
            --top-height: 46px;
            --bottom-height: 122px;
         }

         #tabbar {
            padding: 7px 8px;
         }

         .proxy-tab {
            width: 150px;
            min-width: 122px;
            height: 32px;
         }

         .proxy-bar {
            grid-template-columns: 1fr;
            grid-template-rows: 44px 48px;
            gap: 10px;
            padding: 10px;
         }

         .proxy-actions {
            justify-content: center;
            gap: 8px;
            overflow-x: auto;
            scrollbar-width: none;
         }

         .proxy-actions::-webkit-scrollbar {
            display: none;
         }

         .proxy-actions button {
            width: 44px;
            height: 44px;
            flex: 0 0 44px;
         }

         #proxy-address {
            height: 44px;
            font-size: 13px;
         }

         .history-card {
            max-height: calc(100vh - 24px);
         }

         .history-item {
            grid-template-columns: 22px 1fr;
         }

         .history-time {
            grid-column: 2;
         }
      }
   </style>

</head>

<body>
   <div id="proxy-loading" class="proxy-loading">
      <div class="loader-dots">
         <span></span>
         <span></span>
         <span></span>
      </div>
   </div>

   

   <div id="tabbar">
      <div id="tabs-list"></div>
      <button id="new-tab-button" type="button" aria-label="new tab">
         <i class="fa-solid fa-plus"></i>
      </button>
      <button id="top-home-button" type="button" aria-label="refresh page">
         <i class="fa-solid fa-house"></i>
      </button>
   </div>

   <div id="frames"></div>

   <button id="bar-toggle" type="button" aria-label="toggle toolbar">
      <i class="fa-solid fa-chevron-down"></i>
   </button>

   <div class="proxy-bar">
      <form id="proxy-form" class="proxy-form">
         <input id="proxy-address" type="text" autocomplete="off" spellcheck="false" placeholder="Search or enter URL">
      </form>

      <div class="proxy-actions">
         <button id="back-button" type="button" aria-label="back">
            <i class="fa-solid fa-arrow-left"></i>
         </button>

         <button id="forward-button" type="button" aria-label="forward">
            <i class="fa-solid fa-arrow-right"></i>
         </button>

         <button id="reload-button" type="button" aria-label="reload tab">
            <i class="fa-solid fa-rotate-right"></i>
         </button>

         <button id="home-button" type="button" aria-label="reload page">
            <i class="fa-solid fa-house"></i>
         </button>

         <button id="history-button" type="button" aria-label="history">
            <i class="fa-solid fa-clock-rotate-left"></i>
         </button>

         <button id="eruda-button" type="button" aria-label="eruda">
            <i class="fa-solid fa-code"></i>
         </button>
      </div>
   </div>

   <div id="history-overlay" class="history-overlay" aria-hidden="true">
      <div class="history-card">
         <div class="history-head">
            <h2 id="history-heading">History</h2>
            <button id="history-close" class="history-close" type="button" aria-label="close">
               <i class="fa-solid fa-xmark"></i>
            </button>
         </div>

         <div id="history-body" class="history-body"></div>
      </div>
   </div>

   <script src="uv/uv.bundle.js"></script>
   <script src="uv/uv.config.js"></script>
   <script src="register-sw.js"></script>
   <script id="loading-js" src="/storage/js/loading.js"></script>

   <script>
const defaultUrl = "https://duckduckgo.com/";
      const newTabUrl = "nexus://pages/search.html";
      const prettyNewTabUrl = "nexus://new";
      const historyKey = "nexusProxyHistory";
      const historyPasswordKey = "nexusHistoryPassword";
      const maxHistoryItems = 120;


      function cleanCursorPath(value) {
         return String(value || "").replace(/\\/g, "/").replace(/^https?:\/\/[^/]+/i, "");
      }

      function isCustomCursorEnabled() {
         const saved = localStorage.getItem("nexusCustomCursor");
         return saved === null ? true : saved === "true";
      }

      function getCursorDefault() {
         return cleanCursorPath(localStorage.getItem("nexusCursorDefault") || "/storage/icons/cursor/cursor.png");
      }

      function inferPointerFromCursor(cursor) {
         cursor = cleanCursorPath(cursor);

         if (/\/cursor\.png$/i.test(cursor)) {
            return cursor.replace(/\/cursor\.png$/i, "/pointer.png");
         }

         const parts = cursor.split("/");
         parts.pop();

         if (parts.length > 1) {
            return parts.join("/") + "/pointer.png";
         }

         return "/storage/icons/cursor/pointer.png";
      }

      function getCursorPointer() {
         const normal = getCursorDefault();
         const saved = cleanCursorPath(localStorage.getItem("nexusCursorPointer"));

         if (!saved) {
            return inferPointerFromCursor(normal);
         }

         if (
            saved === "/storage/icons/cursor/pointer.png" &&
            normal !== "/storage/icons/cursor/cursor.png"
         ) {
            return inferPointerFromCursor(normal);
         }

         return saved;
      }

      function getCursorText() {
         return getCursorDefault();
      }

      const proxyFrames = document.getElementById("frames");
      const proxyLoading = document.getElementById("proxy-loading");
      const proxyForm = document.getElementById("proxy-form");
      const proxyAddress = document.getElementById("proxy-address");
      const backButton = document.getElementById("back-button");
      const forwardButton = document.getElementById("forward-button");
      const reloadButton = document.getElementById("reload-button");
      const homeButton = document.getElementById("home-button");
      const topHomeButton = document.getElementById("top-home-button");
      const historyButton = document.getElementById("history-button");
      const erudaButton = document.getElementById("eruda-button");
      const tabsList = document.getElementById("tabs-list");
      const newTabButton = document.getElementById("new-tab-button");
      const barToggle = document.getElementById("bar-toggle");
      const historyOverlay = document.getElementById("history-overlay");
      const historyHeading = document.getElementById("history-heading");
      const historyBody = document.getElementById("history-body");
      const historyClose = document.getElementById("history-close");

      const defaultFavicon = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
         '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#111"/><rect x="14" y="16" width="36" height="28" rx="6" fill="#2c2c33" stroke="#777" stroke-width="3"/><path d="M20 49h24" stroke="#777" stroke-width="4" stroke-linecap="round"/></svg>'
      );

      let tabs = [];
      let activeTabId = "";
      let nextTabId = 1;
let serviceWorkerPromise = null;
      let draggingTabId = "";
      let dragStartX = 0;
      let dragStartY = 0;
      let didDragTab = false;

      function getUrlParam() {
         const params = new URLSearchParams(window.location.search);
         return params.get("p") || params.get("url");
      }

      function isUrl(value) {
         return /^https?:\/\//i.test(value) || /^[^\s]+\.[a-z]{2,}(\/.*)?$/i.test(value);
      }

      function isHttpUrl(value) {
         return /^https?:\/\//i.test(value);
      }

      function isNexusUrl(value) {
         return /^nexus:\/\//i.test(value);
      }

      function isLocalPath(value) {
         return /^(\/|\.\/|\.\.\/|pages\/|static\/|storage\/)/i.test(value);
      }

      function localToNexus(value) {
         let path = String(value || "").trim();

         try {
            const parsed = new URL(path, window.location.href);

            if (parsed.origin === window.location.origin) {
               path = parsed.pathname + parsed.search + parsed.hash;
            }
         } catch (error) {}

         path = path.replace(/^\.?\//, "").replace(/^\/+/, "");

         return "nexus://" + path;
      }

      function nexusToLocal(value) {
         const path = String(value || "").replace(/^nexus:\/\//i, "").replace(/^\/+/, "");
         return "/" + path;
      }

      function normaliseUrl(value) {
         const text = String(value || "").trim();

         if (!text) {
            return defaultUrl;
         }

         if (/^nexus:\/\/new$/i.test(text)) {
            return newTabUrl;
         }
         if (isNexusUrl(text)) {
            const clean = text.replace(/^nexus:\/\//i, "").replace(/^\/+/, "");
            if (/^new$/i.test(clean)) {
               return newTabUrl;
            }
         return "nexus://" + clean;

         }

         if (isLocalPath(text)) {
            return localToNexus(text);
         }

         if (isUrl(text)) {
            if (/^https?:\/\//i.test(text)) {
               return text;
            }

            return "https://" + text;
         }

         return "https://duckduckgo.com/?q=" + encodeURIComponent(text) + "&ia=web";
      }

      function encodeProxyUrl(url) {
         if (typeof __uv$config !== "undefined" && typeof __uv$config.encodeUrl === "function") {
            return __uv$config.prefix + __uv$config.encodeUrl(url);
         }

         return url;
      }

      function decodeProxyUrl(url) {
         if (typeof __uv$config === "undefined" || typeof __uv$config.decodeUrl !== "function") {
            return "";
         }

         try {
            const parsed = new URL(url, window.location.origin);
            const prefix = __uv$config.prefix;

            if (!parsed.pathname.startsWith(prefix)) {
               return "";
            }

            const encoded = parsed.pathname.slice(prefix.length);

            if (!encoded) {
               return "";
            }

            return __uv$config.decodeUrl(encoded);
         } catch (error) {
            return "";
         }
      }

function getFrameSrc(url) {
   const resolvedUrl = normaliseUrl(url);

   if (isNexusUrl(resolvedUrl)) {
      return nexusToLocal(resolvedUrl);
   }

   if (isHttpUrl(resolvedUrl)) {
      return encodeProxyUrl(resolvedUrl);
   }

   return resolvedUrl;
}

      function displayUrlFromFrameUrl(url) {
         const decoded = decodeProxyUrl(url);

         if (decoded) {
            return decoded;
         }

         try {
            const parsed = new URL(url, window.location.href);

            if (parsed.origin === window.location.origin) {
               return localToNexus(parsed.pathname + parsed.search + parsed.hash);
            }

            return url;
         } catch (error) {
            return url;
         }
      }

      function getTitleFromUrl(url) {
         if (!url || url === defaultUrl) {
            return "DuckDuckGo";
         }

         if (url === newTabUrl) {
            return "New Tab";
         }

         if (isNexusUrl(url)) {
            const clean = url.replace(/^nexus:\/\//i, "").split("/").pop() || "New Tab";
            return clean.replace(/\.[a-z0-9]+$/i, "") || "New Tab";
         }

         try {
            if (isHttpUrl(url)) {
               return new URL(url).hostname.replace(/^www\./, "") || "New Tab";
            }
         } catch (error) {}

         return "New Tab";
      }

      function cleanPageTitle(title) {
         return String(title || "").replace(/\s+/g, " ").trim();
      }

      function getActiveTab() {
         return tabs.find(function (tab) {
            return tab.id === activeTabId;
         }) || null;
      }

function updateTopUrl(realUrl) {
   if (!realUrl) {
      return;
   }

   const displayUrl = realUrl === newTabUrl ? prettyNewTabUrl : realUrl;

   proxyAddress.value = displayUrl;

   const newUrl = "/static/embed.html?p=" + encodeURIComponent(displayUrl);

   if (window.location.pathname + window.location.search !== newUrl) {
      history.replaceState(null, "", newUrl);
   }
}

      async function registerServiceWorker() {
         if (!("serviceWorker" in navigator)) {
            return;
         }

         if (serviceWorkerPromise) {
            return serviceWorkerPromise;
         }

         serviceWorkerPromise = navigator.serviceWorker.register("/static/uv-sw.js", {
            scope: "/static/"
         }).catch(function () {});

         return serviceWorkerPromise;
      }

      function resolveFaviconFromDocument(doc) {
         try {
            const link = doc.querySelector(
               'link[rel~="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"], link[rel~="apple-touch-icon"]'
            );

            if (!link) {
               return "";
            }

            const href = link.getAttribute("href");

            if (!href) {
               return "";
            }

            return new URL(href, doc.baseURI || window.location.href).href;
         } catch (error) {
            return "";
         }
      }

      function injectCursorIntoFrame(tab) {
         try {
            const doc = tab.frame.contentDocument;

            if (!doc || !doc.head) {
               return;
            }

            let style = doc.getElementById("nexus-frame-cursor-style");

            if (!isCustomCursorEnabled()) {
               if (style) {
                  style.remove();
               }

               return;
            }

            if (!style) {
               style = doc.createElement("style");
               style.id = "nexus-frame-cursor-style";
               doc.head.appendChild(style);
            }

            style.textContent = `
               * {
                  scrollbar-width: none !important;
               }

               *::-webkit-scrollbar {
                  width: 0 !important;
                  height: 0 !important;
                  display: none !important;
               }

               html,
               body,
               body *,
               *::before,
               *::after {
                  cursor: url("${getCursorDefault()}") 0 0, auto !important;
               }

               a,
               a *,
               a:hover,
               a:hover *,
               button,
               button *,
               button:hover,
               button:hover *,
               select,
               select:hover,
               option,
               input[type="button"],
               input[type="submit"],
               input[type="reset"],
               input[type="checkbox"],
               input[type="radio"],
               input[type="file"],
               label,
               label[for],
               label:hover,
               [role="button"],
               [role="button"] *,
               [role="button"]:hover,
               [role="button"]:hover *,
               [onclick],
               [onclick] *,
               [onclick]:hover,
               [onclick]:hover *,
               summary,
               summary:hover,
               .clickable,
               .clickable *,
               .clickable:hover,
               .clickable:hover * {
                  cursor: url("${getCursorPointer()}") 0 0, pointer !important;
               }

               input[type="text"],
               input[type="password"],
               input[type="email"],
               input[type="search"],
               input[type="url"],
               input[type="tel"],
               textarea,
               [contenteditable="true"] {
                  cursor: url("${getCursorText()}") 0 0, text !important;
               }
            `;

            if (!doc.defaultView.__nexusRefreshHook) {
               doc.defaultView.__nexusRefreshHook = true;

               doc.addEventListener("keydown", function (event) {
                  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "r") {
                     return;
                  }
               }, true);
            }
         } catch (error) {}
      }

      function getFrameVisibleUrl(tab) {
         try {
            return displayUrlFromFrameUrl(tab.frame.contentWindow.location.href);
         } catch (error) {
            return tab.url || "";
         }
      }

      function renderTabs() {
         tabsList.innerHTML = "";

         tabs.forEach(function (tab) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "proxy-tab" + (tab.id === activeTabId ? " is-active" : "") + (tab.id === draggingTabId ? " is-dragging" : "");
            button.dataset.tabId = tab.id;
            button.title = tab.url || tab.title || "New Tab";

            const icon = document.createElement("span");
            icon.className = "proxy-tab-icon";

            const img = document.createElement("img");
            img.src = tab.favicon || defaultFavicon;
            img.alt = "";
            img.onerror = function () {
               img.src = defaultFavicon;
            };

            icon.appendChild(img);

            const title = document.createElement("span");
            title.className = "proxy-tab-title";
            title.textContent = tab.title || getTitleFromUrl(tab.url);

            const close = document.createElement("span");
            close.className = "proxy-tab-close";
            close.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            close.setAttribute("role", "button");
            close.setAttribute("aria-label", "close tab");

            close.addEventListener("click", function (event) {
               event.stopPropagation();
               closeTab(tab.id);
            });

            button.addEventListener("pointerdown", function (event) {
               if (event.button !== 0 || event.target.closest(".proxy-tab-close")) {
                  return;
               }

               draggingTabId = tab.id;
               dragStartX = event.clientX;
               dragStartY = event.clientY;
               didDragTab = false;

               window.addEventListener("pointermove", handleTabPointerMove);
               window.addEventListener("pointerup", handleTabPointerUp, {
                  once: true
               });

               renderTabs();
            });

            button.appendChild(icon);
            button.appendChild(title);
            button.appendChild(close);
            tabsList.appendChild(button);
         });

         const activeButton = tabsList.querySelector(".proxy-tab.is-active");

         if (activeButton) {
            activeButton.scrollIntoView({
               inline: "nearest",
               block: "nearest"
            });
         }
      }

      function handleTabPointerMove(event) {
         if (!draggingTabId) {
            return;
         }

         const moved = Math.abs(event.clientX - dragStartX) > 8 || Math.abs(event.clientY - dragStartY) > 8;

         if (!moved && !didDragTab) {
            return;
         }

         didDragTab = true;

         const target = document.elementFromPoint(event.clientX, event.clientY)?.closest(".proxy-tab");

         if (!target || !target.dataset.tabId || target.dataset.tabId === draggingTabId) {
            return;
         }

         const rect = target.getBoundingClientRect();
         const after = event.clientX > rect.left + rect.width / 2;

         moveTabRelative(draggingTabId, target.dataset.tabId, after);
      }

      function handleTabPointerUp() {
         window.removeEventListener("pointermove", handleTabPointerMove);

         const releasedTabId = draggingTabId;
         const shouldActivate = !didDragTab;

         draggingTabId = "";
         didDragTab = false;

         if (shouldActivate && releasedTabId) {
            activateTab(releasedTabId);
         } else {
            renderTabs();
         }
      }

      function moveTabRelative(dragId, targetId, after) {
         const dragIndex = tabs.findIndex(function (tab) {
            return tab.id === dragId;
         });

         const targetIndex = tabs.findIndex(function (tab) {
            return tab.id === targetId;
         });

         if (dragIndex === -1 || targetIndex === -1) {
            return;
         }

         const item = tabs.splice(dragIndex, 1)[0];
         let insertIndex = tabs.findIndex(function (tab) {
            return tab.id === targetId;
         });

         if (after) {
            insertIndex += 1;
         }

         tabs.splice(insertIndex, 0, item);
         renderTabs();
      }

function createFrame(tab) {
   const frame = document.createElement("iframe");
   frame.className = "proxy-frame";
   frame.dataset.tabId = tab.id;
   frame.allowFullscreen = true;
   frame.setAttribute("allow", "fullscreen; autoplay; clipboard-read; clipboard-write; encrypted-media; picture-in-picture");

         frame.addEventListener("load", function () {
            handleFrameLoad(tab.id);
         });

         proxyFrames.appendChild(frame);
         tab.frame = frame;

         return frame;
      }

      function setActiveFrame() {
         tabs.forEach(function (tab) {
            if (tab.frame) {
               tab.frame.classList.toggle("is-active", tab.id === activeTabId);
            }
         });
      }

      async function loadUrl(url, tabId) {
         const tab = tabs.find(function (entry) {
            return entry.id === (tabId || activeTabId);
         });

         if (!tab) {
            return;
         }

         const realUrl = normaliseUrl(url);

         tab.url = realUrl;
         tab.title = getTitleFromUrl(realUrl);
         tab.loading = true;

         if (!tab.favicon) {
            tab.favicon = defaultFavicon;
         }

         if (!tab.frame) {
            createFrame(tab);
         }

         if (tab.id === activeTabId) {
            proxyAddress.value = realUrl;
            showLoading();
         }

         setActiveFrame();
         renderTabs();

         await registerServiceWorker();

         tab.frame.src = getFrameSrc(realUrl);

         if (tab.id === activeTabId) {
            updateTopUrl(realUrl);
         }
      }

      function handleFrameLoad(tabId) {
         const tab = tabs.find(function (entry) {
            return entry.id === tabId;
         });

         if (!tab) {
            return;
         }

         tab.loading = false;

         const visibleUrl = getFrameVisibleUrl(tab);

         if (visibleUrl && visibleUrl !== "about:blank") {
            tab.url = visibleUrl;
         }

         injectCursorIntoFrame(tab);
         applyEmbedChromeCursor();

         try {
            const doc = tab.frame.contentDocument;
            const pageTitle = cleanPageTitle(doc.title);
            const favicon = resolveFaviconFromDocument(doc);

            if (pageTitle) {
               tab.title = pageTitle;
            } else {
               tab.title = getTitleFromUrl(tab.url);
            }

            tab.favicon = favicon || tab.favicon || defaultFavicon;
         } catch (error) {
            tab.title = tab.title || getTitleFromUrl(tab.url);
            tab.favicon = tab.favicon || defaultFavicon;
         }

         saveHistory(tab);

         if (tab.id === activeTabId) {
            proxyAddress.value = tab.url || "";
            updateTopUrl(tab.url);
            hideLoading();
         }

         renderTabs();
      }

      function createTab(url, activate) {
         const tab = {
            id: "tab-" + nextTabId++,
            url: "",
            title: "New Tab",
            favicon: defaultFavicon,
            loading: false,
            frame: null
         };

         tabs.push(tab);

         if (activate !== false) {
            activeTabId = tab.id;
         }

         renderTabs();
         setActiveFrame();
         loadUrl(url || defaultUrl, tab.id);

         return tab;
      }

      function activateTab(tabId) {
         const tab = tabs.find(function (entry) {
            return entry.id === tabId;
         });

         if (!tab) {
            return;
         }

         activeTabId = tab.id;
         setActiveFrame();
         renderTabs();

         proxyAddress.value = tab.url || "";

         if (tab.url) {
            updateTopUrl(tab.url);
         }

         if (tab.loading) {
            showLoading();
         } else {
            hideLoading();
         }
      }

      function closeTab(tabId) {
         const index = tabs.findIndex(function (tab) {
            return tab.id === tabId;
         });

         if (index === -1) {
            return;
         }

         const wasActive = tabs[index].id === activeTabId;

         if (tabs[index].frame) {
            tabs[index].frame.remove();
         }

         tabs.splice(index, 1);

         if (tabs.length === 0) {
            createTab(defaultUrl, true);
            return;
         }

         if (wasActive) {
            const nextTab = tabs[Math.max(0, index - 1)] || tabs[0];
            activeTabId = nextTab.id;
         }

         setActiveFrame();
         renderTabs();

         const activeTab = getActiveTab();

         if (activeTab) {
            proxyAddress.value = activeTab.url || "";
            updateTopUrl(activeTab.url);

            if (activeTab.loading) {
               showLoading();
            } else {
               hideLoading();
            }
         }
      }

      function reloadActiveTab() {
         const tab = getActiveTab();

         if (!tab || !tab.frame) {
            return;
         }

         tab.loading = true;
         showLoading();
         renderTabs();

         tab.frame.src = tab.frame.src;
      }

      function goBack() {
         const tab = getActiveTab();

         if (!tab || !tab.frame) {
            return;
         }

         showLoading();

         try {
            tab.frame.contentWindow.history.back();
         } catch (error) {
            hideLoading();
         }
      }

      function goForward() {
         const tab = getActiveTab();

         if (!tab || !tab.frame) {
            return;
         }

         showLoading();

         try {
            tab.frame.contentWindow.history.forward();
         } catch (error) {
            hideLoading();
         }
      }

      function readHistory() {
         try {
            const items = JSON.parse(localStorage.getItem(historyKey) || "[]");
            return Array.isArray(items) ? items : [];
         } catch (error) {
            return [];
         }
      }

      function writeHistory(items) {
         localStorage.setItem(historyKey, JSON.stringify(items.slice(0, maxHistoryItems)));
      }

      function saveHistory(tab) {
         if (!tab || !tab.url || tab.url === "about:blank") {
            return;
         }

         const item = {
            title: tab.title || getTitleFromUrl(tab.url),
            url: tab.url,
            favicon: tab.favicon || defaultFavicon,
            time: Date.now()
         };

         const items = readHistory().filter(function (entry) {
            return entry.url !== item.url;
         });

         items.unshift(item);
         writeHistory(items);
      }

      function formatHistoryTime(time) {
         try {
            return new Date(time).toLocaleString([], {
               month: "short",
               day: "numeric",
               hour: "2-digit",
               minute: "2-digit"
            });
         } catch (error) {
            return "";
         }
      }

      function getSavedHistoryPassword() {
         return localStorage.getItem(historyPasswordKey) || "";
      }

      function openHistory() {
         historyOverlay.classList.add("is-open");
         historyOverlay.setAttribute("aria-hidden", "false");

         if (!getSavedHistoryPassword()) {
            renderSetPassword();
            return;
         }

         renderUnlockPassword();
      }

      function renderSetPassword() {
         historyHeading.textContent = "Set history password";

         historyBody.innerHTML = `
            <form class="history-password-form" id="history-password-form">
               <label for="history-password-input">Create a password before history can be viewed</label>
               <input id="history-password-input" type="password" autocomplete="off" placeholder="Password">
               <input id="history-password-confirm" type="password" autocomplete="off" placeholder="Confirm password">
               <div id="history-error" class="history-error"></div>
               <button type="submit">Set password</button>
            </form>
         `;

         const form = document.getElementById("history-password-form");
         const input = document.getElementById("history-password-input");
         const confirm = document.getElementById("history-password-confirm");
         const error = document.getElementById("history-error");

         form.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!input.value.trim()) {
               error.textContent = "Enter a password first.";
               return;
            }

            if (input.value !== confirm.value) {
               error.textContent = "Passwords do not match.";
               return;
            }

            localStorage.setItem(historyPasswordKey, input.value);
            renderUnlockPassword("Password set. Unlock to view history.");
         });

         setTimeout(function () {
            input.focus();
         }, 0);
      }

      function renderUnlockPassword(message) {
         historyHeading.textContent = "History locked";

         historyBody.innerHTML = `
            <form class="history-password-form" id="history-password-form">
               <label for="history-password-input">${message || "Enter password to view history"}</label>
               <input id="history-password-input" type="password" autocomplete="off">
               <div id="history-error" class="history-error"></div>
               <button type="submit">Unlock</button>
            </form>
         `;

         const form = document.getElementById("history-password-form");
         const input = document.getElementById("history-password-input");
         const error = document.getElementById("history-error");

         form.addEventListener("submit", function (event) {
            event.preventDefault();

            if (input.value === getSavedHistoryPassword()) {
               renderHistoryPanel();
               return;
            }

            error.textContent = "Wrong password.";
            input.value = "";
            input.focus();
         });

         setTimeout(function () {
            input.focus();
         }, 0);
      }

      function renderHistoryPanel() {
         const items = readHistory();

         historyHeading.textContent = "History";

         const clearButton = document.createElement("button");
         clearButton.className = "history-clear";
         clearButton.type = "button";
         clearButton.textContent = "Clear";
         clearButton.addEventListener("click", function () {
            writeHistory([]);
            renderHistoryPanel();
         });

         const head = historyOverlay.querySelector(".history-head");

         if (!head.querySelector(".history-clear")) {
            head.insertBefore(clearButton, historyClose);
         }

         historyBody.innerHTML = "";

         if (!items.length) {
            const empty = document.createElement("div");
            empty.className = "history-empty";
            empty.textContent = "No history yet.";
            historyBody.appendChild(empty);
            return;
         }

         const list = document.createElement("div");
         list.className = "history-list";

         items.forEach(function (item) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "history-item";

            const img = document.createElement("img");
            img.src = item.favicon || defaultFavicon;
            img.alt = "";
            img.onerror = function () {
               img.src = defaultFavicon;
            };

            const text = document.createElement("div");

            const title = document.createElement("div");
            title.className = "history-title";
            title.textContent = item.title || getTitleFromUrl(item.url);

            const url = document.createElement("div");
            url.className = "history-url";
            url.textContent = item.url;

            const time = document.createElement("div");
            time.className = "history-time";
            time.textContent = formatHistoryTime(item.time);

            text.appendChild(title);
            text.appendChild(url);

            button.appendChild(img);
            button.appendChild(text);
            button.appendChild(time);

            button.addEventListener("click", function () {
               closeHistoryOverlay();

               if (!getActiveTab()) {
                  createTab(item.url, true);
               } else {
                  loadUrl(item.url, activeTabId);
               }
            });

            list.appendChild(button);
         });

         historyBody.appendChild(list);
      }

      function closeHistoryOverlay() {
         historyOverlay.classList.remove("is-open");
         historyOverlay.setAttribute("aria-hidden", "true");

         const clearButton = historyOverlay.querySelector(".history-clear");

         if (clearButton) {
            clearButton.remove();
         }
      }

      function loadEruda() {
         const oldScript = document.getElementById("eruda-loader-script");

         if (oldScript && window.inspectelement) {
            window.inspectelement();
            return;
         }

         if (oldScript) {
            return;
         }

         const script = document.createElement("script");
         script.id = "eruda-loader-script";
         script.src = "/storage/js/eruda.js?v=3";

         script.onload = function () {
            if (window.inspectelement) {
               window.inspectelement();
            }
         };

         document.body.appendChild(script);
      }

            function refreshEmbedCursors() {
         tabs.forEach(function (tab) {
            if (tab.frame) {
               injectCursorIntoFrame(tab);
            }
         });
      }

      window.addEventListener("storage", function (event) {
         if (
            event.key === "nexusCustomCursor" ||
            event.key === "nexusCursorDefault" ||
            event.key === "nexusCursorPointer" ||
            event.key === "nexusCursorPreset"
         ) {
            refreshEmbedCursors();
         }
      });

      window.addEventListener("focus", refreshEmbedCursors);

      document.addEventListener("visibilitychange", function () {
         if (!document.hidden) {
            refreshEmbedCursors();
         }
      });


      function applyEmbedChromeCursor() {
         let style = document.getElementById("nexus-embed-chrome-cursor-style");

         if (!style) {
            style = document.createElement("style");
            style.id = "nexus-embed-chrome-cursor-style";
            document.head.appendChild(style);
         }

         if (!isCustomCursorEnabled()) {
            style.textContent = "";
            return;
         }

         const normal = getCursorDefault();
         const pointer = getCursorPointer();
         const textCursor = getCursorText();

         style.textContent = `
            html,
            body,
            body *,
            body *::before,
            body *::after {
               cursor: url("${normal}") 0 0, auto !important;
            }

            button,
            button *,
            button:hover,
            button:hover *,
            a,
            a *,
            a:hover,
            a:hover *,
            .proxy-tab,
            .proxy-tab *,
            .proxy-tab:hover,
            .proxy-tab:hover *,
            .proxy-tab-close,
            .proxy-tab-close *,
            .proxy-tab-close:hover,
            .proxy-tab-close:hover *,
            #new-tab-button,
            #new-tab-button *,
            #new-tab-button:hover,
            #new-tab-button:hover *,
            #top-home-button,
            #top-home-button *,
            #top-home-button:hover,
            #top-home-button:hover *,
            #bar-toggle,
            #bar-toggle *,
            #bar-toggle:hover,
            #bar-toggle:hover *,
            .proxy-actions button,
            .proxy-actions button *,
            .proxy-actions button:hover,
            .proxy-actions button:hover *,
            .history-close,
            .history-close *,
            .history-clear,
            .history-clear *,
            .history-item,
            .history-item *,
            .history-password-form button,
            .history-password-form button *,
            [role="button"],
            [role="button"] *,
            [onclick],
            [onclick] * {
               cursor: url("${pointer}") 0 0, pointer !important;
            }

            input,
            input:hover,
            input:focus,
            textarea,
            textarea:hover,
            textarea:focus {
               cursor: url("${textCursor}") 0 0, text !important;
            }
         `;
      }

      function refreshEmbedCursors() {
         applyEmbedChromeCursor();

         tabs.forEach(function (tab) {
            if (tab.frame) {
               injectCursorIntoFrame(tab);
            }
         });
      }

      let cursorRefreshTimer = null;

      function scheduleEmbedCursorRefresh() {
         clearTimeout(cursorRefreshTimer);

         cursorRefreshTimer = setTimeout(function () {
            refreshEmbedCursors();
         }, 80);
      }

      window.addEventListener("storage", function (event) {
         if (
            event.key === "nexusCustomCursor" ||
            event.key === "nexusCursorDefault" ||
            event.key === "nexusCursorPointer" ||
            event.key === "nexusCursorPreset"
         ) {
            scheduleEmbedCursorRefresh();
         }
      });

      window.addEventListener("message", function (event) {
         if (!event.data || event.data.type !== "nexus-cursor-change") {
            return;
         }

         scheduleEmbedCursorRefresh();
      });

      window.addEventListener("focus", scheduleEmbedCursorRefresh);

      document.addEventListener("visibilitychange", function () {
         if (!document.hidden) {
            scheduleEmbedCursorRefresh();
         }
      });

      refreshEmbedCursors();

      proxyForm.addEventListener("submit", function (event) {
         event.preventDefault();
         loadUrl(proxyAddress.value);
      });

      newTabButton.addEventListener("click", function () {
         createTab(newTabUrl, true);
      });

      topHomeButton.addEventListener("click", function () {
         top.location.reload();
      });

      barToggle.addEventListener("click", function () {
         document.body.classList.toggle("proxy-bar-hidden");
      });

      backButton.addEventListener("click", goBack);
      forwardButton.addEventListener("click", goForward);
      reloadButton.addEventListener("click", reloadActiveTab);

      homeButton.addEventListener("click", function () {
         window.location.reload();
      });

      historyButton.addEventListener("click", openHistory);
      historyClose.addEventListener("click", closeHistoryOverlay);
      erudaButton.addEventListener("click", loadEruda);

      historyOverlay.addEventListener("click", function (event) {
         if (event.target === historyOverlay) {
            closeHistoryOverlay();
         }
      });

      window.addEventListener("message", function (event) {
         if (!event.data) {
            return;
         }

         if (event.data.type !== "nexus-search-open" || !event.data.url) {
            return;
         }

         loadUrl(event.data.url, activeTabId);
      });

      window.addEventListener("keydown", function (event) {
         if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "l") {
            event.preventDefault();
            proxyAddress.focus();
            proxyAddress.select();
         }

         if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "t") {
            event.preventDefault();
            createTab(newTabUrl, true);
         }

         if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "w") {
            event.preventDefault();
            closeTab(activeTabId);
         }  

         if (event.key === "Escape") {
            closeHistoryOverlay();
         }
      });

      if (window.parent && window.parent !== window) {
         window.parent.postMessage({
            type: "nexus-proxy-open"
         }, "*");
      }

      window.addEventListener("beforeunload", function () {
         if (window.parent && window.parent !== window) {
            window.parent.postMessage({
               type: "nexus-proxy-close"
            }, "*");
         }
      });

      createTab(getUrlParam() || defaultUrl, true);
   </script>

</body>

</html>
