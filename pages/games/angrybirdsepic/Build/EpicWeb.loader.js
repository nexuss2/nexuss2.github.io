function createUnityInstance(t, n, d) {
  function c(e, t) {
    if (!c.aborted && n.showBanner) {
      if (t == "error") {
        c.aborted = true;
      }
      return n.showBanner(e, t);
    }
    switch (t) {
      case "error":
        console.error(e);
        break;
      case "warning":
        console.warn(e);
        break;
      default:
        console.log(e);
    }
  }
  function r(e) {
    var t = e.reason || e.error;
    var n = t ? t.toString() : e.message || e.reason || "";
    var r = t && t.stack ? t.stack.toString() : "";
    if ((n += "\n" + (r = r.startsWith(n) ? r.substring(n.length) : r).trim()) && m.stackTraceRegExp && m.stackTraceRegExp.test(n)) {
      P(n, e.filename || t && (t.fileName || t.sourceURL) || "", e.lineno || t && (t.lineNumber || t.line) || 0);
    }
  }
  function e(e, t, n) {
    var r = e[t];
    if (r === undefined || !r) {
      console.warn("Config option \"" + t + "\" is missing or empty. Falling back to default value: \"" + n + "\". Consider updating your WebGL template to include the missing config option.");
      e[t] = n;
    }
  }
  d = d || function () {};
  var o;
  var m = {
    canvas: t,
    webglContextAttributes: {
      preserveDrawingBuffer: false,
      powerPreference: 2
    },
    wasmFileSize: 34295525,
    cacheControl: function (e) {
      if (e == m.dataUrl || e.match(/\.bundle/)) {
        return "must-revalidate";
      } else {
        return "no-store";
      }
    },
    streamingAssetsUrl: "StreamingAssets",
    downloadProgress: {},
    deinitializers: [],
    intervals: {},
    setInterval: function (e, t) {
      e = window.setInterval(e, t);
      this.intervals[e] = true;
      return e;
    },
    clearInterval: function (e) {
      delete this.intervals[e];
      window.clearInterval(e);
    },
    preRun: [],
    postRun: [],
    print: function (e) {
      console.log(e);
    },
    printErr: function (e) {
      console.error(e);
      if (typeof e == "string" && e.indexOf("wasm streaming compile failed") != -1) {
        if (e.toLowerCase().indexOf("mime") != -1) {
          c("HTTP Response Header \"Content-Type\" configured incorrectly on the server for file " + m.codeUrl + " , should be \"application/wasm\". Startup time performance will suffer.", "warning");
        } else {
          c("WebAssembly streaming compilation failed! This can happen for example if \"Content-Encoding\" HTTP header is incorrectly enabled on the server for file " + m.codeUrl + ", but the file is not pre-compressed on disk (or vice versa). Check the Network tab in browser Devtools to debug server header configuration.", "warning");
        }
      }
    },
    locateFile: function (e) {
      if (e == "build.wasm") {
        return this.codeUrl;
      } else {
        return e;
      }
    },
    disabledCanvasEvents: ["contextmenu", "dragstart"]
  };
  e(n, "companyName", "Unity");
  e(n, "productName", "WebGL Player");
  e(n, "productVersion", "1.0");
  for (o in n) {
    m[o] = n[o];
  }
  m.streamingAssetsUrl = new URL(m.streamingAssetsUrl, document.URL).href;
  var a = m.disabledCanvasEvents.slice();
  function i(e) {
    e.preventDefault();
  }
  a.forEach(function (e) {
    t.addEventListener(e, i);
  });
  window.addEventListener("error", r);
  window.addEventListener("unhandledrejection", r);
  var s = "";
  var l = "";
  function u(e) {
    if (document.webkitCurrentFullScreenElement === t) {
      if (t.style.width) {
        s = t.style.width;
        l = t.style.height;
        t.style.width = "100%";
        t.style.height = "100%";
      }
    } else if (s) {
      t.style.width = s;
      t.style.height = l;
      l = s = "";
    }
  }
  document.addEventListener("webkitfullscreenchange", u);
  m.deinitializers.push(function () {
    m.disableAccessToMediaDevices();
    a.forEach(function (e) {
      t.removeEventListener(e, i);
    });
    window.removeEventListener("error", r);
    window.removeEventListener("unhandledrejection", r);
    document.removeEventListener("webkitfullscreenchange", u);
    for (var e in m.intervals) {
      window.clearInterval(e);
    }
    m.intervals = {};
  });
  m.QuitCleanup = function () {
    for (var e = 0; e < m.deinitializers.length; e++) {
      m.deinitializers[e]();
    }
    m.deinitializers = [];
    if (typeof m.onQuit == "function") {
      m.onQuit();
    }
  };
  var h;
  var f;
  var p;
  var g;
  var b;
  var w;
  var y;
  var v;
  var S;
  var C = {
    Module: m,
    SetFullscreen: function () {
      if (m.SetFullscreen) {
        return m.SetFullscreen.apply(m, arguments);
      }
      m.print("Failed to set Fullscreen mode: Player not loaded yet.");
    },
    SendMessage: function () {
      if (m.SendMessage) {
        return m.SendMessage.apply(m, arguments);
      }
      m.print("Failed to execute SendMessage: Player not loaded yet.");
    },
    Quit: function () {
      return new Promise(function (e, t) {
        m.shouldQuit = true;
        m.onQuit = e;
      });
    },
    GetMetricsInfo: function () {
      var e = Number(m._getMetricsInfo()) >>> 0;
      var t = 4 + e;
      var n = 4 + t;
      var r = 8 + n;
      var o = 8 + r;
      var a = 4 + o;
      var i = 4 + a;
      var s = 8 + i;
      var d = 8 + s;
      var c = 4 + d;
      var l = 4 + c;
      var u = 4 + l;
      return {
        totalWASMHeapSize: m.HEAPU32[e >> 2],
        usedWASMHeapSize: m.HEAPU32[t >> 2],
        totalJSHeapSize: m.HEAPF64[n >> 3],
        usedJSHeapSize: m.HEAPF64[r >> 3],
        pageLoadTime: m.HEAPU32[o >> 2],
        pageLoadTimeToFrame1: m.HEAPU32[a >> 2],
        fps: m.HEAPF64[i >> 3],
        movingAverageFps: m.HEAPF64[s >> 3],
        assetLoadTime: m.HEAPU32[d >> 2],
        webAssemblyStartupTime: m.HEAPU32[c >> 2] - (m.webAssemblyTimeStart || 0),
        codeDownloadTime: m.HEAPU32[l >> 2],
        gameStartupTime: m.HEAPU32[u >> 2],
        numJankedFrames: m.HEAPU32[4 + u >> 2]
      };
    }
  };
  function P(e, t, n) {
    if (e.indexOf("fullscreen error") == -1) {
      if (m.startupErrorHandler) {
        m.startupErrorHandler(e, t, n);
      } else if (!m.errorHandler || !m.errorHandler(e, t, n)) {
        console.log("Invoking error handler due to\n" + e);
        if (typeof dump == "function") {
          dump("Invoking error handler due to\n" + e);
        }
        if (!P.didShowErrorMessage) {
          if ((e = "An error occurred running the Unity content on this page. See your browser JavaScript console for more info. The error was:\n" + e).indexOf("DISABLE_EXCEPTION_CATCHING") != -1) {
            e = "An exception has occurred, but exception handling has been disabled in this build. If you are the developer of this content, enable exceptions in your project WebGL player settings to be able to catch the exception or see the stack trace.";
          } else if (e.indexOf("Cannot enlarge memory arrays") != -1) {
            e = "Out of memory. If you are the developer of this content, try allocating more memory to your WebGL build in the WebGL player settings.";
          } else if (e.indexOf("Invalid array buffer length") != -1 || e.indexOf("Invalid typed array length") != -1 || e.indexOf("out of memory") != -1 || e.indexOf("could not allocate memory") != -1) {
            e = "The browser could not allocate enough memory for the WebGL content. If you are the developer of this content, try allocating less memory to your WebGL build in the WebGL player settings.";
          }
          alert(e);
          P.didShowErrorMessage = true;
        }
      }
    }
  }
  function T(e, t) {
    if (e != "symbolsUrl") {
      var n = m.downloadProgress[e];
      n = n || (m.downloadProgress[e] = {
        started: false,
        finished: false,
        lengthComputable: false,
        total: 0,
        loaded: 0
      });
      if (typeof t == "object" && (t.type == "progress" || t.type == "load")) {
        if (!n.started) {
          n.started = true;
          n.lengthComputable = t.lengthComputable;
        }
        n.total = t.total;
        n.loaded = t.loaded;
        if (t.type == "load") {
          n.finished = true;
        }
      }
      var r = 0;
      var o = 0;
      var a = 0;
      var i = 0;
      var s = 0;
      for (e in m.downloadProgress) {
        if (!(n = m.downloadProgress[e]).started) {
          return;
        }
        a++;
        if (n.lengthComputable) {
          r += n.loaded;
          o += n.total;
          i++;
        } else if (!n.finished) {
          s++;
        }
      }
      d((a ? (a - s - (o ? i * (o - r) / o : 0)) / a : 0) * 0.9);
    }
  }
  function E() {
    var e = this;
    this.isConnected = this.connect().then(function () {
      return e.cleanUpCache();
    });
    this.isConnected.catch(function (e) {
      e = "Error when initializing cache: " + e;
      console.log("[UnityCache] " + e);
    });
  }
  function U(e) {
    console.log("[UnityCache] " + e);
  }
  function k(e) {
    k.link = k.link || document.createElement("a");
    k.link.href = e;
    return k.link.href;
  }
  m.SystemInfo = function () {
    var e;
    var t;
    var n;
    var r;
    var o;
    var a = navigator.userAgent + " ";
    var i = [["Firefox", "Firefox"], ["OPR", "Opera"], ["Edg", "Edge"], ["SamsungBrowser", "Samsung Browser"], ["Trident", "Internet Explorer"], ["MSIE", "Internet Explorer"], ["Chrome", "Chrome"], ["CriOS", "Chrome on iOS Safari"], ["FxiOS", "Firefox on iOS Safari"], ["Safari", "Safari"]];
    function s(e, t, n) {
      return (e = RegExp(e, "i").exec(t)) && e[n];
    }
    for (var d = 0; d < i.length; ++d) {
      if (t = s(i[d][0] + "[/ ](.*?)[ \\)]", a, 1)) {
        e = i[d][1];
        break;
      }
    }
    if (e == "Safari") {
      t = s("Version/(.*?) ", a, 1);
    }
    if (e == "Internet Explorer") {
      t = s("rv:(.*?)\\)? ", a, 1) || t;
    }
    for (var c = [["Windows (.*?)[;)]", "Windows"], ["Android ([0-9_.]+)", "Android"], ["iPhone OS ([0-9_.]+)", "iPhoneOS"], ["iPad.*? OS ([0-9_.]+)", "iPadOS"], ["FreeBSD( )", "FreeBSD"], ["OpenBSD( )", "OpenBSD"], ["Linux|X11()", "Linux"], ["Mac OS X ([0-9_\\.]+)", "MacOS"], ["bot|google|baidu|bing|msn|teoma|slurp|yandex", "Search Bot"]], l = 0; l < c.length; ++l) {
      if (r = s(c[l][0], a, 1)) {
        n = c[l][1];
        r = r.replace(/_/g, ".");
        break;
      }
    }
    var u;
    function h() {
      try {
        if (window.WebAssembly) {
          if (WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 5, 3, 1, 0, 1, 10, 13, 1, 11, 0, 65, 0, 65, 0, 65, 1, 252, 11, 0, 11]))) {
            if (WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 11, 1, 9, 1, 1, 125, 32, 0, 252, 0, 26, 11]))) {
              if (WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 10, 1, 8, 1, 1, 126, 32, 0, 194, 26, 11]))) {
                if (WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 9, 1, 7, 0, 65, 0, 253, 15, 26, 11]))) {
                  return !!WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 10, 1, 8, 0, 6, 64, 1, 25, 1, 11, 11])) || "wasm-exceptions";
                } else {
                  return "wasm-simd128";
                }
              } else {
                return "sign-extend";
              }
            } else {
              return "non-trapping fp-to-int";
            }
          } else {
            return "bulk-memory";
          }
        } else {
          return "WebAssembly";
        }
      } catch (e) {
        return "Exception: " + e;
      }
    }
    r = {
      "NT 5.0": "2000",
      "NT 5.1": "XP",
      "NT 5.2": "Server 2003",
      "NT 6.0": "Vista",
      "NT 6.1": "7",
      "NT 6.2": "8",
      "NT 6.3": "8.1",
      "NT 10.0": "10"
    }[r] || r;
    webgpuVersion = 0;
    if (f = document.createElement("canvas")) {
      u = (p = f.getContext("webgl2")) ? 2 : 0;
      if (!p) {
        if (p = f && f.getContext("webgl")) {
          u = 1;
        }
      }
      if (p) {
        o = p.getExtension("WEBGL_debug_renderer_info") && p.getParameter(37446) || p.getParameter(7937);
      }
    }
    var f = typeof SharedArrayBuffer != "undefined";
    var p = typeof WebAssembly == "object" && typeof WebAssembly.compile == "function";
    var m = p && h() === true;
    return {
      width: screen.width,
      height: screen.height,
      userAgent: a.trim(),
      browser: e || "Unknown browser",
      browserVersion: t || "Unknown version",
      mobile: /Mobile|Android|iP(ad|hone)/.test(navigator.appVersion),
      os: n || "Unknown OS",
      osVersion: r || "Unknown OS Version",
      gpu: o || "Unknown GPU",
      language: navigator.userLanguage || navigator.language,
      hasWebGL: u,
      hasWebGPU: webgpuVersion,
      hasCursorLock: !!document.body.requestPointerLock,
      hasFullscreen: !!document.body.requestFullscreen || !!document.body.webkitRequestFullscreen,
      hasThreads: f,
      hasWasm: p,
      hasWasm2023: m,
      missingWasm2023Feature: m ? null : h(),
      hasWasmThreads: false
    };
  }();
  m.abortHandler = function (e) {
    P(e, "", 0);
    return true;
  };
  Error.stackTraceLimit = Math.max(Error.stackTraceLimit || 0, 50);
  m.readBodyWithProgress = function (a, i, s) {
    var e = a.body ? a.body.getReader() : undefined;
    var d = a.headers.get("Content-Length") !== undefined;
    var c = function (e, t) {
      if (!t) {
        return 0;
      }
      var t = e.headers.get("Content-Encoding");
      var n = parseInt(e.headers.get("Content-Length"));
      var r = 536870912;
      switch (t) {
        case "br":
          return Math.min(Math.round(n * 2), r);
        case "gzip":
          return Math.min(Math.round(n * 1.6), r);
        default:
          return n;
      }
    }(a, d);
    var l = new Uint8Array(c);
    var u = [];
    var h = 0;
    var f = 0;
    if (!d) {
      console.warn("[UnityCache] Response is served without Content-Length header. Please reconfigure server to include valid Content-Length for better download performance.");
    }
    return function o() {
      if (e === undefined) {
        return a.arrayBuffer().then(function (e) {
          var t = new Uint8Array(e);
          i({
            type: "progress",
            response: a,
            total: e.length,
            loaded: 0,
            lengthComputable: d,
            chunk: s ? t : null
          });
          return t;
        });
      } else {
        return e.read().then(function (e) {
          if (e.done) {
            if (h === c) {
              return l;
            }
            if (h < c) {
              return l.slice(0, h);
            }
            var t = new Uint8Array(h);
            t.set(l, 0);
            var n = f;
            for (var r = 0; r < u.length; ++r) {
              t.set(u[r], n);
              n += u[r].length;
            }
            return t;
          }
          if (h + e.value.length <= l.length) {
            l.set(e.value, h);
            f = h + e.value.length;
          } else {
            u.push(e.value);
          }
          h += e.value.length;
          i({
            type: "progress",
            response: a,
            total: Math.max(c, h),
            loaded: h,
            lengthComputable: d,
            chunk: s ? e.value : null
          });
          return o();
        });
      }
    }().then(function (e) {
      i({
        type: "load",
        response: a,
        total: e.length,
        loaded: e.length,
        lengthComputable: d,
        chunk: null
      });
      a.parsedBody = e;
      return a;
    });
  };
  m.fetchWithProgress = function (e, t) {
    function n() {}
    if (t && t.onProgress) {
      n = t.onProgress;
    }
    return fetch(e, t).then(function (e) {
      return m.readBodyWithProgress(e, n, t.enableStreamingDownload);
    });
  };
  h = {
    name: "UnityCache",
    version: 4
  };
  f = {
    name: "RequestMetaDataStore",
    version: 1
  };
  p = "RequestStore";
  g = "WebAssembly";
  b = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  w = null;
  E.getInstance = function () {
    return w = w || new E();
  };
  E.destroyInstance = function () {
    if (w) {
      return w.close().then(function () {
        w = null;
      });
    } else {
      return Promise.resolve();
    }
  };
  E.prototype.clearCache = function () {
    var r = this;
    return this.isConnected.then(function () {
      return r.execute(f.name, "clear", []);
    }).then(function () {
      return r.cache.keys();
    }).then(function e(t) {
      var n;
      if (t.length === 0) {
        return Promise.resolve();
      } else {
        n = t.pop();
        return r.cache.delete(n).then(function () {
          return e(t);
        });
      }
    });
  };
  E.UnityCacheDatabase = h;
  E.RequestMetaDataStore = f;
  E.MaximumCacheSize = 1073741824;
  E.prototype.loadRequest = function (e) {
    var t = this;
    return t.isConnected.then(function () {
      return Promise.all([t.cache.match(e), t.loadRequestMetaData(e)]);
    }).then(function (e) {
      if (e[0] !== undefined && e[1] !== undefined) {
        return {
          response: e[0],
          metaData: e[1]
        };
      }
    });
  };
  E.prototype.loadRequestMetaData = function (e) {
    e = typeof e == "string" ? e : e.url;
    return this.execute(f.name, "get", [e]);
  };
  E.prototype.updateRequestMetaData = function (e) {
    return this.execute(f.name, "put", [e]);
  };
  E.prototype.storeRequest = function (e, t) {
    var n = this;
    return n.isConnected.then(function () {
      return n.cache.put(e, t);
    });
  };
  E.prototype.close = function () {
    return this.isConnected.then(function () {
      if (this.database) {
        this.database.close();
        this.database = null;
      }
      this.cache &&= null;
    }.bind(this));
  };
  E.prototype.connect = function () {
    var o = this;
    if (b === undefined) {
      return Promise.reject(new Error("Could not connect to cache: IndexedDB is not supported."));
    } else if (window.caches === undefined) {
      return Promise.reject(new Error("Could not connect to cache: Cache API is not supported."));
    } else {
      return new Promise(function (t, n) {
        try {
          function r() {
            if (o.openDBTimeout) {
              clearTimeout(o.openDBTimeout);
              o.openDBTimeout = null;
            }
          }
          o.openDBTimeout = setTimeout(function () {
            if (o.database === undefined) {
              n(new Error("Could not connect to cache: Database timeout."));
            }
          }, 20000);
          var e = b.open(h.name, h.version);
          e.onupgradeneeded = o.upgradeDatabase.bind(o);
          e.onsuccess = function (e) {
            r();
            o.database = e.target.result;
            t();
          };
          e.onerror = function (e) {
            r();
            o.database = null;
            n(new Error("Could not connect to database."));
          };
        } catch (e) {
          r();
          o.database = null;
          o.cache = null;
          n(new Error("Could not connect to cache: Could not connect to database."));
        }
      }).then(function () {
        var e = h.name + "_" + m.companyName + "_" + m.productName;
        return caches.open(e);
      }).then(function (e) {
        o.cache = e;
      });
    }
  };
  E.prototype.upgradeDatabase = function (e) {
    var t;
    var e = e.target.result;
    if (!e.objectStoreNames.contains(f.name)) {
      t = e.createObjectStore(f.name, {
        keyPath: "url"
      });
      ["accessedAt", "updatedAt"].forEach(function (e) {
        t.createIndex(e, e);
      });
    }
    if (e.objectStoreNames.contains(p)) {
      e.deleteObjectStore(p);
    }
    if (e.objectStoreNames.contains(g)) {
      e.deleteObjectStore(g);
    }
  };
  E.prototype.execute = function (a, i, s) {
    return this.isConnected.then(function () {
      return new Promise(function (t, n) {
        try {
          var e;
          var r;
          var o;
          if (this.database === null) {
            n(new Error("indexedDB access denied"));
          } else {
            e = ["put", "delete", "clear"].indexOf(i) != -1 ? "readwrite" : "readonly";
            r = this.database.transaction([a], e).objectStore(a);
            if (i == "openKeyCursor") {
              r = r.index(s[0]);
              s = s.slice(1);
            }
            (o = r[i].apply(r, s)).onsuccess = function (e) {
              t(e.target.result);
            };
            o.onerror = function (e) {
              n(e);
            };
          }
        } catch (e) {
          n(e);
        }
      }.bind(this));
    }.bind(this));
  };
  E.prototype.getMetaDataEntries = function () {
    var r = this;
    var o = 0;
    var a = [];
    return new Promise(function (t, n) {
      var e = r.database.transaction([f.name], "readonly").objectStore(f.name).openCursor();
      e.onsuccess = function (e) {
        e = e.target.result;
        if (e) {
          o += e.value.size;
          a.push(e.value);
          e.continue();
        } else {
          t({
            metaDataEntries: a,
            cacheSize: o
          });
        }
      };
      e.onerror = function (e) {
        n(e);
      };
    });
  };
  E.prototype.cleanUpCache = function () {
    var i = this;
    return this.getMetaDataEntries().then(function (e) {
      for (var t = e.metaDataEntries, n = e.cacheSize, r = [], o = [], a = 0; a < t.length; ++a) {
        if (t[a].version == m.productVersion) {
          o.push(t[a]);
        } else {
          r.push(t[a]);
          n -= t[a].size;
        }
      }
      o.sort(function (e, t) {
        return e.accessedAt - t.accessedAt;
      });
      for (a = 0; a < o.length && !(n < E.MaximumCacheSize); ++a) {
        r.push(o[a]);
        n -= o[a].size;
      }
      return function e() {
        var t;
        if (r.length === 0) {
          return Promise.resolve();
        } else {
          t = r.pop();
          return i.cache.delete(t.url).then(function (e) {
            if (e) {
              r = t.url;
              return new Promise(function (e, t) {
                var n = i.database.transaction([f.name], "readwrite");
                n.objectStore(f.name).delete(r);
                n.oncomplete = e;
                n.onerror = t;
              });
            }
            var r;
          }).then(e);
        }
      }();
    });
  };
  m.UnityCache = E;
  y = m.UnityCache;
  v = m.fetchWithProgress;
  S = m.readBodyWithProgress;
  m.cachedFetch = function (o, a) {
    var e;
    var t;
    var i = y.getInstance();
    var s = k(typeof o == "string" ? o : o.url);
    var d = {
      enabled: (e = s, (!(t = a) || !t.method || t.method === "GET") && (!t || ["must-revalidate", "immutable"].indexOf(t.control) != -1) && !!e.match("^https?://"))
    };
    function c(n, r) {
      return fetch(n, r).then(function (e) {
        var t;
        if (!d.enabled || d.revalidated) {
          return e;
        } else if (e.status === 304) {
          d.revalidated = true;
          i.updateRequestMetaData(d.metaData).then(function () {
            U("'" + d.metaData.url + "' successfully revalidated and served from the browser cache");
          }).catch(function (e) {
            U("'" + d.metaData.url + "' successfully revalidated but not stored in the browser cache due to the error: " + e);
          });
          return S(d.response, r.onProgress, r.enableStreamingDownload);
        } else if (e.status == 200) {
          d.response = e;
          d.metaData.updatedAt = d.metaData.accessedAt;
          d.revalidated = true;
          t = e.clone();
          return S(e, r.onProgress, r.enableStreamingDownload).then(function (e) {
            d.metaData.size = e.parsedBody.length;
            Promise.all([i.storeRequest(n, t), i.updateRequestMetaData(d.metaData)]).then(function () {
              U("'" + s + "' successfully downloaded and stored in the browser cache");
            }).catch(function (e) {
              U("'" + s + "' successfully downloaded but not stored in the browser cache due to the error: " + e);
            });
            return e;
          });
        } else {
          U("'" + s + "' request failed with status: " + e.status + " " + e.statusText);
          return S(e, r.onProgress, r.enableStreamingDownload);
        }
      });
    }
    if (a) {
      d.control = a.control;
      d.companyName = a.companyName;
      d.productName = a.productName;
      d.productVersion = a.productVersion;
    }
    d.revalidated = false;
    d.metaData = {
      url: s,
      accessedAt: Date.now(),
      version: d.productVersion
    };
    d.response = null;
    if (d.enabled) {
      return i.loadRequest(s).then(function (e) {
        var n;
        var r;
        var t;
        if (e) {
          n = e.response;
          r = e.metaData;
          d.response = n;
          d.metaData.size = r.size;
          d.metaData.updatedAt = r.updatedAt;
          if (d.control == "immutable") {
            d.revalidated = true;
            i.updateRequestMetaData(r).then(function () {
              U("'" + d.metaData.url + "' served from the browser cache without revalidation");
            });
            return S(n, a.onProgress, a.enableStreamingDownload);
          } else {
            e = s;
            if ((t = window.location.href.match(/^[a-z]+:\/\/[^\/]+/)) && !e.lastIndexOf(t[0], 0) || !n.headers.get("Last-Modified") && !n.headers.get("ETag")) {
              e = (a = a || {}).headers || {};
              a.headers = e;
              if (n.headers.get("Last-Modified")) {
                e["If-Modified-Since"] = n.headers.get("Last-Modified");
                e["Cache-Control"] = "no-cache";
              } else if (n.headers.get("ETag")) {
                e["If-None-Match"] = n.headers.get("ETag");
                e["Cache-Control"] = "no-cache";
              }
              return c(o, a);
            } else {
              return fetch(s, {
                method: "HEAD"
              }).then(function (t) {
                d.revalidated = ["Last-Modified", "ETag"].every(function (e) {
                  return !n.headers.get(e) || n.headers.get(e) == t.headers.get(e);
                });
                if (d.revalidated) {
                  i.updateRequestMetaData(r).then(function () {
                    U("'" + d.metaData.url + "' successfully revalidated and served from the browser cache");
                  });
                  return S(d.response, a.onProgress, a.enableStreamingDownload);
                } else {
                  return c(o, a);
                }
              });
            }
          }
        } else {
          return c(o, a);
        }
      }).catch(function (e) {
        U("Failed to load '" + d.metaData.url + "' from browser cache due to the error: " + e);
        return v(o, a);
      });
    } else {
      return v(o, a);
    }
  };
  var A = {
    gzip: {
      hasUnityMarker: function (e) {
        var t = 10;
        var n = "UnityWeb Compressed Content (gzip)";
        if (t > e.length || e[0] != 31 || e[1] != 139) {
          return false;
        }
        var r = e[3];
        if (r & 4) {
          if (t + 2 > e.length) {
            return false;
          }
          if ((t += 2 + e[t] + (e[t + 1] << 8)) > e.length) {
            return false;
          }
        }
        if (r & 8) {
          while (t < e.length && e[t]) {
            t++;
          }
          if (t + 1 > e.length) {
            return false;
          }
          t++;
        }
        return r & 16 && String.fromCharCode.apply(null, e.subarray(t, t + n.length + 1)) == n + "\0";
      }
    },
    br: {
      hasUnityMarker: function (e) {
        var t = "UnityWeb Compressed Content (brotli)";
        if (!e.length) {
          return false;
        }
        var n = e[0] & 1 ? e[0] & 14 ? 4 : 7 : 1;
        var r = e[0] & (1 << n) - 1;
        var o = 1 + (Math.log(t.length - 1) / Math.log(2) >> 3);
        commentOffset = 1 + n + 2 + 1 + 2 + (o << 3) + 7 >> 3;
        if (r == 17 || commentOffset > e.length) {
          return false;
        }
        for (var a = r + (6 + (o << 4) + (t.length - 1 << 6) << n), i = 0; i < commentOffset; i++, a >>>= 8) {
          if (e[i] != (a & 255)) {
            return false;
          }
        }
        return String.fromCharCode.apply(null, e.subarray(commentOffset, commentOffset + t.length)) == t;
      }
    }
  };
  function D() {
    var t;
    var e;
    var n;
    var s;
    var r;
    var o = performance.now();
    new Promise(function (a, e) {
      var i = document.createElement("script");
      i.src = m.frameworkUrl;
      i.onload = function () {
        if (typeof unityFramework == "undefined" || !unityFramework) {
          var e;
          var t = [["br", "br"], ["gz", "gzip"]];
          for (e in t) {
            var n;
            var r = t[e];
            if (m.frameworkUrl.endsWith("." + r[0])) {
              n = "Unable to parse " + m.frameworkUrl + "!";
              if (location.protocol == "file:") {
                c(n + " Loading pre-compressed (brotli or gzip) content via a file:// URL without a web server is not supported by this browser. Please use a local development web server to host compressed Unity content, or use the Unity Build and Run option.", "error");
                return;
              } else {
                n += " This can happen if build compression was enabled but web server hosting the content was misconfigured to not serve the file with HTTP Response Header \"Content-Encoding: " + r[1] + "\" present. Check browser Console and Devtools Network tab to debug.";
                if (r[0] == "br" && location.protocol == "http:") {
                  r = ["localhost", "127.0.0.1"].indexOf(location.hostname) != -1 ? "" : "Migrate your server to use HTTPS.";
                  n = /Firefox/.test(navigator.userAgent) ? "Unable to parse " + m.frameworkUrl + "!<br>If using custom web server, verify that web server is sending .br files with HTTP Response Header \"Content-Encoding: br\". Brotli compression may not be supported in Firefox over HTTP connections. " + r + " See <a href=\"https://bugzilla.mozilla.org/show_bug.cgi?id=1670675\">https://bugzilla.mozilla.org/show_bug.cgi?id=1670675</a> for more information." : "Unable to parse " + m.frameworkUrl + "!<br>If using custom web server, verify that web server is sending .br files with HTTP Response Header \"Content-Encoding: br\". Brotli compression may not be supported over HTTP connections. Migrate your server to use HTTPS.";
                }
                c(n, "error");
                return;
              }
            }
          }
          c("Unable to parse " + m.frameworkUrl + "! The file is corrupt, or compression was misconfigured? (check Content-Encoding HTTP Response Header on web server)", "error");
        }
        var o = unityFramework;
        unityFramework = null;
        i.onload = null;
        a(o);
      };
      i.onerror = function (e) {
        c("Unable to load file " + m.frameworkUrl + "! Check that the file exists on the remote server. (also check browser Console and Devtools Network tab to debug)", "error");
      };
      document.body.appendChild(i);
      m.deinitializers.push(function () {
        document.body.removeChild(i);
      });
    }).then(function (e) {
      m.webAssemblyTimeStart = performance.now();
      e(m);
      m.codeDownloadTimeEnd = performance.now() - o;
    });
    var p = performance.now();
    T(t = "dataUrl");
    e = m.cacheControl(m[t]);
    n = m.companyName && m.productName ? m.cachedFetch : m.fetchWithProgress;
    s = m[t];
    r = /file:\/\//.exec(s) ? "same-origin" : undefined;
    var a = n(m[t], {
      method: "GET",
      companyName: m.companyName,
      productName: m.productName,
      productVersion: m.productVersion,
      control: e,
      mode: r,
      onProgress: function (e) {
        T(t, e);
      }
    }).then(function (e) {
      var t;
      var n;
      var r;
      var o;
      var a;
      var i;
      if (A.gzip.hasUnityMarker(e.parsedBody)) {
        t = ["gzip", "gzip"];
      }
      if (t = A.br.hasUnityMarker(e.parsedBody) ? ["brotli", "br"] : t) {
        n = e.headers.get("Content-Type");
        r = e.headers.get("Content-Encoding");
        a = (o = e.headers.get("Content-Length")) > 0 && e.parsedBody.length != o;
        i = o > 0 && e.parsedBody.length == o;
        if (r != t[1]) {
          c("Failed to parse binary data file " + s + " (with \"Content-Type: " + n + "\"), because it is still " + t[0] + "-compressed. It should have been uncompressed by the browser, but it was unable to do so since the web server provided the compressed content without specifying the HTTP Response Header \"Content-Encoding: " + t[1] + "\" that would have informed the browser that decompression is needed. Please verify your web server hosting configuration to add the missing \"Content-Encoding: " + t[1] + "\" HTTP Response Header.", "error");
        } else {
          c(a ? "Web server configuration error: it looks like the web server has been misconfigured to double-compress the data file " + s + "! That is, it looks like the web browser has decompressed the file, but it is still in compressed form, suggesting that an already compressed file was compressed a second time. (Content-Length: " + o + ", obtained length: " + e.parsedBody.length + ")" : i ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && r == "gzip" && n == "application/octet-stream" ? "Unable to load content due to Apple Safari bug https://bugs.webkit.org/show_bug.cgi?id=247421 . To work around this issue, please reconfigure your web server to serve " + s + " with Content-Type: application/gzip instead of Content-Type: application/octet-stream" : "Malformed binary data? Received compressed data file " + s + ", with \"Content-Type: " + n + "\", \"Content-Encoding: " + t[1] + "\", \"Content-Length: " + o + "\", which the web browser should have decompressed, but it seemingly did not (received file size is the same as compressed file size was). Double check that the integrity of the file is intact." : "Malformed binary data URL " + s + ". No \"Content-Length\" HTTP Response header present. Check browser console for more information.", "error");
        }
        console.error("Malformed data? Downloaded binary data file " + s + " (ArrayBuffer size: " + e.parsedBody.length + ") and browser should have decompressed it, but it might have not. Dumping raw HTTP Response Headers if it might help debug:");
        e.headers.forEach(function (e, t) {
          console.error(t + ": " + e);
        });
      }
      return e.parsedBody;
    }).catch(function (e) {
      var t = "Failed to download file " + s;
      if (location.protocol == "file:") {
        c(t + ". Loading web pages via a file:// URL without a web server is not supported by this browser. Please use a local development web server to host Unity content, or use the Unity Build and Run option.", "error");
      } else {
        console.error(t);
      }
    });
    m.preRun.push(function () {
      m.addRunDependency("dataUrl");
      a.then(function (t) {
        var e = new TextDecoder("utf-8");
        var n = 0;
        function r() {
          var e = (t[n] | t[n + 1] << 8 | t[n + 2] << 16 | t[n + 3] << 24) >>> 0;
          n += 4;
          return e;
        }
        function o(e) {
          if (A.gzip.hasUnityMarker(t)) {
            throw e + ". Failed to parse binary data file, because it is still gzip-compressed and should have been uncompressed by the browser. Web server has likely provided gzip-compressed data without specifying the HTTP Response Header \"Content-Encoding: gzip\" with it to instruct the browser to decompress it. Please verify your web server hosting configuration.";
          }
          if (A.br.hasUnityMarker(t)) {
            throw e + ". Failed to parse binary data file, because it is still brotli-compressed and should have been uncompressed by the browser. Web server has likely provided brotli-compressed data without specifying the HTTP Response Header \"Content-Encoding: br\" with it to instruct the browser to decompress it. Please verify your web server hosting configuration.";
          }
          throw e;
        }
        var a = "UnityWebData1.0\0";
        var i = e.decode(t.subarray(0, a.length));
        if (i != a) {
          o("Unknown data format (id=\"" + i + "\")");
        }
        n += a.length;
        var s = r();
        for (n + s > t.length && o("Invalid binary data file header! (pos=" + n + ", headerSize=" + s + ", file length=" + t.length + ")"); n < s;) {
          var d = r();
          var c = r();
          if (d + c > t.length) {
            o("Invalid binary data file size! (offset=" + d + ", size=" + c + ", file length=" + t.length + ")");
          }
          var l = r();
          if (n + l > t.length) {
            o("Invalid binary data file path name! (pos=" + n + ", length=" + l + ", file length=" + t.length + ")");
          }
          var u = e.decode(t.subarray(n, n + l));
          n += l;
          for (var h = 0, f = u.indexOf("/", h) + 1; f > 0; h = f, f = u.indexOf("/", h) + 1) {
            m.FS_createPath(u.substring(0, h), u.substring(h, f - 1), true, true);
          }
          m.FS_createDataFile(u, null, t.subarray(d, d + c), true, true, true);
        }
        m.removeRunDependency("dataUrl");
        m.dataUrlLoadEndTime = performance.now() - p;
      });
    });
  }
  return new Promise(function (e, t) {
    var n;
    if (m.SystemInfo.hasWebGL) {
      if (m.SystemInfo.hasWebGL == 1) {
        n = "Your browser does not support graphics API \"WebGL 2\" which is required for this content.";
        if (m.SystemInfo.browser == "Safari" && parseInt(m.SystemInfo.browserVersion) < 15) {
          if (m.SystemInfo.mobile || navigator.maxTouchPoints > 1) {
            n += "\nUpgrade to iOS 15 or later.";
          } else {
            n += "\nUpgrade to Safari 15 or later.";
          }
        }
        t(n);
      } else if (m.SystemInfo.hasWasm) {
        if (m.SystemInfo.hasWasm2023) {
          m.startupErrorHandler = t;
          d(0);
          m.postRun.push(function () {
            d(1);
            m.WebPlayer.WaitForInitialization().then(function () {
              delete m.startupErrorHandler;
              e(C);
              m.pageStartupTime = performance.now();
            });
          });
          m.SystemInfo.hasWebGPU = false;
          Promise.resolve(false).then(function () {
            D();
          });
        } else {
          t("Your browser does not support WebAssembly 2023. Please update to Chrome ≥ 91 (May 2021), Firefox ≥ 89 (June 2021) or Safari ≥ 16.4 (March 2023). (failed " + m.SystemInfo.missingWasm2023Feature + ")");
        }
      } else {
        t("Your browser does not support WebAssembly.");
      }
    } else {
      t("Your browser does not support WebGL.");
    }
  });
}