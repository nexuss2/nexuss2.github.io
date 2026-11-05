// include: shell.js
// include: minimum_runtime_check.js
// end include: minimum_runtime_check.js
// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(moduleArg) => Promise<Module>
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
// port by TS (plz dont @) and NEXUS 
var Module = typeof Module != "undefined" ? Module : {};

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).
// Attempt to auto-detect the environment
var ENVIRONMENT_IS_WEB = !!globalThis.window;

var ENVIRONMENT_IS_WORKER = !!globalThis.WorkerGlobalScope;

// N.b. Electron.js environment is simultaneously a NODE-environment, but
// also a web environment.
var ENVIRONMENT_IS_NODE = globalThis.process?.versions?.node && globalThis.process?.type != "renderer";

var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

// Three configurations we can be running in:
// 1) We could be the application main() thread running in the main JS UI thread. (ENVIRONMENT_IS_WORKER == false and ENVIRONMENT_IS_PTHREAD == false)
// 2) We could be the application main() running directly in a worker. (ENVIRONMENT_IS_WORKER == true, ENVIRONMENT_IS_PTHREAD == false)
// 3) We could be an application pthread running in a worker. (ENVIRONMENT_IS_WORKER == true and ENVIRONMENT_IS_PTHREAD == true)
// The way we signal to a worker that it is hosting a pthread is to construct
// it with a specific name.
var ENVIRONMENT_IS_PTHREAD = ENVIRONMENT_IS_WORKER && globalThis.name == "em-pthread";

if (ENVIRONMENT_IS_NODE) {
  var worker_threads = require("node:worker_threads");
  globalThis.Worker = worker_threads.Worker;
  ENVIRONMENT_IS_WORKER = !worker_threads.isMainThread;
  // Under node we set `workerData` to `em-pthread` to signal that the worker
  // is hosting a pthread.
  ENVIRONMENT_IS_PTHREAD = ENVIRONMENT_IS_WORKER && worker_threads.workerData == "em-pthread";
}

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)
// include: /tmp/tmp2nl808ek.js
if (!Module["expectedDataFileDownloads"]) Module["expectedDataFileDownloads"] = 0;

Module["expectedDataFileDownloads"]++;

(() => {
  // Do not attempt to redownload the virtual filesystem data when in a pthread or a Wasm Worker context.
  var isPthread = typeof ENVIRONMENT_IS_PTHREAD != "undefined" && ENVIRONMENT_IS_PTHREAD;
  var isWasmWorker = typeof ENVIRONMENT_IS_WASM_WORKER != "undefined" && ENVIRONMENT_IS_WASM_WORKER;
  if (isPthread || isWasmWorker) return;
  var isNode = globalThis.process && globalThis.process.versions && globalThis.process.versions.node && globalThis.process.type != "renderer";
  async function loadPackage(metadata) {
    var PACKAGE_PATH = "";
    if (typeof window === "object") {
      PACKAGE_PATH = window["encodeURIComponent"](window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/")) + "/");
    } else if (typeof process === "undefined" && typeof location !== "undefined") {
      // web worker
      PACKAGE_PATH = encodeURIComponent(location.pathname.substring(0, location.pathname.lastIndexOf("/")) + "/");
    }
    var PACKAGE_NAME = "Minecraft.Client/Minecraft.Client.data";
    var REMOTE_PACKAGE_BASE = "Minecraft.Client.data";
    var REMOTE_PACKAGE_NAME = Module["locateFile"] ? Module["locateFile"](REMOTE_PACKAGE_BASE, "") : REMOTE_PACKAGE_BASE;
    var REMOTE_PACKAGE_SIZE = metadata["remote_package_size"];
    async function fetchRemotePackage(packageName, packageSize) {
      if (isNode) {
        var contents = require("fs").readFileSync(packageName);
        return new Uint8Array(contents).buffer;
      }
      if (!Module["dataFileDownloads"]) Module["dataFileDownloads"] = {};
      try {
        var response = await fetch(packageName);
      } catch (e) {
        throw new Error(`Network Error: ${packageName}`, {
          e
        });
      }
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.url}`);
      }
      const chunks = [];
      const headers = response.headers;
      const total = Number(headers.get("Content-Length") || packageSize);
      let loaded = 0;
      Module["setStatus"] && Module["setStatus"]("Downloading data...");
      const reader = response.body.getReader();
      while (1) {
        var {done, value} = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.length;
        Module["dataFileDownloads"][packageName] = {
          loaded,
          total
        };
        let totalLoaded = 0;
        let totalSize = 0;
        for (const download of Object.values(Module["dataFileDownloads"])) {
          totalLoaded += download.loaded;
          totalSize += download.total;
        }
        Module["setStatus"] && Module["setStatus"](`Downloading data... (${totalLoaded}/${totalSize})`);
      }
      const packageData = new Uint8Array(chunks.map(c => c.length).reduce((a, b) => a + b, 0));
      let offset = 0;
      for (const chunk of chunks) {
        packageData.set(chunk, offset);
        offset += chunk.length;
      }
      return packageData.buffer;
    }
    var fetchPromise;
    var fetched = Module["getPreloadedPackage"] && Module["getPreloadedPackage"](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE);
    if (!fetched) {
      // Note that we don't use await here because we want to execute the
      // the rest of this function immediately.
      fetchPromise = fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE);
    }
    async function runWithFS(Module) {
      function assert(check, msg) {
        if (!check) throw new Error(msg);
      }
      Module["FS_createPath"]("/", "Common", true, true);
      Module["FS_createPath"]("/Common", "DummyTexturePack", true, true);
      Module["FS_createPath"]("/Common/DummyTexturePack", "res", true, true);
      Module["FS_createPath"]("/Common", "Media", true, true);
      Module["FS_createPath"]("/Common/Media", "Graphics", true, true);
      Module["FS_createPath"]("/Common/Media/Graphics", "CraftIcons", true, true);
      Module["FS_createPath"]("/Common/Media/Graphics", "CraftScene", true, true);
      Module["FS_createPath"]("/Common/Media/Graphics", "HUD", true, true);
      Module["FS_createPath"]("/Common/Media/Graphics", "HowToPlay", true, true);
      Module["FS_createPath"]("/Common/Media/Graphics", "InGameInfo", true, true);
      Module["FS_createPath"]("/Common/Media/Graphics", "Leaderboard", true, true);
      Module["FS_createPath"]("/Common/Media/Graphics", "Logos", true, true);
      Module["FS_createPath"]("/Common/Media/Graphics", "PanelsAndTabs", true, true);
      Module["FS_createPath"]("/Common/Media/Graphics", "PotionEffect", true, true);
      Module["FS_createPath"]("/Common/Media/Graphics", "UpsellScreenshots", true, true);
      Module["FS_createPath"]("/Common/Media/Graphics", "X360ControllerIcons", true, true);
      Module["FS_createPath"]("/Common/Media", "Sound", true, true);
      Module["FS_createPath"]("/Common/Media/Sound", "Xbox", true, true);
      Module["FS_createPath"]("/Common/Media", "font", true, true);
      Module["FS_createPath"]("/Common/Media/font", "CHS", true, true);
      Module["FS_createPath"]("/Common/Media/font", "CHT", true, true);
      Module["FS_createPath"]("/Common/Media/font", "JPN", true, true);
      Module["FS_createPath"]("/Common/Media/font", "KOR", true, true);
      Module["FS_createPath"]("/Common/Media/font", "RU", true, true);
      Module["FS_createPath"]("/Common", "Trial", true, true);
      Module["FS_createPath"]("/Common", "music", true, true);
      Module["FS_createPath"]("/Common/music", "cds", true, true);
      Module["FS_createPath"]("/Common/music", "music", true, true);
      Module["FS_createPath"]("/Common", "res", true, true);
      Module["FS_createPath"]("/Common/res", "1_2_2", true, true);
      Module["FS_createPath"]("/Common/res/1_2_2", "achievement", true, true);
      Module["FS_createPath"]("/Common/res/1_2_2", "armor", true, true);
      Module["FS_createPath"]("/Common/res/1_2_2", "art", true, true);
      Module["FS_createPath"]("/Common/res/1_2_2", "environment", true, true);
      Module["FS_createPath"]("/Common/res/1_2_2", "font", true, true);
      Module["FS_createPath"]("/Common/res/1_2_2", "gui", true, true);
      Module["FS_createPath"]("/Common/res/1_2_2/gui", "creative_inventory", true, true);
      Module["FS_createPath"]("/Common/res/1_2_2", "item", true, true);
      Module["FS_createPath"]("/Common/res/1_2_2", "misc", true, true);
      Module["FS_createPath"]("/Common/res/1_2_2", "mob", true, true);
      Module["FS_createPath"]("/Common/res/1_2_2/mob", "enderdragon", true, true);
      Module["FS_createPath"]("/Common/res/1_2_2/mob", "villager", true, true);
      Module["FS_createPath"]("/Common/res/1_2_2", "terrain", true, true);
      Module["FS_createPath"]("/Common/res/1_2_2", "title", true, true);
      Module["FS_createPath"]("/Common/res/1_2_2/title", "bg", true, true);
      Module["FS_createPath"]("/Common/res", "TitleUpdate", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate", "DLC", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/DLC", "Candy", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/DLC/Candy", "Data", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/DLC", "Cartoon", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/DLC/Cartoon", "Data", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/DLC", "City", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/DLC/City", "Data", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/DLC", "Fantasy", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/DLC/Fantasy", "Data", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/DLC", "Festive", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/DLC/Festive", "Data", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/DLC", "Halloween", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/DLC/Halloween", "Data", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/DLC", "Halo", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/DLC/Halo", "Data", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/DLC", "MassEffect", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/DLC/MassEffect", "Data", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/DLC", "Natural", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/DLC/Natural", "Data", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/DLC", "Plastic", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/DLC/Plastic", "Data", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/DLC", "Skyrim", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/DLC/Skyrim", "Data", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/DLC", "Steampunk", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/DLC/Steampunk", "Data", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate", "GameRules", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate", "audio", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate", "res", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/res", "armor", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/res", "art", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/res", "font", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/res", "item", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/res", "misc", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/res", "mob", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/res/mob", "enderdragon", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/res/mob", "horse", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/res/mob/horse", "armor", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/res/mob", "villager", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/res/mob", "wither", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/res", "textures", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/res/textures", "blocks", true, true);
      Module["FS_createPath"]("/Common/res/TitleUpdate/res/textures", "items", true, true);
      Module["FS_createPath"]("/Common/res", "achievement", true, true);
      Module["FS_createPath"]("/Common/res", "armor", true, true);
      Module["FS_createPath"]("/Common/res", "art", true, true);
      Module["FS_createPath"]("/Common/res", "audio", true, true);
      Module["FS_createPath"]("/Common/res", "environment", true, true);
      Module["FS_createPath"]("/Common/res", "font", true, true);
      Module["FS_createPath"]("/Common/res", "gui", true, true);
      Module["FS_createPath"]("/Common/res", "item", true, true);
      Module["FS_createPath"]("/Common/res", "lang", true, true);
      Module["FS_createPath"]("/Common/res", "misc", true, true);
      Module["FS_createPath"]("/Common/res", "mob", true, true);
      Module["FS_createPath"]("/Common/res", "terrain", true, true);
      Module["FS_createPath"]("/Common/res", "title", true, true);
      for (var file of metadata["files"]) {
        var name = file["filename"];
        Module["addRunDependency"](`fp ${name}`);
      }
      async function processPackageData(arrayBuffer) {
        assert(arrayBuffer, "Loading data file failed.");
        assert(arrayBuffer.constructor.name === ArrayBuffer.name, "bad input to processPackageData " + arrayBuffer.constructor.name);
        var byteArray = new Uint8Array(arrayBuffer);
        var curr;
        // Reuse the bytearray from the XHR as the source for file reads.
        for (var file of metadata["files"]) {
          var name = file["filename"];
          var data = byteArray.subarray(file["start"], file["end"]);
          // canOwn this data in the filesystem, it is a slice into the heap that will never change
          Module["FS_createDataFile"](name, null, data, true, true, true);
          Module["removeRunDependency"](`fp ${name}`);
        }
        Module["removeRunDependency"]("datafile_Minecraft.Client/Minecraft.Client.data");
      }
      Module["addRunDependency"]("datafile_Minecraft.Client/Minecraft.Client.data");
      if (!Module["preloadResults"]) Module["preloadResults"] = {};
      Module["preloadResults"][PACKAGE_NAME] = {
        fromCache: false
      };
      if (!fetched) {
        fetched = await fetchPromise;
      }
      processPackageData(fetched);
    }
    if (Module["calledRun"]) {
      runWithFS(Module);
    } else {
      if (!Module["preRun"]) Module["preRun"] = [];
      Module["preRun"].push(runWithFS);
    }
  }
  loadPackage({
    "files": [ {
      "filename": "/Common/DummyTexturePack/res/TFSHOLDER.txt",
      "start": 0,
      "end": 99
    }, {
      "filename": "/Common/Media/AnvilMenu1080.swf",
      "start": 99,
      "end": 18767
    }, {
      "filename": "/Common/Media/AnvilMenu480.swf",
      "start": 18767,
      "end": 37434
    }, {
      "filename": "/Common/Media/AnvilMenu720.swf",
      "start": 37434,
      "end": 56113
    }, {
      "filename": "/Common/Media/AnvilMenuSplit1080.swf",
      "start": 56113,
      "end": 74788
    }, {
      "filename": "/Common/Media/AnvilMenuSplit720.swf",
      "start": 74788,
      "end": 93444
    }, {
      "filename": "/Common/Media/AnvilMenuVita.swf",
      "start": 93444,
      "end": 112205
    }, {
      "filename": "/Common/Media/BeaconMenu1080.swf",
      "start": 112205,
      "end": 130377
    }, {
      "filename": "/Common/Media/BeaconMenu480.swf",
      "start": 130377,
      "end": 148535
    }, {
      "filename": "/Common/Media/BeaconMenu720.swf",
      "start": 148535,
      "end": 166692
    }, {
      "filename": "/Common/Media/BeaconMenuSplit1080.swf",
      "start": 166692,
      "end": 184816
    }, {
      "filename": "/Common/Media/BeaconMenuSplit720.swf",
      "start": 184816,
      "end": 202996
    }, {
      "filename": "/Common/Media/BeaconMenuVita.swf",
      "start": 202996,
      "end": 221151
    }, {
      "filename": "/Common/Media/BrewingStandMenu1080.swf",
      "start": 221151,
      "end": 238795
    }, {
      "filename": "/Common/Media/BrewingStandMenu480.swf",
      "start": 238795,
      "end": 256492
    }, {
      "filename": "/Common/Media/BrewingStandMenu720.swf",
      "start": 256492,
      "end": 274120
    }, {
      "filename": "/Common/Media/BrewingStandMenuSplit1080.swf",
      "start": 274120,
      "end": 291831
    }, {
      "filename": "/Common/Media/BrewingStandMenuSplit720.swf",
      "start": 291831,
      "end": 309526
    }, {
      "filename": "/Common/Media/BrewingStandMenuVita.swf",
      "start": 309526,
      "end": 327230
    }, {
      "filename": "/Common/Media/ChestLargeMenu1080.swf",
      "start": 327230,
      "end": 343872
    }, {
      "filename": "/Common/Media/ChestLargeMenu480.swf",
      "start": 343872,
      "end": 360506
    }, {
      "filename": "/Common/Media/ChestLargeMenu720.swf",
      "start": 360506,
      "end": 377136
    }, {
      "filename": "/Common/Media/ChestLargeMenuSplit1080.swf",
      "start": 377136,
      "end": 393771
    }, {
      "filename": "/Common/Media/ChestLargeMenuSplit720.swf",
      "start": 393771,
      "end": 410404
    }, {
      "filename": "/Common/Media/ChestLargeMenuVita.swf",
      "start": 410404,
      "end": 427054
    }, {
      "filename": "/Common/Media/ChestMenu1080.swf",
      "start": 427054,
      "end": 443690
    }, {
      "filename": "/Common/Media/ChestMenu480.swf",
      "start": 443690,
      "end": 460319
    }, {
      "filename": "/Common/Media/ChestMenu720.swf",
      "start": 460319,
      "end": 476946
    }, {
      "filename": "/Common/Media/ChestMenuSplit1080.swf",
      "start": 476946,
      "end": 493573
    }, {
      "filename": "/Common/Media/ChestMenuSplit720.swf",
      "start": 493573,
      "end": 510188
    }, {
      "filename": "/Common/Media/ChestMenuVita.swf",
      "start": 510188,
      "end": 526819
    }, {
      "filename": "/Common/Media/ComponentLogo1080.swf",
      "start": 526819,
      "end": 527266
    }, {
      "filename": "/Common/Media/ComponentLogo480.swf",
      "start": 527266,
      "end": 527371
    }, {
      "filename": "/Common/Media/ComponentLogo720.swf",
      "start": 527371,
      "end": 527816
    }, {
      "filename": "/Common/Media/ComponentLogoSplit1080.swf",
      "start": 527816,
      "end": 528330
    }, {
      "filename": "/Common/Media/ComponentLogoSplit720.swf",
      "start": 528330,
      "end": 528445
    }, {
      "filename": "/Common/Media/ComponentLogoVita.swf",
      "start": 528445,
      "end": 528570
    }, {
      "filename": "/Common/Media/Controls1080.swf",
      "start": 528570,
      "end": 546664
    }, {
      "filename": "/Common/Media/Controls480.swf",
      "start": 546664,
      "end": 564038
    }, {
      "filename": "/Common/Media/Controls720.swf",
      "start": 564038,
      "end": 581534
    }, {
      "filename": "/Common/Media/ControlsRemotePlay1080.swf",
      "start": 581534,
      "end": 598510
    }, {
      "filename": "/Common/Media/ControlsSplit1080.swf",
      "start": 598510,
      "end": 615760
    }, {
      "filename": "/Common/Media/ControlsSplit720.swf",
      "start": 615760,
      "end": 633054
    }, {
      "filename": "/Common/Media/ControlsTVVita.swf",
      "start": 633054,
      "end": 652887
    }, {
      "filename": "/Common/Media/ControlsVita.swf",
      "start": 652887,
      "end": 669500
    }, {
      "filename": "/Common/Media/Crafting2x2Menu1080.swf",
      "start": 669500,
      "end": 689443
    }, {
      "filename": "/Common/Media/Crafting2x2Menu480.swf",
      "start": 689443,
      "end": 708168
    }, {
      "filename": "/Common/Media/Crafting2x2Menu720.swf",
      "start": 708168,
      "end": 726745
    }, {
      "filename": "/Common/Media/Crafting2x2MenuSplit1080.swf",
      "start": 726745,
      "end": 744561
    }, {
      "filename": "/Common/Media/Crafting2x2MenuSplit720.swf",
      "start": 744561,
      "end": 762424
    }, {
      "filename": "/Common/Media/Crafting2x2MenuVita.swf",
      "start": 762424,
      "end": 781946
    }, {
      "filename": "/Common/Media/Crafting3x3Menu1080.swf",
      "start": 781946,
      "end": 800562
    }, {
      "filename": "/Common/Media/Crafting3x3Menu480.swf",
      "start": 800562,
      "end": 818501
    }, {
      "filename": "/Common/Media/Crafting3x3Menu720.swf",
      "start": 818501,
      "end": 837158
    }, {
      "filename": "/Common/Media/Crafting3x3MenuSplit1080.swf",
      "start": 837158,
      "end": 856484
    }, {
      "filename": "/Common/Media/Crafting3x3MenuSplit720.swf",
      "start": 856484,
      "end": 874457
    }, {
      "filename": "/Common/Media/Crafting3x3MenuVita.swf",
      "start": 874457,
      "end": 894048
    }, {
      "filename": "/Common/Media/CreateWorldMenu1080.swf",
      "start": 894048,
      "end": 917765
    }, {
      "filename": "/Common/Media/CreateWorldMenu480.swf",
      "start": 917765,
      "end": 941489
    }, {
      "filename": "/Common/Media/CreateWorldMenu720.swf",
      "start": 941489,
      "end": 965296
    }, {
      "filename": "/Common/Media/CreateWorldMenuVita.swf",
      "start": 965296,
      "end": 989016
    }, {
      "filename": "/Common/Media/CreativeMenu1080.swf",
      "start": 989016,
      "end": 1007821
    }, {
      "filename": "/Common/Media/CreativeMenu480.swf",
      "start": 1007821,
      "end": 1026554
    }, {
      "filename": "/Common/Media/CreativeMenu720.swf",
      "start": 1026554,
      "end": 1045348
    }, {
      "filename": "/Common/Media/CreativeMenuSplit1080.swf",
      "start": 1045348,
      "end": 1064108
    }, {
      "filename": "/Common/Media/CreativeMenuSplit720.swf",
      "start": 1064108,
      "end": 1082841
    }, {
      "filename": "/Common/Media/CreativeMenuVita.swf",
      "start": 1082841,
      "end": 1102143
    }, {
      "filename": "/Common/Media/Credits1080.swf",
      "start": 1102143,
      "end": 1117176
    }, {
      "filename": "/Common/Media/Credits480.swf",
      "start": 1117176,
      "end": 1131836
    }, {
      "filename": "/Common/Media/Credits720.swf",
      "start": 1131836,
      "end": 1146442
    }, {
      "filename": "/Common/Media/CreditsVita.swf",
      "start": 1146442,
      "end": 1162627
    }, {
      "filename": "/Common/Media/DLCMainMenu1080.swf",
      "start": 1162627,
      "end": 1176741
    }, {
      "filename": "/Common/Media/DLCMainMenu480.swf",
      "start": 1176741,
      "end": 1190162
    }, {
      "filename": "/Common/Media/DLCMainMenu720.swf",
      "start": 1190162,
      "end": 1203147
    }, {
      "filename": "/Common/Media/DLCMainMenuVita.swf",
      "start": 1203147,
      "end": 1218272
    }, {
      "filename": "/Common/Media/DLCOffersMenu1080.swf",
      "start": 1218272,
      "end": 1235469
    }, {
      "filename": "/Common/Media/DLCOffersMenu480.swf",
      "start": 1235469,
      "end": 1253105
    }, {
      "filename": "/Common/Media/DLCOffersMenu720.swf",
      "start": 1253105,
      "end": 1270721
    }, {
      "filename": "/Common/Media/DLCOffersMenuVita.swf",
      "start": 1270721,
      "end": 1306172
    }, {
      "filename": "/Common/Media/DeathMenu1080.swf",
      "start": 1306172,
      "end": 1320005
    }, {
      "filename": "/Common/Media/DeathMenu480.swf",
      "start": 1320005,
      "end": 1333843
    }, {
      "filename": "/Common/Media/DeathMenu720.swf",
      "start": 1333843,
      "end": 1347676
    }, {
      "filename": "/Common/Media/DeathMenuSplit1080.swf",
      "start": 1347676,
      "end": 1361510
    }, {
      "filename": "/Common/Media/DeathMenuSplit720.swf",
      "start": 1361510,
      "end": 1375346
    }, {
      "filename": "/Common/Media/DeathMenuVita.swf",
      "start": 1375346,
      "end": 1389184
    }, {
      "filename": "/Common/Media/DebugCreateSchematic1080.swf",
      "start": 1389184,
      "end": 1405074
    }, {
      "filename": "/Common/Media/DebugCreateSchematic720.swf",
      "start": 1405074,
      "end": 1420967
    }, {
      "filename": "/Common/Media/DebugMenu1080.swf",
      "start": 1420967,
      "end": 1434287
    }, {
      "filename": "/Common/Media/DebugMenu720.swf",
      "start": 1434287,
      "end": 1447749
    }, {
      "filename": "/Common/Media/DebugOptionsMenu1080.swf",
      "start": 1447749,
      "end": 1462921
    }, {
      "filename": "/Common/Media/DebugOptionsMenu720.swf",
      "start": 1462921,
      "end": 1478181
    }, {
      "filename": "/Common/Media/DebugSetCamera1080.swf",
      "start": 1478181,
      "end": 1493339
    }, {
      "filename": "/Common/Media/DebugSetCamera720.swf",
      "start": 1493339,
      "end": 1508392
    }, {
      "filename": "/Common/Media/DebugUIConsoleComponent1080.swf",
      "start": 1508392,
      "end": 1511380
    }, {
      "filename": "/Common/Media/DebugUIConsoleComponent720.swf",
      "start": 1511380,
      "end": 1513941
    }, {
      "filename": "/Common/Media/DebugUIMarketingGuide1080.swf",
      "start": 1513941,
      "end": 1527951
    }, {
      "filename": "/Common/Media/DebugUIMarketingGuide720.swf",
      "start": 1527951,
      "end": 1542193
    }, {
      "filename": "/Common/Media/DispenserMenu1080.swf",
      "start": 1542193,
      "end": 1558905
    }, {
      "filename": "/Common/Media/DispenserMenu480.swf",
      "start": 1558905,
      "end": 1575615
    }, {
      "filename": "/Common/Media/DispenserMenu720.swf",
      "start": 1575615,
      "end": 1592321
    }, {
      "filename": "/Common/Media/DispenserMenuSplit1080.swf",
      "start": 1592321,
      "end": 1609050
    }, {
      "filename": "/Common/Media/DispenserMenuSplit720.swf",
      "start": 1609050,
      "end": 1625752
    }, {
      "filename": "/Common/Media/DispenserMenuVita.swf",
      "start": 1625752,
      "end": 1642468
    }, {
      "filename": "/Common/Media/EULA1080.swf",
      "start": 1642468,
      "end": 1656375
    }, {
      "filename": "/Common/Media/EULA480.swf",
      "start": 1656375,
      "end": 1670149
    }, {
      "filename": "/Common/Media/EULA720.swf",
      "start": 1670149,
      "end": 1684056
    }, {
      "filename": "/Common/Media/EULAVita.swf",
      "start": 1684056,
      "end": 1699896
    }, {
      "filename": "/Common/Media/EnchantingMenu1080.swf",
      "start": 1699896,
      "end": 1717210
    }, {
      "filename": "/Common/Media/EnchantingMenu480.swf",
      "start": 1717210,
      "end": 1734526
    }, {
      "filename": "/Common/Media/EnchantingMenu720.swf",
      "start": 1734526,
      "end": 1751814
    }, {
      "filename": "/Common/Media/EnchantingMenuSplit1080.swf",
      "start": 1751814,
      "end": 1769129
    }, {
      "filename": "/Common/Media/EnchantingMenuSplit720.swf",
      "start": 1769129,
      "end": 1786444
    }, {
      "filename": "/Common/Media/EnchantingMenuVita.swf",
      "start": 1786444,
      "end": 1803759
    }, {
      "filename": "/Common/Media/EndPoem1080.swf",
      "start": 1803759,
      "end": 1819206
    }, {
      "filename": "/Common/Media/EndPoem480.swf",
      "start": 1819206,
      "end": 1833846
    }, {
      "filename": "/Common/Media/EndPoem720.swf",
      "start": 1833846,
      "end": 1848871
    }, {
      "filename": "/Common/Media/EndPoemVita.swf",
      "start": 1848871,
      "end": 1870214
    }, {
      "filename": "/Common/Media/FireworksMenu1080.swf",
      "start": 1870214,
      "end": 1887701
    }, {
      "filename": "/Common/Media/FireworksMenu480.swf",
      "start": 1887701,
      "end": 1905184
    }, {
      "filename": "/Common/Media/FireworksMenu720.swf",
      "start": 1905184,
      "end": 1922666
    }, {
      "filename": "/Common/Media/FireworksMenuSplit1080.swf",
      "start": 1922666,
      "end": 1940166
    }, {
      "filename": "/Common/Media/FireworksMenuSplit720.swf",
      "start": 1940166,
      "end": 1957640
    }, {
      "filename": "/Common/Media/FireworksMenuVita.swf",
      "start": 1957640,
      "end": 1975119
    }, {
      "filename": "/Common/Media/FullscreenProgress1080.swf",
      "start": 1975119,
      "end": 1989918
    }, {
      "filename": "/Common/Media/FullscreenProgress480.swf",
      "start": 1989918,
      "end": 2003479
    }, {
      "filename": "/Common/Media/FullscreenProgress720.swf",
      "start": 2003479,
      "end": 2023260
    }, {
      "filename": "/Common/Media/FullscreenProgressSplit1080.swf",
      "start": 2023260,
      "end": 2037142
    }, {
      "filename": "/Common/Media/FullscreenProgressSplit720.swf",
      "start": 2037142,
      "end": 2050702
    }, {
      "filename": "/Common/Media/FullscreenProgressVita.swf",
      "start": 2050702,
      "end": 2066156
    }, {
      "filename": "/Common/Media/FurnaceMenu1080.swf",
      "start": 2066156,
      "end": 2083813
    }, {
      "filename": "/Common/Media/FurnaceMenu480.swf",
      "start": 2083813,
      "end": 2101456
    }, {
      "filename": "/Common/Media/FurnaceMenu720.swf",
      "start": 2101456,
      "end": 2119096
    }, {
      "filename": "/Common/Media/FurnaceMenuSplit1080.swf",
      "start": 2119096,
      "end": 2136734
    }, {
      "filename": "/Common/Media/FurnaceMenuSplit720.swf",
      "start": 2136734,
      "end": 2154371
    }, {
      "filename": "/Common/Media/FurnaceMenuVita.swf",
      "start": 2154371,
      "end": 2172032
    }, {
      "filename": "/Common/Media/GamertagSplit720.swf",
      "start": 2172032,
      "end": 2181092
    }, {
      "filename": "/Common/Media/Graphics/AnvilCross.png",
      "start": 2181092,
      "end": 2182182
    }, {
      "filename": "/Common/Media/Graphics/AnvilHammer.png",
      "start": 2182182,
      "end": 2183314
    }, {
      "filename": "/Common/Media/Graphics/AnvilPlus.png",
      "start": 2183314,
      "end": 2184264
    }, {
      "filename": "/Common/Media/Graphics/Armour_Slot_Body.png",
      "start": 2184264,
      "end": 2184539
    }, {
      "filename": "/Common/Media/Graphics/Armour_Slot_Feet.png",
      "start": 2184539,
      "end": 2184779
    }, {
      "filename": "/Common/Media/Graphics/Armour_Slot_Head.png",
      "start": 2184779,
      "end": 2185034
    }, {
      "filename": "/Common/Media/Graphics/Armour_Slot_Legs.png",
      "start": 2185034,
      "end": 2185251
    }, {
      "filename": "/Common/Media/Graphics/Arrow_Off.png",
      "start": 2185251,
      "end": 2185538
    }, {
      "filename": "/Common/Media/Graphics/Arrow_On.png",
      "start": 2185538,
      "end": 2185833
    }, {
      "filename": "/Common/Media/Graphics/Arrow_Small_Off.png",
      "start": 2185833,
      "end": 2186082
    }, {
      "filename": "/Common/Media/Graphics/Arrow_Small_On.png",
      "start": 2186082,
      "end": 2186344
    }, {
      "filename": "/Common/Media/Graphics/Beacon_1.png",
      "start": 2186344,
      "end": 2186670
    }, {
      "filename": "/Common/Media/Graphics/Beacon_2.png",
      "start": 2186670,
      "end": 2187034
    }, {
      "filename": "/Common/Media/Graphics/Beacon_3.png",
      "start": 2187034,
      "end": 2187413
    }, {
      "filename": "/Common/Media/Graphics/Beacon_4.png",
      "start": 2187413,
      "end": 2187744
    }, {
      "filename": "/Common/Media/Graphics/Beacon_Button_Cross.png",
      "start": 2187744,
      "end": 2188049
    }, {
      "filename": "/Common/Media/Graphics/Beacon_Button_Disabled.png",
      "start": 2188049,
      "end": 2188187
    }, {
      "filename": "/Common/Media/Graphics/Beacon_Button_Hover.png",
      "start": 2188187,
      "end": 2188329
    }, {
      "filename": "/Common/Media/Graphics/Beacon_Button_Normal.png",
      "start": 2188329,
      "end": 2188466
    }, {
      "filename": "/Common/Media/Graphics/Beacon_Button_Pressed.png",
      "start": 2188466,
      "end": 2188605
    }, {
      "filename": "/Common/Media/Graphics/Beacon_Button_Tick.png",
      "start": 2188605,
      "end": 2188846
    }, {
      "filename": "/Common/Media/Graphics/BrewingArrow_Off.png",
      "start": 2188846,
      "end": 2189056
    }, {
      "filename": "/Common/Media/Graphics/BrewingArrow_On.png",
      "start": 2189056,
      "end": 2189255
    }, {
      "filename": "/Common/Media/Graphics/BrewingArrow_Small_Off.png",
      "start": 2189255,
      "end": 2189791
    }, {
      "filename": "/Common/Media/Graphics/BrewingArrow_Small_On.png",
      "start": 2189791,
      "end": 2189965
    }, {
      "filename": "/Common/Media/Graphics/BrewingBubbles_Off.png",
      "start": 2189965,
      "end": 2190273
    }, {
      "filename": "/Common/Media/Graphics/BrewingBubbles_On.png",
      "start": 2190273,
      "end": 2190598
    }, {
      "filename": "/Common/Media/Graphics/BrewingBubbles_Small_Off.png",
      "start": 2190598,
      "end": 2190865
    }, {
      "filename": "/Common/Media/Graphics/BrewingBubbles_Small_On.png",
      "start": 2190865,
      "end": 2191141
    }, {
      "filename": "/Common/Media/Graphics/BrewingStand.png",
      "start": 2191141,
      "end": 2191982
    }, {
      "filename": "/Common/Media/Graphics/BrewingStand_small.png",
      "start": 2191982,
      "end": 2192604
    }, {
      "filename": "/Common/Media/Graphics/Controller_Message_Frame_L.png",
      "start": 2192604,
      "end": 2192848
    }, {
      "filename": "/Common/Media/Graphics/Controller_Quadrant_Icon_Empty.png",
      "start": 2192848,
      "end": 2193308
    }, {
      "filename": "/Common/Media/Graphics/Controller_Quadrant_Icon_Segment.png",
      "start": 2193308,
      "end": 2193632
    }, {
      "filename": "/Common/Media/Graphics/CraftIcons/icon_Materials.png",
      "start": 2193632,
      "end": 2202976
    }, {
      "filename": "/Common/Media/Graphics/CraftIcons/icon_Redstone_and_Transport.png",
      "start": 2202976,
      "end": 2212320
    }, {
      "filename": "/Common/Media/Graphics/CraftIcons/icon_armour.png",
      "start": 2212320,
      "end": 2213172
    }, {
      "filename": "/Common/Media/Graphics/CraftIcons/icon_brewing.png",
      "start": 2213172,
      "end": 2213718
    }, {
      "filename": "/Common/Media/Graphics/CraftIcons/icon_decoration.png",
      "start": 2213718,
      "end": 2214390
    }, {
      "filename": "/Common/Media/Graphics/CraftIcons/icon_food.png",
      "start": 2214390,
      "end": 2214988
    }, {
      "filename": "/Common/Media/Graphics/CraftIcons/icon_mechanisms.png",
      "start": 2214988,
      "end": 2215550
    }, {
      "filename": "/Common/Media/Graphics/CraftIcons/icon_misc.png",
      "start": 2215550,
      "end": 2224915
    }, {
      "filename": "/Common/Media/Graphics/CraftIcons/icon_structures.png",
      "start": 2224915,
      "end": 2226084
    }, {
      "filename": "/Common/Media/Graphics/CraftIcons/icon_tools.png",
      "start": 2226084,
      "end": 2227045
    }, {
      "filename": "/Common/Media/Graphics/CraftIcons/icon_transport.png",
      "start": 2227045,
      "end": 2227855
    }, {
      "filename": "/Common/Media/Graphics/CraftScene/Craft_Highlight_L_ExtraSmall.png",
      "start": 2227855,
      "end": 2228137
    }, {
      "filename": "/Common/Media/Graphics/CraftScene/Craft_Highlight_L_Small.png",
      "start": 2228137,
      "end": 2228523
    }, {
      "filename": "/Common/Media/Graphics/CraftScene/Crafting_2SlotLargeV.png",
      "start": 2228523,
      "end": 2229207
    }, {
      "filename": "/Common/Media/Graphics/CraftScene/Crafting_2SlotSmallV.png",
      "start": 2229207,
      "end": 2229520
    }, {
      "filename": "/Common/Media/Graphics/CraftScene/Crafting_3SlotLargeV.png",
      "start": 2229520,
      "end": 2230327
    }, {
      "filename": "/Common/Media/Graphics/CreditBackground.png",
      "start": 2230327,
      "end": 2844679
    }, {
      "filename": "/Common/Media/Graphics/DLCBackground.png",
      "start": 2844679,
      "end": 2927038
    }, {
      "filename": "/Common/Media/Graphics/DLC_Tick.png",
      "start": 2927038,
      "end": 2928302
    }, {
      "filename": "/Common/Media/Graphics/DLC_TickSmall.png",
      "start": 2928302,
      "end": 2928717
    }, {
      "filename": "/Common/Media/Graphics/DefaultPack_Comparison.png",
      "start": 2928717,
      "end": 2999102
    }, {
      "filename": "/Common/Media/Graphics/Dirt_Tile.png",
      "start": 2999102,
      "end": 2999946
    }, {
      "filename": "/Common/Media/Graphics/Enchant_Slot.png",
      "start": 2999946,
      "end": 3000573
    }, {
      "filename": "/Common/Media/Graphics/Enchant_Slot_Small.png",
      "start": 3000573,
      "end": 3001347
    }, {
      "filename": "/Common/Media/Graphics/EnchantmentButtonActive.png",
      "start": 3001347,
      "end": 3001544
    }, {
      "filename": "/Common/Media/Graphics/EnchantmentButtonActive_small.png",
      "start": 3001544,
      "end": 3001708
    }, {
      "filename": "/Common/Media/Graphics/EnchantmentButtonEmpty.png",
      "start": 3001708,
      "end": 3001905
    }, {
      "filename": "/Common/Media/Graphics/EnchantmentButtonEmpty_small.png",
      "start": 3001905,
      "end": 3002066
    }, {
      "filename": "/Common/Media/Graphics/EnchantmentButtonSelected.png",
      "start": 3002066,
      "end": 3002263
    }, {
      "filename": "/Common/Media/Graphics/EnchantmentButtonSelected_small.png",
      "start": 3002263,
      "end": 3002427
    }, {
      "filename": "/Common/Media/Graphics/Flame_Off.png",
      "start": 3002427,
      "end": 3002705
    }, {
      "filename": "/Common/Media/Graphics/Flame_Off_Small.png",
      "start": 3002705,
      "end": 3002958
    }, {
      "filename": "/Common/Media/Graphics/Flame_On.png",
      "start": 3002958,
      "end": 3003495
    }, {
      "filename": "/Common/Media/Graphics/Flame_On_Small.png",
      "start": 3003495,
      "end": 3003992
    }, {
      "filename": "/Common/Media/Graphics/HUD/DragonHealth_Empty.png",
      "start": 3003992,
      "end": 3004150
    }, {
      "filename": "/Common/Media/Graphics/HUD/DragonHealth_Empty2.png",
      "start": 3004150,
      "end": 3004353
    }, {
      "filename": "/Common/Media/Graphics/HUD/DragonHealth_Empty3.png",
      "start": 3004353,
      "end": 3019815
    }, {
      "filename": "/Common/Media/Graphics/HUD/DragonHealth_Empty4.png",
      "start": 3019815,
      "end": 3020095
    }, {
      "filename": "/Common/Media/Graphics/HUD/DragonHealth_Empty6.png",
      "start": 3020095,
      "end": 3035242
    }, {
      "filename": "/Common/Media/Graphics/HUD/DragonHealth_Full.png",
      "start": 3035242,
      "end": 3035406
    }, {
      "filename": "/Common/Media/Graphics/HUD/DragonHealth_Full2.png",
      "start": 3035406,
      "end": 3035614
    }, {
      "filename": "/Common/Media/Graphics/HUD/DragonHealth_Full3.png",
      "start": 3035614,
      "end": 3051067
    }, {
      "filename": "/Common/Media/Graphics/HUD/DragonHealth_Full4.png",
      "start": 3051067,
      "end": 3051362
    }, {
      "filename": "/Common/Media/Graphics/HUD/DragonHealth_Full6.png",
      "start": 3051362,
      "end": 3066530
    }, {
      "filename": "/Common/Media/Graphics/HUD/HUD_Air_Bubble.png",
      "start": 3066530,
      "end": 3066715
    }, {
      "filename": "/Common/Media/Graphics/HUD/HUD_Air_Pop.png",
      "start": 3066715,
      "end": 3066866
    }, {
      "filename": "/Common/Media/Graphics/HUD/HUD_Armour_Empty.png",
      "start": 3066866,
      "end": 3067025
    }, {
      "filename": "/Common/Media/Graphics/HUD/HUD_Armour_Full.png",
      "start": 3067025,
      "end": 3067215
    }, {
      "filename": "/Common/Media/Graphics/HUD/HUD_Armour_Half.png",
      "start": 3067215,
      "end": 3067411
    }, {
      "filename": "/Common/Media/Graphics/HUD/HUD_Crosshair.png",
      "start": 3067411,
      "end": 3067529
    }, {
      "filename": "/Common/Media/Graphics/HUD/HUD_Food_Background.png",
      "start": 3067529,
      "end": 3067698
    }, {
      "filename": "/Common/Media/Graphics/HUD/HUD_Food_Background_Flash.png",
      "start": 3067698,
      "end": 3067874
    }, {
      "filename": "/Common/Media/Graphics/HUD/HUD_Food_Background_Poison.png",
      "start": 3067874,
      "end": 3068066
    }, {
      "filename": "/Common/Media/Graphics/HUD/HUD_Food_Full.png",
      "start": 3068066,
      "end": 3068280
    }, {
      "filename": "/Common/Media/Graphics/HUD/HUD_Food_Full_Flash.png",
      "start": 3068280,
      "end": 3068499
    }, {
      "filename": "/Common/Media/Graphics/HUD/HUD_Food_Full_Poison.png",
      "start": 3068499,
      "end": 3068725
    }, {
      "filename": "/Common/Media/Graphics/HUD/HUD_Food_Full_Poison_Flash.png",
      "start": 3068725,
      "end": 3068943
    }, {
      "filename": "/Common/Media/Graphics/HUD/HUD_Food_Half.png",
      "start": 3068943,
      "end": 3069134
    }, {
      "filename": "/Common/Media/Graphics/HUD/HUD_Food_Half_Flash.png",
      "start": 3069134,
      "end": 3069329
    }, {
      "filename": "/Common/Media/Graphics/HUD/HUD_Food_Half_Poison.png",
      "start": 3069329,
      "end": 3069519
    }, {
      "filename": "/Common/Media/Graphics/HUD/HUD_Food_Half_Poison_Flash.png",
      "start": 3069519,
      "end": 3069710
    }, {
      "filename": "/Common/Media/Graphics/HUD/Health_Background.png",
      "start": 3069710,
      "end": 3069877
    }, {
      "filename": "/Common/Media/Graphics/HUD/Health_Background_Flash.png",
      "start": 3069877,
      "end": 3070047
    }, {
      "filename": "/Common/Media/Graphics/HUD/Health_Full.png",
      "start": 3070047,
      "end": 3070215
    }, {
      "filename": "/Common/Media/Graphics/HUD/Health_Full_Absorb.png",
      "start": 3070215,
      "end": 3070408
    }, {
      "filename": "/Common/Media/Graphics/HUD/Health_Full_Flash.png",
      "start": 3070408,
      "end": 3070587
    }, {
      "filename": "/Common/Media/Graphics/HUD/Health_Full_Poison.png",
      "start": 3070587,
      "end": 3070819
    }, {
      "filename": "/Common/Media/Graphics/HUD/Health_Full_Poison_Flash.png",
      "start": 3070819,
      "end": 3071008
    }, {
      "filename": "/Common/Media/Graphics/HUD/Health_Full_Wither.png",
      "start": 3071008,
      "end": 3071256
    }, {
      "filename": "/Common/Media/Graphics/HUD/Health_Full_Wither_Flash.png",
      "start": 3071256,
      "end": 3071453
    }, {
      "filename": "/Common/Media/Graphics/HUD/Health_Half.png",
      "start": 3071453,
      "end": 3071616
    }, {
      "filename": "/Common/Media/Graphics/HUD/Health_Half_Absorb.png",
      "start": 3071616,
      "end": 3071793
    }, {
      "filename": "/Common/Media/Graphics/HUD/Health_Half_Flash.png",
      "start": 3071793,
      "end": 3071959
    }, {
      "filename": "/Common/Media/Graphics/HUD/Health_Half_Poison.png",
      "start": 3071959,
      "end": 3072145
    }, {
      "filename": "/Common/Media/Graphics/HUD/Health_Half_Poison_Flash.png",
      "start": 3072145,
      "end": 3072319
    }, {
      "filename": "/Common/Media/Graphics/HUD/Health_Half_Wither.png",
      "start": 3072319,
      "end": 3072535
    }, {
      "filename": "/Common/Media/Graphics/HUD/Health_Half_Wither_Flash.png",
      "start": 3072535,
      "end": 3072729
    }, {
      "filename": "/Common/Media/Graphics/HUD/HorseHealth_Full.png",
      "start": 3072729,
      "end": 3072953
    }, {
      "filename": "/Common/Media/Graphics/HUD/HorseHealth_Full_Flash.png",
      "start": 3072953,
      "end": 3073183
    }, {
      "filename": "/Common/Media/Graphics/HUD/HorseHealth_Half.png",
      "start": 3073183,
      "end": 3073387
    }, {
      "filename": "/Common/Media/Graphics/HUD/HorseHealth_Half_Flash.png",
      "start": 3073387,
      "end": 3073589
    }, {
      "filename": "/Common/Media/Graphics/HUD/HorseJump_bar_empty.png",
      "start": 3073589,
      "end": 3073928
    }, {
      "filename": "/Common/Media/Graphics/HUD/HorseJump_bar_full.png",
      "start": 3073928,
      "end": 3075727
    }, {
      "filename": "/Common/Media/Graphics/HUD/experience_bar_empty.png",
      "start": 3075727,
      "end": 3075980
    }, {
      "filename": "/Common/Media/Graphics/HUD/experience_bar_full.png",
      "start": 3075980,
      "end": 3077810
    }, {
      "filename": "/Common/Media/Graphics/HUD/hotbar_item_back.png",
      "start": 3077810,
      "end": 3082200
    }, {
      "filename": "/Common/Media/Graphics/HUD/hotbar_item_selected.png",
      "start": 3082200,
      "end": 3082862
    }, {
      "filename": "/Common/Media/Graphics/Horse_Armor_Slot.png",
      "start": 3082862,
      "end": 3083060
    }, {
      "filename": "/Common/Media/Graphics/Horse_Saddle_Slot.png",
      "start": 3083060,
      "end": 3083279
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Anvil.png",
      "start": 3083279,
      "end": 3103151
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Anvil_Small.png",
      "start": 3103151,
      "end": 3113933
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Beacon.png",
      "start": 3113933,
      "end": 3131210
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Beacon_Small.png",
      "start": 3131210,
      "end": 3143058
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Breeding.png",
      "start": 3143058,
      "end": 3286940
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Breeding_Small.png",
      "start": 3286940,
      "end": 3361565
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Brewing.png",
      "start": 3361565,
      "end": 3374828
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Brewing_Small.png",
      "start": 3374828,
      "end": 3382360
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Chest.png",
      "start": 3382360,
      "end": 3405735
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Chest_Small.png",
      "start": 3405735,
      "end": 3418985
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_CraftTable.png",
      "start": 3418985,
      "end": 3465060
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_CraftTable_Small.png",
      "start": 3465060,
      "end": 3490620
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Crafting.png",
      "start": 3490620,
      "end": 3540867
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Crafting_Small.png",
      "start": 3540867,
      "end": 3568783
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Creative.png",
      "start": 3568783,
      "end": 3698019
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Creative_Small.png",
      "start": 3698019,
      "end": 3728297
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Dispenser.png",
      "start": 3728297,
      "end": 3747166
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Dispenser_Small.png",
      "start": 3747166,
      "end": 3759746
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Enchantment.png",
      "start": 3759746,
      "end": 3779298
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Enchantment_Small.png",
      "start": 3779298,
      "end": 3788459
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Enderchest.png",
      "start": 3788459,
      "end": 3850126
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Enderchest_small.png",
      "start": 3850126,
      "end": 3915230
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_FarmingAnimals.png",
      "start": 3915230,
      "end": 4217258
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_FarmingAnimals_Small.png",
      "start": 4217258,
      "end": 4360154
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Fireworks.png",
      "start": 4360154,
      "end": 4379676
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Fireworks_Small.png",
      "start": 4379676,
      "end": 4391217
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Furnace.png",
      "start": 4391217,
      "end": 4408924
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Furnace_Small.png",
      "start": 4408924,
      "end": 4422821
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_HUD.png",
      "start": 4422821,
      "end": 4437065
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_HUD_Small.png",
      "start": 4437065,
      "end": 4448325
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Hopper.png",
      "start": 4448325,
      "end": 4463470
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Hopper_Small.png",
      "start": 4463470,
      "end": 4472692
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Horses.png",
      "start": 4472692,
      "end": 4611183
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Horses_Small.png",
      "start": 4611183,
      "end": 4666042
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Inventory.png",
      "start": 4666042,
      "end": 4686606
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Inventory_Small.png",
      "start": 4686606,
      "end": 4702430
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_LargeChest.png",
      "start": 4702430,
      "end": 4728584
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_LargeChest_Small.png",
      "start": 4728584,
      "end": 4734709
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_NetherPortal.png",
      "start": 4734709,
      "end": 4952066
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_NetherPortal_Small.png",
      "start": 4952066,
      "end": 4994926
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_TheEnd.png",
      "start": 4994926,
      "end": 5415034
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_TheEnd_Small.png",
      "start": 5415034,
      "end": 5463783
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Trading.png",
      "start": 5463783,
      "end": 5489631
    }, {
      "filename": "/Common/Media/Graphics/HowToPlay/HowToPlay_Trading_Small.png",
      "start": 5489631,
      "end": 5500371
    }, {
      "filename": "/Common/Media/Graphics/IconHolder.png",
      "start": 5500371,
      "end": 5500590
    }, {
      "filename": "/Common/Media/Graphics/IconHolderRed.png",
      "start": 5500590,
      "end": 5500814
    }, {
      "filename": "/Common/Media/Graphics/IconHolderRed_Small.png",
      "start": 5500814,
      "end": 5501020
    }, {
      "filename": "/Common/Media/Graphics/IconHolder_Small.png",
      "start": 5501020,
      "end": 5501231
    }, {
      "filename": "/Common/Media/Graphics/InGameInfo/MapIcon_0.png",
      "start": 5501231,
      "end": 5501736
    }, {
      "filename": "/Common/Media/Graphics/InGameInfo/MapIcon_1.png",
      "start": 5501736,
      "end": 5502242
    }, {
      "filename": "/Common/Media/Graphics/InGameInfo/MapIcon_10.png",
      "start": 5502242,
      "end": 5502753
    }, {
      "filename": "/Common/Media/Graphics/InGameInfo/MapIcon_11.png",
      "start": 5502753,
      "end": 5503263
    }, {
      "filename": "/Common/Media/Graphics/InGameInfo/MapIcon_12.png",
      "start": 5503263,
      "end": 5503778
    }, {
      "filename": "/Common/Media/Graphics/InGameInfo/MapIcon_13.png",
      "start": 5503778,
      "end": 5504287
    }, {
      "filename": "/Common/Media/Graphics/InGameInfo/MapIcon_14.png",
      "start": 5504287,
      "end": 5504805
    }, {
      "filename": "/Common/Media/Graphics/InGameInfo/MapIcon_15.png",
      "start": 5504805,
      "end": 5505323
    }, {
      "filename": "/Common/Media/Graphics/InGameInfo/MapIcon_2.png",
      "start": 5505323,
      "end": 5505834
    }, {
      "filename": "/Common/Media/Graphics/InGameInfo/MapIcon_3.png",
      "start": 5505834,
      "end": 5506344
    }, {
      "filename": "/Common/Media/Graphics/InGameInfo/MapIcon_4.png",
      "start": 5506344,
      "end": 5506859
    }, {
      "filename": "/Common/Media/Graphics/InGameInfo/MapIcon_5.png",
      "start": 5506859,
      "end": 5507368
    }, {
      "filename": "/Common/Media/Graphics/InGameInfo/MapIcon_6.png",
      "start": 5507368,
      "end": 5507886
    }, {
      "filename": "/Common/Media/Graphics/InGameInfo/MapIcon_7.png",
      "start": 5507886,
      "end": 5508404
    }, {
      "filename": "/Common/Media/Graphics/InGameInfo/MapIcon_8.png",
      "start": 5508404,
      "end": 5508909
    }, {
      "filename": "/Common/Media/Graphics/InGameInfo/MapIcon_9.png",
      "start": 5508909,
      "end": 5509415
    }, {
      "filename": "/Common/Media/Graphics/InGameInfo/voiceMuted.png",
      "start": 5509415,
      "end": 5510240
    }, {
      "filename": "/Common/Media/Graphics/InGameInfo/voiceNotSpeaking.png",
      "start": 5510240,
      "end": 5510708
    }, {
      "filename": "/Common/Media/Graphics/InGameInfo/voiceSpeaking.png",
      "start": 5510708,
      "end": 5511167
    }, {
      "filename": "/Common/Media/Graphics/LayoutButton_Norm.png",
      "start": 5511167,
      "end": 5511948
    }, {
      "filename": "/Common/Media/Graphics/LayoutButton_Over.png",
      "start": 5511948,
      "end": 5512879
    }, {
      "filename": "/Common/Media/Graphics/Leaderboard/LeaderBoard_Icon_Climbed.png",
      "start": 5512879,
      "end": 5515926
    }, {
      "filename": "/Common/Media/Graphics/Leaderboard/LeaderBoard_Icon_Creeper.png",
      "start": 5515926,
      "end": 5519518
    }, {
      "filename": "/Common/Media/Graphics/Leaderboard/LeaderBoard_Icon_Fallen.png",
      "start": 5519518,
      "end": 5526480
    }, {
      "filename": "/Common/Media/Graphics/Leaderboard/LeaderBoard_Icon_Ghast.png",
      "start": 5526480,
      "end": 5530689
    }, {
      "filename": "/Common/Media/Graphics/Leaderboard/LeaderBoard_Icon_Portal.png",
      "start": 5530689,
      "end": 5534461
    }, {
      "filename": "/Common/Media/Graphics/Leaderboard/LeaderBoard_Icon_Skeleton.png",
      "start": 5534461,
      "end": 5537948
    }, {
      "filename": "/Common/Media/Graphics/Leaderboard/LeaderBoard_Icon_Slime.png",
      "start": 5537948,
      "end": 5542830
    }, {
      "filename": "/Common/Media/Graphics/Leaderboard/LeaderBoard_Icon_Spider.png",
      "start": 5542830,
      "end": 5547427
    }, {
      "filename": "/Common/Media/Graphics/Leaderboard/LeaderBoard_Icon_SpiderJockey.png",
      "start": 5547427,
      "end": 5552273
    }, {
      "filename": "/Common/Media/Graphics/Leaderboard/LeaderBoard_Icon_Swam.png",
      "start": 5552273,
      "end": 5556619
    }, {
      "filename": "/Common/Media/Graphics/Leaderboard/LeaderBoard_Icon_Walked.png",
      "start": 5556619,
      "end": 5560344
    }, {
      "filename": "/Common/Media/Graphics/Leaderboard/LeaderBoard_Icon_Zombie.png",
      "start": 5560344,
      "end": 5563762
    }, {
      "filename": "/Common/Media/Graphics/Leaderboard/LeaderBoard_Icon_ZombiePigman.png",
      "start": 5563762,
      "end": 5567647
    }, {
      "filename": "/Common/Media/Graphics/LeaderboardButton_Norm.png",
      "start": 5567647,
      "end": 5570480
    }, {
      "filename": "/Common/Media/Graphics/LeaderboardButton_Over.png",
      "start": 5570480,
      "end": 5574641
    }, {
      "filename": "/Common/Media/Graphics/ListButton_Norm.png",
      "start": 5574641,
      "end": 5578799
    }, {
      "filename": "/Common/Media/Graphics/ListButton_Over.png",
      "start": 5578799,
      "end": 5584845
    }, {
      "filename": "/Common/Media/Graphics/Logos/4JStudios_logo.png",
      "start": 5584845,
      "end": 5591391
    }, {
      "filename": "/Common/Media/Graphics/Logos/ESRB_10_Large.png",
      "start": 5591391,
      "end": 5677833
    }, {
      "filename": "/Common/Media/Graphics/Logos/MS_Studios_MC.png",
      "start": 5677833,
      "end": 5684836
    }, {
      "filename": "/Common/Media/Graphics/Logos/XBLA_MC.png",
      "start": 5684836,
      "end": 5692215
    }, {
      "filename": "/Common/Media/Graphics/Logos/mojang.png",
      "start": 5692215,
      "end": 5703039
    }, {
      "filename": "/Common/Media/Graphics/MSPoints.png",
      "start": 5703039,
      "end": 5703253
    }, {
      "filename": "/Common/Media/Graphics/MainMenuButton_Norm.png",
      "start": 5703253,
      "end": 5706049
    }, {
      "filename": "/Common/Media/Graphics/MainMenuButton_Over.png",
      "start": 5706049,
      "end": 5710066
    }, {
      "filename": "/Common/Media/Graphics/MenuTitle.png",
      "start": 5710066,
      "end": 5738407
    }, {
      "filename": "/Common/Media/Graphics/MinecraftBrokenIcon.png",
      "start": 5738407,
      "end": 5740611
    }, {
      "filename": "/Common/Media/Graphics/MinecraftIcon.png",
      "start": 5740611,
      "end": 5745703
    }, {
      "filename": "/Common/Media/Graphics/Padlock_Small.png",
      "start": 5745703,
      "end": 5746095
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Crafting_Panel.png",
      "start": 5746095,
      "end": 5748986
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Crafting_Panel2x2.png",
      "start": 5748986,
      "end": 5751675
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Crafting_Panel_Small.png",
      "start": 5751675,
      "end": 5753349
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Crafting_Panel_Small_2x2.png",
      "start": 5753349,
      "end": 5755013
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Creative_Panel_8.png",
      "start": 5755013,
      "end": 5757511
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Creative_Panel_8_Small.png",
      "start": 5757511,
      "end": 5758874
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/GameOptionsTabOn.png",
      "start": 5758874,
      "end": 5759552
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/GameOptionsTabOn_Small.png",
      "start": 5759552,
      "end": 5759919
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/MoreOptionsTabOff.png",
      "start": 5759919,
      "end": 5760597
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/MoreOptionsTabOff_Small.png",
      "start": 5760597,
      "end": 5760946
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Panel_BL.png",
      "start": 5760946,
      "end": 5761170
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Panel_BM.png",
      "start": 5761170,
      "end": 5761358
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Panel_BR.png",
      "start": 5761358,
      "end": 5761578
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Panel_Bot_L.png",
      "start": 5761578,
      "end": 5761778
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Panel_Bot_M.png",
      "start": 5761778,
      "end": 5761939
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Panel_Bot_R.png",
      "start": 5761939,
      "end": 5762139
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Panel_ML.png",
      "start": 5762139,
      "end": 5762325
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Panel_MM.png",
      "start": 5762325,
      "end": 5762499
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Panel_MR.png",
      "start": 5762499,
      "end": 5762688
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Panel_Mid_L.png",
      "start": 5762688,
      "end": 5762854
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Panel_Mid_M.png",
      "start": 5762854,
      "end": 5763008
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Panel_Mid_R.png",
      "start": 5763008,
      "end": 5763173
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Panel_Recess_Bot_L.png",
      "start": 5763173,
      "end": 5763368
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Panel_Recess_Bot_M.png",
      "start": 5763368,
      "end": 5763540
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Panel_Recess_Bot_R.png",
      "start": 5763540,
      "end": 5763730
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Panel_Recess_Mid_L.png",
      "start": 5763730,
      "end": 5763901
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Panel_Recess_Mid_M.png",
      "start": 5763901,
      "end": 5764055
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Panel_Recess_Mid_R.png",
      "start": 5764055,
      "end": 5764223
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Panel_Recess_Top_L.png",
      "start": 5764223,
      "end": 5764406
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Panel_Recess_Top_M.png",
      "start": 5764406,
      "end": 5764577
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Panel_Recess_Top_R.png",
      "start": 5764577,
      "end": 5764775
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Panel_TL.png",
      "start": 5764775,
      "end": 5764992
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Panel_TM.png",
      "start": 5764992,
      "end": 5765179
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Panel_TR.png",
      "start": 5765179,
      "end": 5765399
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Panel_Top_L.png",
      "start": 5765399,
      "end": 5765596
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Panel_Top_M.png",
      "start": 5765596,
      "end": 5765760
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Panel_Top_R.png",
      "start": 5765760,
      "end": 5765964
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/PointerTextPanel_BL.png",
      "start": 5765964,
      "end": 5766187
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/PointerTextPanel_BM.png",
      "start": 5766187,
      "end": 5766363
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/PointerTextPanel_BR.png",
      "start": 5766363,
      "end": 5766590
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/PointerTextPanel_ML.png",
      "start": 5766590,
      "end": 5766761
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/PointerTextPanel_MM.png",
      "start": 5766761,
      "end": 5766911
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/PointerTextPanel_MR.png",
      "start": 5766911,
      "end": 5767082
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/PointerTextPanel_TL.png",
      "start": 5767082,
      "end": 5767284
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/PointerTextPanel_TM.png",
      "start": 5767284,
      "end": 5767461
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/PointerTextPanel_TR.png",
      "start": 5767461,
      "end": 5767686
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/SkinSelect_TabBar.png",
      "start": 5767686,
      "end": 5768385
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/SkinSelect_TabBarSmall.png",
      "start": 5768385,
      "end": 5768815
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/SkinSelect_TabBarSmallPanel.png",
      "start": 5768815,
      "end": 5770407
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/SkinSelect_TabBarSmallPanel_Selected.png",
      "start": 5770407,
      "end": 5771993
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/SkinSelect_TabBarSmall_Selected.png",
      "start": 5771993,
      "end": 5772453
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/SkinSelect_TabBar_Selected.png",
      "start": 5772453,
      "end": 5773233
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/SkinSelect_TabNormal.png",
      "start": 5773233,
      "end": 5773601
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/SkinSelect_TabNormalSmall.png",
      "start": 5773601,
      "end": 5773876
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/SkinSelect_TabNormalSmall_Selected.png",
      "start": 5773876,
      "end": 5774151
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/SkinSelect_TabNormal_Selected.png",
      "start": 5774151,
      "end": 5774487
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/SkinSelect_TabOver.png",
      "start": 5774487,
      "end": 5774920
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/SkinSelect_TabOverSmall.png",
      "start": 5774920,
      "end": 5775227
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/SkinSelect_TabOverSmall_Selected.png",
      "start": 5775227,
      "end": 5775525
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/SkinSelect_TabOver_Selected.png",
      "start": 5775525,
      "end": 5775926
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Square_Recess_Bot_L.png",
      "start": 5775926,
      "end": 5776099
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Square_Recess_Bot_M.png",
      "start": 5776099,
      "end": 5776262
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Square_Recess_Bot_R.png",
      "start": 5776262,
      "end": 5776431
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Square_Recess_Mid_L.png",
      "start": 5776431,
      "end": 5776594
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Square_Recess_Mid_M.png",
      "start": 5776594,
      "end": 5776748
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Square_Recess_Mid_R.png",
      "start": 5776748,
      "end": 5776911
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Square_Recess_Top_L.png",
      "start": 5776911,
      "end": 5777078
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Square_Recess_Top_M.png",
      "start": 5777078,
      "end": 5777243
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Square_Recess_Top_R.png",
      "start": 5777243,
      "end": 5777419
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Tab_Creative8_L.png",
      "start": 5777419,
      "end": 5777798
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Tab_Creative8_M.png",
      "start": 5777798,
      "end": 5778174
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Tab_Creative8_R.png",
      "start": 5778174,
      "end": 5778545
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Tab_Creative8_Small_L.png",
      "start": 5778545,
      "end": 5778866
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Tab_Creative8_Small_M.png",
      "start": 5778866,
      "end": 5779187
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Tab_Creative8_Small_R.png",
      "start": 5779187,
      "end": 5779502
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Tab_Left.png",
      "start": 5779502,
      "end": 5779970
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Tab_Middle.png",
      "start": 5779970,
      "end": 5780458
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Tab_Right.png",
      "start": 5780458,
      "end": 5780915
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Tab_Small_Left.png",
      "start": 5780915,
      "end": 5781243
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Tab_Small_Middle.png",
      "start": 5781243,
      "end": 5781574
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/Tab_Small_Right.png",
      "start": 5781574,
      "end": 5781893
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/WorldOptionsTabOn.png",
      "start": 5781893,
      "end": 5782568
    }, {
      "filename": "/Common/Media/Graphics/PanelsAndTabs/WorldOptionsTabOn_Small.png",
      "start": 5782568,
      "end": 5782935
    }, {
      "filename": "/Common/Media/Graphics/Panorama_Background_N.png",
      "start": 5782935,
      "end": 5867677
    }, {
      "filename": "/Common/Media/Graphics/Panorama_Background_S.png",
      "start": 5867677,
      "end": 5985782
    }, {
      "filename": "/Common/Media/Graphics/Pointer.png",
      "start": 5985782,
      "end": 5986527
    }, {
      "filename": "/Common/Media/Graphics/PotionEffect/Potion_Effect_Icon_Blindness.png",
      "start": 5986527,
      "end": 6001783
    }, {
      "filename": "/Common/Media/Graphics/PotionEffect/Potion_Effect_Icon_Fire_Resistance.png",
      "start": 6001783,
      "end": 6017263
    }, {
      "filename": "/Common/Media/Graphics/PotionEffect/Potion_Effect_Icon_Haste.png",
      "start": 6017263,
      "end": 6032709
    }, {
      "filename": "/Common/Media/Graphics/PotionEffect/Potion_Effect_Icon_HealthBoost.png",
      "start": 6032709,
      "end": 6033127
    }, {
      "filename": "/Common/Media/Graphics/PotionEffect/Potion_Effect_Icon_Hunger.png",
      "start": 6033127,
      "end": 6048599
    }, {
      "filename": "/Common/Media/Graphics/PotionEffect/Potion_Effect_Icon_Invisibility.png",
      "start": 6048599,
      "end": 6063911
    }, {
      "filename": "/Common/Media/Graphics/PotionEffect/Potion_Effect_Icon_Jump_Boost.png",
      "start": 6063911,
      "end": 6079166
    }, {
      "filename": "/Common/Media/Graphics/PotionEffect/Potion_Effect_Icon_Mining_Fatigue.png",
      "start": 6079166,
      "end": 6094580
    }, {
      "filename": "/Common/Media/Graphics/PotionEffect/Potion_Effect_Icon_Nausea.png",
      "start": 6094580,
      "end": 6110002
    }, {
      "filename": "/Common/Media/Graphics/PotionEffect/Potion_Effect_Icon_Night_Vision.png",
      "start": 6110002,
      "end": 6125246
    }, {
      "filename": "/Common/Media/Graphics/PotionEffect/Potion_Effect_Icon_Poison.png",
      "start": 6125246,
      "end": 6140788
    }, {
      "filename": "/Common/Media/Graphics/PotionEffect/Potion_Effect_Icon_Regeneration.png",
      "start": 6140788,
      "end": 6156025
    }, {
      "filename": "/Common/Media/Graphics/PotionEffect/Potion_Effect_Icon_Resistance.png",
      "start": 6156025,
      "end": 6171448
    }, {
      "filename": "/Common/Media/Graphics/PotionEffect/Potion_Effect_Icon_Slowness.png",
      "start": 6171448,
      "end": 6186782
    }, {
      "filename": "/Common/Media/Graphics/PotionEffect/Potion_Effect_Icon_Speed.png",
      "start": 6186782,
      "end": 6202041
    }, {
      "filename": "/Common/Media/Graphics/PotionEffect/Potion_Effect_Icon_Strength.png",
      "start": 6202041,
      "end": 6217343
    }, {
      "filename": "/Common/Media/Graphics/PotionEffect/Potion_Effect_Icon_Water_Breathing.png",
      "start": 6217343,
      "end": 6232715
    }, {
      "filename": "/Common/Media/Graphics/PotionEffect/Potion_Effect_Icon_Weakness.png",
      "start": 6232715,
      "end": 6248011
    }, {
      "filename": "/Common/Media/Graphics/PotionEffect/Potion_Effect_Icon_Wither.png",
      "start": 6248011,
      "end": 6248782
    }, {
      "filename": "/Common/Media/Graphics/SaveArrow.png",
      "start": 6248782,
      "end": 6249128
    }, {
      "filename": "/Common/Media/Graphics/SaveChest.png",
      "start": 6249128,
      "end": 6251822
    }, {
      "filename": "/Common/Media/Graphics/SignEditBackground.png",
      "start": 6251822,
      "end": 6253697
    }, {
      "filename": "/Common/Media/Graphics/Slider_Button.png",
      "start": 6253697,
      "end": 6254014
    }, {
      "filename": "/Common/Media/Graphics/Slider_Track.png",
      "start": 6254014,
      "end": 6256171
    }, {
      "filename": "/Common/Media/Graphics/TexturePackIcon.png",
      "start": 6256171,
      "end": 6256938
    }, {
      "filename": "/Common/Media/Graphics/Tick.png",
      "start": 6256938,
      "end": 6257457
    }, {
      "filename": "/Common/Media/Graphics/Tickbox_Norm.png",
      "start": 6257457,
      "end": 6257661
    }, {
      "filename": "/Common/Media/Graphics/Tickbox_Over.png",
      "start": 6257661,
      "end": 6257866
    }, {
      "filename": "/Common/Media/Graphics/TutorialExitScreenshot.png",
      "start": 6257866,
      "end": 6318042
    }, {
      "filename": "/Common/Media/Graphics/UpsellScreenshots/Screenshot1.png",
      "start": 6318042,
      "end": 6963420
    }, {
      "filename": "/Common/Media/Graphics/UpsellScreenshots/Screenshot10.png",
      "start": 6963420,
      "end": 7176079
    }, {
      "filename": "/Common/Media/Graphics/UpsellScreenshots/Screenshot2.png",
      "start": 7176079,
      "end": 8270111
    }, {
      "filename": "/Common/Media/Graphics/UpsellScreenshots/Screenshot3.png",
      "start": 8270111,
      "end": 8760583
    }, {
      "filename": "/Common/Media/Graphics/UpsellScreenshots/Screenshot4.png",
      "start": 8760583,
      "end": 9546646
    }, {
      "filename": "/Common/Media/Graphics/UpsellScreenshots/Screenshot5.png",
      "start": 9546646,
      "end": 9949024
    }, {
      "filename": "/Common/Media/Graphics/UpsellScreenshots/Screenshot6.png",
      "start": 9949024,
      "end": 10654160
    }, {
      "filename": "/Common/Media/Graphics/UpsellScreenshots/Screenshot7.png",
      "start": 10654160,
      "end": 11341750
    }, {
      "filename": "/Common/Media/Graphics/UpsellScreenshots/Screenshot8.png",
      "start": 11341750,
      "end": 11763432
    }, {
      "filename": "/Common/Media/Graphics/UpsellScreenshots/Screenshot9.png",
      "start": 11763432,
      "end": 12407316
    }, {
      "filename": "/Common/Media/Graphics/Warning.png",
      "start": 12407316,
      "end": 12407536
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/360ctrl.png",
      "start": 12407536,
      "end": 12409964
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/ButtonA.png",
      "start": 12409964,
      "end": 12410571
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/ButtonB.png",
      "start": 12410571,
      "end": 12411175
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/ButtonBack.png",
      "start": 12411175,
      "end": 12411864
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/ButtonDpadD.png",
      "start": 12411864,
      "end": 12412497
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/ButtonDpadL.png",
      "start": 12412497,
      "end": 12413165
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/ButtonDpadR.png",
      "start": 12413165,
      "end": 12413965
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/ButtonDpadU.png",
      "start": 12413965,
      "end": 12414614
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/ButtonLS.png",
      "start": 12414614,
      "end": 12415721
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/ButtonLeftBumper.png",
      "start": 12415721,
      "end": 12416353
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/ButtonLeftBumper_TT.png",
      "start": 12416353,
      "end": 12416974
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/ButtonLeftStick.png",
      "start": 12416974,
      "end": 12417726
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/ButtonLeftStick_Navigate.png",
      "start": 12417726,
      "end": 12419019
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/ButtonLeftStick_sides.png",
      "start": 12419019,
      "end": 12420644
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/ButtonLeftTrigger.png",
      "start": 12420644,
      "end": 12421263
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/ButtonLeftTrigger_TT.png",
      "start": 12421263,
      "end": 12421923
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/ButtonRS.png",
      "start": 12421923,
      "end": 12423040
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/ButtonRS_TT.png",
      "start": 12423040,
      "end": 12424395
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/ButtonRightBumper.png",
      "start": 12424395,
      "end": 12425066
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/ButtonRightBumper_TT.png",
      "start": 12425066,
      "end": 12425758
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/ButtonRightStick.png",
      "start": 12425758,
      "end": 12426518
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/ButtonRightTrigger.png",
      "start": 12426518,
      "end": 12427099
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/ButtonRightTrigger_TT.png",
      "start": 12427099,
      "end": 12427704
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/ButtonStart.png",
      "start": 12427704,
      "end": 12428541
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/ButtonX.png",
      "start": 12428541,
      "end": 12429158
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/ButtonY.png",
      "start": 12429158,
      "end": 12429769
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/Legend_Button_Blu_Focus.png",
      "start": 12429769,
      "end": 12430075
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/Legend_Button_Blu_Normal.png",
      "start": 12430075,
      "end": 12430386
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/Legend_Button_Disable.png",
      "start": 12430386,
      "end": 12430692
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/Legend_Button_Green_Focus.png",
      "start": 12430692,
      "end": 12431005
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/Legend_Button_Green_Normal.png",
      "start": 12431005,
      "end": 12431316
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/Legend_Button_Red_Focus.png",
      "start": 12431316,
      "end": 12431623
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/Legend_Button_Red_Normal.png",
      "start": 12431623,
      "end": 12431905
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/Legend_Button_Yello_Focus.png",
      "start": 12431905,
      "end": 12432212
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/Legend_Button_Yello_Normal.png",
      "start": 12432212,
      "end": 12432521
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/a_graphic.png",
      "start": 12432521,
      "end": 12432728
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/b_graphic.png",
      "start": 12432728,
      "end": 12432930
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/x_graphic.png",
      "start": 12432930,
      "end": 12433136
    }, {
      "filename": "/Common/Media/Graphics/X360ControllerIcons/y_graphic.png",
      "start": 12433136,
      "end": 12433375
    }, {
      "filename": "/Common/Media/Graphics/icon_shank.png",
      "start": 12433375,
      "end": 12433617
    }, {
      "filename": "/Common/Media/Graphics/scrollDown.png",
      "start": 12433617,
      "end": 12433856
    }, {
      "filename": "/Common/Media/Graphics/scrollLeft.png",
      "start": 12433856,
      "end": 12434112
    }, {
      "filename": "/Common/Media/Graphics/scrollRight.png",
      "start": 12434112,
      "end": 12434367
    }, {
      "filename": "/Common/Media/Graphics/scrollUp.png",
      "start": 12434367,
      "end": 12434611
    }, {
      "filename": "/Common/Media/HTMLColours.col",
      "start": 12434611,
      "end": 12435449
    }, {
      "filename": "/Common/Media/HTMLColours.xml",
      "start": 12435449,
      "end": 12438668
    }, {
      "filename": "/Common/Media/HUD1080.swf",
      "start": 12438668,
      "end": 12450594
    }, {
      "filename": "/Common/Media/HUD480.swf",
      "start": 12450594,
      "end": 12462517
    }, {
      "filename": "/Common/Media/HUD720.swf",
      "start": 12462517,
      "end": 12474442
    }, {
      "filename": "/Common/Media/HUDSplit1080.swf",
      "start": 12474442,
      "end": 12486448
    }, {
      "filename": "/Common/Media/HUDSplit720.swf",
      "start": 12486448,
      "end": 12498424
    }, {
      "filename": "/Common/Media/HUDVita.swf",
      "start": 12498424,
      "end": 12510338
    }, {
      "filename": "/Common/Media/HelpAndOptionsMenu1080.swf",
      "start": 12510338,
      "end": 12523976
    }, {
      "filename": "/Common/Media/HelpAndOptionsMenu480.swf",
      "start": 12523976,
      "end": 12537615
    }, {
      "filename": "/Common/Media/HelpAndOptionsMenu720.swf",
      "start": 12537615,
      "end": 12551249
    }, {
      "filename": "/Common/Media/HelpAndOptionsMenuSplit1080.swf",
      "start": 12551249,
      "end": 12564860
    }, {
      "filename": "/Common/Media/HelpAndOptionsMenuSplit720.swf",
      "start": 12564860,
      "end": 12578465
    }, {
      "filename": "/Common/Media/HelpAndOptionsMenuVita.swf",
      "start": 12578465,
      "end": 12592436
    }, {
      "filename": "/Common/Media/HopperMenu1080.swf",
      "start": 12592436,
      "end": 12618158
    }, {
      "filename": "/Common/Media/HopperMenu480.swf",
      "start": 12618158,
      "end": 12635369
    }, {
      "filename": "/Common/Media/HopperMenu720.swf",
      "start": 12635369,
      "end": 12652586
    }, {
      "filename": "/Common/Media/HopperMenuSplit1080.swf",
      "start": 12652586,
      "end": 12669825
    }, {
      "filename": "/Common/Media/HopperMenuSplit720.swf",
      "start": 12669825,
      "end": 12687041
    }, {
      "filename": "/Common/Media/HopperMenuVita.swf",
      "start": 12687041,
      "end": 12704429
    }, {
      "filename": "/Common/Media/HorseInventoryMenu1080.swf",
      "start": 12704429,
      "end": 12722174
    }, {
      "filename": "/Common/Media/HorseInventoryMenu480.swf",
      "start": 12722174,
      "end": 12739924
    }, {
      "filename": "/Common/Media/HorseInventoryMenu720.swf",
      "start": 12739924,
      "end": 12757635
    }, {
      "filename": "/Common/Media/HorseInventoryMenuSplit1080.swf",
      "start": 12757635,
      "end": 12775467
    }, {
      "filename": "/Common/Media/HorseInventoryMenuSplit720.swf",
      "start": 12775467,
      "end": 12793211
    }, {
      "filename": "/Common/Media/HorseInventoryMenuVita.swf",
      "start": 12793211,
      "end": 12810974
    }, {
      "filename": "/Common/Media/HowToPlay1080.swf",
      "start": 12810974,
      "end": 12822738
    }, {
      "filename": "/Common/Media/HowToPlay480.swf",
      "start": 12822738,
      "end": 12834567
    }, {
      "filename": "/Common/Media/HowToPlay720.swf",
      "start": 12834567,
      "end": 12846400
    }, {
      "filename": "/Common/Media/HowToPlayMenu1080.swf",
      "start": 12846400,
      "end": 12860901
    }, {
      "filename": "/Common/Media/HowToPlayMenu480.swf",
      "start": 12860901,
      "end": 12875398
    }, {
      "filename": "/Common/Media/HowToPlayMenu720.swf",
      "start": 12875398,
      "end": 12889899
    }, {
      "filename": "/Common/Media/HowToPlayMenuSplit1080.swf",
      "start": 12889899,
      "end": 12904395
    }, {
      "filename": "/Common/Media/HowToPlayMenuSplit720.swf",
      "start": 12904395,
      "end": 12918888
    }, {
      "filename": "/Common/Media/HowToPlayMenuVita.swf",
      "start": 12918888,
      "end": 12933387
    }, {
      "filename": "/Common/Media/HowToPlaySplit1080.swf",
      "start": 12933387,
      "end": 12945127
    }, {
      "filename": "/Common/Media/HowToPlaySplit720.swf",
      "start": 12945127,
      "end": 12956928
    }, {
      "filename": "/Common/Media/HowToPlayVita.swf",
      "start": 12956928,
      "end": 12968918
    }, {
      "filename": "/Common/Media/InGameHostOptions1080.swf",
      "start": 12968918,
      "end": 12984754
    }, {
      "filename": "/Common/Media/InGameHostOptions480.swf",
      "start": 12984754,
      "end": 13000757
    }, {
      "filename": "/Common/Media/InGameHostOptions720.swf",
      "start": 13000757,
      "end": 13016701
    }, {
      "filename": "/Common/Media/InGameHostOptionsSplit1080.swf",
      "start": 13016701,
      "end": 13032604
    }, {
      "filename": "/Common/Media/InGameHostOptionsSplit720.swf",
      "start": 13032604,
      "end": 13048624
    }, {
      "filename": "/Common/Media/InGameHostOptionsVita.swf",
      "start": 13048624,
      "end": 13064625
    }, {
      "filename": "/Common/Media/InGameInfoMenu1080.swf",
      "start": 13064625,
      "end": 13078978
    }, {
      "filename": "/Common/Media/InGameInfoMenu480.swf",
      "start": 13078978,
      "end": 13093323
    }, {
      "filename": "/Common/Media/InGameInfoMenu720.swf",
      "start": 13093323,
      "end": 13107671
    }, {
      "filename": "/Common/Media/InGameInfoMenuSplit1080.swf",
      "start": 13107671,
      "end": 13122102
    }, {
      "filename": "/Common/Media/InGameInfoMenuSplit720.swf",
      "start": 13122102,
      "end": 13136522
    }, {
      "filename": "/Common/Media/InGameInfoMenuVita.swf",
      "start": 13136522,
      "end": 13150861
    }, {
      "filename": "/Common/Media/InGamePlayerOptions1080.swf",
      "start": 13150861,
      "end": 13167247
    }, {
      "filename": "/Common/Media/InGamePlayerOptions480.swf",
      "start": 13167247,
      "end": 13184024
    }, {
      "filename": "/Common/Media/InGamePlayerOptions720.swf",
      "start": 13184024,
      "end": 13200509
    }, {
      "filename": "/Common/Media/InGamePlayerOptionsSplit1080.swf",
      "start": 13200509,
      "end": 13217237
    }, {
      "filename": "/Common/Media/InGamePlayerOptionsSplit720.swf",
      "start": 13217237,
      "end": 13233730
    }, {
      "filename": "/Common/Media/InGamePlayerOptionsVita.swf",
      "start": 13233730,
      "end": 13250509
    }, {
      "filename": "/Common/Media/InGameTeleportMenu1080.swf",
      "start": 13250509,
      "end": 13271068
    }, {
      "filename": "/Common/Media/InGameTeleportMenu480.swf",
      "start": 13271068,
      "end": 13284379
    }, {
      "filename": "/Common/Media/InGameTeleportMenu720.swf",
      "start": 13284379,
      "end": 13297691
    }, {
      "filename": "/Common/Media/InGameTeleportMenuSplit1080.swf",
      "start": 13297691,
      "end": 13318357
    }, {
      "filename": "/Common/Media/InGameTeleportMenuSplit720.swf",
      "start": 13318357,
      "end": 13331750
    }, {
      "filename": "/Common/Media/InGameTeleportMenuVita.swf",
      "start": 13331750,
      "end": 13345059
    }, {
      "filename": "/Common/Media/Intro1080.swf",
      "start": 13345059,
      "end": 13689091
    }, {
      "filename": "/Common/Media/Intro480.swf",
      "start": 13689091,
      "end": 13780476
    }, {
      "filename": "/Common/Media/Intro720.swf",
      "start": 13780476,
      "end": 13870960
    }, {
      "filename": "/Common/Media/IntroVita.swf",
      "start": 13870960,
      "end": 13951499
    }, {
      "filename": "/Common/Media/InventoryMenu1080.swf",
      "start": 13951499,
      "end": 13970410
    }, {
      "filename": "/Common/Media/InventoryMenu480.swf",
      "start": 13970410,
      "end": 13989293
    }, {
      "filename": "/Common/Media/InventoryMenu720.swf",
      "start": 13989293,
      "end": 14008183
    }, {
      "filename": "/Common/Media/InventoryMenuSplit1080.swf",
      "start": 14008183,
      "end": 14027074
    }, {
      "filename": "/Common/Media/InventoryMenuSplit720.swf",
      "start": 14027074,
      "end": 14046048
    }, {
      "filename": "/Common/Media/InventoryMenuVita.swf",
      "start": 14046048,
      "end": 14064925
    }, {
      "filename": "/Common/Media/JoinMenu1080.swf",
      "start": 14064925,
      "end": 14079923
    }, {
      "filename": "/Common/Media/JoinMenu480.swf",
      "start": 14079923,
      "end": 14094901
    }, {
      "filename": "/Common/Media/JoinMenu720.swf",
      "start": 14094901,
      "end": 14109892
    }, {
      "filename": "/Common/Media/JoinMenuVita.swf",
      "start": 14109892,
      "end": 14124872
    }, {
      "filename": "/Common/Media/Keyboard1080.swf",
      "start": 14124872,
      "end": 14146124
    }, {
      "filename": "/Common/Media/KeyboardSplit1080.swf",
      "start": 14146124,
      "end": 14167055
    }, {
      "filename": "/Common/Media/LanguagesMenu1080.swf",
      "start": 14167055,
      "end": 14181478
    }, {
      "filename": "/Common/Media/LanguagesMenu480.swf",
      "start": 14181478,
      "end": 14195883
    }, {
      "filename": "/Common/Media/LanguagesMenu720.swf",
      "start": 14195883,
      "end": 14210294
    }, {
      "filename": "/Common/Media/LanguagesMenuSplit1080.swf",
      "start": 14210294,
      "end": 14224697
    }, {
      "filename": "/Common/Media/LanguagesMenuSplit720.swf",
      "start": 14224697,
      "end": 14239111
    }, {
      "filename": "/Common/Media/LanguagesMenuVita.swf",
      "start": 14239111,
      "end": 14253517
    }, {
      "filename": "/Common/Media/LaunchMoreOptionsMenu1080.swf",
      "start": 14253517,
      "end": 14274840
    }, {
      "filename": "/Common/Media/LaunchMoreOptionsMenu480.swf",
      "start": 14274840,
      "end": 14295789
    }, {
      "filename": "/Common/Media/LaunchMoreOptionsMenu720.swf",
      "start": 14295789,
      "end": 14316519
    }, {
      "filename": "/Common/Media/LaunchMoreOptionsMenuVita.swf",
      "start": 14316519,
      "end": 14337467
    }, {
      "filename": "/Common/Media/LeaderboardMenu1080.swf",
      "start": 14337467,
      "end": 14434599
    }, {
      "filename": "/Common/Media/LeaderboardMenu480.swf",
      "start": 14434599,
      "end": 14497766
    }, {
      "filename": "/Common/Media/LeaderboardMenu720.swf",
      "start": 14497766,
      "end": 14583497
    }, {
      "filename": "/Common/Media/LeaderboardMenuVita.swf",
      "start": 14583497,
      "end": 14648577
    }, {
      "filename": "/Common/Media/LoadMenu1080.swf",
      "start": 14648577,
      "end": 14671185
    }, {
      "filename": "/Common/Media/LoadMenu480.swf",
      "start": 14671185,
      "end": 14693714
    }, {
      "filename": "/Common/Media/LoadMenu720.swf",
      "start": 14693714,
      "end": 14716320
    }, {
      "filename": "/Common/Media/LoadMenuVita.swf",
      "start": 14716320,
      "end": 14738869
    }, {
      "filename": "/Common/Media/LoadOrJoinMenu1080.swf",
      "start": 14738869,
      "end": 14757096
    }, {
      "filename": "/Common/Media/LoadOrJoinMenu480.swf",
      "start": 14757096,
      "end": 14774859
    }, {
      "filename": "/Common/Media/LoadOrJoinMenu720.swf",
      "start": 14774859,
      "end": 14791011
    }, {
      "filename": "/Common/Media/LoadOrJoinMenuVita.swf",
      "start": 14791011,
      "end": 14808770
    }, {
      "filename": "/Common/Media/MainMenu1080.swf",
      "start": 14808770,
      "end": 14822500
    }, {
      "filename": "/Common/Media/MainMenu480.swf",
      "start": 14822500,
      "end": 14836232
    }, {
      "filename": "/Common/Media/MainMenu720.swf",
      "start": 14836232,
      "end": 14849963
    }, {
      "filename": "/Common/Media/MainMenuVita.swf",
      "start": 14849963,
      "end": 14864040
    }, {
      "filename": "/Common/Media/MediaLinux.arc",
      "start": 14864040,
      "end": 35492103
    }, {
      "filename": "/Common/Media/MenuBackground1080.swf",
      "start": 35492103,
      "end": 35492260
    }, {
      "filename": "/Common/Media/MenuBackground480.swf",
      "start": 35492260,
      "end": 35492605
    }, {
      "filename": "/Common/Media/MenuBackground720.swf",
      "start": 35492605,
      "end": 35492767
    }, {
      "filename": "/Common/Media/MenuBackgroundVita.swf",
      "start": 35492767,
      "end": 35492925
    }, {
      "filename": "/Common/Media/MessageBox1080.swf",
      "start": 35492925,
      "end": 35507635
    }, {
      "filename": "/Common/Media/MessageBox480.swf",
      "start": 35507635,
      "end": 35522301
    }, {
      "filename": "/Common/Media/MessageBox720.swf",
      "start": 35522301,
      "end": 35536992
    }, {
      "filename": "/Common/Media/MessageBoxSplit1080.swf",
      "start": 35536992,
      "end": 35551651
    }, {
      "filename": "/Common/Media/MessageBoxSplit720.swf",
      "start": 35551651,
      "end": 35566565
    }, {
      "filename": "/Common/Media/MessageBoxVita.swf",
      "start": 35566565,
      "end": 35581215
    }, {
      "filename": "/Common/Media/NewUpdateMessage1080.swf",
      "start": 35581215,
      "end": 35581427
    }, {
      "filename": "/Common/Media/NewUpdateMessage480.swf",
      "start": 35581427,
      "end": 35581648
    }, {
      "filename": "/Common/Media/NewUpdateMessage720.swf",
      "start": 35581648,
      "end": 35581854
    }, {
      "filename": "/Common/Media/NewUpdateMessageVita.swf",
      "start": 35581854,
      "end": 35582067
    }, {
      "filename": "/Common/Media/Panorama1080.swf",
      "start": 35582067,
      "end": 35594432
    }, {
      "filename": "/Common/Media/Panorama480.swf",
      "start": 35594432,
      "end": 35606802
    }, {
      "filename": "/Common/Media/Panorama720.swf",
      "start": 35606802,
      "end": 35619165
    }, {
      "filename": "/Common/Media/PanoramaSplit1080.swf",
      "start": 35619165,
      "end": 35631529
    }, {
      "filename": "/Common/Media/PanoramaSplit720.swf",
      "start": 35631529,
      "end": 35643894
    }, {
      "filename": "/Common/Media/PanoramaVita.swf",
      "start": 35643894,
      "end": 35680474
    }, {
      "filename": "/Common/Media/PauseMenu1080.swf",
      "start": 35680474,
      "end": 35694041
    }, {
      "filename": "/Common/Media/PauseMenu480.swf",
      "start": 35694041,
      "end": 35707611
    }, {
      "filename": "/Common/Media/PauseMenu720.swf",
      "start": 35707611,
      "end": 35721176
    }, {
      "filename": "/Common/Media/PauseMenuSplit1080.swf",
      "start": 35721176,
      "end": 35734710
    }, {
      "filename": "/Common/Media/PauseMenuSplit720.swf",
      "start": 35734710,
      "end": 35748245
    }, {
      "filename": "/Common/Media/PauseMenuVita.swf",
      "start": 35748245,
      "end": 35762151
    }, {
      "filename": "/Common/Media/PressStartToPlay1080.swf",
      "start": 35762151,
      "end": 35777474
    }, {
      "filename": "/Common/Media/PressStartToPlay480.swf",
      "start": 35777474,
      "end": 35780758
    }, {
      "filename": "/Common/Media/PressStartToPlay720.swf",
      "start": 35780758,
      "end": 35795924
    }, {
      "filename": "/Common/Media/PressStartToPlayVita.swf",
      "start": 35795924,
      "end": 35799211
    }, {
      "filename": "/Common/Media/QuadrantSignin1080.swf",
      "start": 35799211,
      "end": 35818631
    }, {
      "filename": "/Common/Media/QuadrantSignin720.swf",
      "start": 35818631,
      "end": 35838029
    }, {
      "filename": "/Common/Media/ReinstallMenu1080.swf",
      "start": 35838029,
      "end": 35851751
    }, {
      "filename": "/Common/Media/ReinstallMenu480.swf",
      "start": 35851751,
      "end": 35865439
    }, {
      "filename": "/Common/Media/ReinstallMenu720.swf",
      "start": 35865439,
      "end": 35879070
    }, {
      "filename": "/Common/Media/ReinstallMenuSplit1080.swf",
      "start": 35879070,
      "end": 35892766
    }, {
      "filename": "/Common/Media/ReinstallMenuSplit720.swf",
      "start": 35892766,
      "end": 35906459
    }, {
      "filename": "/Common/Media/ReinstallMenuVita.swf",
      "start": 35906459,
      "end": 35920145
    }, {
      "filename": "/Common/Media/SaveMenu1080.swf",
      "start": 35920145,
      "end": 35937885
    }, {
      "filename": "/Common/Media/SaveMessage1080.swf",
      "start": 35937885,
      "end": 35950280
    }, {
      "filename": "/Common/Media/SaveMessage480.swf",
      "start": 35950280,
      "end": 35962623
    }, {
      "filename": "/Common/Media/SaveMessage720.swf",
      "start": 35962623,
      "end": 35974969
    }, {
      "filename": "/Common/Media/SaveMessageVita.swf",
      "start": 35974969,
      "end": 35988021
    }, {
      "filename": "/Common/Media/SettingsAudioMenu1080.swf",
      "start": 35988021,
      "end": 36001551
    }, {
      "filename": "/Common/Media/SettingsAudioMenu480.swf",
      "start": 36001551,
      "end": 36015199
    }, {
      "filename": "/Common/Media/SettingsAudioMenu720.swf",
      "start": 36015199,
      "end": 36028848
    }, {
      "filename": "/Common/Media/SettingsAudioMenuSplit1080.swf",
      "start": 36028848,
      "end": 36042373
    }, {
      "filename": "/Common/Media/SettingsAudioMenuSplit720.swf",
      "start": 36042373,
      "end": 36056019
    }, {
      "filename": "/Common/Media/SettingsAudioMenuVita.swf",
      "start": 36056019,
      "end": 36069745
    }, {
      "filename": "/Common/Media/SettingsControlMenu1080.swf",
      "start": 36069745,
      "end": 36083289
    }, {
      "filename": "/Common/Media/SettingsControlMenu480.swf",
      "start": 36083289,
      "end": 36096963
    }, {
      "filename": "/Common/Media/SettingsControlMenu720.swf",
      "start": 36096963,
      "end": 36110629
    }, {
      "filename": "/Common/Media/SettingsControlMenuSplit1080.swf",
      "start": 36110629,
      "end": 36124174
    }, {
      "filename": "/Common/Media/SettingsControlMenuSplit720.swf",
      "start": 36124174,
      "end": 36137844
    }, {
      "filename": "/Common/Media/SettingsControlMenuVita.swf",
      "start": 36137844,
      "end": 36151516
    }, {
      "filename": "/Common/Media/SettingsGraphicsMenu1080.swf",
      "start": 36151516,
      "end": 36166195
    }, {
      "filename": "/Common/Media/SettingsGraphicsMenu480.swf",
      "start": 36166195,
      "end": 36181097
    }, {
      "filename": "/Common/Media/SettingsGraphicsMenu720.swf",
      "start": 36181097,
      "end": 36195993
    }, {
      "filename": "/Common/Media/SettingsGraphicsMenuSplit1080.swf",
      "start": 36195993,
      "end": 36210738
    }, {
      "filename": "/Common/Media/SettingsGraphicsMenuSplit720.swf",
      "start": 36210738,
      "end": 36225641
    }, {
      "filename": "/Common/Media/SettingsGraphicsMenuVita.swf",
      "start": 36225641,
      "end": 36240539
    }, {
      "filename": "/Common/Media/SettingsMenu1080.swf",
      "start": 36240539,
      "end": 36254106
    }, {
      "filename": "/Common/Media/SettingsMenu480.swf",
      "start": 36254106,
      "end": 36267675
    }, {
      "filename": "/Common/Media/SettingsMenu720.swf",
      "start": 36267675,
      "end": 36281239
    }, {
      "filename": "/Common/Media/SettingsMenuSplit1080.swf",
      "start": 36281239,
      "end": 36294773
    }, {
      "filename": "/Common/Media/SettingsMenuSplit720.swf",
      "start": 36294773,
      "end": 36308307
    }, {
      "filename": "/Common/Media/SettingsMenuVita.swf",
      "start": 36308307,
      "end": 36322213
    }, {
      "filename": "/Common/Media/SettingsOptionsMenu1080.swf",
      "start": 36322213,
      "end": 36338448
    }, {
      "filename": "/Common/Media/SettingsOptionsMenu480.swf",
      "start": 36338448,
      "end": 36354874
    }, {
      "filename": "/Common/Media/SettingsOptionsMenu720.swf",
      "start": 36354874,
      "end": 36371301
    }, {
      "filename": "/Common/Media/SettingsOptionsMenuSplit1080.swf",
      "start": 36371301,
      "end": 36387100
    }, {
      "filename": "/Common/Media/SettingsOptionsMenuSplit720.swf",
      "start": 36387100,
      "end": 36403038
    }, {
      "filename": "/Common/Media/SettingsOptionsMenuVita.swf",
      "start": 36403038,
      "end": 36419461
    }, {
      "filename": "/Common/Media/SettingsUIMenu1080.swf",
      "start": 36419461,
      "end": 36434380
    }, {
      "filename": "/Common/Media/SettingsUIMenu480.swf",
      "start": 36434380,
      "end": 36449506
    }, {
      "filename": "/Common/Media/SettingsUIMenu720.swf",
      "start": 36449506,
      "end": 36464639
    }, {
      "filename": "/Common/Media/SettingsUIMenuSplit1080.swf",
      "start": 36464639,
      "end": 36479622
    }, {
      "filename": "/Common/Media/SettingsUIMenuSplit720.swf",
      "start": 36479622,
      "end": 36494744
    }, {
      "filename": "/Common/Media/SettingsUIMenuVita.swf",
      "start": 36494744,
      "end": 36509728
    }, {
      "filename": "/Common/Media/SignEntryMenu1080.swf",
      "start": 36509728,
      "end": 36522850
    }, {
      "filename": "/Common/Media/SignEntryMenu480.swf",
      "start": 36522850,
      "end": 36536003
    }, {
      "filename": "/Common/Media/SignEntryMenu720.swf",
      "start": 36536003,
      "end": 36549103
    }, {
      "filename": "/Common/Media/SignEntryMenuSplit1080.swf",
      "start": 36549103,
      "end": 36562269
    }, {
      "filename": "/Common/Media/SignEntryMenuSplit720.swf",
      "start": 36562269,
      "end": 36575379
    }, {
      "filename": "/Common/Media/SignEntryMenuVita.swf",
      "start": 36575379,
      "end": 36588777
    }, {
      "filename": "/Common/Media/SkinSelectMenu1080.swf",
      "start": 36588777,
      "end": 36607323
    }, {
      "filename": "/Common/Media/SkinSelectMenu480.swf",
      "start": 36607323,
      "end": 36625211
    }, {
      "filename": "/Common/Media/SkinSelectMenu720.swf",
      "start": 36625211,
      "end": 36643709
    }, {
      "filename": "/Common/Media/SkinSelectMenuSplit1080.swf",
      "start": 36643709,
      "end": 36662129
    }, {
      "filename": "/Common/Media/SkinSelectMenuSplit720.swf",
      "start": 36662129,
      "end": 36680178
    }, {
      "filename": "/Common/Media/SkinSelectMenuVita.swf",
      "start": 36680178,
      "end": 36698474
    }, {
      "filename": "/Common/Media/SocialPost1080.swf",
      "start": 36698474,
      "end": 36712488
    }, {
      "filename": "/Common/Media/SocialPost480.swf",
      "start": 36712488,
      "end": 36726107
    }, {
      "filename": "/Common/Media/SocialPost720.swf",
      "start": 36726107,
      "end": 36739713
    }, {
      "filename": "/Common/Media/SocialPostSplit1080.swf",
      "start": 36739713,
      "end": 36753728
    }, {
      "filename": "/Common/Media/SocialPostSplit720.swf",
      "start": 36753728,
      "end": 36767249
    }, {
      "filename": "/Common/Media/SocialPostVita.swf",
      "start": 36767249,
      "end": 36781442
    }, {
      "filename": "/Common/Media/Sound/MenuSounds.xap",
      "start": 36781442,
      "end": 36799073
    }, {
      "filename": "/Common/Media/Sound/Xbox/MenuSounds.xgs",
      "start": 36799073,
      "end": 36799513
    }, {
      "filename": "/Common/Media/Sound/Xbox/MenuSounds.xsb",
      "start": 36799513,
      "end": 36800003
    }, {
      "filename": "/Common/Media/Sound/Xbox/MenuSounds.xwb",
      "start": 36800003,
      "end": 36818435
    }, {
      "filename": "/Common/Media/Sound/btn_Back.wav",
      "start": 36818435,
      "end": 36865847
    }, {
      "filename": "/Common/Media/Sound/click.wav",
      "start": 36865847,
      "end": 36915219
    }, {
      "filename": "/Common/Media/Sound/pop.wav",
      "start": 36915219,
      "end": 36930603
    }, {
      "filename": "/Common/Media/Sound/wood click.wav",
      "start": 36930603,
      "end": 36944515
    }, {
      "filename": "/Common/Media/Timer1080.swf",
      "start": 36944515,
      "end": 36945540
    }, {
      "filename": "/Common/Media/Timer480.swf",
      "start": 36945540,
      "end": 36946507
    }, {
      "filename": "/Common/Media/Timer720.swf",
      "start": 36946507,
      "end": 36947474
    }, {
      "filename": "/Common/Media/TimerSplit1080.swf",
      "start": 36947474,
      "end": 36948500
    }, {
      "filename": "/Common/Media/TimerSplit720.swf",
      "start": 36948500,
      "end": 36949466
    }, {
      "filename": "/Common/Media/TimerVita.swf",
      "start": 36949466,
      "end": 36950442
    }, {
      "filename": "/Common/Media/ToolTips1080.swf",
      "start": 36950442,
      "end": 36966266
    }, {
      "filename": "/Common/Media/ToolTips480.swf",
      "start": 36966266,
      "end": 36982087
    }, {
      "filename": "/Common/Media/ToolTips720.swf",
      "start": 36982087,
      "end": 36997907
    }, {
      "filename": "/Common/Media/ToolTipsSplit1080.swf",
      "start": 36997907,
      "end": 37013734
    }, {
      "filename": "/Common/Media/ToolTipsSplit720.swf",
      "start": 37013734,
      "end": 37029544
    }, {
      "filename": "/Common/Media/ToolTipsVita.swf",
      "start": 37029544,
      "end": 37045540
    }, {
      "filename": "/Common/Media/TradingMenu1080.swf",
      "start": 37045540,
      "end": 37063740
    }, {
      "filename": "/Common/Media/TradingMenu480.swf",
      "start": 37063740,
      "end": 37081949
    }, {
      "filename": "/Common/Media/TradingMenu720.swf",
      "start": 37081949,
      "end": 37100159
    }, {
      "filename": "/Common/Media/TradingMenuSplit1080.swf",
      "start": 37100159,
      "end": 37118391
    }, {
      "filename": "/Common/Media/TradingMenuSplit720.swf",
      "start": 37118391,
      "end": 37136612
    }, {
      "filename": "/Common/Media/TradingMenuVita.swf",
      "start": 37136612,
      "end": 37154838
    }, {
      "filename": "/Common/Media/TrialExitUpsell480.swf",
      "start": 37154838,
      "end": 37155485
    }, {
      "filename": "/Common/Media/TrialExitUpsell720.swf",
      "start": 37155485,
      "end": 37156119
    }, {
      "filename": "/Common/Media/TutorialPopup1080.swf",
      "start": 37156119,
      "end": 37171236
    }, {
      "filename": "/Common/Media/TutorialPopup480.swf",
      "start": 37171236,
      "end": 37185780
    }, {
      "filename": "/Common/Media/TutorialPopup720.swf",
      "start": 37185780,
      "end": 37200314
    }, {
      "filename": "/Common/Media/TutorialPopupSplit1080.swf",
      "start": 37200314,
      "end": 37215434
    }, {
      "filename": "/Common/Media/TutorialPopupSplit720.swf",
      "start": 37215434,
      "end": 37229974
    }, {
      "filename": "/Common/Media/TutorialPopupVita.swf",
      "start": 37229974,
      "end": 37244518
    }, {
      "filename": "/Common/Media/font/CHS/MSYH.ttf",
      "start": 37244518,
      "end": 58821314
    }, {
      "filename": "/Common/Media/font/CHT/DFHeiMedium-B5.ttf",
      "start": 58821314,
      "end": 66953934
    }, {
      "filename": "/Common/Media/font/CHT/DFTT_R5.TTC",
      "start": 66953934,
      "end": 73359474
    }, {
      "filename": "/Common/Media/font/JPN/DF-DotDotGothic16.ttf",
      "start": 73359474,
      "end": 77401406
    }, {
      "filename": "/Common/Media/font/JPN/DFGMaruGothic-Md.ttf",
      "start": 77401406,
      "end": 80835254
    }, {
      "filename": "/Common/Media/font/KOR/BOKMSD.ttf",
      "start": 80835254,
      "end": 81935274
    }, {
      "filename": "/Common/Media/font/KOR/candadite2.ttf",
      "start": 81935274,
      "end": 86806976
    }, {
      "filename": "/Common/Media/font/Mojang Font_11.ttf",
      "start": 86806976,
      "end": 86876092
    }, {
      "filename": "/Common/Media/font/Mojang Font_7.ttf",
      "start": 86876092,
      "end": 86945192
    }, {
      "filename": "/Common/Media/font/Mojangles.ttf",
      "start": 86945192,
      "end": 87017092
    }, {
      "filename": "/Common/Media/font/Mojangles_11.abc",
      "start": 87017092,
      "end": 87038596
    }, {
      "filename": "/Common/Media/font/Mojangles_7.abc",
      "start": 87038596,
      "end": 87060100
    }, {
      "filename": "/Common/Media/font/RU/SpaceMace.ttf",
      "start": 87060100,
      "end": 87169492
    }, {
      "filename": "/Common/Media/font/chars.txt",
      "start": 87169492,
      "end": 87170056
    }, {
      "filename": "/Common/Media/languages.loc",
      "start": 87170056,
      "end": 87640546
    }, {
      "filename": "/Common/Media/media.txt",
      "start": 87640546,
      "end": 87640653
    }, {
      "filename": "/Common/Media/movies1080.txt",
      "start": 87640653,
      "end": 87643539
    }, {
      "filename": "/Common/Media/movies480.txt",
      "start": 87643539,
      "end": 87644790
    }, {
      "filename": "/Common/Media/movies720.txt",
      "start": 87644790,
      "end": 87647492
    }, {
      "filename": "/Common/Media/moviesVita.txt",
      "start": 87647492,
      "end": 87649084
    }, {
      "filename": "/Common/Media/skin.swf",
      "start": 87649084,
      "end": 87795119
    }, {
      "filename": "/Common/Media/skinGraphics.swf",
      "start": 87795119,
      "end": 89849213
    }, {
      "filename": "/Common/Media/skinGraphicsHud.swf",
      "start": 89849213,
      "end": 89863616
    }, {
      "filename": "/Common/Media/skinGraphicsInGame.swf",
      "start": 89863616,
      "end": 90030823
    }, {
      "filename": "/Common/Media/skinGraphicsLabels.swf",
      "start": 90030823,
      "end": 90034725
    }, {
      "filename": "/Common/Media/skinHD.swf",
      "start": 90034725,
      "end": 90187523
    }, {
      "filename": "/Common/Media/skinHDGraphics.swf",
      "start": 90187523,
      "end": 91745052
    }, {
      "filename": "/Common/Media/skinHDGraphicsHud.swf",
      "start": 91745052,
      "end": 91759745
    }, {
      "filename": "/Common/Media/skinHDGraphicsInGame.swf",
      "start": 91759745,
      "end": 92052181
    }, {
      "filename": "/Common/Media/skinHDGraphicsLabels.swf",
      "start": 92052181,
      "end": 92056080
    }, {
      "filename": "/Common/Media/skinHDHud.swf",
      "start": 92056080,
      "end": 92065157
    }, {
      "filename": "/Common/Media/skinHDInGame.swf",
      "start": 92065157,
      "end": 92089886
    }, {
      "filename": "/Common/Media/skinHDLabels.swf",
      "start": 92089886,
      "end": 92096195
    }, {
      "filename": "/Common/Media/skinHud.swf",
      "start": 92096195,
      "end": 92105398
    }, {
      "filename": "/Common/Media/skinInGame.swf",
      "start": 92105398,
      "end": 92130167
    }, {
      "filename": "/Common/Media/skinLabels.swf",
      "start": 92130167,
      "end": 92136524
    }, {
      "filename": "/Common/Media/splashes.txt",
      "start": 92136524,
      "end": 92142189
    }, {
      "filename": "/Common/Trial/TrialLevel.mcs",
      "start": 92142189,
      "end": 95497135
    }, {
      "filename": "/Common/Tutorial",
      "start": 95497135,
      "end": 104470635
    }, {
      "filename": "/Common/music/cds/11.ogg",
      "start": 104470635,
      "end": 105013425
    }, {
      "filename": "/Common/music/cds/13.ogg",
      "start": 105013425,
      "end": 105904042
    }, {
      "filename": "/Common/music/cds/blocks.ogg",
      "start": 105904042,
      "end": 108612252
    }, {
      "filename": "/Common/music/cds/cat.ogg",
      "start": 108612252,
      "end": 111347593
    }, {
      "filename": "/Common/music/cds/chirp.ogg",
      "start": 111347593,
      "end": 112800151
    }, {
      "filename": "/Common/music/cds/far.ogg",
      "start": 112800151,
      "end": 114098427
    }, {
      "filename": "/Common/music/cds/mall.ogg",
      "start": 114098427,
      "end": 115554049
    }, {
      "filename": "/Common/music/cds/mellohi.ogg",
      "start": 115554049,
      "end": 116193337
    }, {
      "filename": "/Common/music/cds/stal.ogg",
      "start": 116193337,
      "end": 117332754
    }, {
      "filename": "/Common/music/cds/strad.ogg",
      "start": 117332754,
      "end": 118759474
    }, {
      "filename": "/Common/music/cds/ward.ogg",
      "start": 118759474,
      "end": 120969753
    }, {
      "filename": "/Common/music/cds/where_are_we_now.ogg",
      "start": 120969753,
      "end": 122652640
    }, {
      "filename": "/Common/music/music/calm1.ogg",
      "start": 122652640,
      "end": 124422404
    }, {
      "filename": "/Common/music/music/calm2.ogg",
      "start": 124422404,
      "end": 125831941
    }, {
      "filename": "/Common/music/music/calm3.ogg",
      "start": 125831941,
      "end": 127197468
    }, {
      "filename": "/Common/music/music/creative1.ogg",
      "start": 127197468,
      "end": 130800280
    }, {
      "filename": "/Common/music/music/creative2.ogg",
      "start": 130800280,
      "end": 133922538
    }, {
      "filename": "/Common/music/music/creative3.ogg",
      "start": 133922538,
      "end": 137188314
    }, {
      "filename": "/Common/music/music/creative4.ogg",
      "start": 137188314,
      "end": 140826115
    }, {
      "filename": "/Common/music/music/creative5.ogg",
      "start": 140826115,
      "end": 145910963
    }, {
      "filename": "/Common/music/music/creative6.ogg",
      "start": 145910963,
      "end": 150377897
    }, {
      "filename": "/Common/music/music/hal1.ogg",
      "start": 150377897,
      "end": 151712134
    }, {
      "filename": "/Common/music/music/hal2.ogg",
      "start": 151712134,
      "end": 152934167
    }, {
      "filename": "/Common/music/music/hal3.ogg",
      "start": 152934167,
      "end": 154271453
    }, {
      "filename": "/Common/music/music/hal4.ogg",
      "start": 154271453,
      "end": 155998495
    }, {
      "filename": "/Common/music/music/menu1.ogg",
      "start": 155998495,
      "end": 157458318
    }, {
      "filename": "/Common/music/music/menu2.ogg",
      "start": 157458318,
      "end": 158918833
    }, {
      "filename": "/Common/music/music/menu3.ogg",
      "start": 158918833,
      "end": 160265004
    }, {
      "filename": "/Common/music/music/menu4.ogg",
      "start": 160265004,
      "end": 162069103
    }, {
      "filename": "/Common/music/music/nether1.ogg",
      "start": 162069103,
      "end": 164467844
    }, {
      "filename": "/Common/music/music/nether2.ogg",
      "start": 164467844,
      "end": 166839490
    }, {
      "filename": "/Common/music/music/nether3.ogg",
      "start": 166839490,
      "end": 168878799
    }, {
      "filename": "/Common/music/music/nether4.ogg",
      "start": 168878799,
      "end": 171130617
    }, {
      "filename": "/Common/music/music/nuance1.ogg",
      "start": 171130617,
      "end": 171415284
    }, {
      "filename": "/Common/music/music/nuance2.ogg",
      "start": 171415284,
      "end": 171798359
    }, {
      "filename": "/Common/music/music/piano1.ogg",
      "start": 171798359,
      "end": 172142431
    }, {
      "filename": "/Common/music/music/piano2.ogg",
      "start": 172142431,
      "end": 172714380
    }, {
      "filename": "/Common/music/music/piano3.ogg",
      "start": 172714380,
      "end": 174638938
    }, {
      "filename": "/Common/music/music/the_end_dragon_alive.ogg",
      "start": 174638938,
      "end": 178237538
    }, {
      "filename": "/Common/music/music/the_end_end.ogg",
      "start": 178237538,
      "end": 180412815
    }, {
      "filename": "/Common/res/1_2_2/achievement/bg.png",
      "start": 180412815,
      "end": 180416451
    }, {
      "filename": "/Common/res/1_2_2/achievement/icons.png",
      "start": 180416451,
      "end": 180417940
    }, {
      "filename": "/Common/res/1_2_2/armor/chain_1.png",
      "start": 180417940,
      "end": 180418904
    }, {
      "filename": "/Common/res/1_2_2/armor/chain_2.png",
      "start": 180418904,
      "end": 180419427
    }, {
      "filename": "/Common/res/1_2_2/armor/cloth_1.png",
      "start": 180419427,
      "end": 180420566
    }, {
      "filename": "/Common/res/1_2_2/armor/cloth_2.png",
      "start": 180420566,
      "end": 180421276
    }, {
      "filename": "/Common/res/1_2_2/armor/diamond_1.png",
      "start": 180421276,
      "end": 180422494
    }, {
      "filename": "/Common/res/1_2_2/armor/diamond_2.png",
      "start": 180422494,
      "end": 180423218
    }, {
      "filename": "/Common/res/1_2_2/armor/gold_1.png",
      "start": 180423218,
      "end": 180424416
    }, {
      "filename": "/Common/res/1_2_2/armor/gold_2.png",
      "start": 180424416,
      "end": 180425124
    }, {
      "filename": "/Common/res/1_2_2/armor/iron_1.png",
      "start": 180425124,
      "end": 180426257
    }, {
      "filename": "/Common/res/1_2_2/armor/iron_2.png",
      "start": 180426257,
      "end": 180426943
    }, {
      "filename": "/Common/res/1_2_2/armor/power.png",
      "start": 180426943,
      "end": 180428743
    }, {
      "filename": "/Common/res/1_2_2/art/kz.png",
      "start": 180428743,
      "end": 180506764
    }, {
      "filename": "/Common/res/1_2_2/environment/clouds.png",
      "start": 180506764,
      "end": 180520475
    }, {
      "filename": "/Common/res/1_2_2/environment/light_normal.png",
      "start": 180520475,
      "end": 180521682
    }, {
      "filename": "/Common/res/1_2_2/environment/rain.png",
      "start": 180521682,
      "end": 180524222
    }, {
      "filename": "/Common/res/1_2_2/environment/snow.png",
      "start": 180524222,
      "end": 180525040
    }, {
      "filename": "/Common/res/1_2_2/font/alternate.png",
      "start": 180525040,
      "end": 180526229
    }, {
      "filename": "/Common/res/1_2_2/font/default.png",
      "start": 180526229,
      "end": 180529046
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_00.png",
      "start": 180529046,
      "end": 180531555
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_01.png",
      "start": 180531555,
      "end": 180533972
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_02.png",
      "start": 180533972,
      "end": 180536212
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_03.png",
      "start": 180536212,
      "end": 180538208
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_04.png",
      "start": 180538208,
      "end": 180540603
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_05.png",
      "start": 180540603,
      "end": 180542527
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_06.png",
      "start": 180542527,
      "end": 180545110
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_07.png",
      "start": 180545110,
      "end": 180547625
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_09.png",
      "start": 180547625,
      "end": 180551319
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_0A.png",
      "start": 180551319,
      "end": 180553804
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_0B.png",
      "start": 180553804,
      "end": 180556414
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_0C.png",
      "start": 180556414,
      "end": 180559134
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_0D.png",
      "start": 180559134,
      "end": 180562088
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_0E.png",
      "start": 180562088,
      "end": 180563650
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_0F.png",
      "start": 180563650,
      "end": 180566163
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_10.png",
      "start": 180566163,
      "end": 180568962
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_11.png",
      "start": 180568962,
      "end": 180571070
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_12.png",
      "start": 180571070,
      "end": 180574165
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_13.png",
      "start": 180574165,
      "end": 180577199
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_14.png",
      "start": 180577199,
      "end": 180578940
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_15.png",
      "start": 180578940,
      "end": 180581231
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_16.png",
      "start": 180581231,
      "end": 180583741
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_17.png",
      "start": 180583741,
      "end": 180586616
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_18.png",
      "start": 180586616,
      "end": 180588715
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_19.png",
      "start": 180588715,
      "end": 180591438
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_1A.png",
      "start": 180591438,
      "end": 180592073
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_1B.png",
      "start": 180592073,
      "end": 180594395
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_1C.png",
      "start": 180594395,
      "end": 180595988
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_1D.png",
      "start": 180595988,
      "end": 180598173
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_1E.png",
      "start": 180598173,
      "end": 180600287
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_1F.png",
      "start": 180600287,
      "end": 180601600
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_20.png",
      "start": 180601600,
      "end": 180603863
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_21.png",
      "start": 180603863,
      "end": 180606398
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_22.png",
      "start": 180606398,
      "end": 180608408
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_23.png",
      "start": 180608408,
      "end": 180610813
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_24.png",
      "start": 180610813,
      "end": 180613555
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_25.png",
      "start": 180613555,
      "end": 180614907
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_26.png",
      "start": 180614907,
      "end": 180617708
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_27.png",
      "start": 180617708,
      "end": 180621349
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_28.png",
      "start": 180621349,
      "end": 180621774
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_29.png",
      "start": 180621774,
      "end": 180624680
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_2A.png",
      "start": 180624680,
      "end": 180627501
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_2B.png",
      "start": 180627501,
      "end": 180628664
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_2C.png",
      "start": 180628664,
      "end": 180631290
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_2D.png",
      "start": 180631290,
      "end": 180633770
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_2E.png",
      "start": 180633770,
      "end": 180636455
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_2F.png",
      "start": 180636455,
      "end": 180640901
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_30.png",
      "start": 180640901,
      "end": 180644703
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_31.png",
      "start": 180644703,
      "end": 180647957
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_32.png",
      "start": 180647957,
      "end": 180651450
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_33.png",
      "start": 180651450,
      "end": 180656067
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_34.png",
      "start": 180656067,
      "end": 180662245
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_35.png",
      "start": 180662245,
      "end": 180668585
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_36.png",
      "start": 180668585,
      "end": 180675091
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_37.png",
      "start": 180675091,
      "end": 180681329
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_38.png",
      "start": 180681329,
      "end": 180687699
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_39.png",
      "start": 180687699,
      "end": 180694194
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_3A.png",
      "start": 180694194,
      "end": 180700728
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_3B.png",
      "start": 180700728,
      "end": 180707378
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_3C.png",
      "start": 180707378,
      "end": 180713972
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_3D.png",
      "start": 180713972,
      "end": 180720893
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_3E.png",
      "start": 180720893,
      "end": 180727431
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_3F.png",
      "start": 180727431,
      "end": 180733844
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_40.png",
      "start": 180733844,
      "end": 180740312
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_41.png",
      "start": 180740312,
      "end": 180746343
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_42.png",
      "start": 180746343,
      "end": 180752609
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_43.png",
      "start": 180752609,
      "end": 180759118
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_44.png",
      "start": 180759118,
      "end": 180765122
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_45.png",
      "start": 180765122,
      "end": 180771547
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_46.png",
      "start": 180771547,
      "end": 180778034
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_47.png",
      "start": 180778034,
      "end": 180784595
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_48.png",
      "start": 180784595,
      "end": 180791119
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_49.png",
      "start": 180791119,
      "end": 180797633
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_4A.png",
      "start": 180797633,
      "end": 180803842
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_4B.png",
      "start": 180803842,
      "end": 180810198
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_4C.png",
      "start": 180810198,
      "end": 180816688
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_4D.png",
      "start": 180816688,
      "end": 180821807
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_4E.png",
      "start": 180821807,
      "end": 180826701
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_4F.png",
      "start": 180826701,
      "end": 180832474
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_50.png",
      "start": 180832474,
      "end": 180838811
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_51.png",
      "start": 180838811,
      "end": 180844687
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_52.png",
      "start": 180844687,
      "end": 180850460
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_53.png",
      "start": 180850460,
      "end": 180855755
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_54.png",
      "start": 180855755,
      "end": 180861327
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_55.png",
      "start": 180861327,
      "end": 180867595
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_56.png",
      "start": 180867595,
      "end": 180874146
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_57.png",
      "start": 180874146,
      "end": 180879782
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_58.png",
      "start": 180879782,
      "end": 180886109
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_59.png",
      "start": 180886109,
      "end": 180891743
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_5A.png",
      "start": 180891743,
      "end": 180898118
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_5B.png",
      "start": 180898118,
      "end": 180904061
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_5C.png",
      "start": 180904061,
      "end": 180909710
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_5D.png",
      "start": 180909710,
      "end": 180916074
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_5E.png",
      "start": 180916074,
      "end": 180921779
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_5F.png",
      "start": 180921779,
      "end": 180927812
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_60.png",
      "start": 180927812,
      "end": 180933732
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_61.png",
      "start": 180933732,
      "end": 180940438
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_62.png",
      "start": 180940438,
      "end": 180946284
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_63.png",
      "start": 180946284,
      "end": 180952480
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_64.png",
      "start": 180952480,
      "end": 180959221
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_65.png",
      "start": 180959221,
      "end": 180965623
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_66.png",
      "start": 180965623,
      "end": 180971617
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_67.png",
      "start": 180971617,
      "end": 180977374
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_68.png",
      "start": 180977374,
      "end": 180983491
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_69.png",
      "start": 180983491,
      "end": 180989922
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_6A.png",
      "start": 180989922,
      "end": 180996715
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_6B.png",
      "start": 180996715,
      "end": 181003271
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_6C.png",
      "start": 181003271,
      "end": 181008941
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_6D.png",
      "start": 181008941,
      "end": 181014970
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_6E.png",
      "start": 181014970,
      "end": 181021320
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_6F.png",
      "start": 181021320,
      "end": 181027941
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_70.png",
      "start": 181027941,
      "end": 181034608
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_71.png",
      "start": 181034608,
      "end": 181041205
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_72.png",
      "start": 181041205,
      "end": 181047723
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_73.png",
      "start": 181047723,
      "end": 181054108
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_74.png",
      "start": 181054108,
      "end": 181060543
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_75.png",
      "start": 181060543,
      "end": 181066274
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_76.png",
      "start": 181066274,
      "end": 181072383
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_77.png",
      "start": 181072383,
      "end": 181078493
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_78.png",
      "start": 181078493,
      "end": 181084660
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_79.png",
      "start": 181084660,
      "end": 181090938
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_7A.png",
      "start": 181090938,
      "end": 181097027
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_7B.png",
      "start": 181097027,
      "end": 181102372
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_7C.png",
      "start": 181102372,
      "end": 181108670
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_7D.png",
      "start": 181108670,
      "end": 181114757
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_7E.png",
      "start": 181114757,
      "end": 181121358
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_7F.png",
      "start": 181121358,
      "end": 181127649
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_80.png",
      "start": 181127649,
      "end": 181133669
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_81.png",
      "start": 181133669,
      "end": 181139868
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_82.png",
      "start": 181139868,
      "end": 181145235
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_83.png",
      "start": 181145235,
      "end": 181150422
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_84.png",
      "start": 181150422,
      "end": 181156139
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_85.png",
      "start": 181156139,
      "end": 181162177
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_86.png",
      "start": 181162177,
      "end": 181168353
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_87.png",
      "start": 181168353,
      "end": 181175010
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_88.png",
      "start": 181175010,
      "end": 181181446
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_89.png",
      "start": 181181446,
      "end": 181188171
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_8A.png",
      "start": 181188171,
      "end": 181193847
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_8B.png",
      "start": 181193847,
      "end": 181200199
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_8C.png",
      "start": 181200199,
      "end": 181206732
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_8D.png",
      "start": 181206732,
      "end": 181212706
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_8E.png",
      "start": 181212706,
      "end": 181219208
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_8F.png",
      "start": 181219208,
      "end": 181225033
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_90.png",
      "start": 181225033,
      "end": 181230976
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_91.png",
      "start": 181230976,
      "end": 181237144
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_92.png",
      "start": 181237144,
      "end": 181243190
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_93.png",
      "start": 181243190,
      "end": 181249901
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_94.png",
      "start": 181249901,
      "end": 181256532
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_95.png",
      "start": 181256532,
      "end": 181262014
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_96.png",
      "start": 181262014,
      "end": 181267961
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_97.png",
      "start": 181267961,
      "end": 181273887
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_98.png",
      "start": 181273887,
      "end": 181280033
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_99.png",
      "start": 181280033,
      "end": 181286427
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_9A.png",
      "start": 181286427,
      "end": 181292635
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_9B.png",
      "start": 181292635,
      "end": 181298620
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_9C.png",
      "start": 181298620,
      "end": 181304956
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_9D.png",
      "start": 181304956,
      "end": 181311087
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_9E.png",
      "start": 181311087,
      "end": 181317621
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_9F.png",
      "start": 181317621,
      "end": 181322519
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_A0.png",
      "start": 181322519,
      "end": 181325931
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_A1.png",
      "start": 181325931,
      "end": 181329633
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_A2.png",
      "start": 181329633,
      "end": 181333190
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_A3.png",
      "start": 181333190,
      "end": 181336759
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_A4.png",
      "start": 181336759,
      "end": 181339448
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_A5.png",
      "start": 181339448,
      "end": 181342794
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_A6.png",
      "start": 181342794,
      "end": 181344605
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_A7.png",
      "start": 181344605,
      "end": 181346244
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_A8.png",
      "start": 181346244,
      "end": 181348942
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_A9.png",
      "start": 181348942,
      "end": 181350151
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_AA.png",
      "start": 181350151,
      "end": 181351614
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_AB.png",
      "start": 181351614,
      "end": 181351933
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_AC.png",
      "start": 181351933,
      "end": 181353344
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_AD.png",
      "start": 181353344,
      "end": 181354969
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_AE.png",
      "start": 181354969,
      "end": 181356441
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_AF.png",
      "start": 181356441,
      "end": 181358157
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_B0.png",
      "start": 181358157,
      "end": 181359761
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_B1.png",
      "start": 181359761,
      "end": 181361275
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_B2.png",
      "start": 181361275,
      "end": 181362797
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_B3.png",
      "start": 181362797,
      "end": 181364297
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_B4.png",
      "start": 181364297,
      "end": 181365880
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_B5.png",
      "start": 181365880,
      "end": 181367333
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_B6.png",
      "start": 181367333,
      "end": 181369018
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_B7.png",
      "start": 181369018,
      "end": 181370540
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_B8.png",
      "start": 181370540,
      "end": 181372305
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_B9.png",
      "start": 181372305,
      "end": 181374027
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_BA.png",
      "start": 181374027,
      "end": 181375630
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_BB.png",
      "start": 181375630,
      "end": 181377149
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_BC.png",
      "start": 181377149,
      "end": 181378508
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_BD.png",
      "start": 181378508,
      "end": 181380075
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_BE.png",
      "start": 181380075,
      "end": 181381611
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_BF.png",
      "start": 181381611,
      "end": 181383321
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_C0.png",
      "start": 181383321,
      "end": 181385089
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_C1.png",
      "start": 181385089,
      "end": 181386849
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_C2.png",
      "start": 181386849,
      "end": 181388487
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_C3.png",
      "start": 181388487,
      "end": 181390035
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_C4.png",
      "start": 181390035,
      "end": 181391663
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_C5.png",
      "start": 181391663,
      "end": 181393129
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_C6.png",
      "start": 181393129,
      "end": 181394776
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_C7.png",
      "start": 181394776,
      "end": 181396491
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_C8.png",
      "start": 181396491,
      "end": 181398225
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_C9.png",
      "start": 181398225,
      "end": 181399949
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_CA.png",
      "start": 181399949,
      "end": 181401733
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_CB.png",
      "start": 181401733,
      "end": 181403333
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_CC.png",
      "start": 181403333,
      "end": 181404918
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_CD.png",
      "start": 181404918,
      "end": 181406710
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_CE.png",
      "start": 181406710,
      "end": 181408421
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_CF.png",
      "start": 181408421,
      "end": 181410122
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_D0.png",
      "start": 181410122,
      "end": 181411768
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_D1.png",
      "start": 181411768,
      "end": 181413383
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_D2.png",
      "start": 181413383,
      "end": 181414918
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_D3.png",
      "start": 181414918,
      "end": 181416342
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_D4.png",
      "start": 181416342,
      "end": 181417985
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_D5.png",
      "start": 181417985,
      "end": 181419626
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_D6.png",
      "start": 181419626,
      "end": 181421536
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_D7.png",
      "start": 181421536,
      "end": 181422975
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_F9.png",
      "start": 181422975,
      "end": 181429741
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_FA.png",
      "start": 181429741,
      "end": 181435345
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_FB.png",
      "start": 181435345,
      "end": 181437058
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_FC.png",
      "start": 181437058,
      "end": 181439503
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_FD.png",
      "start": 181439503,
      "end": 181442233
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_FE.png",
      "start": 181442233,
      "end": 181444117
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_FF.png",
      "start": 181444117,
      "end": 181446939
    }, {
      "filename": "/Common/res/1_2_2/font/glyph_sizes.bin",
      "start": 181446939,
      "end": 181512475
    }, {
      "filename": "/Common/res/1_2_2/gui/alchemy.png",
      "start": 181512475,
      "end": 181514157
    }, {
      "filename": "/Common/res/1_2_2/gui/allitems.png",
      "start": 181514157,
      "end": 181516212
    }, {
      "filename": "/Common/res/1_2_2/gui/anvil.png",
      "start": 181516212,
      "end": 181518112
    }, {
      "filename": "/Common/res/1_2_2/gui/background.png",
      "start": 181518112,
      "end": 181519123
    }, {
      "filename": "/Common/res/1_2_2/gui/beacon.png",
      "start": 181519123,
      "end": 181521217
    }, {
      "filename": "/Common/res/1_2_2/gui/brewing_stand.png",
      "start": 181521217,
      "end": 181522867
    }, {
      "filename": "/Common/res/1_2_2/gui/container.png",
      "start": 181522867,
      "end": 181525662
    }, {
      "filename": "/Common/res/1_2_2/gui/crafting.png",
      "start": 181525662,
      "end": 181528418
    }, {
      "filename": "/Common/res/1_2_2/gui/crash_logo.png",
      "start": 181528418,
      "end": 181533399
    }, {
      "filename": "/Common/res/1_2_2/gui/creative_inventory/tab_inventory.png",
      "start": 181533399,
      "end": 181534524
    }, {
      "filename": "/Common/res/1_2_2/gui/creative_inventory/tab_item_search.png",
      "start": 181534524,
      "end": 181535529
    }, {
      "filename": "/Common/res/1_2_2/gui/creative_inventory/tab_items.png",
      "start": 181535529,
      "end": 181536494
    }, {
      "filename": "/Common/res/1_2_2/gui/creative_inventory/tabs.png",
      "start": 181536494,
      "end": 181538217
    }, {
      "filename": "/Common/res/1_2_2/gui/enchant.png",
      "start": 181538217,
      "end": 181541227
    }, {
      "filename": "/Common/res/1_2_2/gui/furnace.png",
      "start": 181541227,
      "end": 181542747
    }, {
      "filename": "/Common/res/1_2_2/gui/gui.png",
      "start": 181542747,
      "end": 181560168
    }, {
      "filename": "/Common/res/1_2_2/gui/hopper.png",
      "start": 181560168,
      "end": 181561370
    }, {
      "filename": "/Common/res/1_2_2/gui/horse.png",
      "start": 181561370,
      "end": 181567024
    }, {
      "filename": "/Common/res/1_2_2/gui/icons.png",
      "start": 181567024,
      "end": 181576696
    }, {
      "filename": "/Common/res/1_2_2/gui/inventory.png",
      "start": 181576696,
      "end": 181587433
    }, {
      "filename": "/Common/res/1_2_2/gui/items.png",
      "start": 181587433,
      "end": 181617163
    }, {
      "filename": "/Common/res/1_2_2/gui/particles.png",
      "start": 181617163,
      "end": 181619155
    }, {
      "filename": "/Common/res/1_2_2/gui/slot.png",
      "start": 181619155,
      "end": 181621854
    }, {
      "filename": "/Common/res/1_2_2/gui/trap.png",
      "start": 181621854,
      "end": 181623975
    }, {
      "filename": "/Common/res/1_2_2/gui/unknown_pack.png",
      "start": 181623975,
      "end": 181636988
    }, {
      "filename": "/Common/res/1_2_2/gui/villager.png",
      "start": 181636988,
      "end": 181640118
    }, {
      "filename": "/Common/res/1_2_2/item/arrows.png",
      "start": 181640118,
      "end": 181640440
    }, {
      "filename": "/Common/res/1_2_2/item/boat.png",
      "start": 181640440,
      "end": 181642829
    }, {
      "filename": "/Common/res/1_2_2/item/book.png",
      "start": 181642829,
      "end": 181643934
    }, {
      "filename": "/Common/res/1_2_2/item/cart.png",
      "start": 181643934,
      "end": 181646879
    }, {
      "filename": "/Common/res/1_2_2/item/chest.png",
      "start": 181646879,
      "end": 181648218
    }, {
      "filename": "/Common/res/1_2_2/item/door.png",
      "start": 181648218,
      "end": 181649247
    }, {
      "filename": "/Common/res/1_2_2/item/largechest.png",
      "start": 181649247,
      "end": 181651112
    }, {
      "filename": "/Common/res/1_2_2/item/sign.png",
      "start": 181651112,
      "end": 181652372
    }, {
      "filename": "/Common/res/1_2_2/item/xporb.png",
      "start": 181652372,
      "end": 181653468
    }, {
      "filename": "/Common/res/1_2_2/misc/dial.png",
      "start": 181653468,
      "end": 181653699
    }, {
      "filename": "/Common/res/1_2_2/misc/explosion.png",
      "start": 181653699,
      "end": 181655804
    }, {
      "filename": "/Common/res/1_2_2/misc/foliagecolor.png",
      "start": 181655804,
      "end": 181673497
    }, {
      "filename": "/Common/res/1_2_2/misc/footprint.png",
      "start": 181673497,
      "end": 181674443
    }, {
      "filename": "/Common/res/1_2_2/misc/glint.png",
      "start": 181674443,
      "end": 181675485
    }, {
      "filename": "/Common/res/1_2_2/misc/grasscolor.png",
      "start": 181675485,
      "end": 181700722
    }, {
      "filename": "/Common/res/1_2_2/misc/mapbg.png",
      "start": 181700722,
      "end": 181702260
    }, {
      "filename": "/Common/res/1_2_2/misc/mapicons.png",
      "start": 181702260,
      "end": 181703322
    }, {
      "filename": "/Common/res/1_2_2/misc/particlefield.png",
      "start": 181703322,
      "end": 181715549
    }, {
      "filename": "/Common/res/1_2_2/misc/pumpkinblur.png",
      "start": 181715549,
      "end": 181757672
    }, {
      "filename": "/Common/res/1_2_2/misc/shadow.png",
      "start": 181757672,
      "end": 181758540
    }, {
      "filename": "/Common/res/1_2_2/misc/tunnel.png",
      "start": 181758540,
      "end": 181802944
    }, {
      "filename": "/Common/res/1_2_2/misc/vignette.png",
      "start": 181802944,
      "end": 181827101
    }, {
      "filename": "/Common/res/1_2_2/misc/water.png",
      "start": 181827101,
      "end": 181827407
    }, {
      "filename": "/Common/res/1_2_2/misc/watercolor.png",
      "start": 181827407,
      "end": 181832853
    }, {
      "filename": "/Common/res/1_2_2/mob/cat_black.png",
      "start": 181832853,
      "end": 181834252
    }, {
      "filename": "/Common/res/1_2_2/mob/cat_red.png",
      "start": 181834252,
      "end": 181836295
    }, {
      "filename": "/Common/res/1_2_2/mob/cat_siamese.png",
      "start": 181836295,
      "end": 181839012
    }, {
      "filename": "/Common/res/1_2_2/mob/cavespider.png",
      "start": 181839012,
      "end": 181842408
    }, {
      "filename": "/Common/res/1_2_2/mob/char.png",
      "start": 181842408,
      "end": 181843768
    }, {
      "filename": "/Common/res/1_2_2/mob/chicken.png",
      "start": 181843768,
      "end": 181844260
    }, {
      "filename": "/Common/res/1_2_2/mob/cow.png",
      "start": 181844260,
      "end": 181846214
    }, {
      "filename": "/Common/res/1_2_2/mob/creeper.png",
      "start": 181846214,
      "end": 181849214
    }, {
      "filename": "/Common/res/1_2_2/mob/enderdragon/beam.png",
      "start": 181849214,
      "end": 181851330
    }, {
      "filename": "/Common/res/1_2_2/mob/enderdragon/body.png",
      "start": 181851330,
      "end": 181859050
    }, {
      "filename": "/Common/res/1_2_2/mob/enderdragon/crystal.png",
      "start": 181859050,
      "end": 181862371
    }, {
      "filename": "/Common/res/1_2_2/mob/enderdragon/dragon.png",
      "start": 181862371,
      "end": 181873162
    }, {
      "filename": "/Common/res/1_2_2/mob/enderdragon/ender.png",
      "start": 181873162,
      "end": 181881118
    }, {
      "filename": "/Common/res/1_2_2/mob/enderdragon/ender_eyes.png",
      "start": 181881118,
      "end": 181883082
    }, {
      "filename": "/Common/res/1_2_2/mob/enderdragon/shuffle.png",
      "start": 181883082,
      "end": 181933262
    }, {
      "filename": "/Common/res/1_2_2/mob/enderman.png",
      "start": 181933262,
      "end": 181933999
    }, {
      "filename": "/Common/res/1_2_2/mob/enderman_eyes.png",
      "start": 181933999,
      "end": 181935241
    }, {
      "filename": "/Common/res/1_2_2/mob/fire.png",
      "start": 181935241,
      "end": 181938569
    }, {
      "filename": "/Common/res/1_2_2/mob/ghast.png",
      "start": 181938569,
      "end": 181939465
    }, {
      "filename": "/Common/res/1_2_2/mob/ghast_fire.png",
      "start": 181939465,
      "end": 181940408
    }, {
      "filename": "/Common/res/1_2_2/mob/lava.png",
      "start": 181940408,
      "end": 181941865
    }, {
      "filename": "/Common/res/1_2_2/mob/ozelot.png",
      "start": 181941865,
      "end": 181944986
    }, {
      "filename": "/Common/res/1_2_2/mob/pig.png",
      "start": 181944986,
      "end": 181948291
    }, {
      "filename": "/Common/res/1_2_2/mob/pigman.png",
      "start": 181948291,
      "end": 181950953
    }, {
      "filename": "/Common/res/1_2_2/mob/pigzombie.png",
      "start": 181950953,
      "end": 181953966
    }, {
      "filename": "/Common/res/1_2_2/mob/redcow.png",
      "start": 181953966,
      "end": 181955571
    }, {
      "filename": "/Common/res/1_2_2/mob/saddle.png",
      "start": 181955571,
      "end": 181955950
    }, {
      "filename": "/Common/res/1_2_2/mob/sheep.png",
      "start": 181955950,
      "end": 181959069
    }, {
      "filename": "/Common/res/1_2_2/mob/sheep_fur.png",
      "start": 181959069,
      "end": 181960730
    }, {
      "filename": "/Common/res/1_2_2/mob/silverfish.png",
      "start": 181960730,
      "end": 181962512
    }, {
      "filename": "/Common/res/1_2_2/mob/skeleton.png",
      "start": 181962512,
      "end": 181963406
    }, {
      "filename": "/Common/res/1_2_2/mob/slime.png",
      "start": 181963406,
      "end": 181964039
    }, {
      "filename": "/Common/res/1_2_2/mob/snowman.png",
      "start": 181964039,
      "end": 181965838
    }, {
      "filename": "/Common/res/1_2_2/mob/spider.png",
      "start": 181965838,
      "end": 181968392
    }, {
      "filename": "/Common/res/1_2_2/mob/spider_eyes.png",
      "start": 181968392,
      "end": 181968647
    }, {
      "filename": "/Common/res/1_2_2/mob/squid.png",
      "start": 181968647,
      "end": 181969565
    }, {
      "filename": "/Common/res/1_2_2/mob/villager.png",
      "start": 181969565,
      "end": 181971657
    }, {
      "filename": "/Common/res/1_2_2/mob/villager/butcher.png",
      "start": 181971657,
      "end": 181973534
    }, {
      "filename": "/Common/res/1_2_2/mob/villager/farmer.png",
      "start": 181973534,
      "end": 181975505
    }, {
      "filename": "/Common/res/1_2_2/mob/villager/librarian.png",
      "start": 181975505,
      "end": 181977598
    }, {
      "filename": "/Common/res/1_2_2/mob/villager/priest.png",
      "start": 181977598,
      "end": 181979691
    }, {
      "filename": "/Common/res/1_2_2/mob/villager/smith.png",
      "start": 181979691,
      "end": 181981568
    }, {
      "filename": "/Common/res/1_2_2/mob/villager/villager.png",
      "start": 181981568,
      "end": 181983661
    }, {
      "filename": "/Common/res/1_2_2/mob/villager_golem.png",
      "start": 181983661,
      "end": 181991532
    }, {
      "filename": "/Common/res/1_2_2/mob/wolf.png",
      "start": 181991532,
      "end": 181995897
    }, {
      "filename": "/Common/res/1_2_2/mob/wolf_angry.png",
      "start": 181995897,
      "end": 181999120
    }, {
      "filename": "/Common/res/1_2_2/mob/wolf_tame.png",
      "start": 181999120,
      "end": 182003511
    }, {
      "filename": "/Common/res/1_2_2/mob/zombie.png",
      "start": 182003511,
      "end": 182005358
    }, {
      "filename": "/Common/res/1_2_2/pack.png",
      "start": 182005358,
      "end": 182032625
    }, {
      "filename": "/Common/res/1_2_2/pack.txt",
      "start": 182032625,
      "end": 182032656
    }, {
      "filename": "/Common/res/1_2_2/particles.png",
      "start": 182032656,
      "end": 182034569
    }, {
      "filename": "/Common/res/1_2_2/terrain.png",
      "start": 182034569,
      "end": 182120838
    }, {
      "filename": "/Common/res/1_2_2/terrain/moon.png",
      "start": 182120838,
      "end": 182121748
    }, {
      "filename": "/Common/res/1_2_2/terrain/moon_phases.png",
      "start": 182121748,
      "end": 182123317
    }, {
      "filename": "/Common/res/1_2_2/terrain/sun.png",
      "start": 182123317,
      "end": 182124030
    }, {
      "filename": "/Common/res/1_2_2/title/bg/panorama.png",
      "start": 182124030,
      "end": 182283808
    }, {
      "filename": "/Common/res/1_2_2/title/bg/panorama0.png",
      "start": 182283808,
      "end": 182348564
    }, {
      "filename": "/Common/res/1_2_2/title/bg/panorama1.png",
      "start": 182348564,
      "end": 182415585
    }, {
      "filename": "/Common/res/1_2_2/title/bg/panorama2.png",
      "start": 182415585,
      "end": 182464877
    }, {
      "filename": "/Common/res/1_2_2/title/bg/panorama3.png",
      "start": 182464877,
      "end": 182536156
    }, {
      "filename": "/Common/res/1_2_2/title/bg/panorama4.png",
      "start": 182536156,
      "end": 182538670
    }, {
      "filename": "/Common/res/1_2_2/title/bg/panorama5.png",
      "start": 182538670,
      "end": 182591586
    }, {
      "filename": "/Common/res/1_2_2/title/black.png",
      "start": 182591586,
      "end": 182591760
    }, {
      "filename": "/Common/res/1_2_2/title/credits.txt",
      "start": 182591760,
      "end": 182592977
    }, {
      "filename": "/Common/res/1_2_2/title/earlyplayers.txt",
      "start": 182592977,
      "end": 182599888
    }, {
      "filename": "/Common/res/1_2_2/title/mclogo.png",
      "start": 182599888,
      "end": 182605101
    }, {
      "filename": "/Common/res/1_2_2/title/mojang.png",
      "start": 182605101,
      "end": 182612807
    }, {
      "filename": "/Common/res/1_2_2/title/splashes.txt",
      "start": 182612807,
      "end": 182618359
    }, {
      "filename": "/Common/res/1_2_2/title/win.txt",
      "start": 182618359,
      "end": 182627121
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/Candy/Data/TexturePack.xzp",
      "start": 182627121,
      "end": 186813732
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/Candy/Data/x16Data.pck",
      "start": 186813732,
      "end": 187736431
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/Cartoon/Data/TexturePack.xzp",
      "start": 187736431,
      "end": 190989273
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/Cartoon/Data/x32Data.pck",
      "start": 190989273,
      "end": 192329594
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/City/Data/TexturePack.xzp",
      "start": 192329594,
      "end": 196971540
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/City/Data/x32Data.pck",
      "start": 196971540,
      "end": 199779793
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/Fantasy/Data/TexturePack.xzp",
      "start": 199779793,
      "end": 205292473
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/Fantasy/Data/x32Data.pck",
      "start": 205292473,
      "end": 207983538
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/Festive/Data/Festive.mcs",
      "start": 207983538,
      "end": 217020716
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/Festive/Data/GameRules.grf",
      "start": 217020716,
      "end": 217021215
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/Festive/Data/TexturePack.xzp",
      "start": 217021215,
      "end": 222399323
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/Festive/Data/x16Data.pck",
      "start": 222399323,
      "end": 223520927
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/Festive/TexturePack.pck",
      "start": 223520927,
      "end": 223758395
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/Halloween/Data/TexturePack.xzp",
      "start": 223758395,
      "end": 227797510
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/Halloween/Data/x16Data.pck",
      "start": 227797510,
      "end": 228741837
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/Halo/Data/GameRules.grf",
      "start": 228741837,
      "end": 228742340
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/Halo/Data/TexturePack.xzp",
      "start": 228742340,
      "end": 233247163
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/Halo/Data/x16Data.pck",
      "start": 233247163,
      "end": 234208185
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/Halo/TexturePack.pck",
      "start": 234208185,
      "end": 234430753
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/MassEffect/Data/GameRules.grf",
      "start": 234430753,
      "end": 234431096
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/MassEffect/Data/TexturePack.xzp",
      "start": 234431096,
      "end": 237680359
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/MassEffect/Data/masseffect.mcs",
      "start": 237680359,
      "end": 241165461
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/MassEffect/Data/x16Data.pck",
      "start": 241165461,
      "end": 241941182
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/MassEffect/TexturePack.pck",
      "start": 241941182,
      "end": 242121685
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/Natural/Data/TexturePack.xzp",
      "start": 242121685,
      "end": 246704444
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/Natural/Data/x32Data.pck",
      "start": 246704444,
      "end": 249746876
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/Plastic/Data/TexturePack.xzp",
      "start": 249746876,
      "end": 252565004
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/Plastic/Data/x16Data.pck",
      "start": 252565004,
      "end": 253146570
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/Skyrim/Data/GameRules.grf",
      "start": 253146570,
      "end": 253147075
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/Skyrim/Data/TexturePack.xzp",
      "start": 253147075,
      "end": 256914835
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/Skyrim/Data/x16Data.pck",
      "start": 256914835,
      "end": 258058825
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/Skyrim/TexturePack.pck",
      "start": 258058825,
      "end": 258246007
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/Steampunk/Data/TexturePack.xzp",
      "start": 258246007,
      "end": 263143022
    }, {
      "filename": "/Common/res/TitleUpdate/DLC/Steampunk/Data/x32Data.pck",
      "start": 263143022,
      "end": 266484062
    }, {
      "filename": "/Common/res/TitleUpdate/GameRules/Tutorial.mcs",
      "start": 266484062,
      "end": 275668292
    }, {
      "filename": "/Common/res/TitleUpdate/GameRules/Tutorial.pck",
      "start": 275668292,
      "end": 275670317
    }, {
      "filename": "/Common/res/TitleUpdate/audio/1.6.4.xwb",
      "start": 275670317,
      "end": 289658581
    }, {
      "filename": "/Common/res/TitleUpdate/audio/AdditionalMusic.xwb",
      "start": 289658581,
      "end": 320351957
    }, {
      "filename": "/Common/res/TitleUpdate/audio/Minecraft.xgs",
      "start": 320351957,
      "end": 320352445
    }, {
      "filename": "/Common/res/TitleUpdate/audio/additional.xsb",
      "start": 320352445,
      "end": 320359806
    }, {
      "filename": "/Common/res/TitleUpdate/audio/additional.xwb",
      "start": 320359806,
      "end": 321586558
    }, {
      "filename": "/Common/res/TitleUpdate/audio/minecraft.xsb",
      "start": 321586558,
      "end": 321596026
    }, {
      "filename": "/Common/res/TitleUpdate/res/armor/cloth_1.png",
      "start": 321596026,
      "end": 321597738
    }, {
      "filename": "/Common/res/TitleUpdate/res/armor/cloth_1_b.png",
      "start": 321597738,
      "end": 321599426
    }, {
      "filename": "/Common/res/TitleUpdate/res/armor/cloth_2.png",
      "start": 321599426,
      "end": 321600294
    }, {
      "filename": "/Common/res/TitleUpdate/res/armor/cloth_2_b.png",
      "start": 321600294,
      "end": 321601129
    }, {
      "filename": "/Common/res/TitleUpdate/res/armor/power.png",
      "start": 321601129,
      "end": 321602929
    }, {
      "filename": "/Common/res/TitleUpdate/res/art/kz.png",
      "start": 321602929,
      "end": 321683541
    }, {
      "filename": "/Common/res/TitleUpdate/res/colours.col",
      "start": 321683541,
      "end": 321689087
    }, {
      "filename": "/Common/res/TitleUpdate/res/colours.xml",
      "start": 321689087,
      "end": 321702864
    }, {
      "filename": "/Common/res/TitleUpdate/res/font/Default.png",
      "start": 321702864,
      "end": 321707480
    }, {
      "filename": "/Common/res/TitleUpdate/res/font/Mojangles_11.png",
      "start": 321707480,
      "end": 321714493
    }, {
      "filename": "/Common/res/TitleUpdate/res/font/Mojangles_7.png",
      "start": 321714493,
      "end": 321719821
    }, {
      "filename": "/Common/res/TitleUpdate/res/item/book.png",
      "start": 321719821,
      "end": 321720392
    }, {
      "filename": "/Common/res/TitleUpdate/res/item/christmas.png",
      "start": 321720392,
      "end": 321722587
    }, {
      "filename": "/Common/res/TitleUpdate/res/item/christmas_double.png",
      "start": 321722587,
      "end": 321725498
    }, {
      "filename": "/Common/res/TitleUpdate/res/item/enderchest.png",
      "start": 321725498,
      "end": 321728024
    }, {
      "filename": "/Common/res/TitleUpdate/res/item/lead_knot.png",
      "start": 321728024,
      "end": 321728770
    }, {
      "filename": "/Common/res/TitleUpdate/res/item/trapped.png",
      "start": 321728770,
      "end": 321730490
    }, {
      "filename": "/Common/res/TitleUpdate/res/item/trapped_double.png",
      "start": 321730490,
      "end": 321732709
    }, {
      "filename": "/Common/res/TitleUpdate/res/items.png",
      "start": 321732709,
      "end": 321771912
    }, {
      "filename": "/Common/res/TitleUpdate/res/misc/additionalmapicons.png",
      "start": 321771912,
      "end": 321772264
    }, {
      "filename": "/Common/res/TitleUpdate/res/misc/beacon_beam.png",
      "start": 321772264,
      "end": 321772524
    }, {
      "filename": "/Common/res/TitleUpdate/res/misc/explosion.png",
      "start": 321772524,
      "end": 321774138
    }, {
      "filename": "/Common/res/TitleUpdate/res/misc/footprint.png",
      "start": 321774138,
      "end": 321774289
    }, {
      "filename": "/Common/res/TitleUpdate/res/misc/glint.png",
      "start": 321774289,
      "end": 321774707
    }, {
      "filename": "/Common/res/TitleUpdate/res/misc/mapicons.png",
      "start": 321774707,
      "end": 321775430
    }, {
      "filename": "/Common/res/TitleUpdate/res/misc/particlefield.png",
      "start": 321775430,
      "end": 321798554
    }, {
      "filename": "/Common/res/TitleUpdate/res/misc/tunnel.png",
      "start": 321798554,
      "end": 321841860
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/bat.png",
      "start": 321841860,
      "end": 321844795
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/enderdragon/beam.png",
      "start": 321844795,
      "end": 321848337
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/enderdragon/ender.png",
      "start": 321848337,
      "end": 321859327
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/enderdragon/ender_eyes.png",
      "start": 321859327,
      "end": 321859868
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/enderman_eyes.png",
      "start": 321859868,
      "end": 321860081
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/horse/armor/horse_armor_diamond.png",
      "start": 321860081,
      "end": 321865258
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/horse/armor/horse_armor_gold.png",
      "start": 321865258,
      "end": 321870398
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/horse/armor/horse_armor_iron.png",
      "start": 321870398,
      "end": 321875462
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/horse/donkey.png",
      "start": 321875462,
      "end": 321887217
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/horse/horse_black.png",
      "start": 321887217,
      "end": 321896408
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/horse/horse_brown.png",
      "start": 321896408,
      "end": 321906339
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/horse/horse_chestnut.png",
      "start": 321906339,
      "end": 321916851
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/horse/horse_creamy.png",
      "start": 321916851,
      "end": 321926525
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/horse/horse_darkbrown.png",
      "start": 321926525,
      "end": 321935796
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/horse/horse_gray.png",
      "start": 321935796,
      "end": 321947494
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/horse/horse_markings_blackdots.png",
      "start": 321947494,
      "end": 321952895
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/horse/horse_markings_white.png",
      "start": 321952895,
      "end": 321956563
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/horse/horse_markings_whitedots.png",
      "start": 321956563,
      "end": 321960563
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/horse/horse_markings_whitefield.png",
      "start": 321960563,
      "end": 321965290
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/horse/horse_skeleton.png",
      "start": 321965290,
      "end": 321976933
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/horse/horse_white.png",
      "start": 321976933,
      "end": 321986347
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/horse/horse_zombie.png",
      "start": 321986347,
      "end": 322000345
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/horse/mule.png",
      "start": 322000345,
      "end": 322011639
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/redcow.png",
      "start": 322011639,
      "end": 322013595
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/skeleton_wither.png",
      "start": 322013595,
      "end": 322014998
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/snowman.png",
      "start": 322014998,
      "end": 322016079
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/villager/butcher.png",
      "start": 322016079,
      "end": 322017469
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/villager/farmer.png",
      "start": 322017469,
      "end": 322019124
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/villager/librarian.png",
      "start": 322019124,
      "end": 322021059
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/villager/priest.png",
      "start": 322021059,
      "end": 322022992
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/villager/smith.png",
      "start": 322022992,
      "end": 322024375
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/villager/villager.png",
      "start": 322024375,
      "end": 322026322
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/witch.png",
      "start": 322026322,
      "end": 322028550
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/wither/wither.png",
      "start": 322028550,
      "end": 322031252
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/wither/wither_armor.png",
      "start": 322031252,
      "end": 322034729
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/wither/wither_invulnerable.png",
      "start": 322034729,
      "end": 322037774
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/wolf_collar.png",
      "start": 322037774,
      "end": 322042101
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/wolf_tame.png",
      "start": 322042101,
      "end": 322046480
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/zombie.png",
      "start": 322046480,
      "end": 322048098
    }, {
      "filename": "/Common/res/TitleUpdate/res/mob/zombie_villager.png",
      "start": 322048098,
      "end": 322050507
    }, {
      "filename": "/Common/res/TitleUpdate/res/particles.png",
      "start": 322050507,
      "end": 322054152
    }, {
      "filename": "/Common/res/TitleUpdate/res/terrain.png",
      "start": 322054152,
      "end": 322196558
    }, {
      "filename": "/Common/res/TitleUpdate/res/terrainMipMapLevel2.png",
      "start": 322196558,
      "end": 322240434
    }, {
      "filename": "/Common/res/TitleUpdate/res/terrainMipMapLevel3.png",
      "start": 322240434,
      "end": 322253052
    }, {
      "filename": "/Common/res/TitleUpdate/res/textures/blocks/fire_0.png",
      "start": 322253052,
      "end": 322269628
    }, {
      "filename": "/Common/res/TitleUpdate/res/textures/blocks/fire_0.txt",
      "start": 322269628,
      "end": 322269682
    }, {
      "filename": "/Common/res/TitleUpdate/res/textures/blocks/fire_1.png",
      "start": 322269682,
      "end": 322286405
    }, {
      "filename": "/Common/res/TitleUpdate/res/textures/blocks/fire_1.txt",
      "start": 322286405,
      "end": 322286406
    }, {
      "filename": "/Common/res/TitleUpdate/res/textures/blocks/lava.png",
      "start": 322286406,
      "end": 322296826
    }, {
      "filename": "/Common/res/TitleUpdate/res/textures/blocks/lava.txt",
      "start": 322296826,
      "end": 322296997
    }, {
      "filename": "/Common/res/TitleUpdate/res/textures/blocks/lava_flow.png",
      "start": 322296997,
      "end": 322306928
    }, {
      "filename": "/Common/res/TitleUpdate/res/textures/blocks/lava_flow.txt",
      "start": 322306928,
      "end": 322306998
    }, {
      "filename": "/Common/res/TitleUpdate/res/textures/blocks/portal.png",
      "start": 322306998,
      "end": 322321164
    }, {
      "filename": "/Common/res/TitleUpdate/res/textures/blocks/portal.txt",
      "start": 322321164,
      "end": 322321165
    }, {
      "filename": "/Common/res/TitleUpdate/res/textures/blocks/water.png",
      "start": 322321165,
      "end": 322335732
    }, {
      "filename": "/Common/res/TitleUpdate/res/textures/blocks/water.txt",
      "start": 322335732,
      "end": 322335882
    }, {
      "filename": "/Common/res/TitleUpdate/res/textures/blocks/water_flow.png",
      "start": 322335882,
      "end": 322346080
    }, {
      "filename": "/Common/res/TitleUpdate/res/textures/blocks/water_flow.txt",
      "start": 322346080,
      "end": 322346081
    }, {
      "filename": "/Common/res/TitleUpdate/res/textures/items/clock.png",
      "start": 322346081,
      "end": 322349298
    }, {
      "filename": "/Common/res/TitleUpdate/res/textures/items/clock.txt",
      "start": 322349298,
      "end": 322349299
    }, {
      "filename": "/Common/res/TitleUpdate/res/textures/items/compass.png",
      "start": 322349299,
      "end": 322350504
    }, {
      "filename": "/Common/res/TitleUpdate/res/textures/items/compass.txt",
      "start": 322350504,
      "end": 322350505
    }, {
      "filename": "/Common/res/TitleUpdate/tutorialDiff",
      "start": 322350505,
      "end": 322439901
    }, {
      "filename": "/Common/res/achievement/bg.png",
      "start": 322439901,
      "end": 322443537
    }, {
      "filename": "/Common/res/achievement/icons.png",
      "start": 322443537,
      "end": 322445026
    }, {
      "filename": "/Common/res/armor/chain_1.png",
      "start": 322445026,
      "end": 322445990
    }, {
      "filename": "/Common/res/armor/chain_2.png",
      "start": 322445990,
      "end": 322446513
    }, {
      "filename": "/Common/res/armor/cloth_1.png",
      "start": 322446513,
      "end": 322447652
    }, {
      "filename": "/Common/res/armor/cloth_2.png",
      "start": 322447652,
      "end": 322448362
    }, {
      "filename": "/Common/res/armor/diamond_1.png",
      "start": 322448362,
      "end": 322449580
    }, {
      "filename": "/Common/res/armor/diamond_2.png",
      "start": 322449580,
      "end": 322450304
    }, {
      "filename": "/Common/res/armor/gold_1.png",
      "start": 322450304,
      "end": 322451502
    }, {
      "filename": "/Common/res/armor/gold_2.png",
      "start": 322451502,
      "end": 322452210
    }, {
      "filename": "/Common/res/armor/iron_1.png",
      "start": 322452210,
      "end": 322453343
    }, {
      "filename": "/Common/res/armor/iron_2.png",
      "start": 322453343,
      "end": 322454029
    }, {
      "filename": "/Common/res/armor/power.png",
      "start": 322454029,
      "end": 322455829
    }, {
      "filename": "/Common/res/art/kz.png",
      "start": 322455829,
      "end": 322533850
    }, {
      "filename": "/Common/res/audio/Minecraft.xgs",
      "start": 322533850,
      "end": 322534338
    }, {
      "filename": "/Common/res/audio/minecraft.xsb",
      "start": 322534338,
      "end": 322543426
    }, {
      "filename": "/Common/res/audio/resident.xwb",
      "start": 322543426,
      "end": 330190658
    }, {
      "filename": "/Common/res/audio/streamed.xwb",
      "start": 330190658,
      "end": 390844226
    }, {
      "filename": "/Common/res/environment/clouds.png",
      "start": 390844226,
      "end": 390857937
    }, {
      "filename": "/Common/res/environment/rain.png",
      "start": 390857937,
      "end": 390860477
    }, {
      "filename": "/Common/res/environment/snow.png",
      "start": 390860477,
      "end": 390861295
    }, {
      "filename": "/Common/res/font/Mojangles_11.png",
      "start": 390861295,
      "end": 390865373
    }, {
      "filename": "/Common/res/font/Mojangles_7.png",
      "start": 390865373,
      "end": 390868391
    }, {
      "filename": "/Common/res/font/default.png",
      "start": 390868391,
      "end": 390871208
    }, {
      "filename": "/Common/res/gui/background.png",
      "start": 390871208,
      "end": 390872219
    }, {
      "filename": "/Common/res/gui/container.png",
      "start": 390872219,
      "end": 390875014
    }, {
      "filename": "/Common/res/gui/crafting.png",
      "start": 390875014,
      "end": 390877770
    }, {
      "filename": "/Common/res/gui/furnace.png",
      "start": 390877770,
      "end": 390880923
    }, {
      "filename": "/Common/res/gui/gui.png",
      "start": 390880923,
      "end": 390895133
    }, {
      "filename": "/Common/res/gui/icons.png",
      "start": 390895133,
      "end": 390897556
    }, {
      "filename": "/Common/res/gui/inventory.png",
      "start": 390897556,
      "end": 390900317
    }, {
      "filename": "/Common/res/gui/items.png",
      "start": 390900317,
      "end": 390921698
    }, {
      "filename": "/Common/res/gui/logo.png",
      "start": 390921698,
      "end": 390934623
    }, {
      "filename": "/Common/res/gui/particles.png",
      "start": 390934623,
      "end": 390936615
    }, {
      "filename": "/Common/res/gui/slot.png",
      "start": 390936615,
      "end": 390938444
    }, {
      "filename": "/Common/res/gui/trap.png",
      "start": 390938444,
      "end": 390940565
    }, {
      "filename": "/Common/res/gui/unknown_pack.png",
      "start": 390940565,
      "end": 390953578
    }, {
      "filename": "/Common/res/item/arrows.png",
      "start": 390953578,
      "end": 390953900
    }, {
      "filename": "/Common/res/item/boat.png",
      "start": 390953900,
      "end": 390956289
    }, {
      "filename": "/Common/res/item/cart.png",
      "start": 390956289,
      "end": 390958543
    }, {
      "filename": "/Common/res/item/door.png",
      "start": 390958543,
      "end": 390959572
    }, {
      "filename": "/Common/res/item/sign.png",
      "start": 390959572,
      "end": 390960832
    }, {
      "filename": "/Common/res/lang/en_US.lang",
      "start": 390960832,
      "end": 390996833
    }, {
      "filename": "/Common/res/misc/dial.png",
      "start": 390996833,
      "end": 390997064
    }, {
      "filename": "/Common/res/misc/foliagecolor.png",
      "start": 390997064,
      "end": 391014757
    }, {
      "filename": "/Common/res/misc/footprint.png",
      "start": 391014757,
      "end": 391015703
    }, {
      "filename": "/Common/res/misc/grasscolor.png",
      "start": 391015703,
      "end": 391040940
    }, {
      "filename": "/Common/res/misc/mapbg.png",
      "start": 391040940,
      "end": 391041537
    }, {
      "filename": "/Common/res/misc/mapicons.png",
      "start": 391041537,
      "end": 391044707
    }, {
      "filename": "/Common/res/misc/pumpkinblur.png",
      "start": 391044707,
      "end": 391086830
    }, {
      "filename": "/Common/res/misc/shadow.png",
      "start": 391086830,
      "end": 391087698
    }, {
      "filename": "/Common/res/misc/vignette.png",
      "start": 391087698,
      "end": 391111855
    }, {
      "filename": "/Common/res/misc/water.png",
      "start": 391111855,
      "end": 391112161
    }, {
      "filename": "/Common/res/misc/watercolor.png",
      "start": 391112161,
      "end": 391115635
    }, {
      "filename": "/Common/res/mob/char.png",
      "start": 391115635,
      "end": 391116995
    }, {
      "filename": "/Common/res/mob/char1.png",
      "start": 391116995,
      "end": 391118750
    }, {
      "filename": "/Common/res/mob/char2.png",
      "start": 391118750,
      "end": 391123089
    }, {
      "filename": "/Common/res/mob/char3.png",
      "start": 391123089,
      "end": 391127323
    }, {
      "filename": "/Common/res/mob/char4.png",
      "start": 391127323,
      "end": 391131970
    }, {
      "filename": "/Common/res/mob/char5.png",
      "start": 391131970,
      "end": 391136221
    }, {
      "filename": "/Common/res/mob/char6.png",
      "start": 391136221,
      "end": 391140762
    }, {
      "filename": "/Common/res/mob/char7.png",
      "start": 391140762,
      "end": 391143109
    }, {
      "filename": "/Common/res/mob/chicken.png",
      "start": 391143109,
      "end": 391143601
    }, {
      "filename": "/Common/res/mob/cow.png",
      "start": 391143601,
      "end": 391144939
    }, {
      "filename": "/Common/res/mob/creeper.png",
      "start": 391144939,
      "end": 391147939
    }, {
      "filename": "/Common/res/mob/ghast.png",
      "start": 391147939,
      "end": 391148835
    }, {
      "filename": "/Common/res/mob/ghast_fire.png",
      "start": 391148835,
      "end": 391149778
    }, {
      "filename": "/Common/res/mob/pig.png",
      "start": 391149778,
      "end": 391153569
    }, {
      "filename": "/Common/res/mob/pigman.png",
      "start": 391153569,
      "end": 391156231
    }, {
      "filename": "/Common/res/mob/pigzombie.png",
      "start": 391156231,
      "end": 391159244
    }, {
      "filename": "/Common/res/mob/saddle.png",
      "start": 391159244,
      "end": 391159623
    }, {
      "filename": "/Common/res/mob/sheep.png",
      "start": 391159623,
      "end": 391162057
    }, {
      "filename": "/Common/res/mob/sheep_fur.png",
      "start": 391162057,
      "end": 391163718
    }, {
      "filename": "/Common/res/mob/skeleton.png",
      "start": 391163718,
      "end": 391164612
    }, {
      "filename": "/Common/res/mob/slime.png",
      "start": 391164612,
      "end": 391165245
    }, {
      "filename": "/Common/res/mob/spider.png",
      "start": 391165245,
      "end": 391167799
    }, {
      "filename": "/Common/res/mob/spider_eyes.png",
      "start": 391167799,
      "end": 391168054
    }, {
      "filename": "/Common/res/mob/squid.png",
      "start": 391168054,
      "end": 391168972
    }, {
      "filename": "/Common/res/mob/wolf.png",
      "start": 391168972,
      "end": 391173324
    }, {
      "filename": "/Common/res/mob/wolf_angry.png",
      "start": 391173324,
      "end": 391176547
    }, {
      "filename": "/Common/res/mob/wolf_tame.png",
      "start": 391176547,
      "end": 391180914
    }, {
      "filename": "/Common/res/mob/zombie.png",
      "start": 391180914,
      "end": 391182257
    }, {
      "filename": "/Common/res/pack.png",
      "start": 391182257,
      "end": 391209524
    }, {
      "filename": "/Common/res/particles.png",
      "start": 391209524,
      "end": 391210368
    }, {
      "filename": "/Common/res/terrain.png",
      "start": 391210368,
      "end": 391275418
    }, {
      "filename": "/Common/res/terrain/moon.png",
      "start": 391275418,
      "end": 391276328
    }, {
      "filename": "/Common/res/terrain/sun.png",
      "start": 391276328,
      "end": 391277127
    }, {
      "filename": "/Common/res/title/black.png",
      "start": 391277127,
      "end": 391277301
    }, {
      "filename": "/Common/res/title/mclogo.png",
      "start": 391277301,
      "end": 391282711
    }, {
      "filename": "/Common/res/title/mojang.png",
      "start": 391282711,
      "end": 391284616
    } ],
    "remote_package_size": 391284616
  });
})();

// end include: /tmp/tmp2nl808ek.js
var arguments_ = [];

var thisProgram = "./this.program";

var quit_ = (status, toThrow) => {
  throw toThrow;
};

// In MODULARIZE mode _scriptName needs to be captured already at the very top of the page immediately when the page is parsed, so it is generated there
// before the page load. In non-MODULARIZE modes generate it here.
var _scriptName = globalThis.document?.currentScript?.src;

if (typeof __filename != "undefined") {
  // Node
  _scriptName = __filename;
} else if (ENVIRONMENT_IS_WORKER) {
  _scriptName = self.location.href;
}

// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = "";

function locateFile(path) {
  if (Module["locateFile"]) {
    return Module["locateFile"](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var readAsync, readBinary;

if (ENVIRONMENT_IS_NODE) {
  // These modules will usually be used on Node.js. Load them eagerly to avoid
  // the complexity of lazy-loading.
  var fs = require("node:fs");
  scriptDirectory = __dirname + "/";
  // include: node_shell_read.js
  readBinary = filename => {
    // We need to re-wrap `file://` strings to URLs.
    filename = isFileURI(filename) ? new URL(filename) : filename;
    var ret = fs.readFileSync(filename);
    return ret;
  };
  readAsync = async (filename, binary = true) => {
    // See the comment in the `readBinary` function.
    filename = isFileURI(filename) ? new URL(filename) : filename;
    var ret = fs.readFileSync(filename, binary ? undefined : "utf8");
    return ret;
  };
  // end include: node_shell_read.js
  if (process.argv.length > 1) {
    thisProgram = process.argv[1].replace(/\\/g, "/");
  }
  arguments_ = process.argv.slice(2);
  // MODULARIZE will export the module in the proper place outside, we don't need to export here
  if (typeof module != "undefined") {
    module["exports"] = Module;
  }
  quit_ = (status, toThrow) => {
    process.exitCode = status;
    throw toThrow;
  };
} else // Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  try {
    scriptDirectory = new URL(".", _scriptName).href;
  } catch {}
  // Differentiate the Web Worker from the Node Worker case, as reading must
  // be done differently.
  if (!ENVIRONMENT_IS_NODE) {
    // include: web_or_worker_shell_read.js
    if (ENVIRONMENT_IS_WORKER) {
      readBinary = url => {
        var xhr = new XMLHttpRequest;
        xhr.open("GET", url, false);
        xhr.responseType = "arraybuffer";
        xhr.send(null);
        return new Uint8Array(/** @type{!ArrayBuffer} */ (xhr.response));
      };
    }
    readAsync = async url => {
      // Fetch has some additional restrictions over XHR, like it can't be used on a file:// url.
      // See https://github.com/github/fetch/pull/92#issuecomment-140665932
      // Cordova or Electron apps are typically loaded from a file:// url.
      // So use XHR on webview if URL is a file URL.
      if (isFileURI(url)) {
        return new Promise((resolve, reject) => {
          var xhr = new XMLHttpRequest;
          xhr.open("GET", url, true);
          xhr.responseType = "arraybuffer";
          xhr.onload = () => {
            if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
              // file URLs can return 0
              resolve(xhr.response);
              return;
            }
            reject(xhr.status);
          };
          xhr.onerror = reject;
          xhr.send(null);
        });
      }
      var response = await fetch(url, {
        credentials: "same-origin"
      });
      if (response.ok) {
        return response.arrayBuffer();
      }
      throw new Error(response.status + " : " + response.url);
    };
  }
} else {}

// Set up the out() and err() hooks, which are how we can print to stdout or
// stderr, respectively.
// Normally just binding console.log/console.error here works fine, but
// under node (with workers) we see missing/out-of-order messages so route
// directly to stdout and stderr.
// See https://github.com/emscripten-core/emscripten/issues/14804
var defaultPrint = console.log.bind(console);

var defaultPrintErr = console.error.bind(console);

if (ENVIRONMENT_IS_NODE) {
  var utils = require("node:util");
  var stringify = a => typeof a == "object" ? utils.inspect(a) : a;
  defaultPrint = (...args) => fs.writeSync(1, args.map(stringify).join(" ") + "\n");
  defaultPrintErr = (...args) => fs.writeSync(2, args.map(stringify).join(" ") + "\n");
}

var out = defaultPrint;

var err = defaultPrintErr;

// end include: shell.js
// include: preamble.js
// === Preamble library stuff ===
// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html
var wasmBinary;

// Wasm globals
// For sending to workers.
var wasmModule;

//========================================
// Runtime essentials
//========================================
// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS;

// In STRICT mode, we only define assert() when ASSERTIONS is set.  i.e. we
// don't define it at all in release modes.  This matches the behaviour of
// MINIMAL_RUNTIME.
// TODO(sbc): Make this the default even without STRICT enabled.
/** @type {function(*, string=)} */ function assert(condition, text) {
  if (!condition) {
    // This build was created without ASSERTIONS defined.  `assert()` should not
    // ever be called in this configuration but in case there are callers in
    // the wild leave this simple abort() implementation here for now.
    abort(text);
  }
}

/**
 * Indicates whether filename is delivered via file protocol (as opposed to http/https)
 * @noinline
 */ var isFileURI = filename => filename.startsWith("file://");

// include: runtime_common.js
// include: runtime_stack_check.js
// end include: runtime_stack_check.js
// include: runtime_exceptions.js
// Base Emscripten EH error class
class EmscriptenEH {}

class EmscriptenSjLj extends EmscriptenEH {}

// end include: runtime_exceptions.js
// include: runtime_debug.js
// end include: runtime_debug.js
// Support for growable heap + pthreads, where the buffer may change, so JS views
// must be updated.
function growMemViews() {
  // `updateMemoryViews` updates all the views simultaneously, so it's enough to check any of them.
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
}

if (ENVIRONMENT_IS_NODE && (ENVIRONMENT_IS_PTHREAD)) {
  // Create as web-worker-like an environment as we can.
  globalThis.self = globalThis;
  var parentPort = worker_threads.parentPort;
  // Deno and Bun already have `postMessage` defined on the global scope and
  // deliver messages to `globalThis.onmessage`, so we must not duplicate that
  // behavior here if `postMessage` is already present.
  if (!globalThis.postMessage) {
    parentPort.on("message", msg => globalThis.onmessage?.({
      data: msg
    }));
    globalThis.postMessage = msg => parentPort.postMessage(msg);
  }
  // Node.js Workers do not pass postMessage()s and uncaught exception events to the parent
  // thread necessarily in the same order where they were generated in sequential program order.
  // See https://github.com/nodejs/node/issues/59617
  // To remedy this, capture all uncaughtExceptions in the Worker, and sequentialize those over
  // to the same postMessage pipe that other messages use.
  process.on("uncaughtException", err => {
    postMessage({
      cmd: "uncaughtException",
      error: err
    });
    // Also shut down the Worker to match the same semantics as if this uncaughtException
    // handler was not registered.
    // (n.b. this will not shut down the whole Node.js app process, but just the Worker)
    process.exit(1);
  });
}

// include: runtime_pthread.js
// Pthread Web Worker handling code.
// This code runs only on pthread web workers and handles pthread setup
// and communication with the main thread via postMessage.
var startWorker;

if (ENVIRONMENT_IS_PTHREAD) {
  // Thread-local guard variable for one-time init of the JS state
  var initializedJS = false;
  // Turn unhandled rejected promises into errors so that the main thread will be
  // notified about them.
  self.onunhandledrejection = e => {
    throw e.reason || e;
  };
  function handleMessage(e) {
    try {
      var msgData = e["data"];
      //dbg('msgData: ' + Object.keys(msgData));
      var cmd = msgData.cmd;
      if (cmd === "load") {
        // Preload command that is called once per worker to parse and load the Emscripten code.
        // Until we initialize the runtime, queue up any further incoming messages.
        let messageQueue = [];
        self.onmessage = e => messageQueue.push(e);
        // And add a callback for when the runtime is initialized.
        startWorker = () => {
          // Notify the main thread that this thread has loaded.
          postMessage({
            cmd: "loaded"
          });
          // Process any messages that were queued before the thread was ready.
          for (let msg of messageQueue) {
            handleMessage(msg);
          }
          // Restore the real message handler.
          self.onmessage = handleMessage;
        };
        // Use `const` here to ensure that the variable is scoped only to
        // that iteration, allowing safe reference from a closure.
        for (const handler of msgData.handlers) {
          // If the main module has a handler for a certain event, but no
          // handler exists on the pthread worker, then proxy that handler
          // back to the main thread.
          if (!Module[handler] || Module[handler].proxy) {
            Module[handler] = (...args) => {
              postMessage({
                cmd: "callHandler",
                handler,
                args
              });
            };
            // Rebind the out / err handlers if needed
            if (handler == "print") out = Module[handler];
            if (handler == "printErr") err = Module[handler];
          }
        }
        wasmMemory = msgData.wasmMemory;
        updateMemoryViews();
        wasmModule = msgData.wasmModule;
        createWasm();
        run();
      } else if (cmd === "run") {
        // Call inside JS module to set up the stack frame for this pthread in JS module scope.
        // This needs to be the first thing that we do, as we cannot call to any C/C++ functions
        // until the thread stack is initialized.
        establishStackSpace(msgData.pthread_ptr);
        // Pass the thread address to wasm to store it for fast access.
        __emscripten_thread_init(msgData.pthread_ptr, /*is_main=*/ 0, /*is_runtime=*/ 0, /*can_block=*/ 1, 0, 0);
        PThread.threadInitTLS();
        // Await mailbox notifications with `Atomics.waitAsync` so we can start
        // using the fast `Atomics.notify` notification path.
        __emscripten_thread_mailbox_await(msgData.pthread_ptr);
        if (!initializedJS) {
          initializedJS = true;
        }
        try {
          invokeEntryPoint(msgData.start_routine, msgData.arg);
        } catch (ex) {
          if (ex != "unwind") {
            // The pthread "crashed".  Do not call `_emscripten_thread_exit` (which
            // would make this thread joinable).  Instead, re-throw the exception
            // and let the top level handler propagate it back to the main thread.
            throw ex;
          }
        }
      } else if (msgData.target === "setimmediate") {} else if (cmd === "checkMailbox") {
        if (initializedJS) {
          checkMailbox();
        }
      } else if (cmd) {
        // The received message looks like something that should be handled by this message
        // handler, (since there is a cmd field present), but is not one of the
        // recognized commands:
        err(`worker: received unknown command ${cmd}`);
        err(msgData);
      }
    } catch (ex) {
      __emscripten_thread_crashed();
      throw ex;
    }
  }
  self.onmessage = handleMessage;
}

// ENVIRONMENT_IS_PTHREAD
// end include: runtime_pthread.js
// Memory management
var runtimeInitialized = false;

function updateMemoryViews() {
  var b = wasmMemory.buffer;
  HEAP8 = new Int8Array(b);
  HEAP16 = new Int16Array(b);
  HEAPU8 = new Uint8Array(b);
  HEAPU16 = new Uint16Array(b);
  HEAP32 = new Int32Array(b);
  HEAPU32 = new Uint32Array(b);
  HEAPF32 = new Float32Array(b);
  HEAPF64 = new Float64Array(b);
  HEAP64 = new BigInt64Array(b);
  HEAPU64 = new BigUint64Array(b);
}

// In non-standalone/normal mode, we create the memory here.
// include: runtime_init_memory.js
// Create the wasm memory. (Note: this only applies if IMPORTED_MEMORY is defined)
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
function initMemory() {
  if ((ENVIRONMENT_IS_PTHREAD)) {
    return;
  }
  if (Module["wasmMemory"]) {
    wasmMemory = Module["wasmMemory"];
  } else {
    var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;
    /** @suppress {checkTypes} */ wasmMemory = new WebAssembly.Memory({
      "initial": INITIAL_MEMORY / 65536,
      // In theory we should not need to emit the maximum if we want "unlimited"
      // or 4GB of memory, but VMs error on that atm, see
      // https://github.com/emscripten-core/emscripten/issues/14130
      // And in the pthreads case we definitely need to emit a maximum. So
      // always emit one.
      "maximum": 32768,
      "shared": true
    });
  }
  updateMemoryViews();
}

// end include: runtime_init_memory.js
// include: memoryprofiler.js
// end include: memoryprofiler.js
// end include: runtime_common.js
function preRun() {
  if (Module["preRun"]) {
    if (typeof Module["preRun"] == "function") Module["preRun"] = [ Module["preRun"] ];
    while (Module["preRun"].length) {
      addOnPreRun(Module["preRun"].shift());
    }
  }
  // Begin ATPRERUNS hooks
  callRuntimeCallbacks(onPreRuns);
}

function initRuntime() {
  runtimeInitialized = true;
  if (ENVIRONMENT_IS_PTHREAD) return startWorker();
  // Begin ATINITS hooks
  if (!Module["noFSInit"] && !FS.initialized) FS.init();
  TTY.init();
  // End ATINITS hooks
  wasmExports["__wasm_call_ctors"]();
  // Begin ATPOSTCTORS hooks
  FS.ignorePermissions = false;
}

function preMain() {}

function postRun() {
  if ((ENVIRONMENT_IS_PTHREAD)) {
    return;
  }
  // PThreads reuse the runtime from the main thread.
  if (Module["postRun"]) {
    if (typeof Module["postRun"] == "function") Module["postRun"] = [ Module["postRun"] ];
    while (Module["postRun"].length) {
      addOnPostRun(Module["postRun"].shift());
    }
  }
  // Begin ATPOSTRUNS hooks
  callRuntimeCallbacks(onPostRuns);
}

/**
 * @param {string|number=} what
 */ function abort(what) {
  Module["onAbort"]?.(what);
  what = `Aborted(${what})`;
  // TODO(sbc): Should we remove printing and leave it up to whoever
  // catches the exception?
  err(what);
  ABORT = true;
  what += ". Build with -sASSERTIONS for more info.";
  // Use a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  // FIXME This approach does not work in Wasm EH because it currently does not assume
  // all RuntimeErrors are from traps; it decides whether a RuntimeError is from
  // a trap or not based on a hidden field within the object. So at the moment
  // we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
  // allows this in the wasm spec.
  // Suppress closure compiler warning here. Closure compiler's builtin extern
  // definition for WebAssembly.RuntimeError claims it takes no arguments even
  // though it can.
  // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.
  /** @suppress {checkTypes} */ var e = new WebAssembly.RuntimeError(what);
  // Throw the error whether or not MODULARIZE is set because abort is used
  // in code paths apart from instantiation where an exception is expected
  // to be thrown when abort is called.
  throw e;
}

var wasmBinaryFile;

function findWasmBinary() {
  return locateFile("Minecraft.Client.wasm");
}

function getBinarySync(file) {
  if (file == wasmBinaryFile && wasmBinary) {
    return new Uint8Array(wasmBinary);
  }
  if (readBinary) {
    return readBinary(file);
  }
  // Throwing a plain string here, even though it not normally advisable since
  // this gets turning into an `abort` in instantiateArrayBuffer.
  throw "both async and sync fetching of the wasm failed";
}

async function getWasmBinary(binaryFile) {
  // If we don't have the binary yet, load it asynchronously using readAsync.
  if (!wasmBinary) {
    // Fetch the binary using readAsync
    try {
      var response = await readAsync(binaryFile);
      return new Uint8Array(response);
    } catch {}
  }
  // Otherwise, getBinarySync should be able to get it synchronously
  return getBinarySync(binaryFile);
}

async function instantiateArrayBuffer(binaryFile, imports) {
  try {
    var binary = await getWasmBinary(binaryFile);
    var instance = await WebAssembly.instantiate(binary, imports);
    return instance;
  } catch (reason) {
    err(`failed to asynchronously prepare wasm: ${reason}`);
    abort(reason);
  }
}

async function instantiateAsync(binary, binaryFile, imports) {
  if (!binary && !isFileURI(binaryFile) && !ENVIRONMENT_IS_NODE) {
    try {
      var response = fetch(binaryFile, {
        credentials: "same-origin"
      });
      var instantiationResult = await WebAssembly.instantiateStreaming(response, imports);
      return instantiationResult;
    } catch (reason) {
      // We expect the most common failure cause to be a bad MIME type for the binary,
      // in which case falling back to ArrayBuffer instantiation should work.
      err(`wasm streaming compile failed: ${reason}`);
      err("falling back to ArrayBuffer instantiation");
    }
  }
  return instantiateArrayBuffer(binaryFile, imports);
}

function getWasmImports() {
  assignWasmImports();
  // prepare imports
  var imports = {
    "env": wasmImports,
    "wasi_snapshot_preview1": wasmImports
  };
  return imports;
}

// Create the wasm instance.
// Receives the wasm imports, returns the exports.
async function createWasm() {
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  /** @param {WebAssembly.Module=} module*/ function receiveInstance(instance, module) {
    wasmExports = instance.exports;
    registerTLSInit(wasmExports["_emscripten_tls_init"]);
    assignWasmExports(wasmExports);
    // We now have the Wasm module loaded up, keep a reference to the compiled module so we can post it to the workers.
    wasmModule = module;
    removeRunDependency("wasm-instantiate");
    return wasmExports;
  }
  addRunDependency("wasm-instantiate");
  // Prefer streaming instantiation if available.
  function receiveInstantiationResult(result) {
    // 'result' is a ResultObject object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    return receiveInstance(result["instance"], result["module"]);
  }
  var info = getWasmImports();
  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to
  // run the instantiation parallel to any other async startup actions they are
  // performing.
  // Also pthreads and wasm workers initialize the wasm instance through this
  // path.
  if (Module["instantiateWasm"]) {
    return new Promise((resolve, reject) => {
      Module["instantiateWasm"](info, (inst, mod) => {
        resolve(receiveInstance(inst, mod));
      });
    });
  }
  if ((ENVIRONMENT_IS_PTHREAD)) {
    // Instantiate from the module that was received via postMessage from
    // the main thread. We can just use sync instantiation in the worker.
    var instance = new WebAssembly.Instance(wasmModule, getWasmImports());
    return receiveInstance(instance, wasmModule);
  }
  wasmBinaryFile ??= findWasmBinary();
  var result = await instantiateAsync(wasmBinary, wasmBinaryFile, info);
  var exports = receiveInstantiationResult(result);
  return exports;
}

// end include: preamble.js
// Begin JS library code
class ExitStatus {
  name="ExitStatus";
  constructor(status) {
    this.message = `Program terminated with exit(${status})`;
    this.status = status;
  }
}

/** @type {!Int16Array} */ var HEAP16;

/** @type {!Int32Array} */ var HEAP32;

/** not-@type {!BigInt64Array} */ var HEAP64;

/** @type {!Int8Array} */ var HEAP8;

/** @type {!Float32Array} */ var HEAPF32;

/** @type {!Float64Array} */ var HEAPF64;

/** @type {!Uint16Array} */ var HEAPU16;

/** @type {!Uint32Array} */ var HEAPU32;

/** not-@type {!BigUint64Array} */ var HEAPU64;

/** @type {!Uint8Array} */ var HEAPU8;

var terminateWorker = worker => {
  worker.terminate();
  // terminate() can be asynchronous, so in theory the worker can continue
  // to run for some amount of time after termination.  However from our POV
  // the worker is now dead and we don't want to hear from it again, so we stub
  // out its message handler here.  This avoids having to check in each of
  // the onmessage handlers if the message was coming from a valid worker.
  worker.onmessage = e => {};
};

var cleanupThread = pthread_ptr => {
  var worker = PThread.pthreads[pthread_ptr];
  PThread.returnWorkerToPool(worker);
};

var callRuntimeCallbacks = callbacks => {
  while (callbacks.length > 0) {
    // Pass the module as the first argument.
    callbacks.shift()(Module);
  }
};

var onPreRuns = [];

var addOnPreRun = cb => onPreRuns.push(cb);

var runDependencies = 0;

var dependenciesFulfilled = null;

var removeRunDependency = id => {
  runDependencies--;
  Module["monitorRunDependencies"]?.(runDependencies);
  if (runDependencies == 0) {
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback();
    }
  }
};

var addRunDependency = id => {
  runDependencies++;
  Module["monitorRunDependencies"]?.(runDependencies);
};

var spawnThread = threadParams => {
  var worker = PThread.getNewWorker();
  if (!worker) {
    // No available workers in the PThread pool.
    return 6;
  }
  PThread.runningWorkers.push(worker);
  // Add to pthreads map
  PThread.pthreads[threadParams.pthread_ptr] = worker;
  worker.pthread_ptr = threadParams.pthread_ptr;
  var msg = {
    cmd: "run",
    start_routine: threadParams.startRoutine,
    arg: threadParams.arg,
    pthread_ptr: threadParams.pthread_ptr
  };
  if (ENVIRONMENT_IS_NODE) {
    // Mark worker as weakly referenced once we start executing a pthread,
    // so that its existence does not prevent Node.js from exiting.  This
    // has no effect if the worker is already weakly referenced (e.g. if
    // this worker was previously idle/unused).
    worker.unref();
  }
  // Ask the worker to start executing its pthread entry point function.
  worker.postMessage(msg, threadParams.transferList);
  return 0;
};

var runtimeKeepaliveCounter = 0;

var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;

var stackSave = () => _emscripten_stack_get_current();

var stackRestore = val => __emscripten_stack_restore(val);

var stackAlloc = sz => __emscripten_stack_alloc(sz);

/** @type{function(number, (number|boolean), ...number)} */ var proxyToMainThread = (funcIndex, emAsmAddr, proxyMode, ...callArgs) => {
  // EM_ASM proxying is done by passing a pointer to the address of the EM_ASM
  // content as `emAsmAddr`.  JS library proxying is done by passing an index
  // into `proxiedJSCallArgs` as `funcIndex`. If `emAsmAddr` is non-zero then
  // `funcIndex` will be ignored.
  // Additional arguments are passed after the first three are the actual
  // function arguments.
  // The serialization buffer contains the number of call params, and then
  // all the args here.
  // We also pass 'proxyMode' to C separately, since C needs to look at it.
  // Allocate a buffer (on the stack), which will be copied if necessary by
  // the C code.
  // First passed parameter specifies the number of arguments to the function.
  // When BigInt support is enabled, we must handle types in a more complex
  // way, detecting at runtime if a value is a BigInt or not (as we have no
  // type info here). To do that, add a "prefix" before each value that
  // indicates if it is a BigInt, which effectively doubles the number of
  // values we serialize for proxying. TODO: pack this?
  var bufSize = 8 * callArgs.length * 2;
  var sp = stackSave();
  var args = stackAlloc(bufSize);
  var b = ((args) >> 3);
  for (var arg of callArgs) {
    if (typeof arg == "bigint") {
      // The prefix is non-zero to indicate a bigint.
      (growMemViews(), HEAP64)[b++] = 1n;
      (growMemViews(), HEAP64)[b++] = arg;
    } else {
      // The prefix is zero to indicate a JS Number.
      (growMemViews(), HEAP64)[b++] = 0n;
      (growMemViews(), HEAPF64)[b++] = arg;
    }
  }
  var rtn = __emscripten_run_js_on_main_thread(funcIndex, emAsmAddr, bufSize, args, proxyMode);
  stackRestore(sp);
  return rtn;
};

function _proc_exit(code) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(0, 0, 1, code);
  EXITSTATUS = code;
  if (!keepRuntimeAlive()) {
    PThread.terminateAllThreads();
    Module["onExit"]?.(code);
    ABORT = true;
  }
  quit_(code, new ExitStatus(code));
}

function exitOnMainThread(returnCode) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(1, 0, 0, returnCode);
  _exit(returnCode);
}

/** @param {boolean|number=} implicit */ var exitJS = (status, implicit) => {
  EXITSTATUS = status;
  if (ENVIRONMENT_IS_PTHREAD) {
    // implicit exit can never happen on a pthread
    // When running in a pthread we propagate the exit back to the main thread
    // where it can decide if the whole process should be shut down or not.
    // The pthread may have decided not to exit its own runtime, for example
    // because it runs a main loop, but that doesn't affect the main thread.
    exitOnMainThread(status);
    throw "unwind";
  }
  _proc_exit(status);
};

var _exit = exitJS;

var PThread = {
  unusedWorkers: [],
  runningWorkers: [],
  tlsInitFunctions: [],
  pthreads: {},
  init() {
    if ((!(ENVIRONMENT_IS_PTHREAD))) {
      PThread.initMainThread();
    }
  },
  initMainThread() {
    var pthreadPoolSize = 4;
    // Start loading up the Worker pool, if requested.
    while (pthreadPoolSize--) {
      PThread.allocateUnusedWorker();
    }
    // MINIMAL_RUNTIME takes care of calling loadWasmModuleToAllWorkers
    // in postamble_minimal.js
    addOnPreRun(async () => {
      var pthreadPoolReady = PThread.loadWasmModuleToAllWorkers();
      addRunDependency("loading-workers");
      await pthreadPoolReady;
      removeRunDependency("loading-workers");
    });
  },
  terminateAllThreads: () => {
    // Attempt to kill all workers.  Sadly (at least on the web) there is no
    // way to terminate a worker synchronously, or to be notified when a
    // worker is actually terminated.  This means there is some risk that
    // pthreads will continue to be executing after `worker.terminate` has
    // returned.  For this reason, we don't call `returnWorkerToPool` here or
    // free the underlying pthread data structures.
    for (var worker of PThread.runningWorkers) {
      terminateWorker(worker);
    }
    for (var worker of PThread.unusedWorkers) {
      terminateWorker(worker);
    }
    PThread.unusedWorkers = [];
    PThread.runningWorkers = [];
    PThread.pthreads = {};
  },
  returnWorkerToPool: worker => {
    // We don't want to run main thread queued calls here, since we are doing
    // some operations that leave the worker queue in an invalid state until
    // we are completely done (it would be bad if free() ends up calling a
    // queued pthread_create which looks at the global data structures we are
    // modifying). To achieve that, defer the free() until the very end, when
    // we are all done.
    var pthread_ptr = worker.pthread_ptr;
    delete PThread.pthreads[pthread_ptr];
    // Note: worker is intentionally not terminated so the pool can
    // dynamically grow.
    PThread.unusedWorkers.push(worker);
    PThread.runningWorkers.splice(PThread.runningWorkers.indexOf(worker), 1);
    // Not a running Worker anymore
    // Detach the worker from the pthread object, and return it to the
    // worker pool as an unused worker.
    worker.pthread_ptr = 0;
    // Finally, free the underlying (and now-unused) pthread structure in
    // linear memory.
    __emscripten_thread_free_data(pthread_ptr);
  },
  threadInitTLS() {
    // Call thread init functions (these are the _emscripten_tls_init for each
    // module loaded.
    PThread.tlsInitFunctions.forEach(f => f());
  },
  loadWasmModuleToWorker: worker => new Promise(onFinishedLoading => {
    worker.onmessage = e => {
      var d = e["data"];
      var cmd = d.cmd;
      // If this message is intended to a recipient that is not the main
      // thread, forward it to the target thread.
      if (d.targetThread && d.targetThread != _pthread_self()) {
        var targetWorker = PThread.pthreads[d.targetThread];
        if (targetWorker) {
          targetWorker.postMessage(d, d.transferList);
        } else {
          err(`Internal error! Worker sent a message "${cmd}" to target pthread ${d.targetThread}, but that thread no longer exists!`);
        }
        return;
      }
      if (cmd === "checkMailbox") {
        checkMailbox();
      } else if (cmd === "spawnThread") {
        spawnThread(d);
      } else if (cmd === "cleanupThread") {
        // cleanupThread needs to be run via callUserCallback since it calls
        // back into user code to free thread data. Without this it's possible
        // the unwind or ExitStatus exception could escape here.
        callUserCallback(() => cleanupThread(d.thread));
      } else if (cmd === "loaded") {
        worker.loaded = true;
        // Check that this worker doesn't have an associated pthread.
        if (ENVIRONMENT_IS_NODE && !worker.pthread_ptr) {
          // Once worker is loaded & idle, mark it as weakly referenced,
          // so that mere existence of a Worker in the pool does not prevent
          // Node.js from exiting the app.
          worker.unref();
        }
        onFinishedLoading(worker);
      } else if (d.target === "setimmediate") {
        // Worker wants to postMessage() to itself to implement setImmediate()
        // emulation.
        worker.postMessage(d);
      } else if (cmd === "uncaughtException") {
        // Message handler for Node.js specific out-of-order behavior:
        // https://github.com/nodejs/node/issues/59617
        // A pthread sent an uncaught exception event. Re-raise it on the main thread.
        worker.onerror(d.error);
      } else if (cmd === "callHandler") {
        Module[d.handler](...d.args);
      } else if (cmd) {
        // The received message looks like something that should be handled by this message
        // handler, (since there is a e.data.cmd field present), but is not one of the
        // recognized commands:
        err(`worker sent an unknown command ${cmd}`);
      }
    };
    worker.onerror = e => {
      var message = "worker sent an error!";
      err(`${message} ${e.filename}:${e.lineno}: ${e.message}`);
      throw e;
    };
    if (ENVIRONMENT_IS_NODE) {
      worker.on("message", data => worker.onmessage({
        data
      }));
      worker.on("error", e => worker.onerror(e));
    }
    // When running on a pthread, none of the incoming parameters on the module
    // object are present. Proxy known handlers back to the main thread if specified.
    var handlers = [];
    var knownHandlers = [ "onExit", "onAbort", "print", "printErr" ];
    for (var handler of knownHandlers) {
      if (Module.propertyIsEnumerable(handler)) {
        handlers.push(handler);
      }
    }
    // Ask the new worker to load up the Emscripten-compiled page. This is a heavy operation.
    worker.postMessage({
      cmd: "load",
      handlers,
      wasmMemory,
      wasmModule
    });
  }),
  async loadWasmModuleToAllWorkers() {
    // Instantiation is synchronous in pthreads.
    if (ENVIRONMENT_IS_PTHREAD) {
      return;
    }
    let pthreadPoolReady = Promise.all(PThread.unusedWorkers.map(PThread.loadWasmModuleToWorker));
    return pthreadPoolReady;
  },
  allocateUnusedWorker() {
    var worker;
    var pthreadMainJs = _scriptName;
    // We can't use makeModuleReceiveWithVar here since we want to also
    // call URL.createObjectURL on the mainScriptUrlOrBlob.
    if (Module["mainScriptUrlOrBlob"]) {
      pthreadMainJs = Module["mainScriptUrlOrBlob"];
      if (typeof pthreadMainJs != "string") {
        pthreadMainJs = URL.createObjectURL(pthreadMainJs);
      }
    }
    worker = new Worker(pthreadMainJs, {
      // This is the way that we signal to the node worker that it is hosting
      // a pthread.
      "workerData": "em-pthread",
      // This is the way that we signal to the Web Worker that it is hosting
      // a pthread.
      "name": "em-pthread"
    });
    PThread.unusedWorkers.push(worker);
  },
  getNewWorker() {
    if (PThread.unusedWorkers.length == 0) {
      // PTHREAD_POOL_SIZE_STRICT should show a warning and, if set to level `2`, return from the function.
      PThread.allocateUnusedWorker();
      PThread.loadWasmModuleToWorker(PThread.unusedWorkers[0]);
    }
    return PThread.unusedWorkers.pop();
  }
};

var onPostRuns = [];

var addOnPostRun = cb => onPostRuns.push(cb);

function establishStackSpace(pthread_ptr) {
  var stackHigh = (growMemViews(), HEAPU32)[(((pthread_ptr) + (48)) >> 2)];
  var stackSize = (growMemViews(), HEAPU32)[(((pthread_ptr) + (52)) >> 2)];
  var stackLow = stackHigh - stackSize;
  // Set stack limits used by `emscripten/stack.h` function.  These limits are
  // cached in wasm-side globals to make checks as fast as possible.
  _emscripten_stack_set_limits(stackHigh, stackLow);
  // Call inside wasm module to set up the stack frame for this pthread in wasm module scope
  stackRestore(stackHigh);
}

/**
   * @param {number} ptr
   * @param {string} type
   */ function getValue(ptr, type = "i8") {
  if (type.endsWith("*")) type = "*";
  switch (type) {
   case "i1":
    return (growMemViews(), HEAP8)[ptr];

   case "i8":
    return (growMemViews(), HEAP8)[ptr];

   case "i16":
    return (growMemViews(), HEAP16)[((ptr) >> 1)];

   case "i32":
    return (growMemViews(), HEAP32)[((ptr) >> 2)];

   case "i64":
    return (growMemViews(), HEAP64)[((ptr) >> 3)];

   case "float":
    return (growMemViews(), HEAPF32)[((ptr) >> 2)];

   case "double":
    return (growMemViews(), HEAPF64)[((ptr) >> 3)];

   case "*":
    return (growMemViews(), HEAPU32)[((ptr) >> 2)];

   default:
    abort(`invalid type for getValue: ${type}`);
  }
}

var wasmTableMirror = [];

var getWasmTableEntry = funcPtr => {
  var func = wasmTableMirror[funcPtr];
  if (!func) {
    /** @suppress {checkTypes} */ wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
  }
  return func;
};

var invokeEntryPoint = (ptr, arg) => {
  // An old thread on this worker may have been canceled without returning the
  // `runtimeKeepaliveCounter` to zero. Reset it now so the new thread won't
  // be affected.
  runtimeKeepaliveCounter = 0;
  // Same for noExitRuntime.  The default for pthreads should always be false
  // otherwise pthreads would never complete and attempts to pthread_join to
  // them would block forever.
  // pthreads can still choose to set `noExitRuntime` explicitly, or
  // call emscripten_unwind_to_js_event_loop to extend their lifetime beyond
  // their main function.  See comment in src/runtime_pthread.js for more.
  noExitRuntime = 0;
  // pthread entry points are always of signature 'void *ThreadMain(void *arg)'
  // Native codebases sometimes spawn threads with other thread entry point
  // signatures, such as void ThreadMain(void *arg), void *ThreadMain(), or
  // void ThreadMain().  That is not acceptable per C/C++ specification, but
  // x86 compiler ABI extensions enable that to work. If you find the
  // following line to crash, either change the signature to "proper" void
  // *ThreadMain(void *arg) form, or try linking with the Emscripten linker
  // flag -sEMULATE_FUNCTION_POINTER_CASTS to add in emulation for this x86
  // ABI extension.
  var result = getWasmTableEntry(ptr)(arg);
  function finish(result) {
    // In MINIMAL_RUNTIME the noExitRuntime concept does not apply to
    // pthreads. To exit a pthread with live runtime, use the function
    // emscripten_unwind_to_js_event_loop() in the pthread body.
    if (keepRuntimeAlive()) {
      EXITSTATUS = result;
      return;
    }
    __emscripten_thread_exit(result);
  }
  finish(result);
};

var noExitRuntime = true;

var registerTLSInit = tlsInitFunc => PThread.tlsInitFunctions.push(tlsInitFunc);

/**
   * @param {number} ptr
   * @param {number} value
   * @param {string} type
   */ function setValue(ptr, value, type = "i8") {
  if (type.endsWith("*")) type = "*";
  switch (type) {
   case "i1":
    (growMemViews(), HEAP8)[ptr] = value;
    break;

   case "i8":
    (growMemViews(), HEAP8)[ptr] = value;
    break;

   case "i16":
    (growMemViews(), HEAP16)[((ptr) >> 1)] = value;
    break;

   case "i32":
    (growMemViews(), HEAP32)[((ptr) >> 2)] = value;
    break;

   case "i64":
    (growMemViews(), HEAP64)[((ptr) >> 3)] = BigInt(value);
    break;

   case "float":
    (growMemViews(), HEAPF32)[((ptr) >> 2)] = value;
    break;

   case "double":
    (growMemViews(), HEAPF64)[((ptr) >> 3)] = value;
    break;

   case "*":
    (growMemViews(), HEAPU32)[((ptr) >> 2)] = value;
    break;

   default:
    abort(`invalid type for setValue: ${type}`);
  }
}

var wasmMemory;

var UTF8Decoder = globalThis.TextDecoder && new TextDecoder;

var findStringEnd = (heapOrArray, idx, maxBytesToRead, ignoreNul) => {
  var maxIdx = idx + maxBytesToRead;
  if (ignoreNul) return maxIdx;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on
  // null terminator by itself.
  // As a tiny code save trick, compare idx against maxIdx using a negation,
  // so that maxBytesToRead=undefined/NaN means Infinity.
  while (heapOrArray[idx] && !(idx >= maxIdx)) ++idx;
  return idx;
};

/**
   * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
   * array that contains uint8 values, returns a copy of that string as a
   * Javascript String object.
   * heapOrArray is either a regular array, or a JavaScript typed array view.
   * @param {number=} idx
   * @param {number=} maxBytesToRead
   * @param {boolean=} ignoreNul - If true, the function will not stop on a NUL character.
   * @return {string}
   */ var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead, ignoreNul) => {
  var endPtr = findStringEnd(heapOrArray, idx, maxBytesToRead, ignoreNul);
  // When using conditional TextDecoder, skip it for short strings as the overhead of the native call is not worth it.
  if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
    return UTF8Decoder.decode(heapOrArray.buffer instanceof ArrayBuffer ? heapOrArray.subarray(idx, endPtr) : heapOrArray.slice(idx, endPtr));
  }
  var str = "";
  while (idx < endPtr) {
    // For UTF8 byte structure, see:
    // http://en.wikipedia.org/wiki/UTF-8#Description
    // https://www.ietf.org/rfc/rfc2279.txt
    // https://tools.ietf.org/html/rfc3629
    var u0 = heapOrArray[idx++];
    if (!(u0 & 128)) {
      str += String.fromCharCode(u0);
      continue;
    }
    var u1 = heapOrArray[idx++] & 63;
    if ((u0 & 224) == 192) {
      str += String.fromCharCode(((u0 & 31) << 6) | u1);
      continue;
    }
    var u2 = heapOrArray[idx++] & 63;
    if ((u0 & 240) == 224) {
      u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
    } else {
      u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
    }
    if (u0 < 65536) {
      str += String.fromCharCode(u0);
    } else {
      var ch = u0 - 65536;
      str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
    }
  }
  return str;
};

/**
   * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
   * emscripten HEAP, returns a copy of that string as a Javascript String object.
   *
   * @param {number} ptr
   * @param {number=} maxBytesToRead - An optional length that specifies the
   *   maximum number of bytes to read. You can omit this parameter to scan the
   *   string until the first 0 byte. If maxBytesToRead is passed, and the string
   *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
   *   string will cut short at that byte index.
   * @param {boolean=} ignoreNul - If true, the function will not stop on a NUL character.
   * @return {string}
   */ var UTF8ToString = (ptr, maxBytesToRead, ignoreNul) => ptr ? UTF8ArrayToString((growMemViews(), 
HEAPU8), ptr, maxBytesToRead, ignoreNul) : "";

var ___assert_fail = (condition, filename, line, func) => abort(`Assertion failed: ${UTF8ToString(condition)}, at: ` + [ filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function" ]);

var ___call_sighandler = (fp, sig) => getWasmTableEntry(fp)(sig);

class ExceptionInfo {
  // excPtr - Thrown object pointer to wrap. Metadata pointer is calculated from it.
  constructor(excPtr) {
    this.excPtr = excPtr;
    this.ptr = excPtr - 24;
  }
  set_type(type) {
    (growMemViews(), HEAPU32)[(((this.ptr) + (4)) >> 2)] = type;
  }
  get_type() {
    return (growMemViews(), HEAPU32)[(((this.ptr) + (4)) >> 2)];
  }
  set_destructor(destructor) {
    (growMemViews(), HEAPU32)[(((this.ptr) + (8)) >> 2)] = destructor;
  }
  get_destructor() {
    return (growMemViews(), HEAPU32)[(((this.ptr) + (8)) >> 2)];
  }
  set_caught(caught) {
    caught = caught ? 1 : 0;
    (growMemViews(), HEAP8)[(this.ptr) + (12)] = caught;
  }
  get_caught() {
    return (growMemViews(), HEAP8)[(this.ptr) + (12)] != 0;
  }
  set_rethrown(rethrown) {
    rethrown = rethrown ? 1 : 0;
    (growMemViews(), HEAP8)[(this.ptr) + (13)] = rethrown;
  }
  get_rethrown() {
    return (growMemViews(), HEAP8)[(this.ptr) + (13)] != 0;
  }
  // Initialize native structure fields. Should be called once after allocated.
  init(type, destructor) {
    this.set_adjusted_ptr(0);
    this.set_type(type);
    this.set_destructor(destructor);
  }
  set_adjusted_ptr(adjustedPtr) {
    (growMemViews(), HEAPU32)[(((this.ptr) + (16)) >> 2)] = adjustedPtr;
  }
  get_adjusted_ptr() {
    return (growMemViews(), HEAPU32)[(((this.ptr) + (16)) >> 2)];
  }
}

var uncaughtExceptionCount = 0;

var ___cxa_throw = (ptr, type, destructor) => {
  var info = new ExceptionInfo(ptr);
  // Initialize ExceptionInfo content after it was allocated in __cxa_allocate_exception.
  info.init(type, destructor);
  uncaughtExceptionCount++;
  abort();
};

function pthreadCreateProxied(pthread_ptr, attr, startRoutine, arg) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(2, 0, 1, pthread_ptr, attr, startRoutine, arg);
  return ___pthread_create_js(pthread_ptr, attr, startRoutine, arg);
}

var _emscripten_has_threading_support = () => !!globalThis.SharedArrayBuffer;

var ___pthread_create_js = (pthread_ptr, attr, startRoutine, arg) => {
  if (!_emscripten_has_threading_support()) {
    return 6;
  }
  // List of JS objects that will transfer ownership to the Worker hosting the thread
  var transferList = [];
  var error = 0;
  // Synchronously proxy the thread creation to main thread if possible. If we
  // need to transfer ownership of objects, then proxy asynchronously via
  // postMessage.
  if (ENVIRONMENT_IS_PTHREAD && (transferList.length === 0 || error)) {
    return pthreadCreateProxied(pthread_ptr, attr, startRoutine, arg);
  }
  // If on the main thread, and accessing Canvas/OffscreenCanvas failed, abort
  // with the detected error.
  if (error) return error;
  var threadParams = {
    startRoutine,
    pthread_ptr,
    arg,
    transferList
  };
  if (ENVIRONMENT_IS_PTHREAD) {
    // The prepopulated pool of web workers that can host pthreads is stored
    // in the main JS thread. Therefore if a pthread is attempting to spawn a
    // new thread, the thread creation must be deferred to the main JS thread.
    threadParams.cmd = "spawnThread";
    postMessage(threadParams, transferList);
    // When we defer thread creation this way, we have no way to detect thread
    // creation synchronously today, so we have to assume success and return 0.
    return 0;
  }
  // We are the main thread, so we have the pthread warmup pool in this
  // thread and can fire off JS thread creation directly ourselves.
  return spawnThread(threadParams);
};

var PATH = {
  isAbs: path => path.charAt(0) === "/",
  splitPath: filename => {
    var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    return splitPathRe.exec(filename).slice(1);
  },
  normalizeArray: (parts, allowAboveRoot) => {
    // if the path tries to go above the root, `up` ends up > 0
    var up = 0;
    for (var i = parts.length - 1; i >= 0; i--) {
      var last = parts[i];
      if (last === ".") {
        parts.splice(i, 1);
      } else if (last === "..") {
        parts.splice(i, 1);
        up++;
      } else if (up) {
        parts.splice(i, 1);
        up--;
      }
    }
    // if the path is allowed to go above the root, restore leading ..s
    if (allowAboveRoot) {
      for (;up; up--) {
        parts.unshift("..");
      }
    }
    return parts;
  },
  normalize: path => {
    var isAbsolute = PATH.isAbs(path), trailingSlash = path.slice(-1) === "/";
    // Normalize the path
    path = PATH.normalizeArray(path.split("/").filter(p => !!p), !isAbsolute).join("/");
    if (!path && !isAbsolute) {
      path = ".";
    }
    if (path && trailingSlash) {
      path += "/";
    }
    return (isAbsolute ? "/" : "") + path;
  },
  dirname: path => {
    var result = PATH.splitPath(path), root = result[0], dir = result[1];
    if (!root && !dir) {
      // No dirname whatsoever
      return ".";
    }
    if (dir) {
      // It has a dirname, strip trailing slash
      dir = dir.slice(0, -1);
    }
    return root + dir;
  },
  basename: path => path && path.match(/([^\/]+|\/)\/*$/)[1],
  join: (...paths) => PATH.normalize(paths.join("/")),
  join2: (l, r) => PATH.normalize(l + "/" + r)
};

var initRandomFill = () => {
  // This block is not needed on v19+ since crypto.getRandomValues is builtin
  if (ENVIRONMENT_IS_NODE) {
    var nodeCrypto = require("node:crypto");
    return view => nodeCrypto.randomFillSync(view);
  }
  // like with most Web APIs, we can't use Web Crypto API directly on shared memory,
  // so we need to create an intermediate buffer and copy it to the destination
  return view => (view.set(crypto.getRandomValues(new Uint8Array(view.byteLength))), 
  0);
};

var randomFill = view => (randomFill = initRandomFill())(view);

var PATH_FS = {
  resolve: (...args) => {
    var resolvedPath = "", resolvedAbsolute = false;
    for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path = (i >= 0) ? args[i] : FS.cwd();
      // Skip empty and invalid entries
      if (typeof path != "string") {
        throw new TypeError("Arguments to path.resolve must be strings");
      } else if (!path) {
        return "";
      }
      resolvedPath = path + "/" + resolvedPath;
      resolvedAbsolute = PATH.isAbs(path);
    }
    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)
    resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(p => !!p), !resolvedAbsolute).join("/");
    return ((resolvedAbsolute ? "/" : "") + resolvedPath) || ".";
  },
  relative: (from, to) => {
    from = PATH_FS.resolve(from).slice(1);
    to = PATH_FS.resolve(to).slice(1);
    function trim(arr) {
      var start = 0;
      for (;start < arr.length; start++) {
        if (arr[start] !== "") break;
      }
      var end = arr.length - 1;
      for (;end >= 0; end--) {
        if (arr[end] !== "") break;
      }
      if (start > end) return [];
      return arr.slice(start, end - start + 1);
    }
    var fromParts = trim(from.split("/"));
    var toParts = trim(to.split("/"));
    var length = Math.min(fromParts.length, toParts.length);
    var samePartsLength = length;
    for (var i = 0; i < length; i++) {
      if (fromParts[i] !== toParts[i]) {
        samePartsLength = i;
        break;
      }
    }
    var outputParts = [];
    for (var i = samePartsLength; i < fromParts.length; i++) {
      outputParts.push("..");
    }
    outputParts = outputParts.concat(toParts.slice(samePartsLength));
    return outputParts.join("/");
  }
};

var FS_stdin_getChar_buffer = [];

var lengthBytesUTF8 = str => {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
    // unit, not a Unicode code point of the character! So decode
    // UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var c = str.charCodeAt(i);
    // possibly a lead surrogate
    if (c <= 127) {
      len++;
    } else if (c <= 2047) {
      len += 2;
    } else if (c >= 55296 && c <= 57343) {
      len += 4;
      ++i;
    } else {
      len += 3;
    }
  }
  return len;
};

var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
  // Parameter maxBytesToWrite is not optional. Negative values, 0, null,
  // undefined and false each don't write out any bytes.
  if (!(maxBytesToWrite > 0)) return 0;
  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1;
  // -1 for string null terminator.
  for (var i = 0; i < str.length; ++i) {
    // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description
    // and https://www.ietf.org/rfc/rfc2279.txt
    // and https://tools.ietf.org/html/rfc3629
    var u = str.codePointAt(i);
    if (u <= 127) {
      if (outIdx >= endIdx) break;
      heap[outIdx++] = u;
    } else if (u <= 2047) {
      if (outIdx + 1 >= endIdx) break;
      heap[outIdx++] = 192 | (u >> 6);
      heap[outIdx++] = 128 | (u & 63);
    } else if (u <= 65535) {
      if (outIdx + 2 >= endIdx) break;
      heap[outIdx++] = 224 | (u >> 12);
      heap[outIdx++] = 128 | ((u >> 6) & 63);
      heap[outIdx++] = 128 | (u & 63);
    } else {
      if (outIdx + 3 >= endIdx) break;
      heap[outIdx++] = 240 | (u >> 18);
      heap[outIdx++] = 128 | ((u >> 12) & 63);
      heap[outIdx++] = 128 | ((u >> 6) & 63);
      heap[outIdx++] = 128 | (u & 63);
      // Gotcha: if codePoint is over 0xFFFF, it is represented as a surrogate pair in UTF-16.
      // We need to manually skip over the second code unit for correct iteration.
      i++;
    }
  }
  // Null-terminate the pointer to the buffer.
  heap[outIdx] = 0;
  return outIdx - startIdx;
};

/** @type {function(string, boolean=, number=)} */ var intArrayFromString = (stringy, dontAddNull, length) => {
  var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
  var u8array = new Array(len);
  var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
  if (dontAddNull) u8array.length = numBytesWritten;
  return u8array;
};

var FS_stdin_getChar = () => {
  if (!FS_stdin_getChar_buffer.length) {
    var result = null;
    if (ENVIRONMENT_IS_NODE) {
      // we will read data by chunks of BUFSIZE
      var BUFSIZE = 256;
      var buf = Buffer.alloc(BUFSIZE);
      var bytesRead = 0;
      // For some reason we must suppress a closure warning here, even though
      // fd definitely exists on process.stdin, and is even the proper way to
      // get the fd of stdin,
      // https://github.com/nodejs/help/issues/2136#issuecomment-523649904
      // This started to happen after moving this logic out of library_tty.js,
      // so it is related to the surrounding code in some unclear manner.
      /** @suppress {missingProperties} */ var fd = process.stdin.fd;
      try {
        bytesRead = fs.readSync(fd, buf, 0, BUFSIZE);
      } catch (e) {
        // Cross-platform differences: on Windows, reading EOF throws an
        // exception, but on other OSes, reading EOF returns 0. Uniformize
        // behavior by treating the EOF exception to return 0.
        if (e.toString().includes("EOF")) bytesRead = 0; else throw e;
      }
      if (bytesRead > 0) {
        result = buf.slice(0, bytesRead).toString("utf-8");
      }
    } else if (globalThis.window?.prompt) {
      // Browser.
      result = window.prompt("Input: ");
      // returns null on cancel
      if (result !== null) {
        result += "\n";
      }
    } else {}
    if (!result) {
      return null;
    }
    FS_stdin_getChar_buffer = intArrayFromString(result, true);
  }
  return FS_stdin_getChar_buffer.shift();
};

var TTY = {
  ttys: [],
  init() {},
  shutdown() {},
  register(dev, ops) {
    TTY.ttys[dev] = {
      input: [],
      output: [],
      ops
    };
    FS.registerDevice(dev, TTY.stream_ops);
  },
  stream_ops: {
    open(stream) {
      var tty = TTY.ttys[stream.node.rdev];
      if (!tty) {
        throw new FS.ErrnoError(43);
      }
      stream.tty = tty;
      stream.seekable = false;
    },
    close(stream) {
      // flush any pending line data
      stream.tty.ops.fsync(stream.tty);
    },
    fsync(stream) {
      stream.tty.ops.fsync(stream.tty);
    },
    read(stream, buffer, offset, length, pos) {
      if (!stream.tty || !stream.tty.ops.get_char) {
        throw new FS.ErrnoError(60);
      }
      var bytesRead = 0;
      for (var i = 0; i < length; i++) {
        var result;
        try {
          result = stream.tty.ops.get_char(stream.tty);
        } catch (e) {
          throw new FS.ErrnoError(29);
        }
        if (result === undefined && bytesRead === 0) {
          throw new FS.ErrnoError(6);
        }
        if (result === null || result === undefined) break;
        bytesRead++;
        buffer[offset + i] = result;
      }
      if (bytesRead) {
        stream.node.atime = Date.now();
      }
      return bytesRead;
    },
    write(stream, buffer, offset, length, pos) {
      if (!stream.tty || !stream.tty.ops.put_char) {
        throw new FS.ErrnoError(60);
      }
      try {
        for (var i = 0; i < length; i++) {
          stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
        }
      } catch (e) {
        throw new FS.ErrnoError(29);
      }
      if (length) {
        stream.node.mtime = stream.node.ctime = Date.now();
      }
      return i;
    }
  },
  default_tty_ops: {
    get_char(tty) {
      return FS_stdin_getChar();
    },
    put_char(tty, val) {
      if (val === null || val === 10) {
        out(UTF8ArrayToString(tty.output));
        tty.output = [];
      } else {
        if (val != 0) tty.output.push(val);
      }
    },
    fsync(tty) {
      if (tty.output?.length > 0) {
        out(UTF8ArrayToString(tty.output));
        tty.output = [];
      }
    },
    ioctl_tcgets(tty) {
      // typical setting
      return {
        c_iflag: 25856,
        c_oflag: 5,
        c_cflag: 191,
        c_lflag: 35387,
        c_cc: [ 3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
      };
    },
    ioctl_tcsets(tty, optional_actions, data) {
      // currently just ignore
      return 0;
    },
    ioctl_tiocgwinsz(tty) {
      return [ 24, 80 ];
    }
  },
  default_tty1_ops: {
    put_char(tty, val) {
      if (val === null || val === 10) {
        err(UTF8ArrayToString(tty.output));
        tty.output = [];
      } else {
        if (val != 0) tty.output.push(val);
      }
    },
    fsync(tty) {
      if (tty.output?.length > 0) {
        err(UTF8ArrayToString(tty.output));
        tty.output = [];
      }
    }
  }
};

var zeroMemory = (ptr, size) => (growMemViews(), HEAPU8).fill(0, ptr, ptr + size);

var alignMemory = (size, alignment) => Math.ceil(size / alignment) * alignment;

var mmapAlloc = size => {
  size = alignMemory(size, 65536);
  var ptr = _emscripten_builtin_memalign(65536, size);
  if (ptr) zeroMemory(ptr, size);
  return ptr;
};

var MEMFS = {
  ops_table: null,
  mount(mount) {
    return MEMFS.createNode(null, "/", 16895, 0);
  },
  createNode(parent, name, mode, dev) {
    if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
      // not supported
      throw new FS.ErrnoError(63);
    }
    MEMFS.ops_table ||= {
      dir: {
        node: {
          getattr: MEMFS.node_ops.getattr,
          setattr: MEMFS.node_ops.setattr,
          lookup: MEMFS.node_ops.lookup,
          mknod: MEMFS.node_ops.mknod,
          rename: MEMFS.node_ops.rename,
          unlink: MEMFS.node_ops.unlink,
          rmdir: MEMFS.node_ops.rmdir,
          readdir: MEMFS.node_ops.readdir,
          symlink: MEMFS.node_ops.symlink
        },
        stream: {
          llseek: MEMFS.stream_ops.llseek
        }
      },
      file: {
        node: {
          getattr: MEMFS.node_ops.getattr,
          setattr: MEMFS.node_ops.setattr
        },
        stream: {
          llseek: MEMFS.stream_ops.llseek,
          read: MEMFS.stream_ops.read,
          write: MEMFS.stream_ops.write,
          mmap: MEMFS.stream_ops.mmap,
          msync: MEMFS.stream_ops.msync
        }
      },
      link: {
        node: {
          getattr: MEMFS.node_ops.getattr,
          setattr: MEMFS.node_ops.setattr,
          readlink: MEMFS.node_ops.readlink
        },
        stream: {}
      },
      chrdev: {
        node: {
          getattr: MEMFS.node_ops.getattr,
          setattr: MEMFS.node_ops.setattr
        },
        stream: FS.chrdev_stream_ops
      }
    };
    var node = FS.createNode(parent, name, mode, dev);
    if (FS.isDir(node.mode)) {
      node.node_ops = MEMFS.ops_table.dir.node;
      node.stream_ops = MEMFS.ops_table.dir.stream;
      node.contents = {};
    } else if (FS.isFile(node.mode)) {
      node.node_ops = MEMFS.ops_table.file.node;
      node.stream_ops = MEMFS.ops_table.file.stream;
      // The actual number of bytes used in the typed array, as opposed to
      // contents.length which gives the whole capacity.
      node.usedBytes = 0;
      // The byte data of the file is stored in a typed array.
      // Note: typed arrays are not resizable like normal JS arrays are, so
      // there is a small penalty involved for appending file writes that
      // continuously grow a file similar to std::vector capacity vs used.
      node.contents = MEMFS.emptyFileContents ??= new Uint8Array(0);
    } else if (FS.isLink(node.mode)) {
      node.node_ops = MEMFS.ops_table.link.node;
      node.stream_ops = MEMFS.ops_table.link.stream;
    } else if (FS.isChrdev(node.mode)) {
      node.node_ops = MEMFS.ops_table.chrdev.node;
      node.stream_ops = MEMFS.ops_table.chrdev.stream;
    }
    node.atime = node.mtime = node.ctime = Date.now();
    // add the new node to the parent
    if (parent) {
      parent.contents[name] = node;
      parent.atime = parent.mtime = parent.ctime = node.atime;
    }
    return node;
  },
  getFileDataAsTypedArray(node) {
    return node.contents.subarray(0, node.usedBytes);
  },
  expandFileStorage(node, newCapacity) {
    var prevCapacity = node.contents.length;
    if (prevCapacity >= newCapacity) return;
    // No need to expand, the storage was already large enough.
    // Don't expand strictly to the given requested limit if it's only a very
    // small increase, but instead geometrically grow capacity.
    // For small filesizes (<1MB), perform size*2 geometric increase, but for
    // large sizes, do a much more conservative size*1.125 increase to avoid
    // overshooting the allocation cap by a very large margin.
    var CAPACITY_DOUBLING_MAX = 1024 * 1024;
    newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125)) >>> 0);
    if (prevCapacity) newCapacity = Math.max(newCapacity, 256);
    // At minimum allocate 256b for each file when expanding.
    var oldContents = MEMFS.getFileDataAsTypedArray(node);
    node.contents = new Uint8Array(newCapacity);
    // Allocate new storage.
    node.contents.set(oldContents);
  },
  resizeFileStorage(node, newSize) {
    if (node.usedBytes == newSize) return;
    var oldContents = node.contents;
    node.contents = new Uint8Array(newSize);
    // Allocate new storage.
    node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
    // Copy old data over to the new storage.
    node.usedBytes = newSize;
  },
  node_ops: {
    getattr(node) {
      var attr = {};
      // device numbers reuse inode numbers.
      attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
      attr.ino = node.id;
      attr.mode = node.mode;
      attr.nlink = 1;
      attr.uid = 0;
      attr.gid = 0;
      attr.rdev = node.rdev;
      if (FS.isDir(node.mode)) {
        attr.size = 4096;
      } else if (FS.isFile(node.mode)) {
        attr.size = node.usedBytes;
      } else if (FS.isLink(node.mode)) {
        attr.size = node.link.length;
      } else {
        attr.size = 0;
      }
      attr.atime = new Date(node.atime);
      attr.mtime = new Date(node.mtime);
      attr.ctime = new Date(node.ctime);
      // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
      //       but this is not required by the standard.
      attr.blksize = 4096;
      attr.blocks = Math.ceil(attr.size / attr.blksize);
      return attr;
    },
    setattr(node, attr) {
      for (const key of [ "mode", "atime", "mtime", "ctime" ]) {
        if (attr[key] != null) {
          node[key] = attr[key];
        }
      }
      if (attr.size !== undefined) {
        MEMFS.resizeFileStorage(node, attr.size);
      }
    },
    lookup(parent, name) {
      // This error may happen quite a bit. To avoid overhead we reuse it (and
      // suffer a lack of stack info).
      if (!MEMFS.doesNotExistError) {
        MEMFS.doesNotExistError = new FS.ErrnoError(44);
        /** @suppress {checkTypes} */ MEMFS.doesNotExistError.stack = "<generic error, no stack>";
      }
      throw MEMFS.doesNotExistError;
    },
    mknod(parent, name, mode, dev) {
      return MEMFS.createNode(parent, name, mode, dev);
    },
    rename(old_node, new_dir, new_name) {
      var new_node;
      try {
        new_node = FS.lookupNode(new_dir, new_name);
      } catch (e) {}
      if (new_node) {
        if (FS.isDir(old_node.mode)) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          for (var i in new_node.contents) {
            throw new FS.ErrnoError(55);
          }
        }
        FS.hashRemoveNode(new_node);
      }
      // do the internal rewiring
      delete old_node.parent.contents[old_node.name];
      new_dir.contents[new_name] = old_node;
      old_node.name = new_name;
      new_dir.ctime = new_dir.mtime = old_node.parent.ctime = old_node.parent.mtime = Date.now();
    },
    unlink(parent, name) {
      delete parent.contents[name];
      parent.ctime = parent.mtime = Date.now();
    },
    rmdir(parent, name) {
      var node = FS.lookupNode(parent, name);
      for (var i in node.contents) {
        throw new FS.ErrnoError(55);
      }
      delete parent.contents[name];
      parent.ctime = parent.mtime = Date.now();
    },
    readdir(node) {
      return [ ".", "..", ...Object.keys(node.contents) ];
    },
    symlink(parent, newname, oldpath) {
      var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
      node.link = oldpath;
      return node;
    },
    readlink(node) {
      if (!FS.isLink(node.mode)) {
        throw new FS.ErrnoError(28);
      }
      return node.link;
    }
  },
  stream_ops: {
    read(stream, buffer, offset, length, position) {
      var contents = stream.node.contents;
      if (position >= stream.node.usedBytes) return 0;
      var size = Math.min(stream.node.usedBytes - position, length);
      buffer.set(contents.subarray(position, position + size), offset);
      return size;
    },
    write(stream, buffer, offset, length, position, canOwn) {
      // If the buffer is located in main memory (HEAP), and if
      // memory can grow, we can't hold on to references of the
      // memory buffer, as they may get invalidated. That means we
      // need to copy its contents.
      if (buffer.buffer === (growMemViews(), HEAP8).buffer) {
        canOwn = false;
      }
      if (!length) return 0;
      var node = stream.node;
      node.mtime = node.ctime = Date.now();
      if (canOwn) {
        node.contents = buffer.subarray(offset, offset + length);
        node.usedBytes = length;
      } else if (node.usedBytes === 0 && position === 0) {
        // If this is a simple first write to an empty file, do a fast set since we don't need to care about old data.
        node.contents = buffer.slice(offset, offset + length);
        node.usedBytes = length;
      } else {
        MEMFS.expandFileStorage(node, position + length);
        // Use typed array write which is available.
        node.contents.set(buffer.subarray(offset, offset + length), position);
        node.usedBytes = Math.max(node.usedBytes, position + length);
      }
      return length;
    },
    llseek(stream, offset, whence) {
      var position = offset;
      if (whence === 1) {
        position += stream.position;
      } else if (whence === 2) {
        if (FS.isFile(stream.node.mode)) {
          position += stream.node.usedBytes;
        }
      }
      if (position < 0) {
        throw new FS.ErrnoError(28);
      }
      return position;
    },
    mmap(stream, length, position, prot, flags) {
      if (!FS.isFile(stream.node.mode)) {
        throw new FS.ErrnoError(43);
      }
      var ptr;
      var allocated;
      var contents = stream.node.contents;
      // Only make a new copy when MAP_PRIVATE is specified.
      if (!(flags & 2) && contents.buffer === (growMemViews(), HEAP8).buffer) {
        // We can't emulate MAP_SHARED when the file is not backed by the
        // buffer we're mapping to (e.g. the HEAP buffer).
        allocated = false;
        ptr = contents.byteOffset;
      } else {
        allocated = true;
        ptr = mmapAlloc(length);
        if (!ptr) {
          throw new FS.ErrnoError(48);
        }
        if (contents) {
          // Try to avoid unnecessary slices.
          if (position > 0 || position + length < contents.length) {
            if (contents.subarray) {
              contents = contents.subarray(position, position + length);
            } else {
              contents = Array.prototype.slice.call(contents, position, position + length);
            }
          }
          (growMemViews(), HEAP8).set(contents, ptr);
        }
      }
      return {
        ptr,
        allocated
      };
    },
    msync(stream, buffer, offset, length, mmapFlags) {
      MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
      // should we check if bytesWritten and length are the same?
      return 0;
    }
  }
};

var FS_modeStringToFlags = str => {
  if (typeof str != "string") return str;
  var flagModes = {
    "r": 0,
    "r+": 2,
    "w": 512 | 64 | 1,
    "w+": 512 | 64 | 2,
    "a": 1024 | 64 | 1,
    "a+": 1024 | 64 | 2
  };
  var flags = flagModes[str];
  if (typeof flags == "undefined") {
    throw new Error(`Unknown file open mode: ${str}`);
  }
  return flags;
};

var FS_fileDataToTypedArray = data => {
  if (typeof data == "string") {
    data = intArrayFromString(data, true);
  }
  if (!data.subarray) {
    data = new Uint8Array(data);
  }
  return data;
};

var FS_getMode = (canRead, canWrite) => {
  var mode = 0;
  if (canRead) mode |= 292 | 73;
  if (canWrite) mode |= 146;
  return mode;
};

var asyncLoad = async url => {
  var arrayBuffer = await readAsync(url);
  return new Uint8Array(arrayBuffer);
};

var FS_createDataFile = (...args) => FS.createDataFile(...args);

var getUniqueRunDependency = id => id;

var preloadPlugins = [];

var FS_handledByPreloadPlugin = async (byteArray, fullname) => {
  // Ensure plugins are ready.
  if (typeof Browser != "undefined") Browser.init();
  for (var plugin of preloadPlugins) {
    if (plugin["canHandle"](fullname)) {
      return plugin["handle"](byteArray, fullname);
    }
  }
  // If no plugin handled this file then return the original/unmodified
  // byteArray.
  return byteArray;
};

var FS_preloadFile = async (parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish) => {
  // TODO we should allow people to just pass in a complete filename instead
  // of parent and name being that we just join them anyways
  var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
  var dep = getUniqueRunDependency(`cp ${fullname}`);
  // might have several active requests for the same fullname
  addRunDependency(dep);
  try {
    var byteArray = url;
    if (typeof url == "string") {
      byteArray = await asyncLoad(url);
    }
    byteArray = await FS_handledByPreloadPlugin(byteArray, fullname);
    preFinish?.();
    if (!dontCreateFile) {
      FS_createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
    }
  } finally {
    removeRunDependency(dep);
  }
};

var FS_createPreloadedFile = (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
  FS_preloadFile(parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish).then(onload).catch(onerror);
};

var FS = {
  root: null,
  mounts: [],
  devices: {},
  streams: [],
  nextInode: 1,
  nameTable: null,
  currentPath: "/",
  initialized: false,
  ignorePermissions: true,
  filesystems: null,
  syncFSRequests: 0,
  ErrnoError: class {
    name="ErrnoError";
    // We set the `name` property to be able to identify `FS.ErrnoError`
    // - the `name` is a standard ECMA-262 property of error objects. Kind of good to have it anyway.
    // - when using PROXYFS, an error can come from an underlying FS
    // as different FS objects have their own FS.ErrnoError each,
    // the test `err instanceof FS.ErrnoError` won't detect an error coming from another filesystem, causing bugs.
    // we'll use the reliable test `err.name == "ErrnoError"` instead
    constructor(errno) {
      this.errno = errno;
    }
  },
  FSStream: class {
    shared={};
    get object() {
      return this.node;
    }
    set object(val) {
      this.node = val;
    }
    get isRead() {
      return (this.flags & 2097155) !== 1;
    }
    get isWrite() {
      return (this.flags & 2097155) !== 0;
    }
    get isAppend() {
      return (this.flags & 1024);
    }
    get flags() {
      return this.shared.flags;
    }
    set flags(val) {
      this.shared.flags = val;
    }
    get position() {
      return this.shared.position;
    }
    set position(val) {
      this.shared.position = val;
    }
  },
  FSNode: class {
    node_ops={};
    stream_ops={};
    readMode=292 | 73;
    writeMode=146;
    mounted=null;
    constructor(parent, name, mode, rdev) {
      if (!parent) {
        parent = this;
      }
      this.parent = parent;
      this.mount = parent.mount;
      this.id = FS.nextInode++;
      this.name = name;
      this.mode = mode;
      this.rdev = rdev;
      this.atime = this.mtime = this.ctime = Date.now();
    }
    get read() {
      return (this.mode & this.readMode) === this.readMode;
    }
    set read(val) {
      val ? this.mode |= this.readMode : this.mode &= ~this.readMode;
    }
    get write() {
      return (this.mode & this.writeMode) === this.writeMode;
    }
    set write(val) {
      val ? this.mode |= this.writeMode : this.mode &= ~this.writeMode;
    }
    get isFolder() {
      return FS.isDir(this.mode);
    }
    get isDevice() {
      return FS.isChrdev(this.mode);
    }
  },
  lookupPath(path, opts = {}) {
    if (!path) {
      throw new FS.ErrnoError(44);
    }
    opts.follow_mount ??= true;
    if (!PATH.isAbs(path)) {
      path = FS.cwd() + "/" + path;
    }
    // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
    linkloop: for (var nlinks = 0; nlinks < 40; nlinks++) {
      // split the absolute path
      var parts = path.split("/").filter(p => !!p);
      // start at the root
      var current = FS.root;
      var current_path = "/";
      for (var i = 0; i < parts.length; i++) {
        var islast = (i === parts.length - 1);
        if (islast && opts.parent) {
          // stop resolving
          break;
        }
        if (parts[i] === ".") {
          continue;
        }
        if (parts[i] === "..") {
          current_path = PATH.dirname(current_path);
          if (FS.isRoot(current)) {
            path = current_path + "/" + parts.slice(i + 1).join("/");
            // We're making progress here, don't let many consecutive ..'s
            // lead to ELOOP
            nlinks--;
            continue linkloop;
          } else {
            current = current.parent;
          }
          continue;
        }
        current_path = PATH.join2(current_path, parts[i]);
        try {
          current = FS.lookupNode(current, parts[i]);
        } catch (e) {
          // if noent_okay is true, suppress a ENOENT in the last component
          // and return an object with an undefined node. This is needed for
          // resolving symlinks in the path when creating a file.
          if ((e?.errno === 44) && islast && opts.noent_okay) {
            return {
              path: current_path
            };
          }
          throw e;
        }
        // jump to the mount's root node if this is a mountpoint
        if (FS.isMountpoint(current) && (!islast || opts.follow_mount)) {
          current = current.mounted.root;
        }
        // by default, lookupPath will not follow a symlink if it is the final path component.
        // setting opts.follow = true will override this behavior.
        if (FS.isLink(current.mode) && (!islast || opts.follow)) {
          if (!current.node_ops.readlink) {
            throw new FS.ErrnoError(52);
          }
          var link = current.node_ops.readlink(current);
          if (!PATH.isAbs(link)) {
            link = PATH.dirname(current_path) + "/" + link;
          }
          path = link + "/" + parts.slice(i + 1).join("/");
          continue linkloop;
        }
      }
      return {
        path: current_path,
        node: current
      };
    }
    throw new FS.ErrnoError(32);
  },
  getPath(node) {
    var path;
    while (true) {
      if (FS.isRoot(node)) {
        var mount = node.mount.mountpoint;
        if (!path) return mount;
        return mount[mount.length - 1] !== "/" ? `${mount}/${path}` : mount + path;
      }
      path = path ? `${node.name}/${path}` : node.name;
      node = node.parent;
    }
  },
  hashName(parentid, name) {
    var hash = 0;
    for (var i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
    }
    return ((parentid + hash) >>> 0) % FS.nameTable.length;
  },
  hashAddNode(node) {
    var hash = FS.hashName(node.parent.id, node.name);
    node.name_next = FS.nameTable[hash];
    FS.nameTable[hash] = node;
  },
  hashRemoveNode(node) {
    var hash = FS.hashName(node.parent.id, node.name);
    if (FS.nameTable[hash] === node) {
      FS.nameTable[hash] = node.name_next;
    } else {
      var current = FS.nameTable[hash];
      while (current) {
        if (current.name_next === node) {
          current.name_next = node.name_next;
          break;
        }
        current = current.name_next;
      }
    }
  },
  lookupNode(parent, name) {
    var errCode = FS.mayLookup(parent);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    var hash = FS.hashName(parent.id, name);
    for (var node = FS.nameTable[hash]; node; node = node.name_next) {
      var nodeName = node.name;
      if (node.parent.id === parent.id && nodeName === name) {
        return node;
      }
    }
    // if we failed to find it in the cache, call into the VFS
    return FS.lookup(parent, name);
  },
  createNode(parent, name, mode, rdev) {
    var node = new FS.FSNode(parent, name, mode, rdev);
    FS.hashAddNode(node);
    return node;
  },
  destroyNode(node) {
    FS.hashRemoveNode(node);
  },
  isRoot(node) {
    return node === node.parent;
  },
  isMountpoint(node) {
    return !!node.mounted;
  },
  isFile(mode) {
    return (mode & 61440) === 32768;
  },
  isDir(mode) {
    return (mode & 61440) === 16384;
  },
  isLink(mode) {
    return (mode & 61440) === 40960;
  },
  isChrdev(mode) {
    return (mode & 61440) === 8192;
  },
  isBlkdev(mode) {
    return (mode & 61440) === 24576;
  },
  isFIFO(mode) {
    return (mode & 61440) === 4096;
  },
  isSocket(mode) {
    return (mode & 49152) === 49152;
  },
  flagsToPermissionString(flag) {
    var perms = [ "r", "w", "rw" ][flag & 3];
    if ((flag & 512)) {
      perms += "w";
    }
    return perms;
  },
  nodePermissions(node, perms) {
    if (FS.ignorePermissions) {
      return 0;
    }
    // return 0 if any user, group or owner bits are set.
    if (perms.includes("r") && !(node.mode & 292)) {
      return 2;
    }
    if (perms.includes("w") && !(node.mode & 146)) {
      return 2;
    }
    if (perms.includes("x") && !(node.mode & 73)) {
      return 2;
    }
    return 0;
  },
  mayLookup(dir) {
    if (!FS.isDir(dir.mode)) return 54;
    var errCode = FS.nodePermissions(dir, "x");
    if (errCode) return errCode;
    if (!dir.node_ops.lookup) return 2;
    return 0;
  },
  mayCreate(dir, name) {
    if (!FS.isDir(dir.mode)) {
      return 54;
    }
    try {
      var node = FS.lookupNode(dir, name);
      return 20;
    } catch (e) {}
    return FS.nodePermissions(dir, "wx");
  },
  mayDelete(dir, name, isdir) {
    var node;
    try {
      node = FS.lookupNode(dir, name);
    } catch (e) {
      return e.errno;
    }
    var errCode = FS.nodePermissions(dir, "wx");
    if (errCode) {
      return errCode;
    }
    if (isdir) {
      if (!FS.isDir(node.mode)) {
        return 54;
      }
      if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
        return 10;
      }
    } else if (FS.isDir(node.mode)) {
      return 31;
    }
    return 0;
  },
  mayOpen(node, flags) {
    if (!node) {
      return 44;
    }
    if (FS.isLink(node.mode)) {
      return 32;
    }
    var mode = FS.flagsToPermissionString(flags);
    if (FS.isDir(node.mode)) {
      // opening for write
      // TODO: check for O_SEARCH? (== search for dir only)
      if (mode !== "r" || (flags & (512 | 64))) {
        return 31;
      }
    }
    return FS.nodePermissions(node, mode);
  },
  checkOpExists(op, err) {
    if (!op) {
      throw new FS.ErrnoError(err);
    }
    return op;
  },
  MAX_OPEN_FDS: 4096,
  nextfd() {
    for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
      if (!FS.streams[fd]) {
        return fd;
      }
    }
    throw new FS.ErrnoError(33);
  },
  getStreamChecked(fd) {
    var stream = FS.getStream(fd);
    if (!stream) {
      throw new FS.ErrnoError(8);
    }
    return stream;
  },
  getStream: fd => FS.streams[fd],
  createStream(stream, fd = -1) {
    // clone it, so we can return an instance of FSStream
    stream = Object.assign(new FS.FSStream, stream);
    if (fd == -1) {
      fd = FS.nextfd();
    }
    stream.fd = fd;
    FS.streams[fd] = stream;
    return stream;
  },
  closeStream(fd) {
    FS.streams[fd] = null;
  },
  dupStream(origStream, fd = -1) {
    var stream = FS.createStream(origStream, fd);
    stream.stream_ops?.dup?.(stream);
    return stream;
  },
  doSetAttr(stream, node, attr) {
    var setattr = stream?.stream_ops.setattr;
    var arg = setattr ? stream : node;
    setattr ??= node.node_ops.setattr;
    FS.checkOpExists(setattr, 63);
    setattr(arg, attr);
  },
  chrdev_stream_ops: {
    open(stream) {
      var device = FS.getDevice(stream.node.rdev);
      // override node's stream ops with the device's
      stream.stream_ops = device.stream_ops;
      // forward the open call
      stream.stream_ops.open?.(stream);
    },
    llseek() {
      throw new FS.ErrnoError(70);
    }
  },
  major: dev => ((dev) >> 8),
  minor: dev => ((dev) & 255),
  makedev: (ma, mi) => ((ma) << 8 | (mi)),
  registerDevice(dev, ops) {
    FS.devices[dev] = {
      stream_ops: ops
    };
  },
  getDevice: dev => FS.devices[dev],
  getMounts(mount) {
    var mounts = [];
    var check = [ mount ];
    while (check.length) {
      var m = check.pop();
      mounts.push(m);
      check.push(...m.mounts);
    }
    return mounts;
  },
  syncfs(populate, callback) {
    if (typeof populate == "function") {
      callback = populate;
      populate = false;
    }
    FS.syncFSRequests++;
    if (FS.syncFSRequests > 1) {
      err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
    }
    var mounts = FS.getMounts(FS.root.mount);
    var completed = 0;
    function doCallback(errCode) {
      FS.syncFSRequests--;
      return callback(errCode);
    }
    function done(errCode) {
      if (errCode) {
        if (!done.errored) {
          done.errored = true;
          return doCallback(errCode);
        }
        return;
      }
      if (++completed >= mounts.length) {
        doCallback(null);
      }
    }
    // sync all mounts
    for (var mount of mounts) {
      if (mount.type.syncfs) {
        mount.type.syncfs(mount, populate, done);
      } else {
        done(null);
      }
    }
  },
  mount(type, opts, mountpoint) {
    var root = mountpoint === "/";
    var pseudo = !mountpoint;
    var node;
    if (root && FS.root) {
      throw new FS.ErrnoError(10);
    } else if (!root && !pseudo) {
      var lookup = FS.lookupPath(mountpoint, {
        follow_mount: false
      });
      mountpoint = lookup.path;
      // use the absolute path
      node = lookup.node;
      if (FS.isMountpoint(node)) {
        throw new FS.ErrnoError(10);
      }
      if (!FS.isDir(node.mode)) {
        throw new FS.ErrnoError(54);
      }
    }
    var mount = {
      type,
      opts,
      mountpoint,
      mounts: []
    };
    // create a root node for the fs
    var mountRoot = type.mount(mount);
    mountRoot.mount = mount;
    mount.root = mountRoot;
    if (root) {
      FS.root = mountRoot;
    } else if (node) {
      // set as a mountpoint
      node.mounted = mount;
      // add the new mount to the current mount's children
      if (node.mount) {
        node.mount.mounts.push(mount);
      }
    }
    return mountRoot;
  },
  unmount(mountpoint) {
    var lookup = FS.lookupPath(mountpoint, {
      follow_mount: false
    });
    if (!FS.isMountpoint(lookup.node)) {
      throw new FS.ErrnoError(28);
    }
    // destroy the nodes for this mount, and all its child mounts
    var node = lookup.node;
    var mount = node.mounted;
    var mounts = FS.getMounts(mount);
    for (var [hash, current] of Object.entries(FS.nameTable)) {
      while (current) {
        var next = current.name_next;
        if (mounts.includes(current.mount)) {
          FS.destroyNode(current);
        }
        current = next;
      }
    }
    // no longer a mountpoint
    node.mounted = null;
    // remove this mount from the child mounts
    var idx = node.mount.mounts.indexOf(mount);
    node.mount.mounts.splice(idx, 1);
  },
  lookup(parent, name) {
    return parent.node_ops.lookup(parent, name);
  },
  mknod(path, mode, dev) {
    var lookup = FS.lookupPath(path, {
      parent: true
    });
    var parent = lookup.node;
    var name = PATH.basename(path);
    if (!name) {
      throw new FS.ErrnoError(28);
    }
    if (name === "." || name === "..") {
      throw new FS.ErrnoError(20);
    }
    var errCode = FS.mayCreate(parent, name);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.mknod) {
      throw new FS.ErrnoError(63);
    }
    return parent.node_ops.mknod(parent, name, mode, dev);
  },
  statfs(path) {
    return FS.statfsNode(FS.lookupPath(path, {
      follow: true
    }).node);
  },
  statfsStream(stream) {
    // We keep a separate statfsStream function because noderawfs overrides
    // it. In noderawfs, stream.node is sometimes null. Instead, we need to
    // look at stream.path.
    return FS.statfsNode(stream.node);
  },
  statfsNode(node) {
    // NOTE: None of the defaults here are true. We're just returning safe and
    //       sane values. Currently nodefs and rawfs replace these defaults,
    //       other file systems leave them alone.
    var rtn = {
      bsize: 4096,
      frsize: 4096,
      blocks: 1e6,
      bfree: 5e5,
      bavail: 5e5,
      files: FS.nextInode,
      ffree: FS.nextInode - 1,
      fsid: 42,
      flags: 2,
      namelen: 255
    };
    if (node.node_ops.statfs) {
      Object.assign(rtn, node.node_ops.statfs(node.mount.opts.root));
    }
    return rtn;
  },
  create(path, mode = 438) {
    mode &= 4095;
    mode |= 32768;
    return FS.mknod(path, mode, 0);
  },
  mkdir(path, mode = 511) {
    mode &= 511 | 512;
    mode |= 16384;
    return FS.mknod(path, mode, 0);
  },
  mkdirTree(path, mode) {
    var dirs = path.split("/");
    var d = "";
    for (var dir of dirs) {
      if (!dir) continue;
      if (d || PATH.isAbs(path)) d += "/";
      d += dir;
      try {
        FS.mkdir(d, mode);
      } catch (e) {
        if (e.errno != 20) throw e;
      }
    }
  },
  mkdev(path, mode, dev) {
    if (typeof dev == "undefined") {
      dev = mode;
      mode = 438;
    }
    mode |= 8192;
    return FS.mknod(path, mode, dev);
  },
  symlink(oldpath, newpath) {
    if (!PATH_FS.resolve(oldpath)) {
      throw new FS.ErrnoError(44);
    }
    var lookup = FS.lookupPath(newpath, {
      parent: true
    });
    var parent = lookup.node;
    if (!parent) {
      throw new FS.ErrnoError(44);
    }
    var newname = PATH.basename(newpath);
    var errCode = FS.mayCreate(parent, newname);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.symlink) {
      throw new FS.ErrnoError(63);
    }
    return parent.node_ops.symlink(parent, newname, oldpath);
  },
  rename(old_path, new_path) {
    var old_dirname = PATH.dirname(old_path);
    var new_dirname = PATH.dirname(new_path);
    var old_name = PATH.basename(old_path);
    var new_name = PATH.basename(new_path);
    // parents must exist
    var lookup, old_dir, new_dir;
    // let the errors from non existent directories percolate up
    lookup = FS.lookupPath(old_path, {
      parent: true
    });
    old_dir = lookup.node;
    lookup = FS.lookupPath(new_path, {
      parent: true
    });
    new_dir = lookup.node;
    if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
    // need to be part of the same mount
    if (old_dir.mount !== new_dir.mount) {
      throw new FS.ErrnoError(75);
    }
    // source must exist
    var old_node = FS.lookupNode(old_dir, old_name);
    // old path should not be an ancestor of the new path
    var relative = PATH_FS.relative(old_path, new_dirname);
    if (relative.charAt(0) !== ".") {
      throw new FS.ErrnoError(28);
    }
    // new path should not be an ancestor of the old path
    relative = PATH_FS.relative(new_path, old_dirname);
    if (relative.charAt(0) !== ".") {
      throw new FS.ErrnoError(55);
    }
    // see if the new path already exists
    var new_node;
    try {
      new_node = FS.lookupNode(new_dir, new_name);
    } catch (e) {}
    // early out if nothing needs to change
    if (old_node === new_node) {
      return;
    }
    // we'll need to delete the old entry
    var isdir = FS.isDir(old_node.mode);
    var errCode = FS.mayDelete(old_dir, old_name, isdir);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    // need delete permissions if we'll be overwriting.
    // need create permissions if new doesn't already exist.
    errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!old_dir.node_ops.rename) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
      throw new FS.ErrnoError(10);
    }
    // if we are going to change the parent, check write permissions
    if (new_dir !== old_dir) {
      errCode = FS.nodePermissions(old_dir, "w");
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
    }
    // remove the node from the lookup hash
    FS.hashRemoveNode(old_node);
    // do the underlying fs rename
    try {
      old_dir.node_ops.rename(old_node, new_dir, new_name);
      // update old node (we do this here to avoid each backend
      // needing to)
      old_node.parent = new_dir;
    } catch (e) {
      throw e;
    } finally {
      // add the node back to the hash (in case node_ops.rename
      // changed its name)
      FS.hashAddNode(old_node);
    }
  },
  rmdir(path) {
    var lookup = FS.lookupPath(path, {
      parent: true
    });
    var parent = lookup.node;
    var name = PATH.basename(path);
    var node = FS.lookupNode(parent, name);
    var errCode = FS.mayDelete(parent, name, true);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.rmdir) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(node)) {
      throw new FS.ErrnoError(10);
    }
    parent.node_ops.rmdir(parent, name);
    FS.destroyNode(node);
  },
  readdir(path) {
    var lookup = FS.lookupPath(path, {
      follow: true
    });
    var node = lookup.node;
    var readdir = FS.checkOpExists(node.node_ops.readdir, 54);
    return readdir(node);
  },
  unlink(path) {
    var lookup = FS.lookupPath(path, {
      parent: true
    });
    var parent = lookup.node;
    if (!parent) {
      throw new FS.ErrnoError(44);
    }
    var name = PATH.basename(path);
    var node = FS.lookupNode(parent, name);
    var errCode = FS.mayDelete(parent, name, false);
    if (errCode) {
      // According to POSIX, we should map EISDIR to EPERM, but
      // we instead do what Linux does (and we must, as we use
      // the musl linux libc).
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.unlink) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(node)) {
      throw new FS.ErrnoError(10);
    }
    parent.node_ops.unlink(parent, name);
    FS.destroyNode(node);
  },
  readlink(path) {
    var lookup = FS.lookupPath(path);
    var link = lookup.node;
    if (!link) {
      throw new FS.ErrnoError(44);
    }
    if (!link.node_ops.readlink) {
      throw new FS.ErrnoError(28);
    }
    return link.node_ops.readlink(link);
  },
  stat(path, dontFollow) {
    var lookup = FS.lookupPath(path, {
      follow: !dontFollow
    });
    var node = lookup.node;
    var getattr = FS.checkOpExists(node.node_ops.getattr, 63);
    return getattr(node);
  },
  fstat(fd) {
    var stream = FS.getStreamChecked(fd);
    var node = stream.node;
    var getattr = stream.stream_ops.getattr;
    var arg = getattr ? stream : node;
    getattr ??= node.node_ops.getattr;
    FS.checkOpExists(getattr, 63);
    return getattr(arg);
  },
  lstat(path) {
    return FS.stat(path, true);
  },
  doChmod(stream, node, mode, dontFollow) {
    FS.doSetAttr(stream, node, {
      mode: (mode & 4095) | (node.mode & ~4095),
      ctime: Date.now(),
      dontFollow
    });
  },
  chmod(path, mode, dontFollow) {
    var node;
    if (typeof path == "string") {
      var lookup = FS.lookupPath(path, {
        follow: !dontFollow
      });
      node = lookup.node;
    } else {
      node = path;
    }
    FS.doChmod(null, node, mode, dontFollow);
  },
  lchmod(path, mode) {
    FS.chmod(path, mode, true);
  },
  fchmod(fd, mode) {
    var stream = FS.getStreamChecked(fd);
    FS.doChmod(stream, stream.node, mode, false);
  },
  doChown(stream, node, dontFollow) {
    FS.doSetAttr(stream, node, {
      timestamp: Date.now(),
      dontFollow
    });
  },
  chown(path, uid, gid, dontFollow) {
    var node;
    if (typeof path == "string") {
      var lookup = FS.lookupPath(path, {
        follow: !dontFollow
      });
      node = lookup.node;
    } else {
      node = path;
    }
    FS.doChown(null, node, dontFollow);
  },
  lchown(path, uid, gid) {
    FS.chown(path, uid, gid, true);
  },
  fchown(fd, uid, gid) {
    var stream = FS.getStreamChecked(fd);
    FS.doChown(stream, stream.node, false);
  },
  doTruncate(stream, node, len) {
    if (FS.isDir(node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!FS.isFile(node.mode)) {
      throw new FS.ErrnoError(28);
    }
    var errCode = FS.nodePermissions(node, "w");
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    FS.doSetAttr(stream, node, {
      size: len,
      timestamp: Date.now()
    });
  },
  truncate(path, len) {
    if (len < 0) {
      throw new FS.ErrnoError(28);
    }
    var node;
    if (typeof path == "string") {
      var lookup = FS.lookupPath(path, {
        follow: true
      });
      node = lookup.node;
    } else {
      node = path;
    }
    FS.doTruncate(null, node, len);
  },
  ftruncate(fd, len) {
    var stream = FS.getStreamChecked(fd);
    if (len < 0 || (stream.flags & 2097155) === 0) {
      throw new FS.ErrnoError(28);
    }
    FS.doTruncate(stream, stream.node, len);
  },
  utime(path, atime, mtime) {
    var lookup = FS.lookupPath(path, {
      follow: true
    });
    var node = lookup.node;
    var setattr = FS.checkOpExists(node.node_ops.setattr, 63);
    setattr(node, {
      atime,
      mtime
    });
  },
  open(path, flags, mode = 438) {
    if (path === "") {
      throw new FS.ErrnoError(44);
    }
    flags = FS_modeStringToFlags(flags);
    if ((flags & 64)) {
      mode = (mode & 4095) | 32768;
    } else {
      mode = 0;
    }
    var node;
    var isDirPath;
    if (typeof path == "object") {
      node = path;
    } else {
      isDirPath = path.endsWith("/");
      // noent_okay makes it so that if the final component of the path
      // doesn't exist, lookupPath returns `node: undefined`. `path` will be
      // updated to point to the target of all symlinks.
      var lookup = FS.lookupPath(path, {
        follow: !(flags & 131072),
        noent_okay: true
      });
      node = lookup.node;
      path = lookup.path;
    }
    // perhaps we need to create the node
    var created = false;
    if ((flags & 64)) {
      if (node) {
        // if O_CREAT and O_EXCL are set, error out if the node already exists
        if ((flags & 128)) {
          throw new FS.ErrnoError(20);
        }
      } else if (isDirPath) {
        throw new FS.ErrnoError(31);
      } else {
        // node doesn't exist, try to create it
        // Ignore the permission bits here to ensure we can `open` this new
        // file below. We use chmod below to apply the permissions once the
        // file is open.
        node = FS.mknod(path, mode | 511, 0);
        created = true;
      }
    }
    if (!node) {
      throw new FS.ErrnoError(44);
    }
    // can't truncate a device
    if (FS.isChrdev(node.mode)) {
      flags &= ~512;
    }
    // if asked only for a directory, then this must be one
    if ((flags & 65536) && !FS.isDir(node.mode)) {
      throw new FS.ErrnoError(54);
    }
    // check permissions, if this is not a file we just created now (it is ok to
    // create and write to a file with read-only permissions; it is read-only
    // for later use)
    if (!created) {
      var errCode = FS.mayOpen(node, flags);
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
    }
    // do truncation if necessary
    if ((flags & 512) && !created) {
      FS.truncate(node, 0);
    }
    // we've already handled these, don't pass down to the underlying vfs
    flags &= ~(128 | 512 | 131072);
    // register the stream with the filesystem
    var stream = FS.createStream({
      node,
      path: FS.getPath(node),
      // we want the absolute path to the node
      flags,
      seekable: true,
      position: 0,
      stream_ops: node.stream_ops,
      // used by the file family libc calls (fopen, fwrite, ferror, etc.)
      ungotten: [],
      error: false
    });
    // call the new stream's open function
    if (stream.stream_ops.open) {
      stream.stream_ops.open(stream);
    }
    if (created) {
      FS.chmod(node, mode & 511);
    }
    return stream;
  },
  close(stream) {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if (stream.getdents) stream.getdents = null;
    // free readdir state
    try {
      if (stream.stream_ops.close) {
        stream.stream_ops.close(stream);
      }
    } catch (e) {
      throw e;
    } finally {
      FS.closeStream(stream.fd);
    }
    stream.fd = null;
  },
  isClosed(stream) {
    return stream.fd === null;
  },
  llseek(stream, offset, whence) {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if (!stream.seekable || !stream.stream_ops.llseek) {
      throw new FS.ErrnoError(70);
    }
    if (whence != 0 && whence != 1 && whence != 2) {
      throw new FS.ErrnoError(28);
    }
    stream.position = stream.stream_ops.llseek(stream, offset, whence);
    stream.ungotten = [];
    return stream.position;
  },
  read(stream, buffer, offset, length, position) {
    if (length < 0 || position < 0) {
      throw new FS.ErrnoError(28);
    }
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if ((stream.flags & 2097155) === 1) {
      throw new FS.ErrnoError(8);
    }
    if (FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!stream.stream_ops.read) {
      throw new FS.ErrnoError(28);
    }
    var seeking = typeof position != "undefined";
    if (!seeking) {
      position = stream.position;
    } else if (!stream.seekable) {
      throw new FS.ErrnoError(70);
    }
    var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
    if (!seeking) stream.position += bytesRead;
    return bytesRead;
  },
  write(stream, buffer, offset, length, position, canOwn) {
    if (length < 0 || position < 0) {
      throw new FS.ErrnoError(28);
    }
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if ((stream.flags & 2097155) === 0) {
      throw new FS.ErrnoError(8);
    }
    if (FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!stream.stream_ops.write) {
      throw new FS.ErrnoError(28);
    }
    if (stream.seekable && stream.flags & 1024) {
      // seek to the end before writing in append mode
      FS.llseek(stream, 0, 2);
    }
    var seeking = typeof position != "undefined";
    if (!seeking) {
      position = stream.position;
    } else if (!stream.seekable) {
      throw new FS.ErrnoError(70);
    }
    var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
    if (!seeking) stream.position += bytesWritten;
    return bytesWritten;
  },
  mmap(stream, length, position, prot, flags) {
    // User requests writing to file (prot & PROT_WRITE != 0).
    // Checking if we have permissions to write to the file unless
    // MAP_PRIVATE flag is set. According to POSIX spec it is possible
    // to write to file opened in read-only mode with MAP_PRIVATE flag,
    // as all modifications will be visible only in the memory of
    // the current process.
    if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
      throw new FS.ErrnoError(2);
    }
    if ((stream.flags & 2097155) === 1) {
      throw new FS.ErrnoError(2);
    }
    if (!stream.stream_ops.mmap) {
      throw new FS.ErrnoError(43);
    }
    if (!length) {
      throw new FS.ErrnoError(28);
    }
    return stream.stream_ops.mmap(stream, length, position, prot, flags);
  },
  msync(stream, buffer, offset, length, mmapFlags) {
    if (!stream.stream_ops.msync) {
      return 0;
    }
    return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
  },
  ioctl(stream, cmd, arg) {
    if (!stream.stream_ops.ioctl) {
      throw new FS.ErrnoError(59);
    }
    return stream.stream_ops.ioctl(stream, cmd, arg);
  },
  readFile(path, opts = {}) {
    opts.flags = opts.flags || 0;
    opts.encoding = opts.encoding || "binary";
    if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
      abort(`Invalid encoding type "${opts.encoding}"`);
    }
    var stream = FS.open(path, opts.flags);
    var stat = FS.stat(path);
    var length = stat.size;
    var buf = new Uint8Array(length);
    FS.read(stream, buf, 0, length, 0);
    if (opts.encoding === "utf8") {
      buf = UTF8ArrayToString(buf);
    }
    FS.close(stream);
    return buf;
  },
  writeFile(path, data, opts = {}) {
    opts.flags = opts.flags || 577;
    var stream = FS.open(path, opts.flags, opts.mode);
    data = FS_fileDataToTypedArray(data);
    FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
    FS.close(stream);
  },
  cwd: () => FS.currentPath,
  chdir(path) {
    var lookup = FS.lookupPath(path, {
      follow: true
    });
    if (lookup.node === null) {
      throw new FS.ErrnoError(44);
    }
    if (!FS.isDir(lookup.node.mode)) {
      throw new FS.ErrnoError(54);
    }
    var errCode = FS.nodePermissions(lookup.node, "x");
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    FS.currentPath = lookup.path;
  },
  createDefaultDirectories() {
    FS.mkdir("/tmp");
    FS.mkdir("/home");
    FS.mkdir("/home/web_user");
  },
  createDefaultDevices() {
    // create /dev
    FS.mkdir("/dev");
    // setup /dev/null
    FS.registerDevice(FS.makedev(1, 3), {
      read: () => 0,
      write: (stream, buffer, offset, length, pos) => length,
      llseek: () => 0
    });
    FS.mkdev("/dev/null", FS.makedev(1, 3));
    // setup /dev/tty and /dev/tty1
    // stderr needs to print output using err() rather than out()
    // so we register a second tty just for it.
    TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
    TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
    FS.mkdev("/dev/tty", FS.makedev(5, 0));
    FS.mkdev("/dev/tty1", FS.makedev(6, 0));
    // setup /dev/[u]random
    // use a buffer to avoid overhead of individual crypto calls per byte
    var randomBuffer = new Uint8Array(1024), randomLeft = 0;
    var randomByte = () => {
      if (randomLeft === 0) {
        randomFill(randomBuffer);
        randomLeft = randomBuffer.byteLength;
      }
      return randomBuffer[--randomLeft];
    };
    FS.createDevice("/dev", "random", randomByte);
    FS.createDevice("/dev", "urandom", randomByte);
    // we're not going to emulate the actual shm device,
    // just create the tmp dirs that reside in it commonly
    FS.mkdir("/dev/shm");
    FS.mkdir("/dev/shm/tmp");
  },
  createSpecialDirectories() {
    // create /proc/self/fd which allows /proc/self/fd/6 => readlink gives the
    // name of the stream for fd 6 (see test_unistd_ttyname)
    FS.mkdir("/proc");
    var proc_self = FS.mkdir("/proc/self");
    FS.mkdir("/proc/self/fd");
    FS.mount({
      mount() {
        var node = FS.createNode(proc_self, "fd", 16895, 73);
        node.stream_ops = {
          llseek: MEMFS.stream_ops.llseek
        };
        node.node_ops = {
          lookup(parent, name) {
            var fd = +name;
            var stream = FS.getStreamChecked(fd);
            var ret = {
              parent: null,
              mount: {
                mountpoint: "fake"
              },
              node_ops: {
                readlink: () => stream.path
              },
              id: fd + 1
            };
            ret.parent = ret;
            // make it look like a simple root node
            return ret;
          },
          readdir() {
            return Array.from(FS.streams.entries()).filter(([k, v]) => v).map(([k, v]) => k.toString());
          }
        };
        return node;
      }
    }, {}, "/proc/self/fd");
  },
  createStandardStreams(input, output, error) {
    // TODO deprecate the old functionality of a single
    // input / output callback and that utilizes FS.createDevice
    // and instead require a unique set of stream ops
    // by default, we symlink the standard streams to the
    // default tty devices. however, if the standard streams
    // have been overwritten we create a unique device for
    // them instead.
    if (input) {
      FS.createDevice("/dev", "stdin", input);
    } else {
      FS.symlink("/dev/tty", "/dev/stdin");
    }
    if (output) {
      FS.createDevice("/dev", "stdout", null, output);
    } else {
      FS.symlink("/dev/tty", "/dev/stdout");
    }
    if (error) {
      FS.createDevice("/dev", "stderr", null, error);
    } else {
      FS.symlink("/dev/tty1", "/dev/stderr");
    }
    // open default streams for the stdin, stdout and stderr devices
    var stdin = FS.open("/dev/stdin", 0);
    var stdout = FS.open("/dev/stdout", 1);
    var stderr = FS.open("/dev/stderr", 1);
  },
  staticInit() {
    FS.nameTable = new Array(4096);
    FS.mount(MEMFS, {}, "/");
    FS.createDefaultDirectories();
    FS.createDefaultDevices();
    FS.createSpecialDirectories();
    FS.filesystems = {
      "MEMFS": MEMFS
    };
  },
  init(input, output, error) {
    FS.initialized = true;
    // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
    input ??= Module["stdin"];
    output ??= Module["stdout"];
    error ??= Module["stderr"];
    FS.createStandardStreams(input, output, error);
  },
  quit() {
    FS.initialized = false;
    // force-flush all streams, so we get musl std streams printed out
    // close all of our streams
    for (var stream of FS.streams) {
      if (stream) {
        FS.close(stream);
      }
    }
  },
  findObject(path, dontResolveLastLink) {
    var ret = FS.analyzePath(path, dontResolveLastLink);
    if (!ret.exists) {
      return null;
    }
    return ret.object;
  },
  analyzePath(path, dontResolveLastLink) {
    // operate from within the context of the symlink's target
    try {
      var lookup = FS.lookupPath(path, {
        follow: !dontResolveLastLink
      });
      path = lookup.path;
    } catch (e) {}
    var ret = {
      isRoot: false,
      exists: false,
      error: 0,
      name: null,
      path: null,
      object: null,
      parentExists: false,
      parentPath: null,
      parentObject: null
    };
    try {
      var lookup = FS.lookupPath(path, {
        parent: true
      });
      ret.parentExists = true;
      ret.parentPath = lookup.path;
      ret.parentObject = lookup.node;
      ret.name = PATH.basename(path);
      lookup = FS.lookupPath(path, {
        follow: !dontResolveLastLink
      });
      ret.exists = true;
      ret.path = lookup.path;
      ret.object = lookup.node;
      ret.name = lookup.node.name;
      ret.isRoot = lookup.path === "/";
    } catch (e) {
      ret.error = e.errno;
    }
    return ret;
  },
  createPath(parent, path, canRead, canWrite) {
    parent = typeof parent == "string" ? parent : FS.getPath(parent);
    var parts = path.split("/").reverse();
    while (parts.length) {
      var part = parts.pop();
      if (!part) continue;
      var current = PATH.join2(parent, part);
      try {
        FS.mkdir(current);
      } catch (e) {
        if (e.errno != 20) throw e;
      }
      parent = current;
    }
    return current;
  },
  createFile(parent, name, properties, canRead, canWrite) {
    var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
    var mode = FS_getMode(canRead, canWrite);
    return FS.create(path, mode);
  },
  createDataFile(parent, name, data, canRead, canWrite, canOwn) {
    var path = name;
    if (parent) {
      parent = typeof parent == "string" ? parent : FS.getPath(parent);
      path = name ? PATH.join2(parent, name) : parent;
    }
    var mode = FS_getMode(canRead, canWrite);
    var node = FS.create(path, mode);
    if (data) {
      data = FS_fileDataToTypedArray(data);
      // make sure we can write to the file
      FS.chmod(node, mode | 146);
      var stream = FS.open(node, 577);
      FS.write(stream, data, 0, data.length, 0, canOwn);
      FS.close(stream);
      FS.chmod(node, mode);
    }
  },
  createDevice(parent, name, input, output) {
    var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
    var mode = FS_getMode(!!input, !!output);
    FS.createDevice.major ??= 64;
    var dev = FS.makedev(FS.createDevice.major++, 0);
    // Create a fake device that a set of stream ops to emulate
    // the old behavior.
    FS.registerDevice(dev, {
      open(stream) {
        stream.seekable = false;
      },
      close(stream) {
        // flush any pending line data
        if (output?.buffer?.length) {
          output(10);
        }
      },
      read(stream, buffer, offset, length, pos) {
        var bytesRead = 0;
        for (var i = 0; i < length; i++) {
          var result;
          try {
            result = input();
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (result === undefined && bytesRead === 0) {
            throw new FS.ErrnoError(6);
          }
          if (result === null || result === undefined) break;
          bytesRead++;
          buffer[offset + i] = result;
        }
        if (bytesRead) {
          stream.node.atime = Date.now();
        }
        return bytesRead;
      },
      write(stream, buffer, offset, length, pos) {
        for (var i = 0; i < length; i++) {
          try {
            output(buffer[offset + i]);
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
        }
        if (length) {
          stream.node.mtime = stream.node.ctime = Date.now();
        }
        return i;
      }
    });
    return FS.mkdev(path, mode, dev);
  },
  forceLoadFile(obj) {
    if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
    if (globalThis.XMLHttpRequest) {
      abort("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
    } else {
      // Command-line.
      try {
        obj.contents = readBinary(obj.url);
      } catch (e) {
        throw new FS.ErrnoError(29);
      }
    }
  },
  createLazyFile(parent, name, url, canRead, canWrite) {
    // Lazy chunked Uint8Array (implements get and length from Uint8Array).
    // Actual getting is abstracted away for eventual reuse.
    class LazyUint8Array {
      lengthKnown=false;
      chunks=[];
      // Loaded chunks. Index is the chunk number
      get(idx) {
        if (idx > this.length - 1 || idx < 0) {
          return undefined;
        }
        var chunkOffset = idx % this.chunkSize;
        var chunkNum = (idx / this.chunkSize) | 0;
        return this.getter(chunkNum)[chunkOffset];
      }
      setDataGetter(getter) {
        this.getter = getter;
      }
      cacheLength() {
        // Find length
        var xhr = new XMLHttpRequest;
        xhr.open("HEAD", url, false);
        xhr.send(null);
        if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) abort("Couldn't load " + url + ". Status: " + xhr.status);
        var datalength = Number(xhr.getResponseHeader("Content-length"));
        var header;
        var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
        var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
        var chunkSize = 1024 * 1024;
        // Chunk size in bytes
        if (!hasByteServing) chunkSize = datalength;
        // Function to get a range from the remote URL.
        var doXHR = (from, to) => {
          if (from > to) abort("invalid range (" + from + ", " + to + ") or no bytes requested!");
          if (to > datalength - 1) abort("only " + datalength + " bytes available! programmer error!");
          // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
          var xhr = new XMLHttpRequest;
          xhr.open("GET", url, false);
          if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
          // Some hints to the browser that we want binary data.
          xhr.responseType = "arraybuffer";
          if (xhr.overrideMimeType) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
          }
          xhr.send(null);
          if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) abort("Couldn't load " + url + ". Status: " + xhr.status);
          if (xhr.response !== undefined) {
            return new Uint8Array(/** @type{Array<number>} */ (xhr.response || []));
          }
          return intArrayFromString(xhr.responseText || "", true);
        };
        var lazyArray = this;
        lazyArray.setDataGetter(chunkNum => {
          var start = chunkNum * chunkSize;
          var end = (chunkNum + 1) * chunkSize - 1;
          // including this byte
          end = Math.min(end, datalength - 1);
          // if datalength-1 is selected, this is the last block
          if (typeof lazyArray.chunks[chunkNum] == "undefined") {
            lazyArray.chunks[chunkNum] = doXHR(start, end);
          }
          if (typeof lazyArray.chunks[chunkNum] == "undefined") abort("doXHR failed!");
          return lazyArray.chunks[chunkNum];
        });
        if (usesGzip || !datalength) {
          // if the server uses gzip or doesn't supply the length, we have to download the whole file to get the (uncompressed) length
          chunkSize = datalength = 1;
          // this will force getter(0)/doXHR do download the whole file
          datalength = this.getter(0).length;
          chunkSize = datalength;
          out("LazyFiles on gzip forces download of the whole file when length is accessed");
        }
        this._length = datalength;
        this._chunkSize = chunkSize;
        this.lengthKnown = true;
      }
      get length() {
        if (!this.lengthKnown) {
          this.cacheLength();
        }
        return this._length;
      }
      get chunkSize() {
        if (!this.lengthKnown) {
          this.cacheLength();
        }
        return this._chunkSize;
      }
    }
    if (globalThis.XMLHttpRequest) {
      if (!ENVIRONMENT_IS_WORKER) abort("Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");
      var lazyArray = new LazyUint8Array;
      var properties = {
        isDevice: false,
        contents: lazyArray
      };
    } else {
      var properties = {
        isDevice: false,
        url
      };
    }
    var node = FS.createFile(parent, name, properties, canRead, canWrite);
    // This is a total hack, but I want to get this lazy file code out of the
    // core of MEMFS. If we want to keep this lazy file concept I feel it should
    // be its own thin LAZYFS proxying calls to MEMFS.
    if (properties.contents) {
      node.contents = properties.contents;
    } else if (properties.url) {
      node.contents = null;
      node.url = properties.url;
    }
    // Add a function that defers querying the file size until it is asked the first time.
    Object.defineProperties(node, {
      usedBytes: {
        get: function() {
          return this.contents.length;
        }
      }
    });
    // override each stream op with one that tries to force load the lazy file first
    var stream_ops = {};
    for (const [key, fn] of Object.entries(node.stream_ops)) {
      stream_ops[key] = (...args) => {
        FS.forceLoadFile(node);
        return fn(...args);
      };
    }
    function writeChunks(stream, buffer, offset, length, position) {
      var contents = stream.node.contents;
      if (position >= contents.length) return 0;
      var size = Math.min(contents.length - position, length);
      if (contents.slice) {
        // normal array
        for (var i = 0; i < size; i++) {
          buffer[offset + i] = contents[position + i];
        }
      } else {
        for (var i = 0; i < size; i++) {
          // LazyUint8Array from sync binary XHR
          buffer[offset + i] = contents.get(position + i);
        }
      }
      return size;
    }
    // use a custom read function
    stream_ops.read = (stream, buffer, offset, length, position) => {
      FS.forceLoadFile(node);
      return writeChunks(stream, buffer, offset, length, position);
    };
    // use a custom mmap function
    stream_ops.mmap = (stream, length, position, prot, flags) => {
      FS.forceLoadFile(node);
      var ptr = mmapAlloc(length);
      if (!ptr) {
        throw new FS.ErrnoError(48);
      }
      writeChunks(stream, (growMemViews(), HEAP8), ptr, length, position);
      return {
        ptr,
        allocated: true
      };
    };
    node.stream_ops = stream_ops;
    return node;
  }
};

var SYSCALLS = {
  calculateAt(dirfd, path, allowEmpty) {
    if (PATH.isAbs(path)) {
      return path;
    }
    // relative path
    var dir;
    if (dirfd === -100) {
      dir = FS.cwd();
    } else {
      var dirstream = SYSCALLS.getStreamFromFD(dirfd);
      dir = dirstream.path;
    }
    if (path.length == 0) {
      if (!allowEmpty) {
        throw new FS.ErrnoError(44);
      }
      return dir;
    }
    return dir + "/" + path;
  },
  writeStat(buf, stat) {
    (growMemViews(), HEAPU32)[((buf) >> 2)] = stat.dev;
    (growMemViews(), HEAPU32)[(((buf) + (4)) >> 2)] = stat.mode;
    (growMemViews(), HEAPU32)[(((buf) + (8)) >> 2)] = stat.nlink;
    (growMemViews(), HEAPU32)[(((buf) + (12)) >> 2)] = stat.uid;
    (growMemViews(), HEAPU32)[(((buf) + (16)) >> 2)] = stat.gid;
    (growMemViews(), HEAPU32)[(((buf) + (20)) >> 2)] = stat.rdev;
    (growMemViews(), HEAP64)[(((buf) + (24)) >> 3)] = BigInt(stat.size);
    (growMemViews(), HEAP32)[(((buf) + (32)) >> 2)] = 4096;
    (growMemViews(), HEAP32)[(((buf) + (36)) >> 2)] = stat.blocks;
    var atime = stat.atime.getTime();
    var mtime = stat.mtime.getTime();
    var ctime = stat.ctime.getTime();
    (growMemViews(), HEAP64)[(((buf) + (40)) >> 3)] = BigInt(Math.floor(atime / 1e3));
    (growMemViews(), HEAPU32)[(((buf) + (48)) >> 2)] = (atime % 1e3) * 1e3 * 1e3;
    (growMemViews(), HEAP64)[(((buf) + (56)) >> 3)] = BigInt(Math.floor(mtime / 1e3));
    (growMemViews(), HEAPU32)[(((buf) + (64)) >> 2)] = (mtime % 1e3) * 1e3 * 1e3;
    (growMemViews(), HEAP64)[(((buf) + (72)) >> 3)] = BigInt(Math.floor(ctime / 1e3));
    (growMemViews(), HEAPU32)[(((buf) + (80)) >> 2)] = (ctime % 1e3) * 1e3 * 1e3;
    (growMemViews(), HEAP64)[(((buf) + (88)) >> 3)] = BigInt(stat.ino);
    return 0;
  },
  writeStatFs(buf, stats) {
    (growMemViews(), HEAPU32)[(((buf) + (4)) >> 2)] = stats.bsize;
    (growMemViews(), HEAPU32)[(((buf) + (60)) >> 2)] = stats.bsize;
    (growMemViews(), HEAP64)[(((buf) + (8)) >> 3)] = BigInt(stats.blocks);
    (growMemViews(), HEAP64)[(((buf) + (16)) >> 3)] = BigInt(stats.bfree);
    (growMemViews(), HEAP64)[(((buf) + (24)) >> 3)] = BigInt(stats.bavail);
    (growMemViews(), HEAP64)[(((buf) + (32)) >> 3)] = BigInt(stats.files);
    (growMemViews(), HEAP64)[(((buf) + (40)) >> 3)] = BigInt(stats.ffree);
    (growMemViews(), HEAPU32)[(((buf) + (48)) >> 2)] = stats.fsid;
    (growMemViews(), HEAPU32)[(((buf) + (64)) >> 2)] = stats.flags;
    // ST_NOSUID
    (growMemViews(), HEAPU32)[(((buf) + (56)) >> 2)] = stats.namelen;
  },
  doMsync(addr, stream, len, flags, offset) {
    if (!FS.isFile(stream.node.mode)) {
      throw new FS.ErrnoError(43);
    }
    if (flags & 2) {
      // MAP_PRIVATE calls need not to be synced back to underlying fs
      return 0;
    }
    var buffer = (growMemViews(), HEAPU8).slice(addr, addr + len);
    FS.msync(stream, buffer, offset, len, flags);
  },
  getStreamFromFD(fd) {
    var stream = FS.getStreamChecked(fd);
    return stream;
  },
  varargs: undefined,
  getStr(ptr) {
    var ret = UTF8ToString(ptr);
    return ret;
  }
};

function ___syscall_faccessat(dirfd, path, amode, flags) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(3, 0, 1, dirfd, path, amode, flags);
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd, path);
    if (amode & ~7) {
      // need a valid mode
      return -28;
    }
    var lookup = FS.lookupPath(path, {
      follow: true
    });
    var node = lookup.node;
    if (!node) {
      return -44;
    }
    var perms = "";
    if (amode & 4) perms += "r";
    if (amode & 2) perms += "w";
    if (amode & 1) perms += "x";
    if (perms && FS.nodePermissions(node, perms)) {
      return -2;
    }
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

var syscallGetVarargI = () => {
  // the `+` prepended here is necessary to convince the JSCompiler that varargs is indeed a number.
  var ret = (growMemViews(), HEAP32)[((+SYSCALLS.varargs) >> 2)];
  SYSCALLS.varargs += 4;
  return ret;
};

var syscallGetVarargP = syscallGetVarargI;

function ___syscall_fcntl64(fd, cmd, varargs) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(4, 0, 1, fd, cmd, varargs);
  SYSCALLS.varargs = varargs;
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    switch (cmd) {
     case 0:
      {
        var arg = syscallGetVarargI();
        if (arg < 0) {
          return -28;
        }
        while (FS.streams[arg]) {
          arg++;
        }
        var newStream;
        newStream = FS.dupStream(stream, arg);
        return newStream.fd;
      }

     case 1:
     case 2:
      return 0;

     // FD_CLOEXEC makes no sense for a single process.
      case 3:
      return stream.flags;

     case 4:
      {
        var arg = syscallGetVarargI();
        stream.flags |= arg;
        return 0;
      }

     case 12:
      {
        var arg = syscallGetVarargP();
        var offset = 0;
        // We're always unlocked.
        (growMemViews(), HEAP16)[(((arg) + (offset)) >> 1)] = 2;
        return 0;
      }

     case 13:
     case 14:
      // Pretend that the locking is successful. These are process-level locks,
      // and Emscripten programs are a single process. If we supported linking a
      // filesystem between programs, we'd need to do more here.
      // See https://github.com/emscripten-core/emscripten/issues/23697
      return 0;
    }
    return -28;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_fstat64(fd, buf) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(5, 0, 1, fd, buf);
  try {
    return SYSCALLS.writeStat(buf, FS.fstat(fd));
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

var stringToUTF8 = (str, outPtr, maxBytesToWrite) => stringToUTF8Array(str, (growMemViews(), 
HEAPU8), outPtr, maxBytesToWrite);

function ___syscall_getdents64(fd, dirp, count) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(6, 0, 1, fd, dirp, count);
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    stream.getdents ||= FS.readdir(stream.path);
    var struct_size = 280;
    var pos = 0;
    var off = FS.llseek(stream, 0, 1);
    var startIdx = Math.floor(off / struct_size);
    var endIdx = Math.min(stream.getdents.length, startIdx + Math.floor(count / struct_size));
    for (var idx = startIdx; idx < endIdx; idx++) {
      var id;
      var type;
      var name = stream.getdents[idx];
      if (name === ".") {
        id = stream.node.id;
        type = 4;
      } else if (name === "..") {
        var lookup = FS.lookupPath(stream.path, {
          parent: true
        });
        id = lookup.node.id;
        type = 4;
      } else {
        var child;
        try {
          child = FS.lookupNode(stream.node, name);
        } catch (e) {
          // If the entry is not a directory, file, or symlink, nodefs
          // lookupNode will raise EINVAL. Skip these and continue.
          if (e?.errno === 28) {
            continue;
          }
          throw e;
        }
        id = child.id;
        type = FS.isChrdev(child.mode) ? 2 : // character device.
        FS.isDir(child.mode) ? 4 : // directory
        FS.isLink(child.mode) ? 10 : // symbolic link.
        8;
      }
      (growMemViews(), HEAP64)[((dirp + pos) >> 3)] = BigInt(id);
      (growMemViews(), HEAP64)[(((dirp + pos) + (8)) >> 3)] = BigInt((idx + 1) * struct_size);
      (growMemViews(), HEAP16)[(((dirp + pos) + (16)) >> 1)] = 280;
      (growMemViews(), HEAP8)[(dirp + pos) + (18)] = type;
      stringToUTF8(name, dirp + pos + 19, 256);
      pos += struct_size;
    }
    FS.llseek(stream, idx * struct_size, 0);
    return pos;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_ioctl(fd, op, varargs) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(7, 0, 1, fd, op, varargs);
  SYSCALLS.varargs = varargs;
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    switch (op) {
     case 21509:
      {
        if (!stream.tty) return -59;
        return 0;
      }

     case 21505:
      {
        if (!stream.tty) return -59;
        if (stream.tty.ops.ioctl_tcgets) {
          var termios = stream.tty.ops.ioctl_tcgets(stream);
          var argp = syscallGetVarargP();
          (growMemViews(), HEAP32)[((argp) >> 2)] = termios.c_iflag || 0;
          (growMemViews(), HEAP32)[(((argp) + (4)) >> 2)] = termios.c_oflag || 0;
          (growMemViews(), HEAP32)[(((argp) + (8)) >> 2)] = termios.c_cflag || 0;
          (growMemViews(), HEAP32)[(((argp) + (12)) >> 2)] = termios.c_lflag || 0;
          for (var i = 0; i < 32; i++) {
            (growMemViews(), HEAP8)[(argp + i) + (17)] = termios.c_cc[i] || 0;
          }
          return 0;
        }
        return 0;
      }

     case 21510:
     case 21511:
     case 21512:
      {
        if (!stream.tty) return -59;
        return 0;
      }

     case 21506:
     case 21507:
     case 21508:
      {
        if (!stream.tty) return -59;
        if (stream.tty.ops.ioctl_tcsets) {
          var argp = syscallGetVarargP();
          var c_iflag = (growMemViews(), HEAP32)[((argp) >> 2)];
          var c_oflag = (growMemViews(), HEAP32)[(((argp) + (4)) >> 2)];
          var c_cflag = (growMemViews(), HEAP32)[(((argp) + (8)) >> 2)];
          var c_lflag = (growMemViews(), HEAP32)[(((argp) + (12)) >> 2)];
          var c_cc = [];
          for (var i = 0; i < 32; i++) {
            c_cc.push((growMemViews(), HEAP8)[(argp + i) + (17)]);
          }
          return stream.tty.ops.ioctl_tcsets(stream.tty, op, {
            c_iflag,
            c_oflag,
            c_cflag,
            c_lflag,
            c_cc
          });
        }
        return 0;
      }

     case 21519:
      {
        if (!stream.tty) return -59;
        var argp = syscallGetVarargP();
        (growMemViews(), HEAP32)[((argp) >> 2)] = 0;
        return 0;
      }

     case 21520:
      {
        if (!stream.tty) return -59;
        return -28;
      }

     case 21537:
     case 21531:
      {
        var argp = syscallGetVarargP();
        return FS.ioctl(stream, op, argp);
      }

     case 21523:
      {
        // TODO: in theory we should write to the winsize struct that gets
        // passed in, but for now musl doesn't read anything on it
        if (!stream.tty) return -59;
        if (stream.tty.ops.ioctl_tiocgwinsz) {
          var winsize = stream.tty.ops.ioctl_tiocgwinsz(stream.tty);
          var argp = syscallGetVarargP();
          (growMemViews(), HEAP16)[((argp) >> 1)] = winsize[0];
          (growMemViews(), HEAP16)[(((argp) + (2)) >> 1)] = winsize[1];
        }
        return 0;
      }

     case 21524:
      {
        // TODO: technically, this ioctl call should change the window size.
        // but, since emscripten doesn't have any concept of a terminal window
        // yet, we'll just silently throw it away as we do TIOCGWINSZ
        if (!stream.tty) return -59;
        return 0;
      }

     case 21515:
      {
        if (!stream.tty) return -59;
        return 0;
      }

     default:
      return -28;
    }
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_lstat64(path, buf) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(8, 0, 1, path, buf);
  try {
    path = SYSCALLS.getStr(path);
    return SYSCALLS.writeStat(buf, FS.lstat(path));
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_mkdirat(dirfd, path, mode) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(9, 0, 1, dirfd, path, mode);
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd, path);
    FS.mkdir(path, mode, 0);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_newfstatat(dirfd, path, buf, flags) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(10, 0, 1, dirfd, path, buf, flags);
  try {
    path = SYSCALLS.getStr(path);
    var nofollow = flags & 256;
    var allowEmpty = flags & 4096;
    flags = flags & (~6400);
    path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
    return SYSCALLS.writeStat(buf, nofollow ? FS.lstat(path) : FS.stat(path));
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_openat(dirfd, path, flags, varargs) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(11, 0, 1, dirfd, path, flags, varargs);
  SYSCALLS.varargs = varargs;
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd, path);
    var mode = varargs ? syscallGetVarargI() : 0;
    return FS.open(path, flags, mode).fd;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_readlinkat(dirfd, path, buf, bufsize) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(12, 0, 1, dirfd, path, buf, bufsize);
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd, path);
    if (bufsize <= 0) return -28;
    var ret = FS.readlink(path);
    var len = Math.min(bufsize, lengthBytesUTF8(ret));
    var endChar = (growMemViews(), HEAP8)[buf + len];
    stringToUTF8(ret, buf, bufsize + 1);
    // readlink is one of the rare functions that write out a C string, but does never append a null to the output buffer(!)
    // stringToUTF8() always appends a null byte, so restore the character under the null byte after the write.
    (growMemViews(), HEAP8)[buf + len] = endChar;
    return len;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_renameat(olddirfd, oldpath, newdirfd, newpath) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(13, 0, 1, olddirfd, oldpath, newdirfd, newpath);
  try {
    oldpath = SYSCALLS.getStr(oldpath);
    newpath = SYSCALLS.getStr(newpath);
    oldpath = SYSCALLS.calculateAt(olddirfd, oldpath);
    newpath = SYSCALLS.calculateAt(newdirfd, newpath);
    FS.rename(oldpath, newpath);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_rmdir(path) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(14, 0, 1, path);
  try {
    path = SYSCALLS.getStr(path);
    FS.rmdir(path);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_stat64(path, buf) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(15, 0, 1, path, buf);
  try {
    path = SYSCALLS.getStr(path);
    return SYSCALLS.writeStat(buf, FS.stat(path));
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_unlinkat(dirfd, path, flags) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(16, 0, 1, dirfd, path, flags);
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd, path);
    if (!flags) {
      FS.unlink(path);
    } else if (flags === 512) {
      FS.rmdir(path);
    } else {
      return -28;
    }
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

var __abort_js = () => abort("");

var __emscripten_init_main_thread_js = tb => {
  // Pass the thread address to the native code where they are stored in wasm
  // globals which act as a form of TLS. Global constructors trying
  // to access this value will read the wrong value, but that is UB anyway.
  __emscripten_thread_init(tb, /*is_main=*/ !ENVIRONMENT_IS_WORKER, /*is_runtime=*/ 1, /*can_block=*/ !ENVIRONMENT_IS_WEB, /*default_stacksize=*/ 65536, /*start_profiling=*/ false);
  PThread.threadInitTLS();
};

var handleException = e => {
  // Certain exception types we do not treat as errors since they are used for
  // internal control flow.
  // 1. ExitStatus, which is thrown by exit()
  // 2. "unwind", which is thrown by emscripten_unwind_to_js_event_loop() and others
  //    that wish to return to JS event loop.
  if (e instanceof ExitStatus || e == "unwind") {
    return EXITSTATUS;
  }
  quit_(1, e);
};

var maybeExit = () => {
  if (!keepRuntimeAlive()) {
    try {
      if (ENVIRONMENT_IS_PTHREAD) {
        // exit the current thread, but only if there is one active.
        // TODO(https://github.com/emscripten-core/emscripten/issues/25076):
        // Unify this check with the runtimeExited check above
        if (_pthread_self()) __emscripten_thread_exit(EXITSTATUS);
        return;
      }
      _exit(EXITSTATUS);
    } catch (e) {
      handleException(e);
    }
  }
};

var callUserCallback = func => {
  if (ABORT) {
    return;
  }
  try {
    return func();
  } catch (e) {
    handleException(e);
  } finally {
    maybeExit();
  }
};

var waitAsyncPolyfilled = (!Atomics.waitAsync || (globalThis.navigator?.userAgent && Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./) || [])[2]) < 91));

var __emscripten_thread_mailbox_await = pthread_ptr => {
  if (!waitAsyncPolyfilled) {
    // Wait on the pthread's initial self-pointer field because it is easy and
    // safe to access from sending threads that need to notify the waiting
    // thread.
    // Note: Under wasm64 only the low 32-bit of the pthread_ptr are
    // read/compared here, but we don't actually care about the exact values
    // here as long as they match.
    var wait = Atomics.waitAsync((growMemViews(), HEAP32), ((pthread_ptr) >> 2), pthread_ptr);
    wait.value.then(checkMailbox);
    var waitingAsync = pthread_ptr + 120;
    Atomics.store((growMemViews(), HEAP32), ((waitingAsync) >> 2), 1);
  }
};

var checkMailbox = () => callUserCallback(() => {
  // Only check the mailbox if we have a live pthread runtime. We implement
  // pthread_self to return 0 if there is no live runtime.
  // TODO(https://github.com/emscripten-core/emscripten/issues/25076):
  // Is this check still needed?  `callUserCallback` is supposed to
  // ensure the runtime is alive, and if `_pthread_self` is NULL then the
  // runtime certainly is *not* alive, so this should be a redundant check.
  var pthread_ptr = _pthread_self();
  if (pthread_ptr) {
    // If we are using Atomics.waitAsync as our notification mechanism, wait
    // for a notification before processing the mailbox to avoid missing any
    // work that could otherwise arrive after we've finished processing the
    // mailbox and before we're ready for the next notification.
    __emscripten_thread_mailbox_await(pthread_ptr);
    __emscripten_check_mailbox();
  }
});

var __emscripten_notify_mailbox_postmessage = (targetThread, currThreadId) => {
  if (targetThread == currThreadId) {
    setTimeout(checkMailbox);
  } else if (ENVIRONMENT_IS_PTHREAD) {
    postMessage({
      targetThread,
      cmd: "checkMailbox"
    });
  } else {
    var worker = PThread.pthreads[targetThread];
    if (!worker) {
      return;
    }
    worker.postMessage({
      cmd: "checkMailbox"
    });
  }
};

var proxiedJSCallArgs = [];

var __emscripten_receive_on_main_thread_js = (funcIndex, emAsmAddr, callingThread, bufSize, args, ctx, ctxArgs) => {
  // Sometimes we need to backproxy events to the calling thread (e.g.
  // HTML5 DOM events handlers such as
  // emscripten_set_mousemove_callback()), so keep track in a globally
  // accessible variable about the thread that initiated the proxying.
  proxiedJSCallArgs.length = 0;
  var b = ((args) >> 3);
  var end = ((args + bufSize) >> 3);
  while (b < end) {
    var arg;
    if ((growMemViews(), HEAP64)[b++]) {
      // It's a BigInt.
      arg = (growMemViews(), HEAP64)[b++];
    } else {
      // It's a Number.
      arg = (growMemViews(), HEAPF64)[b++];
    }
    proxiedJSCallArgs.push(arg);
  }
  // Proxied JS library funcs use funcIndex and EM_ASM functions use emAsmAddr
  var func = emAsmAddr ? ASM_CONSTS[emAsmAddr] : proxiedFunctionTable[funcIndex];
  PThread.currentProxiedOperationCallerThread = callingThread;
  var rtn = func(...proxiedJSCallArgs);
  PThread.currentProxiedOperationCallerThread = 0;
  if (ctx) {
    rtn.then(rtn => __emscripten_run_js_on_main_thread_done(ctx, ctxArgs, rtn));
    return;
  }
  return rtn;
};

var __emscripten_runtime_keepalive_clear = () => {
  noExitRuntime = false;
  runtimeKeepaliveCounter = 0;
};

var __emscripten_thread_cleanup = thread => {
  // Called when a thread needs to be cleaned up so it can be reused.
  // A thread is considered reusable when it either returns from its
  // entry point, calls pthread_exit, or acts upon a cancellation.
  // Detached threads are responsible for calling this themselves,
  // otherwise pthread_join is responsible for calling this.
  if (!ENVIRONMENT_IS_PTHREAD) cleanupThread(thread); else postMessage({
    cmd: "cleanupThread",
    thread
  });
};

var __emscripten_thread_set_strongref = thread => {
  // Called when a thread needs to be strongly referenced.
  // Currently only used for:
  // - keeping the "main" thread alive in PROXY_TO_PTHREAD mode;
  // - crashed threads that need to propagate the uncaught exception
  //   back to the main thread.
  if (ENVIRONMENT_IS_NODE) {
    PThread.pthreads[thread].ref();
  }
};

var INT53_MAX = 9007199254740992;

var INT53_MIN = -9007199254740992;

var bigintToI53Checked = num => (num < INT53_MIN || num > INT53_MAX) ? NaN : Number(num);

function __gmtime_js(time, tmPtr) {
  time = bigintToI53Checked(time);
  var date = new Date(time * 1e3);
  (growMemViews(), HEAP32)[((tmPtr) >> 2)] = date.getUTCSeconds();
  (growMemViews(), HEAP32)[(((tmPtr) + (4)) >> 2)] = date.getUTCMinutes();
  (growMemViews(), HEAP32)[(((tmPtr) + (8)) >> 2)] = date.getUTCHours();
  (growMemViews(), HEAP32)[(((tmPtr) + (12)) >> 2)] = date.getUTCDate();
  (growMemViews(), HEAP32)[(((tmPtr) + (16)) >> 2)] = date.getUTCMonth();
  (growMemViews(), HEAP32)[(((tmPtr) + (20)) >> 2)] = date.getUTCFullYear() - 1900;
  (growMemViews(), HEAP32)[(((tmPtr) + (24)) >> 2)] = date.getUTCDay();
  var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
  var yday = ((date.getTime() - start) / (1e3 * 60 * 60 * 24)) | 0;
  (growMemViews(), HEAP32)[(((tmPtr) + (28)) >> 2)] = yday;
}

var isLeapYear = year => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

var MONTH_DAYS_LEAP_CUMULATIVE = [ 0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335 ];

var MONTH_DAYS_REGULAR_CUMULATIVE = [ 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 ];

var ydayFromDate = date => {
  var leap = isLeapYear(date.getFullYear());
  var monthDaysCumulative = (leap ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE);
  var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1;
  // -1 since it's days since Jan 1
  return yday;
};

function __localtime_js(time, tmPtr) {
  time = bigintToI53Checked(time);
  var date = new Date(time * 1e3);
  (growMemViews(), HEAP32)[((tmPtr) >> 2)] = date.getSeconds();
  (growMemViews(), HEAP32)[(((tmPtr) + (4)) >> 2)] = date.getMinutes();
  (growMemViews(), HEAP32)[(((tmPtr) + (8)) >> 2)] = date.getHours();
  (growMemViews(), HEAP32)[(((tmPtr) + (12)) >> 2)] = date.getDate();
  (growMemViews(), HEAP32)[(((tmPtr) + (16)) >> 2)] = date.getMonth();
  (growMemViews(), HEAP32)[(((tmPtr) + (20)) >> 2)] = date.getFullYear() - 1900;
  (growMemViews(), HEAP32)[(((tmPtr) + (24)) >> 2)] = date.getDay();
  var yday = ydayFromDate(date) | 0;
  (growMemViews(), HEAP32)[(((tmPtr) + (28)) >> 2)] = yday;
  (growMemViews(), HEAP32)[(((tmPtr) + (36)) >> 2)] = -(date.getTimezoneOffset() * 60);
  // Attention: DST is in December in South, and some regions don't have DST at all.
  var start = new Date(date.getFullYear(), 0, 1);
  var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  var winterOffset = start.getTimezoneOffset();
  var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
  (growMemViews(), HEAP32)[(((tmPtr) + (32)) >> 2)] = dst;
}

function __mmap_js(len, prot, flags, fd, offset, allocated, addr) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(17, 0, 1, len, prot, flags, fd, offset, allocated, addr);
  offset = bigintToI53Checked(offset);
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var res = FS.mmap(stream, len, offset, prot, flags);
    var ptr = res.ptr;
    (growMemViews(), HEAP32)[((allocated) >> 2)] = res.allocated;
    (growMemViews(), HEAPU32)[((addr) >> 2)] = ptr;
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function __munmap_js(addr, len, prot, flags, fd, offset) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(18, 0, 1, addr, len, prot, flags, fd, offset);
  offset = bigintToI53Checked(offset);
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    if (prot & 2) {
      SYSCALLS.doMsync(addr, stream, len, flags, offset);
    }
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

var __tzset_js = (timezone, daylight, std_name, dst_name) => {
  // TODO: Use (malleable) environment variables instead of system settings.
  var currentYear = (new Date).getFullYear();
  var winter = new Date(currentYear, 0, 1);
  var summer = new Date(currentYear, 6, 1);
  var winterOffset = winter.getTimezoneOffset();
  var summerOffset = summer.getTimezoneOffset();
  // Local standard timezone offset. Local standard time is not adjusted for
  // daylight savings.  This code uses the fact that getTimezoneOffset returns
  // a greater value during Standard Time versus Daylight Saving Time (DST).
  // Thus it determines the expected output during Standard Time, and it
  // compares whether the output of the given date the same (Standard) or less
  // (DST).
  var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
  // timezone is specified as seconds west of UTC ("The external variable
  // `timezone` shall be set to the difference, in seconds, between
  // Coordinated Universal Time (UTC) and local standard time."), the same
  // as returned by stdTimezoneOffset.
  // See http://pubs.opengroup.org/onlinepubs/009695399/functions/tzset.html
  (growMemViews(), HEAPU32)[((timezone) >> 2)] = stdTimezoneOffset * 60;
  (growMemViews(), HEAP32)[((daylight) >> 2)] = Number(winterOffset != summerOffset);
  var extractZone = timezoneOffset => {
    // Why inverse sign?
    // Read here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
    var sign = timezoneOffset >= 0 ? "-" : "+";
    var absOffset = Math.abs(timezoneOffset);
    var hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
    var minutes = String(absOffset % 60).padStart(2, "0");
    return `UTC${sign}${hours}${minutes}`;
  };
  var winterName = extractZone(winterOffset);
  var summerName = extractZone(summerOffset);
  if (summerOffset < winterOffset) {
    // Northern hemisphere
    stringToUTF8(winterName, std_name, 17);
    stringToUTF8(summerName, dst_name, 17);
  } else {
    stringToUTF8(winterName, dst_name, 17);
    stringToUTF8(summerName, std_name, 17);
  }
};

var _emscripten_get_now = () => performance.timeOrigin + performance.now();

var _emscripten_date_now = () => Date.now();

var nowIsMonotonic = 1;

var checkWasiClock = clock_id => clock_id >= 0 && clock_id <= 3;

function _clock_time_get(clk_id, ignored_precision, ptime) {
  ignored_precision = bigintToI53Checked(ignored_precision);
  if (!checkWasiClock(clk_id)) {
    return 28;
  }
  var now;
  // all wasi clocks but realtime are monotonic
  if (clk_id === 0) {
    now = _emscripten_date_now();
  } else if (nowIsMonotonic) {
    now = _emscripten_get_now();
  } else {
    return 52;
  }
  // "now" is in ms, and wasi times are in ns.
  var nsec = Math.round(now * 1e3 * 1e3);
  (growMemViews(), HEAP64)[((ptime) >> 3)] = BigInt(nsec);
  return 0;
}

function getFullscreenElement() {
  return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.webkitCurrentFullScreenElement || document.msFullscreenElement;
}

var runtimeKeepalivePush = () => {
  runtimeKeepaliveCounter += 1;
};

var runtimeKeepalivePop = () => {
  runtimeKeepaliveCounter -= 1;
};

/** @param {number=} timeout */ var safeSetTimeout = (func, timeout) => {
  runtimeKeepalivePush();
  return setTimeout(() => {
    runtimeKeepalivePop();
    callUserCallback(func);
  }, timeout);
};

var warnOnce = text => {
  warnOnce.shown ||= {};
  if (!warnOnce.shown[text]) {
    warnOnce.shown[text] = 1;
    if (ENVIRONMENT_IS_NODE) text = "warning: " + text;
    err(text);
  }
};

var Browser = {
  useWebGL: false,
  isFullscreen: false,
  pointerLock: false,
  moduleContextCreatedCallbacks: [],
  workers: [],
  preloadedImages: {},
  preloadedAudios: {},
  getCanvas: () => Module["canvas"],
  init() {
    if (Browser.initted) return;
    Browser.initted = true;
    // Support for plugins that can process preloaded files. You can add more of these to
    // your app by creating and appending to preloadPlugins.
    // Each plugin is asked if it can handle a file based on the file's name. If it can,
    // it is given the file's raw data. When it is done, it calls a callback with the file's
    // (possibly modified) data. For example, a plugin might decompress a file, or it
    // might create some side data structure for use later (like an Image element, etc.).
    var imagePlugin = {};
    imagePlugin["canHandle"] = name => !Module["noImageDecoding"] && /\.(jpg|jpeg|png|bmp|webp)$/i.test(name);
    imagePlugin["handle"] = async (byteArray, name) => {
      var b = new Blob([ byteArray ], {
        type: Browser.getMimetype(name)
      });
      if (b.size !== byteArray.length) {
        // Safari bug #118630
        // Safari's Blob can only take an ArrayBuffer
        b = new Blob([ (new Uint8Array(byteArray)).buffer ], {
          type: Browser.getMimetype(name)
        });
      }
      var url = URL.createObjectURL(b);
      return new Promise((resolve, reject) => {
        var img = new Image;
        img.onload = () => {
          var canvas = /** @type {!HTMLCanvasElement} */ (document.createElement("canvas"));
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          Browser.preloadedImages[name] = canvas;
          URL.revokeObjectURL(url);
          resolve(byteArray);
        };
        img.onerror = event => {
          err(`Image ${url} could not be decoded`);
          reject();
        };
        img.src = url;
      });
    };
    preloadPlugins.push(imagePlugin);
    var audioPlugin = {};
    audioPlugin["canHandle"] = name => !Module["noAudioDecoding"] && name.slice(-4) in {
      ".ogg": 1,
      ".wav": 1,
      ".mp3": 1
    };
    audioPlugin["handle"] = async (byteArray, name) => new Promise((resolve, reject) => {
      var done = false;
      function finish(audio) {
        if (done) return;
        done = true;
        Browser.preloadedAudios[name] = audio;
        resolve(byteArray);
      }
      var b = new Blob([ byteArray ], {
        type: Browser.getMimetype(name)
      });
      var url = URL.createObjectURL(b);
      // XXX we never revoke this!
      var audio = new Audio;
      audio.addEventListener("canplaythrough", () => finish(audio), false);
      // use addEventListener due to chromium bug 124926
      audio.onerror = event => {
        if (done) return;
        err(`warning: browser could not fully decode audio ${name}, trying slower base64 approach`);
        function encode64(data) {
          var BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
          var PAD = "=";
          var ret = "";
          var leftchar = 0;
          var leftbits = 0;
          for (var i = 0; i < data.length; i++) {
            leftchar = (leftchar << 8) | data[i];
            leftbits += 8;
            while (leftbits >= 6) {
              var curr = (leftchar >> (leftbits - 6)) & 63;
              leftbits -= 6;
              ret += BASE[curr];
            }
          }
          if (leftbits == 2) {
            ret += BASE[(leftchar & 3) << 4];
            ret += PAD + PAD;
          } else if (leftbits == 4) {
            ret += BASE[(leftchar & 15) << 2];
            ret += PAD;
          }
          return ret;
        }
        audio.src = "data:audio/x-" + name.slice(-3) + ";base64," + encode64(byteArray);
        finish(audio);
      };
      audio.src = url;
      // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
      safeSetTimeout(() => {
        finish(audio);
      }, 1e4);
    });
    preloadPlugins.push(audioPlugin);
    // Canvas event setup
    function pointerLockChange() {
      var canvas = Browser.getCanvas();
      Browser.pointerLock = document.pointerLockElement === canvas;
    }
    var canvas = Browser.getCanvas();
    if (canvas) {
      // forced aspect ratio can be enabled by defining 'forcedAspectRatio' on Module
      // Module['forcedAspectRatio'] = 4 / 3;
      document.addEventListener("pointerlockchange", pointerLockChange, false);
      if (Module["elementPointerLock"]) {
        canvas.addEventListener("click", ev => {
          if (!Browser.pointerLock && Browser.getCanvas().requestPointerLock) {
            Browser.getCanvas().requestPointerLock();
            ev.preventDefault();
          }
        }, false);
      }
    }
  },
  createContext(/** @type {HTMLCanvasElement} */ canvas, useWebGL, setInModule, webGLContextAttributes) {
    if (useWebGL && Module["ctx"] && canvas == Browser.getCanvas()) return Module["ctx"];
    // no need to recreate GL context if it's already been created for this canvas.
    var ctx;
    var contextHandle;
    if (useWebGL) {
      // For GLES2/desktop GL compatibility, adjust a few defaults to be different to WebGL defaults, so that they align better with the desktop defaults.
      var contextAttributes = {
        antialias: false,
        alpha: false,
        majorVersion: (typeof WebGL2RenderingContext != "undefined") ? 2 : 1
      };
      if (webGLContextAttributes) {
        for (var attribute in webGLContextAttributes) {
          contextAttributes[attribute] = webGLContextAttributes[attribute];
        }
      }
      // This check of existence of GL is here to satisfy Closure compiler, which yells if variable GL is referenced below but GL object is not
      // actually compiled in because application is not doing any GL operations. TODO: Ideally if GL is not being used, this function
      // Browser.createContext() should not even be emitted.
      if (typeof GL != "undefined") {
        contextHandle = GL.createContext(canvas, contextAttributes);
        if (contextHandle) {
          ctx = GL.getContext(contextHandle).GLctx;
        }
      }
    } else {
      ctx = canvas.getContext("2d");
    }
    if (!ctx) return null;
    if (setInModule) {
      Module["ctx"] = ctx;
      if (useWebGL) GL.makeContextCurrent(contextHandle);
      Browser.useWebGL = useWebGL;
      Browser.moduleContextCreatedCallbacks.forEach(callback => callback());
      Browser.init();
    }
    return ctx;
  },
  fullscreenHandlersInstalled: false,
  lockPointer: undefined,
  resizeCanvas: undefined,
  requestFullscreen(lockPointer, resizeCanvas) {
    Browser.lockPointer = lockPointer;
    Browser.resizeCanvas = resizeCanvas;
    if (typeof Browser.lockPointer == "undefined") Browser.lockPointer = true;
    if (typeof Browser.resizeCanvas == "undefined") Browser.resizeCanvas = false;
    var canvas = Browser.getCanvas();
    function fullscreenChange() {
      Browser.isFullscreen = false;
      var canvasContainer = canvas.parentNode;
      if (getFullscreenElement() === canvasContainer) {
        canvas.exitFullscreen = Browser.exitFullscreen;
        if (Browser.lockPointer) canvas.requestPointerLock();
        Browser.isFullscreen = true;
        if (Browser.resizeCanvas) {
          Browser.setFullscreenCanvasSize();
        } else {
          Browser.updateCanvasDimensions(canvas);
        }
      } else {
        // remove the full screen specific parent of the canvas again to restore the HTML structure from before going full screen
        canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
        canvasContainer.parentNode.removeChild(canvasContainer);
        if (Browser.resizeCanvas) {
          Browser.setWindowedCanvasSize();
        } else {
          Browser.updateCanvasDimensions(canvas);
        }
      }
      Module["onFullScreen"]?.(Browser.isFullscreen);
      Module["onFullscreen"]?.(Browser.isFullscreen);
    }
    if (!Browser.fullscreenHandlersInstalled) {
      Browser.fullscreenHandlersInstalled = true;
      document.addEventListener("fullscreenchange", fullscreenChange, false);
      document.addEventListener("mozfullscreenchange", fullscreenChange, false);
      document.addEventListener("webkitfullscreenchange", fullscreenChange, false);
      document.addEventListener("MSFullscreenChange", fullscreenChange, false);
    }
    // create a new parent to ensure the canvas has no siblings. this allows browsers to optimize full screen performance when its parent is the full screen root
    var canvasContainer = document.createElement("div");
    canvas.parentNode.insertBefore(canvasContainer, canvas);
    canvasContainer.appendChild(canvas);
    // use parent of canvas as full screen root to allow aspect ratio correction (Firefox stretches the root to screen size)
    canvasContainer.requestFullscreen = canvasContainer["requestFullscreen"] || canvasContainer["mozRequestFullScreen"] || canvasContainer["msRequestFullscreen"] || (canvasContainer["webkitRequestFullscreen"] ? () => canvasContainer["webkitRequestFullscreen"](Element["ALLOW_KEYBOARD_INPUT"]) : null) || (canvasContainer["webkitRequestFullScreen"] ? () => canvasContainer["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"]) : null);
    canvasContainer.requestFullscreen();
  },
  exitFullscreen() {
    // This is workaround for chrome. Trying to exit from fullscreen
    // not in fullscreen state will cause "TypeError: Document not active"
    // in chrome. See https://github.com/emscripten-core/emscripten/pull/8236
    if (!Browser.isFullscreen) {
      return false;
    }
    var CFS = document["exitFullscreen"] || document["cancelFullScreen"] || document["mozCancelFullScreen"] || document["msExitFullscreen"] || document["webkitCancelFullScreen"] || (() => {});
    CFS.apply(document, []);
    return true;
  },
  safeSetTimeout(func, timeout) {
    // Legacy function, this is used by the SDL2 port so we need to keep it
    // around at least until that is updated.
    // See https://github.com/libsdl-org/SDL/pull/6304
    return safeSetTimeout(func, timeout);
  },
  getMimetype(name) {
    return {
      "jpg": "image/jpeg",
      "jpeg": "image/jpeg",
      "png": "image/png",
      "bmp": "image/bmp",
      "ogg": "audio/ogg",
      "wav": "audio/wav",
      "mp3": "audio/mpeg"
    }[name.slice(name.lastIndexOf(".") + 1)];
  },
  getUserMedia(func) {
    window.getUserMedia ||= navigator["getUserMedia"] || navigator["mozGetUserMedia"];
    window.getUserMedia(func);
  },
  getMovementX(event) {
    return event["movementX"] || event["mozMovementX"] || event["webkitMovementX"] || 0;
  },
  getMovementY(event) {
    return event["movementY"] || event["mozMovementY"] || event["webkitMovementY"] || 0;
  },
  getMouseWheelDelta(event) {
    var delta = 0;
    switch (event.type) {
     case "DOMMouseScroll":
      // 3 lines make up a step
      delta = event.detail / 3;
      break;

     case "mousewheel":
      // 120 units make up a step
      delta = event.wheelDelta / 120;
      break;

     case "wheel":
      delta = event.deltaY;
      switch (event.deltaMode) {
       case 0:
        // DOM_DELTA_PIXEL: 100 pixels make up a step
        delta /= 100;
        break;

       case 1:
        // DOM_DELTA_LINE: 3 lines make up a step
        delta /= 3;
        break;

       case 2:
        // DOM_DELTA_PAGE: A page makes up 80 steps
        delta *= 80;
        break;

       default:
        abort("unrecognized mouse wheel delta mode: " + event.deltaMode);
      }
      break;

     default:
      abort("unrecognized mouse wheel event: " + event.type);
    }
    return delta;
  },
  mouseX: 0,
  mouseY: 0,
  mouseMovementX: 0,
  mouseMovementY: 0,
  touches: {},
  lastTouches: {},
  calculateMouseCoords(pageX, pageY) {
    // Calculate the movement based on the changes
    // in the coordinates.
    var canvas = Browser.getCanvas();
    var rect = canvas.getBoundingClientRect();
    // Neither .scrollX or .pageXOffset are defined in a spec, but
    // we prefer .scrollX because it is currently in a spec draft.
    // (see: http://www.w3.org/TR/2013/WD-cssom-view-20131217/)
    var scrollX = ((typeof window.scrollX != "undefined") ? window.scrollX : window.pageXOffset);
    var scrollY = ((typeof window.scrollY != "undefined") ? window.scrollY : window.pageYOffset);
    var adjustedX = pageX - (scrollX + rect.left);
    var adjustedY = pageY - (scrollY + rect.top);
    // the canvas might be CSS-scaled compared to its backbuffer;
    // SDL-using content will want mouse coordinates in terms
    // of backbuffer units.
    adjustedX = adjustedX * (canvas.width / rect.width);
    adjustedY = adjustedY * (canvas.height / rect.height);
    return {
      x: adjustedX,
      y: adjustedY
    };
  },
  setMouseCoords(pageX, pageY) {
    const {x, y} = Browser.calculateMouseCoords(pageX, pageY);
    Browser.mouseMovementX = x - Browser.mouseX;
    Browser.mouseMovementY = y - Browser.mouseY;
    Browser.mouseX = x;
    Browser.mouseY = y;
  },
  calculateMouseEvent(event) {
    // event should be mousemove, mousedown or mouseup
    if (Browser.pointerLock) {
      // When the pointer is locked, calculate the coordinates
      // based on the movement of the mouse.
      // Workaround for Firefox bug 764498
      if (event.type != "mousemove" && ("mozMovementX" in event)) {
        Browser.mouseMovementX = Browser.mouseMovementY = 0;
      } else {
        Browser.mouseMovementX = Browser.getMovementX(event);
        Browser.mouseMovementY = Browser.getMovementY(event);
      }
      // add the mouse delta to the current absolute mouse position
      Browser.mouseX += Browser.mouseMovementX;
      Browser.mouseY += Browser.mouseMovementY;
    } else {
      if (event.type === "touchstart" || event.type === "touchend" || event.type === "touchmove") {
        var touch = event.touch;
        if (touch === undefined) {
          return;
        }
        var coords = Browser.calculateMouseCoords(touch.pageX, touch.pageY);
        if (event.type === "touchstart") {
          Browser.lastTouches[touch.identifier] = coords;
          Browser.touches[touch.identifier] = coords;
        } else if (event.type === "touchend" || event.type === "touchmove") {
          var last = Browser.touches[touch.identifier];
          last ||= coords;
          Browser.lastTouches[touch.identifier] = last;
          Browser.touches[touch.identifier] = coords;
        }
        return;
      }
      Browser.setMouseCoords(event.pageX, event.pageY);
    }
  },
  resizeListeners: [],
  updateResizeListeners() {
    var canvas = Browser.getCanvas();
    Browser.resizeListeners.forEach(listener => listener(canvas.width, canvas.height));
  },
  setCanvasSize(width, height, noUpdates) {
    var canvas = Browser.getCanvas();
    Browser.updateCanvasDimensions(canvas, width, height);
    if (!noUpdates) Browser.updateResizeListeners();
  },
  windowedWidth: 0,
  windowedHeight: 0,
  setFullscreenCanvasSize() {
    // check if SDL is available
    if (typeof SDL != "undefined") {
      var flags = (growMemViews(), HEAPU32)[((SDL.screen) >> 2)];
      flags = flags | 8388608;
      // set SDL_FULLSCREEN flag
      (growMemViews(), HEAP32)[((SDL.screen) >> 2)] = flags;
    }
    Browser.updateCanvasDimensions(Browser.getCanvas());
    Browser.updateResizeListeners();
  },
  setWindowedCanvasSize() {
    // check if SDL is available
    if (typeof SDL != "undefined") {
      var flags = (growMemViews(), HEAPU32)[((SDL.screen) >> 2)];
      flags = flags & ~8388608;
      // clear SDL_FULLSCREEN flag
      (growMemViews(), HEAP32)[((SDL.screen) >> 2)] = flags;
    }
    Browser.updateCanvasDimensions(Browser.getCanvas());
    Browser.updateResizeListeners();
  },
  updateCanvasDimensions(canvas, wNative, hNative) {
    if (wNative && hNative) {
      canvas.widthNative = wNative;
      canvas.heightNative = hNative;
    } else {
      wNative = canvas.widthNative;
      hNative = canvas.heightNative;
    }
    var w = wNative;
    var h = hNative;
    if (Module["forcedAspectRatio"] > 0) {
      if (w / h < Module["forcedAspectRatio"]) {
        w = Math.round(h * Module["forcedAspectRatio"]);
      } else {
        h = Math.round(w / Module["forcedAspectRatio"]);
      }
    }
    if ((getFullscreenElement() === canvas.parentNode) && (typeof screen != "undefined")) {
      var factor = Math.min(screen.width / w, screen.height / h);
      w = Math.round(w * factor);
      h = Math.round(h * factor);
    }
    if (Browser.resizeCanvas) {
      if (canvas.width != w) canvas.width = w;
      if (canvas.height != h) canvas.height = h;
      if (typeof canvas.style != "undefined") {
        canvas.style.removeProperty("width");
        canvas.style.removeProperty("height");
      }
    } else {
      if (canvas.width != wNative) canvas.width = wNative;
      if (canvas.height != hNative) canvas.height = hNative;
      if (typeof canvas.style != "undefined") {
        if (w != wNative || h != hNative) {
          canvas.style.setProperty("width", w + "px", "important");
          canvas.style.setProperty("height", h + "px", "important");
        } else {
          canvas.style.removeProperty("width");
          canvas.style.removeProperty("height");
        }
      }
    }
  }
};

var EGL = {
  errorCode: 12288,
  defaultDisplayInitialized: false,
  currentContext: 0,
  currentReadSurface: 0,
  currentDrawSurface: 0,
  contextAttributes: {
    alpha: false,
    depth: false,
    stencil: false,
    antialias: false
  },
  stringCache: {},
  setErrorCode(code) {
    EGL.errorCode = code;
  },
  chooseConfig(display, attribList, config, config_size, numConfigs) {
    if (display != 62e3) {
      EGL.setErrorCode(12296);
      return 0;
    }
    if (attribList) {
      // read attribList if it is non-null
      for (;;) {
        var param = (growMemViews(), HEAP32)[((attribList) >> 2)];
        if (param == 12321) {
          var alphaSize = (growMemViews(), HEAP32)[(((attribList) + (4)) >> 2)];
          EGL.contextAttributes.alpha = (alphaSize > 0);
        } else if (param == 12325) {
          var depthSize = (growMemViews(), HEAP32)[(((attribList) + (4)) >> 2)];
          EGL.contextAttributes.depth = (depthSize > 0);
        } else if (param == 12326) {
          var stencilSize = (growMemViews(), HEAP32)[(((attribList) + (4)) >> 2)];
          EGL.contextAttributes.stencil = (stencilSize > 0);
        } else if (param == 12337) {
          var samples = (growMemViews(), HEAP32)[(((attribList) + (4)) >> 2)];
          EGL.contextAttributes.antialias = (samples > 0);
        } else if (param == 12338) {
          var samples = (growMemViews(), HEAP32)[(((attribList) + (4)) >> 2)];
          EGL.contextAttributes.antialias = (samples == 1);
        } else if (param == 12544) {
          var requestedPriority = (growMemViews(), HEAP32)[(((attribList) + (4)) >> 2)];
          EGL.contextAttributes.lowLatency = (requestedPriority != 12547);
        } else if (param == 12344) {
          break;
        }
        attribList += 8;
      }
    }
    if ((!config || !config_size) && !numConfigs) {
      EGL.setErrorCode(12300);
      return 0;
    }
    if (numConfigs) {
      (growMemViews(), HEAP32)[((numConfigs) >> 2)] = 1;
    }
    if (config && config_size > 0) {
      (growMemViews(), HEAPU32)[((config) >> 2)] = 62002;
    }
    EGL.setErrorCode(12288);
    return 1;
  }
};

function _eglBindAPI(api) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(19, 0, 1, api);
  if (api == 12448) {
    EGL.setErrorCode(12288);
    return 1;
  }
  // if (api == 0x30A1 /* EGL_OPENVG_API */ || api == 0x30A2 /* EGL_OPENGL_API */) {
  EGL.setErrorCode(12300);
  return 0;
}

function _eglChooseConfig(display, attrib_list, configs, config_size, numConfigs) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(20, 0, 1, display, attrib_list, configs, config_size, numConfigs);
  return EGL.chooseConfig(display, attrib_list, configs, config_size, numConfigs);
}

var GLctx;

var webgl_enable_ANGLE_instanced_arrays = ctx => {
  // Extension available in WebGL 1 from Firefox 26 and Google Chrome 30 onwards. Core feature in WebGL 2.
  var ext = ctx.getExtension("ANGLE_instanced_arrays");
  // Because this extension is a core function in WebGL 2, assign the extension entry points in place of
  // where the core functions will reside in WebGL 2. This way the calling code can call these without
  // having to dynamically branch depending if running against WebGL 1 or WebGL 2.
  if (ext) {
    ctx["vertexAttribDivisor"] = (index, divisor) => ext["vertexAttribDivisorANGLE"](index, divisor);
    ctx["drawArraysInstanced"] = (mode, first, count, primcount) => ext["drawArraysInstancedANGLE"](mode, first, count, primcount);
    ctx["drawElementsInstanced"] = (mode, count, type, indices, primcount) => ext["drawElementsInstancedANGLE"](mode, count, type, indices, primcount);
    return 1;
  }
};

var webgl_enable_OES_vertex_array_object = ctx => {
  // Extension available in WebGL 1 from Firefox 25 and WebKit 536.28/desktop Safari 6.0.3 onwards. Core feature in WebGL 2.
  var ext = ctx.getExtension("OES_vertex_array_object");
  if (ext) {
    ctx["createVertexArray"] = () => ext["createVertexArrayOES"]();
    ctx["deleteVertexArray"] = vao => ext["deleteVertexArrayOES"](vao);
    ctx["bindVertexArray"] = vao => ext["bindVertexArrayOES"](vao);
    ctx["isVertexArray"] = vao => ext["isVertexArrayOES"](vao);
    return 1;
  }
};

var webgl_enable_WEBGL_draw_buffers = ctx => {
  // Extension available in WebGL 1 from Firefox 28 onwards. Core feature in WebGL 2.
  var ext = ctx.getExtension("WEBGL_draw_buffers");
  if (ext) {
    ctx["drawBuffers"] = (n, bufs) => ext["drawBuffersWEBGL"](n, bufs);
    return 1;
  }
};

var webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance = ctx => // Closure is expected to be allowed to minify the '.dibvbi' property, so not accessing it quoted.
!!(ctx.dibvbi = ctx.getExtension("WEBGL_draw_instanced_base_vertex_base_instance"));

var webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance = ctx => !!(ctx.mdibvbi = ctx.getExtension("WEBGL_multi_draw_instanced_base_vertex_base_instance"));

var webgl_enable_EXT_polygon_offset_clamp = ctx => !!(ctx.extPolygonOffsetClamp = ctx.getExtension("EXT_polygon_offset_clamp"));

var webgl_enable_EXT_clip_control = ctx => !!(ctx.extClipControl = ctx.getExtension("EXT_clip_control"));

var webgl_enable_WEBGL_polygon_mode = ctx => !!(ctx.webglPolygonMode = ctx.getExtension("WEBGL_polygon_mode"));

var webgl_enable_WEBGL_multi_draw = ctx => // Closure is expected to be allowed to minify the '.multiDrawWebgl' property, so not accessing it quoted.
!!(ctx.multiDrawWebgl = ctx.getExtension("WEBGL_multi_draw"));

var getEmscriptenSupportedExtensions = ctx => {
  // Restrict the list of advertised extensions to those that we actually
  // support.
  var supportedExtensions = [ // WebGL 1 extensions
  "ANGLE_instanced_arrays", "EXT_blend_minmax", "EXT_disjoint_timer_query", "EXT_frag_depth", "EXT_shader_texture_lod", "EXT_sRGB", "OES_element_index_uint", "OES_fbo_render_mipmap", "OES_standard_derivatives", "OES_texture_float", "OES_texture_half_float", "OES_texture_half_float_linear", "OES_vertex_array_object", "WEBGL_color_buffer_float", "WEBGL_depth_texture", "WEBGL_draw_buffers", // WebGL 2 extensions
  "EXT_color_buffer_float", "EXT_conservative_depth", "EXT_disjoint_timer_query_webgl2", "EXT_texture_norm16", "NV_shader_noperspective_interpolation", "WEBGL_clip_cull_distance", // WebGL 1 and WebGL 2 extensions
  "EXT_clip_control", "EXT_color_buffer_half_float", "EXT_depth_clamp", "EXT_float_blend", "EXT_polygon_offset_clamp", "EXT_texture_compression_bptc", "EXT_texture_compression_rgtc", "EXT_texture_filter_anisotropic", "KHR_parallel_shader_compile", "OES_texture_float_linear", "WEBGL_blend_func_extended", "WEBGL_compressed_texture_astc", "WEBGL_compressed_texture_etc", "WEBGL_compressed_texture_etc1", "WEBGL_compressed_texture_s3tc", "WEBGL_compressed_texture_s3tc_srgb", "WEBGL_debug_renderer_info", "WEBGL_debug_shaders", "WEBGL_lose_context", "WEBGL_multi_draw", "WEBGL_polygon_mode" ];
  // .getSupportedExtensions() can return null if context is lost, so coerce to empty array.
  return (ctx.getSupportedExtensions() || []).filter(ext => supportedExtensions.includes(ext));
};

var registerPreMainLoop = f => {
  // Does nothing unless $MainLoop is included/used.
  typeof MainLoop != "undefined" && MainLoop.preMainLoop.push(f);
};

var GL = {
  counter: 1,
  buffers: [],
  mappedBuffers: {},
  programs: [],
  framebuffers: [],
  renderbuffers: [],
  textures: [],
  shaders: [],
  vaos: [],
  contexts: {},
  offscreenCanvases: {},
  queries: [],
  samplers: [],
  transformFeedbacks: [],
  syncs: [],
  byteSizeByTypeRoot: 5120,
  byteSizeByType: [ 1, 1, 2, 2, 4, 4, 4, 2, 3, 4, 8 ],
  stringCache: {},
  stringiCache: {},
  unpackAlignment: 4,
  unpackRowLength: 0,
  recordError: errorCode => {
    if (!GL.lastError) {
      GL.lastError = errorCode;
    }
  },
  getNewId: table => {
    var ret = GL.counter++;
    for (var i = table.length; i < ret; i++) {
      table[i] = null;
    }
    // Skip over any non-null elements that might have been created by
    // glBindBuffer.
    while (table[ret]) {
      ret = GL.counter++;
    }
    return ret;
  },
  genObject: (n, buffers, createFunction, objectTable) => {
    for (var i = 0; i < n; i++) {
      var buffer = GLctx[createFunction]();
      var id = buffer && GL.getNewId(objectTable);
      if (buffer) {
        buffer.name = id;
        objectTable[id] = buffer;
      } else {
        GL.recordError(1282);
      }
      (growMemViews(), HEAP32)[(((buffers) + (i * 4)) >> 2)] = id;
    }
  },
  MAX_TEMP_BUFFER_SIZE: 2097152,
  numTempVertexBuffersPerSize: 64,
  log2ceilLookup: i => 32 - Math.clz32(i === 0 ? 0 : i - 1),
  generateTempBuffers: (quads, context) => {
    var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
    context.tempVertexBufferCounters1 = [];
    context.tempVertexBufferCounters2 = [];
    context.tempVertexBufferCounters1.length = context.tempVertexBufferCounters2.length = largestIndex + 1;
    context.tempVertexBuffers1 = [];
    context.tempVertexBuffers2 = [];
    context.tempVertexBuffers1.length = context.tempVertexBuffers2.length = largestIndex + 1;
    context.tempIndexBuffers = [];
    context.tempIndexBuffers.length = largestIndex + 1;
    for (var i = 0; i <= largestIndex; ++i) {
      context.tempIndexBuffers[i] = null;
      // Created on-demand
      context.tempVertexBufferCounters1[i] = context.tempVertexBufferCounters2[i] = 0;
      var ringbufferLength = GL.numTempVertexBuffersPerSize;
      context.tempVertexBuffers1[i] = [];
      context.tempVertexBuffers2[i] = [];
      var ringbuffer1 = context.tempVertexBuffers1[i];
      var ringbuffer2 = context.tempVertexBuffers2[i];
      ringbuffer1.length = ringbuffer2.length = ringbufferLength;
      for (var j = 0; j < ringbufferLength; ++j) {
        ringbuffer1[j] = ringbuffer2[j] = null;
      }
    }
    if (quads) {
      // GL_QUAD indexes can be precalculated
      context.tempQuadIndexBuffer = GLctx.createBuffer();
      context.GLctx.bindBuffer(34963, context.tempQuadIndexBuffer);
      var numIndexes = GL.MAX_TEMP_BUFFER_SIZE >> 1;
      var quadIndexes = new Uint16Array(numIndexes);
      var i = 0, v = 0;
      while (1) {
        quadIndexes[i++] = v;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 1;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 2;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 2;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 3;
        if (i >= numIndexes) break;
        v += 4;
      }
      context.GLctx.bufferData(34963, quadIndexes, 35044);
      context.GLctx.bindBuffer(34963, null);
    }
  },
  getTempVertexBuffer: sizeBytes => {
    var idx = GL.log2ceilLookup(sizeBytes);
    var ringbuffer = GL.currentContext.tempVertexBuffers1[idx];
    var nextFreeBufferIndex = GL.currentContext.tempVertexBufferCounters1[idx];
    GL.currentContext.tempVertexBufferCounters1[idx] = (GL.currentContext.tempVertexBufferCounters1[idx] + 1) & (GL.numTempVertexBuffersPerSize - 1);
    var vbo = ringbuffer[nextFreeBufferIndex];
    if (vbo) {
      return vbo;
    }
    var prevVBO = GLctx.getParameter(34964);
    ringbuffer[nextFreeBufferIndex] = GLctx.createBuffer();
    GLctx.bindBuffer(34962, ringbuffer[nextFreeBufferIndex]);
    GLctx.bufferData(34962, 1 << idx, 35048);
    GLctx.bindBuffer(34962, prevVBO);
    return ringbuffer[nextFreeBufferIndex];
  },
  getTempIndexBuffer: sizeBytes => {
    var idx = GL.log2ceilLookup(sizeBytes);
    var ibo = GL.currentContext.tempIndexBuffers[idx];
    if (ibo) {
      return ibo;
    }
    var prevIBO = GLctx.getParameter(34965);
    GL.currentContext.tempIndexBuffers[idx] = GLctx.createBuffer();
    GLctx.bindBuffer(34963, GL.currentContext.tempIndexBuffers[idx]);
    GLctx.bufferData(34963, 1 << idx, 35048);
    GLctx.bindBuffer(34963, prevIBO);
    return GL.currentContext.tempIndexBuffers[idx];
  },
  newRenderingFrameStarted: () => {
    if (!GL.currentContext) {
      return;
    }
    var vb = GL.currentContext.tempVertexBuffers1;
    GL.currentContext.tempVertexBuffers1 = GL.currentContext.tempVertexBuffers2;
    GL.currentContext.tempVertexBuffers2 = vb;
    vb = GL.currentContext.tempVertexBufferCounters1;
    GL.currentContext.tempVertexBufferCounters1 = GL.currentContext.tempVertexBufferCounters2;
    GL.currentContext.tempVertexBufferCounters2 = vb;
    var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
    for (var i = 0; i <= largestIndex; ++i) {
      GL.currentContext.tempVertexBufferCounters1[i] = 0;
    }
  },
  getSource: (shader, count, string, length) => {
    var source = "";
    for (var i = 0; i < count; ++i) {
      var len = length ? (growMemViews(), HEAPU32)[(((length) + (i * 4)) >> 2)] : undefined;
      source += UTF8ToString((growMemViews(), HEAPU32)[(((string) + (i * 4)) >> 2)], len);
    }
    return source;
  },
  calcBufLength: (size, type, stride, count) => {
    if (stride > 0) {
      return count * stride;
    }
    var typeSize = GL.byteSizeByType[type - GL.byteSizeByTypeRoot];
    return size * typeSize * count;
  },
  usedTempBuffers: [],
  preDrawHandleClientVertexAttribBindings: count => {
    GL.resetBufferBinding = false;
    // TODO: initial pass to detect ranges we need to upload, might not need
    // an upload per attrib
    for (var i = 0; i < GL.currentContext.maxVertexAttribs; ++i) {
      var cb = GL.currentContext.clientBuffers[i];
      if (!cb.clientside || !cb.enabled) continue;
      GL.resetBufferBinding = true;
      var size = GL.calcBufLength(cb.size, cb.type, cb.stride, count);
      var buf = GL.getTempVertexBuffer(size);
      GLctx.bindBuffer(34962, buf);
      GLctx.bufferSubData(34962, 0, (growMemViews(), HEAPU8).subarray(cb.ptr, cb.ptr + size));
      cb.vertexAttribPointerAdaptor.call(GLctx, i, cb.size, cb.type, cb.normalized, cb.stride, 0);
    }
  },
  postDrawHandleClientVertexAttribBindings: () => {
    if (GL.resetBufferBinding) {
      GLctx.bindBuffer(34962, GL.buffers[GLctx.currentArrayBufferBinding]);
    }
  },
  createContext: (/** @type {HTMLCanvasElement} */ canvas, webGLContextAttributes) => {
    // BUG: Workaround Safari WebGL issue: After successfully acquiring WebGL
    // context on a canvas, calling .getContext() will always return that
    // context independent of which 'webgl' or 'webgl2'
    // context version was passed. See:
    //   https://webkit.org/b/222758
    // and:
    //   https://github.com/emscripten-core/emscripten/issues/13295.
    // TODO: Once the bug is fixed and shipped in Safari, adjust the Safari
    // version field in above check.
    if (!canvas.getContextSafariWebGL2Fixed) {
      canvas.getContextSafariWebGL2Fixed = canvas.getContext;
      /** @type {function(this:HTMLCanvasElement, string, (Object|null)=): (Object|null)} */ function fixedGetContext(ver, attrs) {
        var gl = canvas.getContextSafariWebGL2Fixed(ver, attrs);
        return ((ver == "webgl") == (gl instanceof WebGLRenderingContext)) ? gl : null;
      }
      canvas.getContext = fixedGetContext;
    }
    var ctx = (webGLContextAttributes.majorVersion > 1) ? canvas.getContext("webgl2", webGLContextAttributes) : canvas.getContext("webgl", webGLContextAttributes);
    if (!ctx) return 0;
    var handle = GL.registerContext(ctx, webGLContextAttributes);
    return handle;
  },
  registerContext: (ctx, webGLContextAttributes) => {
    // with pthreads a context is a location in memory with some synchronized
    // data between threads
    var handle = _malloc(8);
    (growMemViews(), HEAPU32)[(((handle) + (4)) >> 2)] = _pthread_self();
    // the thread pointer of the thread that owns the control of the context
    var context = {
      handle,
      attributes: webGLContextAttributes,
      version: webGLContextAttributes.majorVersion,
      GLctx: ctx
    };
    // Store the created context object so that we can access the context
    // given a canvas without having to pass the parameters again.
    if (ctx.canvas) ctx.canvas.GLctxObject = context;
    GL.contexts[handle] = context;
    if (typeof webGLContextAttributes.enableExtensionsByDefault == "undefined" || webGLContextAttributes.enableExtensionsByDefault) {
      GL.initExtensions(context);
    }
    context.maxVertexAttribs = context.GLctx.getParameter(34921);
    context.clientBuffers = [];
    for (var i = 0; i < context.maxVertexAttribs; i++) {
      context.clientBuffers[i] = {
        enabled: false,
        clientside: false,
        size: 0,
        type: 0,
        normalized: 0,
        stride: 0,
        ptr: 0,
        vertexAttribPointerAdaptor: null
      };
    }
    GL.generateTempBuffers(false, context);
    return handle;
  },
  makeContextCurrent: contextHandle => {
    // Active Emscripten GL layer context object.
    GL.currentContext = GL.contexts[contextHandle];
    // Active WebGL context object.
    Module["ctx"] = GLctx = GL.currentContext?.GLctx;
    return !(contextHandle && !GLctx);
  },
  getContext: contextHandle => GL.contexts[contextHandle],
  deleteContext: contextHandle => {
    if (GL.currentContext === GL.contexts[contextHandle]) {
      GL.currentContext = null;
    }
    if (typeof JSEvents == "object") {
      // Release all JS event handlers on the DOM element that the GL context is
      // associated with since the context is now deleted.
      JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas);
    }
    // Make sure the canvas object no longer refers to the context object so
    // there are no GC surprises.
    if (GL.contexts[contextHandle]?.GLctx.canvas) {
      GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined;
    }
    _free(GL.contexts[contextHandle].handle);
    GL.contexts[contextHandle] = null;
  },
  initExtensions: context => {
    // If this function is called without a specific context object, init the
    // extensions of the currently active context.
    context ||= GL.currentContext;
    if (context.initExtensionsDone) return;
    context.initExtensionsDone = true;
    var GLctx = context.GLctx;
    // Detect the presence of a few extensions manually, since the GL interop
    // layer itself will need to know if they exist.
    // Extensions that are available in both WebGL 1 and WebGL 2
    webgl_enable_WEBGL_multi_draw(GLctx);
    webgl_enable_EXT_polygon_offset_clamp(GLctx);
    webgl_enable_EXT_clip_control(GLctx);
    webgl_enable_WEBGL_polygon_mode(GLctx);
    // Extensions that are only available in WebGL 1 (the calls will be no-ops
    // if called on a WebGL 2 context active)
    webgl_enable_ANGLE_instanced_arrays(GLctx);
    webgl_enable_OES_vertex_array_object(GLctx);
    webgl_enable_WEBGL_draw_buffers(GLctx);
    // Extensions that are available from WebGL >= 2 (no-op if called on a WebGL 1 context active)
    webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(GLctx);
    webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(GLctx);
    // On WebGL 2, EXT_disjoint_timer_query is replaced with an alternative
    // that's based on core APIs, and exposes only the queryCounterEXT()
    // entrypoint.
    if (context.version >= 2) {
      GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query_webgl2");
    }
    // However, Firefox exposes the WebGL 1 version on WebGL 2 as well and
    // thus we look for the WebGL 1 version again if the WebGL 2 version
    // isn't present. https://bugzil.la/1328882
    if (context.version < 2 || !GLctx.disjointTimerQueryExt) {
      GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query");
    }
    for (var ext of getEmscriptenSupportedExtensions(GLctx)) {
      // WEBGL_lose_context, WEBGL_debug_renderer_info and WEBGL_debug_shaders
      // are not enabled by default.
      if (!ext.includes("lose_context") && !ext.includes("debug")) {
        // Call .getExtension() to enable that extension permanently.
        GLctx.getExtension(ext);
      }
    }
  }
};

function _eglCreateContext(display, config, hmm, contextAttribs) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(21, 0, 1, display, config, hmm, contextAttribs);
  if (display != 62e3) {
    EGL.setErrorCode(12296);
    return 0;
  }
  // EGL 1.4 spec says default EGL_CONTEXT_CLIENT_VERSION is GLES1, but this is not supported by Emscripten.
  // So user must pass EGL_CONTEXT_CLIENT_VERSION == 2 to initialize EGL.
  var glesContextVersion = 1;
  for (;;) {
    var param = (growMemViews(), HEAP32)[((contextAttribs) >> 2)];
    if (param == 12440) {
      glesContextVersion = (growMemViews(), HEAP32)[(((contextAttribs) + (4)) >> 2)];
    } else if (param == 12344) {
      break;
    } else {
      /* EGL1.4 specifies only EGL_CONTEXT_CLIENT_VERSION as supported attribute */ EGL.setErrorCode(12292);
      return 0;
    }
    contextAttribs += 8;
  }
  if (glesContextVersion < 2 || glesContextVersion > 3) {
    EGL.setErrorCode(12293);
    return 0;
  }
  EGL.contextAttributes.majorVersion = glesContextVersion - 1;
  // WebGL 1 is GLES 2, WebGL2 is GLES3
  EGL.contextAttributes.minorVersion = 0;
  EGL.context = GL.createContext(Browser.getCanvas(), EGL.contextAttributes);
  if (EGL.context != 0) {
    EGL.setErrorCode(12288);
    // Run callbacks so that GL emulation works
    GL.makeContextCurrent(EGL.context);
    Browser.useWebGL = true;
    Browser.moduleContextCreatedCallbacks.forEach(callback => callback());
    // Note: This function only creates a context, but it shall not make it active.
    GL.makeContextCurrent(null);
    return 62004;
  } else {
    EGL.setErrorCode(12297);
    // By the EGL 1.4 spec, an implementation that does not support GLES2 (WebGL in this case), this error code is set.
    return 0;
  }
}

function _eglCreateWindowSurface(display, config, win, attrib_list) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(22, 0, 1, display, config, win, attrib_list);
  if (display != 62e3) {
    EGL.setErrorCode(12296);
    return 0;
  }
  if (config != 62002) {
    EGL.setErrorCode(12293);
    return 0;
  }
  // TODO: Examine attrib_list! Parameters that can be present there are:
  // - EGL_RENDER_BUFFER (must be EGL_BACK_BUFFER)
  // - EGL_VG_COLORSPACE (can't be set)
  // - EGL_VG_ALPHA_FORMAT (can't be set)
  EGL.setErrorCode(12288);
  return 62006;
}

function _eglDestroyContext(display, context) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(23, 0, 1, display, context);
  if (display != 62e3) {
    EGL.setErrorCode(12296);
    return 0;
  }
  if (context != 62004) {
    EGL.setErrorCode(12294);
    return 0;
  }
  GL.deleteContext(EGL.context);
  EGL.setErrorCode(12288);
  if (EGL.currentContext == context) {
    EGL.currentContext = 0;
  }
  return 1;
}

function _eglDestroySurface(display, surface) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(24, 0, 1, display, surface);
  if (display != 62e3) {
    EGL.setErrorCode(12296);
    return 0;
  }
  if (surface != 62006) {
    EGL.setErrorCode(12301);
    return 1;
  }
  if (EGL.currentReadSurface == surface) {
    EGL.currentReadSurface = 0;
  }
  if (EGL.currentDrawSurface == surface) {
    EGL.currentDrawSurface = 0;
  }
  EGL.setErrorCode(12288);
  return 1;
}

function _eglGetConfigAttrib(display, config, attribute, value) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(25, 0, 1, display, config, attribute, value);
  if (display != 62e3) {
    EGL.setErrorCode(12296);
    return 0;
  }
  if (config != 62002) {
    EGL.setErrorCode(12293);
    return 0;
  }
  if (!value) {
    EGL.setErrorCode(12300);
    return 0;
  }
  EGL.setErrorCode(12288);
  switch (attribute) {
   case 12320:
    // EGL_BUFFER_SIZE
    (growMemViews(), HEAP32)[((value) >> 2)] = EGL.contextAttributes.alpha ? 32 : 24;
    return 1;

   case 12321:
    // EGL_ALPHA_SIZE
    (growMemViews(), HEAP32)[((value) >> 2)] = EGL.contextAttributes.alpha ? 8 : 0;
    return 1;

   case 12322:
    // EGL_BLUE_SIZE
    (growMemViews(), HEAP32)[((value) >> 2)] = 8;
    return 1;

   case 12323:
    // EGL_GREEN_SIZE
    (growMemViews(), HEAP32)[((value) >> 2)] = 8;
    return 1;

   case 12324:
    // EGL_RED_SIZE
    (growMemViews(), HEAP32)[((value) >> 2)] = 8;
    return 1;

   case 12325:
    // EGL_DEPTH_SIZE
    (growMemViews(), HEAP32)[((value) >> 2)] = EGL.contextAttributes.depth ? 24 : 0;
    return 1;

   case 12326:
    // EGL_STENCIL_SIZE
    (growMemViews(), HEAP32)[((value) >> 2)] = EGL.contextAttributes.stencil ? 8 : 0;
    return 1;

   case 12327:
    // EGL_CONFIG_CAVEAT
    // We can return here one of EGL_NONE (0x3038), EGL_SLOW_CONFIG (0x3050) or EGL_NON_CONFORMANT_CONFIG (0x3051).
    (growMemViews(), HEAP32)[((value) >> 2)] = 12344;
    return 1;

   case 12328:
    // EGL_CONFIG_ID
    (growMemViews(), HEAP32)[((value) >> 2)] = 62002;
    return 1;

   case 12329:
    // EGL_LEVEL
    (growMemViews(), HEAP32)[((value) >> 2)] = 0;
    return 1;

   case 12330:
    // EGL_MAX_PBUFFER_HEIGHT
    (growMemViews(), HEAP32)[((value) >> 2)] = 4096;
    return 1;

   case 12331:
    // EGL_MAX_PBUFFER_PIXELS
    (growMemViews(), HEAP32)[((value) >> 2)] = 16777216;
    return 1;

   case 12332:
    // EGL_MAX_PBUFFER_WIDTH
    (growMemViews(), HEAP32)[((value) >> 2)] = 4096;
    return 1;

   case 12333:
    // EGL_NATIVE_RENDERABLE
    (growMemViews(), HEAP32)[((value) >> 2)] = 0;
    return 1;

   case 12334:
    // EGL_NATIVE_VISUAL_ID
    (growMemViews(), HEAP32)[((value) >> 2)] = 0;
    return 1;

   case 12335:
    // EGL_NATIVE_VISUAL_TYPE
    (growMemViews(), HEAP32)[((value) >> 2)] = 12344;
    return 1;

   case 12337:
    // EGL_SAMPLES
    (growMemViews(), HEAP32)[((value) >> 2)] = EGL.contextAttributes.antialias ? 4 : 0;
    return 1;

   case 12338:
    // EGL_SAMPLE_BUFFERS
    (growMemViews(), HEAP32)[((value) >> 2)] = EGL.contextAttributes.antialias ? 1 : 0;
    return 1;

   case 12339:
    // EGL_SURFACE_TYPE
    (growMemViews(), HEAP32)[((value) >> 2)] = 4;
    return 1;

   case 12340:
    // EGL_TRANSPARENT_TYPE
    // If this returns EGL_TRANSPARENT_RGB (0x3052), transparency is used through color-keying. No such thing applies to Emscripten canvas.
    (growMemViews(), HEAP32)[((value) >> 2)] = 12344;
    return 1;

   case 12341:
   // EGL_TRANSPARENT_BLUE_VALUE
    case 12342:
   // EGL_TRANSPARENT_GREEN_VALUE
    case 12343:
    // EGL_TRANSPARENT_RED_VALUE
    // "If EGL_TRANSPARENT_TYPE is EGL_NONE, then the values for EGL_TRANSPARENT_RED_VALUE, EGL_TRANSPARENT_GREEN_VALUE, and EGL_TRANSPARENT_BLUE_VALUE are undefined."
    (growMemViews(), HEAP32)[((value) >> 2)] = -1;
    return 1;

   case 12345:
   // EGL_BIND_TO_TEXTURE_RGB
    case 12346:
    // EGL_BIND_TO_TEXTURE_RGBA
    (growMemViews(), HEAP32)[((value) >> 2)] = 0;
    return 1;

   case 12347:
    // EGL_MIN_SWAP_INTERVAL
    (growMemViews(), HEAP32)[((value) >> 2)] = 0;
    return 1;

   case 12348:
    // EGL_MAX_SWAP_INTERVAL
    (growMemViews(), HEAP32)[((value) >> 2)] = 1;
    return 1;

   case 12349:
   // EGL_LUMINANCE_SIZE
    case 12350:
    // EGL_ALPHA_MASK_SIZE
    (growMemViews(), HEAP32)[((value) >> 2)] = 0;
    return 1;

   case 12351:
    // EGL_COLOR_BUFFER_TYPE
    // EGL has two types of buffers: EGL_RGB_BUFFER and EGL_LUMINANCE_BUFFER.
    (growMemViews(), HEAP32)[((value) >> 2)] = 12430;
    return 1;

   case 12352:
    // EGL_RENDERABLE_TYPE
    // A bit combination of EGL_OPENGL_ES_BIT,EGL_OPENVG_BIT,EGL_OPENGL_ES2_BIT and EGL_OPENGL_BIT.
    (growMemViews(), HEAP32)[((value) >> 2)] = 4;
    return 1;

   case 12354:
    // EGL_CONFORMANT
    // "EGL_CONFORMANT is a mask indicating if a client API context created with respect to the corresponding EGLConfig will pass the required conformance tests for that API."
    (growMemViews(), HEAP32)[((value) >> 2)] = 0;
    return 1;

   default:
    EGL.setErrorCode(12292);
    return 0;
  }
}

function _eglGetDisplay(nativeDisplayType) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(26, 0, 1, nativeDisplayType);
  EGL.setErrorCode(12288);
  // Emscripten EGL implementation "emulates" X11, and eglGetDisplay is
  // expected to accept/receive a pointer to an X11 Display object (or
  // EGL_DEFAULT_DISPLAY).
  if (nativeDisplayType != 0 && nativeDisplayType != 1) {
    return 0;
  }
  return 62e3;
}

function _eglGetError() {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(27, 0, 1);
  return EGL.errorCode;
}

function _eglInitialize(display, majorVersion, minorVersion) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(28, 0, 1, display, majorVersion, minorVersion);
  if (display != 62e3) {
    EGL.setErrorCode(12296);
    return 0;
  }
  if (majorVersion) {
    (growMemViews(), HEAP32)[((majorVersion) >> 2)] = 1;
  }
  if (minorVersion) {
    (growMemViews(), HEAP32)[((minorVersion) >> 2)] = 4;
  }
  EGL.defaultDisplayInitialized = true;
  EGL.setErrorCode(12288);
  return 1;
}

function _eglMakeCurrent(display, draw, read, context) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(29, 0, 1, display, draw, read, context);
  if (display != 62e3) {
    EGL.setErrorCode(12296);
    return 0;
  }
  //\todo An EGL_NOT_INITIALIZED error is generated if EGL is not initialized for dpy.
  if (context != 0 && context != 62004) {
    EGL.setErrorCode(12294);
    return 0;
  }
  if ((read != 0 && read != 62006) || (draw != 0 && draw != 62006)) {
    EGL.setErrorCode(12301);
    return 0;
  }
  GL.makeContextCurrent(context ? EGL.context : null);
  EGL.currentContext = context;
  EGL.currentDrawSurface = draw;
  EGL.currentReadSurface = read;
  EGL.setErrorCode(12288);
  return 1;
}

var stringToNewUTF8 = str => {
  var size = lengthBytesUTF8(str) + 1;
  var ret = _malloc(size);
  if (ret) stringToUTF8(str, ret, size);
  return ret;
};

function _eglQueryString(display, name) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(30, 0, 1, display, name);
  if (display != 62e3) {
    EGL.setErrorCode(12296);
    return 0;
  }
  //\todo An EGL_NOT_INITIALIZED error is generated if EGL is not initialized for dpy.
  EGL.setErrorCode(12288);
  if (EGL.stringCache[name]) return EGL.stringCache[name];
  var ret;
  switch (name) {
   case 12371:
    ret = stringToNewUTF8("Emscripten");
    break;

   case 12372:
    ret = stringToNewUTF8("1.4 Emscripten EGL");
    break;

   case 12373:
    ret = stringToNewUTF8("");
    break;

   // Currently not supporting any EGL extensions.
    case 12429:
    ret = stringToNewUTF8("OpenGL_ES");
    break;

   default:
    EGL.setErrorCode(12300);
    return 0;
  }
  EGL.stringCache[name] = ret;
  return ret;
}

function _eglSwapBuffers(dpy, surface) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(31, 0, 1, dpy, surface);
  if (!EGL.defaultDisplayInitialized) {
    EGL.setErrorCode(12289);
  } else if (!GLctx) {
    EGL.setErrorCode(12290);
  } else if (GLctx.isContextLost()) {
    EGL.setErrorCode(12302);
  } else {
    // According to documentation this does an implicit flush.
    // Due to discussion at https://github.com/emscripten-core/emscripten/pull/1871
    // the flush was removed since this _may_ result in slowing code down.
    //_glFlush();
    EGL.setErrorCode(12288);
    return 1;
  }
  return 0;
}

/**
   * @param {number=} arg
   * @param {boolean=} noSetTiming
   */ var setMainLoop = (iterFunc, fps, simulateInfiniteLoop, arg, noSetTiming) => {
  MainLoop.func = iterFunc;
  MainLoop.arg = arg;
  var thisMainLoopId = MainLoop.currentlyRunningMainloop;
  function checkIsRunning() {
    if (thisMainLoopId < MainLoop.currentlyRunningMainloop) {
      runtimeKeepalivePop();
      maybeExit();
      return false;
    }
    return true;
  }
  // We create the loop runner here but it is not actually running until
  // _emscripten_set_main_loop_timing is called (which might happen at a
  // later time).  This member signifies that the current runner has not
  // yet been started so that we can call runtimeKeepalivePush when it
  // gets its timing set for the first time.
  MainLoop.running = false;
  MainLoop.runner = function MainLoop_runner() {
    if (ABORT) return;
    if (MainLoop.queue.length > 0) {
      var start = Date.now();
      var blocker = MainLoop.queue.shift();
      blocker.func(blocker.arg);
      if (MainLoop.remainingBlockers) {
        var remaining = MainLoop.remainingBlockers;
        var next = remaining % 1 == 0 ? remaining - 1 : Math.floor(remaining);
        if (blocker.counted) {
          MainLoop.remainingBlockers = next;
        } else {
          // not counted, but move the progress along a tiny bit
          next = next + .5;
          // do not steal all the next one's progress
          MainLoop.remainingBlockers = (8 * remaining + next) / 9;
        }
      }
      MainLoop.updateStatus();
      // catches pause/resume main loop from blocker execution
      if (!checkIsRunning()) return;
      setTimeout(MainLoop.runner, 0);
      return;
    }
    // catch pauses from non-main loop sources
    if (!checkIsRunning()) return;
    // Implement very basic swap interval control
    MainLoop.currentFrameNumber = MainLoop.currentFrameNumber + 1 | 0;
    if (MainLoop.timingMode == 1 && MainLoop.timingValue > 1 && MainLoop.currentFrameNumber % MainLoop.timingValue != 0) {
      // Not the scheduled time to render this frame - skip.
      MainLoop.scheduler();
      return;
    } else if (MainLoop.timingMode == 0) {
      MainLoop.tickStartTime = _emscripten_get_now();
    }
    MainLoop.runIter(iterFunc);
    // catch pauses from the main loop itself
    if (!checkIsRunning()) return;
    MainLoop.scheduler();
  };
  if (!noSetTiming) {
    if (fps > 0) {
      _emscripten_set_main_loop_timing(0, 1e3 / fps);
    } else {
      // Do rAF by rendering each frame (no decimating)
      _emscripten_set_main_loop_timing(1, 1);
    }
    MainLoop.scheduler();
  }
  if (simulateInfiniteLoop) {
    throw "unwind";
  }
};

var MainLoop = {
  running: false,
  scheduler: null,
  currentlyRunningMainloop: 0,
  func: null,
  arg: 0,
  timingMode: 0,
  timingValue: 0,
  currentFrameNumber: 0,
  queue: [],
  preMainLoop: [],
  postMainLoop: [],
  pause() {
    MainLoop.scheduler = null;
    // Incrementing this signals the previous main loop that it's now become old, and it must return.
    MainLoop.currentlyRunningMainloop++;
  },
  resume() {
    MainLoop.currentlyRunningMainloop++;
    var timingMode = MainLoop.timingMode;
    var timingValue = MainLoop.timingValue;
    var func = MainLoop.func;
    MainLoop.func = null;
    // do not set timing and call scheduler, we will do it on the next lines
    setMainLoop(func, 0, false, MainLoop.arg, true);
    _emscripten_set_main_loop_timing(timingMode, timingValue);
    MainLoop.scheduler();
  },
  updateStatus() {
    if (Module["setStatus"]) {
      var message = Module["statusMessage"] || "Please wait...";
      var remaining = MainLoop.remainingBlockers ?? 0;
      var expected = MainLoop.expectedBlockers ?? 0;
      if (remaining) {
        if (remaining < expected) {
          Module["setStatus"](`{message} ({expected - remaining}/{expected})`);
        } else {
          Module["setStatus"](message);
        }
      } else {
        Module["setStatus"]("");
      }
    }
  },
  init() {
    Module["preMainLoop"] && MainLoop.preMainLoop.push(Module["preMainLoop"]);
    Module["postMainLoop"] && MainLoop.postMainLoop.push(Module["postMainLoop"]);
  },
  runIter(func) {
    if (ABORT) return;
    for (var pre of MainLoop.preMainLoop) {
      if (pre() === false) {
        return;
      }
    }
    callUserCallback(func);
    for (var post of MainLoop.postMainLoop) {
      post();
    }
  },
  nextRAF: 0,
  fakeRequestAnimationFrame(func) {
    // try to keep 60fps between calls to here
    var now = Date.now();
    if (MainLoop.nextRAF === 0) {
      MainLoop.nextRAF = now + 1e3 / 60;
    } else {
      while (now + 2 >= MainLoop.nextRAF) {
        // fudge a little, to avoid timer jitter causing us to do lots of delay:0
        MainLoop.nextRAF += 1e3 / 60;
      }
    }
    var delay = Math.max(MainLoop.nextRAF - now, 0);
    setTimeout(func, delay);
  },
  requestAnimationFrame(func) {
    if (globalThis.requestAnimationFrame) {
      requestAnimationFrame(func);
    } else {
      MainLoop.fakeRequestAnimationFrame(func);
    }
  }
};

var _emscripten_set_main_loop_timing = (mode, value) => {
  MainLoop.timingMode = mode;
  MainLoop.timingValue = value;
  if (!MainLoop.func) {
    return 1;
  }
  if (!MainLoop.running) {
    runtimeKeepalivePush();
    MainLoop.running = true;
  }
  if (mode == 0) {
    MainLoop.scheduler = function MainLoop_scheduler_setTimeout() {
      var timeUntilNextTick = Math.max(0, MainLoop.tickStartTime + value - _emscripten_get_now()) | 0;
      setTimeout(MainLoop.runner, timeUntilNextTick);
    };
  } else if (mode == 1) {
    MainLoop.scheduler = function MainLoop_scheduler_rAF() {
      MainLoop.requestAnimationFrame(MainLoop.runner);
    };
  } else {
    if (!MainLoop.setImmediate) {
      if (globalThis.setImmediate) {
        MainLoop.setImmediate = setImmediate;
      } else {
        // Emulate setImmediate. (note: not a complete polyfill, we don't emulate clearImmediate() to keep code size to minimum, since not needed)
        var setImmediates = [];
        var emscriptenMainLoopMessageId = "setimmediate";
        /** @param {Event} event */ var MainLoop_setImmediate_messageHandler = event => {
          // When called in current thread or Worker, the main loop ID is structured slightly different to accommodate for --proxy-to-worker runtime listening to Worker events,
          // so check for both cases.
          if (event.data === emscriptenMainLoopMessageId || event.data.target === emscriptenMainLoopMessageId) {
            event.stopPropagation();
            setImmediates.shift()();
          }
        };
        addEventListener("message", MainLoop_setImmediate_messageHandler, true);
        MainLoop.setImmediate = /** @type{function(function(): ?, ...?): number} */ (func => {
          setImmediates.push(func);
          if (ENVIRONMENT_IS_WORKER) {
            Module["setImmediates"] ??= [];
            Module["setImmediates"].push(func);
            postMessage({
              target: emscriptenMainLoopMessageId
            });
          } else postMessage(emscriptenMainLoopMessageId, "*");
        });
      }
    }
    MainLoop.scheduler = function MainLoop_scheduler_setImmediate() {
      MainLoop.setImmediate(MainLoop.runner);
    };
  }
  return 0;
};

function _eglSwapInterval(display, interval) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(32, 0, 1, display, interval);
  if (display != 62e3) {
    EGL.setErrorCode(12296);
    return 0;
  }
  if (interval == 0) _emscripten_set_main_loop_timing(0, 0); else _emscripten_set_main_loop_timing(1, interval);
  EGL.setErrorCode(12288);
  return 1;
}

function _eglTerminate(display) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(33, 0, 1, display);
  if (display != 62e3) {
    EGL.setErrorCode(12296);
    return 0;
  }
  EGL.currentContext = 0;
  EGL.currentReadSurface = 0;
  EGL.currentDrawSurface = 0;
  EGL.defaultDisplayInitialized = false;
  EGL.setErrorCode(12288);
  return 1;
}

function _eglWaitClient() {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(34, 0, 1);
  EGL.setErrorCode(12288);
  return 1;
}

var _eglWaitGL = _eglWaitClient;

function _eglWaitNative(nativeEngineId) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(35, 0, 1, nativeEngineId);
  EGL.setErrorCode(12288);
  return 1;
}

var readEmAsmArgsArray = [];

var readEmAsmArgs = (sigPtr, buf) => {
  readEmAsmArgsArray.length = 0;
  var ch;
  // Most arguments are i32s, so shift the buffer pointer so it is a plain
  // index into HEAP32.
  while (ch = (growMemViews(), HEAPU8)[sigPtr++]) {
    // Floats are always passed as doubles, so all types except for 'i'
    // are 8 bytes and require alignment.
    var wide = (ch != 105);
    wide &= (ch != 112);
    buf += wide && (buf % 8) ? 4 : 0;
    readEmAsmArgsArray.push(// Special case for pointers under wasm64 or CAN_ADDRESS_2GB mode.
    ch == 112 ? (growMemViews(), HEAPU32)[((buf) >> 2)] : ch == 106 ? (growMemViews(), 
    HEAP64)[((buf) >> 3)] : ch == 105 ? (growMemViews(), HEAP32)[((buf) >> 2)] : (growMemViews(), 
    HEAPF64)[((buf) >> 3)]);
    buf += wide ? 8 : 4;
  }
  return readEmAsmArgsArray;
};

var runEmAsmFunction = (code, sigPtr, argbuf) => {
  var args = readEmAsmArgs(sigPtr, argbuf);
  return ASM_CONSTS[code](...args);
};

var _emscripten_asm_const_int = (code, sigPtr, argbuf) => runEmAsmFunction(code, sigPtr, argbuf);

var runMainThreadEmAsm = (emAsmAddr, sigPtr, argbuf, sync) => {
  var args = readEmAsmArgs(sigPtr, argbuf);
  if (ENVIRONMENT_IS_PTHREAD) {
    // EM_ASM functions are variadic, receiving the actual arguments as a buffer
    // in memory. the last parameter (argBuf) points to that data. We need to
    // always un-variadify that, *before proxying*, as in the async case this
    // is a stack allocation that LLVM made, which may go away before the main
    // thread gets the message. For that reason we handle proxying *after* the
    // call to readEmAsmArgs, and therefore we do that manually here instead
    // of using __proxy. (And for simplicity, do the same in the sync
    // case as well, even though it's not strictly necessary, to keep the two
    // code paths as similar as possible on both sides.)
    return proxyToMainThread(0, emAsmAddr, sync, ...args);
  }
  return ASM_CONSTS[emAsmAddr](...args);
};

var _emscripten_asm_const_int_sync_on_main_thread = (emAsmAddr, sigPtr, argbuf) => runMainThreadEmAsm(emAsmAddr, sigPtr, argbuf, 1);

var _emscripten_asm_const_ptr_sync_on_main_thread = (emAsmAddr, sigPtr, argbuf) => runMainThreadEmAsm(emAsmAddr, sigPtr, argbuf, 1);

var _emscripten_cancel_main_loop = () => {
  MainLoop.pause();
  MainLoop.func = null;
};

var _emscripten_check_blocking_allowed = () => {};

var onExits = [];

var addOnExit = cb => onExits.push(cb);

var JSEvents = {
  removeAllEventListeners() {
    while (JSEvents.eventHandlers.length) {
      JSEvents._removeHandler(JSEvents.eventHandlers.length - 1);
    }
    JSEvents.deferredCalls = [];
  },
  inEventHandler: 0,
  deferredCalls: [],
  deferCall(targetFunction, precedence, argsList) {
    function arraysHaveEqualContent(arrA, arrB) {
      if (arrA.length != arrB.length) return false;
      for (var i in arrA) {
        if (arrA[i] != arrB[i]) return false;
      }
      return true;
    }
    // Test if the given call was already queued, and if so, don't add it again.
    for (var call of JSEvents.deferredCalls) {
      if (call.targetFunction == targetFunction && arraysHaveEqualContent(call.argsList, argsList)) {
        return;
      }
    }
    JSEvents.deferredCalls.push({
      targetFunction,
      precedence,
      argsList
    });
    JSEvents.deferredCalls.sort((x, y) => x.precedence - y.precedence);
  },
  removeDeferredCalls(targetFunction) {
    JSEvents.deferredCalls = JSEvents.deferredCalls.filter(call => call.targetFunction != targetFunction);
  },
  canPerformEventHandlerRequests() {
    if (navigator.userActivation) {
      // Verify against transient activation status from UserActivation API
      // whether it is possible to perform a request here without needing to defer. See
      // https://developer.mozilla.org/en-US/docs/Web/Security/User_activation#transient_activation
      // and https://caniuse.com/mdn-api_useractivation
      // At the time of writing, Firefox does not support this API: https://bugzil.la/1791079
      return navigator.userActivation.isActive;
    }
    return JSEvents.inEventHandler && JSEvents.currentEventHandler.allowsDeferredCalls;
  },
  runDeferredCalls() {
    if (!JSEvents.canPerformEventHandlerRequests()) {
      return;
    }
    var deferredCalls = JSEvents.deferredCalls;
    JSEvents.deferredCalls = [];
    for (var call of deferredCalls) {
      call.targetFunction(...call.argsList);
    }
  },
  eventHandlers: [],
  removeAllHandlersOnTarget: (target, eventTypeString) => {
    for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
      if (JSEvents.eventHandlers[i].target == target && (!eventTypeString || eventTypeString == JSEvents.eventHandlers[i].eventTypeString)) {
        JSEvents._removeHandler(i--);
      }
    }
  },
  _removeHandler(i) {
    var h = JSEvents.eventHandlers[i];
    h.target.removeEventListener(h.eventTypeString, h.eventListenerFunc, h.useCapture);
    JSEvents.eventHandlers.splice(i, 1);
  },
  registerOrRemoveHandler(eventHandler) {
    if (!eventHandler.target) {
      return -4;
    }
    if (eventHandler.callbackfunc) {
      eventHandler.eventListenerFunc = function(event) {
        // Increment nesting count for the event handler.
        ++JSEvents.inEventHandler;
        JSEvents.currentEventHandler = eventHandler;
        // Process any old deferred calls the user has placed.
        JSEvents.runDeferredCalls();
        // Process the actual event, calls back to user C code handler.
        eventHandler.handlerFunc(event);
        // Process any new deferred calls that were placed right now from this event handler.
        JSEvents.runDeferredCalls();
        // Out of event handler - restore nesting count.
        --JSEvents.inEventHandler;
      };
      eventHandler.target.addEventListener(eventHandler.eventTypeString, eventHandler.eventListenerFunc, eventHandler.useCapture);
      JSEvents.eventHandlers.push(eventHandler);
    } else {
      for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
        if (JSEvents.eventHandlers[i].target == eventHandler.target && JSEvents.eventHandlers[i].eventTypeString == eventHandler.eventTypeString) {
          JSEvents._removeHandler(i--);
        }
      }
    }
    return 0;
  },
  removeSingleHandler(eventHandler) {
    let success = false;
    for (let i = 0; i < JSEvents.eventHandlers.length; ++i) {
      const handler = JSEvents.eventHandlers[i];
      if (handler.target === eventHandler.target && handler.eventTypeId === eventHandler.eventTypeId && handler.callbackfunc === eventHandler.callbackfunc && handler.userData === eventHandler.userData) {
        // in some very rare cases (ex: Safari / fullscreen events), there is more than 1 handler (eventTypeString is different)
        JSEvents._removeHandler(i--);
        success = true;
      }
    }
    return success ? 0 : -5;
  },
  getTargetThreadForEventCallback(targetThread) {
    switch (targetThread) {
     case 1:
      // The event callback for the current event should be called on the
      // main browser thread. (0 == don't proxy)
      return 0;

     case 2:
      // The event callback for the current event should be backproxied to
      // the thread that is registering the event.
      // This can be 0 in the case that the caller uses
      // EM_CALLBACK_THREAD_CONTEXT_CALLING_THREAD but on the main thread
      // itself.
      return PThread.currentProxiedOperationCallerThread;

     default:
      // The event callback for the current event should be proxied to the
      // given specific thread.
      return targetThread;
    }
  },
  getNodeNameForTarget(target) {
    if (!target) return "";
    if (target == window) return "#window";
    if (target == screen) return "#screen";
    return target?.nodeName || "";
  },
  fullscreenEnabled() {
    return document.fullscreenEnabled || document.webkitFullscreenEnabled;
  }
};

/** @type {Object} */ var specialHTMLTargets = [ 0, globalThis.document ?? 0, globalThis.window ?? 0 ];

var maybeCStringToJsString = cString => cString > 2 ? UTF8ToString(cString) : cString;

var findEventTarget = target => {
  target = maybeCStringToJsString(target);
  var domElement = specialHTMLTargets[target] || globalThis.document?.querySelector(target);
  return domElement;
};

var findCanvasEventTarget = findEventTarget;

var getCanvasSizeCallingThread = (target, width, height) => {
  var canvas = findCanvasEventTarget(target);
  if (!canvas) return -4;
  if (!canvas.controlTransferredOffscreen) {
    (growMemViews(), HEAP32)[((width) >> 2)] = canvas.width;
    (growMemViews(), HEAP32)[((height) >> 2)] = canvas.height;
  } else {
    return -4;
  }
  return 0;
};

function getCanvasSizeMainThread(target, width, height) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(37, 0, 1, target, width, height);
  return getCanvasSizeCallingThread(target, width, height);
}

var _emscripten_get_canvas_element_size = (target, width, height) => {
  var canvas = findCanvasEventTarget(target);
  if (canvas) {
    return getCanvasSizeCallingThread(target, width, height);
  }
  return getCanvasSizeMainThread(target, width, height);
};

var stringToUTF8OnStack = str => {
  var size = lengthBytesUTF8(str) + 1;
  var ret = stackAlloc(size);
  stringToUTF8(str, ret, size);
  return ret;
};

var getCanvasElementSize = target => {
  var sp = stackSave();
  var w = stackAlloc(8);
  var h = w + 4;
  var targetInt = stringToUTF8OnStack(target.id);
  var ret = _emscripten_get_canvas_element_size(targetInt, w, h);
  var size = [ (growMemViews(), HEAP32)[((w) >> 2)], (growMemViews(), HEAP32)[((h) >> 2)] ];
  stackRestore(sp);
  return size;
};

var setCanvasElementSizeCallingThread = (target, width, height) => {
  var canvas = findCanvasEventTarget(target);
  if (!canvas) return -4;
  if (!canvas.controlTransferredOffscreen) {
    var autoResizeViewport = false;
    if (canvas.GLctxObject?.GLctx) {
      var prevViewport = canvas.GLctxObject.GLctx.getParameter(2978);
      // TODO: Perhaps autoResizeViewport should only be true if FBO 0 is currently active?
      autoResizeViewport = (prevViewport[0] === 0 && prevViewport[1] === 0 && prevViewport[2] === canvas.width && prevViewport[3] === canvas.height);
    }
    canvas.width = width;
    canvas.height = height;
    if (autoResizeViewport) {
      // TODO: Add -sCANVAS_RESIZE_SETS_GL_VIEWPORT=0/1 option (default=1). This is commonly done and several graphics engines depend on this,
      // but this can be quite disruptive.
      canvas.GLctxObject.GLctx.viewport(0, 0, width, height);
    }
  } else {
    return -4;
  }
  return 0;
};

function setCanvasElementSizeMainThread(target, width, height) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(38, 0, 1, target, width, height);
  return setCanvasElementSizeCallingThread(target, width, height);
}

var _emscripten_set_canvas_element_size = (target, width, height) => {
  var canvas = findCanvasEventTarget(target);
  if (canvas) {
    return setCanvasElementSizeCallingThread(target, width, height);
  }
  return setCanvasElementSizeMainThread(target, width, height);
};

var setCanvasElementSize = (target, width, height) => {
  if (!target.controlTransferredOffscreen) {
    target.width = width;
    target.height = height;
  } else {
    // This function is being called from high-level JavaScript code instead of asm.js/Wasm,
    // and it needs to synchronously proxy over to another thread, so marshal the string onto the heap to do the call.
    var sp = stackSave();
    var targetInt = stringToUTF8OnStack(target.id);
    _emscripten_set_canvas_element_size(targetInt, width, height);
    stackRestore(sp);
  }
};

var currentFullscreenStrategy = {};

var registerRestoreOldStyle = canvas => {
  var canvasSize = getCanvasElementSize(canvas);
  var oldWidth = canvasSize[0];
  var oldHeight = canvasSize[1];
  var oldCssWidth = canvas.style.width;
  var oldCssHeight = canvas.style.height;
  var oldBackgroundColor = canvas.style.backgroundColor;
  // Chrome reads color from here.
  var oldDocumentBackgroundColor = document.body.style.backgroundColor;
  // IE11 reads color from here.
  // Firefox always has black background color.
  var oldPaddingLeft = canvas.style.paddingLeft;
  // Chrome, FF, Safari
  var oldPaddingRight = canvas.style.paddingRight;
  var oldPaddingTop = canvas.style.paddingTop;
  var oldPaddingBottom = canvas.style.paddingBottom;
  var oldMarginLeft = canvas.style.marginLeft;
  // IE11
  var oldMarginRight = canvas.style.marginRight;
  var oldMarginTop = canvas.style.marginTop;
  var oldMarginBottom = canvas.style.marginBottom;
  var oldDocumentBodyMargin = document.body.style.margin;
  var oldDocumentOverflow = document.documentElement.style.overflow;
  // Chrome, Firefox
  var oldDocumentScroll = document.body.scroll;
  // IE
  var oldImageRendering = canvas.style.imageRendering;
  function restoreOldStyle() {
    if (!getFullscreenElement()) {
      document.removeEventListener("fullscreenchange", restoreOldStyle);
      // As of Safari 13.0.3 on macOS Catalina 10.15.1 still ships with prefixed webkitfullscreenchange. TODO: revisit this check once Safari ships unprefixed version.
      document.removeEventListener("webkitfullscreenchange", restoreOldStyle);
      setCanvasElementSize(canvas, oldWidth, oldHeight);
      canvas.style.width = oldCssWidth;
      canvas.style.height = oldCssHeight;
      canvas.style.backgroundColor = oldBackgroundColor;
      // Chrome
      // IE11 hack: assigning 'undefined' or an empty string to document.body.style.backgroundColor has no effect, so first assign back the default color
      // before setting the undefined value. Setting undefined value is also important, or otherwise we would later treat that as something that the user
      // had explicitly set so subsequent fullscreen transitions would not set background color properly.
      if (!oldDocumentBackgroundColor) document.body.style.backgroundColor = "white";
      document.body.style.backgroundColor = oldDocumentBackgroundColor;
      // IE11
      canvas.style.paddingLeft = oldPaddingLeft;
      // Chrome, FF, Safari
      canvas.style.paddingRight = oldPaddingRight;
      canvas.style.paddingTop = oldPaddingTop;
      canvas.style.paddingBottom = oldPaddingBottom;
      canvas.style.marginLeft = oldMarginLeft;
      // IE11
      canvas.style.marginRight = oldMarginRight;
      canvas.style.marginTop = oldMarginTop;
      canvas.style.marginBottom = oldMarginBottom;
      document.body.style.margin = oldDocumentBodyMargin;
      document.documentElement.style.overflow = oldDocumentOverflow;
      // Chrome, Firefox
      document.body.scroll = oldDocumentScroll;
      // IE
      canvas.style.imageRendering = oldImageRendering;
      if (canvas.GLctxObject) canvas.GLctxObject.GLctx.viewport(0, 0, oldWidth, oldHeight);
      if (currentFullscreenStrategy.canvasResizedCallback) {
        if (currentFullscreenStrategy.canvasResizedCallbackTargetThread) __emscripten_run_callback_on_thread(currentFullscreenStrategy.canvasResizedCallbackTargetThread, currentFullscreenStrategy.canvasResizedCallback, 37, 0, currentFullscreenStrategy.canvasResizedCallbackUserData); else getWasmTableEntry(currentFullscreenStrategy.canvasResizedCallback)(37, 0, currentFullscreenStrategy.canvasResizedCallbackUserData);
      }
    }
  }
  document.addEventListener("fullscreenchange", restoreOldStyle);
  // As of Safari 13.0.3 on macOS Catalina 10.15.1 still ships with prefixed webkitfullscreenchange. TODO: revisit this check once Safari ships unprefixed version.
  document.addEventListener("webkitfullscreenchange", restoreOldStyle);
  return restoreOldStyle;
};

var setLetterbox = (element, topBottom, leftRight) => {
  // Cannot use margin to specify letterboxes in FF or Chrome, since those ignore margins in fullscreen mode.
  element.style.paddingLeft = element.style.paddingRight = leftRight + "px";
  element.style.paddingTop = element.style.paddingBottom = topBottom + "px";
};

var getBoundingClientRect = e => specialHTMLTargets.indexOf(e) < 0 ? e.getBoundingClientRect() : {
  "left": 0,
  "top": 0
};

var JSEvents_resizeCanvasForFullscreen = (target, strategy) => {
  var restoreOldStyle = registerRestoreOldStyle(target);
  var cssWidth = strategy.softFullscreen ? innerWidth : screen.width;
  var cssHeight = strategy.softFullscreen ? innerHeight : screen.height;
  var rect = getBoundingClientRect(target);
  var windowedCssWidth = rect.width;
  var windowedCssHeight = rect.height;
  var canvasSize = getCanvasElementSize(target);
  var windowedRttWidth = canvasSize[0];
  var windowedRttHeight = canvasSize[1];
  if (strategy.scaleMode == 3) {
    setLetterbox(target, (cssHeight - windowedCssHeight) / 2, (cssWidth - windowedCssWidth) / 2);
    cssWidth = windowedCssWidth;
    cssHeight = windowedCssHeight;
  } else if (strategy.scaleMode == 2) {
    if (cssWidth * windowedRttHeight < windowedRttWidth * cssHeight) {
      var desiredCssHeight = windowedRttHeight * cssWidth / windowedRttWidth;
      setLetterbox(target, (cssHeight - desiredCssHeight) / 2, 0);
      cssHeight = desiredCssHeight;
    } else {
      var desiredCssWidth = windowedRttWidth * cssHeight / windowedRttHeight;
      setLetterbox(target, 0, (cssWidth - desiredCssWidth) / 2);
      cssWidth = desiredCssWidth;
    }
  }
  // If we are adding padding, must choose a background color or otherwise Chrome will give the
  // padding a default white color. Do it only if user has not customized their own background color.
  target.style.backgroundColor ||= "black";
  // IE11 does the same, but requires the color to be set in the document body.
  document.body.style.backgroundColor ||= "black";
  // IE11
  // Firefox always shows black letterboxes independent of style color.
  target.style.width = cssWidth + "px";
  target.style.height = cssHeight + "px";
  if (strategy.filteringMode == 1) {
    target.style.imageRendering = "optimizeSpeed";
    target.style.imageRendering = "-moz-crisp-edges";
    target.style.imageRendering = "-o-crisp-edges";
    target.style.imageRendering = "-webkit-optimize-contrast";
    target.style.imageRendering = "optimize-contrast";
    target.style.imageRendering = "crisp-edges";
    target.style.imageRendering = "pixelated";
  }
  var dpiScale = (strategy.canvasResolutionScaleMode == 2) ? devicePixelRatio : 1;
  if (strategy.canvasResolutionScaleMode != 0) {
    var newWidth = (cssWidth * dpiScale) | 0;
    var newHeight = (cssHeight * dpiScale) | 0;
    setCanvasElementSize(target, newWidth, newHeight);
    if (target.GLctxObject) target.GLctxObject.GLctx.viewport(0, 0, newWidth, newHeight);
  }
  return restoreOldStyle;
};

var JSEvents_requestFullscreen = (target, strategy) => {
  // EMSCRIPTEN_FULLSCREEN_SCALE_DEFAULT + EMSCRIPTEN_FULLSCREEN_CANVAS_SCALE_NONE is a mode where no extra logic is performed to the DOM elements.
  if (strategy.scaleMode != 0 || strategy.canvasResolutionScaleMode != 0) {
    JSEvents_resizeCanvasForFullscreen(target, strategy);
  }
  if (target.requestFullscreen) {
    target.requestFullscreen();
  } else if (target.webkitRequestFullscreen) {
    target.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
  } else {
    return JSEvents.fullscreenEnabled() ? -3 : -1;
  }
  currentFullscreenStrategy = strategy;
  if (strategy.canvasResizedCallback) {
    if (strategy.canvasResizedCallbackTargetThread) __emscripten_run_callback_on_thread(strategy.canvasResizedCallbackTargetThread, strategy.canvasResizedCallback, 37, 0, strategy.canvasResizedCallbackUserData); else getWasmTableEntry(strategy.canvasResizedCallback)(37, 0, strategy.canvasResizedCallbackUserData);
  }
  return 0;
};

function _emscripten_exit_fullscreen() {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(36, 0, 1);
  if (!JSEvents.fullscreenEnabled()) return -1;
  // Make sure no queued up calls will fire after this.
  JSEvents.removeDeferredCalls(JSEvents_requestFullscreen);
  var d = specialHTMLTargets[1];
  if (d.exitFullscreen) {
    d.fullscreenElement && d.exitFullscreen();
  } else if (d.webkitExitFullscreen) {
    d.webkitFullscreenElement && d.webkitExitFullscreen();
  } else {
    return -1;
  }
  return 0;
}

var requestPointerLock = target => {
  if (target.requestPointerLock) {
    target.requestPointerLock();
  } else {
    // document.body is known to accept pointer lock, so use that to differentiate if the user passed a bad element,
    // or if the whole browser just doesn't support the feature.
    if (document.body.requestPointerLock) {
      return -3;
    }
    return -1;
  }
  return 0;
};

function _emscripten_exit_pointerlock() {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(39, 0, 1);
  // Make sure no queued up calls will fire after this.
  JSEvents.removeDeferredCalls(requestPointerLock);
  if (!document.exitPointerLock) return -1;
  document.exitPointerLock();
  return 0;
}

var _emscripten_exit_with_live_runtime = () => {
  runtimeKeepalivePush();
  throw "unwind";
};

function _emscripten_get_device_pixel_ratio() {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(40, 0, 1);
  return globalThis.devicePixelRatio ?? 1;
}

function _emscripten_get_element_css_size(target, width, height) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(41, 0, 1, target, width, height);
  target = findEventTarget(target);
  if (!target) return -4;
  var rect = getBoundingClientRect(target);
  (growMemViews(), HEAPF64)[((width) >> 3)] = rect.width;
  (growMemViews(), HEAPF64)[((height) >> 3)] = rect.height;
  return 0;
}

var fillGamepadEventData = (eventStruct, e) => {
  (growMemViews(), HEAPF64)[((eventStruct) >> 3)] = e.timestamp;
  for (var i = 0; i < e.axes.length; ++i) {
    (growMemViews(), HEAPF64)[(((eventStruct + i * 8) + (16)) >> 3)] = e.axes[i];
  }
  for (var i = 0; i < e.buttons.length; ++i) {
    if (typeof e.buttons[i] == "object") {
      (growMemViews(), HEAPF64)[(((eventStruct + i * 8) + (528)) >> 3)] = e.buttons[i].value;
    } else {
      (growMemViews(), HEAPF64)[(((eventStruct + i * 8) + (528)) >> 3)] = e.buttons[i];
    }
  }
  for (var i = 0; i < e.buttons.length; ++i) {
    if (typeof e.buttons[i] == "object") {
      (growMemViews(), HEAP8)[(eventStruct + i) + (1040)] = e.buttons[i].pressed;
    } else {
      // Assigning a boolean to HEAP32, that's ok, but Closure would like to warn about it:
      /** @suppress {checkTypes} */ (growMemViews(), HEAP8)[(eventStruct + i) + (1040)] = e.buttons[i] == 1;
    }
  }
  (growMemViews(), HEAP8)[(eventStruct) + (1104)] = e.connected;
  (growMemViews(), HEAP32)[(((eventStruct) + (1108)) >> 2)] = e.index;
  (growMemViews(), HEAP32)[(((eventStruct) + (8)) >> 2)] = e.axes.length;
  (growMemViews(), HEAP32)[(((eventStruct) + (12)) >> 2)] = e.buttons.length;
  stringToUTF8(e.id, eventStruct + 1112, 64);
  stringToUTF8(e.mapping, eventStruct + 1176, 64);
};

function _emscripten_get_gamepad_status(index, gamepadState) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(42, 0, 1, index, gamepadState);
  // INVALID_PARAM is returned on a Gamepad index that never was there.
  if (index < 0 || index >= JSEvents.lastGamepadState.length) return -5;
  // NO_DATA is returned on a Gamepad index that was removed.
  // For previously disconnected gamepads there should be an empty slot (null/undefined/false) at the index.
  // This is because gamepads must keep their original position in the array.
  // For example, removing the first of two gamepads produces [null/undefined/false, gamepad].
  if (!JSEvents.lastGamepadState[index]) return -7;
  fillGamepadEventData(gamepadState, JSEvents.lastGamepadState[index]);
  return 0;
}

var getHeapMax = () => // Stay one Wasm page short of 4GB: while e.g. Chrome is able to allocate
// full 4GB Wasm memories, the size will wrap back to 0 bytes in Wasm side
// for any code that deals with heap sizes, which would require special
// casing all heap size related code to treat 0 specially.
2147483648;

var _emscripten_get_heap_max = () => getHeapMax();

function _emscripten_get_num_gamepads() {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(43, 0, 1);
  // N.B. Do not call emscripten_get_num_gamepads() unless having first called emscripten_sample_gamepad_data(), and that has returned EMSCRIPTEN_RESULT_SUCCESS.
  // Otherwise the following line will throw an exception.
  return JSEvents.lastGamepadState.length;
}

function _emscripten_get_screen_size(width, height) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(44, 0, 1, width, height);
  (growMemViews(), HEAP32)[((width) >> 2)] = screen.width;
  (growMemViews(), HEAP32)[((height) >> 2)] = screen.height;
}

var _emscripten_glActiveTexture = x0 => GLctx.activeTexture(x0);

var _emscripten_glAttachShader = (program, shader) => {
  GLctx.attachShader(GL.programs[program], GL.shaders[shader]);
};

var _emscripten_glBeginQuery = (target, id) => {
  GLctx.beginQuery(target, GL.queries[id]);
};

var _emscripten_glBeginQueryEXT = (target, id) => {
  GLctx.disjointTimerQueryExt["beginQueryEXT"](target, GL.queries[id]);
};

var _emscripten_glBeginTransformFeedback = x0 => GLctx.beginTransformFeedback(x0);

var _emscripten_glBindAttribLocation = (program, index, name) => {
  GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name));
};

var _emscripten_glBindBuffer = (target, buffer) => {
  // Calling glBindBuffer with an unknown buffer will implicitly create a
  // new one.  Here we bypass `GL.counter` and directly using the ID passed
  // in.
  if (buffer && !GL.buffers[buffer]) {
    var b = GLctx.createBuffer();
    b.name = buffer;
    GL.buffers[buffer] = b;
  }
  if (target == 34962) {
    GLctx.currentArrayBufferBinding = buffer;
  } else if (target == 34963) {
    GLctx.currentElementArrayBufferBinding = buffer;
  }
  if (target == 35051) {
    // In WebGL 2 glReadPixels entry point, we need to use a different WebGL 2
    // API function call when a buffer is bound to
    // GL_PIXEL_PACK_BUFFER_BINDING point, so must keep track whether that
    // binding point is non-null to know what is the proper API function to
    // call.
    GLctx.currentPixelPackBufferBinding = buffer;
  } else if (target == 35052) {
    // In WebGL 2 gl(Compressed)Tex(Sub)Image[23]D entry points, we need to
    // use a different WebGL 2 API function call when a buffer is bound to
    // GL_PIXEL_UNPACK_BUFFER_BINDING point, so must keep track whether that
    // binding point is non-null to know what is the proper API function to
    // call.
    GLctx.currentPixelUnpackBufferBinding = buffer;
  }
  GLctx.bindBuffer(target, GL.buffers[buffer]);
};

var _emscripten_glBindBufferBase = (target, index, buffer) => {
  GLctx.bindBufferBase(target, index, GL.buffers[buffer]);
};

var _emscripten_glBindBufferRange = (target, index, buffer, offset, ptrsize) => {
  GLctx.bindBufferRange(target, index, GL.buffers[buffer], offset, ptrsize);
};

var _emscripten_glBindFramebuffer = (target, framebuffer) => {
  GLctx.bindFramebuffer(target, GL.framebuffers[framebuffer]);
};

var _emscripten_glBindRenderbuffer = (target, renderbuffer) => {
  GLctx.bindRenderbuffer(target, GL.renderbuffers[renderbuffer]);
};

var _emscripten_glBindSampler = (unit, sampler) => {
  GLctx.bindSampler(unit, GL.samplers[sampler]);
};

var _emscripten_glBindTexture = (target, texture) => {
  GLctx.bindTexture(target, GL.textures[texture]);
};

var _emscripten_glBindTransformFeedback = (target, id) => {
  GLctx.bindTransformFeedback(target, GL.transformFeedbacks[id]);
};

var _emscripten_glBindVertexArray = vao => {
  GLctx.bindVertexArray(GL.vaos[vao]);
  var ibo = GLctx.getParameter(34965);
  GLctx.currentElementArrayBufferBinding = ibo ? (ibo.name | 0) : 0;
};

var _glBindVertexArray = _emscripten_glBindVertexArray;

var _emscripten_glBindVertexArrayOES = _glBindVertexArray;

var _emscripten_glBlendColor = (x0, x1, x2, x3) => GLctx.blendColor(x0, x1, x2, x3);

var _emscripten_glBlendEquation = x0 => GLctx.blendEquation(x0);

var _emscripten_glBlendEquationSeparate = (x0, x1) => GLctx.blendEquationSeparate(x0, x1);

var _emscripten_glBlendFunc = (x0, x1) => GLctx.blendFunc(x0, x1);

var _emscripten_glBlendFuncSeparate = (x0, x1, x2, x3) => GLctx.blendFuncSeparate(x0, x1, x2, x3);

var _emscripten_glBlitFramebuffer = (x0, x1, x2, x3, x4, x5, x6, x7, x8, x9) => GLctx.blitFramebuffer(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9);

var _emscripten_glBufferData = (target, size, data, usage) => {
  if (GL.currentContext.version >= 2) {
    // If size is zero, WebGL would interpret uploading the whole input
    // arraybuffer (starting from given offset), which would not make sense in
    // WebAssembly, so avoid uploading if size is zero. However we must still
    // call bufferData to establish a backing storage of zero bytes.
    if (data && size) {
      GLctx.bufferData(target, (growMemViews(), HEAPU8), usage, data, size);
    } else {
      GLctx.bufferData(target, size, usage);
    }
    return;
  }
  // N.b. here first form specifies a heap subarray, second form an integer
  // size, so the ?: code here is polymorphic. It is advised to avoid
  // randomly mixing both uses in calling code, to avoid any potential JS
  // engine JIT issues.
  GLctx.bufferData(target, data ? (growMemViews(), HEAPU8).subarray(data, data + size) : size, usage);
};

var _emscripten_glBufferSubData = (target, offset, size, data) => {
  if (GL.currentContext.version >= 2) {
    size && GLctx.bufferSubData(target, offset, (growMemViews(), HEAPU8), data, size);
    return;
  }
  GLctx.bufferSubData(target, offset, (growMemViews(), HEAPU8).subarray(data, data + size));
};

var _emscripten_glCheckFramebufferStatus = x0 => GLctx.checkFramebufferStatus(x0);

var _emscripten_glClear = x0 => GLctx.clear(x0);

var _emscripten_glClearBufferfi = (x0, x1, x2, x3) => GLctx.clearBufferfi(x0, x1, x2, x3);

var _emscripten_glClearBufferfv = (buffer, drawbuffer, value) => {
  GLctx.clearBufferfv(buffer, drawbuffer, (growMemViews(), HEAPF32), ((value) >> 2));
};

var _emscripten_glClearBufferiv = (buffer, drawbuffer, value) => {
  GLctx.clearBufferiv(buffer, drawbuffer, (growMemViews(), HEAP32), ((value) >> 2));
};

var _emscripten_glClearBufferuiv = (buffer, drawbuffer, value) => {
  GLctx.clearBufferuiv(buffer, drawbuffer, (growMemViews(), HEAPU32), ((value) >> 2));
};

var _emscripten_glClearColor = (x0, x1, x2, x3) => GLctx.clearColor(x0, x1, x2, x3);

var _emscripten_glClearDepthf = x0 => GLctx.clearDepth(x0);

var _emscripten_glClearStencil = x0 => GLctx.clearStencil(x0);

var _emscripten_glClientWaitSync = (sync, flags, timeout) => {
  // WebGL2 vs GLES3 differences: in GLES3, the timeout parameter is a uint64, where 0xFFFFFFFFFFFFFFFFULL means GL_TIMEOUT_IGNORED.
  // In JS, there's no 64-bit value types, so instead timeout is taken to be signed, and GL_TIMEOUT_IGNORED is given value -1.
  // Inherently the value accepted in the timeout is lossy, and can't take in arbitrary u64 bit pattern (but most likely doesn't matter)
  // See https://www.khronos.org/registry/webgl/specs/latest/2.0/#5.15
  timeout = Number(timeout);
  return GLctx.clientWaitSync(GL.syncs[sync], flags, timeout);
};

var _emscripten_glClipControlEXT = (origin, depth) => {
  GLctx.extClipControl["clipControlEXT"](origin, depth);
};

var _emscripten_glColorMask = (red, green, blue, alpha) => {
  GLctx.colorMask(!!red, !!green, !!blue, !!alpha);
};

var _emscripten_glCompileShader = shader => {
  GLctx.compileShader(GL.shaders[shader]);
};

var _emscripten_glCompressedTexImage2D = (target, level, internalFormat, width, height, border, imageSize, data) => {
  // `data` may be null here, which means "allocate uninitialized space but
  // don't upload" in GLES parlance, but `compressedTexImage2D` requires the
  // final data parameter, so we simply pass a heap view starting at zero
  // effectively uploading whatever happens to be near address zero.  See
  // https://github.com/emscripten-core/emscripten/issues/19300.
  if (GL.currentContext.version >= 2) {
    if (GLctx.currentPixelUnpackBufferBinding || !imageSize) {
      GLctx.compressedTexImage2D(target, level, internalFormat, width, height, border, imageSize, data);
      return;
    }
    GLctx.compressedTexImage2D(target, level, internalFormat, width, height, border, (growMemViews(), 
    HEAPU8), data, imageSize);
    return;
  }
  GLctx.compressedTexImage2D(target, level, internalFormat, width, height, border, (growMemViews(), 
  HEAPU8).subarray((data), data + imageSize));
};

var _emscripten_glCompressedTexImage3D = (target, level, internalFormat, width, height, depth, border, imageSize, data) => {
  if (GLctx.currentPixelUnpackBufferBinding) {
    GLctx.compressedTexImage3D(target, level, internalFormat, width, height, depth, border, imageSize, data);
  } else {
    GLctx.compressedTexImage3D(target, level, internalFormat, width, height, depth, border, (growMemViews(), 
    HEAPU8), data, imageSize);
  }
};

var _emscripten_glCompressedTexSubImage2D = (target, level, xoffset, yoffset, width, height, format, imageSize, data) => {
  if (GL.currentContext.version >= 2) {
    if (GLctx.currentPixelUnpackBufferBinding || !imageSize) {
      GLctx.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, data);
      return;
    }
    GLctx.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, (growMemViews(), 
    HEAPU8), data, imageSize);
    return;
  }
  GLctx.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, (growMemViews(), 
  HEAPU8).subarray((data), data + imageSize));
};

var _emscripten_glCompressedTexSubImage3D = (target, level, xoffset, yoffset, zoffset, width, height, depth, format, imageSize, data) => {
  if (GLctx.currentPixelUnpackBufferBinding) {
    GLctx.compressedTexSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, imageSize, data);
  } else {
    GLctx.compressedTexSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, (growMemViews(), 
    HEAPU8), data, imageSize);
  }
};

var _emscripten_glCopyBufferSubData = (x0, x1, x2, x3, x4) => GLctx.copyBufferSubData(x0, x1, x2, x3, x4);

var _emscripten_glCopyTexImage2D = (x0, x1, x2, x3, x4, x5, x6, x7) => GLctx.copyTexImage2D(x0, x1, x2, x3, x4, x5, x6, x7);

var _emscripten_glCopyTexSubImage2D = (x0, x1, x2, x3, x4, x5, x6, x7) => GLctx.copyTexSubImage2D(x0, x1, x2, x3, x4, x5, x6, x7);

var _emscripten_glCopyTexSubImage3D = (x0, x1, x2, x3, x4, x5, x6, x7, x8) => GLctx.copyTexSubImage3D(x0, x1, x2, x3, x4, x5, x6, x7, x8);

var _emscripten_glCreateProgram = () => {
  var id = GL.getNewId(GL.programs);
  var program = GLctx.createProgram();
  // Store additional information needed for each shader program:
  program.name = id;
  // Lazy cache results of
  // glGetProgramiv(GL_ACTIVE_UNIFORM_MAX_LENGTH/GL_ACTIVE_ATTRIBUTE_MAX_LENGTH/GL_ACTIVE_UNIFORM_BLOCK_MAX_NAME_LENGTH)
  program.maxUniformLength = program.maxAttributeLength = program.maxUniformBlockNameLength = 0;
  program.uniformIdCounter = 1;
  GL.programs[id] = program;
  return id;
};

var _emscripten_glCreateShader = shaderType => {
  var id = GL.getNewId(GL.shaders);
  GL.shaders[id] = GLctx.createShader(shaderType);
  return id;
};

var _emscripten_glCullFace = x0 => GLctx.cullFace(x0);

var _emscripten_glDeleteBuffers = (n, buffers) => {
  for (var i = 0; i < n; i++) {
    var id = (growMemViews(), HEAP32)[(((buffers) + (i * 4)) >> 2)];
    var buffer = GL.buffers[id];
    // From spec: "glDeleteBuffers silently ignores 0's and names that do not
    // correspond to existing buffer objects."
    if (!buffer) continue;
    GLctx.deleteBuffer(buffer);
    buffer.name = 0;
    GL.buffers[id] = null;
    if (id == GLctx.currentArrayBufferBinding) GLctx.currentArrayBufferBinding = 0;
    if (id == GLctx.currentElementArrayBufferBinding) GLctx.currentElementArrayBufferBinding = 0;
    if (id == GLctx.currentPixelPackBufferBinding) GLctx.currentPixelPackBufferBinding = 0;
    if (id == GLctx.currentPixelUnpackBufferBinding) GLctx.currentPixelUnpackBufferBinding = 0;
  }
};

var _emscripten_glDeleteFramebuffers = (n, framebuffers) => {
  for (var i = 0; i < n; ++i) {
    var id = (growMemViews(), HEAP32)[(((framebuffers) + (i * 4)) >> 2)];
    var framebuffer = GL.framebuffers[id];
    if (!framebuffer) continue;
    // GL spec: "glDeleteFramebuffers silently ignores 0s and names that do not correspond to existing framebuffer objects".
    GLctx.deleteFramebuffer(framebuffer);
    framebuffer.name = 0;
    GL.framebuffers[id] = null;
  }
};

var _emscripten_glDeleteProgram = id => {
  if (!id) return;
  var program = GL.programs[id];
  if (!program) {
    // glDeleteProgram actually signals an error when deleting a nonexisting
    // object, unlike some other GL delete functions.
    GL.recordError(1281);
    return;
  }
  GLctx.deleteProgram(program);
  program.name = 0;
  GL.programs[id] = null;
};

var _emscripten_glDeleteQueries = (n, ids) => {
  for (var i = 0; i < n; i++) {
    var id = (growMemViews(), HEAP32)[(((ids) + (i * 4)) >> 2)];
    var query = GL.queries[id];
    if (!query) continue;
    // GL spec: "unused names in ids are ignored, as is the name zero."
    GLctx.deleteQuery(query);
    GL.queries[id] = null;
  }
};

var _emscripten_glDeleteQueriesEXT = (n, ids) => {
  for (var i = 0; i < n; i++) {
    var id = (growMemViews(), HEAP32)[(((ids) + (i * 4)) >> 2)];
    var query = GL.queries[id];
    if (!query) continue;
    // GL spec: "unused names in ids are ignored, as is the name zero."
    GLctx.disjointTimerQueryExt["deleteQueryEXT"](query);
    GL.queries[id] = null;
  }
};

var _emscripten_glDeleteRenderbuffers = (n, renderbuffers) => {
  for (var i = 0; i < n; i++) {
    var id = (growMemViews(), HEAP32)[(((renderbuffers) + (i * 4)) >> 2)];
    var renderbuffer = GL.renderbuffers[id];
    if (!renderbuffer) continue;
    // GL spec: "glDeleteRenderbuffers silently ignores 0s and names that do not correspond to existing renderbuffer objects".
    GLctx.deleteRenderbuffer(renderbuffer);
    renderbuffer.name = 0;
    GL.renderbuffers[id] = null;
  }
};

var _emscripten_glDeleteSamplers = (n, samplers) => {
  for (var i = 0; i < n; i++) {
    var id = (growMemViews(), HEAP32)[(((samplers) + (i * 4)) >> 2)];
    var sampler = GL.samplers[id];
    if (!sampler) continue;
    GLctx.deleteSampler(sampler);
    sampler.name = 0;
    GL.samplers[id] = null;
  }
};

var _emscripten_glDeleteShader = id => {
  if (!id) return;
  var shader = GL.shaders[id];
  if (!shader) {
    // glDeleteShader actually signals an error when deleting a nonexisting
    // object, unlike some other GL delete functions.
    GL.recordError(1281);
    return;
  }
  GLctx.deleteShader(shader);
  GL.shaders[id] = null;
};

var _emscripten_glDeleteSync = id => {
  if (!id) return;
  var sync = GL.syncs[id];
  if (!sync) {
    // glDeleteSync signals an error when deleting a nonexisting object, unlike some other GL delete functions.
    GL.recordError(1281);
    return;
  }
  GLctx.deleteSync(sync);
  sync.name = 0;
  GL.syncs[id] = null;
};

var _emscripten_glDeleteTextures = (n, textures) => {
  for (var i = 0; i < n; i++) {
    var id = (growMemViews(), HEAP32)[(((textures) + (i * 4)) >> 2)];
    var texture = GL.textures[id];
    // GL spec: "glDeleteTextures silently ignores 0s and names that do not
    // correspond to existing textures".
    if (!texture) continue;
    GLctx.deleteTexture(texture);
    texture.name = 0;
    GL.textures[id] = null;
  }
};

var _emscripten_glDeleteTransformFeedbacks = (n, ids) => {
  for (var i = 0; i < n; i++) {
    var id = (growMemViews(), HEAP32)[(((ids) + (i * 4)) >> 2)];
    var transformFeedback = GL.transformFeedbacks[id];
    if (!transformFeedback) continue;
    // GL spec: "unused names in ids are ignored, as is the name zero."
    GLctx.deleteTransformFeedback(transformFeedback);
    transformFeedback.name = 0;
    GL.transformFeedbacks[id] = null;
  }
};

var _emscripten_glDeleteVertexArrays = (n, vaos) => {
  for (var i = 0; i < n; i++) {
    var id = (growMemViews(), HEAP32)[(((vaos) + (i * 4)) >> 2)];
    GLctx.deleteVertexArray(GL.vaos[id]);
    GL.vaos[id] = null;
  }
};

var _glDeleteVertexArrays = _emscripten_glDeleteVertexArrays;

var _emscripten_glDeleteVertexArraysOES = _glDeleteVertexArrays;

var _emscripten_glDepthFunc = x0 => GLctx.depthFunc(x0);

var _emscripten_glDepthMask = flag => {
  GLctx.depthMask(!!flag);
};

var _emscripten_glDepthRangef = (x0, x1) => GLctx.depthRange(x0, x1);

var _emscripten_glDetachShader = (program, shader) => {
  GLctx.detachShader(GL.programs[program], GL.shaders[shader]);
};

var _emscripten_glDisable = x0 => GLctx.disable(x0);

var _emscripten_glDisableVertexAttribArray = index => {
  var cb = GL.currentContext.clientBuffers[index];
  cb.enabled = false;
  GLctx.disableVertexAttribArray(index);
};

var _emscripten_glDrawArrays = (mode, first, count) => {
  // bind any client-side buffers
  GL.preDrawHandleClientVertexAttribBindings(first + count);
  GLctx.drawArrays(mode, first, count);
  GL.postDrawHandleClientVertexAttribBindings();
};

var _emscripten_glDrawArraysInstanced = (mode, first, count, primcount) => {
  GLctx.drawArraysInstanced(mode, first, count, primcount);
};

var _glDrawArraysInstanced = _emscripten_glDrawArraysInstanced;

var _emscripten_glDrawArraysInstancedANGLE = _glDrawArraysInstanced;

var _emscripten_glDrawArraysInstancedARB = _glDrawArraysInstanced;

var _emscripten_glDrawArraysInstancedEXT = _glDrawArraysInstanced;

var _emscripten_glDrawArraysInstancedNV = _glDrawArraysInstanced;

var tempFixedLengthArray = [];

var _emscripten_glDrawBuffers = (n, bufs) => {
  var bufArray = tempFixedLengthArray[n];
  for (var i = 0; i < n; i++) {
    bufArray[i] = (growMemViews(), HEAP32)[(((bufs) + (i * 4)) >> 2)];
  }
  GLctx.drawBuffers(bufArray);
};

var _glDrawBuffers = _emscripten_glDrawBuffers;

var _emscripten_glDrawBuffersEXT = _glDrawBuffers;

var _emscripten_glDrawBuffersWEBGL = _glDrawBuffers;

var _emscripten_glDrawElements = (mode, count, type, indices) => {
  var buf;
  var vertexes = 0;
  if (!GLctx.currentElementArrayBufferBinding) {
    var size = GL.calcBufLength(1, type, 0, count);
    buf = GL.getTempIndexBuffer(size);
    GLctx.bindBuffer(34963, buf);
    GLctx.bufferSubData(34963, 0, (growMemViews(), HEAPU8).subarray(indices, indices + size));
    // Calculating vertex count if shader's attribute data is on client side
    if (count > 0) {
      for (var i = 0; i < GL.currentContext.maxVertexAttribs; ++i) {
        var cb = GL.currentContext.clientBuffers[i];
        if (cb.clientside && cb.enabled) {
          let arrayClass;
          switch (type) {
           case 5121:
            arrayClass = Uint8Array;
            break;

           case 5123:
            arrayClass = Uint16Array;
            break;

           case 5125:
            arrayClass = Uint32Array;
            break;

           default:
            GL.recordError(1282);
            return;
          }
          vertexes = new arrayClass((growMemViews(), HEAPU8).buffer, indices, count).reduce((max, current) => Math.max(max, current)) + 1;
          break;
        }
      }
    }
    // the index is now 0
    indices = 0;
  }
  // bind any client-side buffers
  GL.preDrawHandleClientVertexAttribBindings(vertexes);
  GLctx.drawElements(mode, count, type, indices);
  GL.postDrawHandleClientVertexAttribBindings(count);
  if (!GLctx.currentElementArrayBufferBinding) {
    GLctx.bindBuffer(34963, null);
  }
};

var _emscripten_glDrawElementsInstanced = (mode, count, type, indices, primcount) => {
  GLctx.drawElementsInstanced(mode, count, type, indices, primcount);
};

var _glDrawElementsInstanced = _emscripten_glDrawElementsInstanced;

var _emscripten_glDrawElementsInstancedANGLE = _glDrawElementsInstanced;

var _emscripten_glDrawElementsInstancedARB = _glDrawElementsInstanced;

var _emscripten_glDrawElementsInstancedEXT = _glDrawElementsInstanced;

var _emscripten_glDrawElementsInstancedNV = _glDrawElementsInstanced;

var _glDrawElements = _emscripten_glDrawElements;

var _emscripten_glDrawRangeElements = (mode, start, end, count, type, indices) => {
  // TODO: This should be a trivial pass-through function registered at the bottom of this page as
  // glFuncs[6][1] += ' drawRangeElements';
  // but due to https://bugzil.la/1202427,
  // we work around by ignoring the range.
  _glDrawElements(mode, count, type, indices);
};

var _emscripten_glEnable = x0 => GLctx.enable(x0);

var _emscripten_glEnableVertexAttribArray = index => {
  var cb = GL.currentContext.clientBuffers[index];
  cb.enabled = true;
  GLctx.enableVertexAttribArray(index);
};

var _emscripten_glEndQuery = x0 => GLctx.endQuery(x0);

var _emscripten_glEndQueryEXT = target => {
  GLctx.disjointTimerQueryExt["endQueryEXT"](target);
};

var _emscripten_glEndTransformFeedback = () => GLctx.endTransformFeedback();

var _emscripten_glFenceSync = (condition, flags) => {
  var sync = GLctx.fenceSync(condition, flags);
  if (sync) {
    var id = GL.getNewId(GL.syncs);
    sync.name = id;
    GL.syncs[id] = sync;
    return id;
  }
  return 0;
};

var _emscripten_glFinish = () => GLctx.finish();

var _emscripten_glFlush = () => GLctx.flush();

var emscriptenWebGLGetBufferBinding = target => {
  switch (target) {
   case 34962:
    target = 34964;
    break;

   case 34963:
    target = 34965;
    break;

   case 35051:
    target = 35053;
    break;

   case 35052:
    target = 35055;
    break;

   case 35982:
    target = 35983;
    break;

   case 36662:
    target = 36662;
    break;

   case 36663:
    target = 36663;
    break;

   case 35345:
    target = 35368;
    break;
  }
  var buffer = GLctx.getParameter(target);
  if (buffer) return buffer.name | 0; else return 0;
};

var emscriptenWebGLValidateMapBufferTarget = target => {
  switch (target) {
   case 34962:
   // GL_ARRAY_BUFFER
    case 34963:
   // GL_ELEMENT_ARRAY_BUFFER
    case 36662:
   // GL_COPY_READ_BUFFER
    case 36663:
   // GL_COPY_WRITE_BUFFER
    case 35051:
   // GL_PIXEL_PACK_BUFFER
    case 35052:
   // GL_PIXEL_UNPACK_BUFFER
    case 35882:
   // GL_TEXTURE_BUFFER
    case 35982:
   // GL_TRANSFORM_FEEDBACK_BUFFER
    case 35345:
    // GL_UNIFORM_BUFFER
    return true;

   default:
    return false;
  }
};

var _emscripten_glFlushMappedBufferRange = (target, offset, length) => {
  if (!emscriptenWebGLValidateMapBufferTarget(target)) {
    GL.recordError(1280);
    err("GL_INVALID_ENUM in glFlushMappedBufferRange");
    return;
  }
  var mapping = GL.mappedBuffers[emscriptenWebGLGetBufferBinding(target)];
  if (!mapping) {
    GL.recordError(1282);
    err("buffer was never mapped in glFlushMappedBufferRange");
    return;
  }
  if (!(mapping.access & 16)) {
    GL.recordError(1282);
    err("buffer was not mapped with GL_MAP_FLUSH_EXPLICIT_BIT in glFlushMappedBufferRange");
    return;
  }
  if (offset < 0 || length < 0 || offset + length > mapping.length) {
    GL.recordError(1281);
    err("invalid range in glFlushMappedBufferRange");
    return;
  }
  GLctx.bufferSubData(target, mapping.offset, (growMemViews(), HEAPU8).subarray(mapping.mem + offset, mapping.mem + offset + length));
};

var _emscripten_glFramebufferRenderbuffer = (target, attachment, renderbuffertarget, renderbuffer) => {
  GLctx.framebufferRenderbuffer(target, attachment, renderbuffertarget, GL.renderbuffers[renderbuffer]);
};

var _emscripten_glFramebufferTexture2D = (target, attachment, textarget, texture, level) => {
  GLctx.framebufferTexture2D(target, attachment, textarget, GL.textures[texture], level);
};

var _emscripten_glFramebufferTextureLayer = (target, attachment, texture, level, layer) => {
  GLctx.framebufferTextureLayer(target, attachment, GL.textures[texture], level, layer);
};

var _emscripten_glFrontFace = x0 => GLctx.frontFace(x0);

var _emscripten_glGenBuffers = (n, buffers) => {
  GL.genObject(n, buffers, "createBuffer", GL.buffers);
};

var _emscripten_glGenFramebuffers = (n, ids) => {
  GL.genObject(n, ids, "createFramebuffer", GL.framebuffers);
};

var _emscripten_glGenQueries = (n, ids) => {
  GL.genObject(n, ids, "createQuery", GL.queries);
};

var _emscripten_glGenQueriesEXT = (n, ids) => {
  for (var i = 0; i < n; i++) {
    var query = GLctx.disjointTimerQueryExt["createQueryEXT"]();
    if (!query) {
      GL.recordError(1282);
      while (i < n) (growMemViews(), HEAP32)[(((ids) + (i++ * 4)) >> 2)] = 0;
      return;
    }
    var id = GL.getNewId(GL.queries);
    query.name = id;
    GL.queries[id] = query;
    (growMemViews(), HEAP32)[(((ids) + (i * 4)) >> 2)] = id;
  }
};

var _emscripten_glGenRenderbuffers = (n, renderbuffers) => {
  GL.genObject(n, renderbuffers, "createRenderbuffer", GL.renderbuffers);
};

var _emscripten_glGenSamplers = (n, samplers) => {
  GL.genObject(n, samplers, "createSampler", GL.samplers);
};

var _emscripten_glGenTextures = (n, textures) => {
  GL.genObject(n, textures, "createTexture", GL.textures);
};

var _emscripten_glGenTransformFeedbacks = (n, ids) => {
  GL.genObject(n, ids, "createTransformFeedback", GL.transformFeedbacks);
};

var _emscripten_glGenVertexArrays = (n, arrays) => {
  GL.genObject(n, arrays, "createVertexArray", GL.vaos);
};

var _glGenVertexArrays = _emscripten_glGenVertexArrays;

var _emscripten_glGenVertexArraysOES = _glGenVertexArrays;

var _emscripten_glGenerateMipmap = x0 => GLctx.generateMipmap(x0);

var __glGetActiveAttribOrUniform = (funcName, program, index, bufSize, length, size, type, name) => {
  program = GL.programs[program];
  var info = GLctx[funcName](program, index);
  if (info) {
    // If an error occurs, nothing will be written to length, size and type and name.
    var numBytesWrittenExclNull = name && stringToUTF8(info.name, name, bufSize);
    if (length) (growMemViews(), HEAP32)[((length) >> 2)] = numBytesWrittenExclNull;
    if (size) (growMemViews(), HEAP32)[((size) >> 2)] = info.size;
    if (type) (growMemViews(), HEAP32)[((type) >> 2)] = info.type;
  }
};

var _emscripten_glGetActiveAttrib = (program, index, bufSize, length, size, type, name) => __glGetActiveAttribOrUniform("getActiveAttrib", program, index, bufSize, length, size, type, name);

var _emscripten_glGetActiveUniform = (program, index, bufSize, length, size, type, name) => __glGetActiveAttribOrUniform("getActiveUniform", program, index, bufSize, length, size, type, name);

var _emscripten_glGetActiveUniformBlockName = (program, uniformBlockIndex, bufSize, length, uniformBlockName) => {
  program = GL.programs[program];
  var result = GLctx.getActiveUniformBlockName(program, uniformBlockIndex);
  if (!result) return;
  // If an error occurs, nothing will be written to uniformBlockName or length.
  if (uniformBlockName && bufSize > 0) {
    var numBytesWrittenExclNull = stringToUTF8(result, uniformBlockName, bufSize);
    if (length) (growMemViews(), HEAP32)[((length) >> 2)] = numBytesWrittenExclNull;
  } else {
    if (length) (growMemViews(), HEAP32)[((length) >> 2)] = 0;
  }
};

var _emscripten_glGetActiveUniformBlockiv = (program, uniformBlockIndex, pname, params) => {
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if params == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  program = GL.programs[program];
  if (pname == 35393) {
    var name = GLctx.getActiveUniformBlockName(program, uniformBlockIndex);
    (growMemViews(), HEAP32)[((params) >> 2)] = name.length + 1;
    return;
  }
  var result = GLctx.getActiveUniformBlockParameter(program, uniformBlockIndex, pname);
  if (result === null) return;
  // If an error occurs, nothing should be written to params.
  if (pname == 35395) {
    for (var i = 0; i < result.length; i++) {
      (growMemViews(), HEAP32)[(((params) + (i * 4)) >> 2)] = result[i];
    }
  } else {
    (growMemViews(), HEAP32)[((params) >> 2)] = result;
  }
};

var _emscripten_glGetActiveUniformsiv = (program, uniformCount, uniformIndices, pname, params) => {
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if params == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  if (uniformCount > 0 && uniformIndices == 0) {
    GL.recordError(1281);
    return;
  }
  program = GL.programs[program];
  var ids = [];
  for (var i = 0; i < uniformCount; i++) {
    ids.push((growMemViews(), HEAP32)[(((uniformIndices) + (i * 4)) >> 2)]);
  }
  var result = GLctx.getActiveUniforms(program, ids, pname);
  if (!result) return;
  // GL spec: If an error is generated, nothing is written out to params.
  var len = result.length;
  for (var i = 0; i < len; i++) {
    (growMemViews(), HEAP32)[(((params) + (i * 4)) >> 2)] = result[i];
  }
};

var _emscripten_glGetAttachedShaders = (program, maxCount, count, shaders) => {
  var result = GLctx.getAttachedShaders(GL.programs[program]);
  var len = result.length;
  if (len > maxCount) {
    len = maxCount;
  }
  (growMemViews(), HEAP32)[((count) >> 2)] = len;
  for (var i = 0; i < len; ++i) {
    var id = GL.shaders.indexOf(result[i]);
    (growMemViews(), HEAP32)[(((shaders) + (i * 4)) >> 2)] = id;
  }
};

var _emscripten_glGetAttribLocation = (program, name) => GLctx.getAttribLocation(GL.programs[program], UTF8ToString(name));

var writeI53ToI64 = (ptr, num) => {
  (growMemViews(), HEAPU32)[((ptr) >> 2)] = num;
  var lower = (growMemViews(), HEAPU32)[((ptr) >> 2)];
  (growMemViews(), HEAPU32)[(((ptr) + (4)) >> 2)] = (num - lower) / 4294967296;
};

var webglGetExtensions = () => {
  var exts = getEmscriptenSupportedExtensions(GLctx);
  exts = exts.concat(exts.map(e => "GL_" + e));
  return exts;
};

var emscriptenWebGLGet = (name_, p, type) => {
  // Guard against user passing a null pointer.
  // Note that GLES2 spec does not say anything about how passing a null
  // pointer should be treated.  Testing on desktop core GL 3, the application
  // crashes on glGetIntegerv to a null pointer, but better to report an error
  // instead of doing anything random.
  if (!p) {
    GL.recordError(1281);
    return;
  }
  var ret = undefined;
  switch (name_) {
   // Handle a few trivial GLES values
    case 36346:
    // GL_SHADER_COMPILER
    ret = 1;
    break;

   case 36344:
    // GL_SHADER_BINARY_FORMATS
    if (type != 0 && type != 1) {
      GL.recordError(1280);
    }
    // Do not write anything to the out pointer, since no binary formats are
    // supported.
    return;

   case 34814:
   // GL_NUM_PROGRAM_BINARY_FORMATS
    case 36345:
    // GL_NUM_SHADER_BINARY_FORMATS
    ret = 0;
    break;

   case 34466:
    // GL_NUM_COMPRESSED_TEXTURE_FORMATS
    // WebGL doesn't have GL_NUM_COMPRESSED_TEXTURE_FORMATS (it's obsolete
    // since GL_COMPRESSED_TEXTURE_FORMATS returns a JS array that can be
    // queried for length), so implement it ourselves to allow C++ GLES2
    // code to get the length.
    var formats = GLctx.getParameter(34467);
    ret = formats ? formats.length : 0;
    break;

   case 33309:
    // GL_NUM_EXTENSIONS
    if (GL.currentContext.version < 2) {
      // Calling GLES3/WebGL2 function with a GLES2/WebGL1 context
      GL.recordError(1282);
      return;
    }
    ret = webglGetExtensions().length;
    break;

   case 33307:
   // GL_MAJOR_VERSION
    case 33308:
    // GL_MINOR_VERSION
    if (GL.currentContext.version < 2) {
      GL.recordError(1280);
      // GL_INVALID_ENUM
      return;
    }
    ret = name_ == 33307 ? 3 : 0;
    // return version 3.0
    break;
  }
  if (ret === undefined) {
    var result = GLctx.getParameter(name_);
    switch (typeof result) {
     case "number":
      ret = result;
      break;

     case "boolean":
      ret = result ? 1 : 0;
      break;

     case "string":
      GL.recordError(1280);
      // GL_INVALID_ENUM
      return;

     case "object":
      if (result === null) {
        // null is a valid result for some (e.g., which buffer is bound -
        // perhaps nothing is bound), but otherwise can mean an invalid
        // name_, which we need to report as an error
        switch (name_) {
         case 34964:
         // ARRAY_BUFFER_BINDING
          case 35725:
         // CURRENT_PROGRAM
          case 34965:
         // ELEMENT_ARRAY_BUFFER_BINDING
          case 36006:
         // FRAMEBUFFER_BINDING or DRAW_FRAMEBUFFER_BINDING
          case 36007:
         // RENDERBUFFER_BINDING
          case 32873:
         // TEXTURE_BINDING_2D
          case 34229:
         // WebGL 2 GL_VERTEX_ARRAY_BINDING, or WebGL 1 extension OES_vertex_array_object GL_VERTEX_ARRAY_BINDING_OES
          case 36662:
         // COPY_READ_BUFFER_BINDING or COPY_READ_BUFFER
          case 36663:
         // COPY_WRITE_BUFFER_BINDING or COPY_WRITE_BUFFER
          case 35053:
         // PIXEL_PACK_BUFFER_BINDING
          case 35055:
         // PIXEL_UNPACK_BUFFER_BINDING
          case 36010:
         // READ_FRAMEBUFFER_BINDING
          case 35097:
         // SAMPLER_BINDING
          case 35869:
         // TEXTURE_BINDING_2D_ARRAY
          case 32874:
         // TEXTURE_BINDING_3D
          case 36389:
         // TRANSFORM_FEEDBACK_BINDING
          case 35983:
         // TRANSFORM_FEEDBACK_BUFFER_BINDING
          case 35368:
         // UNIFORM_BUFFER_BINDING
          case 34068:
          {
            // TEXTURE_BINDING_CUBE_MAP
            ret = 0;
            break;
          }

         default:
          {
            GL.recordError(1280);
            // GL_INVALID_ENUM
            return;
          }
        }
      } else if (result instanceof Float32Array || result instanceof Uint32Array || result instanceof Int32Array || result instanceof Array) {
        for (var i = 0; i < result.length; ++i) {
          switch (type) {
           case 0:
            (growMemViews(), HEAP32)[(((p) + (i * 4)) >> 2)] = result[i];
            break;

           case 2:
            (growMemViews(), HEAPF32)[(((p) + (i * 4)) >> 2)] = result[i];
            break;

           case 4:
            (growMemViews(), HEAP8)[(p) + (i)] = result[i] ? 1 : 0;
            break;
          }
        }
        return;
      } else {
        try {
          ret = result.name | 0;
        } catch (e) {
          GL.recordError(1280);
          // GL_INVALID_ENUM
          err(`GL_INVALID_ENUM in glGet${type}v: Unknown object returned from WebGL getParameter(${name_})! (error: ${e})`);
          return;
        }
      }
      break;

     default:
      GL.recordError(1280);
      // GL_INVALID_ENUM
      err(`GL_INVALID_ENUM in glGet${type}v: Native code calling glGet${type}v(${name_}) and it returns ${result} of type ${typeof (result)}!`);
      return;
    }
  }
  switch (type) {
   case 1:
    writeI53ToI64(p, ret);
    break;

   case 0:
    (growMemViews(), HEAP32)[((p) >> 2)] = ret;
    break;

   case 2:
    (growMemViews(), HEAPF32)[((p) >> 2)] = ret;
    break;

   case 4:
    (growMemViews(), HEAP8)[p] = ret ? 1 : 0;
    break;
  }
};

var _emscripten_glGetBooleanv = (name_, p) => emscriptenWebGLGet(name_, p, 4);

var _emscripten_glGetBufferParameteri64v = (target, value, data) => {
  if (!data) {
    // GLES2 specification does not specify how to behave if data is a null pointer. Since calling this function does not make sense
    // if data == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  writeI53ToI64(data, GLctx.getBufferParameter(target, value));
};

var _emscripten_glGetBufferParameteriv = (target, value, data) => {
  if (!data) {
    // GLES2 specification does not specify how to behave if data is a null
    // pointer. Since calling this function does not make sense if data ==
    // null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  (growMemViews(), HEAP32)[((data) >> 2)] = GLctx.getBufferParameter(target, value);
};

var _emscripten_glGetBufferPointerv = (target, pname, params) => {
  if (pname == 35005) {
    var ptr = 0;
    var mappedBuffer = GL.mappedBuffers[emscriptenWebGLGetBufferBinding(target)];
    if (mappedBuffer) {
      ptr = mappedBuffer.mem;
    }
    (growMemViews(), HEAP32)[((params) >> 2)] = ptr;
  } else {
    GL.recordError(1280);
    err("GL_INVALID_ENUM in glGetBufferPointerv");
  }
};

var _emscripten_glGetError = () => {
  var error = GLctx.getError() || GL.lastError;
  GL.lastError = 0;
  return error;
};

var _emscripten_glGetFloatv = (name_, p) => emscriptenWebGLGet(name_, p, 2);

var _emscripten_glGetFragDataLocation = (program, name) => GLctx.getFragDataLocation(GL.programs[program], UTF8ToString(name));

var _emscripten_glGetFramebufferAttachmentParameteriv = (target, attachment, pname, params) => {
  var result = GLctx.getFramebufferAttachmentParameter(target, attachment, pname);
  if (result instanceof WebGLRenderbuffer || result instanceof WebGLTexture) {
    result = result.name | 0;
  }
  (growMemViews(), HEAP32)[((params) >> 2)] = result;
};

var emscriptenWebGLGetIndexed = (target, index, data, type) => {
  if (!data) {
    // GLES2 specification does not specify how to behave if data is a null pointer. Since calling this function does not make sense
    // if data == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  var result = GLctx.getIndexedParameter(target, index);
  var ret;
  switch (typeof result) {
   case "boolean":
    ret = result ? 1 : 0;
    break;

   case "number":
    ret = result;
    break;

   case "object":
    if (result === null) {
      switch (target) {
       case 35983:
       // TRANSFORM_FEEDBACK_BUFFER_BINDING
        case 35368:
        // UNIFORM_BUFFER_BINDING
        ret = 0;
        break;

       default:
        {
          GL.recordError(1280);
          // GL_INVALID_ENUM
          return;
        }
      }
    } else if (result instanceof WebGLBuffer) {
      ret = result.name | 0;
    } else {
      GL.recordError(1280);
      // GL_INVALID_ENUM
      return;
    }
    break;

   default:
    GL.recordError(1280);
    // GL_INVALID_ENUM
    return;
  }
  switch (type) {
   case 1:
    writeI53ToI64(data, ret);
    break;

   case 0:
    (growMemViews(), HEAP32)[((data) >> 2)] = ret;
    break;

   case 2:
    (growMemViews(), HEAPF32)[((data) >> 2)] = ret;
    break;

   case 4:
    (growMemViews(), HEAP8)[data] = ret ? 1 : 0;
    break;

   default:
    abort("internal emscriptenWebGLGetIndexed() error, bad type: " + type);
  }
};

var _emscripten_glGetInteger64i_v = (target, index, data) => emscriptenWebGLGetIndexed(target, index, data, 1);

var _emscripten_glGetInteger64v = (name_, p) => {
  emscriptenWebGLGet(name_, p, 1);
};

var _emscripten_glGetIntegeri_v = (target, index, data) => emscriptenWebGLGetIndexed(target, index, data, 0);

var _emscripten_glGetIntegerv = (name_, p) => emscriptenWebGLGet(name_, p, 0);

var _emscripten_glGetInternalformativ = (target, internalformat, pname, bufSize, params) => {
  if (bufSize < 0) {
    GL.recordError(1281);
    return;
  }
  if (!params) {
    // GLES3 specification does not specify how to behave if values is a null pointer. Since calling this function does not make sense
    // if values == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  var ret = GLctx.getInternalformatParameter(target, internalformat, pname);
  if (ret === null) return;
  for (var i = 0; i < ret.length && i < bufSize; ++i) {
    (growMemViews(), HEAP32)[(((params) + (i * 4)) >> 2)] = ret[i];
  }
};

var _emscripten_glGetProgramBinary = (program, bufSize, length, binaryFormat, binary) => {
  GL.recordError(1282);
};

var _emscripten_glGetProgramInfoLog = (program, maxLength, length, infoLog) => {
  var log = GLctx.getProgramInfoLog(GL.programs[program]);
  if (log === null) log = "(unknown error)";
  var numBytesWrittenExclNull = (maxLength > 0 && infoLog) ? stringToUTF8(log, infoLog, maxLength) : 0;
  if (length) (growMemViews(), HEAP32)[((length) >> 2)] = numBytesWrittenExclNull;
};

var _emscripten_glGetProgramiv = (program, pname, p) => {
  if (!p) {
    // GLES2 specification does not specify how to behave if p is a null
    // pointer. Since calling this function does not make sense if p == null,
    // issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  if (program >= GL.counter) {
    GL.recordError(1281);
    return;
  }
  program = GL.programs[program];
  if (pname == 35716) {
    // GL_INFO_LOG_LENGTH
    var log = GLctx.getProgramInfoLog(program);
    if (log === null) log = "(unknown error)";
    (growMemViews(), HEAP32)[((p) >> 2)] = log.length + 1;
  } else if (pname == 35719) {
    if (!program.maxUniformLength) {
      var numActiveUniforms = GLctx.getProgramParameter(program, 35718);
      for (var i = 0; i < numActiveUniforms; ++i) {
        program.maxUniformLength = Math.max(program.maxUniformLength, GLctx.getActiveUniform(program, i).name.length + 1);
      }
    }
    (growMemViews(), HEAP32)[((p) >> 2)] = program.maxUniformLength;
  } else if (pname == 35722) {
    if (!program.maxAttributeLength) {
      var numActiveAttributes = GLctx.getProgramParameter(program, 35721);
      for (var i = 0; i < numActiveAttributes; ++i) {
        program.maxAttributeLength = Math.max(program.maxAttributeLength, GLctx.getActiveAttrib(program, i).name.length + 1);
      }
    }
    (growMemViews(), HEAP32)[((p) >> 2)] = program.maxAttributeLength;
  } else if (pname == 35381) {
    if (!program.maxUniformBlockNameLength) {
      var numActiveUniformBlocks = GLctx.getProgramParameter(program, 35382);
      for (var i = 0; i < numActiveUniformBlocks; ++i) {
        program.maxUniformBlockNameLength = Math.max(program.maxUniformBlockNameLength, GLctx.getActiveUniformBlockName(program, i).length + 1);
      }
    }
    (growMemViews(), HEAP32)[((p) >> 2)] = program.maxUniformBlockNameLength;
  } else {
    (growMemViews(), HEAP32)[((p) >> 2)] = GLctx.getProgramParameter(program, pname);
  }
};

var _emscripten_glGetQueryObjecti64vEXT = (id, pname, params) => {
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if p == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  var query = GL.queries[id];
  var param;
  if (GL.currentContext.version < 2) {
    param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname);
  } else {
    param = GLctx.getQueryParameter(query, pname);
  }
  var ret;
  if (typeof param == "boolean") {
    ret = param ? 1 : 0;
  } else {
    ret = param;
  }
  writeI53ToI64(params, ret);
};

var _emscripten_glGetQueryObjectivEXT = (id, pname, params) => {
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if p == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  var query = GL.queries[id];
  var param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname);
  var ret;
  if (typeof param == "boolean") {
    ret = param ? 1 : 0;
  } else {
    ret = param;
  }
  (growMemViews(), HEAP32)[((params) >> 2)] = ret;
};

var _glGetQueryObjecti64vEXT = _emscripten_glGetQueryObjecti64vEXT;

var _emscripten_glGetQueryObjectui64vEXT = _glGetQueryObjecti64vEXT;

var _emscripten_glGetQueryObjectuiv = (id, pname, params) => {
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if p == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  var query = GL.queries[id];
  var param = GLctx.getQueryParameter(query, pname);
  var ret;
  if (typeof param == "boolean") {
    ret = param ? 1 : 0;
  } else {
    ret = param;
  }
  (growMemViews(), HEAP32)[((params) >> 2)] = ret;
};

var _glGetQueryObjectivEXT = _emscripten_glGetQueryObjectivEXT;

var _emscripten_glGetQueryObjectuivEXT = _glGetQueryObjectivEXT;

var _emscripten_glGetQueryiv = (target, pname, params) => {
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if p == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  (growMemViews(), HEAP32)[((params) >> 2)] = GLctx.getQuery(target, pname);
};

var _emscripten_glGetQueryivEXT = (target, pname, params) => {
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if p == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  (growMemViews(), HEAP32)[((params) >> 2)] = GLctx.disjointTimerQueryExt["getQueryEXT"](target, pname);
};

var _emscripten_glGetRenderbufferParameteriv = (target, pname, params) => {
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if params == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  (growMemViews(), HEAP32)[((params) >> 2)] = GLctx.getRenderbufferParameter(target, pname);
};

var _emscripten_glGetSamplerParameterfv = (sampler, pname, params) => {
  if (!params) {
    // GLES3 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if p == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  (growMemViews(), HEAPF32)[((params) >> 2)] = GLctx.getSamplerParameter(GL.samplers[sampler], pname);
};

var _emscripten_glGetSamplerParameteriv = (sampler, pname, params) => {
  if (!params) {
    // GLES3 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if p == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  (growMemViews(), HEAP32)[((params) >> 2)] = GLctx.getSamplerParameter(GL.samplers[sampler], pname);
};

var _emscripten_glGetShaderInfoLog = (shader, maxLength, length, infoLog) => {
  var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
  if (log === null) log = "(unknown error)";
  var numBytesWrittenExclNull = (maxLength > 0 && infoLog) ? stringToUTF8(log, infoLog, maxLength) : 0;
  if (length) (growMemViews(), HEAP32)[((length) >> 2)] = numBytesWrittenExclNull;
};

var _emscripten_glGetShaderPrecisionFormat = (shaderType, precisionType, range, precision) => {
  var result = GLctx.getShaderPrecisionFormat(shaderType, precisionType);
  (growMemViews(), HEAP32)[((range) >> 2)] = result.rangeMin;
  (growMemViews(), HEAP32)[(((range) + (4)) >> 2)] = result.rangeMax;
  (growMemViews(), HEAP32)[((precision) >> 2)] = result.precision;
};

var _emscripten_glGetShaderSource = (shader, bufSize, length, source) => {
  var result = GLctx.getShaderSource(GL.shaders[shader]);
  if (!result) return;
  // If an error occurs, nothing will be written to length or source.
  var numBytesWrittenExclNull = (bufSize > 0 && source) ? stringToUTF8(result, source, bufSize) : 0;
  if (length) (growMemViews(), HEAP32)[((length) >> 2)] = numBytesWrittenExclNull;
};

var _emscripten_glGetShaderiv = (shader, pname, p) => {
  if (!p) {
    // GLES2 specification does not specify how to behave if p is a null
    // pointer. Since calling this function does not make sense if p == null,
    // issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  if (pname == 35716) {
    // GL_INFO_LOG_LENGTH
    var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
    if (log === null) log = "(unknown error)";
    // The GLES2 specification says that if the shader has an empty info log,
    // a value of 0 is returned. Otherwise the log has a null char appended.
    // (An empty string is falsey, so we can just check that instead of
    // looking at log.length.)
    var logLength = log ? log.length + 1 : 0;
    (growMemViews(), HEAP32)[((p) >> 2)] = logLength;
  } else if (pname == 35720) {
    // GL_SHADER_SOURCE_LENGTH
    var source = GLctx.getShaderSource(GL.shaders[shader]);
    // source may be a null, or the empty string, both of which are falsey
    // values that we report a 0 length for.
    var sourceLength = source ? source.length + 1 : 0;
    (growMemViews(), HEAP32)[((p) >> 2)] = sourceLength;
  } else {
    (growMemViews(), HEAP32)[((p) >> 2)] = GLctx.getShaderParameter(GL.shaders[shader], pname);
  }
};

var _emscripten_glGetString = name_ => {
  var ret = GL.stringCache[name_];
  if (!ret) {
    switch (name_) {
     case 7939:
      ret = stringToNewUTF8(webglGetExtensions().join(" "));
      break;

     case 7936:
     case 7937:
     case 37445:
     case 37446:
      var s = GLctx.getParameter(name_);
      if (!s) {
        GL.recordError(1280);
      }
      ret = s ? stringToNewUTF8(s) : 0;
      break;

     case 7938:
      var webGLVersion = GLctx.getParameter(7938);
      // return GLES version string corresponding to the version of the WebGL context
      var glVersion = `OpenGL ES 2.0 (${webGLVersion})`;
      if (GL.currentContext.version >= 2) glVersion = `OpenGL ES 3.0 (${webGLVersion})`;
      ret = stringToNewUTF8(glVersion);
      break;

     case 35724:
      var glslVersion = GLctx.getParameter(35724);
      // extract the version number 'N.M' from the string 'WebGL GLSL ES N.M ...'
      var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
      var ver_num = glslVersion.match(ver_re);
      if (ver_num !== null) {
        if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + "0";
        // ensure minor version has 2 digits
        glslVersion = `OpenGL ES GLSL ES ${ver_num[1]} (${glslVersion})`;
      }
      ret = stringToNewUTF8(glslVersion);
      break;

     default:
      GL.recordError(1280);
    }
    GL.stringCache[name_] = ret;
  }
  return ret;
};

var _emscripten_glGetStringi = (name, index) => {
  if (GL.currentContext.version < 2) {
    GL.recordError(1282);
    // Calling GLES3/WebGL2 function with a GLES2/WebGL1 context
    return 0;
  }
  var stringiCache = GL.stringiCache[name];
  if (stringiCache) {
    if (index < 0 || index >= stringiCache.length) {
      GL.recordError(1281);
      return 0;
    }
    return stringiCache[index];
  }
  switch (name) {
   case 7939:
    var exts = webglGetExtensions().map(stringToNewUTF8);
    stringiCache = GL.stringiCache[name] = exts;
    if (index < 0 || index >= stringiCache.length) {
      GL.recordError(1281);
      return 0;
    }
    return stringiCache[index];

   default:
    GL.recordError(1280);
    return 0;
  }
};

var _emscripten_glGetSynciv = (sync, pname, bufSize, length, values) => {
  if (bufSize < 0) {
    // GLES3 specification does not specify how to behave if bufSize < 0, however in the spec wording for glGetInternalformativ, it does say that GL_INVALID_VALUE should be raised,
    // so raise GL_INVALID_VALUE here as well.
    GL.recordError(1281);
    return;
  }
  if (!values) {
    // GLES3 specification does not specify how to behave if values is a null pointer. Since calling this function does not make sense
    // if values == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  var ret = GLctx.getSyncParameter(GL.syncs[sync], pname);
  if (ret !== null) {
    (growMemViews(), HEAP32)[((values) >> 2)] = ret;
    if (length) (growMemViews(), HEAP32)[((length) >> 2)] = 1;
  }
};

var _emscripten_glGetTexParameterfv = (target, pname, params) => {
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null
    // pointer. Since calling this function does not make sense if p == null,
    // issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  (growMemViews(), HEAPF32)[((params) >> 2)] = GLctx.getTexParameter(target, pname);
};

var _emscripten_glGetTexParameteriv = (target, pname, params) => {
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null
    // pointer. Since calling this function does not make sense if p == null,
    // issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  (growMemViews(), HEAP32)[((params) >> 2)] = GLctx.getTexParameter(target, pname);
};

var _emscripten_glGetTransformFeedbackVarying = (program, index, bufSize, length, size, type, name) => {
  program = GL.programs[program];
  var info = GLctx.getTransformFeedbackVarying(program, index);
  if (!info) return;
  // If an error occurred, the return parameters length, size, type and name will be unmodified.
  if (name && bufSize > 0) {
    var numBytesWrittenExclNull = stringToUTF8(info.name, name, bufSize);
    if (length) (growMemViews(), HEAP32)[((length) >> 2)] = numBytesWrittenExclNull;
  } else {
    if (length) (growMemViews(), HEAP32)[((length) >> 2)] = 0;
  }
  if (size) (growMemViews(), HEAP32)[((size) >> 2)] = info.size;
  if (type) (growMemViews(), HEAP32)[((type) >> 2)] = info.type;
};

var _emscripten_glGetUniformBlockIndex = (program, uniformBlockName) => GLctx.getUniformBlockIndex(GL.programs[program], UTF8ToString(uniformBlockName));

var _emscripten_glGetUniformIndices = (program, uniformCount, uniformNames, uniformIndices) => {
  if (!uniformIndices) {
    // GLES2 specification does not specify how to behave if uniformIndices is a null pointer. Since calling this function does not make sense
    // if uniformIndices == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  if (uniformCount > 0 && (uniformNames == 0 || uniformIndices == 0)) {
    GL.recordError(1281);
    return;
  }
  program = GL.programs[program];
  var names = [];
  for (var i = 0; i < uniformCount; i++) names.push(UTF8ToString((growMemViews(), 
  HEAPU32)[(((uniformNames) + (i * 4)) >> 2)]));
  var result = GLctx.getUniformIndices(program, names);
  if (!result) return;
  // GL spec: If an error is generated, nothing is written out to uniformIndices.
  var len = result.length;
  for (var i = 0; i < len; i++) {
    (growMemViews(), HEAP32)[(((uniformIndices) + (i * 4)) >> 2)] = result[i];
  }
};

/** @suppress {checkTypes} */ var jstoi_q = str => parseInt(str);

/** @noinline */ var webglGetLeftBracePos = name => name.slice(-1) == "]" && name.lastIndexOf("[");

var webglPrepareUniformLocationsBeforeFirstUse = program => {
  var uniformLocsById = program.uniformLocsById, // Maps GLuint -> WebGLUniformLocation
  uniformSizeAndIdsByName = program.uniformSizeAndIdsByName, // Maps name -> [uniform array length, GLuint]
  i, j;
  // On the first time invocation of glGetUniformLocation on this shader program:
  // initialize cache data structures and discover which uniforms are arrays.
  if (!uniformLocsById) {
    // maps GLint integer locations to WebGLUniformLocations
    program.uniformLocsById = uniformLocsById = {};
    // maps integer locations back to uniform name strings, so that we can lazily fetch uniform array locations
    program.uniformArrayNamesById = {};
    var numActiveUniforms = GLctx.getProgramParameter(program, 35718);
    for (i = 0; i < numActiveUniforms; ++i) {
      var u = GLctx.getActiveUniform(program, i);
      var nm = u.name;
      var sz = u.size;
      var lb = webglGetLeftBracePos(nm);
      var arrayName = lb > 0 ? nm.slice(0, lb) : nm;
      // Assign a new location.
      var id = program.uniformIdCounter;
      program.uniformIdCounter += sz;
      // Eagerly get the location of the uniformArray[0] base element.
      // The remaining indices >0 will be left for lazy evaluation to
      // improve performance. Those may never be needed to fetch, if the
      // application fills arrays always in full starting from the first
      // element of the array.
      uniformSizeAndIdsByName[arrayName] = [ sz, id ];
      // Store placeholder integers in place that highlight that these
      // >0 index locations are array indices pending population.
      for (j = 0; j < sz; ++j) {
        uniformLocsById[id] = j;
        program.uniformArrayNamesById[id++] = arrayName;
      }
    }
  }
};

var _emscripten_glGetUniformLocation = (program, name) => {
  name = UTF8ToString(name);
  if (program = GL.programs[program]) {
    webglPrepareUniformLocationsBeforeFirstUse(program);
    var uniformLocsById = program.uniformLocsById;
    // Maps GLuint -> WebGLUniformLocation
    var arrayIndex = 0;
    var uniformBaseName = name;
    // Invariant: when populating integer IDs for uniform locations, we must
    // maintain the precondition that arrays reside in contiguous addresses,
    // i.e. for a 'vec4 colors[10];', colors[4] must be at location
    // colors[0]+4.  However, user might call glGetUniformLocation(program,
    // "colors") for an array, so we cannot discover based on the user input
    // arguments whether the uniform we are dealing with is an array. The only
    // way to discover which uniforms are arrays is to enumerate over all the
    // active uniforms in the program.
    var leftBrace = webglGetLeftBracePos(name);
    // If user passed an array accessor "[index]", parse the array index off the accessor.
    if (leftBrace > 0) {
      arrayIndex = jstoi_q(name.slice(leftBrace + 1)) >>> 0;
      // "index]", coerce parseInt(']') with >>>0 to treat "foo[]" as "foo[0]" and foo[-1] as unsigned out-of-bounds.
      uniformBaseName = name.slice(0, leftBrace);
    }
    // Have we cached the location of this uniform before?
    // A pair [array length, GLint of the uniform location]
    var sizeAndId = program.uniformSizeAndIdsByName[uniformBaseName];
    // If a uniform with this name exists, and if its index is within the
    // array limits (if it's even an array), query the WebGLlocation, or
    // return an existing cached location.
    if (sizeAndId && arrayIndex < sizeAndId[0]) {
      arrayIndex += sizeAndId[1];
      // Add the base location of the uniform to the array index offset.
      if ((uniformLocsById[arrayIndex] = uniformLocsById[arrayIndex] || GLctx.getUniformLocation(program, name))) {
        return arrayIndex;
      }
    }
  } else {
    // N.b. we are currently unable to distinguish between GL program IDs that
    // never existed vs GL program IDs that have been deleted, so report
    // GL_INVALID_VALUE in both cases.
    GL.recordError(1281);
  }
  return -1;
};

var webglGetUniformLocation = location => {
  var p = GLctx.currentProgram;
  if (p) {
    var webglLoc = p.uniformLocsById[location];
    // p.uniformLocsById[location] stores either an integer, or a
    // WebGLUniformLocation.
    // If an integer, we have not yet bound the location, so do it now. The
    // integer value specifies the array index we should bind to.
    if (typeof webglLoc == "number") {
      p.uniformLocsById[location] = webglLoc = GLctx.getUniformLocation(p, p.uniformArrayNamesById[location] + (webglLoc > 0 ? `[${webglLoc}]` : ""));
    }
    // Else an already cached WebGLUniformLocation, return it.
    return webglLoc;
  } else {
    GL.recordError(1282);
  }
};

/** @suppress{checkTypes} */ var emscriptenWebGLGetUniform = (program, location, params, type) => {
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null
    // pointer. Since calling this function does not make sense if params ==
    // null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  program = GL.programs[program];
  webglPrepareUniformLocationsBeforeFirstUse(program);
  var data = GLctx.getUniform(program, webglGetUniformLocation(location));
  if (typeof data == "number" || typeof data == "boolean") {
    switch (type) {
     case 0:
      (growMemViews(), HEAP32)[((params) >> 2)] = data;
      break;

     case 2:
      (growMemViews(), HEAPF32)[((params) >> 2)] = data;
      break;
    }
  } else {
    for (var i = 0; i < data.length; i++) {
      switch (type) {
       case 0:
        (growMemViews(), HEAP32)[(((params) + (i * 4)) >> 2)] = data[i];
        break;

       case 2:
        (growMemViews(), HEAPF32)[(((params) + (i * 4)) >> 2)] = data[i];
        break;
      }
    }
  }
};

var _emscripten_glGetUniformfv = (program, location, params) => {
  emscriptenWebGLGetUniform(program, location, params, 2);
};

var _emscripten_glGetUniformiv = (program, location, params) => {
  emscriptenWebGLGetUniform(program, location, params, 0);
};

var _emscripten_glGetUniformuiv = (program, location, params) => emscriptenWebGLGetUniform(program, location, params, 0);

/** @suppress{checkTypes} */ var emscriptenWebGLGetVertexAttrib = (index, pname, params, type) => {
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null
    // pointer. Since calling this function does not make sense if params ==
    // null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  if (GL.currentContext.clientBuffers[index].enabled) {
    err("glGetVertexAttrib*v on client-side array: not supported, bad data returned");
  }
  var data = GLctx.getVertexAttrib(index, pname);
  if (pname == 34975) {
    (growMemViews(), HEAP32)[((params) >> 2)] = data && data["name"];
  } else if (typeof data == "number" || typeof data == "boolean") {
    switch (type) {
     case 0:
      (growMemViews(), HEAP32)[((params) >> 2)] = data;
      break;

     case 2:
      (growMemViews(), HEAPF32)[((params) >> 2)] = data;
      break;

     case 5:
      (growMemViews(), HEAP32)[((params) >> 2)] = Math.fround(data);
      break;
    }
  } else {
    for (var i = 0; i < data.length; i++) {
      switch (type) {
       case 0:
        (growMemViews(), HEAP32)[(((params) + (i * 4)) >> 2)] = data[i];
        break;

       case 2:
        (growMemViews(), HEAPF32)[(((params) + (i * 4)) >> 2)] = data[i];
        break;

       case 5:
        (growMemViews(), HEAP32)[(((params) + (i * 4)) >> 2)] = Math.fround(data[i]);
        break;
      }
    }
  }
};

var _emscripten_glGetVertexAttribIiv = (index, pname, params) => {
  // N.B. This function may only be called if the vertex attribute was specified using the function glVertexAttribI4iv(),
  // otherwise the results are undefined. (GLES3 spec 6.1.12)
  emscriptenWebGLGetVertexAttrib(index, pname, params, 0);
};

var _glGetVertexAttribIiv = _emscripten_glGetVertexAttribIiv;

var _emscripten_glGetVertexAttribIuiv = _glGetVertexAttribIiv;

var _emscripten_glGetVertexAttribPointerv = (index, pname, pointer) => {
  if (!pointer) {
    // GLES2 specification does not specify how to behave if pointer is a null
    // pointer. Since calling this function does not make sense if pointer ==
    // null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  if (GL.currentContext.clientBuffers[index].enabled) {
    err("glGetVertexAttribPointer on client-side array: not supported, bad data returned");
  }
  (growMemViews(), HEAP32)[((pointer) >> 2)] = GLctx.getVertexAttribOffset(index, pname);
};

var _emscripten_glGetVertexAttribfv = (index, pname, params) => {
  // N.B. This function may only be called if the vertex attribute was
  // specified using the function glVertexAttrib*f(), otherwise the results
  // are undefined. (GLES3 spec 6.1.12)
  emscriptenWebGLGetVertexAttrib(index, pname, params, 2);
};

var _emscripten_glGetVertexAttribiv = (index, pname, params) => {
  // N.B. This function may only be called if the vertex attribute was
  // specified using the function glVertexAttrib*f(), otherwise the results
  // are undefined. (GLES3 spec 6.1.12)
  emscriptenWebGLGetVertexAttrib(index, pname, params, 5);
};

var _emscripten_glHint = (x0, x1) => GLctx.hint(x0, x1);

var _emscripten_glInvalidateFramebuffer = (target, numAttachments, attachments) => {
  var list = tempFixedLengthArray[numAttachments];
  for (var i = 0; i < numAttachments; i++) {
    list[i] = (growMemViews(), HEAP32)[(((attachments) + (i * 4)) >> 2)];
  }
  GLctx.invalidateFramebuffer(target, list);
};

var _emscripten_glInvalidateSubFramebuffer = (target, numAttachments, attachments, x, y, width, height) => {
  var list = tempFixedLengthArray[numAttachments];
  for (var i = 0; i < numAttachments; i++) {
    list[i] = (growMemViews(), HEAP32)[(((attachments) + (i * 4)) >> 2)];
  }
  GLctx.invalidateSubFramebuffer(target, list, x, y, width, height);
};

var _emscripten_glIsBuffer = buffer => {
  var b = GL.buffers[buffer];
  if (!b) return 0;
  return GLctx.isBuffer(b);
};

var _emscripten_glIsEnabled = x0 => GLctx.isEnabled(x0);

var _emscripten_glIsFramebuffer = framebuffer => {
  var fb = GL.framebuffers[framebuffer];
  if (!fb) return 0;
  return GLctx.isFramebuffer(fb);
};

var _emscripten_glIsProgram = program => {
  program = GL.programs[program];
  if (!program) return 0;
  return GLctx.isProgram(program);
};

var _emscripten_glIsQuery = id => {
  var query = GL.queries[id];
  if (!query) return 0;
  return GLctx.isQuery(query);
};

var _emscripten_glIsQueryEXT = id => {
  var query = GL.queries[id];
  if (!query) return 0;
  return GLctx.disjointTimerQueryExt["isQueryEXT"](query);
};

var _emscripten_glIsRenderbuffer = renderbuffer => {
  var rb = GL.renderbuffers[renderbuffer];
  if (!rb) return 0;
  return GLctx.isRenderbuffer(rb);
};

var _emscripten_glIsSampler = id => {
  var sampler = GL.samplers[id];
  if (!sampler) return 0;
  return GLctx.isSampler(sampler);
};

var _emscripten_glIsShader = shader => {
  var s = GL.shaders[shader];
  if (!s) return 0;
  return GLctx.isShader(s);
};

var _emscripten_glIsSync = sync => GLctx.isSync(GL.syncs[sync]);

var _emscripten_glIsTexture = id => {
  var texture = GL.textures[id];
  if (!texture) return 0;
  return GLctx.isTexture(texture);
};

var _emscripten_glIsTransformFeedback = id => GLctx.isTransformFeedback(GL.transformFeedbacks[id]);

var _emscripten_glIsVertexArray = array => {
  var vao = GL.vaos[array];
  if (!vao) return 0;
  return GLctx.isVertexArray(vao);
};

var _glIsVertexArray = _emscripten_glIsVertexArray;

var _emscripten_glIsVertexArrayOES = _glIsVertexArray;

var _emscripten_glLineWidth = x0 => GLctx.lineWidth(x0);

var _emscripten_glLinkProgram = program => {
  program = GL.programs[program];
  GLctx.linkProgram(program);
  // Invalidate earlier computed uniform->ID mappings, those have now become stale
  program.uniformLocsById = 0;
  // Mark as null-like so that glGetUniformLocation() knows to populate this again.
  program.uniformSizeAndIdsByName = {};
};

var _emscripten_glMapBufferRange = (target, offset, length, access) => {
  if ((access & (1 | 32)) != 0) {
    err("glMapBufferRange access does not support MAP_READ or MAP_UNSYNCHRONIZED");
    return 0;
  }
  if ((access & 2) == 0) {
    err("glMapBufferRange access must include MAP_WRITE");
    return 0;
  }
  if ((access & (4 | 8)) == 0) {
    err("glMapBufferRange access must include INVALIDATE_BUFFER or INVALIDATE_RANGE");
    return 0;
  }
  if (!emscriptenWebGLValidateMapBufferTarget(target)) {
    GL.recordError(1280);
    err("GL_INVALID_ENUM in glMapBufferRange");
    return 0;
  }
  var mem = _malloc(length), binding = emscriptenWebGLGetBufferBinding(target);
  if (!mem) return 0;
  binding = GL.mappedBuffers[binding] ??= {};
  binding.offset = offset;
  binding.length = length;
  binding.mem = mem;
  binding.access = access;
  return mem;
};

var _emscripten_glPauseTransformFeedback = () => GLctx.pauseTransformFeedback();

var _emscripten_glPixelStorei = (pname, param) => {
  if (pname == 3317) {
    GL.unpackAlignment = param;
  } else if (pname == 3314) {
    GL.unpackRowLength = param;
  }
  GLctx.pixelStorei(pname, param);
};

var _emscripten_glPolygonModeWEBGL = (face, mode) => {
  GLctx.webglPolygonMode["polygonModeWEBGL"](face, mode);
};

var _emscripten_glPolygonOffset = (x0, x1) => GLctx.polygonOffset(x0, x1);

var _emscripten_glPolygonOffsetClampEXT = (factor, units, clamp) => {
  GLctx.extPolygonOffsetClamp["polygonOffsetClampEXT"](factor, units, clamp);
};

var _emscripten_glProgramBinary = (program, binaryFormat, binary, length) => {
  GL.recordError(1280);
};

var _emscripten_glProgramParameteri = (program, pname, value) => {
  GL.recordError(1280);
};

var _emscripten_glQueryCounterEXT = (id, target) => {
  GLctx.disjointTimerQueryExt["queryCounterEXT"](GL.queries[id], target);
};

var _emscripten_glReadBuffer = x0 => GLctx.readBuffer(x0);

var computeUnpackAlignedImageSize = (width, height, sizePerPixel) => {
  function roundedToNextMultipleOf(x, y) {
    return (x + y - 1) & -y;
  }
  var plainRowSize = (GL.unpackRowLength || width) * sizePerPixel;
  var alignedRowSize = roundedToNextMultipleOf(plainRowSize, GL.unpackAlignment);
  return height * alignedRowSize;
};

var colorChannelsInGlTextureFormat = format => {
  // Micro-optimizations for size: map format to size by subtracting smallest
  // enum value (0x1902) from all values first.  Also omit the most common
  // size value (1) from the list, which is assumed by formats not on the
  // list.
  var colorChannels = {
    // 0x1902 /* GL_DEPTH_COMPONENT */ - 0x1902: 1,
    // 0x1906 /* GL_ALPHA */ - 0x1902: 1,
    5: 3,
    6: 4,
    // 0x1909 /* GL_LUMINANCE */ - 0x1902: 1,
    8: 2,
    29502: 3,
    29504: 4,
    // 0x1903 /* GL_RED */ - 0x1902: 1,
    26917: 2,
    26918: 2,
    // 0x8D94 /* GL_RED_INTEGER */ - 0x1902: 1,
    29846: 3,
    29847: 4
  };
  return colorChannels[format - 6402] || 1;
};

var heapObjectForWebGLType = type => {
  // Micro-optimization for size: Subtract lowest GL enum number (0x1400/* GL_BYTE */) from type to compare
  // smaller values for the heap, for shorter generated code size.
  // Also the type HEAPU16 is not tested for explicitly, but any unrecognized type will return out HEAPU16.
  // (since most types are HEAPU16)
  type -= 5120;
  if (type == 0) return (growMemViews(), HEAP8);
  if (type == 1) return (growMemViews(), HEAPU8);
  if (type == 2) return (growMemViews(), HEAP16);
  if (type == 4) return (growMemViews(), HEAP32);
  if (type == 6) return (growMemViews(), HEAPF32);
  if (type == 5 || type == 28922 || type == 28520 || type == 30779 || type == 30782) return (growMemViews(), 
  HEAPU32);
  return (growMemViews(), HEAPU16);
};

var toTypedArrayIndex = (pointer, heap) => pointer >>> (31 - Math.clz32(heap.BYTES_PER_ELEMENT));

var emscriptenWebGLGetTexPixelData = (type, format, width, height, pixels, internalFormat) => {
  var heap = heapObjectForWebGLType(type);
  var sizePerPixel = colorChannelsInGlTextureFormat(format) * heap.BYTES_PER_ELEMENT;
  var bytes = computeUnpackAlignedImageSize(width, height, sizePerPixel);
  return heap.subarray(toTypedArrayIndex(pixels, heap), toTypedArrayIndex(pixels + bytes, heap));
};

var _emscripten_glReadPixels = (x, y, width, height, format, type, pixels) => {
  if (GL.currentContext.version >= 2) {
    if (GLctx.currentPixelPackBufferBinding) {
      GLctx.readPixels(x, y, width, height, format, type, pixels);
      return;
    }
    var heap = heapObjectForWebGLType(type);
    var target = toTypedArrayIndex(pixels, heap);
    GLctx.readPixels(x, y, width, height, format, type, heap, target);
    return;
  }
  var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, format);
  if (!pixelData) {
    GL.recordError(1280);
    return;
  }
  GLctx.readPixels(x, y, width, height, format, type, pixelData);
};

var _emscripten_glReleaseShaderCompiler = () => {};

var _emscripten_glRenderbufferStorage = (x0, x1, x2, x3) => GLctx.renderbufferStorage(x0, x1, x2, x3);

var _emscripten_glRenderbufferStorageMultisample = (x0, x1, x2, x3, x4) => GLctx.renderbufferStorageMultisample(x0, x1, x2, x3, x4);

var _emscripten_glResumeTransformFeedback = () => GLctx.resumeTransformFeedback();

var _emscripten_glSampleCoverage = (value, invert) => {
  GLctx.sampleCoverage(value, !!invert);
};

var _emscripten_glSamplerParameterf = (sampler, pname, param) => {
  GLctx.samplerParameterf(GL.samplers[sampler], pname, param);
};

var _emscripten_glSamplerParameterfv = (sampler, pname, params) => {
  var param = (growMemViews(), HEAPF32)[((params) >> 2)];
  GLctx.samplerParameterf(GL.samplers[sampler], pname, param);
};

var _emscripten_glSamplerParameteri = (sampler, pname, param) => {
  GLctx.samplerParameteri(GL.samplers[sampler], pname, param);
};

var _emscripten_glSamplerParameteriv = (sampler, pname, params) => {
  var param = (growMemViews(), HEAP32)[((params) >> 2)];
  GLctx.samplerParameteri(GL.samplers[sampler], pname, param);
};

var _emscripten_glScissor = (x0, x1, x2, x3) => GLctx.scissor(x0, x1, x2, x3);

var _emscripten_glShaderBinary = (count, shaders, binaryformat, binary, length) => {
  GL.recordError(1280);
};

var _emscripten_glShaderSource = (shader, count, string, length) => {
  var source = GL.getSource(shader, count, string, length);
  GLctx.shaderSource(GL.shaders[shader], source);
};

var _emscripten_glStencilFunc = (x0, x1, x2) => GLctx.stencilFunc(x0, x1, x2);

var _emscripten_glStencilFuncSeparate = (x0, x1, x2, x3) => GLctx.stencilFuncSeparate(x0, x1, x2, x3);

var _emscripten_glStencilMask = x0 => GLctx.stencilMask(x0);

var _emscripten_glStencilMaskSeparate = (x0, x1) => GLctx.stencilMaskSeparate(x0, x1);

var _emscripten_glStencilOp = (x0, x1, x2) => GLctx.stencilOp(x0, x1, x2);

var _emscripten_glStencilOpSeparate = (x0, x1, x2, x3) => GLctx.stencilOpSeparate(x0, x1, x2, x3);

var _emscripten_glTexImage2D = (target, level, internalFormat, width, height, border, format, type, pixels) => {
  if (GL.currentContext.version >= 2) {
    if (GLctx.currentPixelUnpackBufferBinding) {
      GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels);
      return;
    }
    if (pixels) {
      var heap = heapObjectForWebGLType(type);
      var index = toTypedArrayIndex(pixels, heap);
      GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, heap, index);
      return;
    }
  }
  var pixelData = pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) : null;
  GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixelData);
};

var _emscripten_glTexImage3D = (target, level, internalFormat, width, height, depth, border, format, type, pixels) => {
  if (GLctx.currentPixelUnpackBufferBinding) {
    GLctx.texImage3D(target, level, internalFormat, width, height, depth, border, format, type, pixels);
  } else if (pixels) {
    var heap = heapObjectForWebGLType(type);
    GLctx.texImage3D(target, level, internalFormat, width, height, depth, border, format, type, heap, toTypedArrayIndex(pixels, heap));
  } else {
    GLctx.texImage3D(target, level, internalFormat, width, height, depth, border, format, type, null);
  }
};

var _emscripten_glTexParameterf = (x0, x1, x2) => GLctx.texParameterf(x0, x1, x2);

var _emscripten_glTexParameterfv = (target, pname, params) => {
  var param = (growMemViews(), HEAPF32)[((params) >> 2)];
  GLctx.texParameterf(target, pname, param);
};

var _emscripten_glTexParameteri = (x0, x1, x2) => GLctx.texParameteri(x0, x1, x2);

var _emscripten_glTexParameteriv = (target, pname, params) => {
  var param = (growMemViews(), HEAP32)[((params) >> 2)];
  GLctx.texParameteri(target, pname, param);
};

var _emscripten_glTexStorage2D = (x0, x1, x2, x3, x4) => GLctx.texStorage2D(x0, x1, x2, x3, x4);

var _emscripten_glTexStorage3D = (x0, x1, x2, x3, x4, x5) => GLctx.texStorage3D(x0, x1, x2, x3, x4, x5);

var _emscripten_glTexSubImage2D = (target, level, xoffset, yoffset, width, height, format, type, pixels) => {
  if (GL.currentContext.version >= 2) {
    if (GLctx.currentPixelUnpackBufferBinding) {
      GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels);
      return;
    }
    if (pixels) {
      var heap = heapObjectForWebGLType(type);
      GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, heap, toTypedArrayIndex(pixels, heap));
      return;
    }
  }
  var pixelData = pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, 0) : null;
  GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixelData);
};

var _emscripten_glTexSubImage3D = (target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, pixels) => {
  if (GLctx.currentPixelUnpackBufferBinding) {
    GLctx.texSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, pixels);
  } else if (pixels) {
    var heap = heapObjectForWebGLType(type);
    GLctx.texSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, heap, toTypedArrayIndex(pixels, heap));
  } else {
    GLctx.texSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, null);
  }
};

var _emscripten_glTransformFeedbackVaryings = (program, count, varyings, bufferMode) => {
  program = GL.programs[program];
  var vars = [];
  for (var i = 0; i < count; i++) vars.push(UTF8ToString((growMemViews(), HEAPU32)[(((varyings) + (i * 4)) >> 2)]));
  GLctx.transformFeedbackVaryings(program, vars, bufferMode);
};

var _emscripten_glUniform1f = (location, v0) => {
  GLctx.uniform1f(webglGetUniformLocation(location), v0);
};

var miniTempWebGLFloatBuffers = [];

var _emscripten_glUniform1fv = (location, count, value) => {
  if (GL.currentContext.version >= 2) {
    count && GLctx.uniform1fv(webglGetUniformLocation(location), (growMemViews(), HEAPF32), ((value) >> 2), count);
    return;
  }
  if (count <= 288) {
    // avoid allocation when uploading few enough uniforms
    var view = miniTempWebGLFloatBuffers[count];
    for (var i = 0; i < count; ++i) {
      view[i] = (growMemViews(), HEAPF32)[(((value) + (4 * i)) >> 2)];
    }
  } else {
    var view = (growMemViews(), HEAPF32).subarray((((value) >> 2)), ((value + count * 4) >> 2));
  }
  GLctx.uniform1fv(webglGetUniformLocation(location), view);
};

var _emscripten_glUniform1i = (location, v0) => {
  GLctx.uniform1i(webglGetUniformLocation(location), v0);
};

var miniTempWebGLIntBuffers = [];

var _emscripten_glUniform1iv = (location, count, value) => {
  if (GL.currentContext.version >= 2) {
    count && GLctx.uniform1iv(webglGetUniformLocation(location), (growMemViews(), HEAP32), ((value) >> 2), count);
    return;
  }
  if (count <= 288) {
    // avoid allocation when uploading few enough uniforms
    var view = miniTempWebGLIntBuffers[count];
    for (var i = 0; i < count; ++i) {
      view[i] = (growMemViews(), HEAP32)[(((value) + (4 * i)) >> 2)];
    }
  } else {
    var view = (growMemViews(), HEAP32).subarray((((value) >> 2)), ((value + count * 4) >> 2));
  }
  GLctx.uniform1iv(webglGetUniformLocation(location), view);
};

var _emscripten_glUniform1ui = (location, v0) => {
  GLctx.uniform1ui(webglGetUniformLocation(location), v0);
};

var _emscripten_glUniform1uiv = (location, count, value) => {
  count && GLctx.uniform1uiv(webglGetUniformLocation(location), (growMemViews(), HEAPU32), ((value) >> 2), count);
};

var _emscripten_glUniform2f = (location, v0, v1) => {
  GLctx.uniform2f(webglGetUniformLocation(location), v0, v1);
};

var _emscripten_glUniform2fv = (location, count, value) => {
  if (GL.currentContext.version >= 2) {
    count && GLctx.uniform2fv(webglGetUniformLocation(location), (growMemViews(), HEAPF32), ((value) >> 2), count * 2);
    return;
  }
  if (count <= 144) {
    // avoid allocation when uploading few enough uniforms
    count *= 2;
    var view = miniTempWebGLFloatBuffers[count];
    for (var i = 0; i < count; i += 2) {
      view[i] = (growMemViews(), HEAPF32)[(((value) + (4 * i)) >> 2)];
      view[i + 1] = (growMemViews(), HEAPF32)[(((value) + (4 * i + 4)) >> 2)];
    }
  } else {
    var view = (growMemViews(), HEAPF32).subarray((((value) >> 2)), ((value + count * 8) >> 2));
  }
  GLctx.uniform2fv(webglGetUniformLocation(location), view);
};

var _emscripten_glUniform2i = (location, v0, v1) => {
  GLctx.uniform2i(webglGetUniformLocation(location), v0, v1);
};

var _emscripten_glUniform2iv = (location, count, value) => {
  if (GL.currentContext.version >= 2) {
    count && GLctx.uniform2iv(webglGetUniformLocation(location), (growMemViews(), HEAP32), ((value) >> 2), count * 2);
    return;
  }
  if (count <= 144) {
    // avoid allocation when uploading few enough uniforms
    count *= 2;
    var view = miniTempWebGLIntBuffers[count];
    for (var i = 0; i < count; i += 2) {
      view[i] = (growMemViews(), HEAP32)[(((value) + (4 * i)) >> 2)];
      view[i + 1] = (growMemViews(), HEAP32)[(((value) + (4 * i + 4)) >> 2)];
    }
  } else {
    var view = (growMemViews(), HEAP32).subarray((((value) >> 2)), ((value + count * 8) >> 2));
  }
  GLctx.uniform2iv(webglGetUniformLocation(location), view);
};

var _emscripten_glUniform2ui = (location, v0, v1) => {
  GLctx.uniform2ui(webglGetUniformLocation(location), v0, v1);
};

var _emscripten_glUniform2uiv = (location, count, value) => {
  count && GLctx.uniform2uiv(webglGetUniformLocation(location), (growMemViews(), HEAPU32), ((value) >> 2), count * 2);
};

var _emscripten_glUniform3f = (location, v0, v1, v2) => {
  GLctx.uniform3f(webglGetUniformLocation(location), v0, v1, v2);
};

var _emscripten_glUniform3fv = (location, count, value) => {
  if (GL.currentContext.version >= 2) {
    count && GLctx.uniform3fv(webglGetUniformLocation(location), (growMemViews(), HEAPF32), ((value) >> 2), count * 3);
    return;
  }
  if (count <= 96) {
    // avoid allocation when uploading few enough uniforms
    count *= 3;
    var view = miniTempWebGLFloatBuffers[count];
    for (var i = 0; i < count; i += 3) {
      view[i] = (growMemViews(), HEAPF32)[(((value) + (4 * i)) >> 2)];
      view[i + 1] = (growMemViews(), HEAPF32)[(((value) + (4 * i + 4)) >> 2)];
      view[i + 2] = (growMemViews(), HEAPF32)[(((value) + (4 * i + 8)) >> 2)];
    }
  } else {
    var view = (growMemViews(), HEAPF32).subarray((((value) >> 2)), ((value + count * 12) >> 2));
  }
  GLctx.uniform3fv(webglGetUniformLocation(location), view);
};

var _emscripten_glUniform3i = (location, v0, v1, v2) => {
  GLctx.uniform3i(webglGetUniformLocation(location), v0, v1, v2);
};

var _emscripten_glUniform3iv = (location, count, value) => {
  if (GL.currentContext.version >= 2) {
    count && GLctx.uniform3iv(webglGetUniformLocation(location), (growMemViews(), HEAP32), ((value) >> 2), count * 3);
    return;
  }
  if (count <= 96) {
    // avoid allocation when uploading few enough uniforms
    count *= 3;
    var view = miniTempWebGLIntBuffers[count];
    for (var i = 0; i < count; i += 3) {
      view[i] = (growMemViews(), HEAP32)[(((value) + (4 * i)) >> 2)];
      view[i + 1] = (growMemViews(), HEAP32)[(((value) + (4 * i + 4)) >> 2)];
      view[i + 2] = (growMemViews(), HEAP32)[(((value) + (4 * i + 8)) >> 2)];
    }
  } else {
    var view = (growMemViews(), HEAP32).subarray((((value) >> 2)), ((value + count * 12) >> 2));
  }
  GLctx.uniform3iv(webglGetUniformLocation(location), view);
};

var _emscripten_glUniform3ui = (location, v0, v1, v2) => {
  GLctx.uniform3ui(webglGetUniformLocation(location), v0, v1, v2);
};

var _emscripten_glUniform3uiv = (location, count, value) => {
  count && GLctx.uniform3uiv(webglGetUniformLocation(location), (growMemViews(), HEAPU32), ((value) >> 2), count * 3);
};

var _emscripten_glUniform4f = (location, v0, v1, v2, v3) => {
  GLctx.uniform4f(webglGetUniformLocation(location), v0, v1, v2, v3);
};

var _emscripten_glUniform4fv = (location, count, value) => {
  if (GL.currentContext.version >= 2) {
    count && GLctx.uniform4fv(webglGetUniformLocation(location), (growMemViews(), HEAPF32), ((value) >> 2), count * 4);
    return;
  }
  if (count <= 72) {
    // avoid allocation when uploading few enough uniforms
    var view = miniTempWebGLFloatBuffers[4 * count];
    // hoist the heap out of the loop for size and for pthreads+growth.
    var heap = (growMemViews(), HEAPF32);
    value = ((value) >> 2);
    count *= 4;
    for (var i = 0; i < count; i += 4) {
      var dst = value + i;
      view[i] = heap[dst];
      view[i + 1] = heap[dst + 1];
      view[i + 2] = heap[dst + 2];
      view[i + 3] = heap[dst + 3];
    }
  } else {
    var view = (growMemViews(), HEAPF32).subarray((((value) >> 2)), ((value + count * 16) >> 2));
  }
  GLctx.uniform4fv(webglGetUniformLocation(location), view);
};

var _emscripten_glUniform4i = (location, v0, v1, v2, v3) => {
  GLctx.uniform4i(webglGetUniformLocation(location), v0, v1, v2, v3);
};

var _emscripten_glUniform4iv = (location, count, value) => {
  if (GL.currentContext.version >= 2) {
    count && GLctx.uniform4iv(webglGetUniformLocation(location), (growMemViews(), HEAP32), ((value) >> 2), count * 4);
    return;
  }
  if (count <= 72) {
    // avoid allocation when uploading few enough uniforms
    count *= 4;
    var view = miniTempWebGLIntBuffers[count];
    for (var i = 0; i < count; i += 4) {
      view[i] = (growMemViews(), HEAP32)[(((value) + (4 * i)) >> 2)];
      view[i + 1] = (growMemViews(), HEAP32)[(((value) + (4 * i + 4)) >> 2)];
      view[i + 2] = (growMemViews(), HEAP32)[(((value) + (4 * i + 8)) >> 2)];
      view[i + 3] = (growMemViews(), HEAP32)[(((value) + (4 * i + 12)) >> 2)];
    }
  } else {
    var view = (growMemViews(), HEAP32).subarray((((value) >> 2)), ((value + count * 16) >> 2));
  }
  GLctx.uniform4iv(webglGetUniformLocation(location), view);
};

var _emscripten_glUniform4ui = (location, v0, v1, v2, v3) => {
  GLctx.uniform4ui(webglGetUniformLocation(location), v0, v1, v2, v3);
};

var _emscripten_glUniform4uiv = (location, count, value) => {
  count && GLctx.uniform4uiv(webglGetUniformLocation(location), (growMemViews(), HEAPU32), ((value) >> 2), count * 4);
};

var _emscripten_glUniformBlockBinding = (program, uniformBlockIndex, uniformBlockBinding) => {
  program = GL.programs[program];
  GLctx.uniformBlockBinding(program, uniformBlockIndex, uniformBlockBinding);
};

var _emscripten_glUniformMatrix2fv = (location, count, transpose, value) => {
  if (GL.currentContext.version >= 2) {
    count && GLctx.uniformMatrix2fv(webglGetUniformLocation(location), !!transpose, (growMemViews(), 
    HEAPF32), ((value) >> 2), count * 4);
    return;
  }
  if (count <= 72) {
    // avoid allocation when uploading few enough uniforms
    count *= 4;
    var view = miniTempWebGLFloatBuffers[count];
    for (var i = 0; i < count; i += 4) {
      view[i] = (growMemViews(), HEAPF32)[(((value) + (4 * i)) >> 2)];
      view[i + 1] = (growMemViews(), HEAPF32)[(((value) + (4 * i + 4)) >> 2)];
      view[i + 2] = (growMemViews(), HEAPF32)[(((value) + (4 * i + 8)) >> 2)];
      view[i + 3] = (growMemViews(), HEAPF32)[(((value) + (4 * i + 12)) >> 2)];
    }
  } else {
    var view = (growMemViews(), HEAPF32).subarray((((value) >> 2)), ((value + count * 16) >> 2));
  }
  GLctx.uniformMatrix2fv(webglGetUniformLocation(location), !!transpose, view);
};

var _emscripten_glUniformMatrix2x3fv = (location, count, transpose, value) => {
  count && GLctx.uniformMatrix2x3fv(webglGetUniformLocation(location), !!transpose, (growMemViews(), 
  HEAPF32), ((value) >> 2), count * 6);
};

var _emscripten_glUniformMatrix2x4fv = (location, count, transpose, value) => {
  count && GLctx.uniformMatrix2x4fv(webglGetUniformLocation(location), !!transpose, (growMemViews(), 
  HEAPF32), ((value) >> 2), count * 8);
};

var _emscripten_glUniformMatrix3fv = (location, count, transpose, value) => {
  if (GL.currentContext.version >= 2) {
    count && GLctx.uniformMatrix3fv(webglGetUniformLocation(location), !!transpose, (growMemViews(), 
    HEAPF32), ((value) >> 2), count * 9);
    return;
  }
  if (count <= 32) {
    // avoid allocation when uploading few enough uniforms
    count *= 9;
    var view = miniTempWebGLFloatBuffers[count];
    for (var i = 0; i < count; i += 9) {
      view[i] = (growMemViews(), HEAPF32)[(((value) + (4 * i)) >> 2)];
      view[i + 1] = (growMemViews(), HEAPF32)[(((value) + (4 * i + 4)) >> 2)];
      view[i + 2] = (growMemViews(), HEAPF32)[(((value) + (4 * i + 8)) >> 2)];
      view[i + 3] = (growMemViews(), HEAPF32)[(((value) + (4 * i + 12)) >> 2)];
      view[i + 4] = (growMemViews(), HEAPF32)[(((value) + (4 * i + 16)) >> 2)];
      view[i + 5] = (growMemViews(), HEAPF32)[(((value) + (4 * i + 20)) >> 2)];
      view[i + 6] = (growMemViews(), HEAPF32)[(((value) + (4 * i + 24)) >> 2)];
      view[i + 7] = (growMemViews(), HEAPF32)[(((value) + (4 * i + 28)) >> 2)];
      view[i + 8] = (growMemViews(), HEAPF32)[(((value) + (4 * i + 32)) >> 2)];
    }
  } else {
    var view = (growMemViews(), HEAPF32).subarray((((value) >> 2)), ((value + count * 36) >> 2));
  }
  GLctx.uniformMatrix3fv(webglGetUniformLocation(location), !!transpose, view);
};

var _emscripten_glUniformMatrix3x2fv = (location, count, transpose, value) => {
  count && GLctx.uniformMatrix3x2fv(webglGetUniformLocation(location), !!transpose, (growMemViews(), 
  HEAPF32), ((value) >> 2), count * 6);
};

var _emscripten_glUniformMatrix3x4fv = (location, count, transpose, value) => {
  count && GLctx.uniformMatrix3x4fv(webglGetUniformLocation(location), !!transpose, (growMemViews(), 
  HEAPF32), ((value) >> 2), count * 12);
};

var _emscripten_glUniformMatrix4fv = (location, count, transpose, value) => {
  if (GL.currentContext.version >= 2) {
    count && GLctx.uniformMatrix4fv(webglGetUniformLocation(location), !!transpose, (growMemViews(), 
    HEAPF32), ((value) >> 2), count * 16);
    return;
  }
  if (count <= 18) {
    // avoid allocation when uploading few enough uniforms
    var view = miniTempWebGLFloatBuffers[16 * count];
    // hoist the heap out of the loop for size and for pthreads+growth.
    var heap = (growMemViews(), HEAPF32);
    value = ((value) >> 2);
    count *= 16;
    for (var i = 0; i < count; i += 16) {
      var dst = value + i;
      view[i] = heap[dst];
      view[i + 1] = heap[dst + 1];
      view[i + 2] = heap[dst + 2];
      view[i + 3] = heap[dst + 3];
      view[i + 4] = heap[dst + 4];
      view[i + 5] = heap[dst + 5];
      view[i + 6] = heap[dst + 6];
      view[i + 7] = heap[dst + 7];
      view[i + 8] = heap[dst + 8];
      view[i + 9] = heap[dst + 9];
      view[i + 10] = heap[dst + 10];
      view[i + 11] = heap[dst + 11];
      view[i + 12] = heap[dst + 12];
      view[i + 13] = heap[dst + 13];
      view[i + 14] = heap[dst + 14];
      view[i + 15] = heap[dst + 15];
    }
  } else {
    var view = (growMemViews(), HEAPF32).subarray((((value) >> 2)), ((value + count * 64) >> 2));
  }
  GLctx.uniformMatrix4fv(webglGetUniformLocation(location), !!transpose, view);
};

var _emscripten_glUniformMatrix4x2fv = (location, count, transpose, value) => {
  count && GLctx.uniformMatrix4x2fv(webglGetUniformLocation(location), !!transpose, (growMemViews(), 
  HEAPF32), ((value) >> 2), count * 8);
};

var _emscripten_glUniformMatrix4x3fv = (location, count, transpose, value) => {
  count && GLctx.uniformMatrix4x3fv(webglGetUniformLocation(location), !!transpose, (growMemViews(), 
  HEAPF32), ((value) >> 2), count * 12);
};

var _emscripten_glUnmapBuffer = target => {
  if (!emscriptenWebGLValidateMapBufferTarget(target)) {
    GL.recordError(1280);
    err("GL_INVALID_ENUM in glUnmapBuffer");
    return 0;
  }
  var buffer = emscriptenWebGLGetBufferBinding(target);
  var mapping = GL.mappedBuffers[buffer];
  if (!mapping || !mapping.mem) {
    GL.recordError(1282);
    err("buffer was never mapped in glUnmapBuffer");
    return 0;
  }
  if (!(mapping.access & 16)) {
    /* GL_MAP_FLUSH_EXPLICIT_BIT */ if (GL.currentContext.version >= 2) {
      GLctx.bufferSubData(target, mapping.offset, (growMemViews(), HEAPU8), mapping.mem, mapping.length);
    } else GLctx.bufferSubData(target, mapping.offset, (growMemViews(), HEAPU8).subarray(mapping.mem, mapping.mem + mapping.length));
  }
  _free(mapping.mem);
  mapping.mem = 0;
  return 1;
};

var _emscripten_glUseProgram = program => {
  program = GL.programs[program];
  GLctx.useProgram(program);
  // Record the currently active program so that we can access the uniform
  // mapping table of that program.
  GLctx.currentProgram = program;
};

var _emscripten_glValidateProgram = program => {
  GLctx.validateProgram(GL.programs[program]);
};

var _emscripten_glVertexAttrib1f = (x0, x1) => GLctx.vertexAttrib1f(x0, x1);

var _emscripten_glVertexAttrib1fv = (index, v) => {
  GLctx.vertexAttrib1f(index, (growMemViews(), HEAPF32)[v >> 2]);
};

var _emscripten_glVertexAttrib2f = (x0, x1, x2) => GLctx.vertexAttrib2f(x0, x1, x2);

var _emscripten_glVertexAttrib2fv = (index, v) => {
  GLctx.vertexAttrib2f(index, (growMemViews(), HEAPF32)[v >> 2], (growMemViews(), 
  HEAPF32)[v + 4 >> 2]);
};

var _emscripten_glVertexAttrib3f = (x0, x1, x2, x3) => GLctx.vertexAttrib3f(x0, x1, x2, x3);

var _emscripten_glVertexAttrib3fv = (index, v) => {
  GLctx.vertexAttrib3f(index, (growMemViews(), HEAPF32)[v >> 2], (growMemViews(), 
  HEAPF32)[v + 4 >> 2], (growMemViews(), HEAPF32)[v + 8 >> 2]);
};

var _emscripten_glVertexAttrib4f = (x0, x1, x2, x3, x4) => GLctx.vertexAttrib4f(x0, x1, x2, x3, x4);

var _emscripten_glVertexAttrib4fv = (index, v) => {
  GLctx.vertexAttrib4f(index, (growMemViews(), HEAPF32)[v >> 2], (growMemViews(), 
  HEAPF32)[v + 4 >> 2], (growMemViews(), HEAPF32)[v + 8 >> 2], (growMemViews(), HEAPF32)[v + 12 >> 2]);
};

var _emscripten_glVertexAttribDivisor = (index, divisor) => {
  GLctx.vertexAttribDivisor(index, divisor);
};

var _glVertexAttribDivisor = _emscripten_glVertexAttribDivisor;

var _emscripten_glVertexAttribDivisorANGLE = _glVertexAttribDivisor;

var _emscripten_glVertexAttribDivisorARB = _glVertexAttribDivisor;

var _emscripten_glVertexAttribDivisorEXT = _glVertexAttribDivisor;

var _emscripten_glVertexAttribDivisorNV = _glVertexAttribDivisor;

var _emscripten_glVertexAttribI4i = (x0, x1, x2, x3, x4) => GLctx.vertexAttribI4i(x0, x1, x2, x3, x4);

var _emscripten_glVertexAttribI4iv = (index, v) => {
  GLctx.vertexAttribI4i(index, (growMemViews(), HEAP32)[v >> 2], (growMemViews(), 
  HEAP32)[v + 4 >> 2], (growMemViews(), HEAP32)[v + 8 >> 2], (growMemViews(), HEAP32)[v + 12 >> 2]);
};

var _emscripten_glVertexAttribI4ui = (x0, x1, x2, x3, x4) => GLctx.vertexAttribI4ui(x0, x1, x2, x3, x4);

var _emscripten_glVertexAttribI4uiv = (index, v) => {
  GLctx.vertexAttribI4ui(index, (growMemViews(), HEAPU32)[v >> 2], (growMemViews(), 
  HEAPU32)[v + 4 >> 2], (growMemViews(), HEAPU32)[v + 8 >> 2], (growMemViews(), HEAPU32)[v + 12 >> 2]);
};

var _emscripten_glVertexAttribIPointer = (index, size, type, stride, ptr) => {
  var cb = GL.currentContext.clientBuffers[index];
  if (!GLctx.currentArrayBufferBinding) {
    cb.size = size;
    cb.type = type;
    cb.normalized = false;
    cb.stride = stride;
    cb.ptr = ptr;
    cb.clientside = true;
    cb.vertexAttribPointerAdaptor = function(index, size, type, normalized, stride, ptr) {
      this.vertexAttribIPointer(index, size, type, stride, ptr);
    };
    return;
  }
  cb.clientside = false;
  GLctx.vertexAttribIPointer(index, size, type, stride, ptr);
};

var _emscripten_glVertexAttribPointer = (index, size, type, normalized, stride, ptr) => {
  var cb = GL.currentContext.clientBuffers[index];
  if (!GLctx.currentArrayBufferBinding) {
    cb.size = size;
    cb.type = type;
    cb.normalized = normalized;
    cb.stride = stride;
    cb.ptr = ptr;
    cb.clientside = true;
    cb.vertexAttribPointerAdaptor = function(index, size, type, normalized, stride, ptr) {
      this.vertexAttribPointer(index, size, type, normalized, stride, ptr);
    };
    return;
  }
  cb.clientside = false;
  GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr);
};

var _emscripten_glViewport = (x0, x1, x2, x3) => GLctx.viewport(x0, x1, x2, x3);

var _emscripten_glWaitSync = (sync, flags, timeout) => {
  // See WebGL2 vs GLES3 difference on GL_TIMEOUT_IGNORED above (https://www.khronos.org/registry/webgl/specs/latest/2.0/#5.15)
  timeout = Number(timeout);
  GLctx.waitSync(GL.syncs[sync], flags, timeout);
};

var _emscripten_has_asyncify = () => 0;

var _emscripten_num_logical_cores = () => ENVIRONMENT_IS_NODE ? require("node:os").cpus().length : navigator["hardwareConcurrency"];

var doRequestFullscreen = (target, strategy) => {
  if (!JSEvents.fullscreenEnabled()) return -1;
  target = findEventTarget(target);
  if (!target) return -4;
  if (!target.requestFullscreen && !target.webkitRequestFullscreen) {
    return -3;
  }
  // Queue this function call if we're not currently in an event handler and
  // the user saw it appropriate to do so.
  if (!JSEvents.canPerformEventHandlerRequests()) {
    if (strategy.deferUntilInEventHandler) {
      JSEvents.deferCall(JSEvents_requestFullscreen, 1, [ target, strategy ]);
      return 1;
    }
    return -2;
  }
  return JSEvents_requestFullscreen(target, strategy);
};

function _emscripten_request_fullscreen_strategy(target, deferUntilInEventHandler, fullscreenStrategy) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(45, 0, 1, target, deferUntilInEventHandler, fullscreenStrategy);
  var strategy = {
    scaleMode: (growMemViews(), HEAP32)[((fullscreenStrategy) >> 2)],
    canvasResolutionScaleMode: (growMemViews(), HEAP32)[(((fullscreenStrategy) + (4)) >> 2)],
    filteringMode: (growMemViews(), HEAP32)[(((fullscreenStrategy) + (8)) >> 2)],
    deferUntilInEventHandler,
    canvasResizedCallbackTargetThread: (growMemViews(), HEAP32)[(((fullscreenStrategy) + (20)) >> 2)],
    canvasResizedCallback: (growMemViews(), HEAP32)[(((fullscreenStrategy) + (12)) >> 2)],
    canvasResizedCallbackUserData: (growMemViews(), HEAP32)[(((fullscreenStrategy) + (16)) >> 2)]
  };
  return doRequestFullscreen(target, strategy);
}

function _emscripten_request_pointerlock(target, deferUntilInEventHandler) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(46, 0, 1, target, deferUntilInEventHandler);
  target = findEventTarget(target);
  if (!target) return -4;
  if (!target.requestPointerLock) {
    return -1;
  }
  // Queue this function call if we're not currently in an event handler and
  // the user saw it appropriate to do so.
  if (!JSEvents.canPerformEventHandlerRequests()) {
    if (deferUntilInEventHandler) {
      JSEvents.deferCall(requestPointerLock, 2, [ target ]);
      return 1;
    }
    return -2;
  }
  return requestPointerLock(target);
}

var growMemory = size => {
  var oldHeapSize = wasmMemory.buffer.byteLength;
  var pages = ((size - oldHeapSize + 65535) / 65536) | 0;
  try {
    // round size grow request up to wasm page size (fixed 64KB per spec)
    wasmMemory.grow(pages);
    // .grow() takes a delta compared to the previous size
    updateMemoryViews();
    return 1;
  } catch (e) {}
};

var _emscripten_resize_heap = requestedSize => {
  var oldSize = (growMemViews(), HEAPU8).length;
  // With CAN_ADDRESS_2GB or MEMORY64, pointers are already unsigned.
  requestedSize >>>= 0;
  // With multithreaded builds, races can happen (another thread might increase the size
  // in between), so return a failure, and let the caller retry.
  if (requestedSize <= oldSize) {
    return false;
  }
  // Memory resize rules:
  // 1.  Always increase heap size to at least the requested size, rounded up
  //     to next page multiple.
  // 2a. If MEMORY_GROWTH_LINEAR_STEP == -1, excessively resize the heap
  //     geometrically: increase the heap size according to
  //     MEMORY_GROWTH_GEOMETRIC_STEP factor (default +20%), At most
  //     overreserve by MEMORY_GROWTH_GEOMETRIC_CAP bytes (default 96MB).
  // 2b. If MEMORY_GROWTH_LINEAR_STEP != -1, excessively resize the heap
  //     linearly: increase the heap size by at least
  //     MEMORY_GROWTH_LINEAR_STEP bytes.
  // 3.  Max size for the heap is capped at 2048MB-WASM_PAGE_SIZE, or by
  //     MAXIMUM_MEMORY, or by ASAN limit, depending on which is smallest
  // 4.  If we were unable to allocate as much memory, it may be due to
  //     over-eager decision to excessively reserve due to (3) above.
  //     Hence if an allocation fails, cut down on the amount of excess
  //     growth, in an attempt to succeed to perform a smaller allocation.
  // A limit is set for how much we can grow. We should not exceed that
  // (the wasm binary specifies it, so if we tried, we'd fail anyhow).
  var maxHeapSize = getHeapMax();
  if (requestedSize > maxHeapSize) {
    return false;
  }
  // Loop through potential heap size increases. If we attempt a too eager
  // reservation that fails, cut down on the attempted size and reserve a
  // smaller bump instead. (max 3 times, chosen somewhat arbitrarily)
  for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
    var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
    // ensure geometric growth
    // but limit overreserving (default to capping at +96MB overgrowth at most)
    overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
    var newSize = Math.min(maxHeapSize, alignMemory(Math.max(requestedSize, overGrownHeapSize), 65536));
    var replacement = growMemory(newSize);
    if (replacement) {
      return true;
    }
  }
  return false;
};

/** @suppress {checkTypes} */ function _emscripten_sample_gamepad_data() {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(47, 0, 1);
  try {
    if (navigator.getGamepads) return (JSEvents.lastGamepadState = navigator.getGamepads()) ? 0 : -1;
  } catch (e) {
    navigator.getGamepads = null;
  }
  return -1;
}

var registerBeforeUnloadEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) => {
  var beforeUnloadEventHandlerFunc = e => {
    // Note: This is always called on the main browser thread, since it needs synchronously return a value!
    var confirmationMessage = getWasmTableEntry(callbackfunc)(eventTypeId, 0, userData);
    if (confirmationMessage) {
      confirmationMessage = UTF8ToString(confirmationMessage);
    }
    if (confirmationMessage) {
      e.preventDefault();
      e.returnValue = confirmationMessage;
      return confirmationMessage;
    }
  };
  var eventHandler = {
    target: findEventTarget(target),
    eventTypeString,
    eventTypeId,
    userData,
    callbackfunc,
    handlerFunc: beforeUnloadEventHandlerFunc,
    useCapture
  };
  return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_beforeunload_callback_on_thread(userData, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(48, 0, 1, userData, callbackfunc, targetThread);
  if (typeof onbeforeunload == "undefined") return -1;
  // beforeunload callback can only be registered on the main browser thread, because the page will go away immediately after returning from the handler,
  // and there is no time to start proxying it anywhere.
  if (targetThread !== 1) return -5;
  return registerBeforeUnloadEventCallback(2, userData, true, callbackfunc, 28, "beforeunload");
}

var registerFocusEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
  targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
  var eventSize = 256;
  JSEvents.focusEvent ||= _malloc(eventSize);
  var focusEventHandlerFunc = e => {
    var nodeName = JSEvents.getNodeNameForTarget(e.target);
    var id = e.target.id ? e.target.id : "";
    var focusEvent = JSEvents.focusEvent;
    stringToUTF8(nodeName, focusEvent + 0, 128);
    stringToUTF8(id, focusEvent + 128, 128);
    if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, focusEvent, eventSize, userData); else if (getWasmTableEntry(callbackfunc)(eventTypeId, focusEvent, userData)) e.preventDefault();
  };
  var eventHandler = {
    target: findEventTarget(target),
    eventTypeString,
    eventTypeId,
    userData,
    callbackfunc,
    handlerFunc: focusEventHandlerFunc,
    useCapture
  };
  return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_blur_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(49, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  return registerFocusEventCallback(target, userData, useCapture, callbackfunc, 12, "blur", targetThread);
}

function _emscripten_set_element_css_size(target, width, height) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(50, 0, 1, target, width, height);
  target = findEventTarget(target);
  if (!target) return -4;
  target.style.width = width + "px";
  target.style.height = height + "px";
  return 0;
}

function _emscripten_set_focus_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(51, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  return registerFocusEventCallback(target, userData, useCapture, callbackfunc, 13, "focus", targetThread);
}

var fillFullscreenChangeEventData = eventStruct => {
  var fullscreenElement = getFullscreenElement();
  var isFullscreen = !!fullscreenElement;
  // Assigning a boolean to HEAP32 with expected type coercion.
  /** @suppress{checkTypes} */ (growMemViews(), HEAP8)[eventStruct] = isFullscreen;
  (growMemViews(), HEAP8)[(eventStruct) + (1)] = JSEvents.fullscreenEnabled();
  // If transitioning to fullscreen, report info about the element that is now fullscreen.
  // If transitioning to windowed mode, report info about the element that just was fullscreen.
  var reportedElement = isFullscreen ? fullscreenElement : JSEvents.previousFullscreenElement;
  var nodeName = JSEvents.getNodeNameForTarget(reportedElement);
  var id = reportedElement?.id || "";
  stringToUTF8(nodeName, eventStruct + 2, 128);
  stringToUTF8(id, eventStruct + 130, 128);
  (growMemViews(), HEAP32)[(((eventStruct) + (260)) >> 2)] = reportedElement ? reportedElement.clientWidth : 0;
  (growMemViews(), HEAP32)[(((eventStruct) + (264)) >> 2)] = reportedElement ? reportedElement.clientHeight : 0;
  (growMemViews(), HEAP32)[(((eventStruct) + (268)) >> 2)] = screen.width;
  (growMemViews(), HEAP32)[(((eventStruct) + (272)) >> 2)] = screen.height;
  if (isFullscreen) {
    JSEvents.previousFullscreenElement = fullscreenElement;
  }
};

var registerFullscreenChangeEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
  targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
  var eventSize = 276;
  JSEvents.fullscreenChangeEvent ||= _malloc(eventSize);
  var fullscreenChangeEventHandlerFunc = e => {
    var fullscreenChangeEvent = JSEvents.fullscreenChangeEvent;
    fillFullscreenChangeEventData(fullscreenChangeEvent);
    if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, fullscreenChangeEvent, eventSize, userData); else if (getWasmTableEntry(callbackfunc)(eventTypeId, fullscreenChangeEvent, userData)) e.preventDefault();
  };
  var eventHandler = {
    target,
    eventTypeString,
    eventTypeId,
    userData,
    callbackfunc,
    handlerFunc: fullscreenChangeEventHandlerFunc,
    useCapture
  };
  return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_fullscreenchange_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(52, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  if (!JSEvents.fullscreenEnabled()) return -1;
  target = findEventTarget(target);
  if (!target) return -4;
  // As of Safari 13.0.3 on macOS Catalina 10.15.1 still ships with prefixed webkitfullscreenchange. TODO: revisit this check once Safari ships unprefixed version.
  // TODO: When this block is removed, also change test/test_html5_remove_event_listener.c test expectation on emscripten_set_fullscreenchange_callback().
  registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, 19, "webkitfullscreenchange", targetThread);
  return registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, 19, "fullscreenchange", targetThread);
}

var registerGamepadEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
  targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
  var eventSize = 1240;
  JSEvents.gamepadEvent ||= _malloc(eventSize);
  var gamepadEventHandlerFunc = e => {
    var gamepadEvent = JSEvents.gamepadEvent;
    fillGamepadEventData(gamepadEvent, e["gamepad"]);
    if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, gamepadEvent, eventSize, userData); else if (getWasmTableEntry(callbackfunc)(eventTypeId, gamepadEvent, userData)) e.preventDefault();
  };
  var eventHandler = {
    target: findEventTarget(target),
    allowsDeferredCalls: true,
    eventTypeString,
    eventTypeId,
    userData,
    callbackfunc,
    handlerFunc: gamepadEventHandlerFunc,
    useCapture
  };
  return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_gamepadconnected_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(53, 0, 1, userData, useCapture, callbackfunc, targetThread);
  if (_emscripten_sample_gamepad_data()) return -1;
  return registerGamepadEventCallback(2, userData, useCapture, callbackfunc, 26, "gamepadconnected", targetThread);
}

function _emscripten_set_gamepaddisconnected_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(54, 0, 1, userData, useCapture, callbackfunc, targetThread);
  if (_emscripten_sample_gamepad_data()) return -1;
  return registerGamepadEventCallback(2, userData, useCapture, callbackfunc, 27, "gamepaddisconnected", targetThread);
}

var registerKeyEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
  targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
  var eventSize = 160;
  JSEvents.keyEvent ||= _malloc(eventSize);
  var keyEventHandlerFunc = e => {
    var keyEventData = JSEvents.keyEvent;
    (growMemViews(), HEAPF64)[((keyEventData) >> 3)] = e.timeStamp;
    var idx = ((keyEventData) >> 2);
    (growMemViews(), HEAP32)[idx + 2] = e.location;
    (growMemViews(), HEAP8)[keyEventData + 12] = e.ctrlKey;
    (growMemViews(), HEAP8)[keyEventData + 13] = e.shiftKey;
    (growMemViews(), HEAP8)[keyEventData + 14] = e.altKey;
    (growMemViews(), HEAP8)[keyEventData + 15] = e.metaKey;
    (growMemViews(), HEAP8)[keyEventData + 16] = e.repeat;
    (growMemViews(), HEAP32)[idx + 5] = e.charCode;
    (growMemViews(), HEAP32)[idx + 6] = e.keyCode;
    (growMemViews(), HEAP32)[idx + 7] = e.which;
    stringToUTF8(e.key || "", keyEventData + 32, 32);
    stringToUTF8(e.code || "", keyEventData + 64, 32);
    stringToUTF8(e.char || "", keyEventData + 96, 32);
    stringToUTF8(e.locale || "", keyEventData + 128, 32);
    if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, keyEventData, eventSize, userData); else if (getWasmTableEntry(callbackfunc)(eventTypeId, keyEventData, userData)) e.preventDefault();
  };
  var eventHandler = {
    target: findEventTarget(target),
    eventTypeString,
    eventTypeId,
    userData,
    callbackfunc,
    handlerFunc: keyEventHandlerFunc,
    useCapture
  };
  return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_keydown_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(55, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  return registerKeyEventCallback(target, userData, useCapture, callbackfunc, 2, "keydown", targetThread);
}

function _emscripten_set_keypress_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(56, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  return registerKeyEventCallback(target, userData, useCapture, callbackfunc, 1, "keypress", targetThread);
}

function _emscripten_set_keyup_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(57, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  return registerKeyEventCallback(target, userData, useCapture, callbackfunc, 3, "keyup", targetThread);
}

var _emscripten_set_main_loop_arg = (func, arg, fps, simulateInfiniteLoop) => {
  var iterFunc = () => getWasmTableEntry(func)(arg);
  setMainLoop(iterFunc, fps, simulateInfiniteLoop, arg);
};

var fillMouseEventData = (eventStruct, e, target) => {
  (growMemViews(), HEAPF64)[((eventStruct) >> 3)] = e.timeStamp;
  var idx = ((eventStruct) >> 2);
  (growMemViews(), HEAP32)[idx + 2] = e.screenX;
  (growMemViews(), HEAP32)[idx + 3] = e.screenY;
  (growMemViews(), HEAP32)[idx + 4] = e.clientX;
  (growMemViews(), HEAP32)[idx + 5] = e.clientY;
  (growMemViews(), HEAP8)[eventStruct + 24] = e.ctrlKey;
  (growMemViews(), HEAP8)[eventStruct + 25] = e.shiftKey;
  (growMemViews(), HEAP8)[eventStruct + 26] = e.altKey;
  (growMemViews(), HEAP8)[eventStruct + 27] = e.metaKey;
  (growMemViews(), HEAP16)[idx * 2 + 14] = e.button;
  (growMemViews(), HEAP16)[idx * 2 + 15] = e.buttons;
  (growMemViews(), HEAP32)[idx + 8] = e["movementX"];
  (growMemViews(), HEAP32)[idx + 9] = e["movementY"];
  // Note: rect contains doubles (truncated to placate SAFE_HEAP, which is the same behaviour when writing to HEAP32 anyway)
  var rect = getBoundingClientRect(target);
  (growMemViews(), HEAP32)[idx + 10] = e.clientX - (rect.left | 0);
  (growMemViews(), HEAP32)[idx + 11] = e.clientY - (rect.top | 0);
};

var registerMouseEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
  targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
  var eventSize = 64;
  JSEvents.mouseEvent ||= _malloc(eventSize);
  target = findEventTarget(target);
  var mouseEventHandlerFunc = e => {
    // TODO: Make this access thread safe, or this could update live while app is reading it.
    fillMouseEventData(JSEvents.mouseEvent, e, target);
    if (targetThread) {
      __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, JSEvents.mouseEvent, eventSize, userData);
    } else if (getWasmTableEntry(callbackfunc)(eventTypeId, JSEvents.mouseEvent, userData)) e.preventDefault();
  };
  var eventHandler = {
    target,
    allowsDeferredCalls: eventTypeString != "mousemove" && eventTypeString != "mouseenter" && eventTypeString != "mouseleave",
    // Mouse move events do not allow fullscreen/pointer lock requests to be handled in them!
    eventTypeString,
    eventTypeId,
    userData,
    callbackfunc,
    handlerFunc: mouseEventHandlerFunc,
    useCapture
  };
  return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_mousedown_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(58, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  return registerMouseEventCallback(target, userData, useCapture, callbackfunc, 5, "mousedown", targetThread);
}

function _emscripten_set_mouseenter_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(59, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  return registerMouseEventCallback(target, userData, useCapture, callbackfunc, 33, "mouseenter", targetThread);
}

function _emscripten_set_mouseleave_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(60, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  return registerMouseEventCallback(target, userData, useCapture, callbackfunc, 34, "mouseleave", targetThread);
}

function _emscripten_set_mousemove_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(61, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  return registerMouseEventCallback(target, userData, useCapture, callbackfunc, 8, "mousemove", targetThread);
}

function _emscripten_set_mouseup_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(62, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  return registerMouseEventCallback(target, userData, useCapture, callbackfunc, 6, "mouseup", targetThread);
}

var fillPointerlockChangeEventData = eventStruct => {
  var pointerLockElement = document.pointerLockElement;
  var isPointerlocked = !!pointerLockElement;
  // Assigning a boolean to HEAP32 with expected type coercion.
  /** @suppress{checkTypes} */ (growMemViews(), HEAP8)[eventStruct] = isPointerlocked;
  var nodeName = JSEvents.getNodeNameForTarget(pointerLockElement);
  var id = pointerLockElement?.id || "";
  stringToUTF8(nodeName, eventStruct + 1, 128);
  stringToUTF8(id, eventStruct + 129, 128);
};

var registerPointerlockChangeEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
  targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
  var eventSize = 257;
  JSEvents.pointerlockChangeEvent ||= _malloc(eventSize);
  var pointerlockChangeEventHandlerFunc = e => {
    var pointerlockChangeEvent = JSEvents.pointerlockChangeEvent;
    fillPointerlockChangeEventData(pointerlockChangeEvent);
    if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, pointerlockChangeEvent, eventSize, userData); else if (getWasmTableEntry(callbackfunc)(eventTypeId, pointerlockChangeEvent, userData)) e.preventDefault();
  };
  var eventHandler = {
    target,
    eventTypeString,
    eventTypeId,
    userData,
    callbackfunc,
    handlerFunc: pointerlockChangeEventHandlerFunc,
    useCapture
  };
  return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_pointerlockchange_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(63, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  if (!document.body?.requestPointerLock) {
    return -1;
  }
  target = findEventTarget(target);
  if (!target) return -4;
  return registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "pointerlockchange", targetThread);
}

var registerUiEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
  targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
  var eventSize = 36;
  JSEvents.uiEvent ||= _malloc(eventSize);
  target = findEventTarget(target);
  var uiEventHandlerFunc = e => {
    if (e.target != target) {
      // Never take ui events such as scroll via a 'bubbled' route, but always from the direct element that
      // was targeted. Otherwise e.g. if app logs a message in response to a page scroll, the Emscripten log
      // message box could cause to scroll, generating a new (bubbled) scroll message, causing a new log print,
      // causing a new scroll, etc..
      return;
    }
    var b = document.body;
    // Take document.body to a variable, Closure compiler does not outline access to it on its own.
    if (!b) {
      // During a page unload 'body' can be null, with "Cannot read property 'clientWidth' of null" being thrown
      return;
    }
    var uiEvent = JSEvents.uiEvent;
    (growMemViews(), HEAP32)[((uiEvent) >> 2)] = 0;
    // always zero for resize and scroll
    (growMemViews(), HEAP32)[(((uiEvent) + (4)) >> 2)] = b.clientWidth;
    (growMemViews(), HEAP32)[(((uiEvent) + (8)) >> 2)] = b.clientHeight;
    (growMemViews(), HEAP32)[(((uiEvent) + (12)) >> 2)] = innerWidth;
    (growMemViews(), HEAP32)[(((uiEvent) + (16)) >> 2)] = innerHeight;
    (growMemViews(), HEAP32)[(((uiEvent) + (20)) >> 2)] = outerWidth;
    (growMemViews(), HEAP32)[(((uiEvent) + (24)) >> 2)] = outerHeight;
    (growMemViews(), HEAP32)[(((uiEvent) + (28)) >> 2)] = pageXOffset | 0;
    // scroll offsets are float
    (growMemViews(), HEAP32)[(((uiEvent) + (32)) >> 2)] = pageYOffset | 0;
    if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, uiEvent, eventSize, userData); else if (getWasmTableEntry(callbackfunc)(eventTypeId, uiEvent, userData)) e.preventDefault();
  };
  var eventHandler = {
    target,
    eventTypeString,
    eventTypeId,
    userData,
    callbackfunc,
    handlerFunc: uiEventHandlerFunc,
    useCapture
  };
  return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_resize_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(64, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  return registerUiEventCallback(target, userData, useCapture, callbackfunc, 10, "resize", targetThread);
}

var registerTouchEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
  targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
  var eventSize = 1552;
  JSEvents.touchEvent ||= _malloc(eventSize);
  target = findEventTarget(target);
  var touchEventHandlerFunc = e => {
    var t, touches = {}, et = e.touches;
    // To ease marshalling different kinds of touches that browser reports (all touches are listed in e.touches,
    // only changed touches in e.changedTouches, and touches on target at a.targetTouches), mark a boolean in
    // each Touch object so that we can later loop only once over all touches we see to marshall over to Wasm.
    for (let t of et) {
      // Browser might recycle the generated Touch objects between each frame (Firefox on Android), so reset any
      // changed/target states we may have set from previous frame.
      t.isChanged = t.onTarget = 0;
      touches[t.identifier] = t;
    }
    // Mark which touches are part of the changedTouches list.
    for (let t of e.changedTouches) {
      t.isChanged = 1;
      touches[t.identifier] = t;
    }
    // Mark which touches are part of the targetTouches list.
    for (let t of e.targetTouches) {
      touches[t.identifier].onTarget = 1;
    }
    var touchEvent = JSEvents.touchEvent;
    (growMemViews(), HEAPF64)[((touchEvent) >> 3)] = e.timeStamp;
    (growMemViews(), HEAP8)[touchEvent + 12] = e.ctrlKey;
    (growMemViews(), HEAP8)[touchEvent + 13] = e.shiftKey;
    (growMemViews(), HEAP8)[touchEvent + 14] = e.altKey;
    (growMemViews(), HEAP8)[touchEvent + 15] = e.metaKey;
    var idx = touchEvent + 16;
    var targetRect = getBoundingClientRect(target);
    var numTouches = 0;
    for (let t of Object.values(touches)) {
      var idx32 = ((idx) >> 2);
      // Pre-shift the ptr to index to HEAP32 to save code size
      (growMemViews(), HEAP32)[idx32 + 0] = t.identifier;
      (growMemViews(), HEAP32)[idx32 + 1] = t.screenX;
      (growMemViews(), HEAP32)[idx32 + 2] = t.screenY;
      (growMemViews(), HEAP32)[idx32 + 3] = t.clientX;
      (growMemViews(), HEAP32)[idx32 + 4] = t.clientY;
      (growMemViews(), HEAP32)[idx32 + 5] = t.pageX;
      (growMemViews(), HEAP32)[idx32 + 6] = t.pageY;
      (growMemViews(), HEAP8)[idx + 28] = t.isChanged;
      (growMemViews(), HEAP8)[idx + 29] = t.onTarget;
      (growMemViews(), HEAP32)[idx32 + 8] = t.clientX - (targetRect.left | 0);
      (growMemViews(), HEAP32)[idx32 + 9] = t.clientY - (targetRect.top | 0);
      idx += 48;
      if (++numTouches > 31) {
        break;
      }
    }
    (growMemViews(), HEAP32)[(((touchEvent) + (8)) >> 2)] = numTouches;
    if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, touchEvent, eventSize, userData); else if (getWasmTableEntry(callbackfunc)(eventTypeId, touchEvent, userData)) e.preventDefault();
  };
  var eventHandler = {
    target,
    allowsDeferredCalls: eventTypeString == "touchstart" || eventTypeString == "touchend",
    eventTypeString,
    eventTypeId,
    userData,
    callbackfunc,
    handlerFunc: touchEventHandlerFunc,
    useCapture
  };
  return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_touchcancel_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(65, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  return registerTouchEventCallback(target, userData, useCapture, callbackfunc, 25, "touchcancel", targetThread);
}

function _emscripten_set_touchend_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(66, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  return registerTouchEventCallback(target, userData, useCapture, callbackfunc, 23, "touchend", targetThread);
}

function _emscripten_set_touchmove_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(67, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  return registerTouchEventCallback(target, userData, useCapture, callbackfunc, 24, "touchmove", targetThread);
}

function _emscripten_set_touchstart_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(68, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  return registerTouchEventCallback(target, userData, useCapture, callbackfunc, 22, "touchstart", targetThread);
}

var fillVisibilityChangeEventData = eventStruct => {
  var visibilityStates = [ "hidden", "visible", "prerender", "unloaded" ];
  var visibilityState = visibilityStates.indexOf(document.visibilityState);
  // Assigning a boolean to HEAP32 with expected type coercion.
  /** @suppress{checkTypes} */ (growMemViews(), HEAP8)[eventStruct] = document.hidden;
  (growMemViews(), HEAP32)[(((eventStruct) + (4)) >> 2)] = visibilityState;
};

var registerVisibilityChangeEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
  targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
  var eventSize = 8;
  JSEvents.visibilityChangeEvent ||= _malloc(eventSize);
  var visibilityChangeEventHandlerFunc = e => {
    var visibilityChangeEvent = JSEvents.visibilityChangeEvent;
    fillVisibilityChangeEventData(visibilityChangeEvent);
    if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, visibilityChangeEvent, eventSize, userData); else if (getWasmTableEntry(callbackfunc)(eventTypeId, visibilityChangeEvent, userData)) e.preventDefault();
  };
  var eventHandler = {
    target,
    eventTypeString,
    eventTypeId,
    userData,
    callbackfunc,
    handlerFunc: visibilityChangeEventHandlerFunc,
    useCapture
  };
  return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_visibilitychange_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(69, 0, 1, userData, useCapture, callbackfunc, targetThread);
  if (!specialHTMLTargets[1]) {
    return -4;
  }
  return registerVisibilityChangeEventCallback(specialHTMLTargets[1], userData, useCapture, callbackfunc, 21, "visibilitychange", targetThread);
}

var registerWheelEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
  targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
  var eventSize = 96;
  JSEvents.wheelEvent ||= _malloc(eventSize);
  // The DOM Level 3 events spec event 'wheel'
  var wheelHandlerFunc = e => {
    var wheelEvent = JSEvents.wheelEvent;
    fillMouseEventData(wheelEvent, e, target);
    (growMemViews(), HEAPF64)[(((wheelEvent) + (64)) >> 3)] = e["deltaX"];
    (growMemViews(), HEAPF64)[(((wheelEvent) + (72)) >> 3)] = e["deltaY"];
    (growMemViews(), HEAPF64)[(((wheelEvent) + (80)) >> 3)] = e["deltaZ"];
    (growMemViews(), HEAP32)[(((wheelEvent) + (88)) >> 2)] = e["deltaMode"];
    if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, wheelEvent, eventSize, userData); else if (getWasmTableEntry(callbackfunc)(eventTypeId, wheelEvent, userData)) e.preventDefault();
  };
  var eventHandler = {
    target,
    allowsDeferredCalls: true,
    eventTypeString,
    eventTypeId,
    userData,
    callbackfunc,
    handlerFunc: wheelHandlerFunc,
    useCapture
  };
  return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_wheel_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(70, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  target = findEventTarget(target);
  if (!target) return -4;
  if (typeof target.onwheel != "undefined") {
    return registerWheelEventCallback(target, userData, useCapture, callbackfunc, 9, "wheel", targetThread);
  } else {
    return -1;
  }
}

function _emscripten_set_window_title(title) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(71, 0, 1, title);
  return document.title = UTF8ToString(title);
}

var _emscripten_sleep = () => {
  abort("Please compile your program with async support in order to use asynchronous operations like emscripten_sleep");
};

var ENV = {};

var getExecutableName = () => thisProgram || "./this.program";

var getEnvStrings = () => {
  if (!getEnvStrings.strings) {
    // Default values.
    // Browser language detection #8751
    var lang = (globalThis.navigator?.language ?? "C").replace("-", "_") + ".UTF-8";
    var env = {
      "USER": "web_user",
      "LOGNAME": "web_user",
      "PATH": "/",
      "PWD": "/",
      "HOME": "/home/web_user",
      "LANG": lang,
      "_": getExecutableName()
    };
    // Apply the user-provided values, if any.
    for (var x in ENV) {
      // x is a key in ENV; if ENV[x] is undefined, that means it was
      // explicitly set to be so. We allow user code to do that to
      // force variables with default values to remain unset.
      if (ENV[x] === undefined) delete env[x]; else env[x] = ENV[x];
    }
    var strings = [];
    for (var x in env) {
      strings.push(`${x}=${env[x]}`);
    }
    getEnvStrings.strings = strings;
  }
  return getEnvStrings.strings;
};

function _environ_get(__environ, environ_buf) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(72, 0, 1, __environ, environ_buf);
  var bufSize = 0;
  var envp = 0;
  for (var string of getEnvStrings()) {
    var ptr = environ_buf + bufSize;
    (growMemViews(), HEAPU32)[(((__environ) + (envp)) >> 2)] = ptr;
    bufSize += stringToUTF8(string, ptr, Infinity) + 1;
    envp += 4;
  }
  return 0;
}

function _environ_sizes_get(penviron_count, penviron_buf_size) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(73, 0, 1, penviron_count, penviron_buf_size);
  var strings = getEnvStrings();
  (growMemViews(), HEAPU32)[((penviron_count) >> 2)] = strings.length;
  var bufSize = 0;
  for (var string of strings) {
    bufSize += lengthBytesUTF8(string) + 1;
  }
  (growMemViews(), HEAPU32)[((penviron_buf_size) >> 2)] = bufSize;
  return 0;
}

function _fd_close(fd) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(74, 0, 1, fd);
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    FS.close(stream);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

/** @param {number=} offset */ var doReadv = (stream, iov, iovcnt, offset) => {
  var ret = 0;
  for (var i = 0; i < iovcnt; i++) {
    var ptr = (growMemViews(), HEAPU32)[((iov) >> 2)];
    var len = (growMemViews(), HEAPU32)[(((iov) + (4)) >> 2)];
    iov += 8;
    var curr = FS.read(stream, (growMemViews(), HEAP8), ptr, len, offset);
    if (curr < 0) return -1;
    ret += curr;
    if (curr < len) break;
    // nothing more to read
    if (typeof offset != "undefined") {
      offset += curr;
    }
  }
  return ret;
};

function _fd_read(fd, iov, iovcnt, pnum) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(75, 0, 1, fd, iov, iovcnt, pnum);
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var num = doReadv(stream, iov, iovcnt);
    (growMemViews(), HEAPU32)[((pnum) >> 2)] = num;
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

function _fd_seek(fd, offset, whence, newOffset) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(76, 0, 1, fd, offset, whence, newOffset);
  offset = bigintToI53Checked(offset);
  try {
    if (isNaN(offset)) return 61;
    var stream = SYSCALLS.getStreamFromFD(fd);
    FS.llseek(stream, offset, whence);
    (growMemViews(), HEAP64)[((newOffset) >> 3)] = BigInt(stream.position);
    if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
    // reset readdir state
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

/** @param {number=} offset */ var doWritev = (stream, iov, iovcnt, offset) => {
  var ret = 0;
  for (var i = 0; i < iovcnt; i++) {
    var ptr = (growMemViews(), HEAPU32)[((iov) >> 2)];
    var len = (growMemViews(), HEAPU32)[(((iov) + (4)) >> 2)];
    iov += 8;
    var curr = FS.write(stream, (growMemViews(), HEAP8), ptr, len, offset);
    if (curr < 0) return -1;
    ret += curr;
    if (curr < len) {
      // No more space to write.
      break;
    }
    if (typeof offset != "undefined") {
      offset += curr;
    }
  }
  return ret;
};

function _fd_write(fd, iov, iovcnt, pnum) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(77, 0, 1, fd, iov, iovcnt, pnum);
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var num = doWritev(stream, iov, iovcnt);
    (growMemViews(), HEAPU32)[((pnum) >> 2)] = num;
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

var _glActiveTexture = _emscripten_glActiveTexture;

var _glAttachShader = _emscripten_glAttachShader;

var _glBindBuffer = _emscripten_glBindBuffer;

var _glBindTexture = _emscripten_glBindTexture;

var _glBlendColor = _emscripten_glBlendColor;

var _glBlendFunc = _emscripten_glBlendFunc;

var _glBufferData = _emscripten_glBufferData;

var _glClear = _emscripten_glClear;

var _glClearColor = _emscripten_glClearColor;

var _glClearDepthf = _emscripten_glClearDepthf;

var _glColorMask = _emscripten_glColorMask;

var _glCompileShader = _emscripten_glCompileShader;

var _glCreateProgram = _emscripten_glCreateProgram;

var _glCreateShader = _emscripten_glCreateShader;

var _glCullFace = _emscripten_glCullFace;

var _glDeleteBuffers = _emscripten_glDeleteBuffers;

var _glDeleteProgram = _emscripten_glDeleteProgram;

var _glDeleteShader = _emscripten_glDeleteShader;

var _glDeleteTextures = _emscripten_glDeleteTextures;

var _glDepthFunc = _emscripten_glDepthFunc;

var _glDepthMask = _emscripten_glDepthMask;

var _glDisable = _emscripten_glDisable;

var _glDrawArrays = _emscripten_glDrawArrays;

var _glEnable = _emscripten_glEnable;

var _glEnableVertexAttribArray = _emscripten_glEnableVertexAttribArray;

var _glFlush = _emscripten_glFlush;

var _glGenBuffers = _emscripten_glGenBuffers;

var _glGenTextures = _emscripten_glGenTextures;

var _glGetError = _emscripten_glGetError;

var _glGetProgramInfoLog = _emscripten_glGetProgramInfoLog;

var _glGetProgramiv = _emscripten_glGetProgramiv;

var _glGetShaderInfoLog = _emscripten_glGetShaderInfoLog;

var _glGetShaderiv = _emscripten_glGetShaderiv;

var _glGetTexParameteriv = _emscripten_glGetTexParameteriv;

var _glGetUniformLocation = _emscripten_glGetUniformLocation;

var _glLineWidth = _emscripten_glLineWidth;

var _glLinkProgram = _emscripten_glLinkProgram;

var _glPolygonOffset = _emscripten_glPolygonOffset;

var _glShaderSource = _emscripten_glShaderSource;

var _glStencilFunc = _emscripten_glStencilFunc;

var _glStencilMask = _emscripten_glStencilMask;

var _glTexImage2D = _emscripten_glTexImage2D;

var _glTexParameteri = _emscripten_glTexParameteri;

var _glTexSubImage2D = _emscripten_glTexSubImage2D;

var _glUniform1f = _emscripten_glUniform1f;

var _glUniform1i = _emscripten_glUniform1i;

var _glUniform2fv = _emscripten_glUniform2fv;

var _glUniform3f = _emscripten_glUniform3f;

var _glUniform3fv = _emscripten_glUniform3fv;

var _glUniform4fv = _emscripten_glUniform4fv;

var _glUniformMatrix3fv = _emscripten_glUniformMatrix3fv;

var _glUniformMatrix4fv = _emscripten_glUniformMatrix4fv;

var _glUseProgram = _emscripten_glUseProgram;

var _glVertexAttribIPointer = _emscripten_glVertexAttribIPointer;

var _glVertexAttribPointer = _emscripten_glVertexAttribPointer;

var _glViewport = _emscripten_glViewport;

var autoResumeAudioContext = ctx => {
  for (var event of [ "keydown", "mousedown", "touchstart" ]) {
    for (var element of [ document, document.getElementById("canvas") ]) {
      element?.addEventListener(event, () => {
        if (ctx.state === "suspended") ctx.resume();
      }, {
        "once": true
      });
    }
  }
};

var dynCall = (sig, ptr, args = [], promising = false) => {
  var func = getWasmTableEntry(ptr);
  var rtn = func(...args);
  function convert(rtn) {
    return rtn;
  }
  return convert(rtn);
};

var requestFullscreen = Browser.requestFullscreen;

var FS_createPath = (...args) => FS.createPath(...args);

var FS_unlink = (...args) => FS.unlink(...args);

var FS_createLazyFile = (...args) => FS.createLazyFile(...args);

var FS_createDevice = (...args) => FS.createDevice(...args);

var createContext = Browser.createContext;

PThread.init();

FS.createPreloadedFile = FS_createPreloadedFile;

FS.preloadFile = FS_preloadFile;

FS.staticInit();

// Signal GL rendering layer that processing of a new frame is about to
// start. This helps it optimize VBO double-buffering and reduce GPU stalls.
registerPreMainLoop(() => GL.newRenderingFrameStarted());

Module["requestAnimationFrame"] = MainLoop.requestAnimationFrame;

Module["pauseMainLoop"] = MainLoop.pause;

Module["resumeMainLoop"] = MainLoop.resume;

MainLoop.init();

for (let i = 0; i < 32; ++i) tempFixedLengthArray.push(new Array(i));

var miniTempWebGLFloatBuffersStorage = new Float32Array(288);

// Create GL_POOL_TEMP_BUFFERS_SIZE+1 temporary buffers, for uploads of size 0 through GL_POOL_TEMP_BUFFERS_SIZE inclusive
for (/**@suppress{duplicate}*/ var i = 0; i <= 288; ++i) {
  miniTempWebGLFloatBuffers[i] = miniTempWebGLFloatBuffersStorage.subarray(0, i);
}

var miniTempWebGLIntBuffersStorage = new Int32Array(288);

// Create GL_POOL_TEMP_BUFFERS_SIZE+1 temporary buffers, for uploads of size 0 through GL_POOL_TEMP_BUFFERS_SIZE inclusive
for (/**@suppress{duplicate}*/ var i = 0; i <= 288; ++i) {
  miniTempWebGLIntBuffers[i] = miniTempWebGLIntBuffersStorage.subarray(0, i);
}

// End JS library code
// include: postlibrary.js
// This file is included after the automatically-generated JS library code
// but before the wasm module is created.
{
  // With WASM_ESM_INTEGRATION this has to happen at the top level and not
  // delayed until processModuleArgs.
  initMemory();
  // Begin ATMODULES hooks
  if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];
  if (Module["preloadPlugins"]) preloadPlugins = Module["preloadPlugins"];
  if (Module["print"]) out = Module["print"];
  if (Module["printErr"]) err = Module["printErr"];
  if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
  // End ATMODULES hooks
  if (Module["arguments"]) arguments_ = Module["arguments"];
  if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
  if (Module["preInit"]) {
    if (typeof Module["preInit"] == "function") Module["preInit"] = [ Module["preInit"] ];
    while (Module["preInit"].length > 0) {
      Module["preInit"].shift()();
    }
  }
}

// Begin runtime exports
Module["addRunDependency"] = addRunDependency;

Module["removeRunDependency"] = removeRunDependency;

Module["requestFullscreen"] = requestFullscreen;

Module["createContext"] = createContext;

Module["FS_preloadFile"] = FS_preloadFile;

Module["FS_unlink"] = FS_unlink;

Module["FS_createPath"] = FS_createPath;

Module["FS_createDevice"] = FS_createDevice;

Module["FS_createDataFile"] = FS_createDataFile;

Module["FS_createLazyFile"] = FS_createLazyFile;

// End runtime exports
// Begin JS library exports
// End JS library exports
// end include: postlibrary.js
// proxiedFunctionTable specifies the list of functions that can be called
// either synchronously or asynchronously from other threads in postMessage()d
// or internally queued events. This way a pthread in a Worker can synchronously
// access e.g. the DOM on the main thread.
var proxiedFunctionTable = [ _proc_exit, exitOnMainThread, pthreadCreateProxied, ___syscall_faccessat, ___syscall_fcntl64, ___syscall_fstat64, ___syscall_getdents64, ___syscall_ioctl, ___syscall_lstat64, ___syscall_mkdirat, ___syscall_newfstatat, ___syscall_openat, ___syscall_readlinkat, ___syscall_renameat, ___syscall_rmdir, ___syscall_stat64, ___syscall_unlinkat, __mmap_js, __munmap_js, _eglBindAPI, _eglChooseConfig, _eglCreateContext, _eglCreateWindowSurface, _eglDestroyContext, _eglDestroySurface, _eglGetConfigAttrib, _eglGetDisplay, _eglGetError, _eglInitialize, _eglMakeCurrent, _eglQueryString, _eglSwapBuffers, _eglSwapInterval, _eglTerminate, _eglWaitClient, _eglWaitNative, _emscripten_exit_fullscreen, getCanvasSizeMainThread, setCanvasElementSizeMainThread, _emscripten_exit_pointerlock, _emscripten_get_device_pixel_ratio, _emscripten_get_element_css_size, _emscripten_get_gamepad_status, _emscripten_get_num_gamepads, _emscripten_get_screen_size, _emscripten_request_fullscreen_strategy, _emscripten_request_pointerlock, _emscripten_sample_gamepad_data, _emscripten_set_beforeunload_callback_on_thread, _emscripten_set_blur_callback_on_thread, _emscripten_set_element_css_size, _emscripten_set_focus_callback_on_thread, _emscripten_set_fullscreenchange_callback_on_thread, _emscripten_set_gamepadconnected_callback_on_thread, _emscripten_set_gamepaddisconnected_callback_on_thread, _emscripten_set_keydown_callback_on_thread, _emscripten_set_keypress_callback_on_thread, _emscripten_set_keyup_callback_on_thread, _emscripten_set_mousedown_callback_on_thread, _emscripten_set_mouseenter_callback_on_thread, _emscripten_set_mouseleave_callback_on_thread, _emscripten_set_mousemove_callback_on_thread, _emscripten_set_mouseup_callback_on_thread, _emscripten_set_pointerlockchange_callback_on_thread, _emscripten_set_resize_callback_on_thread, _emscripten_set_touchcancel_callback_on_thread, _emscripten_set_touchend_callback_on_thread, _emscripten_set_touchmove_callback_on_thread, _emscripten_set_touchstart_callback_on_thread, _emscripten_set_visibilitychange_callback_on_thread, _emscripten_set_wheel_callback_on_thread, _emscripten_set_window_title, _environ_get, _environ_sizes_get, _fd_close, _fd_read, _fd_seek, _fd_write ];

var ASM_CONSTS = {
  913616: ($0, $1, $2, $3, $4) => {
    if (typeof window === "undefined" || (window.AudioContext || window.webkitAudioContext) === undefined) {
      return 0;
    }
    if (typeof (window.miniaudio) === "undefined") {
      window.miniaudio = {
        referenceCount: 0
      };
      window.miniaudio.device_type = {};
      window.miniaudio.device_type.playback = $0;
      window.miniaudio.device_type.capture = $1;
      window.miniaudio.device_type.duplex = $2;
      window.miniaudio.device_state = {};
      window.miniaudio.device_state.stopped = $3;
      window.miniaudio.device_state.started = $4;
      let miniaudio = window.miniaudio;
      miniaudio.devices = [];
      miniaudio.track_device = function(device) {
        for (var iDevice = 0; iDevice < miniaudio.devices.length; ++iDevice) {
          if (miniaudio.devices[iDevice] == null) {
            miniaudio.devices[iDevice] = device;
            return iDevice;
          }
        }
        miniaudio.devices.push(device);
        return miniaudio.devices.length - 1;
      };
      miniaudio.untrack_device_by_index = function(deviceIndex) {
        miniaudio.devices[deviceIndex] = null;
        while (miniaudio.devices.length > 0) {
          if (miniaudio.devices[miniaudio.devices.length - 1] == null) {
            miniaudio.devices.pop();
          } else {
            break;
          }
        }
      };
      miniaudio.untrack_device = function(device) {
        for (var iDevice = 0; iDevice < miniaudio.devices.length; ++iDevice) {
          if (miniaudio.devices[iDevice] == device) {
            return miniaudio.untrack_device_by_index(iDevice);
          }
        }
      };
      miniaudio.get_device_by_index = function(deviceIndex) {
        return miniaudio.devices[deviceIndex];
      };
      miniaudio.unlock_event_types = (function() {
        return [ "touchend", "click" ];
      })();
      miniaudio.unlock = function() {
        for (var i = 0; i < miniaudio.devices.length; ++i) {
          var device = miniaudio.devices[i];
          if (device != null && device.webaudio != null && device.state === miniaudio.device_state.started) {
            device.webaudio.resume().then(() => {
              _ma_device__on_notification_unlocked(device.pDevice);
            }, error => {
              console.error("Failed to resume audiocontext", error);
            });
          }
        }
        miniaudio.unlock_event_types.map(function(event_type) {
          document.removeEventListener(event_type, miniaudio.unlock, true);
        });
      };
      miniaudio.unlock_event_types.map(function(event_type) {
        document.addEventListener(event_type, miniaudio.unlock, true);
      });
    }
    window.miniaudio.referenceCount += 1;
    return 1;
  },
  915794: () => {
    if (typeof (window.miniaudio) !== "undefined") {
      window.miniaudio.unlock_event_types.map(function(event_type) {
        document.removeEventListener(event_type, window.miniaudio.unlock, true);
      });
      window.miniaudio.referenceCount -= 1;
      if (window.miniaudio.referenceCount === 0) {
        delete window.miniaudio;
      }
    }
  },
  916098: () => (navigator.mediaDevices !== undefined && navigator.mediaDevices.getUserMedia !== undefined),
  916202: () => {
    try {
      var temp = new (window.AudioContext || window.webkitAudioContext);
      var sampleRate = temp.sampleRate;
      temp.close();
      return sampleRate;
    } catch (e) {
      return 0;
    }
  },
  916373: ($0, $1, $2, $3, $4, $5) => {
    var deviceType = $0;
    var channels = $1;
    var sampleRate = $2;
    var bufferSize = $3;
    var pIntermediaryBuffer = $4;
    var pDevice = $5;
    if (typeof (window.miniaudio) === "undefined") {
      return -1;
    }
    var device = {};
    var audioContextOptions = {};
    if (deviceType == window.miniaudio.device_type.playback && sampleRate != 0) {
      audioContextOptions.sampleRate = sampleRate;
    }
    device.webaudio = new (window.AudioContext || window.webkitAudioContext)(audioContextOptions);
    device.webaudio.suspend();
    device.state = window.miniaudio.device_state.stopped;
    var channelCountIn = 0;
    var channelCountOut = channels;
    if (deviceType != window.miniaudio.device_type.playback) {
      channelCountIn = channels;
    }
    device.scriptNode = device.webaudio.createScriptProcessor(bufferSize, channelCountIn, channelCountOut);
    device.scriptNode.onaudioprocess = function(e) {
      if (device.intermediaryBufferView == null || device.intermediaryBufferView.length == 0) {
        device.intermediaryBufferView = new Float32Array((growMemViews(), HEAPF32).buffer, Number(pIntermediaryBuffer), bufferSize * channels);
      }
      if (deviceType == window.miniaudio.device_type.capture || deviceType == window.miniaudio.device_type.duplex) {
        for (var iChannel = 0; iChannel < channels; iChannel += 1) {
          var inputBuffer = e.inputBuffer.getChannelData(iChannel);
          var intermediaryBuffer = device.intermediaryBufferView;
          for (var iFrame = 0; iFrame < bufferSize; iFrame += 1) {
            intermediaryBuffer[iFrame * channels + iChannel] = inputBuffer[iFrame];
          }
        }
        _ma_device_process_pcm_frames_capture__webaudio(pDevice, bufferSize, pIntermediaryBuffer);
      }
      if (deviceType == window.miniaudio.device_type.playback || deviceType == window.miniaudio.device_type.duplex) {
        _ma_device_process_pcm_frames_playback__webaudio(pDevice, bufferSize, pIntermediaryBuffer);
        for (var iChannel = 0; iChannel < e.outputBuffer.numberOfChannels; ++iChannel) {
          var outputBuffer = e.outputBuffer.getChannelData(iChannel);
          var intermediaryBuffer = device.intermediaryBufferView;
          for (var iFrame = 0; iFrame < bufferSize; iFrame += 1) {
            outputBuffer[iFrame] = intermediaryBuffer[iFrame * channels + iChannel];
          }
        }
      } else {
        for (var iChannel = 0; iChannel < e.outputBuffer.numberOfChannels; ++iChannel) {
          e.outputBuffer.getChannelData(iChannel).fill(0);
        }
      }
    };
    if (deviceType == window.miniaudio.device_type.capture || deviceType == window.miniaudio.device_type.duplex) {
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      }).then(function(stream) {
        device.streamNode = device.webaudio.createMediaStreamSource(stream);
        device.streamNode.connect(device.scriptNode);
        device.scriptNode.connect(device.webaudio.destination);
      }).catch(function(error) {
        console.log("Failed to get user media: " + error);
      });
    }
    if (deviceType == window.miniaudio.device_type.playback) {
      device.scriptNode.connect(device.webaudio.destination);
    }
    device.pDevice = pDevice;
    return window.miniaudio.track_device(device);
  },
  919258: $0 => window.miniaudio.get_device_by_index($0).webaudio.sampleRate,
  919331: $0 => {
    var device = window.miniaudio.get_device_by_index($0);
    if (device.scriptNode !== undefined) {
      device.scriptNode.onaudioprocess = function(e) {};
      device.scriptNode.disconnect();
      device.scriptNode = undefined;
    }
    if (device.streamNode !== undefined) {
      device.streamNode.disconnect();
      device.streamNode = undefined;
    }
    device.webaudio.close();
    device.webaudio = undefined;
    device.pDevice = undefined;
  },
  919731: $0 => {
    window.miniaudio.untrack_device_by_index($0);
  },
  919781: $0 => {
    var device = window.miniaudio.get_device_by_index($0);
    device.webaudio.resume();
    device.state = window.miniaudio.device_state.started;
  },
  919920: $0 => {
    var device = window.miniaudio.get_device_by_index($0);
    device.webaudio.suspend();
    device.state = window.miniaudio.device_state.stopped;
  },
  920060: $0 => {
    var str = UTF8ToString($0) + "\n\n" + "Abort/Retry/Ignore/AlwaysIgnore? [ariA] :";
    var reply = window.prompt(str, "i");
    if (reply === null) {
      reply = "i";
    }
    return reply.length === 1 ? reply.charCodeAt(0) : -1;
  },
  920275: () => {
    if (typeof (AudioContext) !== "undefined") {
      return true;
    } else if (typeof (webkitAudioContext) !== "undefined") {
      return true;
    }
    return false;
  },
  920422: () => {
    if ((typeof (navigator.mediaDevices) !== "undefined") && (typeof (navigator.mediaDevices.getUserMedia) !== "undefined")) {
      return true;
    } else if (typeof (navigator.webkitGetUserMedia) !== "undefined") {
      return true;
    }
    return false;
  },
  920656: $0 => {
    if (typeof (Module["SDL2"]) === "undefined") {
      Module["SDL2"] = {};
    }
    var SDL2 = Module["SDL2"];
    if (!$0) {
      SDL2.audio = {};
    } else {
      SDL2.capture = {};
    }
    if (!SDL2.audioContext) {
      if (typeof (AudioContext) !== "undefined") {
        SDL2.audioContext = new AudioContext;
      } else if (typeof (webkitAudioContext) !== "undefined") {
        SDL2.audioContext = new webkitAudioContext;
      }
      if (SDL2.audioContext) {
        if ((typeof navigator.userActivation) === "undefined") {
          autoResumeAudioContext(SDL2.audioContext);
        }
      }
    }
    return SDL2.audioContext === undefined ? -1 : 0;
  },
  921208: () => {
    var SDL2 = Module["SDL2"];
    return SDL2.audioContext.sampleRate;
  },
  921276: ($0, $1, $2, $3) => {
    var SDL2 = Module["SDL2"];
    var have_microphone = function(stream) {
      if (SDL2.capture.silenceTimer !== undefined) {
        clearInterval(SDL2.capture.silenceTimer);
        SDL2.capture.silenceTimer = undefined;
        SDL2.capture.silenceBuffer = undefined;
      }
      SDL2.capture.mediaStreamNode = SDL2.audioContext.createMediaStreamSource(stream);
      SDL2.capture.scriptProcessorNode = SDL2.audioContext.createScriptProcessor($1, $0, 1);
      SDL2.capture.scriptProcessorNode.onaudioprocess = function(audioProcessingEvent) {
        if ((SDL2 === undefined) || (SDL2.capture === undefined)) {
          return;
        }
        audioProcessingEvent.outputBuffer.getChannelData(0).fill(0);
        SDL2.capture.currentCaptureBuffer = audioProcessingEvent.inputBuffer;
        dynCall("vp", $2, [ $3 ]);
      };
      SDL2.capture.mediaStreamNode.connect(SDL2.capture.scriptProcessorNode);
      SDL2.capture.scriptProcessorNode.connect(SDL2.audioContext.destination);
      SDL2.capture.stream = stream;
    };
    var no_microphone = function(error) {};
    SDL2.capture.silenceBuffer = SDL2.audioContext.createBuffer($0, $1, SDL2.audioContext.sampleRate);
    SDL2.capture.silenceBuffer.getChannelData(0).fill(0);
    var silence_callback = function() {
      SDL2.capture.currentCaptureBuffer = SDL2.capture.silenceBuffer;
      dynCall("vp", $2, [ $3 ]);
    };
    SDL2.capture.silenceTimer = setInterval(silence_callback, ($1 / SDL2.audioContext.sampleRate) * 1e3);
    if ((navigator.mediaDevices !== undefined) && (navigator.mediaDevices.getUserMedia !== undefined)) {
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      }).then(have_microphone).catch(no_microphone);
    } else if (navigator.webkitGetUserMedia !== undefined) {
      navigator.webkitGetUserMedia({
        audio: true,
        video: false
      }, have_microphone, no_microphone);
    }
  },
  922969: ($0, $1, $2, $3) => {
    var SDL2 = Module["SDL2"];
    SDL2.audio.scriptProcessorNode = SDL2.audioContext["createScriptProcessor"]($1, 0, $0);
    SDL2.audio.scriptProcessorNode["onaudioprocess"] = function(e) {
      if ((SDL2 === undefined) || (SDL2.audio === undefined)) {
        return;
      }
      if (SDL2.audio.silenceTimer !== undefined) {
        clearInterval(SDL2.audio.silenceTimer);
        SDL2.audio.silenceTimer = undefined;
        SDL2.audio.silenceBuffer = undefined;
      }
      SDL2.audio.currentOutputBuffer = e["outputBuffer"];
      dynCall("vp", $2, [ $3 ]);
    };
    SDL2.audio.scriptProcessorNode["connect"](SDL2.audioContext["destination"]);
    if (SDL2.audioContext.state === "suspended") {
      SDL2.audio.silenceBuffer = SDL2.audioContext.createBuffer($0, $1, SDL2.audioContext.sampleRate);
      SDL2.audio.silenceBuffer.getChannelData(0).fill(0);
      var silence_callback = function() {
        if ((typeof navigator.userActivation) !== "undefined") {
          if (navigator.userActivation.hasBeenActive) {
            SDL2.audioContext.resume();
          }
        }
        SDL2.audio.currentOutputBuffer = SDL2.audio.silenceBuffer;
        dynCall("vp", $2, [ $3 ]);
        SDL2.audio.currentOutputBuffer = undefined;
      };
      SDL2.audio.silenceTimer = setInterval(silence_callback, ($1 / SDL2.audioContext.sampleRate) * 1e3);
    }
  },
  924144: ($0, $1) => {
    var SDL2 = Module["SDL2"];
    var numChannels = SDL2.capture.currentCaptureBuffer.numberOfChannels;
    for (var c = 0; c < numChannels; ++c) {
      var channelData = SDL2.capture.currentCaptureBuffer.getChannelData(c);
      if (channelData.length != $1) {
        throw "Web Audio capture buffer length mismatch! Destination size: " + channelData.length + " samples vs expected " + $1 + " samples!";
      }
      if (numChannels == 1) {
        for (var j = 0; j < $1; ++j) {
          setValue($0 + (j * 4), channelData[j], "float");
        }
      } else {
        for (var j = 0; j < $1; ++j) {
          setValue($0 + (((j * numChannels) + c) * 4), channelData[j], "float");
        }
      }
    }
  },
  924749: ($0, $1) => {
    var SDL2 = Module["SDL2"];
    var buf = $0 >>> 2;
    var numChannels = SDL2.audio.currentOutputBuffer["numberOfChannels"];
    for (var c = 0; c < numChannels; ++c) {
      var channelData = SDL2.audio.currentOutputBuffer["getChannelData"](c);
      if (channelData.length != $1) {
        throw "Web Audio output buffer length mismatch! Destination size: " + channelData.length + " samples vs expected " + $1 + " samples!";
      }
      for (var j = 0; j < $1; ++j) {
        channelData[j] = (growMemViews(), HEAPF32)[buf + (j * numChannels + c)];
      }
    }
  },
  925238: $0 => {
    var SDL2 = Module["SDL2"];
    if ($0) {
      if (SDL2.capture.silenceTimer !== undefined) {
        clearInterval(SDL2.capture.silenceTimer);
      }
      if (SDL2.capture.stream !== undefined) {
        var tracks = SDL2.capture.stream.getAudioTracks();
        for (var i = 0; i < tracks.length; i++) {
          SDL2.capture.stream.removeTrack(tracks[i]);
        }
      }
      if (SDL2.capture.scriptProcessorNode !== undefined) {
        SDL2.capture.scriptProcessorNode.onaudioprocess = function(audioProcessingEvent) {};
        SDL2.capture.scriptProcessorNode.disconnect();
      }
      if (SDL2.capture.mediaStreamNode !== undefined) {
        SDL2.capture.mediaStreamNode.disconnect();
      }
      SDL2.capture = undefined;
    } else {
      if (SDL2.audio.scriptProcessorNode != undefined) {
        SDL2.audio.scriptProcessorNode.disconnect();
      }
      if (SDL2.audio.silenceTimer !== undefined) {
        clearInterval(SDL2.audio.silenceTimer);
      }
      SDL2.audio = undefined;
    }
    if ((SDL2.audioContext !== undefined) && (SDL2.audio === undefined) && (SDL2.capture === undefined)) {
      SDL2.audioContext.close();
      SDL2.audioContext = undefined;
    }
  },
  926244: ($0, $1, $2) => {
    var w = $0;
    var h = $1;
    var pixels = $2;
    if (!Module["SDL2"]) Module["SDL2"] = {};
    var SDL2 = Module["SDL2"];
    if (SDL2.ctxCanvas !== Module["canvas"]) {
      SDL2.ctx = Browser.createContext(Module["canvas"], false, true);
      SDL2.ctxCanvas = Module["canvas"];
    }
    if (SDL2.w !== w || SDL2.h !== h || SDL2.imageCtx !== SDL2.ctx) {
      SDL2.image = SDL2.ctx.createImageData(w, h);
      SDL2.w = w;
      SDL2.h = h;
      SDL2.imageCtx = SDL2.ctx;
    }
    var data = SDL2.image.data;
    var src = pixels / 4;
    var dst = 0;
    var num;
    if (typeof CanvasPixelArray !== "undefined" && data instanceof CanvasPixelArray) {
      num = data.length;
      while (dst < num) {
        var val = (growMemViews(), HEAP32)[src];
        data[dst] = val & 255;
        data[dst + 1] = (val >> 8) & 255;
        data[dst + 2] = (val >> 16) & 255;
        data[dst + 3] = 255;
        src++;
        dst += 4;
      }
    } else {
      if (SDL2.data32Data !== data) {
        SDL2.data32 = new Int32Array(data.buffer);
        SDL2.data8 = new Uint8Array(data.buffer);
        SDL2.data32Data = data;
      }
      var data32 = SDL2.data32;
      num = data32.length;
      data32.set((growMemViews(), HEAP32).subarray(src, src + num));
      var data8 = SDL2.data8;
      var i = 3;
      var j = i + 4 * num;
      if (num % 8 == 0) {
        while (i < j) {
          data8[i] = 255;
          i = i + 4 | 0;
          data8[i] = 255;
          i = i + 4 | 0;
          data8[i] = 255;
          i = i + 4 | 0;
          data8[i] = 255;
          i = i + 4 | 0;
          data8[i] = 255;
          i = i + 4 | 0;
          data8[i] = 255;
          i = i + 4 | 0;
          data8[i] = 255;
          i = i + 4 | 0;
          data8[i] = 255;
          i = i + 4 | 0;
        }
      } else {
        while (i < j) {
          data8[i] = 255;
          i = i + 4 | 0;
        }
      }
    }
    SDL2.ctx.putImageData(SDL2.image, 0, 0);
  },
  927710: ($0, $1, $2, $3, $4) => {
    var w = $0;
    var h = $1;
    var hot_x = $2;
    var hot_y = $3;
    var pixels = $4;
    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext("2d");
    var image = ctx.createImageData(w, h);
    var data = image.data;
    var src = pixels / 4;
    var dst = 0;
    var num;
    if (typeof CanvasPixelArray !== "undefined" && data instanceof CanvasPixelArray) {
      num = data.length;
      while (dst < num) {
        var val = (growMemViews(), HEAP32)[src];
        data[dst] = val & 255;
        data[dst + 1] = (val >> 8) & 255;
        data[dst + 2] = (val >> 16) & 255;
        data[dst + 3] = (val >> 24) & 255;
        src++;
        dst += 4;
      }
    } else {
      var data32 = new Int32Array(data.buffer);
      num = data32.length;
      data32.set((growMemViews(), HEAP32).subarray(src, src + num));
    }
    ctx.putImageData(image, 0, 0);
    var url = hot_x === 0 && hot_y === 0 ? "url(" + canvas.toDataURL() + "), auto" : "url(" + canvas.toDataURL() + ") " + hot_x + " " + hot_y + ", auto";
    var urlBuf = _malloc(url.length + 1);
    stringToUTF8(url, urlBuf, url.length + 1);
    return urlBuf;
  },
  928698: $0 => {
    if (Module["canvas"]) {
      Module["canvas"].style["cursor"] = UTF8ToString($0);
    }
  },
  928781: () => {
    if (Module["canvas"]) {
      Module["canvas"].style["cursor"] = "none";
    }
  },
  928850: () => window.innerWidth,
  928880: () => window.innerHeight
};

// Imports from the Wasm binary.
var _malloc, _free, _ma_device__on_notification_unlocked, _ma_malloc_emscripten, _ma_free_emscripten, _ma_device_process_pcm_frames_capture__webaudio, _ma_device_process_pcm_frames_playback__webaudio, _main, _pthread_self, __emscripten_tls_init, _emscripten_builtin_memalign, __emscripten_run_callback_on_thread, __emscripten_thread_init, __emscripten_thread_crashed, __emscripten_run_js_on_main_thread_done, __emscripten_run_js_on_main_thread, __emscripten_thread_free_data, __emscripten_thread_exit, __emscripten_check_mailbox, _emscripten_stack_set_limits, __emscripten_stack_restore, __emscripten_stack_alloc, _emscripten_stack_get_current, __indirect_function_table, wasmTable;

function assignWasmExports(wasmExports) {
  _malloc = wasmExports["malloc"];
  _free = wasmExports["free"];
  _ma_device__on_notification_unlocked = Module["_ma_device__on_notification_unlocked"] = wasmExports["ma_device__on_notification_unlocked"];
  _ma_malloc_emscripten = Module["_ma_malloc_emscripten"] = wasmExports["ma_malloc_emscripten"];
  _ma_free_emscripten = Module["_ma_free_emscripten"] = wasmExports["ma_free_emscripten"];
  _ma_device_process_pcm_frames_capture__webaudio = Module["_ma_device_process_pcm_frames_capture__webaudio"] = wasmExports["ma_device_process_pcm_frames_capture__webaudio"];
  _ma_device_process_pcm_frames_playback__webaudio = Module["_ma_device_process_pcm_frames_playback__webaudio"] = wasmExports["ma_device_process_pcm_frames_playback__webaudio"];
  _main = Module["_main"] = wasmExports["__main_argc_argv"];
  _pthread_self = wasmExports["pthread_self"];
  __emscripten_tls_init = wasmExports["_emscripten_tls_init"];
  _emscripten_builtin_memalign = wasmExports["emscripten_builtin_memalign"];
  __emscripten_run_callback_on_thread = wasmExports["_emscripten_run_callback_on_thread"];
  __emscripten_thread_init = wasmExports["_emscripten_thread_init"];
  __emscripten_thread_crashed = wasmExports["_emscripten_thread_crashed"];
  __emscripten_run_js_on_main_thread_done = wasmExports["_emscripten_run_js_on_main_thread_done"];
  __emscripten_run_js_on_main_thread = wasmExports["_emscripten_run_js_on_main_thread"];
  __emscripten_thread_free_data = wasmExports["_emscripten_thread_free_data"];
  __emscripten_thread_exit = wasmExports["_emscripten_thread_exit"];
  __emscripten_check_mailbox = wasmExports["_emscripten_check_mailbox"];
  _emscripten_stack_set_limits = wasmExports["emscripten_stack_set_limits"];
  __emscripten_stack_restore = wasmExports["_emscripten_stack_restore"];
  __emscripten_stack_alloc = wasmExports["_emscripten_stack_alloc"];
  _emscripten_stack_get_current = wasmExports["emscripten_stack_get_current"];
  __indirect_function_table = wasmTable = wasmExports["__indirect_function_table"];
}

var wasmImports;

function assignWasmImports() {
  wasmImports = {
    /** @export */ __assert_fail: ___assert_fail,
    /** @export */ __call_sighandler: ___call_sighandler,
    /** @export */ __cxa_throw: ___cxa_throw,
    /** @export */ __pthread_create_js: ___pthread_create_js,
    /** @export */ __syscall_faccessat: ___syscall_faccessat,
    /** @export */ __syscall_fcntl64: ___syscall_fcntl64,
    /** @export */ __syscall_fstat64: ___syscall_fstat64,
    /** @export */ __syscall_getdents64: ___syscall_getdents64,
    /** @export */ __syscall_ioctl: ___syscall_ioctl,
    /** @export */ __syscall_lstat64: ___syscall_lstat64,
    /** @export */ __syscall_mkdirat: ___syscall_mkdirat,
    /** @export */ __syscall_newfstatat: ___syscall_newfstatat,
    /** @export */ __syscall_openat: ___syscall_openat,
    /** @export */ __syscall_readlinkat: ___syscall_readlinkat,
    /** @export */ __syscall_renameat: ___syscall_renameat,
    /** @export */ __syscall_rmdir: ___syscall_rmdir,
    /** @export */ __syscall_stat64: ___syscall_stat64,
    /** @export */ __syscall_unlinkat: ___syscall_unlinkat,
    /** @export */ _abort_js: __abort_js,
    /** @export */ _emscripten_init_main_thread_js: __emscripten_init_main_thread_js,
    /** @export */ _emscripten_notify_mailbox_postmessage: __emscripten_notify_mailbox_postmessage,
    /** @export */ _emscripten_receive_on_main_thread_js: __emscripten_receive_on_main_thread_js,
    /** @export */ _emscripten_runtime_keepalive_clear: __emscripten_runtime_keepalive_clear,
    /** @export */ _emscripten_thread_cleanup: __emscripten_thread_cleanup,
    /** @export */ _emscripten_thread_mailbox_await: __emscripten_thread_mailbox_await,
    /** @export */ _emscripten_thread_set_strongref: __emscripten_thread_set_strongref,
    /** @export */ _gmtime_js: __gmtime_js,
    /** @export */ _localtime_js: __localtime_js,
    /** @export */ _mmap_js: __mmap_js,
    /** @export */ _munmap_js: __munmap_js,
    /** @export */ _tzset_js: __tzset_js,
    /** @export */ clock_time_get: _clock_time_get,
    /** @export */ eglBindAPI: _eglBindAPI,
    /** @export */ eglChooseConfig: _eglChooseConfig,
    /** @export */ eglCreateContext: _eglCreateContext,
    /** @export */ eglCreateWindowSurface: _eglCreateWindowSurface,
    /** @export */ eglDestroyContext: _eglDestroyContext,
    /** @export */ eglDestroySurface: _eglDestroySurface,
    /** @export */ eglGetConfigAttrib: _eglGetConfigAttrib,
    /** @export */ eglGetDisplay: _eglGetDisplay,
    /** @export */ eglGetError: _eglGetError,
    /** @export */ eglInitialize: _eglInitialize,
    /** @export */ eglMakeCurrent: _eglMakeCurrent,
    /** @export */ eglQueryString: _eglQueryString,
    /** @export */ eglSwapBuffers: _eglSwapBuffers,
    /** @export */ eglSwapInterval: _eglSwapInterval,
    /** @export */ eglTerminate: _eglTerminate,
    /** @export */ eglWaitGL: _eglWaitGL,
    /** @export */ eglWaitNative: _eglWaitNative,
    /** @export */ emscripten_asm_const_int: _emscripten_asm_const_int,
    /** @export */ emscripten_asm_const_int_sync_on_main_thread: _emscripten_asm_const_int_sync_on_main_thread,
    /** @export */ emscripten_asm_const_ptr_sync_on_main_thread: _emscripten_asm_const_ptr_sync_on_main_thread,
    /** @export */ emscripten_cancel_main_loop: _emscripten_cancel_main_loop,
    /** @export */ emscripten_check_blocking_allowed: _emscripten_check_blocking_allowed,
    /** @export */ emscripten_date_now: _emscripten_date_now,
    /** @export */ emscripten_exit_fullscreen: _emscripten_exit_fullscreen,
    /** @export */ emscripten_exit_pointerlock: _emscripten_exit_pointerlock,
    /** @export */ emscripten_exit_with_live_runtime: _emscripten_exit_with_live_runtime,
    /** @export */ emscripten_get_device_pixel_ratio: _emscripten_get_device_pixel_ratio,
    /** @export */ emscripten_get_element_css_size: _emscripten_get_element_css_size,
    /** @export */ emscripten_get_gamepad_status: _emscripten_get_gamepad_status,
    /** @export */ emscripten_get_heap_max: _emscripten_get_heap_max,
    /** @export */ emscripten_get_now: _emscripten_get_now,
    /** @export */ emscripten_get_num_gamepads: _emscripten_get_num_gamepads,
    /** @export */ emscripten_get_screen_size: _emscripten_get_screen_size,
    /** @export */ emscripten_glActiveTexture: _emscripten_glActiveTexture,
    /** @export */ emscripten_glAttachShader: _emscripten_glAttachShader,
    /** @export */ emscripten_glBeginQuery: _emscripten_glBeginQuery,
    /** @export */ emscripten_glBeginQueryEXT: _emscripten_glBeginQueryEXT,
    /** @export */ emscripten_glBeginTransformFeedback: _emscripten_glBeginTransformFeedback,
    /** @export */ emscripten_glBindAttribLocation: _emscripten_glBindAttribLocation,
    /** @export */ emscripten_glBindBuffer: _emscripten_glBindBuffer,
    /** @export */ emscripten_glBindBufferBase: _emscripten_glBindBufferBase,
    /** @export */ emscripten_glBindBufferRange: _emscripten_glBindBufferRange,
    /** @export */ emscripten_glBindFramebuffer: _emscripten_glBindFramebuffer,
    /** @export */ emscripten_glBindRenderbuffer: _emscripten_glBindRenderbuffer,
    /** @export */ emscripten_glBindSampler: _emscripten_glBindSampler,
    /** @export */ emscripten_glBindTexture: _emscripten_glBindTexture,
    /** @export */ emscripten_glBindTransformFeedback: _emscripten_glBindTransformFeedback,
    /** @export */ emscripten_glBindVertexArray: _emscripten_glBindVertexArray,
    /** @export */ emscripten_glBindVertexArrayOES: _emscripten_glBindVertexArrayOES,
    /** @export */ emscripten_glBlendColor: _emscripten_glBlendColor,
    /** @export */ emscripten_glBlendEquation: _emscripten_glBlendEquation,
    /** @export */ emscripten_glBlendEquationSeparate: _emscripten_glBlendEquationSeparate,
    /** @export */ emscripten_glBlendFunc: _emscripten_glBlendFunc,
    /** @export */ emscripten_glBlendFuncSeparate: _emscripten_glBlendFuncSeparate,
    /** @export */ emscripten_glBlitFramebuffer: _emscripten_glBlitFramebuffer,
    /** @export */ emscripten_glBufferData: _emscripten_glBufferData,
    /** @export */ emscripten_glBufferSubData: _emscripten_glBufferSubData,
    /** @export */ emscripten_glCheckFramebufferStatus: _emscripten_glCheckFramebufferStatus,
    /** @export */ emscripten_glClear: _emscripten_glClear,
    /** @export */ emscripten_glClearBufferfi: _emscripten_glClearBufferfi,
    /** @export */ emscripten_glClearBufferfv: _emscripten_glClearBufferfv,
    /** @export */ emscripten_glClearBufferiv: _emscripten_glClearBufferiv,
    /** @export */ emscripten_glClearBufferuiv: _emscripten_glClearBufferuiv,
    /** @export */ emscripten_glClearColor: _emscripten_glClearColor,
    /** @export */ emscripten_glClearDepthf: _emscripten_glClearDepthf,
    /** @export */ emscripten_glClearStencil: _emscripten_glClearStencil,
    /** @export */ emscripten_glClientWaitSync: _emscripten_glClientWaitSync,
    /** @export */ emscripten_glClipControlEXT: _emscripten_glClipControlEXT,
    /** @export */ emscripten_glColorMask: _emscripten_glColorMask,
    /** @export */ emscripten_glCompileShader: _emscripten_glCompileShader,
    /** @export */ emscripten_glCompressedTexImage2D: _emscripten_glCompressedTexImage2D,
    /** @export */ emscripten_glCompressedTexImage3D: _emscripten_glCompressedTexImage3D,
    /** @export */ emscripten_glCompressedTexSubImage2D: _emscripten_glCompressedTexSubImage2D,
    /** @export */ emscripten_glCompressedTexSubImage3D: _emscripten_glCompressedTexSubImage3D,
    /** @export */ emscripten_glCopyBufferSubData: _emscripten_glCopyBufferSubData,
    /** @export */ emscripten_glCopyTexImage2D: _emscripten_glCopyTexImage2D,
    /** @export */ emscripten_glCopyTexSubImage2D: _emscripten_glCopyTexSubImage2D,
    /** @export */ emscripten_glCopyTexSubImage3D: _emscripten_glCopyTexSubImage3D,
    /** @export */ emscripten_glCreateProgram: _emscripten_glCreateProgram,
    /** @export */ emscripten_glCreateShader: _emscripten_glCreateShader,
    /** @export */ emscripten_glCullFace: _emscripten_glCullFace,
    /** @export */ emscripten_glDeleteBuffers: _emscripten_glDeleteBuffers,
    /** @export */ emscripten_glDeleteFramebuffers: _emscripten_glDeleteFramebuffers,
    /** @export */ emscripten_glDeleteProgram: _emscripten_glDeleteProgram,
    /** @export */ emscripten_glDeleteQueries: _emscripten_glDeleteQueries,
    /** @export */ emscripten_glDeleteQueriesEXT: _emscripten_glDeleteQueriesEXT,
    /** @export */ emscripten_glDeleteRenderbuffers: _emscripten_glDeleteRenderbuffers,
    /** @export */ emscripten_glDeleteSamplers: _emscripten_glDeleteSamplers,
    /** @export */ emscripten_glDeleteShader: _emscripten_glDeleteShader,
    /** @export */ emscripten_glDeleteSync: _emscripten_glDeleteSync,
    /** @export */ emscripten_glDeleteTextures: _emscripten_glDeleteTextures,
    /** @export */ emscripten_glDeleteTransformFeedbacks: _emscripten_glDeleteTransformFeedbacks,
    /** @export */ emscripten_glDeleteVertexArrays: _emscripten_glDeleteVertexArrays,
    /** @export */ emscripten_glDeleteVertexArraysOES: _emscripten_glDeleteVertexArraysOES,
    /** @export */ emscripten_glDepthFunc: _emscripten_glDepthFunc,
    /** @export */ emscripten_glDepthMask: _emscripten_glDepthMask,
    /** @export */ emscripten_glDepthRangef: _emscripten_glDepthRangef,
    /** @export */ emscripten_glDetachShader: _emscripten_glDetachShader,
    /** @export */ emscripten_glDisable: _emscripten_glDisable,
    /** @export */ emscripten_glDisableVertexAttribArray: _emscripten_glDisableVertexAttribArray,
    /** @export */ emscripten_glDrawArrays: _emscripten_glDrawArrays,
    /** @export */ emscripten_glDrawArraysInstanced: _emscripten_glDrawArraysInstanced,
    /** @export */ emscripten_glDrawArraysInstancedANGLE: _emscripten_glDrawArraysInstancedANGLE,
    /** @export */ emscripten_glDrawArraysInstancedARB: _emscripten_glDrawArraysInstancedARB,
    /** @export */ emscripten_glDrawArraysInstancedEXT: _emscripten_glDrawArraysInstancedEXT,
    /** @export */ emscripten_glDrawArraysInstancedNV: _emscripten_glDrawArraysInstancedNV,
    /** @export */ emscripten_glDrawBuffers: _emscripten_glDrawBuffers,
    /** @export */ emscripten_glDrawBuffersEXT: _emscripten_glDrawBuffersEXT,
    /** @export */ emscripten_glDrawBuffersWEBGL: _emscripten_glDrawBuffersWEBGL,
    /** @export */ emscripten_glDrawElements: _emscripten_glDrawElements,
    /** @export */ emscripten_glDrawElementsInstanced: _emscripten_glDrawElementsInstanced,
    /** @export */ emscripten_glDrawElementsInstancedANGLE: _emscripten_glDrawElementsInstancedANGLE,
    /** @export */ emscripten_glDrawElementsInstancedARB: _emscripten_glDrawElementsInstancedARB,
    /** @export */ emscripten_glDrawElementsInstancedEXT: _emscripten_glDrawElementsInstancedEXT,
    /** @export */ emscripten_glDrawElementsInstancedNV: _emscripten_glDrawElementsInstancedNV,
    /** @export */ emscripten_glDrawRangeElements: _emscripten_glDrawRangeElements,
    /** @export */ emscripten_glEnable: _emscripten_glEnable,
    /** @export */ emscripten_glEnableVertexAttribArray: _emscripten_glEnableVertexAttribArray,
    /** @export */ emscripten_glEndQuery: _emscripten_glEndQuery,
    /** @export */ emscripten_glEndQueryEXT: _emscripten_glEndQueryEXT,
    /** @export */ emscripten_glEndTransformFeedback: _emscripten_glEndTransformFeedback,
    /** @export */ emscripten_glFenceSync: _emscripten_glFenceSync,
    /** @export */ emscripten_glFinish: _emscripten_glFinish,
    /** @export */ emscripten_glFlush: _emscripten_glFlush,
    /** @export */ emscripten_glFlushMappedBufferRange: _emscripten_glFlushMappedBufferRange,
    /** @export */ emscripten_glFramebufferRenderbuffer: _emscripten_glFramebufferRenderbuffer,
    /** @export */ emscripten_glFramebufferTexture2D: _emscripten_glFramebufferTexture2D,
    /** @export */ emscripten_glFramebufferTextureLayer: _emscripten_glFramebufferTextureLayer,
    /** @export */ emscripten_glFrontFace: _emscripten_glFrontFace,
    /** @export */ emscripten_glGenBuffers: _emscripten_glGenBuffers,
    /** @export */ emscripten_glGenFramebuffers: _emscripten_glGenFramebuffers,
    /** @export */ emscripten_glGenQueries: _emscripten_glGenQueries,
    /** @export */ emscripten_glGenQueriesEXT: _emscripten_glGenQueriesEXT,
    /** @export */ emscripten_glGenRenderbuffers: _emscripten_glGenRenderbuffers,
    /** @export */ emscripten_glGenSamplers: _emscripten_glGenSamplers,
    /** @export */ emscripten_glGenTextures: _emscripten_glGenTextures,
    /** @export */ emscripten_glGenTransformFeedbacks: _emscripten_glGenTransformFeedbacks,
    /** @export */ emscripten_glGenVertexArrays: _emscripten_glGenVertexArrays,
    /** @export */ emscripten_glGenVertexArraysOES: _emscripten_glGenVertexArraysOES,
    /** @export */ emscripten_glGenerateMipmap: _emscripten_glGenerateMipmap,
    /** @export */ emscripten_glGetActiveAttrib: _emscripten_glGetActiveAttrib,
    /** @export */ emscripten_glGetActiveUniform: _emscripten_glGetActiveUniform,
    /** @export */ emscripten_glGetActiveUniformBlockName: _emscripten_glGetActiveUniformBlockName,
    /** @export */ emscripten_glGetActiveUniformBlockiv: _emscripten_glGetActiveUniformBlockiv,
    /** @export */ emscripten_glGetActiveUniformsiv: _emscripten_glGetActiveUniformsiv,
    /** @export */ emscripten_glGetAttachedShaders: _emscripten_glGetAttachedShaders,
    /** @export */ emscripten_glGetAttribLocation: _emscripten_glGetAttribLocation,
    /** @export */ emscripten_glGetBooleanv: _emscripten_glGetBooleanv,
    /** @export */ emscripten_glGetBufferParameteri64v: _emscripten_glGetBufferParameteri64v,
    /** @export */ emscripten_glGetBufferParameteriv: _emscripten_glGetBufferParameteriv,
    /** @export */ emscripten_glGetBufferPointerv: _emscripten_glGetBufferPointerv,
    /** @export */ emscripten_glGetError: _emscripten_glGetError,
    /** @export */ emscripten_glGetFloatv: _emscripten_glGetFloatv,
    /** @export */ emscripten_glGetFragDataLocation: _emscripten_glGetFragDataLocation,
    /** @export */ emscripten_glGetFramebufferAttachmentParameteriv: _emscripten_glGetFramebufferAttachmentParameteriv,
    /** @export */ emscripten_glGetInteger64i_v: _emscripten_glGetInteger64i_v,
    /** @export */ emscripten_glGetInteger64v: _emscripten_glGetInteger64v,
    /** @export */ emscripten_glGetIntegeri_v: _emscripten_glGetIntegeri_v,
    /** @export */ emscripten_glGetIntegerv: _emscripten_glGetIntegerv,
    /** @export */ emscripten_glGetInternalformativ: _emscripten_glGetInternalformativ,
    /** @export */ emscripten_glGetProgramBinary: _emscripten_glGetProgramBinary,
    /** @export */ emscripten_glGetProgramInfoLog: _emscripten_glGetProgramInfoLog,
    /** @export */ emscripten_glGetProgramiv: _emscripten_glGetProgramiv,
    /** @export */ emscripten_glGetQueryObjecti64vEXT: _emscripten_glGetQueryObjecti64vEXT,
    /** @export */ emscripten_glGetQueryObjectivEXT: _emscripten_glGetQueryObjectivEXT,
    /** @export */ emscripten_glGetQueryObjectui64vEXT: _emscripten_glGetQueryObjectui64vEXT,
    /** @export */ emscripten_glGetQueryObjectuiv: _emscripten_glGetQueryObjectuiv,
    /** @export */ emscripten_glGetQueryObjectuivEXT: _emscripten_glGetQueryObjectuivEXT,
    /** @export */ emscripten_glGetQueryiv: _emscripten_glGetQueryiv,
    /** @export */ emscripten_glGetQueryivEXT: _emscripten_glGetQueryivEXT,
    /** @export */ emscripten_glGetRenderbufferParameteriv: _emscripten_glGetRenderbufferParameteriv,
    /** @export */ emscripten_glGetSamplerParameterfv: _emscripten_glGetSamplerParameterfv,
    /** @export */ emscripten_glGetSamplerParameteriv: _emscripten_glGetSamplerParameteriv,
    /** @export */ emscripten_glGetShaderInfoLog: _emscripten_glGetShaderInfoLog,
    /** @export */ emscripten_glGetShaderPrecisionFormat: _emscripten_glGetShaderPrecisionFormat,
    /** @export */ emscripten_glGetShaderSource: _emscripten_glGetShaderSource,
    /** @export */ emscripten_glGetShaderiv: _emscripten_glGetShaderiv,
    /** @export */ emscripten_glGetString: _emscripten_glGetString,
    /** @export */ emscripten_glGetStringi: _emscripten_glGetStringi,
    /** @export */ emscripten_glGetSynciv: _emscripten_glGetSynciv,
    /** @export */ emscripten_glGetTexParameterfv: _emscripten_glGetTexParameterfv,
    /** @export */ emscripten_glGetTexParameteriv: _emscripten_glGetTexParameteriv,
    /** @export */ emscripten_glGetTransformFeedbackVarying: _emscripten_glGetTransformFeedbackVarying,
    /** @export */ emscripten_glGetUniformBlockIndex: _emscripten_glGetUniformBlockIndex,
    /** @export */ emscripten_glGetUniformIndices: _emscripten_glGetUniformIndices,
    /** @export */ emscripten_glGetUniformLocation: _emscripten_glGetUniformLocation,
    /** @export */ emscripten_glGetUniformfv: _emscripten_glGetUniformfv,
    /** @export */ emscripten_glGetUniformiv: _emscripten_glGetUniformiv,
    /** @export */ emscripten_glGetUniformuiv: _emscripten_glGetUniformuiv,
    /** @export */ emscripten_glGetVertexAttribIiv: _emscripten_glGetVertexAttribIiv,
    /** @export */ emscripten_glGetVertexAttribIuiv: _emscripten_glGetVertexAttribIuiv,
    /** @export */ emscripten_glGetVertexAttribPointerv: _emscripten_glGetVertexAttribPointerv,
    /** @export */ emscripten_glGetVertexAttribfv: _emscripten_glGetVertexAttribfv,
    /** @export */ emscripten_glGetVertexAttribiv: _emscripten_glGetVertexAttribiv,
    /** @export */ emscripten_glHint: _emscripten_glHint,
    /** @export */ emscripten_glInvalidateFramebuffer: _emscripten_glInvalidateFramebuffer,
    /** @export */ emscripten_glInvalidateSubFramebuffer: _emscripten_glInvalidateSubFramebuffer,
    /** @export */ emscripten_glIsBuffer: _emscripten_glIsBuffer,
    /** @export */ emscripten_glIsEnabled: _emscripten_glIsEnabled,
    /** @export */ emscripten_glIsFramebuffer: _emscripten_glIsFramebuffer,
    /** @export */ emscripten_glIsProgram: _emscripten_glIsProgram,
    /** @export */ emscripten_glIsQuery: _emscripten_glIsQuery,
    /** @export */ emscripten_glIsQueryEXT: _emscripten_glIsQueryEXT,
    /** @export */ emscripten_glIsRenderbuffer: _emscripten_glIsRenderbuffer,
    /** @export */ emscripten_glIsSampler: _emscripten_glIsSampler,
    /** @export */ emscripten_glIsShader: _emscripten_glIsShader,
    /** @export */ emscripten_glIsSync: _emscripten_glIsSync,
    /** @export */ emscripten_glIsTexture: _emscripten_glIsTexture,
    /** @export */ emscripten_glIsTransformFeedback: _emscripten_glIsTransformFeedback,
    /** @export */ emscripten_glIsVertexArray: _emscripten_glIsVertexArray,
    /** @export */ emscripten_glIsVertexArrayOES: _emscripten_glIsVertexArrayOES,
    /** @export */ emscripten_glLineWidth: _emscripten_glLineWidth,
    /** @export */ emscripten_glLinkProgram: _emscripten_glLinkProgram,
    /** @export */ emscripten_glMapBufferRange: _emscripten_glMapBufferRange,
    /** @export */ emscripten_glPauseTransformFeedback: _emscripten_glPauseTransformFeedback,
    /** @export */ emscripten_glPixelStorei: _emscripten_glPixelStorei,
    /** @export */ emscripten_glPolygonModeWEBGL: _emscripten_glPolygonModeWEBGL,
    /** @export */ emscripten_glPolygonOffset: _emscripten_glPolygonOffset,
    /** @export */ emscripten_glPolygonOffsetClampEXT: _emscripten_glPolygonOffsetClampEXT,
    /** @export */ emscripten_glProgramBinary: _emscripten_glProgramBinary,
    /** @export */ emscripten_glProgramParameteri: _emscripten_glProgramParameteri,
    /** @export */ emscripten_glQueryCounterEXT: _emscripten_glQueryCounterEXT,
    /** @export */ emscripten_glReadBuffer: _emscripten_glReadBuffer,
    /** @export */ emscripten_glReadPixels: _emscripten_glReadPixels,
    /** @export */ emscripten_glReleaseShaderCompiler: _emscripten_glReleaseShaderCompiler,
    /** @export */ emscripten_glRenderbufferStorage: _emscripten_glRenderbufferStorage,
    /** @export */ emscripten_glRenderbufferStorageMultisample: _emscripten_glRenderbufferStorageMultisample,
    /** @export */ emscripten_glResumeTransformFeedback: _emscripten_glResumeTransformFeedback,
    /** @export */ emscripten_glSampleCoverage: _emscripten_glSampleCoverage,
    /** @export */ emscripten_glSamplerParameterf: _emscripten_glSamplerParameterf,
    /** @export */ emscripten_glSamplerParameterfv: _emscripten_glSamplerParameterfv,
    /** @export */ emscripten_glSamplerParameteri: _emscripten_glSamplerParameteri,
    /** @export */ emscripten_glSamplerParameteriv: _emscripten_glSamplerParameteriv,
    /** @export */ emscripten_glScissor: _emscripten_glScissor,
    /** @export */ emscripten_glShaderBinary: _emscripten_glShaderBinary,
    /** @export */ emscripten_glShaderSource: _emscripten_glShaderSource,
    /** @export */ emscripten_glStencilFunc: _emscripten_glStencilFunc,
    /** @export */ emscripten_glStencilFuncSeparate: _emscripten_glStencilFuncSeparate,
    /** @export */ emscripten_glStencilMask: _emscripten_glStencilMask,
    /** @export */ emscripten_glStencilMaskSeparate: _emscripten_glStencilMaskSeparate,
    /** @export */ emscripten_glStencilOp: _emscripten_glStencilOp,
    /** @export */ emscripten_glStencilOpSeparate: _emscripten_glStencilOpSeparate,
    /** @export */ emscripten_glTexImage2D: _emscripten_glTexImage2D,
    /** @export */ emscripten_glTexImage3D: _emscripten_glTexImage3D,
    /** @export */ emscripten_glTexParameterf: _emscripten_glTexParameterf,
    /** @export */ emscripten_glTexParameterfv: _emscripten_glTexParameterfv,
    /** @export */ emscripten_glTexParameteri: _emscripten_glTexParameteri,
    /** @export */ emscripten_glTexParameteriv: _emscripten_glTexParameteriv,
    /** @export */ emscripten_glTexStorage2D: _emscripten_glTexStorage2D,
    /** @export */ emscripten_glTexStorage3D: _emscripten_glTexStorage3D,
    /** @export */ emscripten_glTexSubImage2D: _emscripten_glTexSubImage2D,
    /** @export */ emscripten_glTexSubImage3D: _emscripten_glTexSubImage3D,
    /** @export */ emscripten_glTransformFeedbackVaryings: _emscripten_glTransformFeedbackVaryings,
    /** @export */ emscripten_glUniform1f: _emscripten_glUniform1f,
    /** @export */ emscripten_glUniform1fv: _emscripten_glUniform1fv,
    /** @export */ emscripten_glUniform1i: _emscripten_glUniform1i,
    /** @export */ emscripten_glUniform1iv: _emscripten_glUniform1iv,
    /** @export */ emscripten_glUniform1ui: _emscripten_glUniform1ui,
    /** @export */ emscripten_glUniform1uiv: _emscripten_glUniform1uiv,
    /** @export */ emscripten_glUniform2f: _emscripten_glUniform2f,
    /** @export */ emscripten_glUniform2fv: _emscripten_glUniform2fv,
    /** @export */ emscripten_glUniform2i: _emscripten_glUniform2i,
    /** @export */ emscripten_glUniform2iv: _emscripten_glUniform2iv,
    /** @export */ emscripten_glUniform2ui: _emscripten_glUniform2ui,
    /** @export */ emscripten_glUniform2uiv: _emscripten_glUniform2uiv,
    /** @export */ emscripten_glUniform3f: _emscripten_glUniform3f,
    /** @export */ emscripten_glUniform3fv: _emscripten_glUniform3fv,
    /** @export */ emscripten_glUniform3i: _emscripten_glUniform3i,
    /** @export */ emscripten_glUniform3iv: _emscripten_glUniform3iv,
    /** @export */ emscripten_glUniform3ui: _emscripten_glUniform3ui,
    /** @export */ emscripten_glUniform3uiv: _emscripten_glUniform3uiv,
    /** @export */ emscripten_glUniform4f: _emscripten_glUniform4f,
    /** @export */ emscripten_glUniform4fv: _emscripten_glUniform4fv,
    /** @export */ emscripten_glUniform4i: _emscripten_glUniform4i,
    /** @export */ emscripten_glUniform4iv: _emscripten_glUniform4iv,
    /** @export */ emscripten_glUniform4ui: _emscripten_glUniform4ui,
    /** @export */ emscripten_glUniform4uiv: _emscripten_glUniform4uiv,
    /** @export */ emscripten_glUniformBlockBinding: _emscripten_glUniformBlockBinding,
    /** @export */ emscripten_glUniformMatrix2fv: _emscripten_glUniformMatrix2fv,
    /** @export */ emscripten_glUniformMatrix2x3fv: _emscripten_glUniformMatrix2x3fv,
    /** @export */ emscripten_glUniformMatrix2x4fv: _emscripten_glUniformMatrix2x4fv,
    /** @export */ emscripten_glUniformMatrix3fv: _emscripten_glUniformMatrix3fv,
    /** @export */ emscripten_glUniformMatrix3x2fv: _emscripten_glUniformMatrix3x2fv,
    /** @export */ emscripten_glUniformMatrix3x4fv: _emscripten_glUniformMatrix3x4fv,
    /** @export */ emscripten_glUniformMatrix4fv: _emscripten_glUniformMatrix4fv,
    /** @export */ emscripten_glUniformMatrix4x2fv: _emscripten_glUniformMatrix4x2fv,
    /** @export */ emscripten_glUniformMatrix4x3fv: _emscripten_glUniformMatrix4x3fv,
    /** @export */ emscripten_glUnmapBuffer: _emscripten_glUnmapBuffer,
    /** @export */ emscripten_glUseProgram: _emscripten_glUseProgram,
    /** @export */ emscripten_glValidateProgram: _emscripten_glValidateProgram,
    /** @export */ emscripten_glVertexAttrib1f: _emscripten_glVertexAttrib1f,
    /** @export */ emscripten_glVertexAttrib1fv: _emscripten_glVertexAttrib1fv,
    /** @export */ emscripten_glVertexAttrib2f: _emscripten_glVertexAttrib2f,
    /** @export */ emscripten_glVertexAttrib2fv: _emscripten_glVertexAttrib2fv,
    /** @export */ emscripten_glVertexAttrib3f: _emscripten_glVertexAttrib3f,
    /** @export */ emscripten_glVertexAttrib3fv: _emscripten_glVertexAttrib3fv,
    /** @export */ emscripten_glVertexAttrib4f: _emscripten_glVertexAttrib4f,
    /** @export */ emscripten_glVertexAttrib4fv: _emscripten_glVertexAttrib4fv,
    /** @export */ emscripten_glVertexAttribDivisor: _emscripten_glVertexAttribDivisor,
    /** @export */ emscripten_glVertexAttribDivisorANGLE: _emscripten_glVertexAttribDivisorANGLE,
    /** @export */ emscripten_glVertexAttribDivisorARB: _emscripten_glVertexAttribDivisorARB,
    /** @export */ emscripten_glVertexAttribDivisorEXT: _emscripten_glVertexAttribDivisorEXT,
    /** @export */ emscripten_glVertexAttribDivisorNV: _emscripten_glVertexAttribDivisorNV,
    /** @export */ emscripten_glVertexAttribI4i: _emscripten_glVertexAttribI4i,
    /** @export */ emscripten_glVertexAttribI4iv: _emscripten_glVertexAttribI4iv,
    /** @export */ emscripten_glVertexAttribI4ui: _emscripten_glVertexAttribI4ui,
    /** @export */ emscripten_glVertexAttribI4uiv: _emscripten_glVertexAttribI4uiv,
    /** @export */ emscripten_glVertexAttribIPointer: _emscripten_glVertexAttribIPointer,
    /** @export */ emscripten_glVertexAttribPointer: _emscripten_glVertexAttribPointer,
    /** @export */ emscripten_glViewport: _emscripten_glViewport,
    /** @export */ emscripten_glWaitSync: _emscripten_glWaitSync,
    /** @export */ emscripten_has_asyncify: _emscripten_has_asyncify,
    /** @export */ emscripten_num_logical_cores: _emscripten_num_logical_cores,
    /** @export */ emscripten_request_fullscreen_strategy: _emscripten_request_fullscreen_strategy,
    /** @export */ emscripten_request_pointerlock: _emscripten_request_pointerlock,
    /** @export */ emscripten_resize_heap: _emscripten_resize_heap,
    /** @export */ emscripten_sample_gamepad_data: _emscripten_sample_gamepad_data,
    /** @export */ emscripten_set_beforeunload_callback_on_thread: _emscripten_set_beforeunload_callback_on_thread,
    /** @export */ emscripten_set_blur_callback_on_thread: _emscripten_set_blur_callback_on_thread,
    /** @export */ emscripten_set_canvas_element_size: _emscripten_set_canvas_element_size,
    /** @export */ emscripten_set_element_css_size: _emscripten_set_element_css_size,
    /** @export */ emscripten_set_focus_callback_on_thread: _emscripten_set_focus_callback_on_thread,
    /** @export */ emscripten_set_fullscreenchange_callback_on_thread: _emscripten_set_fullscreenchange_callback_on_thread,
    /** @export */ emscripten_set_gamepadconnected_callback_on_thread: _emscripten_set_gamepadconnected_callback_on_thread,
    /** @export */ emscripten_set_gamepaddisconnected_callback_on_thread: _emscripten_set_gamepaddisconnected_callback_on_thread,
    /** @export */ emscripten_set_keydown_callback_on_thread: _emscripten_set_keydown_callback_on_thread,
    /** @export */ emscripten_set_keypress_callback_on_thread: _emscripten_set_keypress_callback_on_thread,
    /** @export */ emscripten_set_keyup_callback_on_thread: _emscripten_set_keyup_callback_on_thread,
    /** @export */ emscripten_set_main_loop_arg: _emscripten_set_main_loop_arg,
    /** @export */ emscripten_set_mousedown_callback_on_thread: _emscripten_set_mousedown_callback_on_thread,
    /** @export */ emscripten_set_mouseenter_callback_on_thread: _emscripten_set_mouseenter_callback_on_thread,
    /** @export */ emscripten_set_mouseleave_callback_on_thread: _emscripten_set_mouseleave_callback_on_thread,
    /** @export */ emscripten_set_mousemove_callback_on_thread: _emscripten_set_mousemove_callback_on_thread,
    /** @export */ emscripten_set_mouseup_callback_on_thread: _emscripten_set_mouseup_callback_on_thread,
    /** @export */ emscripten_set_pointerlockchange_callback_on_thread: _emscripten_set_pointerlockchange_callback_on_thread,
    /** @export */ emscripten_set_resize_callback_on_thread: _emscripten_set_resize_callback_on_thread,
    /** @export */ emscripten_set_touchcancel_callback_on_thread: _emscripten_set_touchcancel_callback_on_thread,
    /** @export */ emscripten_set_touchend_callback_on_thread: _emscripten_set_touchend_callback_on_thread,
    /** @export */ emscripten_set_touchmove_callback_on_thread: _emscripten_set_touchmove_callback_on_thread,
    /** @export */ emscripten_set_touchstart_callback_on_thread: _emscripten_set_touchstart_callback_on_thread,
    /** @export */ emscripten_set_visibilitychange_callback_on_thread: _emscripten_set_visibilitychange_callback_on_thread,
    /** @export */ emscripten_set_wheel_callback_on_thread: _emscripten_set_wheel_callback_on_thread,
    /** @export */ emscripten_set_window_title: _emscripten_set_window_title,
    /** @export */ emscripten_sleep: _emscripten_sleep,
    /** @export */ environ_get: _environ_get,
    /** @export */ environ_sizes_get: _environ_sizes_get,
    /** @export */ exit: _exit,
    /** @export */ fd_close: _fd_close,
    /** @export */ fd_read: _fd_read,
    /** @export */ fd_seek: _fd_seek,
    /** @export */ fd_write: _fd_write,
    /** @export */ glActiveTexture: _glActiveTexture,
    /** @export */ glAttachShader: _glAttachShader,
    /** @export */ glBindBuffer: _glBindBuffer,
    /** @export */ glBindTexture: _glBindTexture,
    /** @export */ glBindVertexArray: _glBindVertexArray,
    /** @export */ glBlendColor: _glBlendColor,
    /** @export */ glBlendFunc: _glBlendFunc,
    /** @export */ glBufferData: _glBufferData,
    /** @export */ glClear: _glClear,
    /** @export */ glClearColor: _glClearColor,
    /** @export */ glClearDepthf: _glClearDepthf,
    /** @export */ glColorMask: _glColorMask,
    /** @export */ glCompileShader: _glCompileShader,
    /** @export */ glCreateProgram: _glCreateProgram,
    /** @export */ glCreateShader: _glCreateShader,
    /** @export */ glCullFace: _glCullFace,
    /** @export */ glDeleteBuffers: _glDeleteBuffers,
    /** @export */ glDeleteProgram: _glDeleteProgram,
    /** @export */ glDeleteShader: _glDeleteShader,
    /** @export */ glDeleteTextures: _glDeleteTextures,
    /** @export */ glDeleteVertexArrays: _glDeleteVertexArrays,
    /** @export */ glDepthFunc: _glDepthFunc,
    /** @export */ glDepthMask: _glDepthMask,
    /** @export */ glDisable: _glDisable,
    /** @export */ glDrawArrays: _glDrawArrays,
    /** @export */ glEnable: _glEnable,
    /** @export */ glEnableVertexAttribArray: _glEnableVertexAttribArray,
    /** @export */ glFlush: _glFlush,
    /** @export */ glGenBuffers: _glGenBuffers,
    /** @export */ glGenTextures: _glGenTextures,
    /** @export */ glGenVertexArrays: _glGenVertexArrays,
    /** @export */ glGetError: _glGetError,
    /** @export */ glGetProgramInfoLog: _glGetProgramInfoLog,
    /** @export */ glGetProgramiv: _glGetProgramiv,
    /** @export */ glGetShaderInfoLog: _glGetShaderInfoLog,
    /** @export */ glGetShaderiv: _glGetShaderiv,
    /** @export */ glGetTexParameteriv: _glGetTexParameteriv,
    /** @export */ glGetUniformLocation: _glGetUniformLocation,
    /** @export */ glLineWidth: _glLineWidth,
    /** @export */ glLinkProgram: _glLinkProgram,
    /** @export */ glPolygonOffset: _glPolygonOffset,
    /** @export */ glShaderSource: _glShaderSource,
    /** @export */ glStencilFunc: _glStencilFunc,
    /** @export */ glStencilMask: _glStencilMask,
    /** @export */ glTexImage2D: _glTexImage2D,
    /** @export */ glTexParameteri: _glTexParameteri,
    /** @export */ glTexSubImage2D: _glTexSubImage2D,
    /** @export */ glUniform1f: _glUniform1f,
    /** @export */ glUniform1i: _glUniform1i,
    /** @export */ glUniform2fv: _glUniform2fv,
    /** @export */ glUniform3f: _glUniform3f,
    /** @export */ glUniform3fv: _glUniform3fv,
    /** @export */ glUniform4fv: _glUniform4fv,
    /** @export */ glUniformMatrix3fv: _glUniformMatrix3fv,
    /** @export */ glUniformMatrix4fv: _glUniformMatrix4fv,
    /** @export */ glUseProgram: _glUseProgram,
    /** @export */ glVertexAttribIPointer: _glVertexAttribIPointer,
    /** @export */ glVertexAttribPointer: _glVertexAttribPointer,
    /** @export */ glViewport: _glViewport,
    /** @export */ memory: wasmMemory,
    /** @export */ proc_exit: _proc_exit
  };
}

// include: postamble.js
// === Auto-generated postamble setup entry stuff ===
function callMain(args = []) {
  var entryFunction = _main;
  args.unshift(thisProgram);
  var argc = args.length;
  var argv = stackAlloc((argc + 1) * 4);
  var argv_ptr = argv;
  for (var arg of args) {
    (growMemViews(), HEAPU32)[((argv_ptr) >> 2)] = stringToUTF8OnStack(arg);
    argv_ptr += 4;
  }
  (growMemViews(), HEAPU32)[((argv_ptr) >> 2)] = 0;
  try {
    var ret = entryFunction(argc, argv);
    // if we're not running an evented main loop, it's time to exit
    exitJS(ret, /* implicit = */ true);
    return ret;
  } catch (e) {
    return handleException(e);
  }
}

function run(args = arguments_) {
  if (runDependencies > 0) {
    dependenciesFulfilled = run;
    return;
  }
  if ((ENVIRONMENT_IS_PTHREAD)) {
    initRuntime();
    return;
  }
  preRun();
  // a preRun added a dependency, run will be called later
  if (runDependencies > 0) {
    dependenciesFulfilled = run;
    return;
  }
  function doRun() {
    // run may have just been called through dependencies being fulfilled just in this very frame,
    // or while the async setStatus time below was happening
    Module["calledRun"] = true;
    if (ABORT) return;
    initRuntime();
    preMain();
    Module["onRuntimeInitialized"]?.();
    var noInitialRun = Module["noInitialRun"] || false;
    if (!noInitialRun) callMain(args);
    postRun();
  }
  if (Module["setStatus"]) {
    Module["setStatus"]("Running...");
    setTimeout(() => {
      setTimeout(() => Module["setStatus"](""), 1);
      doRun();
    }, 1);
  } else {
    doRun();
  }
}

var wasmExports;

if ((!(ENVIRONMENT_IS_PTHREAD))) {
  // Call createWasm on startup if we are the main thread.
  // Worker threads call this once they receive the module via postMessage
  // With async instantation wasmExports is assigned asynchronously when the
  // instance is received.
  createWasm();
  run();
}
