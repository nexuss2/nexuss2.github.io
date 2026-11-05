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
var Module = typeof Module !== 'undefined' ? Module : {};

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).

// Attempt to auto-detect the environment
var ENVIRONMENT_IS_WEB = !!globalThis.window;
var ENVIRONMENT_IS_WORKER = !!globalThis.WorkerGlobalScope;
// N.b. Electron.js environment is simultaneously a NODE-environment, but
// also a web environment.
var ENVIRONMENT_IS_NODE = globalThis.process?.versions?.node && globalThis.process?.type != 'renderer';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

// Three configurations we can be running in:
// 1) We could be the application main() thread running in the main JS UI thread. (ENVIRONMENT_IS_WORKER == false and ENVIRONMENT_IS_PTHREAD == false)
// 2) We could be the application main() running directly in a worker. (ENVIRONMENT_IS_WORKER == true, ENVIRONMENT_IS_PTHREAD == false)
// 3) We could be an application pthread running in a worker. (ENVIRONMENT_IS_WORKER == true and ENVIRONMENT_IS_PTHREAD == true)

// The way we signal to a worker that it is hosting a pthread is to construct
// it with a specific name.
var ENVIRONMENT_IS_PTHREAD = ENVIRONMENT_IS_WORKER && globalThis.name == 'em-pthread'

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)
// include: C:\Users\joela\AppData\Local\Temp\tmphjckvkgb.js

  if (!Module['expectedDataFileDownloads']) Module['expectedDataFileDownloads'] = 0;
  Module['expectedDataFileDownloads']++;
  (() => {
    // Do not attempt to redownload the virtual filesystem data when in a pthread or a Wasm Worker context.
    var isPthread = typeof ENVIRONMENT_IS_PTHREAD !== 'undefined' && ENVIRONMENT_IS_PTHREAD;
    var isWasmWorker = typeof ENVIRONMENT_IS_WASM_WORKER !== 'undefined' && ENVIRONMENT_IS_WASM_WORKER;
    if (isPthread || isWasmWorker) return;
    async function loadPackage(metadata) {

      var PACKAGE_PATH = '';
      if (typeof window === 'object') {
        PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')) + '/');
      } else if (typeof process === 'undefined' && typeof location !== 'undefined') {
        // web worker
        PACKAGE_PATH = encodeURIComponent(location.pathname.substring(0, location.pathname.lastIndexOf('/')) + '/');
      }
      var PACKAGE_NAME = 'WiiCompiled.data';
      var REMOTE_PACKAGE_BASE = 'WiiCompiled.data';
      var REMOTE_PACKAGE_NAME = Module['locateFile'] ? Module['locateFile'](REMOTE_PACKAGE_BASE, '') : REMOTE_PACKAGE_BASE;
      var REMOTE_PACKAGE_SIZE = metadata['remote_package_size'];

      async function fetchRemotePackage(packageName, packageSize) {
        
        if (!Module['dataFileDownloads']) Module['dataFileDownloads'] = {};
        try {
          var response = await fetch(packageName);
        } catch (e) {
          throw new Error(`Network Error: ${packageName}`, {e});
        }
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.url}`);
        }

        const chunks = [];
        const headers = response.headers;
        const total = Number(headers.get('Content-Length') || packageSize);
        let loaded = 0;

        Module['setStatus'] && Module['setStatus']('Downloading data...');
        const reader = response.body.getReader();

        while (1) {
          var {done, value} = await reader.read();
          if (done) break;
          chunks.push(value);
          loaded += value.length;
          Module['dataFileDownloads'][packageName] = {loaded, total};

          let totalLoaded = 0;
          let totalSize = 0;

          for (const download of Object.values(Module['dataFileDownloads'])) {
            totalLoaded += download.loaded;
            totalSize += download.total;
          }

          Module['setStatus'] && Module['setStatus'](`Downloading data... (${totalLoaded}/${totalSize})`);
        }

        const packageData = new Uint8Array(chunks.map((c) => c.length).reduce((a, b) => a + b, 0));
        let offset = 0;
        for (const chunk of chunks) {
          packageData.set(chunk, offset);
          offset += chunk.length;
        }
        return packageData.buffer;
      }

      var fetchPromise;
      var fetched = Module['getPreloadedPackage'] && Module['getPreloadedPackage'](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE);

      if (!fetched) {
        // Note that we don't use await here because we want to execute the
        // the rest of this function immediately.
        fetchPromise = fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE);
      }

    async function runWithFS(Module) {

      function assert(check, msg) {
        if (!check) throw new Error(msg);
      }
Module['FS_createPath']("/", "app", true, true);
Module['FS_createPath']("/app", "wii_bootstrap", true, true);
Module['FS_createPath']("/app/wii_bootstrap", "shared2", true, true);
Module['FS_createPath']("/app/wii_bootstrap/shared2", "wc24", true, true);
Module['FS_createPath']("/app/wii_bootstrap/shared2/wc24", "mbox", true, true);

      async function processPackageData(arrayBuffer) {
        assert(arrayBuffer, 'Loading data file failed.');
        assert(arrayBuffer.constructor.name === ArrayBuffer.name, 'bad input to processPackageData ' + arrayBuffer.constructor.name);
        var byteArray = new Uint8Array(arrayBuffer);
        var curr;
        // Reuse the bytearray from the XHR as the source for file reads.
          for (var file of metadata['files']) {
            var name = file['filename'];
            var data = byteArray.subarray(file['start'], file['end']);
            // canOwn this data in the filesystem, it is a slice into the heap that will never change
        Module['FS_createDataFile'](name, null, data, true, true, true);
          }
          Module['removeRunDependency']('datafile_WiiCompiled.data');
      }
      Module['addRunDependency']('datafile_WiiCompiled.data');

      if (!Module['preloadResults']) Module['preloadResults'] = {};

      Module['preloadResults'][PACKAGE_NAME] = {fromCache: false};
      if (!fetched) {
        fetched = await fetchPromise;
      }
      await processPackageData(fetched);

    }
    // Detect whether the module JS file has already been loaded.
    if (Module['FS_createPath']) {
      runWithFS(Module);
    } else {
      if (!Module['preRun']) Module['preRun'] = [];
      Module['preRun'].push(runWithFS); // FS is not initialized yet, wait for it
    }

    }
    loadPackage({"files": [{"filename": "/app/disc_manifest.txt", "start": 0, "end": 74440}, {"filename": "/app/dsp_coef.bin", "start": 74440, "end": 78536}, {"filename": "/app/initial_pipeline_cache.db", "start": 78536, "end": 4645576}, {"filename": "/app/wii_bootstrap/README.md", "start": 4645576, "end": 4646015}, {"filename": "/app/wii_bootstrap/shared2/wc24/mbox/Readme.txt", "start": 4646015, "end": 4646122}, {"filename": "/app/wii_bootstrap/shared2/wc24/mbox/wc24recv.ctl", "start": 4646122, "end": 4678890}, {"filename": "/app/wii_bootstrap/shared2/wc24/mbox/wc24recv.mbx", "start": 4678890, "end": 4678938}, {"filename": "/app/wii_bootstrap/shared2/wc24/mbox/wc24send.ctl", "start": 4678938, "end": 4695322}, {"filename": "/app/wii_bootstrap/shared2/wc24/mbox/wc24send.mbx", "start": 4695322, "end": 4695370}, {"filename": "/app/wii_bootstrap/shared2/wc24/misc.bin", "start": 4695370, "end": 4696394}, {"filename": "/app/wii_bootstrap/shared2/wc24/nwc24dl.bin", "start": 4696394, "end": 4759882}, {"filename": "/app/wii_bootstrap/shared2/wc24/nwc24fl.bin", "start": 4759882, "end": 4792746}, {"filename": "/app/wii_bootstrap/shared2/wc24/nwc24fls.bin", "start": 4792746, "end": 4805546}, {"filename": "/app/wii_bootstrap/shared2/wc24/nwc24msg.cbk", "start": 4805546, "end": 4806570}, {"filename": "/app/wii_bootstrap/shared2/wc24/nwc24msg.cfg", "start": 4806570, "end": 4807594}], "remote_package_size": 4807594});

  })();

// end include: C:\Users\joela\AppData\Local\Temp\tmphjckvkgb.js
// include: W:/Wiicompiled/runtime/../web/pump.js
Error.stackTraceLimit = 120;

// Drives the GX worker queue from the page's event loop. A MessageChannel task runs far sooner than
// a clamped timer, and the game thread waits on this queue several times a frame. With nothing
// queued the pump sleeps on an atomic the game thread signals, because spinning through tasks here
// starves the browser's compositing. The timeout only bounds how late it notices a queue that
// filled without a signal.
Module['mkwStartGxPump'] = function () {
  const signal = Module['_mkw_gx_pump_signal']() >> 2;
  const channel = new MessageChannel();
  const pump = async () => {
    // Read first: a publish after this load makes the wait below return immediately.
    const seen = Atomics.load(HEAP32, signal);
    if (!(await Module['_mkw_gx_pump']())) {
      const wait = Atomics.waitAsync(HEAP32, signal, seen, 16);
      if (wait.async) {
        await wait.value;
      }
    }
    channel.port2.postMessage(0);
  };
  channel.port1.onmessage = pump;
  pump();
};
// end include: W:/Wiicompiled/runtime/../web/pump.js


var programArgs = [];
var thisProgram = './this.program';
var quit_ = (status, toThrow) => {
  throw toThrow;
};

// In MODULARIZE mode _scriptName needs to be captured already at the very top of the page immediately when the page is parsed, so it is generated there
// before the page load. In non-MODULARIZE modes generate it here.
var _scriptName = globalThis.document?.currentScript?.src;

if (ENVIRONMENT_IS_WORKER) {
  _scriptName = self.location.href;
}

// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = '';
function locateFile(path) {
  if (Module['locateFile']) {
    return Module['locateFile'](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var readAsync, readBinary;

// Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  try {
    scriptDirectory = new URL('.', _scriptName).href; // includes trailing slash
  } catch {
    // Must be a `blob:` or `data:` URL (e.g. `blob:http://site.com/etc/etc`), we cannot
    // infer anything from them.
  }

  {
// include: web_or_worker_shell_read.js
if (ENVIRONMENT_IS_WORKER) {
    readBinary = (url) => {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);
      xhr.responseType = 'arraybuffer';
      xhr.send(null);
      return new Uint8Array(/** @type{!ArrayBuffer} */(xhr.response));
    };
  }

  readAsync = async (url) => {
    var response = await fetch(url, { credentials: 'same-origin' });
    if (response.ok) {
      return response.arrayBuffer();
    }
    throw new Error(response.status + ' : ' + response.url);
  };
// end include: web_or_worker_shell_read.js
  }
} else
{
}

var out = console.log.bind(console);
var err = console.error.bind(console);

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
/** @type {function(*, string=)} */
function assert(condition, text) {
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
 */
var isFileURI = (filename) => filename.startsWith('file://');

// include: runtime_common.js
// include: runtime_exceptions.js
// end include: runtime_exceptions.js
// include: runtime_debug.js
// end include: runtime_debug.js
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
  self.onunhandledrejection = (e) => { throw e.reason || e; };

  async function handleMessage(e) {
    try {
      var msgData = e.data;
      //dbg('msgData: ' + Object.keys(msgData));
      var cmd = msgData.cmd;
      if (cmd == 1) { // Preload command that is called once per worker to parse and load the Emscripten code.

        // Until we initialize the runtime, queue up any further incoming messages.
        let messageQueue = [];
        self.onmessage = (e) => messageQueue.push(e);

        // And add a callback for when the runtime is initialized.
        startWorker = () => {
          // Notify the main thread that this thread has loaded.
          postMessage({ cmd: 3 });
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
              postMessage({ cmd: 9, handler, args: args });
            }
            // Rebind the out / err handlers if needed
            if (handler == 'print') out = Module[handler];
            if (handler == 'printErr') err = Module[handler];
          }
        }

        wasmMemory = msgData.wasmMemory;
        updateMemoryViews();

        wasmModule = msgData.wasmModule;
        createWasm();
        run();
        startWorker();
      } else if (cmd == 2) {
        // Call inside JS module to set up the stack frame for this pthread in JS module scope.
        // This needs to be the first thing that we do, as we cannot call to any C/C++ functions
        // until the thread stack is initialized.
        establishStackSpace(msgData.pthread_ptr);

        // Pass the thread address to wasm to store it for fast access.
        __emscripten_thread_init(msgData.pthread_ptr, /*is_main=*/0, /*is_runtime=*/0, /*can_block=*/1, 0, 0);

        PThread.threadInitTLS();

        // Await mailbox notifications with `Atomics.waitAsync` so we can start
        // using the fast `Atomics.notify` notification path.
        __emscripten_thread_mailbox_await(msgData.pthread_ptr);

        if (!initializedJS) {
          initializedJS = true;
        }

        try {
          await invokeEntryPoint(msgData.start_routine, msgData.arg);
        } catch(ex) {
          if (ex != 'unwind') {
            // The pthread "crashed".  Do not call `_emscripten_thread_exit` (which
            // would make this thread joinable).  Instead, re-throw the exception
            // and let the top level handler propagate it back to the main thread.
            throw ex;
          }
        }
      } else if (cmd == 4) {
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
    } catch(ex) {
      if (runtimeInitialized) __emscripten_thread_crashed();
      throw ex;
    }
  };

  self.onmessage = handleMessage;

} // ENVIRONMENT_IS_PTHREAD
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
  
}

// In non-standalone/normal mode, we create the memory here.
// include: runtime_init_memory.js
// Create the wasm memory. (Note: this only applies if IMPORTED_MEMORY is defined)

function initMemory() {

  if ((ENVIRONMENT_IS_PTHREAD)) { return }

  {
    var INITIAL_MEMORY = 1610612736;

    /** @suppress {checkTypes} */
    wasmMemory = new WebAssembly.Memory({
      'initial': INITIAL_MEMORY / 65536,
      'maximum': INITIAL_MEMORY / 65536,
      'shared': true,
    });
  }

  updateMemoryViews();
}

// end include: runtime_init_memory.js

// include: memoryprofiler.js
// end include: memoryprofiler.js
// end include: runtime_common.js
function preRun() {
  var preRun = Module['preRun'];
  if (preRun) {
    if (typeof preRun === 'function') preRun = [preRun];
    onPreRuns.push(...preRun);
  }
  // Begin ATPRERUNS hooks
  callRuntimeCallbacks(onPreRuns);
  // End ATPRERUNS hooks
}

function initRuntime() {
  runtimeInitialized = true;

  if (ENVIRONMENT_IS_PTHREAD) return;

  // No ATINITS hooks

  wasmExports['__wasm_call_ctors']();

  // No ATPOSTCTORS hooks

}

function postRun() {

  var postRun = Module['postRun'];
  if (postRun) {
    if (typeof postRun === 'function') postRun = [postRun];
    onPostRuns.push(...postRun);
  }

  // Begin ATPOSTRUNS hooks
  callRuntimeCallbacks(onPostRuns);
  // End ATPOSTRUNS hooks
}

/**
 * @param {string|number=} what
 */
function abort(what) {
  Module['onAbort']?.(what);

  what = `Aborted(${what})`;
  // TODO(sbc): Should we remove printing and leave it up to whoever
  // catches the exception?
  err(what);

  ABORT = true;

  what += '. Build with -sASSERTIONS for more info.';

  // Use a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  // FIXME This approach does not work in Wasm EH because it currently does not assume
  // all RuntimeErrors are from traps; it decides whether a RuntimeError is from
  // a trap or not based on a hidden field within the object. So at the moment
  // we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
  // allows this in the wasm spec.
  // See above, in the meantime, we resort to wasm code for trapping.
  //
  // In case abort() is called before the module is initialized, wasmExports
  // and its exported '__trap' function is not available, in which case we throw
  // a RuntimeError.
  //
  // We trap instead of throwing RuntimeError to prevent infinite-looping in
  // Wasm EH code (because RuntimeError is considered as a foreign exception and
  // caught by 'catch_all'), but in case throwing RuntimeError is fine because
  // the module has not even been instantiated, even less running.
  if (runtimeInitialized) {
    ___trap();
  }
  throw new WebAssembly.RuntimeError(what);
}

var wasmBinaryFile;

function findWasmBinary() {
  return locateFile('WiiCompiled.wasm');
}

function getBinarySync(file) {
  if (readBinary) {
    return readBinary(file);
  }
  // Throwing a plain string here, even though it not normally advisable since
  // this gets turning into an `abort` in instantiateArrayBuffer.
  throw 'both async and sync fetching of the wasm failed';
}

async function getWasmBinary(binaryFile) {
  // If we don't have the binary yet, load it asynchronously using readAsync.
  if (!wasmBinary) {
    // Fetch the binary using readAsync
    try {
      var response = await readAsync(binaryFile);
      return new Uint8Array(response);
    } catch {
      // Fall back to getBinarySync below;
    }
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
  if (!binary
     ) {
    try {
      var response = fetch(binaryFile, { credentials: 'same-origin' });
      var instantiationResult = await WebAssembly.instantiateStreaming(response, imports);
      return instantiationResult;
    } catch (reason) {
      // We expect the most common failure cause to be a bad MIME type for the binary,
      // in which case falling back to ArrayBuffer instantiation should work.
      err(`wasm streaming compile failed: ${reason}`);
      err('falling back to ArrayBuffer instantiation');
      // fall back of instantiateArrayBuffer below
    };
  }
  return instantiateArrayBuffer(binaryFile, imports);
}

function getWasmImports() {
  assignWasmImports();
  // instrumenting imports is used in asyncify in two ways: to add assertions
  // that check for proper import use, and for JSPI we use them to set up
  // the Promise API on the import side.
  // In pthreads builds getWasmImports is called more than once but we only
  // and the instrument the imports once.
  if (!wasmImports.__instrumented) {
    wasmImports.__instrumented = true;
    Asyncify.instrumentWasmImports(wasmImports);
  }
  // prepare imports
  var imports = {
    'env': wasmImports,
    'wasi_snapshot_preview1': wasmImports,
  };
  return imports;
}

// Create the wasm instance.
// Receives the wasm imports, returns the exports.
async function createWasm() {
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  function receiveInstance(instance, module) {
    wasmExports = instance.exports;

    wasmExports = Asyncify.instrumentWasmExports(wasmExports);

    registerTLSInit(wasmExports['_emscripten_tls_init']);

    assignWasmExports(wasmExports);

    // We now have the Wasm module loaded up, keep a reference to the compiled module so we can post it to the workers.
    wasmModule = module;
    return wasmExports;
  }

  // Prefer streaming instantiation if available.
  function receiveInstantiationResult(result) {
    // 'result' is a ResultObject object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    return receiveInstance(result['instance'], result['module']);
  }

  var info = getWasmImports();

  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to
  // run the instantiation parallel to any other async startup actions they are
  // performing.
  // Also pthreads and wasm workers initialize the wasm instance through this
  // path.
  var instantiateWasm = Module['instantiateWasm'];
  if (instantiateWasm) {
    return new Promise((resolve) => {
        instantiateWasm(info, (inst, mod) => resolve(receiveInstance(inst, mod)));
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
      name = 'ExitStatus';
      constructor(status) {
        this.message = `Program terminated with exit(${status})`;
        this.status = status;
      }
    }

  
  var terminateWorker = (worker) => {
      worker.terminate();
      // terminate() can be asynchronous, so in theory the worker can continue
      // to run for some amount of time after termination.  However from our POV
      // the worker is now dead and we don't want to hear from it again, so we stub
      // out its message handler here.  This avoids having to check in each of
      // the onmessage handlers if the message was coming from a valid worker.
      worker.onmessage = (e) => {
      };
    };
  
  var cleanupThread = (pthread_ptr) => {
      var worker = PThread.pthreads[pthread_ptr];
      PThread.returnWorkerToPool(worker);
    };
  
  var callRuntimeCallbacks = (callbacks) => {
      while (callbacks.length > 0) {
        // Pass the module as the first argument.
        callbacks.shift()(Module);
      }
    };
  var onPreRuns = [];
  var addOnPreRun = (cb) => onPreRuns.push(cb);
  
  var dependenciesPromise = null;
  var resolveRunDependencies = async () => dependenciesPromise;
  var runDependencies = 0;
  
  
  var dependenciesPromiseResolve = null;
  var removeRunDependency = (id) => {
      runDependencies--;
  
      Module['monitorRunDependencies']?.(runDependencies);
  
      if (!runDependencies) {
        dependenciesPromiseResolve();
      }
    };
  
  
  var addRunDependency = (id) => {
      if (!runDependencies) {
        dependenciesPromise = new Promise((resolve) => dependenciesPromiseResolve = resolve);
      }
      runDependencies++;
  
      Module['monitorRunDependencies']?.(runDependencies);
  
    };
  
  
  var spawnThread = (threadParams) => {
  
      var worker = PThread.getNewWorker();
      if (!worker) {
        // No available workers in the PThread pool.
        return 6;
      }
  
      // Add to pthreads map
      PThread.pthreads[threadParams.pthread_ptr] = worker;
  
      worker.pthread_ptr = threadParams.pthread_ptr;
      var msg = {
          cmd: 2,
          start_routine: threadParams.startRoutine,
          arg: threadParams.arg,
          pthread_ptr: threadParams.pthread_ptr,
      };
      // Ask the worker to start executing its pthread entry point function.
      worker.postMessage(msg, threadParams.transferList);
      return 0;
    };
  
  
  
  var runtimeKeepaliveCounter = 0;
  var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;
  
  var stackSave = () => _emscripten_stack_get_current();
  
  var stackRestore = (val) => __emscripten_stack_restore(val);
  
  var stackAlloc = (sz) => __emscripten_stack_alloc(sz);
  
  
  
  /** @type {!Float64Array} */
  var HEAPF64;
  
  /** not-@type {!BigInt64Array} */
  var HEAP64;
  /** @type{function(number, (number|boolean), ...number)} */
  var proxyToMainThread = (funcIndex, emAsmAddr, proxyMode, ...callArgs) => {
      // EM_ASM proxying is done by passing a pointer to the address of the EM_ASM
      // content as `emAsmAddr`.  JS library proxying is done by passing an index
      // into `proxiedJSCallArgs` as `funcIndex`. If `emAsmAddr` is non-zero then
      // `funcIndex` will be ignored.
      // Additional arguments are passed after the first three are the actual
      // function arguments.
      // The serialization buffer contains the number of call params, and then
      // all the args here.
      //
      // We also pass 'proxyMode' to C separately, since C needs to look at it.
      //
      // Allocate a buffer (on the stack), which will be copied if necessary by
      // the C code.
      //
      // First passed parameter specifies the number of arguments to the function.
      // When BigInt support is enabled, we must handle types in a more complex
      // way, detecting at runtime if a value is a BigInt or not (as we have no
      // type info here). To do that, add a "prefix" before each value that
      // indicates if it is a BigInt, which effectively doubles the number of
      // values we serialize for proxying. TODO: pack this?
      var bufSize = 8 * callArgs.length * 2;
      var sp = stackSave();
      var args = stackAlloc(bufSize);
      var b = ((args)>>3);
      for (var arg of callArgs) {
        if (typeof arg === 'bigint') {
          // The prefix is non-zero to indicate a bigint.
          HEAP64[b++] = 1n;
          HEAP64[b++] = arg;
        } else {
          // The prefix is zero to indicate a JS Number.
          HEAP64[b++] = 0n;
          HEAPF64[b++] = arg;
        }
      }
      var rtn = __emscripten_run_js_on_main_thread(funcIndex, emAsmAddr, bufSize, args, proxyMode);
      stackRestore(sp);
      return rtn;
    };
  
  function _proc_exit(code) {
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(0, 0, 1, code);
  
      EXITSTATUS = code;
      if (!keepRuntimeAlive()) {
        PThread.terminateAllThreads();
        Module['onExit']?.(code);
        ABORT = true;
      }
      quit_(code, new ExitStatus(code));
    
  }
  
  
  
  
  
  function exitOnMainThread(returnCode) {
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(1, 0, 0, returnCode);
  
      _exit(returnCode);
    
  }
  
  /** @param {boolean|number=} implicit */
  var exitJS = (status, implicit) => {
      EXITSTATUS = status;
  
      if (ENVIRONMENT_IS_PTHREAD) {
        // implicit exit can never happen on a pthread
        // When running in a pthread we propagate the exit back to the main thread
        // where it can decide if the whole process should be shut down or not.
        // The pthread may have decided not to exit its own runtime, for example
        // because it runs a main loop, but that doesn't affect the main thread.
        exitOnMainThread(status);
        throw 'unwind';
      }
  
      _proc_exit(status);
    };
  var _exit = exitJS;
  
  
  
  var waitAsyncPolyfilled = (!Atomics.waitAsync || (globalThis.navigator?.userAgent && Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)||[])[2]) < 91));;
  
  
  /** @type {!Int32Array} */
  var HEAP32;
  var PThread = {
  unusedWorkers:[],
  tlsInitFunctions:[],
  pthreads:{
  },
  init() {
        if ((!(ENVIRONMENT_IS_PTHREAD))) {
          PThread.initMainThread();
        }
      },
  initMainThread() {
        var pthreadPoolSize = 32;
        // Start loading up the Worker pool, if requested.
        while (pthreadPoolSize--) {
          PThread.allocateUnusedWorker();
        }
        // MINIMAL_RUNTIME takes care of calling loadWasmModuleToAllWorkers
        // in postamble_minimal.js
        addOnPreRun(async () => {
          var pthreadPoolReady = PThread.loadWasmModuleToAllWorkers();
          addRunDependency('loading-workers');
          await pthreadPoolReady;
          removeRunDependency('loading-workers');
        });
      },
  terminateAllThreads:() => {
        // Attempt to kill all workers.  Sadly (at least on the web) there is no
        // way to terminate a worker synchronously, or to be notified when a
        // worker is actually terminated.  This means there is some risk that
        // pthreads will continue to be executing after `worker.terminate` has
        // returned.  For this reason, we don't call `returnWorkerToPool` here or
        // free the underlying pthread data structures.
        for (var worker of Object.values(PThread.pthreads)) {
          terminateWorker(worker);
        }
        for (var worker of PThread.unusedWorkers) {
          terminateWorker(worker);
        }
        PThread.unusedWorkers = [];
        PThread.pthreads = {};
      },
  clearMailboxAwait:(pthread_ptr) => {
        if (!waitAsyncPolyfilled) {
          Atomics.notify(HEAP32, ((pthread_ptr)>>2));
        }
      },
  terminateRuntime:() => {
        PThread.terminateAllThreads();
        var pthread_ptr = _pthread_self();
        ___set_thread_state(0, 0, 0, 1);
        PThread.clearMailboxAwait(pthread_ptr);
      },
  returnWorkerToPool:(worker) => {
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
        // Not a running Worker anymore
        // Detach the worker from the pthread object, and return it to the
        // worker pool as an unused worker.
        worker.pthread_ptr = 0;
  
        // Clear any pending waitAsync waiter armed on this thread's struct
        // BEFORE freeing the memory so that memory recycled by malloc in another
        // thread will not have a window where a stale async waiter is still active.
        PThread.clearMailboxAwait(pthread_ptr);
  
        // Finally, free the underlying (and now-unused) pthread structure in
        // linear memory.
        __emscripten_thread_free_data(pthread_ptr);
      },
  threadInitTLS() {
        // Call thread init functions (these are the _emscripten_tls_init for each
        // module loaded.
        PThread.tlsInitFunctions.forEach((f) => f());
      },
  loadWasmModuleToWorker:(worker) => new Promise((onFinishedLoading) => {
        worker.onmessage = (e) => {
          var d = e.data;
          var cmd = d.cmd;
  
          // If this message is intended to a recipient that is not the main
          // thread, forward it to the target thread. This is currently only
          // used by `CMD_CHECK_MAILBOX`.
          if (d.targetThread && d.targetThread != _pthread_self()) {
            var targetWorker = PThread.pthreads[d.targetThread];
            targetWorker?.postMessage(d);
            return;
          }
  
          if (d === 'setimmediate' || d === '_si') {
            // Worker wants to postMessage() to itself to implement setImmediate()
            // emulation.
            worker.postMessage(d);
            return;
          }
  
          switch (cmd) {
            case 4:
              checkMailbox();
              break;
            case 5:
              spawnThread(d);
              break;
            case 6:
              // cleanupThread needs to be run via callUserCallback since it calls
              // back into user code to free thread data. Without this it's possible
              // the unwind or ExitStatus exception could escape here.
              callUserCallback(() => cleanupThread(d.thread));
              break;
            case 3:
              onFinishedLoading(worker);
              break;
            case 9:
              Module[d.handler](...d.args);
              break;
            default:
              // The received message looks like something that should be handled by this message
              // handler, (since there is a e.data.cmd field present), but is not one of the
              // recognized commands:
              if (cmd) err(`worker sent an unknown command ${cmd}`);
          }
        };
  
        worker.onerror = (e) => {
          var message = 'worker sent an error!';
          err(`${message} ${e.filename}:${e.lineno}: ${e.message}`);
          throw e;
        };
  
        // When running on a pthread, none of the incoming parameters on the module
        // object are present. Proxy known handlers back to the main thread if specified.
        var handlers = [];
        var knownHandlers = [
          'onExit',
          'onAbort',
          'print',
          'printErr',
        ];
        for (var handler of knownHandlers) {
          if (Module.propertyIsEnumerable(handler)) {
            handlers.push(handler);
          }
        }
  
        // Ask the new worker to load up the Emscripten-compiled page. This is a heavy operation.
        worker.postMessage({
          cmd: 1,
          handlers: handlers,
          wasmMemory,
          wasmModule,
        });
      }),
  async loadWasmModuleToAllWorkers() {
        // Instantiation is synchronous in pthreads.
        if (
          ENVIRONMENT_IS_PTHREAD
        ) {
          return;
        }
  
        let pthreadPoolReady = Promise.all(PThread.unusedWorkers.map(PThread.loadWasmModuleToWorker));
        return pthreadPoolReady;
      },
  allocateUnusedWorker() {
        var worker;
        var pthreadMainJs = _scriptName;
        worker = new Worker(pthreadMainJs, {
          // This is the way that we signal to the Web Worker that it is hosting
          // a pthread.
          'name': 'em-pthread',
  });
        PThread.unusedWorkers.push(worker);
        return worker;
      },
  getNewWorker() {
        if (PThread.unusedWorkers.length == 0) {
  // PTHREAD_POOL_SIZE_STRICT should show a warning and, if set to level `2`, return from the function.
          var newWorker = PThread.allocateUnusedWorker();
          PThread.loadWasmModuleToWorker(newWorker);
        }
        return PThread.unusedWorkers.pop();
      },
  };

  var onPostRuns = [];
  var addOnPostRun = (cb) => onPostRuns.push(cb);



  
  
  
  /** @type {!Uint32Array} */
  var HEAPU32;
  function establishStackSpace(pthread_ptr) {
      var stackHigh = HEAPU32[(((pthread_ptr)+(48))>>2)];
      var stackSize = HEAPU32[(((pthread_ptr)+(52))>>2)];
      var stackLow = stackHigh - stackSize;
      // Set stack limits used by `emscripten/stack.h` function.  These limits are
      // cached in wasm-side globals to make checks as fast as possible.
      _emscripten_stack_set_limits(stackHigh, stackLow);
  
      // Call inside wasm module to set up the stack frame for this pthread in wasm module scope
      stackRestore(stackHigh);
  
    }

  
  
  
  
  var wasmTableMirror = [];
  
  
  var getWasmTableEntry = (funcPtr) => {
      var func = wasmTableMirror[funcPtr];
      if (!func) {
        /** @suppress {checkTypes} */
        wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
        if (Asyncify.isAsyncExport(func)) {
          wasmTableMirror[funcPtr] = func = Asyncify.makeAsyncFunction(func);
        }
      }
      return func;
    };
  var invokeEntryPoint = async (ptr, arg) => {
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
  
      var result = WebAssembly.promising(getWasmTableEntry(ptr))(arg);
  
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
      result = await result;
      finish(result);
    };

  var noExitRuntime = true;

  var registerTLSInit = (tlsInitFunc) => PThread.tlsInitFunctions.push(tlsInitFunc);

  var wasmMemory;

  var UTF8Decoder = globalThis.TextDecoder && new TextDecoder();
  
  
    /**
   * heapOrArray is either a regular array, or a JavaScript typed array view.
   * @param {number} idx
   * @param {number=} maxBytesToRead
   * @param {boolean=} ignoreNul
   * @return {number}
   */
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
   */
  var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead, ignoreNul) => {
  
      var endPtr = findStringEnd(heapOrArray, idx, maxBytesToRead, ignoreNul);
  
      // When using conditional TextDecoder, skip it for short strings as the overhead of the native call is not worth it.
      if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.buffer instanceof ArrayBuffer ? heapOrArray.subarray(idx, endPtr) : heapOrArray.slice(idx, endPtr));
      }
      var str = '';
      while (idx < endPtr) {
        // For UTF8 byte structure, see:
        // http://en.wikipedia.org/wiki/UTF-8#Description
        // https://www.ietf.org/rfc/rfc2279.txt
        // https://tools.ietf.org/html/rfc3629
        var u0 = heapOrArray[idx++];
        if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
        var u1 = heapOrArray[idx++] & 63;
        if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
        var u2 = heapOrArray[idx++] & 63;
        if ((u0 & 0xF0) == 0xE0) {
          u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
        } else {
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
        }
  
        if (u0 < 0x10000) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 0x10000;
          str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
        }
      }
      return str;
    };
  
  /** @type {!Uint8Array} */
  var HEAPU8;
  
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
   */
  var UTF8ToString = (ptr, maxBytesToRead, ignoreNul) => {
      return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead, ignoreNul) : '';
    };
  var ___assert_fail = (condition, filename, line, func) =>
      abort(`Assertion failed: ${UTF8ToString(condition)}, at: ` + [filename ? UTF8ToString(filename) : 'unknown filename', line, func ? UTF8ToString(func) : 'unknown function']);

  var ___call_sighandler = (fp, sig) => getWasmTableEntry(fp)(sig);

  
  
  
  
  function pthreadCreateProxied(pthread_ptr, attr, startRoutine, arg) {
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(2, 0, 1, pthread_ptr, attr, startRoutine, arg);
  return ___pthread_create_js(pthread_ptr, attr, startRoutine, arg)
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
      if (ENVIRONMENT_IS_PTHREAD && (!transferList.length || error)) {
        return pthreadCreateProxied(pthread_ptr, attr, startRoutine, arg);
      }
  
      // If on the main thread, and accessing Canvas/OffscreenCanvas failed, abort
      // with the detected error.
      if (error) return error;
  
      var threadParams = {
        startRoutine,
        pthread_ptr,
        arg,
        transferList,
      };
  
      if (ENVIRONMENT_IS_PTHREAD) {
        // The prepopulated pool of web workers that can host pthreads is stored
        // in the main JS thread. Therefore if a pthread is attempting to spawn a
        // new thread, the thread creation must be deferred to the main JS thread.
        threadParams.cmd = 5;
        postMessage(threadParams, transferList);
        // When we defer thread creation this way, we have no way to detect thread
        // creation synchronously today, so we have to assume success and return 0.
        return 0;
      }
  
      // We are the main thread, so we have the pthread warmup pool in this
      // thread and can fire off JS thread creation directly ourselves.
      return spawnThread(threadParams);
    };

  var ___syscall_geteuid32 = () => 0;

  var ___syscall_getuid32 = () => 0;

  var __abort_js = () =>
      abort('');

  
  var __emscripten_init_main_thread_js = (tb) => {
      var can_block = !ENVIRONMENT_IS_WEB;
      // Feature detect whether the main thread can block.
      try {
        Atomics.wait(HEAP32, 0, 0, 0)
        can_block = true;
      } catch (e) {}
      // Pass the thread address to the native code where they are stored in wasm
      // globals which act as a form of TLS. Global constructors trying
      // to access this value will read the wrong value, but that is UB anyway.
      __emscripten_thread_init(
        tb,
        /*is_main=*/!ENVIRONMENT_IS_WORKER,
        /*is_runtime=*/1,
        can_block,
        /*default_stacksize=*/2097152,
        /*start_profiling=*/false,
      );
      PThread.threadInitTLS();
    };

  var handleException = (e) => {
      // Certain exception types we do not treat as errors since they are used for
      // internal control flow.
      // 1. ExitStatus, which is thrown by exit()
      // 2. "unwind", which is thrown by emscripten_unwind_to_js_event_loop() and others
      //    that wish to return to JS event loop.
      if (e instanceof ExitStatus || e == 'unwind') {
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
  var callUserCallback = (func, ...args) => {
      if (ABORT) {
        return;
      }
      try {
        return func(...args);
      } catch (e) {
        handleException(e);
      } finally {
        maybeExit();
      }
    };
  
  
  
  
  
  
  var __emscripten_thread_mailbox_await = (pthread_ptr) => {
      if (!waitAsyncPolyfilled) {
        // Wait on the pthread's initial self-pointer field because it is easy and
        // safe to access from sending threads that need to notify the waiting
        // thread.
        // Note: Under wasm64 only the low 32-bit of the pthread_ptr are
        // read/compared here, but we don't actually care about the exact values
        // here as long as they match.
        var wait = Atomics.waitAsync(HEAP32, ((pthread_ptr)>>2), pthread_ptr);
        wait.value.then(checkMailbox);
        var waitingAsync = pthread_ptr + 112;
        Atomics.store(HEAP32, ((waitingAsync)>>2), 1);
      }
      // If `Atomics.waitAsync` is not implemented, then we will always fall back
      // to postMessage and there is no need to do anything here.
    };
  
  var checkMailbox = () => {
      // checkMailbox can be called after the pthread has shut down. See
      // Pthread.terminateRuntime().
      // In this case we return silently without re-registering using waitAsync.
      // Perhaps there is a more universal way we can detect runtime has exited.
      // TODO(https://github.com/emscripten-core/emscripten/issues/25076)
      var pthread_ptr = _pthread_self();
      if (!pthread_ptr) return;
      callUserCallback(() => {
        // If we are using Atomics.waitAsync as our notification mechanism, wait
        // for a notification before processing the mailbox to avoid missing any
        // work that could otherwise arrive after we've finished processing the
        // mailbox and before we're ready for the next notification.
        __emscripten_thread_mailbox_await(pthread_ptr);
        __emscripten_check_mailbox();
      });
    };
  
  var __emscripten_notify_mailbox_postmessage = (targetThread, currThreadId) => {
      if (targetThread == currThreadId) {
        setTimeout(checkMailbox);
      } else if (ENVIRONMENT_IS_PTHREAD) {
        postMessage({targetThread, cmd: 4});
      } else {
        var worker = PThread.pthreads[targetThread];
        if (!worker) {
          return;
        }
        worker.postMessage({cmd: 4});
      }
    };

  
  
  var proxiedJSCallArgs = [];
  
  
  
  var __emscripten_receive_on_main_thread_js = (funcIndex, emAsmAddr, callingThread, bufSize, args, ctx, ctxArgs) => {
      // Sometimes we need to backproxy events to the calling thread (e.g.
      // HTML5 DOM events handlers such as
      // emscripten_set_mousemove_callback()), so keep track in a globally
      // accessible variable about the thread that initiated the proxying.
      proxiedJSCallArgs.length = 0;
      var b = ((args)>>3);
      var end = ((args + bufSize)>>3);
      while (b < end) {
        var arg;
        if (HEAP64[b++]) {
          // It's a BigInt.
          arg = HEAP64[b++];
        } else {
          // It's a Number.
          arg = HEAPF64[b++];
        }
        proxiedJSCallArgs.push(arg);
      }
      // Proxied JS library funcs use funcIndex and EM_ASM functions use emAsmAddr
      var func = emAsmAddr ? ASM_CONSTS[emAsmAddr] : proxiedFunctionTable[funcIndex];
      PThread.currentProxiedOperationCallerThread = callingThread;
      var rtn = func(...proxiedJSCallArgs);
      PThread.currentProxiedOperationCallerThread = 0;
      if (ctx) {
        // A PROXY_SYNC_ASYNC function may complete synchronously with a plain value.
        Promise.resolve(rtn).then((rtn) => __emscripten_run_js_on_main_thread_done(ctx, ctxArgs, rtn));
        return;
      }
  
      return rtn;
    };

  var __emscripten_runtime_keepalive_clear = () => {
      noExitRuntime = false;
      runtimeKeepaliveCounter = 0;
    };

  var __emscripten_thread_cleanup = (thread) => {
      // Called when a thread needs to be cleaned up so it can be reused.
      // A thread is considered reusable when it either returns from its
      // entry point, calls pthread_exit, or acts upon a cancellation.
      // Detached threads are responsible for calling this themselves,
      // otherwise pthread_join is responsible for calling this.
      if (!ENVIRONMENT_IS_PTHREAD) cleanupThread(thread);
      else postMessage({ cmd: 6, thread });
    };


  var __emscripten_thread_set_strongref = (thread) => {
      // Called when a thread needs to be strongly referenced.
      // Currently only used for:
      // - keeping the "main" thread alive in PROXY_TO_PTHREAD mode;
      // - crashed threads that need to propagate the uncaught exception
      //   back to the main thread.
    };

  var isLeapYear = (year) => year%4 === 0 && (year%100 !== 0 || year%400 === 0);
  
  var MONTH_DAYS_LEAP_CUMULATIVE = [0,31,60,91,121,152,182,213,244,274,305,335];
  
  var MONTH_DAYS_REGULAR_CUMULATIVE = [0,31,59,90,120,151,181,212,243,273,304,334];
  var ydayFromDate = (date) => {
      var leap = isLeapYear(date.getFullYear());
      var monthDaysCumulative = (leap ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE);
      var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1; // -1 since it's days since Jan 1
  
      return yday;
    };
  
  var INT53_MAX = 9007199254740992;
  
  var INT53_MIN = -9007199254740992;
  var bigintToI53Checked = (num) => (num < INT53_MIN || num > INT53_MAX) ? NaN : Number(num);
  
  function __localtime_js(time, tmPtr) {
    time = bigintToI53Checked(time);
  
  
      var date = new Date(time*1000);
      if (isNaN(date.getTime())) {
        return 1;
      }
      HEAP32[((tmPtr)>>2)] = date.getSeconds();
      HEAP32[(((tmPtr)+(4))>>2)] = date.getMinutes();
      HEAP32[(((tmPtr)+(8))>>2)] = date.getHours();
      HEAP32[(((tmPtr)+(12))>>2)] = date.getDate();
      HEAP32[(((tmPtr)+(16))>>2)] = date.getMonth();
      HEAP32[(((tmPtr)+(20))>>2)] = date.getFullYear()-1900;
      HEAP32[(((tmPtr)+(24))>>2)] = date.getDay();
  
      var yday = ydayFromDate(date)|0;
      HEAP32[(((tmPtr)+(28))>>2)] = yday;
      HEAP32[(((tmPtr)+(36))>>2)] = -(date.getTimezoneOffset() * 60);
  
      // Attention: DST is in December in South, and some regions don't have DST at all.
      var start = new Date(date.getFullYear(), 0, 1);
      var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
      var winterOffset = start.getTimezoneOffset();
      var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset))|0;
      HEAP32[(((tmPtr)+(32))>>2)] = dst;
      return 0;
    ;
  }

  var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
      // Parameter maxBytesToWrite is not optional. Negative values, 0, null,
      // undefined and false each don't write out any bytes.
      if (!(maxBytesToWrite > 0))
        return 0;
  
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
      for (var i = 0; i < str.length; ++i) {
        // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description
        // and https://www.ietf.org/rfc/rfc2279.txt
        // and https://tools.ietf.org/html/rfc3629
        var u = str.codePointAt(i);
        if (u <= 0x7F) {
          if (outIdx >= endIdx) break;
          heap[outIdx++] = u;
        } else if (u <= 0x7FF) {
          if (outIdx + 1 >= endIdx) break;
          heap[outIdx++] = 0xC0 | (u >> 6);
          heap[outIdx++] = 0x80 | (u & 63);
        } else if (u <= 0xFFFF) {
          if (outIdx + 2 >= endIdx) break;
          heap[outIdx++] = 0xE0 | (u >> 12);
          heap[outIdx++] = 0x80 | ((u >> 6) & 63);
          heap[outIdx++] = 0x80 | (u & 63);
        } else {
          if (outIdx + 3 >= endIdx) break;
          heap[outIdx++] = 0xF0 | (u >> 18);
          heap[outIdx++] = 0x80 | ((u >> 12) & 63);
          heap[outIdx++] = 0x80 | ((u >> 6) & 63);
          heap[outIdx++] = 0x80 | (u & 63);
          // Gotcha: if codePoint is over 0xFFFF, it is represented as a surrogate pair in UTF-16.
          // We need to manually skip over the second code unit for correct iteration.
          i++;
        }
      }
      // Null-terminate the pointer to the buffer.
      heap[outIdx] = 0;
      return outIdx - startIdx;
    };
  
  var stringToUTF8 = (str, outPtr, maxBytesToWrite) => {
      return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
    };
  
  
  var __tzset_js = (timezone, daylight, std_name, dst_name) => {
      // TODO: Use (malleable) environment variables instead of system settings.
      var currentYear = new Date().getFullYear();
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
      HEAPU32[((timezone)>>2)] = stdTimezoneOffset * 60;
  
      HEAP32[((daylight)>>2)] = Number(winterOffset != summerOffset);
  
      var extractZone = (timezoneOffset) => {
        // Why inverse sign?
        // Read here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
        var sign = timezoneOffset >= 0 ? '-' : '+';
  
        var absOffset = Math.abs(timezoneOffset)
        var hours = String(Math.floor(absOffset / 60)).padStart(2, '0');
        var minutes = String(absOffset % 60).padStart(2, '0');
  
        return `UTC${sign}${hours}${minutes}`;
      }
  
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

  var __wasmfs_copy_preloaded_file_data = (index, buffer) =>
      HEAPU8.set(wasmFSPreloadedFiles[index].fileData, buffer);

  var wasmFS$backends = {
  };
  
  
  
  
  var __wasmfs_create_fetch_backend_js = function (backend) {
      const maxCachedBytes = 256 * 1024 * 1024;
      const chunks = new Map();
      let cachedBytes = 0;
  
      let packBytes = 0;
      const entriesReady = (async () => {
        const entries = new Map();
        const index = await (await fetch(new URL('disc_index.txt', self.location))).text();
        for (const line of index.split(/\r?\n/)) {
          const [first, second, third] = line.split('\t');
          if (first === '#piece') {
            packBytes = Number(second);
          } else if (second !== undefined) {
            entries.set(second, { size: Number(first), packOffset: third === undefined ? -1 : Number(third) });
          }
        }
        return entries;
      })();
  
      const urlOf = (file) => UTF8ToString(__wasmfs_fetch_get_file_url(file));
      const indexKey = (url) => url.replace(/^\/disc\/+/, '');
  
      const remember = (key, bytes) => {
        chunks.set(key, bytes);
        cachedBytes += bytes.byteLength;
        for (const [oldest, value] of chunks) {
          if (cachedBytes <= maxCachedBytes) {
            break;
          }
          chunks.delete(oldest);
          cachedBytes -= value.byteLength;
        }
      };
  
      const fetchBytes = async (url, start, end) => {
        const response = await fetch(new URL(url.replace(/^\/+/, ''), self.location), {
          headers: { Range: `bytes=${start}-${end - 1}` },
        });
        if (!response.ok) {
          throw response;
        }
        const bytes = new Uint8Array(await response.arrayBuffer());
        // A server that ignores Range sends the whole file from byte 0.
        return response.status === 206 ? bytes : bytes.subarray(start, end);
      };
  
      // Reads [start, end) of a disc file from wherever it is stored.
      const fetchFileRange = async (url, entry, start, end) => {
        if (entry.packOffset < 0) {
          return fetchBytes(url, start, end);
        }
        const from = entry.packOffset + start;
        const to = entry.packOffset + end;
        const reads = [];
        for (let pack = Math.floor(from / packBytes); pack * packBytes < to; pack++) {
          const packStart = pack * packBytes;
          reads.push(fetchBytes(`/disc/pack${String(pack).padStart(3, '0')}.bin`,
                                Math.max(from, packStart) - packStart,
                                Math.min(to, packStart + packBytes) - packStart));
        }
        const pieces = await Promise.all(reads);
        if (pieces.length === 1) {
          return pieces[0];
        }
        const joined = new Uint8Array(to - from);
        let at = 0;
        for (const piece of pieces) {
          joined.set(piece, at);
          at += piece.length;
        }
        return joined;
      };
  
      // Fetches chunks [first, last] in one read.
      const fetchChunks = async (url, entry, chunkSize, first, last) => {
        const start = first * chunkSize;
        const end = Math.min((last + 1) * chunkSize, entry.size);
        const bytes = await fetchFileRange(url, entry, start, end);
        const fetched = new Map();
        for (let i = first; i <= last; i++) {
          const chunkStart = i * chunkSize - start;
          fetched.set(i, bytes.subarray(chunkStart, chunkStart + chunkSize));
        }
        return fetched;
      };
  
      wasmFS$backends[backend] = {
        allocFile: async (file) => {},
        freeFile: async (file) => {},
  
        write: async (file, buffer, length, offset) => -69,
  
        read: async (file, buffer, length, offset) => {
          if (offset < 0 || length <= 0) {
            return 0;
          }
          const url = urlOf(file);
          const entry = (await entriesReady).get(indexKey(url));
          if (entry === undefined) {
            return -44;
          }
          length = Math.min(length, entry.size - offset);
          if (length <= 0) {
            return 0;
          }
  
          const chunkSize = __wasmfs_fetch_get_chunk_size(file);
          const first = Math.floor(offset / chunkSize);
          const last = Math.floor((offset + length - 1) / chunkSize);
          const got = new Map();
          try {
            let i = first;
            while (i <= last) {
              const cached = chunks.get(`${file}:${i}`);
              if (cached) {
                // Re-inserting keeps the map in least recently used order.
                chunks.delete(`${file}:${i}`);
                chunks.set(`${file}:${i}`, cached);
                got.set(i, cached);
                i++;
                continue;
              }
              let runEnd = i;
              while (runEnd < last && !chunks.has(`${file}:${runEnd + 1}`)) {
                runEnd++;
              }
              for (const [index, bytes] of await fetchChunks(url, entry, chunkSize, i, runEnd)) {
                got.set(index, bytes);
                remember(`${file}:${index}`, bytes);
              }
              i = runEnd + 1;
            }
          } catch (failed) {
            return failed.status === 404 ? -44 : -29;
          }
  
          for (let i = first; i <= last; i++) {
            const chunkStart = i * chunkSize;
            const from = Math.max(offset, chunkStart);
            const to = Math.min(offset + length, chunkStart + chunkSize);
            HEAPU8.set(got.get(i).subarray(from - chunkStart, to - chunkStart), buffer + from - offset);
          }
          return length;
        },
  
        getSize: async (file) => (await entriesReady).get(indexKey(urlOf(file)))?.size ?? 0,
      };
    };

  var wasmFSPreloadedDirs = [];
  var __wasmfs_get_num_preloaded_dirs = () => wasmFSPreloadedDirs.length;

  var wasmFSPreloadedFiles = [];
  
  var wasmFSPreloadingFlushed = false;
  var __wasmfs_get_num_preloaded_files = () => {
      // When this method is called from WasmFS it means that we are about to
      // flush all the preloaded data, so mark that. (There is no call that
      // occurs at the end of that flushing, which would be more natural, but it
      // is fine to mark the flushing here as during the flushing itself no user
      // code can run, so nothing will check whether we have flushed or not.)
      wasmFSPreloadingFlushed = true;
      return wasmFSPreloadedFiles.length;
    };

  var __wasmfs_get_preloaded_child_path = (index, childNameBuffer) => {
      var s = wasmFSPreloadedDirs[index].childName;
      var len = lengthBytesUTF8(s) + 1;
      stringToUTF8(s, childNameBuffer, len);
    };

  var __wasmfs_get_preloaded_file_mode = (index) => wasmFSPreloadedFiles[index].mode;

  var __wasmfs_get_preloaded_file_size = (index) =>
      wasmFSPreloadedFiles[index].fileData.length;

  var __wasmfs_get_preloaded_parent_path = (index, parentPathBuffer) => {
      var s = wasmFSPreloadedDirs[index].parentPath;
      var len = lengthBytesUTF8(s) + 1;
      stringToUTF8(s, parentPathBuffer, len);
    };

  var lengthBytesUTF8 = (str) => {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
        // unit, not a Unicode code point of the character! So decode
        // UTF16->UTF32->UTF8.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        var c = str.charCodeAt(i); // possibly a lead surrogate
        if (c <= 0x7F) {
          len++;
        } else if (c <= 0x7FF) {
          len += 2;
        } else if (c >= 0xD800 && c <= 0xDFFF) {
          len += 4; ++i;
        } else {
          len += 3;
        }
      }
      return len;
    };
  
  var __wasmfs_get_preloaded_path_name = (index, fileNameBuffer) => {
      var s = wasmFSPreloadedFiles[index].pathName;
      var len = lengthBytesUTF8(s) + 1;
      stringToUTF8(s, fileNameBuffer, len);
    };

  var __wasmfs_jsimpl_alloc_file = (backend, file) => {
      return wasmFS$backends[backend].allocFile(file);
    };

  async function __wasmfs_jsimpl_async_alloc_file(ctx, backend, file) {
      await wasmFS$backends[backend].allocFile(file);
      _emscripten_proxy_finish(ctx);
    }

  async function __wasmfs_jsimpl_async_free_file(ctx, backend, file) {
      await wasmFS$backends[backend].freeFile(file);
      _emscripten_proxy_finish(ctx);
    }

  
  async function __wasmfs_jsimpl_async_get_size(ctx, backend, file, size_p) {
      var size = await wasmFS$backends[backend].getSize(file);
      HEAP64[((size_p)>>3)] = BigInt(size);
      _emscripten_proxy_finish(ctx);
    }

  
  
  async function __wasmfs_jsimpl_async_read(ctx, backend, file, buffer, length, offset, result_p) {
    offset = bigintToI53Checked(offset);
  
  
      var result = await wasmFS$backends[backend].read(file, buffer, length, offset);
      HEAPU32[((result_p)>>2)] = result;
      _emscripten_proxy_finish(ctx);
    ;
  }

  
  
  async function __wasmfs_jsimpl_async_write(ctx, backend, file, buffer, length, offset, result_p) {
    offset = bigintToI53Checked(offset);
  
  
      var result = await wasmFS$backends[backend].write(file, buffer, length, offset);
      HEAPU32[((result_p)>>2)] = result;
      _emscripten_proxy_finish(ctx);
    ;
  }

  var __wasmfs_jsimpl_free_file = (backend, file) => {
      return wasmFS$backends[backend].freeFile(file);
    };

  var __wasmfs_jsimpl_get_size = (backend, file) => {
      return wasmFS$backends[backend].getSize(file);
    };

  function __wasmfs_jsimpl_read(backend, file, buffer, length, offset) {
    offset = bigintToI53Checked(offset);
  
  
      if (!wasmFS$backends[backend].read) {
        return -28;
      }
      return wasmFS$backends[backend].read(file, buffer, length, offset);
    ;
  }

  function __wasmfs_jsimpl_set_size(backend, file, size) {
    size = bigintToI53Checked(size);
  
  
      return wasmFS$backends[backend].setSize(file, size);
    ;
  }

  function __wasmfs_jsimpl_write(backend, file, buffer, length, offset) {
    offset = bigintToI53Checked(offset);
  
  
      if (!wasmFS$backends[backend].write) {
        return -28;
      }
      return wasmFS$backends[backend].write(file, buffer, length, offset);
    ;
  }

  class HandleAllocator {
      allocated = [undefined];
      freelist = [];
      get(id) {
        return this.allocated[id];
      }
      has(id) {
        return this.allocated[id] !== undefined;
      }
      allocate(handle) {
        var id = this.freelist.pop() ?? this.allocated.length;
        this.allocated[id] = handle;
        return id;
      }
      free(id) {
        // Set the slot to `undefined` rather than using `delete` here since
        // apparently arrays with holes in them can be less efficient.
        this.allocated[id] = undefined;
        this.freelist.push(id);
      }
    }
  var wasmfsOPFSAccessHandles = new HandleAllocator();
  
  var wasmfsOPFSProxyFinish = (ctx) => {
      // When using pthreads the proxy needs to know when the work is finished.
      // When used with JSPI the work will be executed in an async block so there
      // is no need to notify when done.
      _emscripten_proxy_finish(ctx);
    };
  
  var __wasmfs_opfs_close_access = async (ctx, accessID, errPtr) => {
      let accessHandle = wasmfsOPFSAccessHandles.get(accessID);
      try {
        await accessHandle.close();
      } catch {
        let err = -29;
        HEAP32[((errPtr)>>2)] = err;
      }
      wasmfsOPFSAccessHandles.free(accessID);
      wasmfsOPFSProxyFinish(ctx);
    };

  var wasmfsOPFSBlobs = new HandleAllocator();
  var __wasmfs_opfs_close_blob = (blobID) => {
      wasmfsOPFSBlobs.free(blobID);
    };

  
  
  var __wasmfs_opfs_flush_access = async (ctx, accessID, errPtr) => {
      let accessHandle = wasmfsOPFSAccessHandles.get(accessID);
      try {
        await accessHandle.flush();
      } catch {
        let err = -29;
        HEAP32[((errPtr)>>2)] = err;
      }
      wasmfsOPFSProxyFinish(ctx);
    };

  var wasmfsOPFSDirectoryHandles = new HandleAllocator();
  var __wasmfs_opfs_free_directory = (dirID) => {
      wasmfsOPFSDirectoryHandles.free(dirID);
    };

  var wasmfsOPFSFileHandles = new HandleAllocator();
  var __wasmfs_opfs_free_file = (fileID) => {
      wasmfsOPFSFileHandles.free(fileID);
    };

  
  var wasmfsOPFSGetOrCreateFile = async (parent, name, create) => {
      let parentHandle = wasmfsOPFSDirectoryHandles.get(parent);
      let fileHandle;
      try {
        fileHandle = await parentHandle.getFileHandle(name, {create: create});
      } catch (e) {
        if (e.name === 'NotFoundError') {
          return -20;
        }
        if (e.name === 'TypeMismatchError') {
          return -31;
        }
        return -29;
      }
      return wasmfsOPFSFileHandles.allocate(fileHandle);
    };
  
  var wasmfsOPFSGetOrCreateDir = async (parent, name, create) => {
      let parentHandle = wasmfsOPFSDirectoryHandles.get(parent);
      let childHandle;
      try {
        childHandle =
            await parentHandle.getDirectoryHandle(name, {create: create});
      } catch (e) {
        if (e.name === 'NotFoundError') {
          return -20;
        }
        if (e.name === 'TypeMismatchError') {
          return -54;
        }
        return -29;
      }
      return wasmfsOPFSDirectoryHandles.allocate(childHandle);
    };
  
  
  
  var __wasmfs_opfs_get_child = async (ctx, parent, namePtr, childTypePtr, childIDPtr) => {
      let name = UTF8ToString(namePtr);
      let childType = 1;
      let childID = await wasmfsOPFSGetOrCreateFile(parent, name, false);
      if (childID == -31) {
        childType = 2;
        childID = await wasmfsOPFSGetOrCreateDir(parent, name, false);
      }
      HEAP32[((childTypePtr)>>2)] = childType;
      HEAP32[((childIDPtr)>>2)] = childID;
      wasmfsOPFSProxyFinish(ctx);
    };

  
  
  
  
  var __wasmfs_opfs_get_entries = async (ctx, dirID, entriesPtr, errPtr) => {
      let dirHandle = wasmfsOPFSDirectoryHandles.get(dirID);
  
      // TODO: Use 'for await' once Acorn supports that.
      try {
        let iter = dirHandle.entries();
        for (let entry; entry = await iter.next(), !entry.done;) {
          let [name, child] = entry.value;
          let sp = stackSave();
          let namePtr = stringToUTF8OnStack(name);
          let type = child.kind == 'file' ?
              1 :
              2;
            __wasmfs_opfs_record_entry(entriesPtr, namePtr, type)
          stackRestore(sp);
        }
      } catch {
        let err = -29;
        HEAP32[((errPtr)>>2)] = err;
      }
      wasmfsOPFSProxyFinish(ctx);
    };

  
  
  var __wasmfs_opfs_get_size_access = async (ctx, accessID, sizePtr) => {
      let accessHandle = wasmfsOPFSAccessHandles.get(accessID);
      let size;
      try {
        size = await accessHandle.getSize();
      } catch {
        size = -29;
      }
      HEAP64[((sizePtr)>>3)] = BigInt(size);
      wasmfsOPFSProxyFinish(ctx);
    };

  
  var __wasmfs_opfs_get_size_blob = function(blobID) {
  
  var ret = (() => { 
      // This cannot fail.
  	  return wasmfsOPFSBlobs.get(blobID).size;
     })();
  return BigInt(ret);
  };

  
  
  var __wasmfs_opfs_get_size_file = async (ctx, fileID, sizePtr) => {
      let fileHandle = wasmfsOPFSFileHandles.get(fileID);
      let size;
      try {
        size = (await fileHandle.getFile()).size;
      } catch {
        size = -29;
      }
      HEAP64[((sizePtr)>>3)] = BigInt(size);
      wasmfsOPFSProxyFinish(ctx);
    };

  
  var __wasmfs_opfs_init_root_directory = async (ctx) => {
      // allocated.length starts off as 1 since 0 is a reserved handle
      if (wasmfsOPFSDirectoryHandles.allocated.length == 1) {
        // Closure compiler errors on this as it does not recognize the OPFS
        // API yet, it seems. Unfortunately an existing annotation for this is in
        // the closure compiler codebase, and cannot be overridden in user code
        // (it complains on a duplicate type annotation), so just suppress it.
        /** @suppress {checkTypes} */
        let root = await navigator.storage.getDirectory();
        wasmfsOPFSDirectoryHandles.allocated.push(root);
      }
      wasmfsOPFSProxyFinish(ctx);
    };

  
  
  
  var __wasmfs_opfs_insert_directory = async (ctx, parent, namePtr, childIDPtr) => {
      let name = UTF8ToString(namePtr);
      let childID = await wasmfsOPFSGetOrCreateDir(parent, name, true);
      HEAP32[((childIDPtr)>>2)] = childID;
      wasmfsOPFSProxyFinish(ctx);
    };

  
  
  
  var __wasmfs_opfs_insert_file = async (ctx, parent, namePtr, childIDPtr) => {
      let name = UTF8ToString(namePtr);
      let childID = await wasmfsOPFSGetOrCreateFile(parent, name, true);
      HEAP32[((childIDPtr)>>2)] = childID;
      wasmfsOPFSProxyFinish(ctx);
    };

  
  
  
  
  var __wasmfs_opfs_move_file = async (ctx, fileID, newParentID, namePtr, errPtr) => {
      let name = UTF8ToString(namePtr);
      let fileHandle = wasmfsOPFSFileHandles.get(fileID);
      let newDirHandle = wasmfsOPFSDirectoryHandles.get(newParentID);
      try {
        await fileHandle.move(newDirHandle, name);
      } catch {
        let err = -29;
        HEAP32[((errPtr)>>2)] = err;
      }
      wasmfsOPFSProxyFinish(ctx);
    };

  
  
  
  var __wasmfs_opfs_open_access = async (ctx, fileID, accessIDPtr) => {
      let fileHandle = wasmfsOPFSFileHandles.get(fileID);
      let accessID;
      try {
        let accessHandle;
        // TODO: Remove this once the Access Handles API has settled.
        // TODO: Closure is confused by this code that supports two versions of
        //       the same API, so suppress type checking on it.
        /** @suppress {checkTypes} */
        var len = FileSystemFileHandle.prototype.createSyncAccessHandle.length;
        if (len == 0) {
          accessHandle = await fileHandle.createSyncAccessHandle();
        } else {
          accessHandle = await fileHandle.createSyncAccessHandle(
              {mode: 'in-place'});
        }
        accessID = wasmfsOPFSAccessHandles.allocate(accessHandle);
      } catch (e) {
        // TODO: Presumably only one of these will appear in the final API?
        if (e.name === 'InvalidStateError' ||
            e.name === 'NoModificationAllowedError') {
          accessID = -2;
        } else {
          accessID = -29;
        }
      }
      HEAP32[((accessIDPtr)>>2)] = accessID;
      wasmfsOPFSProxyFinish(ctx);
    };

  
  
  
  var __wasmfs_opfs_open_blob = async (ctx, fileID, blobIDPtr) => {
      let fileHandle = wasmfsOPFSFileHandles.get(fileID);
      let blobID;
      try {
        let blob = await fileHandle.getFile();
        blobID = wasmfsOPFSBlobs.allocate(blob);
      } catch (e) {
        if (e.name === 'NotAllowedError') {
          blobID = -2;
        } else {
          blobID = -29;
        }
      }
      HEAP32[((blobIDPtr)>>2)] = blobID;
      wasmfsOPFSProxyFinish(ctx);
    };

  
  
  function __wasmfs_opfs_read_access(accessID, bufPtr, len, pos) {
    pos = bigintToI53Checked(pos);
  
  
      let accessHandle = wasmfsOPFSAccessHandles.get(accessID);
      let data = HEAPU8.subarray(bufPtr, bufPtr + len);
      try {
        return accessHandle.read(data, {at: pos});
      } catch (e) {
        if (e.name == 'TypeError') {
          return -28;
        }
        return -29;
      }
    ;
  }

  
  
  
  
  async function __wasmfs_opfs_read_blob(ctx, blobID, bufPtr, len, pos, nreadPtr) {
    pos = bigintToI53Checked(pos);
  
  
      let blob = wasmfsOPFSBlobs.get(blobID);
      let slice = blob.slice(pos, pos + len);
      let nread = 0;
  
      try {
        // TODO: Use ReadableStreamBYOBReader once
        // https://bugs.chromium.org/p/chromium/issues/detail?id=1189621 is
        // resolved.
        let buf = await slice.arrayBuffer();
        let data = new Uint8Array(buf);
        HEAPU8.set(data, bufPtr);
        nread += data.length;
      } catch (e) {
        if (e instanceof RangeError) {
          nread = -21;
        } else {
          nread = -29;
        }
      }
  
      HEAP32[((nreadPtr)>>2)] = nread;
      wasmfsOPFSProxyFinish(ctx);
    ;
  }

  
  
  
  var __wasmfs_opfs_remove_child = async (ctx, dirID, namePtr, errPtr) => {
      let name = UTF8ToString(namePtr);
      let dirHandle = wasmfsOPFSDirectoryHandles.get(dirID);
      try {
        await dirHandle.removeEntry(name);
      } catch {
        let err = -29;
        HEAP32[((errPtr)>>2)] = err;
      }
      wasmfsOPFSProxyFinish(ctx);
    };

  
  
  
  async function __wasmfs_opfs_set_size_access(ctx, accessID, size, errPtr) {
    size = bigintToI53Checked(size);
  
  
      let accessHandle = wasmfsOPFSAccessHandles.get(accessID);
      try {
        await accessHandle.truncate(size);
      } catch {
        let err = -29;
        HEAP32[((errPtr)>>2)] = err;
      }
      wasmfsOPFSProxyFinish(ctx);
    ;
  }

  
  
  
  async function __wasmfs_opfs_set_size_file(ctx, fileID, size, errPtr) {
    size = bigintToI53Checked(size);
  
  
      let fileHandle = wasmfsOPFSFileHandles.get(fileID);
      try {
        let writable = await fileHandle.createWritable({keepExistingData: true});
        await writable.truncate(size);
        await writable.close();
      } catch {
        let err = -29;
        HEAP32[((errPtr)>>2)] = err;
      }
      wasmfsOPFSProxyFinish(ctx);
    ;
  }

  
  
  function __wasmfs_opfs_write_access(accessID, bufPtr, len, pos) {
    pos = bigintToI53Checked(pos);
  
  
      let accessHandle = wasmfsOPFSAccessHandles.get(accessID);
      let data = HEAPU8.subarray(bufPtr, bufPtr + len);
      try {
        return accessHandle.write(data, {at: pos});
      } catch (e) {
        if (e.name == 'TypeError') {
          return -28;
        }
        return -29;
      }
    ;
  }

  var FS_stdin_getChar_buffer = [];
  
  
  /** @type {function(string, boolean=, number=)} */
  var intArrayFromString = (stringy, dontAddNull, length) => {
      var len = length > 0 ? length : lengthBytesUTF8(stringy)+1;
      var u8array = new Array(len);
      var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
      if (dontAddNull) u8array.length = numBytesWritten;
      return u8array;
    };
  var FS_stdin_getChar = () => {
      if (!FS_stdin_getChar_buffer.length) {
        var result = null;
        if (globalThis.window?.prompt) {
          // Browser.
          result = window.prompt('Input: ');  // returns null on cancel
          if (result !== null) {
            result += '\n';
          }
        } else
        {}
        if (!result) {
          return null;
        }
        FS_stdin_getChar_buffer = intArrayFromString(result, true);
      }
      return FS_stdin_getChar_buffer.shift();
    };
  var __wasmfs_stdin_get_char = () => {
      // Return the read character, or -1 to indicate EOF.
      var c = FS_stdin_getChar();
      if (typeof c === 'number') {
        return c;
      }
      return -1;
    };

  var __wasmfs_thread_utils_heartbeat = (queue) => {
      var intervalID =
        setInterval(() => {
          if (ABORT) {
            clearInterval(intervalID);
          } else {
            _emscripten_proxy_execute_queue(queue);
          }
        }, 50);
    };

  var _emscripten_get_now = () => performance.timeOrigin + performance.now();
  
  var _emscripten_date_now = () => Date.now();
  
  var nowIsMonotonic = 1;
  
  var checkWasiClock = (clock_id) => clock_id >= 0 && clock_id <= 3;
  
  
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
      var nsec = Math.round(now * 1_000_000);
      HEAP64[((ptime)>>3)] = BigInt(nsec);
      return 0;
    ;
  }

  var readEmAsmArgsArray = [];
  
  
  
  
  
  var readEmAsmArgs = (sigPtr, buf) => {
      readEmAsmArgsArray.length = 0;
      var ch;
      // Most arguments are i32s, so shift the buffer pointer so it is a plain
      // index into HEAP32.
      while (ch = HEAPU8[sigPtr++]) {
        // Floats are always passed as doubles, so all types except for 'i'
        // are 8 bytes and require alignment.
        var wide = (ch != 105);
        wide &= (ch != 112);
        buf += wide && (buf % 8) ? 4 : 0;
        readEmAsmArgsArray.push(
          // Special case for pointers under wasm64 or CAN_ADDRESS_2GB mode.
          ch == 112 ? HEAPU32[((buf)>>2)] :
          ch == 106 ? HEAP64[((buf)>>3)] :
          ch == 105 ?
            HEAP32[((buf)>>2)] :
            HEAPF64[((buf)>>3)]
        );
        buf += wide ? 8 : 4;
      }
      return readEmAsmArgsArray;
    };
  
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
  var _emscripten_asm_const_double_sync_on_main_thread = _emscripten_asm_const_int_sync_on_main_thread;

  var runEmAsmFunction = (code, sigPtr, argbuf) => {
      var args = readEmAsmArgs(sigPtr, argbuf);
      return ASM_CONSTS[code](...args);
    };
  var _emscripten_asm_const_int = (code, sigPtr, argbuf) => {
      return runEmAsmFunction(code, sigPtr, argbuf);
    };


  var _emscripten_asm_const_ptr_sync_on_main_thread = (emAsmAddr, sigPtr, argbuf) => runMainThreadEmAsm(emAsmAddr, sigPtr, argbuf, 1);

  var _emscripten_check_blocking_allowed = () => {
    };


  var _emscripten_err = (str) => err(UTF8ToString(str));

  
  var onExits = [];
  var addOnExit = (cb) => onExits.push(cb);
  var JSEvents = {
  removeAllEventListeners() {
        while (JSEvents.eventHandlers.length) {
          JSEvents._removeHandler(JSEvents.eventHandlers.length - 1);
        }
        JSEvents.deferredCalls = [];
      },
  inEventHandler:0,
  deferredCalls:[],
  deferCall(targetFunction, precedence, argsList) {
        function arraysHaveEqualContent(arrA, arrB) {
          if (arrA.length != arrB.length) return false;
  
          for (var i = 0; i < arrA.length; i++) {
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
  
        JSEvents.deferredCalls.sort((x,y) => x.precedence - y.precedence);
      },
  removeDeferredCalls(targetFunction) {
        JSEvents.deferredCalls = JSEvents.deferredCalls.filter((call) => call.targetFunction != targetFunction);
      },
  canPerformEventHandlerRequests() {
        // Browsers that support navigator.userActivation.isActive: https://developer.mozilla.org/en-US/docs/Web/API/UserActivation/isActive
        if (navigator.userActivation) {
          // Verify against transient activation status from UserActivation API
          // whether it is possible to perform a request here without needing to defer. See
          // https://developer.mozilla.org/en-US/docs/Web/Security/User_activation#transient_activation
          // and https://caniuse.com/mdn-api_useractivation
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
  eventHandlers:[],
  removeAllHandlersOnTarget:(target, eventTypeString) => {
        for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
          if (JSEvents.eventHandlers[i].target == target &&
            (!eventTypeString || eventTypeString == JSEvents.eventHandlers[i].eventTypeString)) {
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
  
          eventHandler.target.addEventListener(eventHandler.eventTypeString,
                                               eventHandler.eventListenerFunc,
                                               eventHandler.useCapture);
          JSEvents.eventHandlers.push(eventHandler);
        } else {
          for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
            if (JSEvents.eventHandlers[i].target == eventHandler.target
             && JSEvents.eventHandlers[i].eventTypeString == eventHandler.eventTypeString) {
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
          if (handler.target === eventHandler.target
            && handler.eventTypeId === eventHandler.eventTypeId
            && handler.callbackfunc === eventHandler.callbackfunc
            && handler.userData === eventHandler.userData) {
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
        if (target == window) return '#window';
        if (target == screen) return '#screen';
        return target?.nodeName ?? '';
      },
  fullscreenEnabled() {
        return document.fullscreenEnabled
        // Safari 13.0.3 on macOS Catalina 10.15.1 still ships with prefixed webkitFullscreenEnabled.
        // TODO: If Safari at some point ships with unprefixed version, update the version check above.
        ?? document.webkitFullscreenEnabled
         ;
      },
  };
  
  /** @type {Object} */
  var specialHTMLTargets = [0, globalThis.document ?? 0, globalThis.window ?? 0];
  
  
  var maybeCStringToJsString = (cString) => {
      // 'cString > 2' checks if the input is a number, and isn't of the special
      // values we accept here, EMSCRIPTEN_EVENT_TARGET_* (which map to 0, 1, 2).
      // In other words, if cString > 2 then it's a pointer to a valid place in
      // memory, and points to a C string.
      return cString > 2 ? UTF8ToString(cString) : cString;
    };
  
  var findEventTarget = (target) => {
      target = maybeCStringToJsString(target);
      var domElement = specialHTMLTargets[target] || globalThis.document?.querySelector(target);
      return domElement;
    };
  var findCanvasEventTarget = findEventTarget;
  
  var getCanvasSizeCallingThread = (target, width, height) => {
      var canvas = findCanvasEventTarget(target);
      if (!canvas) return -4;
  
      if (!canvas.controlTransferredOffscreen) {
        HEAP32[((width)>>2)] = canvas.width;
        HEAP32[((height)>>2)] = canvas.height;
      } else {
        return -4;
      }
      return 0;
    };
  
  
  
  function getCanvasSizeMainThread(target, width, height) {
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(4, 0, 1, target, width, height);
  return getCanvasSizeCallingThread(target, width, height)
  }
  
  
  var _emscripten_get_canvas_element_size = (target, width, height) => {
      var canvas = findCanvasEventTarget(target);
      if (canvas) {
        return getCanvasSizeCallingThread(target, width, height);
      }
      return getCanvasSizeMainThread(target, width, height);
    };
  
  
  
  
  
  var stringToUTF8OnStack = (str) => {
      var size = lengthBytesUTF8(str) + 1;
      var ret = stackAlloc(size);
      stringToUTF8(str, ret, size);
      return ret;
    };
  
  var getCanvasElementSize = (target) => {
      var sp = stackSave();
      var w = stackAlloc(8);
      var h = w + 4;
  
      var targetInt = stringToUTF8OnStack(target.id);
      var ret = _emscripten_get_canvas_element_size(targetInt, w, h);
      var size = [HEAP32[((w)>>2)], HEAP32[((h)>>2)]];
      stackRestore(sp);
      return size;
    };
  
  var setCanvasElementSizeCallingThread = (target, width, height) => {
      var canvas = findCanvasEventTarget(target);
      if (!canvas) return -4;
  
      if (!canvas.controlTransferredOffscreen) {
        var autoResizeViewport = false;
        if (canvas.GLctxObject?.GLctx) {
          var prevViewport = canvas.GLctxObject.GLctx.getParameter(0xBA2 /* GL_VIEWPORT */);
          // TODO: Perhaps autoResizeViewport should only be true if FBO 0 is currently active?
          autoResizeViewport = (!prevViewport[0] && !prevViewport[1] && prevViewport[2] === canvas.width && prevViewport[3] === canvas.height);
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
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(5, 0, 1, target, width, height);
  return setCanvasElementSizeCallingThread(target, width, height)
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
  
  var currentFullscreenStrategy = 0;
  
  
  var callCanvasResizedCallback = (strategy) => {
      if (strategy.canvasResizedCallback) {
        if (strategy.canvasResizedCallbackTargetThread) __emscripten_run_callback_on_thread(strategy.canvasResizedCallbackTargetThread, strategy.canvasResizedCallback, 37, 0, 0, strategy.canvasResizedCallbackUserData);
        else
        getWasmTableEntry(strategy.canvasResizedCallback)(37, 0, strategy.canvasResizedCallbackUserData);
      }
    };
  var registerRestoreOldStyle = (canvas) => {
      var canvasSize = getCanvasElementSize(canvas);
      var oldWidth = canvasSize[0];
      var oldHeight = canvasSize[1];
      var oldCssWidth = canvas.style.width;
      var oldCssHeight = canvas.style.height;
      var oldBackgroundColor = canvas.style.backgroundColor; // Chrome reads color from here.
      var oldDocumentBackgroundColor = document.body.style.backgroundColor; // IE11 reads color from here.
      // Firefox always has black background color.
      var oldPaddingLeft = canvas.style.paddingLeft; // Chrome, FF, Safari
      var oldPaddingRight = canvas.style.paddingRight;
      var oldPaddingTop = canvas.style.paddingTop;
      var oldPaddingBottom = canvas.style.paddingBottom;
      var oldMarginLeft = canvas.style.marginLeft; // IE11
      var oldMarginRight = canvas.style.marginRight;
      var oldMarginTop = canvas.style.marginTop;
      var oldMarginBottom = canvas.style.marginBottom;
      var oldDocumentBodyMargin = document.body.style.margin;
      var oldDocumentOverflow = document.documentElement.style.overflow; // Chrome, Firefox
      var oldDocumentScroll = document.body.scroll; // IE
      var oldImageRendering = canvas.style.imageRendering;
  
      function restoreOldStyle() {
        if (!getFullscreenElement()) {
          document.removeEventListener('fullscreenchange', restoreOldStyle);
  
          document.removeEventListener('webkitfullscreenchange', restoreOldStyle);
  
          setCanvasElementSize(canvas, oldWidth, oldHeight);
  
          canvas.style.width = oldCssWidth;
          canvas.style.height = oldCssHeight;
          canvas.style.backgroundColor = oldBackgroundColor; // Chrome
          // IE11 hack: assigning 'undefined' or an empty string to document.body.style.backgroundColor has no effect, so first assign back the default color
          // before setting the undefined value. Setting undefined value is also important, or otherwise we would later treat that as something that the user
          // had explicitly set so subsequent fullscreen transitions would not set background color properly.
          if (!oldDocumentBackgroundColor) document.body.style.backgroundColor = 'white';
          document.body.style.backgroundColor = oldDocumentBackgroundColor; // IE11
          canvas.style.paddingLeft = oldPaddingLeft; // Chrome, FF, Safari
          canvas.style.paddingRight = oldPaddingRight;
          canvas.style.paddingTop = oldPaddingTop;
          canvas.style.paddingBottom = oldPaddingBottom;
          canvas.style.marginLeft = oldMarginLeft; // IE11
          canvas.style.marginRight = oldMarginRight;
          canvas.style.marginTop = oldMarginTop;
          canvas.style.marginBottom = oldMarginBottom;
          document.body.style.margin = oldDocumentBodyMargin;
          document.documentElement.style.overflow = oldDocumentOverflow; // Chrome, Firefox
          document.body.scroll = oldDocumentScroll; // IE
          canvas.style.imageRendering = oldImageRendering;
          if (canvas.GLctxObject) canvas.GLctxObject.GLctx.viewport(0, 0, oldWidth, oldHeight);
  
          callCanvasResizedCallback(currentFullscreenStrategy);
        }
      }
      document.addEventListener('fullscreenchange', restoreOldStyle);
      document.addEventListener('webkitfullscreenchange', restoreOldStyle);
      return restoreOldStyle;
    };
  
  
  var setLetterbox = (element, topBottom, leftRight) => {
      // Cannot use margin to specify letterboxes in FF or Chrome, since those ignore margins in fullscreen mode.
      element.style.paddingLeft = element.style.paddingRight = leftRight + 'px';
      element.style.paddingTop = element.style.paddingBottom = topBottom + 'px';
    };
  
  
  var getBoundingClientRect = (e) => specialHTMLTargets.indexOf(e) < 0 ? e.getBoundingClientRect() : {'left':0,'top':0};
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
        if (cssWidth*windowedRttHeight < windowedRttWidth*cssHeight) {
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
      target.style.backgroundColor ||= 'black';
      // IE11 does the same, but requires the color to be set in the document body.
      document.body.style.backgroundColor ||= 'black'; // IE11
      // Firefox always shows black letterboxes independent of style color.
  
      target.style.width = cssWidth + 'px';
      target.style.height = cssHeight + 'px';
  
      if (strategy.filteringMode == 1) {
        target.style.imageRendering = 'optimizeSpeed';
        target.style.imageRendering = '-moz-crisp-edges';
        target.style.imageRendering = '-o-crisp-edges';
        target.style.imageRendering = '-webkit-optimize-contrast';
        target.style.imageRendering = 'optimize-contrast';
        target.style.imageRendering = 'crisp-edges';
        target.style.imageRendering = 'pixelated';
      }
  
      var dpiScale = (strategy.canvasResolutionScaleMode == 2) ? devicePixelRatio : 1;
      if (strategy.canvasResolutionScaleMode != 0) {
        var newWidth = (cssWidth * dpiScale)|0;
        var newHeight = (cssHeight * dpiScale)|0;
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
        // Safari didn't Element.requestFullscreen support until 16.4
        // See: https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen
        target.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      } else {
        return JSEvents.fullscreenEnabled() ? -3 : -1;
      }
  
      currentFullscreenStrategy = strategy;
      callCanvasResizedCallback(strategy);
      return 0;
    };
  
  
  function _emscripten_exit_fullscreen() {
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(3, 0, 1);
  
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
  

  
  var requestPointerLock = (target) => {
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
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(6, 0, 1);
  
      // Make sure no queued up calls will fire after this.
      JSEvents.removeDeferredCalls(requestPointerLock);
      if (!document.exitPointerLock) return -1;
      document.exitPointerLock();
      return 0;
    
  }
  

  var runtimeKeepalivePush = () => {
      runtimeKeepaliveCounter += 1;
    };
  var _emscripten_exit_with_live_runtime = () => {
      runtimeKeepalivePush();
      throw 'unwind';
    };

  
  function _emscripten_get_device_pixel_ratio() {
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(7, 0, 1);
  
      return devicePixelRatio;
    
  }
  

  
  
  
  
  function _emscripten_get_element_css_size(target, width, height) {
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(8, 0, 1, target, width, height);
  
      target = findEventTarget(target);
      if (!target) return -4;
  
      var rect = getBoundingClientRect(target);
      HEAPF64[((width)>>3)] = rect.width;
      HEAPF64[((height)>>3)] = rect.height;
  
      return 0;
    
  }
  

  
  
  
  function getFullscreenElement() {
      return document.fullscreenElement
             ?? document.webkitFullscreenElement
             ;
    }
  
  /** @type {!Int8Array} */
  var HEAP8;
  
  var fillFullscreenChangeEventData = (eventStruct) => {
      var fullscreenElement = getFullscreenElement();
      var isFullscreen = !!fullscreenElement;
      // Assigning a boolean to HEAP32 with expected type coercion.
      /** @suppress{checkTypes} */
      HEAP8[eventStruct] = isFullscreen;
      HEAP8[(eventStruct)+(1)] = JSEvents.fullscreenEnabled();
      // If transitioning to fullscreen, report info about the element that is now fullscreen.
      // If transitioning to windowed mode, report info about the element that just was fullscreen.
      var reportedElement = isFullscreen ? fullscreenElement : JSEvents.previousFullscreenElement;
      var nodeName = JSEvents.getNodeNameForTarget(reportedElement);
      var id = reportedElement?.id ?? '';
      stringToUTF8(nodeName, eventStruct + 2, 128);
      stringToUTF8(id, eventStruct + 130, 128);
      HEAP32[(((eventStruct)+(260))>>2)] = reportedElement?.clientWidth ?? 0;
      HEAP32[(((eventStruct)+(264))>>2)] = reportedElement?.clientHeight ?? 0;
      HEAP32[(((eventStruct)+(268))>>2)] = screen.width;
      HEAP32[(((eventStruct)+(272))>>2)] = screen.height;
      if (isFullscreen) {
        JSEvents.previousFullscreenElement = fullscreenElement;
      }
    };
  
  
  function _emscripten_get_fullscreen_status(fullscreenStatus) {
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(9, 0, 1, fullscreenStatus);
  
      if (!JSEvents.fullscreenEnabled()) return -1;
      fillFullscreenChangeEventData(fullscreenStatus);
      return 0;
    
  }
  

  
  
  
  
  var fillGamepadEventData = (eventStruct, e) => {
      HEAPF64[((eventStruct)>>3)] = e.timestamp;
      for (var i = 0; i < e.axes.length; ++i) {
        HEAPF64[(((eventStruct+i*8)+(16))>>3)] = e.axes[i];
      }
      for (var i = 0; i < e.buttons.length; ++i) {
        HEAP8[(eventStruct+i)+(1040)] = e.buttons[i].pressed;
        HEAPF64[(((eventStruct+i*8)+(528))>>3)] = e.buttons[i].value;
      }
      HEAP8[(eventStruct)+(1104)] = e.connected;
      HEAP32[(((eventStruct)+(1108))>>2)] = e.index;
      HEAP32[(((eventStruct)+(8))>>2)] = e.axes.length;
      HEAP32[(((eventStruct)+(12))>>2)] = e.buttons.length;
      stringToUTF8(e.id, eventStruct + 1112, 64);
      stringToUTF8(e.mapping, eventStruct + 1176, 64);
    };
  
  
  function _emscripten_get_gamepad_status(index, gamepadState) {
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(10, 0, 1, index, gamepadState);
  
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
  

  var getHeapMax = () =>
      HEAPU8.length;
  var _emscripten_get_heap_max = () => getHeapMax();

  
  
  var _emscripten_set_main_loop_timing = (mode, value) => {
      MainLoop.timingMode = mode;
      MainLoop.timingValue = value;
  
      if (!MainLoop.func) {
        return 1; // Return non-zero on failure, can't set timing mode when there is no main loop.
      }
  
      // If there is no existing scheduler then we are transitioning from
      // inactive to active and we add to runtime keepalive counter.
      if (!MainLoop.scheduler) {
        runtimeKeepalivePush();
      }
      if (mode == 0) {
        MainLoop.scheduler = function MainLoop_scheduler_setTimeout() {
          var timeUntilNextTick = Math.max(0, MainLoop.tickStartTime + value - _emscripten_get_now())|0;
          setTimeout(MainLoop.runner, timeUntilNextTick); // doing this each time means that on exception, we stop
        };
      } else if (mode == 1) {
        MainLoop.scheduler = function MainLoop_scheduler_rAF() {
          MainLoop.requestAnimationFrame(MainLoop.runner);
        };
      } else {
        if (!MainLoop.setImmediate) {
          if (globalThis.scheduler) {
            // Some modern browsers implement scheduler.postTask, but not all.
            MainLoop.setImmediate = scheduler.postTask.bind(scheduler);
          } else {
            // Emulate setImmediate. (note: not a complete polyfill, we don't emulate clearImmediate() to keep code size to minimum, since not needed)
            var setImmediates = [];
            var emscriptenMainLoopMessageId = 'setimmediate';
            /** @param {Event} event */
            var MainLoop_setImmediate_messageHandler = (event) => {
              if (event.data === emscriptenMainLoopMessageId) {
                event.stopPropagation();
                setImmediates.shift()();
              }
            };
            addEventListener('message', MainLoop_setImmediate_messageHandler, true);
            MainLoop.setImmediate = /** @type{function(function(): ?, ...?): number} */((func) => {
              setImmediates.push(func);
              if (ENVIRONMENT_IS_WORKER) {
                // The postMessge API in a Worker, sends message to the main
                // thread and does not support the `targetOrigin` (*) argument.
                postMessage(emscriptenMainLoopMessageId);
              } else {
                postMessage(emscriptenMainLoopMessageId, '*');
              }
            });
          }
        }
        MainLoop.scheduler = function MainLoop_scheduler_setImmediate() {
          MainLoop.setImmediate(MainLoop.runner);
        };
      }
      return 0;
    };
  
  
  
    /**
   * @param {number=} arg
   * @param {boolean=} noSetTiming
   */
  var setMainLoop = (iterFunc, fps, simulateInfiniteLoop, arg, noSetTiming) => {
      MainLoop.func = iterFunc;
      MainLoop.arg = arg;
  
      var thisMainLoopId = MainLoop.currentlyRunningMainloop;
      function checkIsRunning() {
        if (thisMainLoopId < MainLoop.currentlyRunningMainloop) {
          maybeExit();
          return false;
        }
        return true;
      }
  
      // We create the loop runner here but it is not actually running until
      // _emscripten_set_main_loop_timing is called (which might happen at a
      // later time).
      MainLoop.runner = function MainLoop_runner() {
        if (ABORT) return;
        if (MainLoop.queue.length > 0) {
          var start = Date.now();
          var blocker = MainLoop.queue.shift();
          blocker.func(blocker.arg);
          if (MainLoop.remainingBlockers) {
            var remaining = MainLoop.remainingBlockers;
            var next = remaining%1 == 0 ? remaining-1 : Math.floor(remaining);
            if (blocker.counted) {
              MainLoop.remainingBlockers = next;
            } else {
              // not counted, but move the progress along a tiny bit
              next = next + 0.5; // do not steal all the next one's progress
              MainLoop.remainingBlockers = (8*remaining + next)/9;
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
      }
  
      if (!noSetTiming) {
        if (fps > 0) {
          _emscripten_set_main_loop_timing(0, 1000.0 / fps);
        } else {
          // Do rAF by rendering each frame (no decimating)
          _emscripten_set_main_loop_timing(1, 1);
        }
  
        MainLoop.scheduler();
      }
  
      if (simulateInfiniteLoop) {
        throw 'unwind';
      }
    };
  
  
  
  var runtimeKeepalivePop = () => {
      runtimeKeepaliveCounter -= 1;
    };
  var MainLoop = {
  func:null,
  scheduler:null,
  currentlyRunningMainloop:0,
  arg:0,
  timingMode:0,
  timingValue:0,
  currentFrameNumber:0,
  queue:[],
  preMainLoop:[],
  postMainLoop:[],
  pause() {
        if (MainLoop.scheduler) {
          MainLoop.scheduler = null;
          // Incrementing this signals the previous main loop that it's now become old, and it must return.
          MainLoop.currentlyRunningMainloop++;
          runtimeKeepalivePop();
        }
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
        if (Module['setStatus']) {
          var message = Module['statusMessage'] || 'Please wait...';
          var remaining = MainLoop.remainingBlockers ?? 0;
          var expected = MainLoop.expectedBlockers ?? 0;
          if (remaining) {
            if (remaining < expected) {
              Module['setStatus'](`{message} ({expected - remaining}/{expected})`);
            } else {
              Module['setStatus'](message);
            }
          } else {
            Module['setStatus']('');
          }
        }
      },
  init() {
      },
  runIter(func) {
        if (ABORT) return;
        for (var pre of MainLoop.preMainLoop) {
          if (pre() === false) {
            return; // |return false| skips a frame
          }
        }
        callUserCallback(func);
        for (var post of MainLoop.postMainLoop) {
          post();
        }
      },
  nextRAF:0,
  fakeRequestAnimationFrame(func) {
        // try to keep 60fps between calls to here
        var now = Date.now();
        if (!MainLoop.nextRAF) {
          MainLoop.nextRAF = now + 1000/60;
        } else {
          while (now + 2 >= MainLoop.nextRAF) { // fudge a little, to avoid timer jitter causing us to do lots of delay:0
            MainLoop.nextRAF += 1000/60;
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
      },
  };
  
  var _emscripten_get_main_loop_timing = (mode, value) => {
      if (mode) HEAP32[((mode)>>2)] = MainLoop.timingMode;
      if (value) HEAP32[((value)>>2)] = MainLoop.timingValue;
    };


  
  
  function _emscripten_get_num_gamepads() {
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(11, 0, 1);
  
      // N.B. Do not call emscripten_get_num_gamepads() unless having first called emscripten_sample_gamepad_data(), and that has returned EMSCRIPTEN_RESULT_SUCCESS.
      // Otherwise the following line will throw an exception.
      return JSEvents.lastGamepadState.length;
    
  }
  

  
  var preloadPlugins = [];
  
  
  
  /** @param {number=} timeout */
  var safeSetTimeout = (func, timeout) => {
      runtimeKeepalivePush();
      var id = safeSetTimeout.nextId++;
      safeSetTimeout.pending.set(id, setTimeout(() => {
        safeSetTimeout.pending.delete(id);
        runtimeKeepalivePop();
        callUserCallback(func);
      }, timeout));
      return id;
    };
  
  
  
  var Browser = {
  useWebGL:false,
  isFullscreen:false,
  pointerLock:false,
  moduleContextCreatedCallbacks:[],
  preloadedImages:{
  },
  preloadedAudios:{
  },
  getCanvas:() => Module['canvas'],
  init() {
        if (Browser.initted) return;
        Browser.initted = true;
  
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
  
        var imagePlugin = {};
        imagePlugin['canHandle'] = (name) => {
          return !Module['noImageDecoding'] && /\.(jpg|jpeg|png|bmp|webp)$/i.test(name);
        };
        imagePlugin['handle'] = async (byteArray, name) => {
          var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
          if (b.size !== byteArray.length) { // Safari bug #118630
            // Safari's Blob can only take an ArrayBuffer
            b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
          }
          var url = URL.createObjectURL(b);
          return new Promise((resolve, reject) => {
            var img = new Image();
            img.onload = () => {
              var canvas = /** @type {!HTMLCanvasElement} */ (document.createElement('canvas'));
              canvas.width = img.width;
              canvas.height = img.height;
              var ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);
              Browser.preloadedImages[name] = canvas;
              URL.revokeObjectURL(url);
              resolve(byteArray);
            };
            img.onerror = (event) => {
              err(`Image ${url} could not be decoded`);
              reject();
            };
            img.src = url;
          });
        };
        preloadPlugins.push(imagePlugin);
  
        var audioPlugin = {};
        audioPlugin['canHandle'] = (name) => {
          return !Module['noAudioDecoding'] && name.slice(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = async (byteArray, name) => {
          return new Promise((resolve, reject) => {
            var done = false;
            function finish(audio) {
              if (done) return;
              done = true;
              Browser.preloadedAudios[name] = audio;
              resolve(byteArray);
            }
            var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
            var url = URL.createObjectURL(b); // XXX we never revoke this!
            var audio = new Audio();
            audio.addEventListener('canplaythrough', () => finish(audio)); // use addEventListener due to chromium bug 124926
            audio.onerror = (event) => {
              if (done) return;
              err(`warning: browser could not fully decode audio ${name}, trying slower base64 approach`);
              function encode64(data) {
                var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                const PAD = '=';
                var ret = '';
                var leftchar = 0;
                var leftbits = 0;
                for (var byte of data) {
                  leftchar = (leftchar << 8) | byte;
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits-6)) & 0x3f;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar&3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar&0xf) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = 'data:audio/x-' + name.slice(-3) + ';base64,' + encode64(byteArray);
              finish(audio); // we don't wait for confirmation this worked - but it's worth trying
            };
            audio.src = url;
            // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
            safeSetTimeout(() => {
              finish(audio); // try to use it even though it is not necessarily ready to play
            }, 10_000);
          });
        };
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
  
          document.addEventListener('pointerlockchange', pointerLockChange);
  
          if (Module['elementPointerLock']) {
            canvas.addEventListener('click', (ev) => {
              if (!Browser.pointerLock && Browser.getCanvas().requestPointerLock) {
                Browser.getCanvas().requestPointerLock();
                ev.preventDefault();
              }
            });
          }
        }
      },
  createContext(/** @type {HTMLCanvasElement} */ canvas, useWebGL, setInModule, webGLContextAttributes) {
        if (useWebGL && Module['ctx'] && canvas == Browser.getCanvas()) return Module['ctx']; // no need to recreate GL context if it's already been created for this canvas.
  
        var ctx;
        var contextHandle;
        if (useWebGL) {
          // For GLES2/desktop GL compatibility, adjust a few defaults to be different to WebGL defaults, so that they align better with the desktop defaults.
          var contextAttributes = {
            antialias: false,
            alpha: false,
            majorVersion: 1,
          };
  
          if (webGLContextAttributes) {
            for (var attribute in webGLContextAttributes) {
              contextAttributes[attribute] = webGLContextAttributes[attribute];
            }
          }
  
          // This check of existence of GL is here to satisfy Closure compiler, which yells if variable GL is referenced below but GL object is not
          // actually compiled in because application is not doing any GL operations. TODO: Ideally if GL is not being used, this function
          // Browser.createContext() should not even be emitted.
          if (typeof GL !== 'undefined') {
            contextHandle = GL.createContext(canvas, contextAttributes);
            if (contextHandle) {
              ctx = GL.getContext(contextHandle).GLctx;
            }
          }
        } else {
          ctx = canvas.getContext('2d');
        }
  
        if (!ctx) return null;
  
        if (setInModule) {
          Module['ctx'] = ctx;
          if (useWebGL) GL.makeContextCurrent(contextHandle);
          Browser.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach((callback) => callback());
          Browser.init();
        }
        return ctx;
      },
  fullscreenHandlersInstalled:false,
  lockPointer:undefined,
  resizeCanvas:undefined,
  requestFullscreen(lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer === 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === 'undefined') Browser.resizeCanvas = false;
  
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
        }
  
        if (!Browser.fullscreenHandlersInstalled) {
          Browser.fullscreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullscreenChange);
          document.addEventListener('webkitfullscreenchange', fullscreenChange);
        }
  
        // create a new parent to ensure the canvas has no siblings. this allows browsers to optimize full screen performance when its parent is the full screen root
        var canvasContainer = document.createElement('div');
        canvas.parentNode.insertBefore(canvasContainer, canvas);
        canvasContainer.appendChild(canvas);
  
        // use parent of canvas as full screen root to allow aspect ratio correction (Firefox stretches the root to screen size)
        // Safari didn't support Element.requestFullscreen until 16.4
        // See: https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen
        /** @suppress {checkTypes} */
        canvasContainer.requestFullscreen ??= (canvasContainer['webkitRequestFullscreen'] ? () => canvasContainer['webkitRequestFullscreen'](Element.ALLOW_KEYBOARD_INPUT) : null) ??
                                              (canvasContainer['webkitRequestFullScreen'] ? () => canvasContainer['webkitRequestFullScreen'](Element.ALLOW_KEYBOARD_INPUT) : null);
  
        canvasContainer.requestFullscreen();
      },
  exitFullscreen() {
        // This is workaround for chrome. Trying to exit from fullscreen
        // not in fullscreen state will cause 'TypeError: Document not active'
        // in chrome. See https://github.com/emscripten-core/emscripten/pull/8236
        if (!Browser.isFullscreen) {
          return false;
        }
  
        var CFS = document.exitFullscreen ?? document['webkitCancelFullScreen'];
        CFS.apply(document, []);
        return true;
      },
  getMimetype(name) {
        return {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'bmp': 'image/bmp',
          'ogg': 'audio/ogg',
          'wav': 'audio/wav',
          'mp3': 'audio/mpeg'
        }[name.slice(name.lastIndexOf('.')+1)];
      },
  getMouseWheelDelta(event) {
        var delta = 0;
        switch (event.type) {
          case 'DOMMouseScroll':
            // 3 lines make up a step
            delta = event.detail / 3;
            break;
          case 'mousewheel':
            // 120 units make up a step
            delta = event.wheelDelta / 120;
            break;
          case 'wheel':
            delta = event.deltaY
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
                abort('unrecognized mouse wheel delta mode: ' + event.deltaMode);
            }
            break;
          default:
            abort('unrecognized mouse wheel event: ' + event.type);
        }
        return delta;
      },
  mouseX:0,
  mouseY:0,
  mouseMovementX:0,
  mouseMovementY:0,
  touches:{
  },
  lastTouches:{
  },
  calculateMouseCoords(pageX, pageY) {
        // Calculate the movement based on the changes
        // in the coordinates.
        var canvas = Browser.getCanvas();
        var rect = canvas.getBoundingClientRect();
  
        var adjustedX = pageX - (window.scrollX + rect.left);
        var adjustedY = pageY - (window.scrollY + rect.top);
  
        // the canvas might be CSS-scaled compared to its backbuffer;
        // SDL-using content will want mouse coordinates in terms
        // of backbuffer units.
        adjustedX = adjustedX * (canvas.width / rect.width);
        adjustedY = adjustedY * (canvas.height / rect.height);
  
        return { x: adjustedX, y: adjustedY };
      },
  setMouseCoords(pageX, pageY) {
        const {x, y} = Browser.calculateMouseCoords(pageX, pageY);
        Browser.mouseMovementX = x - Browser.mouseX;
        Browser.mouseMovementY = y - Browser.mouseY;
        Browser.mouseX = x;
        Browser.mouseY = y;
      },
  calculateMouseEvent(event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          Browser.mouseMovementX = event.movementX;
          Browser.mouseMovementY = event.movementY;
  
          // add the mouse delta to the current absolute mouse position
          Browser.mouseX += Browser.mouseMovementX;
          Browser.mouseY += Browser.mouseMovementY;
        } else {
          if (event.type === 'touchstart' || event.type === 'touchend' || event.type === 'touchmove') {
            var touch = event.touch;
            if (touch === undefined) {
              return; // the 'touch' property is only defined in SDL
  
            }
            var coords = Browser.calculateMouseCoords(touch.pageX, touch.pageY);
  
            if (event.type === 'touchstart') {
              Browser.lastTouches[touch.identifier] = coords;
              Browser.touches[touch.identifier] = coords;
            } else if (event.type === 'touchend' || event.type === 'touchmove') {
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
  resizeListeners:[],
  updateResizeListeners() {
        var canvas = Browser.getCanvas();
        Browser.resizeListeners.forEach((listener) => listener(canvas.width, canvas.height));
      },
  setCanvasSize(width, height, noUpdates) {
        var canvas = Browser.getCanvas();
        Browser.updateCanvasDimensions(canvas, width, height);
        if (!noUpdates) Browser.updateResizeListeners();
      },
  setFullscreenCanvasSize() {
        // check if SDL is available
        if (typeof SDL !== 'undefined') {
          var flags = HEAPU32[((SDL.screen)>>2)];
          flags = flags | 8388608;
          HEAP32[((SDL.screen)>>2)] = flags;
        }
        Browser.updateCanvasDimensions(Browser.getCanvas());
        Browser.updateResizeListeners();
      },
  setWindowedCanvasSize() {
        // check if SDL is available
        if (typeof SDL !== 'undefined') {
          var flags = HEAPU32[((SDL.screen)>>2)];
          flags = flags & ~8388608;
          HEAP32[((SDL.screen)>>2)] = flags;
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
        if ((getFullscreenElement() === canvas.parentNode) && (typeof screen !== 'undefined')) {
           var factor = Math.min(screen.width / w, screen.height / h);
           w = Math.round(w * factor);
           h = Math.round(h * factor);
        }
        if (Browser.resizeCanvas) {
          if (canvas.width  != w) canvas.width  = w;
          if (canvas.height != h) canvas.height = h;
          if (typeof canvas.style !== 'undefined') {
            canvas.style.removeProperty( 'width');
            canvas.style.removeProperty('height');
          }
        } else {
          if (canvas.width  != wNative) canvas.width  = wNative;
          if (canvas.height != hNative) canvas.height = hNative;
          if (typeof canvas.style !== 'undefined') {
            if (w != wNative || h != hNative) {
              canvas.style.setProperty( 'width', w + 'px', 'important');
              canvas.style.setProperty('height', h + 'px', 'important');
            } else {
              canvas.style.removeProperty( 'width');
              canvas.style.removeProperty('height');
            }
          }
        }
      },
  };
  
  
  
  function _emscripten_get_screen_size(width, height) {
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(12, 0, 1, width, height);
  
      HEAP32[((width)>>2)] = screen.width;
      HEAP32[((height)>>2)] = screen.height;
    
  }
  

  var GLctx;
  
  
  
  var webgl_enable_ANGLE_instanced_arrays = (ctx) => {
      // Extension available in WebGL 1 from Firefox 26 and Google Chrome 30 onwards. Core feature in WebGL 2.
      var ext = ctx.getExtension('ANGLE_instanced_arrays');
      // Because this extension is a core function in WebGL 2, assign the extension entry points in place of
      // where the core functions will reside in WebGL 2. This way the calling code can call these without
      // having to dynamically branch depending if running against WebGL 1 or WebGL 2.
      if (ext) {
        ctx['vertexAttribDivisor'] = (index, divisor) => ext['vertexAttribDivisorANGLE'](index, divisor);
        ctx['drawArraysInstanced'] = (mode, first, count, primcount) => ext['drawArraysInstancedANGLE'](mode, first, count, primcount);
        ctx['drawElementsInstanced'] = (mode, count, type, indices, primcount) => ext['drawElementsInstancedANGLE'](mode, count, type, indices, primcount);
        return 1;
      }
    };
  
  var webgl_enable_OES_vertex_array_object = (ctx) => {
      // Extension available in WebGL 1 from Firefox 25 and WebKit 536.28/desktop Safari 6.0.3 onwards. Core feature in WebGL 2.
      var ext = ctx.getExtension('OES_vertex_array_object');
      if (ext) {
        ctx['createVertexArray'] = () => ext['createVertexArrayOES']();
        ctx['deleteVertexArray'] = (vao) => ext['deleteVertexArrayOES'](vao);
        ctx['bindVertexArray'] = (vao) => ext['bindVertexArrayOES'](vao);
        ctx['isVertexArray'] = (vao) => ext['isVertexArrayOES'](vao);
        return 1;
      }
    };
  
  var webgl_enable_WEBGL_draw_buffers = (ctx) => {
      // Extension available in WebGL 1 from Firefox 28 onwards. Core feature in WebGL 2.
      var ext = ctx.getExtension('WEBGL_draw_buffers');
      if (ext) {
        ctx['drawBuffers'] = (n, bufs) => ext['drawBuffersWEBGL'](n, bufs);
        return 1;
      }
    };
  
  var webgl_enable_EXT_polygon_offset_clamp = (ctx) =>
      !!(ctx.extPolygonOffsetClamp = ctx.getExtension('EXT_polygon_offset_clamp'));
  
  var webgl_enable_EXT_clip_control = (ctx) =>
      !!(ctx.extClipControl = ctx.getExtension('EXT_clip_control'));
  
  var webgl_enable_WEBGL_polygon_mode = (ctx) =>
      !!(ctx.webglPolygonMode = ctx.getExtension('WEBGL_polygon_mode'));
  
  var webgl_enable_WEBGL_multi_draw = (ctx) =>
      // Closure is expected to be allowed to minify the '.multiDrawWebgl' property, so not accessing it quoted.
      !!(ctx.multiDrawWebgl = ctx.getExtension('WEBGL_multi_draw'));
  
  var getEmscriptenSupportedExtensions = (ctx) => {
      // Restrict the list of advertised extensions to those that we actually
      // support.
      var supportedExtensions = [
        // WebGL 1 extensions
        'ANGLE_instanced_arrays',
        'EXT_blend_minmax',
        'EXT_disjoint_timer_query',
        'EXT_frag_depth',
        'EXT_shader_texture_lod',
        'EXT_sRGB',
        'OES_element_index_uint',
        'OES_fbo_render_mipmap',
        'OES_standard_derivatives',
        'OES_texture_float',
        'OES_texture_half_float',
        'OES_texture_half_float_linear',
        'OES_vertex_array_object',
        'WEBGL_color_buffer_float',
        'WEBGL_depth_texture',
        'WEBGL_draw_buffers',
        // WebGL 1 and WebGL 2 extensions
        'EXT_clip_control',
        'EXT_color_buffer_half_float',
        'EXT_depth_clamp',
        'EXT_float_blend',
        'EXT_polygon_offset_clamp',
        'EXT_texture_compression_bptc',
        'EXT_texture_compression_rgtc',
        'EXT_texture_filter_anisotropic',
        'KHR_parallel_shader_compile',
        'OES_texture_float_linear',
        'WEBGL_blend_func_extended',
        'WEBGL_compressed_texture_astc',
        'WEBGL_compressed_texture_etc',
        'WEBGL_compressed_texture_etc1',
        'WEBGL_compressed_texture_s3tc',
        'WEBGL_compressed_texture_s3tc_srgb',
        'WEBGL_debug_renderer_info',
        'WEBGL_debug_shaders',
        'WEBGL_lose_context',
        'WEBGL_multi_draw',
        'WEBGL_polygon_mode'
      ];
      // .getSupportedExtensions() can return null if context is lost, so coerce to empty array.
      return ctx.getSupportedExtensions()?.filter(ext => supportedExtensions.includes(ext)) ?? [];
    };
  
  
  
  
  var GL = {
  counter:1,
  buffers:[],
  programs:[],
  framebuffers:[],
  renderbuffers:[],
  textures:[],
  shaders:[],
  vaos:[],
  contexts:{
  },
  offscreenCanvases:{
  },
  queries:[],
  stringCache:{
  },
  unpackAlignment:4,
  unpackRowLength:0,
  recordError:(errorCode) => {
        if (!GL.lastError) {
          GL.lastError = errorCode;
        }
      },
  getNewId:(table) => {
        var ret = GL.counter++;
        for (var i = table.length; i < ret; i++) {
          table[i] = null;
        }
        return ret;
      },
  genObject:(n, buffers, createFunction, objectTable
        ) => {
        for (var i = 0; i < n; i++) {
          var buffer = GLctx[createFunction]();
          var id = buffer && GL.getNewId(objectTable);
          if (buffer) {
            buffer.name = id;
            objectTable[id] = buffer;
          } else {
            GL.recordError(0x502 /* GL_INVALID_OPERATION */);
          }
          HEAP32[(((buffers)+(i*4))>>2)] = id;
        }
      },
  getSource:(shader, count, string, length) => {
        var source = '';
        for (var i = 0; i < count; ++i) {
          var len = length ? HEAPU32[(((length)+(i*4))>>2)] : undefined;
          source += UTF8ToString(HEAPU32[(((string)+(i*4))>>2)], len);
        }
        return source;
      },
  createContext:(/** @type {HTMLCanvasElement} */ canvas, webGLContextAttributes) => {
  
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
          /** @type {function(this:HTMLCanvasElement, string, (Object|null)=): (RenderingContext|null)} */
          function fixedGetContext(ver, attrs) {
            var gl = canvas.getContextSafariWebGL2Fixed(ver, attrs);
            return ((ver == 'webgl') == (gl instanceof WebGLRenderingContext)) ? gl : null;
          }
          canvas.getContext = fixedGetContext;
        }
  
        var ctx =
          canvas.getContext('webgl', webGLContextAttributes);
  
        if (!ctx) return 0;
  
        var handle = GL.registerContext(ctx, webGLContextAttributes);
  
        return handle;
      },
  registerContext:(ctx, webGLContextAttributes) => {
        // with pthreads a context is a location in memory with some synchronized
        // data between threads
        var handle = _malloc(8);
        HEAPU32[(((handle)+(4))>>2)] = _pthread_self(); // the thread pointer of the thread that owns the control of the context
  
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
        if (typeof webGLContextAttributes.enableExtensionsByDefault === 'undefined' || webGLContextAttributes.enableExtensionsByDefault) {
          GL.initExtensions(context);
        }
  
        return handle;
      },
  makeContextCurrent:(contextHandle) => {
  
        // Active Emscripten GL layer context object.
        GL.currentContext = GL.contexts[contextHandle];
        // Active WebGL context object.
        Module['ctx'] = GLctx = GL.currentContext?.GLctx;
        return !(contextHandle && !GLctx);
      },
  getContext:(contextHandle) => {
        return GL.contexts[contextHandle];
      },
  deleteContext:(contextHandle) => {
        if (GL.currentContext === GL.contexts[contextHandle]) {
          GL.currentContext = null;
        }
        if (typeof JSEvents === 'object') {
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
  initExtensions:(context) => {
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
        {
          GLctx.disjointTimerQueryExt = GLctx.getExtension('EXT_disjoint_timer_query');
        }
  
        for (var ext of getEmscriptenSupportedExtensions(GLctx)) {
          // WEBGL_lose_context, WEBGL_debug_renderer_info and WEBGL_debug_shaders
          // are not enabled by default.
          if (!ext.includes('lose_context') && !ext.includes('debug')) {
            // Call .getExtension() to enable that extension permanently.
            GLctx.getExtension(ext);
          }
        }
      },
  };
  var _emscripten_glActiveTexture = (x0) => GLctx.activeTexture(x0);

  var _emscripten_glAttachShader = (program, shader) => {
      GLctx.attachShader(GL.programs[program], GL.shaders[shader]);
    };

  var _emscripten_glBeginQueryEXT = (target, id) => {
      GLctx.disjointTimerQueryExt['beginQueryEXT'](target, GL.queries[id]);
    };

  
  var _emscripten_glBindAttribLocation = (program, index, name) => {
      GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name));
    };

  var _emscripten_glBindBuffer = (target, buffer) => {
  
      GLctx.bindBuffer(target, GL.buffers[buffer]);
    };

  var _emscripten_glBindFramebuffer = (target, framebuffer) => {
  
      GLctx.bindFramebuffer(target, GL.framebuffers[framebuffer]);
  
    };

  var _emscripten_glBindRenderbuffer = (target, renderbuffer) => {
      GLctx.bindRenderbuffer(target, GL.renderbuffers[renderbuffer]);
    };

  var _emscripten_glBindTexture = (target, texture) => {
      GLctx.bindTexture(target, GL.textures[texture]);
    };

  
  var _emscripten_glBindVertexArray = (vao) => {
      GLctx.bindVertexArray(GL.vaos[vao]);
    };
  var _emscripten_glBindVertexArrayOES = _emscripten_glBindVertexArray;

  var _emscripten_glBlendColor = (x0, x1, x2, x3) => GLctx.blendColor(x0, x1, x2, x3);

  var _emscripten_glBlendEquation = (x0) => GLctx.blendEquation(x0);

  var _emscripten_glBlendEquationSeparate = (x0, x1) => GLctx.blendEquationSeparate(x0, x1);

  var _emscripten_glBlendFunc = (x0, x1) => GLctx.blendFunc(x0, x1);

  var _emscripten_glBlendFuncSeparate = (x0, x1, x2, x3) => GLctx.blendFuncSeparate(x0, x1, x2, x3);

  
  var _emscripten_glBufferData = (target, size, data, usage) => {
  
      // N.b. here first form specifies a heap subarray, second form an integer
      // size, so the ?: code here is polymorphic. It is advised to avoid
      // randomly mixing both uses in calling code, to avoid any potential JS
      // engine JIT issues.
      GLctx.bufferData(target, data ? HEAPU8.subarray(data, data+size) : size, usage);
    };

  
  var webglBufferSubData = (target, offset, size, data, src = HEAPU8) => {
      GLctx.bufferSubData(target, offset, src.subarray(data, data + size));
    };
  
  var _emscripten_glBufferSubData = (target, offset, size, data) => webglBufferSubData(target, offset, size, data);

  var _emscripten_glCheckFramebufferStatus = (x0) => GLctx.checkFramebufferStatus(x0);

  var _emscripten_glClear = (x0) => GLctx.clear(x0);

  var _emscripten_glClearColor = (x0, x1, x2, x3) => GLctx.clearColor(x0, x1, x2, x3);

  var _emscripten_glClearDepthf = (x0) => GLctx.clearDepth(x0);

  var _emscripten_glClearStencil = (x0) => GLctx.clearStencil(x0);

  var _emscripten_glClipControlEXT = (origin, depth) => {
      GLctx.extClipControl['clipControlEXT'](origin, depth);
    };

  var _emscripten_glColorMask = (red, green, blue, alpha) => {
      GLctx.colorMask(!!red, !!green, !!blue, !!alpha);
    };

  var _emscripten_glCompileShader = (shader) => {
      GLctx.compileShader(GL.shaders[shader]);
    };

  
  var _emscripten_glCompressedTexImage2D = (target, level, internalFormat, width, height, border, imageSize, data) => {
      // `data` may be null here, which means "allocate uninitialized space but
      // don't upload" in GLES parlance, but `compressedTexImage2D` requires the
      // final data parameter, so we simply pass a heap view starting at zero
      // effectively uploading whatever happens to be near address zero.  See
      // https://github.com/emscripten-core/emscripten/issues/19300.
      GLctx.compressedTexImage2D(target, level, internalFormat, width, height, border, HEAPU8.subarray(data, data + imageSize));
    };

  
  var _emscripten_glCompressedTexSubImage2D = (target, level, xoffset, yoffset, width, height, format, imageSize, data) => {
      GLctx.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, HEAPU8.subarray(data, data + imageSize));
    };

  var _emscripten_glCopyTexImage2D = (x0, x1, x2, x3, x4, x5, x6, x7) => GLctx.copyTexImage2D(x0, x1, x2, x3, x4, x5, x6, x7);

  var _emscripten_glCopyTexSubImage2D = (x0, x1, x2, x3, x4, x5, x6, x7) => GLctx.copyTexSubImage2D(x0, x1, x2, x3, x4, x5, x6, x7);

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

  var _emscripten_glCreateShader = (shaderType) => {
      var id = GL.getNewId(GL.shaders);
      GL.shaders[id] = GLctx.createShader(shaderType);
  
      return id;
    };

  var _emscripten_glCullFace = (x0) => GLctx.cullFace(x0);

  
  var _emscripten_glDeleteBuffers = (n, buffers) => {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((buffers)+(i*4))>>2)];
        var buffer = GL.buffers[id];
  
        // From spec: "glDeleteBuffers silently ignores 0's and names that do not
        // correspond to existing buffer objects."
        if (!buffer) continue;
  
        GLctx.deleteBuffer(buffer);
        buffer.name = 0;
        GL.buffers[id] = null;
  
      }
    };

  
  var _emscripten_glDeleteFramebuffers = (n, framebuffers) => {
      for (var i = 0; i < n; ++i) {
        var id = HEAP32[(((framebuffers)+(i*4))>>2)];
        var framebuffer = GL.framebuffers[id];
        if (!framebuffer) continue; // GL spec: "glDeleteFramebuffers silently ignores 0s and names that do not correspond to existing framebuffer objects".
        GLctx.deleteFramebuffer(framebuffer);
        framebuffer.name = 0;
        GL.framebuffers[id] = null;
      }
    };

  var _emscripten_glDeleteProgram = (id) => {
      if (!id) return;
      var program = GL.programs[id];
      if (!program) {
        // glDeleteProgram actually signals an error when deleting a nonexisting
        // object, unlike some other GL delete functions.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      GLctx.deleteProgram(program);
      program.name = 0;
      GL.programs[id] = null;
    };

  
  var _emscripten_glDeleteQueriesEXT = (n, ids) => {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((ids)+(i*4))>>2)];
        var query = GL.queries[id];
        if (!query) continue; // GL spec: "unused names in ids are ignored, as is the name zero."
        GLctx.disjointTimerQueryExt['deleteQueryEXT'](query);
        GL.queries[id] = null;
      }
    };

  
  var _emscripten_glDeleteRenderbuffers = (n, renderbuffers) => {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((renderbuffers)+(i*4))>>2)];
        var renderbuffer = GL.renderbuffers[id];
        if (!renderbuffer) continue; // GL spec: "glDeleteRenderbuffers silently ignores 0s and names that do not correspond to existing renderbuffer objects".
        GLctx.deleteRenderbuffer(renderbuffer);
        renderbuffer.name = 0;
        GL.renderbuffers[id] = null;
      }
    };

  var _emscripten_glDeleteShader = (id) => {
      if (!id) return;
      var shader = GL.shaders[id];
      if (!shader) {
        // glDeleteShader actually signals an error when deleting a nonexisting
        // object, unlike some other GL delete functions.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      GLctx.deleteShader(shader);
      GL.shaders[id] = null;
    };

  
  var _emscripten_glDeleteTextures = (n, textures) => {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((textures)+(i*4))>>2)];
        var texture = GL.textures[id];
        // GL spec: "glDeleteTextures silently ignores 0s and names that do not
        // correspond to existing textures".
        if (!texture) continue;
        GLctx.deleteTexture(texture);
        texture.name = 0;
        GL.textures[id] = null;
      }
    };

  
  
  var _emscripten_glDeleteVertexArrays = (n, vaos) => {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((vaos)+(i*4))>>2)];
        GLctx.deleteVertexArray(GL.vaos[id]);
        GL.vaos[id] = null;
      }
    };
  var _emscripten_glDeleteVertexArraysOES = _emscripten_glDeleteVertexArrays;

  var _emscripten_glDepthFunc = (x0) => GLctx.depthFunc(x0);

  var _emscripten_glDepthMask = (flag) => {
      GLctx.depthMask(!!flag);
    };

  var _emscripten_glDepthRangef = (x0, x1) => GLctx.depthRange(x0, x1);

  var _emscripten_glDetachShader = (program, shader) => {
      GLctx.detachShader(GL.programs[program], GL.shaders[shader]);
    };

  var _emscripten_glDisable = (x0) => GLctx.disable(x0);

  var _emscripten_glDisableVertexAttribArray = (index) => {
      GLctx.disableVertexAttribArray(index);
    };

  var _emscripten_glDrawArrays = (mode, first, count) => {
  
      GLctx.drawArrays(mode, first, count);
  
    };

  
  var _emscripten_glDrawArraysInstanced = (mode, first, count, primcount) => {
      GLctx.drawArraysInstanced(mode, first, count, primcount);
    };
  var _emscripten_glDrawArraysInstancedANGLE = _emscripten_glDrawArraysInstanced;

  
  var tempFixedLengthArray = [];
  
  
  var _emscripten_glDrawBuffers = (n, bufs) => {
  
      var bufArray = tempFixedLengthArray[n];
      for (var i = 0; i < n; i++) {
        bufArray[i] = HEAP32[(((bufs)+(i*4))>>2)];
      }
  
      GLctx.drawBuffers(bufArray);
    };
  var _emscripten_glDrawBuffersWEBGL = _emscripten_glDrawBuffers;

  
  var _emscripten_glDrawElements = (mode, count, type, indices) => {
  
      GLctx.drawElements(mode, count, type, indices);
  
    };

  
  var _emscripten_glDrawElementsInstanced = (mode, count, type, indices, primcount) => {
      GLctx.drawElementsInstanced(mode, count, type, indices, primcount);
    };
  var _emscripten_glDrawElementsInstancedANGLE = _emscripten_glDrawElementsInstanced;

  var _emscripten_glEnable = (x0) => GLctx.enable(x0);

  var _emscripten_glEnableVertexAttribArray = (index) => {
      GLctx.enableVertexAttribArray(index);
    };

  var _emscripten_glEndQueryEXT = (target) => {
      GLctx.disjointTimerQueryExt['endQueryEXT'](target);
    };

  var _emscripten_glFinish = () => GLctx.finish();

  var _emscripten_glFlush = () => GLctx.flush();

  var _emscripten_glFramebufferRenderbuffer = (target, attachment, renderbuffertarget, renderbuffer) => {
      GLctx.framebufferRenderbuffer(target, attachment, renderbuffertarget,
                                         GL.renderbuffers[renderbuffer]);
    };

  var _emscripten_glFramebufferTexture2D = (target, attachment, textarget, texture, level) => {
      GLctx.framebufferTexture2D(target, attachment, textarget,
                                      GL.textures[texture], level);
    };

  var _emscripten_glFrontFace = (x0) => GLctx.frontFace(x0);

  var _emscripten_glGenBuffers = (n, buffers) => {
      GL.genObject(n, buffers, 'createBuffer', GL.buffers
        );
    };

  var _emscripten_glGenFramebuffers = (n, ids) => {
      GL.genObject(n, ids, 'createFramebuffer', GL.framebuffers
        );
    };

  
  var _emscripten_glGenQueriesEXT = (n, ids) => {
      for (var i = 0; i < n; i++) {
        var query = GLctx.disjointTimerQueryExt['createQueryEXT']();
        if (!query) {
          GL.recordError(0x502 /* GL_INVALID_OPERATION */);
          while (i < n) HEAP32[(((ids)+(i++*4))>>2)] = 0;
          return;
        }
        var id = GL.getNewId(GL.queries);
        query.name = id;
        GL.queries[id] = query;
        HEAP32[(((ids)+(i*4))>>2)] = id;
      }
    };

  var _emscripten_glGenRenderbuffers = (n, renderbuffers) => {
      GL.genObject(n, renderbuffers, 'createRenderbuffer', GL.renderbuffers
        );
    };

  var _emscripten_glGenTextures = (n, textures) => {
      GL.genObject(n, textures, 'createTexture', GL.textures
        );
    };

  
  var _emscripten_glGenVertexArrays = (n, arrays) => {
      GL.genObject(n, arrays, 'createVertexArray', GL.vaos
        );
    };
  var _emscripten_glGenVertexArraysOES = _emscripten_glGenVertexArrays;

  var _emscripten_glGenerateMipmap = (x0) => GLctx.generateMipmap(x0);

  
  
  var __glGetActiveAttribOrUniform = (funcName, program, index, bufSize, length, size, type, name) => {
      program = GL.programs[program];
      var info = GLctx[funcName](program, index);
      if (info) {
        // If an error occurs, nothing will be written to length, size and type and name.
        var numBytesWrittenExclNull = name && stringToUTF8(info.name, name, bufSize);
        if (length) HEAP32[((length)>>2)] = numBytesWrittenExclNull;
        if (size) HEAP32[((size)>>2)] = info.size;
        if (type) HEAP32[((type)>>2)] = info.type;
      }
    };
  
  var _emscripten_glGetActiveAttrib = (program, index, bufSize, length, size, type, name) =>
      __glGetActiveAttribOrUniform('getActiveAttrib', program, index, bufSize, length, size, type, name);

  
  var _emscripten_glGetActiveUniform = (program, index, bufSize, length, size, type, name) =>
      __glGetActiveAttribOrUniform('getActiveUniform', program, index, bufSize, length, size, type, name);

  
  var _emscripten_glGetAttachedShaders = (program, maxCount, count, shaders) => {
      var result = GLctx.getAttachedShaders(GL.programs[program]);
      var len = result.length;
      if (len > maxCount) {
        len = maxCount;
      }
      HEAP32[((count)>>2)] = len;
      for (var i = 0; i < len; ++i) {
        var id = GL.shaders.indexOf(result[i]);
        HEAP32[(((shaders)+(i*4))>>2)] = id;
      }
    };

  
  var _emscripten_glGetAttribLocation = (program, name) =>
      GLctx.getAttribLocation(GL.programs[program], UTF8ToString(name));

  var writeI53ToI64 = (ptr, num) => {
      HEAPU32[((ptr)>>2)] = num;
      var lower = HEAPU32[((ptr)>>2)];
      HEAPU32[(((ptr)+(4))>>2)] = (num - lower)/4294967296;
    };
  
  
  
  
  /** @type {!Float32Array} */
  var HEAPF32;
  var emscriptenWebGLGet = (name_, p, type) => {
      // Guard against user passing a null pointer.
      // Note that GLES2 spec does not say anything about how passing a null
      // pointer should be treated.  Testing on desktop core GL 3, the application
      // crashes on glGetIntegerv to a null pointer, but better to report an error
      // instead of doing anything random.
      if (!p) {
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      var ret = undefined;
      switch (name_) { // Handle a few trivial GLES values
        case 0x8DFA: // GL_SHADER_COMPILER
          ret = 1;
          break;
        case 0x8DF8: // GL_SHADER_BINARY_FORMATS
          if (type != 0 && type != 1) {
            GL.recordError(0x500); // GL_INVALID_ENUM
          }
          // Do not write anything to the out pointer, since no binary formats are
          // supported.
          return;
        case 0x8DF9: // GL_NUM_SHADER_BINARY_FORMATS
          ret = 0;
          break;
        case 0x86A2: // GL_NUM_COMPRESSED_TEXTURE_FORMATS
          // WebGL doesn't have GL_NUM_COMPRESSED_TEXTURE_FORMATS (it's obsolete
          // since GL_COMPRESSED_TEXTURE_FORMATS returns a JS array that can be
          // queried for length), so implement it ourselves to allow C++ GLES2
          // code to get the length.
          var formats = GLctx.getParameter(0x86A3 /*GL_COMPRESSED_TEXTURE_FORMATS*/);
          ret = formats ? formats.length : 0;
          break;
  
      }
  
      if (ret === undefined) {
        var result = GLctx.getParameter(name_);
        switch (typeof result) {
          case 'number':
            ret = result;
            break;
          case 'boolean':
            ret = result ? 1 : 0;
            break;
          case 'string':
            GL.recordError(0x500); // GL_INVALID_ENUM
            return;
          case 'object':
            if (result === null) {
              // null is a valid result for some (e.g., which buffer is bound -
              // perhaps nothing is bound), but otherwise can mean an invalid
              // name_, which we need to report as an error
              switch (name_) {
                case 0x8894: // ARRAY_BUFFER_BINDING
                case 0x8B8D: // CURRENT_PROGRAM
                case 0x8895: // ELEMENT_ARRAY_BUFFER_BINDING
                case 0x8CA6: // FRAMEBUFFER_BINDING or DRAW_FRAMEBUFFER_BINDING
                case 0x8CA7: // RENDERBUFFER_BINDING
                case 0x8069: // TEXTURE_BINDING_2D
                case 0x85B5: // WebGL 2 GL_VERTEX_ARRAY_BINDING, or WebGL 1 extension OES_vertex_array_object GL_VERTEX_ARRAY_BINDING_OES
                case 0x8514: { // TEXTURE_BINDING_CUBE_MAP
                  ret = 0;
                  break;
                }
                default: {
                  GL.recordError(0x500); // GL_INVALID_ENUM
                  return;
                }
              }
            } else if (result instanceof Float32Array ||
                       result instanceof Uint32Array ||
                       result instanceof Int32Array ||
                       result instanceof Array) {
              for (var i = 0; i < result.length; ++i) {
                switch (type) {
                  case 0: HEAP32[(((p)+(i*4))>>2)] = result[i]; break;
                  case 2: HEAPF32[(((p)+(i*4))>>2)] = result[i]; break;
                  case 4: HEAP8[(p)+(i)] = result[i] ? 1 : 0; break;
                }
              }
              return;
            } else {
              try {
                ret = result.name | 0;
              } catch(e) {
                GL.recordError(0x500); // GL_INVALID_ENUM
                err(`GL_INVALID_ENUM in glGet${type}v: Unknown object returned from WebGL getParameter(${name_})! (error: ${e})`);
                return;
              }
            }
            break;
          default:
            GL.recordError(0x500); // GL_INVALID_ENUM
            err(`GL_INVALID_ENUM in glGet${type}v: Native code calling glGet${type}v(${name_}) and it returns ${result} of type ${typeof(result)}!`);
            return;
        }
      }
  
      switch (type) {
        case 1: writeI53ToI64(p, ret); break;
        case 0: HEAP32[((p)>>2)] = ret; break;
        case 2:   HEAPF32[((p)>>2)] = ret; break;
        case 4: HEAP8[p] = ret ? 1 : 0; break;
      }
    };
  
  var _emscripten_glGetBooleanv = (name_, p) => emscriptenWebGLGet(name_, p, 4);

  
  var _emscripten_glGetBufferParameteriv = (target, value, data) => {
      if (!data) {
        // GLES2 specification does not specify how to behave if data is a null
        // pointer. Since calling this function does not make sense if data ==
        // null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      HEAP32[((data)>>2)] = GLctx.getBufferParameter(target, value);
    };

  var _emscripten_glGetError = () => {
      var error = GLctx.getError() || GL.lastError;
      GL.lastError = 0/*GL_NO_ERROR*/;
      return error;
    };

  
  var _emscripten_glGetFloatv = (name_, p) => emscriptenWebGLGet(name_, p, 2);

  
  var _emscripten_glGetFramebufferAttachmentParameteriv = (target, attachment, pname, params) => {
      var result = GLctx.getFramebufferAttachmentParameter(target, attachment, pname);
      if (result instanceof WebGLRenderbuffer ||
          result instanceof WebGLTexture) {
        result = result.name | 0;
      }
      HEAP32[((params)>>2)] = result;
    };

  
  var _emscripten_glGetIntegerv = (name_, p) => emscriptenWebGLGet(name_, p, 0);

  
  var _emscripten_glGetProgramInfoLog = (program, maxLength, length, infoLog) => {
      var log = GLctx.getProgramInfoLog(GL.programs[program]);
      if (log === null) log = '(unknown error)';
      var numBytesWrittenExclNull = (maxLength > 0 && infoLog) ? stringToUTF8(log, infoLog, maxLength) : 0;
      if (length) HEAP32[((length)>>2)] = numBytesWrittenExclNull;
    };

  
  var _emscripten_glGetProgramiv = (program, pname, p) => {
      if (!p) {
        // GLES2 specification does not specify how to behave if p is a null
        // pointer. Since calling this function does not make sense if p == null,
        // issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
  
      if (program >= GL.counter) {
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
  
      program = GL.programs[program];
  
      if (pname == 0x8B84) { // GL_INFO_LOG_LENGTH
        var log = GLctx.getProgramInfoLog(program);
        if (log === null) log = '(unknown error)';
        HEAP32[((p)>>2)] = log.length + 1;
      } else if (pname == 0x8B87 /* GL_ACTIVE_UNIFORM_MAX_LENGTH */) {
        if (!program.maxUniformLength) {
          var numActiveUniforms = GLctx.getProgramParameter(program, 0x8B86/*GL_ACTIVE_UNIFORMS*/);
          for (var i = 0; i < numActiveUniforms; ++i) {
            program.maxUniformLength = Math.max(program.maxUniformLength, GLctx.getActiveUniform(program, i).name.length+1);
          }
        }
        HEAP32[((p)>>2)] = program.maxUniformLength;
      } else if (pname == 0x8B8A /* GL_ACTIVE_ATTRIBUTE_MAX_LENGTH */) {
        if (!program.maxAttributeLength) {
          var numActiveAttributes = GLctx.getProgramParameter(program, 0x8B89/*GL_ACTIVE_ATTRIBUTES*/);
          for (var i = 0; i < numActiveAttributes; ++i) {
            program.maxAttributeLength = Math.max(program.maxAttributeLength, GLctx.getActiveAttrib(program, i).name.length+1);
          }
        }
        HEAP32[((p)>>2)] = program.maxAttributeLength;
      } else if (pname == 0x8A35 /* GL_ACTIVE_UNIFORM_BLOCK_MAX_NAME_LENGTH */) {
        if (!program.maxUniformBlockNameLength) {
          var numActiveUniformBlocks = GLctx.getProgramParameter(program, 0x8A36/*GL_ACTIVE_UNIFORM_BLOCKS*/);
          for (var i = 0; i < numActiveUniformBlocks; ++i) {
            program.maxUniformBlockNameLength = Math.max(program.maxUniformBlockNameLength, GLctx.getActiveUniformBlockName(program, i).length+1);
          }
        }
        HEAP32[((p)>>2)] = program.maxUniformBlockNameLength;
      } else {
        HEAP32[((p)>>2)] = GLctx.getProgramParameter(program, pname);
      }
    };

  
  var _emscripten_glGetQueryObjecti64vEXT = (id, pname, params) => {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
        // if p == null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      var query = GL.queries[id];
      var param;
      {
        param = GLctx.disjointTimerQueryExt['getQueryObjectEXT'](query, pname);
      }
      var ret;
      if (typeof param === 'boolean') {
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
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      var query = GL.queries[id];
      var param = GLctx.disjointTimerQueryExt['getQueryObjectEXT'](query, pname);
      var ret;
      if (typeof param === 'boolean') {
        ret = param ? 1 : 0;
      } else {
        ret = param;
      }
      HEAP32[((params)>>2)] = ret;
    };

  
  var _emscripten_glGetQueryObjectui64vEXT = _emscripten_glGetQueryObjecti64vEXT;

  
  var _emscripten_glGetQueryObjectuivEXT = _emscripten_glGetQueryObjectivEXT;

  
  var _emscripten_glGetQueryivEXT = (target, pname, params) => {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
        // if p == null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      HEAP32[((params)>>2)] = GLctx.disjointTimerQueryExt['getQueryEXT'](target, pname);
    };

  
  var _emscripten_glGetRenderbufferParameteriv = (target, pname, params) => {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
        // if params == null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      HEAP32[((params)>>2)] = GLctx.getRenderbufferParameter(target, pname);
    };

  
  
  var _emscripten_glGetShaderInfoLog = (shader, maxLength, length, infoLog) => {
      var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
      if (log === null) log = '(unknown error)';
      var numBytesWrittenExclNull = (maxLength > 0 && infoLog) ? stringToUTF8(log, infoLog, maxLength) : 0;
      if (length) HEAP32[((length)>>2)] = numBytesWrittenExclNull;
    };

  
  var _emscripten_glGetShaderPrecisionFormat = (shaderType, precisionType, range, precision) => {
      var result = GLctx.getShaderPrecisionFormat(shaderType, precisionType);
      HEAP32[((range)>>2)] = result.rangeMin;
      HEAP32[(((range)+(4))>>2)] = result.rangeMax;
      HEAP32[((precision)>>2)] = result.precision;
    };

  
  var _emscripten_glGetShaderSource = (shader, bufSize, length, source) => {
      var result = GLctx.getShaderSource(GL.shaders[shader]);
      if (!result) return; // If an error occurs, nothing will be written to length or source.
      var numBytesWrittenExclNull = (bufSize > 0 && source) ? stringToUTF8(result, source, bufSize) : 0;
      if (length) HEAP32[((length)>>2)] = numBytesWrittenExclNull;
    };

  
  var _emscripten_glGetShaderiv = (shader, pname, p) => {
      if (!p) {
        // GLES2 specification does not specify how to behave if p is a null
        // pointer. Since calling this function does not make sense if p == null,
        // issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      if (pname == 0x8B84) { // GL_INFO_LOG_LENGTH
        var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
        if (log === null) log = '(unknown error)';
        // The GLES2 specification says that if the shader has an empty info log,
        // a value of 0 is returned. Otherwise the log has a null char appended.
        // (An empty string is falsey, so we can just check that instead of
        // looking at log.length.)
        var logLength = log ? log.length + 1 : 0;
        HEAP32[((p)>>2)] = logLength;
      } else if (pname == 0x8B88) { // GL_SHADER_SOURCE_LENGTH
        var source = GLctx.getShaderSource(GL.shaders[shader]);
        // source may be a null, or the empty string, both of which are falsey
        // values that we report a 0 length for.
        var sourceLength = source ? source.length + 1 : 0;
        HEAP32[((p)>>2)] = sourceLength;
      } else {
        HEAP32[((p)>>2)] = GLctx.getShaderParameter(GL.shaders[shader], pname);
      }
    };

  
  
  var stringToNewUTF8 = (str) => {
      var size = lengthBytesUTF8(str) + 1;
      var ret = _malloc(size);
      if (ret) stringToUTF8(str, ret, size);
      return ret;
    };
  
  
  var webglGetExtensions = () => {
      var exts = getEmscriptenSupportedExtensions(GLctx);
      exts = exts.concat(exts.map((e) => 'GL_' + e));
      return exts;
    };
  
  var _emscripten_glGetString = (name_) => {
      var ret = GL.stringCache[name_];
      if (!ret) {
        switch (name_) {
          case 0x1F03 /* GL_EXTENSIONS */:
            ret = stringToNewUTF8(webglGetExtensions().join(' '));
            break;
          case 0x1F00 /* GL_VENDOR */:
          case 0x1F01 /* GL_RENDERER */:
          case 0x9245 /* UNMASKED_VENDOR_WEBGL */:
          case 0x9246 /* UNMASKED_RENDERER_WEBGL */:
            var s = GLctx.getParameter(name_);
            if (!s) {
              GL.recordError(0x500/*GL_INVALID_ENUM*/);
            }
            ret = s ? stringToNewUTF8(s) : 0;
            break;
  
          case 0x1F02 /* GL_VERSION */:
            var webGLVersion = GLctx.getParameter(0x1F02 /*GL_VERSION*/);
            // return GLES version string corresponding to the version of the WebGL context
            var glVersion = `OpenGL ES 2.0 (${webGLVersion})`;
            ret = stringToNewUTF8(glVersion);
            break;
          case 0x8B8C /* GL_SHADING_LANGUAGE_VERSION */:
            var glslVersion = GLctx.getParameter(0x8B8C /*GL_SHADING_LANGUAGE_VERSION*/);
            // extract the version number 'N.M' from the string 'WebGL GLSL ES N.M ...'
            var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
            var ver_num = glslVersion.match(ver_re);
            if (ver_num !== null) {
              if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + '0'; // ensure minor version has 2 digits
              glslVersion = `OpenGL ES GLSL ES ${ver_num[1]} (${glslVersion})`;
            }
            ret = stringToNewUTF8(glslVersion);
            break;
          default:
            GL.recordError(0x500/*GL_INVALID_ENUM*/);
            // fall through
        }
        GL.stringCache[name_] = ret;
      }
      return ret;
    };

  
  var _emscripten_glGetTexParameterfv = (target, pname, params) => {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null
        // pointer. Since calling this function does not make sense if p == null,
        // issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      HEAPF32[((params)>>2)] = GLctx.getTexParameter(target, pname);
    };

  
  var _emscripten_glGetTexParameteriv = (target, pname, params) => {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null
        // pointer. Since calling this function does not make sense if p == null,
        // issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      HEAP32[((params)>>2)] = GLctx.getTexParameter(target, pname);
    };

  /** @suppress {checkTypes} */
  var jstoi_q = (str) => parseInt(str);
  
  /** @noinline */
  var webglGetLeftBracePos = (name) => name.slice(-1) == ']' && name.lastIndexOf('[');
  
  var webglPrepareUniformLocationsBeforeFirstUse = (program) => {
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
  
        var numActiveUniforms = GLctx.getProgramParameter(program, 0x8B86/*GL_ACTIVE_UNIFORMS*/);
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
          uniformSizeAndIdsByName[arrayName] = [sz, id];
  
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
        var uniformLocsById = program.uniformLocsById; // Maps GLuint -> WebGLUniformLocation
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
          arrayIndex = jstoi_q(name.slice(leftBrace + 1)) >>> 0; // "index]", coerce parseInt(']') with >>>0 to treat "foo[]" as "foo[0]" and foo[-1] as unsigned out-of-bounds.
          uniformBaseName = name.slice(0, leftBrace);
        }
  
        // Have we cached the location of this uniform before?
        // A pair [array length, GLint of the uniform location]
        var sizeAndId = program.uniformSizeAndIdsByName[uniformBaseName];
  
        // If a uniform with this name exists, and if its index is within the
        // array limits (if it's even an array), query the WebGLlocation, or
        // return an existing cached location.
        if (sizeAndId && arrayIndex < sizeAndId[0]) {
          arrayIndex += sizeAndId[1]; // Add the base location of the uniform to the array index offset.
          if ((uniformLocsById[arrayIndex] = uniformLocsById[arrayIndex] || GLctx.getUniformLocation(program, name))) {
            return arrayIndex;
          }
        }
      }
      else {
        // N.b. we are currently unable to distinguish between GL program IDs that
        // never existed vs GL program IDs that have been deleted, so report
        // GL_INVALID_VALUE in both cases.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
      }
      return -1;
    };

  
  var webglGetProgramUniformLocation = (program, location) => {
  
      if (program) {
        var webglLoc = program.uniformLocsById[location];
        // program.uniformLocsById[location] stores either an integer, or a
        // WebGLUniformLocation.
        // If an integer, we have not yet bound the location, so do it now. The
        // integer value specifies the array index we should bind to.
        if (typeof webglLoc === 'number') {
          program.uniformLocsById[location] = webglLoc = GLctx.getUniformLocation(program, program.uniformArrayNamesById[location] + (webglLoc > 0 ? `[${webglLoc}]` : ''));
        }
        // Else an already cached WebGLUniformLocation, return it.
        return webglLoc;
      } else {
        GL.recordError(0x502/*GL_INVALID_OPERATION*/);
      }
    };
  
  
  
  
  /** @suppress{checkTypes} */
  var emscriptenWebGLGetUniform = (program, location, params, type) => {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null
        // pointer. Since calling this function does not make sense if params ==
        // null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      program = GL.programs[program];
      webglPrepareUniformLocationsBeforeFirstUse(program);
      var data = GLctx.getUniform(program, webglGetProgramUniformLocation(program, location));
      if (typeof data === 'number' || typeof data === 'boolean') {
        switch (type) {
          case 0: HEAP32[((params)>>2)] = data; break;
          case 2: HEAPF32[((params)>>2)] = data; break;
        }
      } else {
        for (var i = 0; i < data.length; i++) {
          switch (type) {
            case 0: HEAP32[(((params)+(i*4))>>2)] = data[i]; break;
            case 2: HEAPF32[(((params)+(i*4))>>2)] = data[i]; break;
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

  
  var _emscripten_glGetVertexAttribPointerv = (index, pname, pointer) => {
      if (!pointer) {
        // GLES2 specification does not specify how to behave if pointer is a null
        // pointer. Since calling this function does not make sense if pointer ==
        // null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      HEAP32[((pointer)>>2)] = GLctx.getVertexAttribOffset(index, pname);
    };

  
  
  /** @suppress{checkTypes} */
  var emscriptenWebGLGetVertexAttrib = (index, pname, params, type) => {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null
        // pointer. Since calling this function does not make sense if params ==
        // null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      var data = GLctx.getVertexAttrib(index, pname);
      if (pname == 0x889F/*VERTEX_ATTRIB_ARRAY_BUFFER_BINDING*/) {
        HEAP32[((params)>>2)] = data && data["name"];
      } else if (typeof data === 'number' || typeof data === 'boolean') {
        switch (type) {
          case 0: HEAP32[((params)>>2)] = data; break;
          case 2: HEAPF32[((params)>>2)] = data; break;
          case 5: HEAP32[((params)>>2)] = Math.fround(data); break;
        }
      } else {
        for (var i = 0; i < data.length; i++) {
          switch (type) {
            case 0: HEAP32[(((params)+(i*4))>>2)] = data[i]; break;
            case 2: HEAPF32[(((params)+(i*4))>>2)] = data[i]; break;
            case 5: HEAP32[(((params)+(i*4))>>2)] = Math.fround(data[i]); break;
          }
        }
      }
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

  var _emscripten_glIsBuffer = (buffer) => {
      var b = GL.buffers[buffer];
      if (!b) return 0;
      return GLctx.isBuffer(b);
    };

  var _emscripten_glIsEnabled = (x0) => GLctx.isEnabled(x0);

  var _emscripten_glIsFramebuffer = (framebuffer) => {
      var fb = GL.framebuffers[framebuffer];
      if (!fb) return 0;
      return GLctx.isFramebuffer(fb);
    };

  var _emscripten_glIsProgram = (program) => {
      program = GL.programs[program];
      if (!program) return 0;
      return GLctx.isProgram(program);
    };

  var _emscripten_glIsQueryEXT = (id) => {
      var query = GL.queries[id];
      if (!query) return 0;
      return GLctx.disjointTimerQueryExt['isQueryEXT'](query);
    };

  var _emscripten_glIsRenderbuffer = (renderbuffer) => {
      var rb = GL.renderbuffers[renderbuffer];
      if (!rb) return 0;
      return GLctx.isRenderbuffer(rb);
    };

  var _emscripten_glIsShader = (shader) => {
      var s = GL.shaders[shader];
      if (!s) return 0;
      return GLctx.isShader(s);
    };

  var _emscripten_glIsTexture = (id) => {
      var texture = GL.textures[id];
      if (!texture) return 0;
      return GLctx.isTexture(texture);
    };

  
  var _emscripten_glIsVertexArray = (array) => {
  
      var vao = GL.vaos[array];
      if (!vao) return 0;
      return GLctx.isVertexArray(vao);
    };
  var _emscripten_glIsVertexArrayOES = _emscripten_glIsVertexArray;

  var _emscripten_glLineWidth = (x0) => GLctx.lineWidth(x0);

  var _emscripten_glLinkProgram = (program) => {
      program = GL.programs[program];
      GLctx.linkProgram(program);
      // Invalidate earlier computed uniform->ID mappings, those have now become stale
      program.uniformLocsById = 0; // Mark as null-like so that glGetUniformLocation() knows to populate this again.
      program.uniformSizeAndIdsByName = {};
  
    };

  var _emscripten_glPixelStorei = (pname, param) => {
      if (pname == 3317) {
        GL.unpackAlignment = param;
      } else if (pname == 3314) {
        GL.unpackRowLength = param;
      }
      GLctx.pixelStorei(pname, param);
    };

  var _emscripten_glPolygonModeWEBGL = (face, mode) => {
      GLctx.webglPolygonMode['polygonModeWEBGL'](face, mode);
    };

  var _emscripten_glPolygonOffset = (x0, x1) => GLctx.polygonOffset(x0, x1);

  var _emscripten_glPolygonOffsetClampEXT = (factor, units, clamp) => {
      GLctx.extPolygonOffsetClamp['polygonOffsetClampEXT'](factor, units, clamp);
    };

  var _emscripten_glQueryCounterEXT = (id, target) => {
      GLctx.disjointTimerQueryExt['queryCounterEXT'](GL.queries[id], target);
    };

  var computeUnpackAlignedImageSize = (width, height, sizePerPixel) => {
      function roundedToNextMultipleOf(x, y) {
        return (x + y - 1) & -y;
      }
      var plainRowSize = (GL.unpackRowLength || width) * sizePerPixel;
      var alignedRowSize = roundedToNextMultipleOf(plainRowSize, GL.unpackAlignment);
      return height * alignedRowSize;
    };
  
  var colorChannelsInGlTextureFormat = (format) => {
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
      };
      return colorChannels[format - 0x1902]||1;
    };
  
  
  
  /** @type {!Uint16Array} */
  var HEAPU16;
  
  
  
  var heapObjectForWebGLType = (type) => {
      // Micro-optimization for size: Subtract lowest GL enum number (0x1400/* GL_BYTE */) from type to compare
      // smaller values for the heap, for shorter generated code size.
      // Also the type HEAPU16 is not tested for explicitly, but any unrecognized type will return out HEAPU16.
      // (since most types are HEAPU16)
      type -= 0x1400;
  
      if (type == 1) return HEAPU8;
  
      if (type == 4) return HEAP32;
  
      if (type == 6) return HEAPF32;
  
      if (type == 5
        || type == 28922
        )
        return HEAPU32;
  
      return HEAPU16;
    };
  
  var toTypedArrayIndex = (pointer, heap) =>
      pointer >>> (31 - Math.clz32(heap.BYTES_PER_ELEMENT));
  
  var emscriptenWebGLGetTexPixelData = (type, format, width, height, pixels) => {
      var heap = heapObjectForWebGLType(type);
      var sizePerPixel = colorChannelsInGlTextureFormat(format) * heap.BYTES_PER_ELEMENT;
      var bytes = computeUnpackAlignedImageSize(width, height, sizePerPixel);
      return heap.subarray(toTypedArrayIndex(pixels, heap), toTypedArrayIndex(pixels + bytes, heap));
    };
  
  var _emscripten_glReadPixels = (x, y, width, height, format, type, pixels) => {
      var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels);
      if (!pixelData) {
        GL.recordError(0x500/*GL_INVALID_ENUM*/);
        return;
      }
      GLctx.readPixels(x, y, width, height, format, type, pixelData);
    };

  var _emscripten_glReleaseShaderCompiler = () => {
      // NOP (as allowed by GLES 2.0 spec)
    };

  var _emscripten_glRenderbufferStorage = (x0, x1, x2, x3) => GLctx.renderbufferStorage(x0, x1, x2, x3);

  var _emscripten_glSampleCoverage = (value, invert) => {
      GLctx.sampleCoverage(value, !!invert);
    };

  var _emscripten_glScissor = (x0, x1, x2, x3) => GLctx.scissor(x0, x1, x2, x3);

  var _emscripten_glShaderBinary = (count, shaders, binaryformat, binary, length) => {
      GL.recordError(0x500/*GL_INVALID_ENUM*/);
    };

  var _emscripten_glShaderSource = (shader, count, string, length) => {
      var source = GL.getSource(shader, count, string, length);
  
      GLctx.shaderSource(GL.shaders[shader], source);
    };

  var _emscripten_glStencilFunc = (x0, x1, x2) => GLctx.stencilFunc(x0, x1, x2);

  var _emscripten_glStencilFuncSeparate = (x0, x1, x2, x3) => GLctx.stencilFuncSeparate(x0, x1, x2, x3);

  var _emscripten_glStencilMask = (x0) => GLctx.stencilMask(x0);

  var _emscripten_glStencilMaskSeparate = (x0, x1) => GLctx.stencilMaskSeparate(x0, x1);

  var _emscripten_glStencilOp = (x0, x1, x2) => GLctx.stencilOp(x0, x1, x2);

  var _emscripten_glStencilOpSeparate = (x0, x1, x2, x3) => GLctx.stencilOpSeparate(x0, x1, x2, x3);

  
  var _emscripten_glTexImage2D = (target, level, internalFormat, width, height, border, format, type, pixels) => {
      var pixelData = pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels) : null;
      GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixelData);
    };

  var _emscripten_glTexParameterf = (x0, x1, x2) => GLctx.texParameterf(x0, x1, x2);

  
  var _emscripten_glTexParameterfv = (target, pname, params) => {
      var param = HEAPF32[((params)>>2)];
      GLctx.texParameterf(target, pname, param);
    };

  var _emscripten_glTexParameteri = (x0, x1, x2) => GLctx.texParameteri(x0, x1, x2);

  
  var _emscripten_glTexParameteriv = (target, pname, params) => {
      var param = HEAP32[((params)>>2)];
      GLctx.texParameteri(target, pname, param);
    };

  
  var _emscripten_glTexSubImage2D = (target, level, xoffset, yoffset, width, height, format, type, pixels) => {
      var pixelData = pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels) : null;
      GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixelData);
    };

  
  var webglGetUniformLocation = (location) => {
  
      return webglGetProgramUniformLocation(GLctx.currentProgram, location);
    };
  
  var _emscripten_glUniform1f = (location, v0) => {
      GLctx.uniform1f(webglGetUniformLocation(location), v0);
    };

  
  var miniTempWebGLFloatBuffers = [];
  
  
  var _emscripten_glUniform1fv = (location, count, value) => {
  
      if (count <= 288) {
        // avoid allocation when uploading few enough uniforms
        var view = miniTempWebGLFloatBuffers[count];
        for (var i = 0; i < count; ++i) {
          view[i] = HEAPF32[(((value)+(4*i))>>2)];
        }
      } else
      {
        var view = HEAPF32.subarray((((value)>>2)), ((value+count*4)>>2));
      }
      GLctx.uniform1fv(webglGetUniformLocation(location), view);
    };

  
  var _emscripten_glUniform1i = (location, v0) => {
      GLctx.uniform1i(webglGetUniformLocation(location), v0);
    };

  
  var miniTempWebGLIntBuffers = [];
  
  
  var _emscripten_glUniform1iv = (location, count, value) => {
  
      if (count <= 288) {
        // avoid allocation when uploading few enough uniforms
        var view = miniTempWebGLIntBuffers[count];
        for (var i = 0; i < count; ++i) {
          view[i] = HEAP32[(((value)+(4*i))>>2)];
        }
      } else
      {
        var view = HEAP32.subarray((((value)>>2)), ((value+count*4)>>2));
      }
      GLctx.uniform1iv(webglGetUniformLocation(location), view);
    };

  
  var _emscripten_glUniform2f = (location, v0, v1) => {
      GLctx.uniform2f(webglGetUniformLocation(location), v0, v1);
    };

  
  
  
  var _emscripten_glUniform2fv = (location, count, value) => {
  
      if (count <= 144) {
        // avoid allocation when uploading few enough uniforms
        count *= 2;
        var view = miniTempWebGLFloatBuffers[count];
        for (var i = 0; i < count; i += 2) {
          view[i] = HEAPF32[(((value)+(4*i))>>2)];
          view[i+1] = HEAPF32[(((value)+(4*i+4))>>2)];
        }
      } else
      {
        var view = HEAPF32.subarray((((value)>>2)), ((value+count*8)>>2));
      }
      GLctx.uniform2fv(webglGetUniformLocation(location), view);
    };

  
  var _emscripten_glUniform2i = (location, v0, v1) => {
      GLctx.uniform2i(webglGetUniformLocation(location), v0, v1);
    };

  
  
  
  var _emscripten_glUniform2iv = (location, count, value) => {
  
      if (count <= 144) {
        // avoid allocation when uploading few enough uniforms
        count *= 2;
        var view = miniTempWebGLIntBuffers[count];
        for (var i = 0; i < count; i += 2) {
          view[i] = HEAP32[(((value)+(4*i))>>2)];
          view[i+1] = HEAP32[(((value)+(4*i+4))>>2)];
        }
      } else
      {
        var view = HEAP32.subarray((((value)>>2)), ((value+count*8)>>2));
      }
      GLctx.uniform2iv(webglGetUniformLocation(location), view);
    };

  
  var _emscripten_glUniform3f = (location, v0, v1, v2) => {
      GLctx.uniform3f(webglGetUniformLocation(location), v0, v1, v2);
    };

  
  
  
  var _emscripten_glUniform3fv = (location, count, value) => {
  
      if (count <= 96) {
        // avoid allocation when uploading few enough uniforms
        count *= 3;
        var view = miniTempWebGLFloatBuffers[count];
        for (var i = 0; i < count; i += 3) {
          view[i] = HEAPF32[(((value)+(4*i))>>2)];
          view[i+1] = HEAPF32[(((value)+(4*i+4))>>2)];
          view[i+2] = HEAPF32[(((value)+(4*i+8))>>2)];
        }
      } else
      {
        var view = HEAPF32.subarray((((value)>>2)), ((value+count*12)>>2));
      }
      GLctx.uniform3fv(webglGetUniformLocation(location), view);
    };

  
  var _emscripten_glUniform3i = (location, v0, v1, v2) => {
      GLctx.uniform3i(webglGetUniformLocation(location), v0, v1, v2);
    };

  
  
  
  var _emscripten_glUniform3iv = (location, count, value) => {
  
      if (count <= 96) {
        // avoid allocation when uploading few enough uniforms
        count *= 3;
        var view = miniTempWebGLIntBuffers[count];
        for (var i = 0; i < count; i += 3) {
          view[i] = HEAP32[(((value)+(4*i))>>2)];
          view[i+1] = HEAP32[(((value)+(4*i+4))>>2)];
          view[i+2] = HEAP32[(((value)+(4*i+8))>>2)];
        }
      } else
      {
        var view = HEAP32.subarray((((value)>>2)), ((value+count*12)>>2));
      }
      GLctx.uniform3iv(webglGetUniformLocation(location), view);
    };

  
  var _emscripten_glUniform4f = (location, v0, v1, v2, v3) => {
      GLctx.uniform4f(webglGetUniformLocation(location), v0, v1, v2, v3);
    };

  
  
  
  var _emscripten_glUniform4fv = (location, count, value) => {
  
      if (count <= 72) {
        // avoid allocation when uploading few enough uniforms
        var view = miniTempWebGLFloatBuffers[4*count];
        // hoist the heap out of the loop for size and for pthreads+growth.
        var heap = HEAPF32;
        value = ((value)>>2);
        count *= 4;
        for (var i = 0; i < count; i += 4) {
          var dst = value + i;
          view[i] = heap[dst];
          view[i + 1] = heap[dst + 1];
          view[i + 2] = heap[dst + 2];
          view[i + 3] = heap[dst + 3];
        }
      } else
      {
        var view = HEAPF32.subarray((((value)>>2)), ((value+count*16)>>2));
      }
      GLctx.uniform4fv(webglGetUniformLocation(location), view);
    };

  
  var _emscripten_glUniform4i = (location, v0, v1, v2, v3) => {
      GLctx.uniform4i(webglGetUniformLocation(location), v0, v1, v2, v3);
    };

  
  
  
  var _emscripten_glUniform4iv = (location, count, value) => {
  
      if (count <= 72) {
        // avoid allocation when uploading few enough uniforms
        count *= 4;
        var view = miniTempWebGLIntBuffers[count];
        for (var i = 0; i < count; i += 4) {
          view[i] = HEAP32[(((value)+(4*i))>>2)];
          view[i+1] = HEAP32[(((value)+(4*i+4))>>2)];
          view[i+2] = HEAP32[(((value)+(4*i+8))>>2)];
          view[i+3] = HEAP32[(((value)+(4*i+12))>>2)];
        }
      } else
      {
        var view = HEAP32.subarray((((value)>>2)), ((value+count*16)>>2));
      }
      GLctx.uniform4iv(webglGetUniformLocation(location), view);
    };

  
  
  
  var _emscripten_glUniformMatrix2fv = (location, count, transpose, value) => {
  
      if (count <= 72) {
        // avoid allocation when uploading few enough uniforms
        count *= 4;
        var view = miniTempWebGLFloatBuffers[count];
        for (var i = 0; i < count; i += 4) {
          view[i] = HEAPF32[(((value)+(4*i))>>2)];
          view[i+1] = HEAPF32[(((value)+(4*i+4))>>2)];
          view[i+2] = HEAPF32[(((value)+(4*i+8))>>2)];
          view[i+3] = HEAPF32[(((value)+(4*i+12))>>2)];
        }
      } else
      {
        var view = HEAPF32.subarray((((value)>>2)), ((value+count*16)>>2));
      }
      GLctx.uniformMatrix2fv(webglGetUniformLocation(location), !!transpose, view);
    };

  
  
  
  var _emscripten_glUniformMatrix3fv = (location, count, transpose, value) => {
  
      if (count <= 32) {
        // avoid allocation when uploading few enough uniforms
        count *= 9;
        var view = miniTempWebGLFloatBuffers[count];
        for (var i = 0; i < count; i += 9) {
          view[i] = HEAPF32[(((value)+(4*i))>>2)];
          view[i+1] = HEAPF32[(((value)+(4*i+4))>>2)];
          view[i+2] = HEAPF32[(((value)+(4*i+8))>>2)];
          view[i+3] = HEAPF32[(((value)+(4*i+12))>>2)];
          view[i+4] = HEAPF32[(((value)+(4*i+16))>>2)];
          view[i+5] = HEAPF32[(((value)+(4*i+20))>>2)];
          view[i+6] = HEAPF32[(((value)+(4*i+24))>>2)];
          view[i+7] = HEAPF32[(((value)+(4*i+28))>>2)];
          view[i+8] = HEAPF32[(((value)+(4*i+32))>>2)];
        }
      } else
      {
        var view = HEAPF32.subarray((((value)>>2)), ((value+count*36)>>2));
      }
      GLctx.uniformMatrix3fv(webglGetUniformLocation(location), !!transpose, view);
    };

  
  
  
  var _emscripten_glUniformMatrix4fv = (location, count, transpose, value) => {
  
      if (count <= 18) {
        // avoid allocation when uploading few enough uniforms
        var view = miniTempWebGLFloatBuffers[16*count];
        // hoist the heap out of the loop for size and for pthreads+growth.
        var heap = HEAPF32;
        value = ((value)>>2);
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
      } else
      {
        var view = HEAPF32.subarray((((value)>>2)), ((value+count*64)>>2));
      }
      GLctx.uniformMatrix4fv(webglGetUniformLocation(location), !!transpose, view);
    };

  var _emscripten_glUseProgram = (program) => {
      program = GL.programs[program];
      GLctx.useProgram(program);
      // Record the currently active program so that we can access the uniform
      // mapping table of that program.
      GLctx.currentProgram = program;
    };

  var _emscripten_glValidateProgram = (program) => {
      GLctx.validateProgram(GL.programs[program]);
    };

  var _emscripten_glVertexAttrib1f = (x0, x1) => GLctx.vertexAttrib1f(x0, x1);

  
  var _emscripten_glVertexAttrib1fv = (index, v) => {
  
      GLctx.vertexAttrib1f(index, HEAPF32[v>>2]);
    };

  var _emscripten_glVertexAttrib2f = (x0, x1, x2) => GLctx.vertexAttrib2f(x0, x1, x2);

  
  var _emscripten_glVertexAttrib2fv = (index, v) => {
  
      GLctx.vertexAttrib2f(index, HEAPF32[v>>2], HEAPF32[v+4>>2]);
    };

  var _emscripten_glVertexAttrib3f = (x0, x1, x2, x3) => GLctx.vertexAttrib3f(x0, x1, x2, x3);

  
  var _emscripten_glVertexAttrib3fv = (index, v) => {
  
      GLctx.vertexAttrib3f(index, HEAPF32[v>>2], HEAPF32[v+4>>2], HEAPF32[v+8>>2]);
    };

  var _emscripten_glVertexAttrib4f = (x0, x1, x2, x3, x4) => GLctx.vertexAttrib4f(x0, x1, x2, x3, x4);

  
  var _emscripten_glVertexAttrib4fv = (index, v) => {
  
      GLctx.vertexAttrib4f(index, HEAPF32[v>>2], HEAPF32[v+4>>2], HEAPF32[v+8>>2], HEAPF32[v+12>>2]);
    };

  
  var _emscripten_glVertexAttribDivisor = (index, divisor) => {
      GLctx.vertexAttribDivisor(index, divisor);
    };
  var _emscripten_glVertexAttribDivisorANGLE = _emscripten_glVertexAttribDivisor;

  var _emscripten_glVertexAttribPointer = (index, size, type, normalized, stride, ptr) => {
      GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr);
    };

  var _emscripten_glViewport = (x0, x1, x2, x3) => GLctx.viewport(x0, x1, x2, x3);

  var _emscripten_has_asyncify = () => 2;

  var _emscripten_num_logical_cores = () =>
      navigator['hardwareConcurrency'];

  var _emscripten_out = (str) => out(UTF8ToString(str));

  
  
  var doRequestFullscreen = (target, strategy) => {
      if (!JSEvents.fullscreenEnabled()) return -1;
      target = findEventTarget(target);
      if (!target) return -4;
  
      if (!target.requestFullscreen
        // Safari didn't Element.requestFullscreen support until 16.4
        // See: https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen
        && !target.webkitRequestFullscreen
        ) {
        return -3;
      }
  
      // Queue this function call if we're not currently in an event handler and
      // the user saw it appropriate to do so.
      if (!JSEvents.canPerformEventHandlerRequests()) {
        if (strategy.deferUntilInEventHandler) {
          JSEvents.deferCall(JSEvents_requestFullscreen, 1 /* priority over pointer lock */, [target, strategy]);
          return 1;
        }
        return -2;
      }
  
      return JSEvents_requestFullscreen(target, strategy);
    };
  
  
  
  function _emscripten_request_fullscreen_strategy(target, deferUntilInEventHandler, fullscreenStrategy) {
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(13, 0, 1, target, deferUntilInEventHandler, fullscreenStrategy);
  
      var strategy = {
        scaleMode: HEAP32[((fullscreenStrategy)>>2)],
        canvasResolutionScaleMode: HEAP32[(((fullscreenStrategy)+(4))>>2)],
        filteringMode: HEAP32[(((fullscreenStrategy)+(8))>>2)],
        deferUntilInEventHandler,
        canvasResizedCallbackTargetThread: HEAP32[(((fullscreenStrategy)+(20))>>2)],
        canvasResizedCallback: HEAP32[(((fullscreenStrategy)+(12))>>2)],
        canvasResizedCallbackUserData: HEAP32[(((fullscreenStrategy)+(16))>>2)]
      };
  
      return doRequestFullscreen(target, strategy);
    
  }
  

  
  
  
  
  function _emscripten_request_pointerlock(target, deferUntilInEventHandler) {
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(14, 0, 1, target, deferUntilInEventHandler);
  
      target = findEventTarget(target);
      if (!target) return -4;
      if (!target.requestPointerLock) {
        return -1;
      }
  
      // Queue this function call if we're not currently in an event handler and
      // the user saw it appropriate to do so.
      if (!JSEvents.canPerformEventHandlerRequests()) {
        if (deferUntilInEventHandler) {
          JSEvents.deferCall(requestPointerLock, 2 /* priority below fullscreen */, [target]);
          return 1;
        }
        return -2;
      }
  
      return requestPointerLock(target);
    
  }
  

  var abortOnCannotGrowMemory = (requestedSize) => {
      abort('OOM');
    };
  
  var _emscripten_resize_heap = (requestedSize) => {
      var oldSize = HEAPU8.length;
      // With CAN_ADDRESS_2GB or MEMORY64, pointers are already unsigned.
      requestedSize >>>= 0;
      abortOnCannotGrowMemory(requestedSize);
    };

  
  /** @suppress {checkTypes} */
  
  function _emscripten_sample_gamepad_data() {
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(15, 0, 1);
  
      try {
        if (navigator.getGamepads) return (JSEvents.lastGamepadState = navigator.getGamepads())
          ? 0 : -1;
      } catch(e) {
        navigator.getGamepads = null; // Disable getGamepads() so that it won't be attempted to be used again.
      }
      return -1;
    
  }
  

  
  
  
  var registerBeforeUnloadEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) => {
      var beforeUnloadEventHandlerFunc = (e) => {
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
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(16, 0, 1, userData, callbackfunc, targetThread);
  
      if (typeof onbeforeunload === 'undefined') return -1;
      // beforeunload callback can only be registered on the main browser thread, because the page will go away immediately after returning from the handler,
      // and there is no time to start proxying it anywhere.
      if (targetThread !== 1) return -5;
      return registerBeforeUnloadEventCallback(2, userData, true, callbackfunc, 28, 'beforeunload');
    
  }
  

  
  
  
  
  var registerFocusEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
      const eventSize = 256;
      JSEvents.focusEvent ||= _malloc(eventSize);
  
      var focusEventHandlerFunc = (e) => {
        var nodeName = JSEvents.getNodeNameForTarget(e.target);
        var id = e.target.id ?? '';
  
        var focusEvent = JSEvents.focusEvent;
        stringToUTF8(nodeName, focusEvent + 0, 128);
        stringToUTF8(id, focusEvent + 128, 128);
  
        if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, focusEvent, eventSize, userData);
        else
        if (getWasmTableEntry(callbackfunc)(eventTypeId, focusEvent, userData)) e.preventDefault();
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
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(17, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  return registerFocusEventCallback(target, userData, useCapture, callbackfunc, 12, 'blur', targetThread)
  }
  


  
  
  var fillDeviceMotionEventData = (eventStruct, e, target) => {
      var a = e.acceleration;
      var ag = e.accelerationIncludingGravity;
      var rr = e.rotationRate;
      var supportedFields = 0;
      supportedFields |= a && 1;
      supportedFields |= ag && 2;
      supportedFields |= rr && 4;
      HEAP32[(((eventStruct)+(72))>>2)] = supportedFields;
      HEAPF64[((eventStruct)>>3)] = a?.x;
      HEAPF64[(((eventStruct)+(8))>>3)] = a?.y;
      HEAPF64[(((eventStruct)+(16))>>3)] = a?.z;
      HEAPF64[(((eventStruct)+(24))>>3)] = ag?.x;
      HEAPF64[(((eventStruct)+(32))>>3)] = ag?.y;
      HEAPF64[(((eventStruct)+(40))>>3)] = ag?.z;
      HEAPF64[(((eventStruct)+(48))>>3)] = rr?.alpha;
      HEAPF64[(((eventStruct)+(56))>>3)] = rr?.beta;
      HEAPF64[(((eventStruct)+(64))>>3)] = rr?.gamma;
    };
  
  
  
  var registerDeviceMotionEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
      const eventSize = 80;
      JSEvents.deviceMotionEvent ||= _malloc(eventSize);
  
      var deviceMotionEventHandlerFunc = (e) => {
        fillDeviceMotionEventData(JSEvents.deviceMotionEvent, e, target); // TODO: Thread-safety with respect to emscripten_get_devicemotion_status()
  
        if (targetThread) {
          __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, JSEvents.deviceMotionEvent, eventSize, userData);
        } else
        if (getWasmTableEntry(callbackfunc)(eventTypeId, JSEvents.deviceMotionEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target: findEventTarget(target),
        eventTypeString,
        eventTypeId,
        userData,
        callbackfunc,
        handlerFunc: deviceMotionEventHandlerFunc,
        useCapture
      };
      return JSEvents.registerOrRemoveHandler(eventHandler);
    };
  
  
  function _emscripten_set_devicemotion_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(18, 0, 1, userData, useCapture, callbackfunc, targetThread);
  return registerDeviceMotionEventCallback(2, userData, useCapture, callbackfunc, 17, 'devicemotion', targetThread)
  }
  

  
  
  function _emscripten_set_element_css_size(target, width, height) {
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(19, 0, 1, target, width, height);
  
      target = findEventTarget(target);
      if (!target) return -4;
  
      target.style.width = width + 'px';
      target.style.height = height + 'px';
  
      return 0;
    
  }
  

  
  
  function _emscripten_set_focus_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(20, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  return registerFocusEventCallback(target, userData, useCapture, callbackfunc, 13, 'focus', targetThread)
  }
  

  
  
  
  
  var registerFullscreenChangeEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
      const eventSize = 276;
      JSEvents.fullscreenChangeEvent ||= _malloc(eventSize);
  
      var fullscreenChangeEventHandlerFunc = (e) => {
        var fullscreenChangeEvent = JSEvents.fullscreenChangeEvent;
        fillFullscreenChangeEventData(fullscreenChangeEvent);
  
        if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, fullscreenChangeEvent, eventSize, userData);
        else
        if (getWasmTableEntry(callbackfunc)(eventTypeId, fullscreenChangeEvent, userData)) e.preventDefault();
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
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(21, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  
      if (!JSEvents.fullscreenEnabled()) return -1;
      target = findEventTarget(target);
      if (!target) return -4;
  
      // TODO: When this block is removed, also change test/test_html5_remove_event_listener.c test expectation on emscripten_set_fullscreenchange_callback().
      registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, 19, 'webkitfullscreenchange', targetThread);
  
      return registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, 19, 'fullscreenchange', targetThread);
    
  }
  

  
  
  
  
  var registerGamepadEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
      const eventSize = 1240;
      JSEvents.gamepadEvent ||= _malloc(eventSize);
  
      var gamepadEventHandlerFunc = (e) => {
        var gamepadEvent = JSEvents.gamepadEvent;
        fillGamepadEventData(gamepadEvent, e['gamepad']);
  
        if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, gamepadEvent, eventSize, userData);
        else
        if (getWasmTableEntry(callbackfunc)(eventTypeId, gamepadEvent, userData)) e.preventDefault();
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
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(22, 0, 1, userData, useCapture, callbackfunc, targetThread);
  
      if (_emscripten_sample_gamepad_data()) return -1;
      return registerGamepadEventCallback(2, userData, useCapture, callbackfunc, 26, 'gamepadconnected', targetThread);
    
  }
  

  
  
  
  function _emscripten_set_gamepaddisconnected_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(23, 0, 1, userData, useCapture, callbackfunc, targetThread);
  
      if (_emscripten_sample_gamepad_data()) return -1;
      return registerGamepadEventCallback(2, userData, useCapture, callbackfunc, 27, 'gamepaddisconnected', targetThread);
    
  }
  

  
  
  
  
  
  
  
  var registerKeyEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
      const eventSize = 160;
      JSEvents.keyEvent ||= _malloc(eventSize);
  
      var keyEventHandlerFunc = (e) => {
  
        var keyEventData = JSEvents.keyEvent;
        HEAPF64[((keyEventData)>>3)] = e.timeStamp;
  
        var idx = ((keyEventData)>>2);
  
        HEAP32[idx + 2] = e.location;
        HEAP8[keyEventData + 12] = e.ctrlKey;
        HEAP8[keyEventData + 13] = e.shiftKey;
        HEAP8[keyEventData + 14] = e.altKey;
        HEAP8[keyEventData + 15] = e.metaKey;
        HEAP8[keyEventData + 16] = e.repeat;
        HEAP32[idx + 5] = e.charCode;
        HEAP32[idx + 6] = e.keyCode;
        HEAP32[idx + 7] = e.which;
        stringToUTF8(e.key ?? '', keyEventData + 32, 32);
        stringToUTF8(e.code ?? '', keyEventData + 64, 32);
        stringToUTF8(e.char ?? '', keyEventData + 96, 32);
        stringToUTF8(e.locale ?? '', keyEventData + 128, 32);
  
        if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, keyEventData, eventSize, userData);
        else
        if (getWasmTableEntry(callbackfunc)(eventTypeId, keyEventData, userData)) e.preventDefault();
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
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(24, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  return registerKeyEventCallback(target, userData, useCapture, callbackfunc, 2, 'keydown', targetThread)
  }
  

  
  
  function _emscripten_set_keypress_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(25, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  return registerKeyEventCallback(target, userData, useCapture, callbackfunc, 1, 'keypress', targetThread)
  }
  

  
  
  function _emscripten_set_keyup_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(26, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  return registerKeyEventCallback(target, userData, useCapture, callbackfunc, 3, 'keyup', targetThread)
  }
  


  
  var screenOrientation = () => window.screen?.orientation;
  
  var fillOrientationChangeEventData = (eventStruct) => {
      // OrientationType enum
      var orientationsType1 = ['portrait-primary', 'portrait-secondary', 'landscape-primary', 'landscape-secondary'];
      // alternative selection from OrientationLockType enum
      var orientationsType2 = ['portrait',         'portrait',           'landscape',         'landscape'];
  
      var orientationIndex = 0;
      var orientationAngle = 0;
      var screenOrientObj  = screenOrientation();
      if (screenOrientObj) {
        orientationIndex = orientationsType1.indexOf(screenOrientObj.type);
        if (orientationIndex < 0) {
          orientationIndex = orientationsType2.indexOf(screenOrientObj.type);
        }
        if (orientationIndex >= 0) {
          orientationIndex = 1 << orientationIndex;
        }
        orientationAngle = screenOrientObj.angle;
      }
      else {
        // fallback for Safari earlier than 16.4 (March 2023)
        orientationAngle = window.orientation;
      }
  
      HEAP32[((eventStruct)>>2)] = orientationIndex;
      HEAP32[(((eventStruct)+(4))>>2)] = orientationAngle;
    };
  
  
  var registerOrientationChangeEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
      const eventSize = 8;
      JSEvents.orientationChangeEvent ||= _malloc(eventSize);
  
      var orientationChangeEventHandlerFunc = (e) => {
        var orientationChangeEvent = JSEvents.orientationChangeEvent;
        fillOrientationChangeEventData(orientationChangeEvent);
  
        if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, orientationChangeEvent, eventSize, userData);
        else
        if (getWasmTableEntry(callbackfunc)(eventTypeId, orientationChangeEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target,
        eventTypeString,
        eventTypeId,
        userData,
        callbackfunc,
        handlerFunc: orientationChangeEventHandlerFunc,
        useCapture
      };
      return JSEvents.registerOrRemoveHandler(eventHandler);
    };
  
  
  function _emscripten_set_orientationchange_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(27, 0, 1, userData, useCapture, callbackfunc, targetThread);
  
      if (!window.screen || !screen.orientation) return -1;
      return registerOrientationChangeEventCallback(screen.orientation, userData, useCapture, callbackfunc, 18, 'change', targetThread);
    
  }
  

  
  
  
  
  var fillPointerlockChangeEventData = (eventStruct) => {
      var pointerLockElement = document.pointerLockElement;
      var isPointerlocked = !!pointerLockElement;
      // Assigning a boolean to HEAP32 with expected type coercion.
      /** @suppress{checkTypes} */
      HEAP8[eventStruct] = isPointerlocked;
      var nodeName = JSEvents.getNodeNameForTarget(pointerLockElement);
      var id = pointerLockElement?.id ?? '';
      stringToUTF8(nodeName, eventStruct + 1, 128);
      stringToUTF8(id, eventStruct + 129, 128);
    };
  
  
  var registerPointerlockChangeEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
      const eventSize = 257;
      JSEvents.pointerlockChangeEvent ||= _malloc(eventSize);
  
      var pointerlockChangeEventHandlerFunc = (e) => {
        var pointerlockChangeEvent = JSEvents.pointerlockChangeEvent;
        fillPointerlockChangeEventData(pointerlockChangeEvent);
  
        if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, pointerlockChangeEvent, eventSize, userData);
        else
        if (getWasmTableEntry(callbackfunc)(eventTypeId, pointerlockChangeEvent, userData)) e.preventDefault();
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
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(28, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  
      if (!document.body?.requestPointerLock) {
        return -1;
      }
  
      target = findEventTarget(target);
      if (!target) return -4;
      return registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, 'pointerlockchange', targetThread);
    
  }
  

  
  
  
  
  var registerUiEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
      const eventSize = 36;
      JSEvents.uiEvent ||= _malloc(eventSize);
  
      target = findEventTarget(target);
  
      var uiEventHandlerFunc = (e) => {
        if (e.target != target) {
          // Never take ui events such as scroll via a 'bubbled' route, but always from the direct element that
          // was targeted. Otherwise e.g. if app logs a message in response to a page scroll, the Emscripten log
          // message box could cause to scroll, generating a new (bubbled) scroll message, causing a new log print,
          // causing a new scroll, etc..
          return;
        }
        var b = document.body; // Take document.body to a variable, Closure compiler does not outline access to it on its own.
        if (!b) {
          // During a page unload 'body' can be null, with "Cannot read property 'clientWidth' of null" being thrown
          return;
        }
        var uiEvent = JSEvents.uiEvent;
        HEAP32[((uiEvent)>>2)] = 0; // always zero for resize and scroll
        HEAP32[(((uiEvent)+(4))>>2)] = b.clientWidth;
        HEAP32[(((uiEvent)+(8))>>2)] = b.clientHeight;
        HEAP32[(((uiEvent)+(12))>>2)] = innerWidth;
        HEAP32[(((uiEvent)+(16))>>2)] = innerHeight;
        HEAP32[(((uiEvent)+(20))>>2)] = outerWidth;
        HEAP32[(((uiEvent)+(24))>>2)] = outerHeight;
        HEAP32[(((uiEvent)+(28))>>2)] = pageXOffset | 0; // scroll offsets are float
        HEAP32[(((uiEvent)+(32))>>2)] = pageYOffset | 0;
        if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, uiEvent, eventSize, userData);
        else
        if (getWasmTableEntry(callbackfunc)(eventTypeId, uiEvent, userData)) e.preventDefault();
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
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(29, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  return registerUiEventCallback(target, userData, useCapture, callbackfunc, 10, 'resize', targetThread)
  }
  

  
  
  var fillVisibilityChangeEventData = (eventStruct) => {
      var visibilityStates = [ 'hidden', 'visible', 'prerender', 'unloaded' ];
      var visibilityState = visibilityStates.indexOf(document.visibilityState);
  
      // Assigning a boolean to HEAP32 with expected type coercion.
      /** @suppress{checkTypes} */
      HEAP8[eventStruct] = document.hidden;
      HEAP32[(((eventStruct)+(4))>>2)] = visibilityState;
    };
  
  
  var registerVisibilityChangeEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
      const eventSize = 8;
      JSEvents.visibilityChangeEvent ||= _malloc(eventSize);
  
      var visibilityChangeEventHandlerFunc = (e) => {
        var visibilityChangeEvent = JSEvents.visibilityChangeEvent;
        fillVisibilityChangeEventData(visibilityChangeEvent);
  
        if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, visibilityChangeEvent, eventSize, userData);
        else
        if (getWasmTableEntry(callbackfunc)(eventTypeId, visibilityChangeEvent, userData)) e.preventDefault();
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
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(30, 0, 1, userData, useCapture, callbackfunc, targetThread);
  
    if (!specialHTMLTargets[1]) {
      return -4;
    }
      return registerVisibilityChangeEventCallback(specialHTMLTargets[1], userData, useCapture, callbackfunc, 21, 'visibilitychange', targetThread);
    
  }
  

  
  
  
  /** @type {!Int16Array} */
  var HEAP16;
  
  
  var fillMouseEventData = (eventStruct, e, target) => {
      HEAPF64[((eventStruct)>>3)] = e.timeStamp;
      var idx = ((eventStruct)>>2);
      HEAP32[idx + 2] = e.screenX;
      HEAP32[idx + 3] = e.screenY;
      HEAP32[idx + 4] = e.clientX;
      HEAP32[idx + 5] = e.clientY;
      HEAP8[eventStruct + 24] = e.ctrlKey;
      HEAP8[eventStruct + 25] = e.shiftKey;
      HEAP8[eventStruct + 26] = e.altKey;
      HEAP8[eventStruct + 27] = e.metaKey;
      HEAP16[idx*2 + 14] = e.button;
      HEAP16[idx*2 + 15] = e.buttons;
      HEAP32[idx + 8] = e.movementX;
      HEAP32[idx + 9] = e.movementY;
  
      // Note: rect contains doubles (truncated to placate SAFE_HEAP, which is the same behaviour when writing to HEAP32 anyway)
      var rect = getBoundingClientRect(target);
      HEAP32[idx + 10] = e.clientX - (rect.left | 0);
      HEAP32[idx + 11] = e.clientY - (rect.top  | 0);
    };
  
  
  
  
  var registerWheelEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
      const eventSize = 96;
      JSEvents.wheelEvent ||= _malloc(eventSize)
  
      // The DOM Level 3 events spec event 'wheel'
      var wheelHandlerFunc = (e) => {
        var wheelEvent = JSEvents.wheelEvent;
        fillMouseEventData(wheelEvent, e, target);
        HEAPF64[(((wheelEvent)+(64))>>3)] = e["deltaX"];
        HEAPF64[(((wheelEvent)+(72))>>3)] = e["deltaY"];
        HEAPF64[(((wheelEvent)+(80))>>3)] = e["deltaZ"];
        HEAP32[(((wheelEvent)+(88))>>2)] = e["deltaMode"];
        if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, wheelEvent, eventSize, userData);
        else
        if (getWasmTableEntry(callbackfunc)(eventTypeId, wheelEvent, userData)) e.preventDefault();
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
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(31, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  
      target = findEventTarget(target);
      if (!target) return -4;
      if (typeof target.onwheel !== 'undefined') {
        return registerWheelEventCallback(target, userData, useCapture, callbackfunc, 9, 'wheel', targetThread);
      } else {
        return -1;
      }
    
  }
  

  
  
  
  function _emscripten_set_window_title(title) {
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(32, 0, 1, title);
  return document.title = UTF8ToString(title)
  }
  

  var _emscripten_sleep = function(ms) {
    let innerFunc =  () => new Promise((resolve) => setTimeout(resolve, ms));
    return Asyncify.handleAsync(innerFunc);
  }
  ;
  _emscripten_sleep.isAsync = true;

  var _emscripten_unwind_to_js_event_loop = () => {
      throw 'unwind';
    };

  
  var webglPowerPreferences = ["default","low-power","high-performance"];
  
  
  
  
  var _emscripten_webgl_do_create_context = (target, attributes) => {
      var attr32 = ((attributes)>>2);
      var powerPreference = HEAP32[attr32 + (8>>2)];
      var contextAttributes = {
        'alpha': !!HEAP8[attributes + 0],
        'depth': !!HEAP8[attributes + 1],
        'stencil': !!HEAP8[attributes + 2],
        'antialias': !!HEAP8[attributes + 3],
        'premultipliedAlpha': !!HEAP8[attributes + 4],
        'preserveDrawingBuffer': !!HEAP8[attributes + 5],
        'powerPreference': webglPowerPreferences[powerPreference],
        'failIfMajorPerformanceCaveat': !!HEAP8[attributes + 12],
        'desynchronized': !!HEAP8[attributes + 33],
        // The following are not predefined WebGL context attributes in the WebGL specification, so the property names can be minified by Closure.
        majorVersion: HEAP32[attr32 + (16>>2)],
        minorVersion: HEAP32[attr32 + (20>>2)],
        enableExtensionsByDefault: HEAP8[attributes + 24],
        explicitSwapControl: HEAP8[attributes + 25],
        proxyContextToMainThread: HEAP32[attr32 + (28>>2)],
        renderViaOffscreenBackBuffer: HEAP8[attributes + 32]
      };
  
      var canvas = findCanvasEventTarget(target);
  
      if (!canvas) {
        return 0;
      }
  
      if (contextAttributes.explicitSwapControl) {
        return 0;
      }
  
      var contextHandle = GL.createContext(canvas, contextAttributes);
      return contextHandle;
    };
  var _emscripten_webgl_create_context = _emscripten_webgl_do_create_context;

  
  var _emscripten_webgl_do_destroy_context = (contextHandle) => {
      if (GL.currentContext == contextHandle) GL.currentContext = 0;
      GL.deleteContext(contextHandle);
    };
  var _emscripten_webgl_destroy_context = _emscripten_webgl_do_destroy_context;

  var _emscripten_webgl_make_context_current = (contextHandle) => {
      var success = GL.makeContextCurrent(contextHandle);
      return success ? 0 : -5;
    };

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  var readI53FromI64 = (ptr) => {
      return HEAPU32[((ptr)>>2)] + HEAP32[(((ptr)+(4))>>2)] * 4294967296;
    };
  
  
  
  
  
  
  var WebGPU = {
  Internals:{
  jsObjects:[],
  jsObjectInsert:(ptr, jsObject) => {
          ptr >>>= 0
          WebGPU.Internals.jsObjects[ptr] = jsObject;
        },
  bufferOnUnmaps:[],
  futures:[],
  futureInsert:(futureId, promise) => {
          WebGPU.Internals.futures[futureId] =
            new Promise((resolve) => promise.finally(() => resolve(futureId)));
        },
  },
  getJsObject:(ptr) => {
        if (!ptr) return undefined;
        ptr >>>= 0
        return WebGPU.Internals.jsObjects[ptr];
      },
  importJsAdapter:(obj, parentPtr = 0) => {
            var ptr = _emwgpuCreateAdapter(parentPtr);
            WebGPU.Internals.jsObjects[ptr] = obj;
            return ptr;
          },
  importJsBindGroup:(obj, parentPtr = 0) => {
            var ptr = _emwgpuCreateBindGroup(parentPtr);
            WebGPU.Internals.jsObjects[ptr] = obj;
            return ptr;
          },
  importJsBindGroupLayout:(obj, parentPtr = 0) => {
            var ptr = _emwgpuCreateBindGroupLayout(parentPtr);
            WebGPU.Internals.jsObjects[ptr] = obj;
            return ptr;
          },
  importJsBuffer:(buffer, parentPtr = 0) => {
        // At the moment, we do not allow importing pending buffers.
        assert(buffer.mapState === "unmapped");
        var bufferPtr = _emwgpuImportBuffer(parentPtr);
        WebGPU.Internals.jsObjectInsert(bufferPtr, buffer);
        return bufferPtr;
      },
  importJsCommandBuffer:(obj, parentPtr = 0) => {
            var ptr = _emwgpuCreateCommandBuffer(parentPtr);
            WebGPU.Internals.jsObjects[ptr] = obj;
            return ptr;
          },
  importJsCommandEncoder:(obj, parentPtr = 0) => {
            var ptr = _emwgpuCreateCommandEncoder(parentPtr);
            WebGPU.Internals.jsObjects[ptr] = obj;
            return ptr;
          },
  importJsComputePassEncoder:(obj, parentPtr = 0) => {
            var ptr = _emwgpuCreateComputePassEncoder(parentPtr);
            WebGPU.Internals.jsObjects[ptr] = obj;
            return ptr;
          },
  importJsComputePipeline:(obj, parentPtr = 0) => {
            var ptr = _emwgpuCreateComputePipeline(parentPtr);
            WebGPU.Internals.jsObjects[ptr] = obj;
            return ptr;
          },
  importJsDevice:(device, parentPtr = 0) => {
        var queuePtr = _emwgpuCreateQueue(parentPtr);
        var devicePtr = _emwgpuCreateDevice(parentPtr, queuePtr);
        WebGPU.Internals.jsObjectInsert(queuePtr, device.queue);
        WebGPU.Internals.jsObjectInsert(devicePtr, device);
        return devicePtr;
      },
  importJsExternalTexture:(obj, parentPtr = 0) => {
            var ptr = _emwgpuCreateExternalTexture(parentPtr);
            WebGPU.Internals.jsObjects[ptr] = obj;
            return ptr;
          },
  importJsPipelineLayout:(obj, parentPtr = 0) => {
            var ptr = _emwgpuCreatePipelineLayout(parentPtr);
            WebGPU.Internals.jsObjects[ptr] = obj;
            return ptr;
          },
  importJsQuerySet:(obj, parentPtr = 0) => {
            var ptr = _emwgpuCreateQuerySet(parentPtr);
            WebGPU.Internals.jsObjects[ptr] = obj;
            return ptr;
          },
  importJsQueue:(obj, parentPtr = 0) => {
            var ptr = _emwgpuCreateQueue(parentPtr);
            WebGPU.Internals.jsObjects[ptr] = obj;
            return ptr;
          },
  importJsRenderBundle:(obj, parentPtr = 0) => {
            var ptr = _emwgpuCreateRenderBundle(parentPtr);
            WebGPU.Internals.jsObjects[ptr] = obj;
            return ptr;
          },
  importJsRenderBundleEncoder:(obj, parentPtr = 0) => {
            var ptr = _emwgpuCreateRenderBundleEncoder(parentPtr);
            WebGPU.Internals.jsObjects[ptr] = obj;
            return ptr;
          },
  importJsRenderPassEncoder:(obj, parentPtr = 0) => {
            var ptr = _emwgpuCreateRenderPassEncoder(parentPtr);
            WebGPU.Internals.jsObjects[ptr] = obj;
            return ptr;
          },
  importJsRenderPipeline:(obj, parentPtr = 0) => {
            var ptr = _emwgpuCreateRenderPipeline(parentPtr);
            WebGPU.Internals.jsObjects[ptr] = obj;
            return ptr;
          },
  importJsSampler:(obj, parentPtr = 0) => {
            var ptr = _emwgpuCreateSampler(parentPtr);
            WebGPU.Internals.jsObjects[ptr] = obj;
            return ptr;
          },
  importJsShaderModule:(obj, parentPtr = 0) => {
            var ptr = _emwgpuCreateShaderModule(parentPtr);
            WebGPU.Internals.jsObjects[ptr] = obj;
            return ptr;
          },
  importJsSurface:(obj, parentPtr = 0) => {
            var ptr = _emwgpuCreateSurface(parentPtr);
            WebGPU.Internals.jsObjects[ptr] = obj;
            return ptr;
          },
  importJsTexture:(obj, parentPtr = 0) => {
            var ptr = _emwgpuCreateTexture(parentPtr);
            WebGPU.Internals.jsObjects[ptr] = obj;
            return ptr;
          },
  importJsTextureView:(obj, parentPtr = 0) => {
            var ptr = _emwgpuCreateTextureView(parentPtr);
            WebGPU.Internals.jsObjects[ptr] = obj;
            return ptr;
          },
  errorCallback:(callback, type, message, userdata) => {
        var sp = stackSave();
        var messagePtr = stringToUTF8OnStack(message);
        getWasmTableEntry(callback)(type, messagePtr, userdata);
        stackRestore(sp);
      },
  iterateExtensions:(root, handlers) => {
        
        for (var ptr = HEAPU32[((root)>>2)]; ptr;
                 ptr = HEAPU32[((ptr)>>2)]) {
          var sType = HEAP32[(((ptr)+(4))>>2)];
          // This will crash if there's no handler indicating either a bogus
          // sType, or one we haven't implemented yet.
          var handler = handlers[sType](ptr);
        }
      },
  setStringView:(ptr, data, length) => {
        HEAPU32[((ptr)>>2)] = data;
        HEAPU32[(((ptr)+(4))>>2)] = length;
      },
  makeStringFromStringView:(stringViewPtr) => {
        var ptr = HEAPU32[((stringViewPtr)>>2)];
        var length = HEAPU32[(((stringViewPtr)+(4))>>2)];
        // UTF8ToString stops at the first null terminator character in the
        // string regardless of the length.
        return UTF8ToString(ptr, length);
      },
  makeStringFromOptionalStringView:(stringViewPtr) => {
        var ptr = HEAPU32[((stringViewPtr)>>2)];
        var length = HEAPU32[(((stringViewPtr)+(4))>>2)];
        // If we don't have a valid string pointer, just return undefined when
        // optional.
        if (!ptr) {
          if (length === 0) {
            return "";
          }
          return undefined;
        }
        // UTF8ToString stops at the first null terminator character in the
        // string regardless of the length.
        return UTF8ToString(ptr, length);
      },
  makeColor:(ptr) => {
        return {
          "r": HEAPF64[((ptr)>>3)],
          "g": HEAPF64[(((ptr)+(8))>>3)],
          "b": HEAPF64[(((ptr)+(16))>>3)],
          "a": HEAPF64[(((ptr)+(24))>>3)],
        };
      },
  makeExtent3D:(ptr) => {
        return {
          "width": HEAPU32[((ptr)>>2)],
          "height": HEAPU32[(((ptr)+(4))>>2)],
          "depthOrArrayLayers": HEAPU32[(((ptr)+(8))>>2)],
        };
      },
  makeOrigin3D:(ptr) => {
        return {
          "x": HEAPU32[((ptr)>>2)],
          "y": HEAPU32[(((ptr)+(4))>>2)],
          "z": HEAPU32[(((ptr)+(8))>>2)],
        };
      },
  makeTexelCopyTextureInfo:(ptr) => {
        
        return {
          "texture": WebGPU.getJsObject(
            HEAPU32[((ptr)>>2)]),
          "mipLevel": HEAPU32[(((ptr)+(4))>>2)],
          "origin": WebGPU.makeOrigin3D(ptr + 8),
          "aspect": WebGPU.TextureAspect[HEAP32[(((ptr)+(20))>>2)]],
        };
      },
  makeTexelCopyBufferLayout:(ptr) => {
        var bytesPerRow = HEAPU32[(((ptr)+(8))>>2)];
        var rowsPerImage = HEAPU32[(((ptr)+(12))>>2)];
        return {
          "offset": readI53FromI64(ptr),
          "bytesPerRow": bytesPerRow === 4294967295 ? undefined : bytesPerRow,
          "rowsPerImage": rowsPerImage === 4294967295 ? undefined : rowsPerImage,
        };
      },
  makeTexelCopyBufferInfo:(ptr) => {
        
        var layoutPtr = ptr + 0;
        var bufferCopyView = WebGPU.makeTexelCopyBufferLayout(layoutPtr);
        bufferCopyView["buffer"] = WebGPU.getJsObject(
          HEAPU32[(((ptr)+(16))>>2)]);
        return bufferCopyView;
      },
  makePassTimestampWrites:(ptr) => {
        if (ptr === 0) return undefined;
        return {
          "querySet": WebGPU.getJsObject(
            HEAPU32[(((ptr)+(4))>>2)]),
          "beginningOfPassWriteIndex": HEAPU32[(((ptr)+(8))>>2)],
          "endOfPassWriteIndex": HEAPU32[(((ptr)+(12))>>2)],
        };
      },
  makePipelineConstants:(constantCount, constantsPtr) => {
        if (!constantCount) return;
        var constants = {};
        for (var i = 0; i < constantCount; ++i) {
          var entryPtr = constantsPtr + 24 * i;
          var key = WebGPU.makeStringFromStringView(entryPtr + 4);
          constants[key] = HEAPF64[(((entryPtr)+(16))>>3)];
        }
        return constants;
      },
  makePipelineLayout:(layoutPtr) => {
        if (!layoutPtr) return 'auto';
        return WebGPU.getJsObject(layoutPtr);
      },
  makeComputeState:(ptr) => {
        if (!ptr) return undefined;
        
        var desc = {
          "module": WebGPU.getJsObject(
            HEAPU32[(((ptr)+(4))>>2)]),
          "constants": WebGPU.makePipelineConstants(
            HEAPU32[(((ptr)+(16))>>2)],
            HEAPU32[(((ptr)+(20))>>2)]),
          "entryPoint": WebGPU.makeStringFromOptionalStringView(
            ptr + 8),
        };
        return desc;
      },
  makeComputePipelineDesc:(descriptor) => {
        
  
        var desc = {
          "label": WebGPU.makeStringFromOptionalStringView(
            descriptor + 4),
          "layout": WebGPU.makePipelineLayout(
            HEAPU32[(((descriptor)+(12))>>2)]),
          "compute": WebGPU.makeComputeState(
            descriptor + 16),
        };
        return desc;
      },
  makeRenderPipelineDesc:(descriptor) => {
        
  
        function makePrimitiveState(psPtr) {
          if (!psPtr) return undefined;
          
          return {
            "topology": WebGPU.PrimitiveTopology[HEAP32[(((psPtr)+(4))>>2)]],
            "stripIndexFormat": WebGPU.IndexFormat[HEAP32[(((psPtr)+(8))>>2)]],
            "frontFace": WebGPU.FrontFace[HEAP32[(((psPtr)+(12))>>2)]],
            "cullMode": WebGPU.CullMode[HEAP32[(((psPtr)+(16))>>2)]],
            "unclippedDepth": !!(HEAPU32[(((psPtr)+(20))>>2)]),
          };
        }
  
        function makeBlendComponent(bdPtr) {
          if (!bdPtr) return undefined;
          return {
            "operation": WebGPU.BlendOperation[HEAP32[((bdPtr)>>2)]],
            "srcFactor": WebGPU.BlendFactor[HEAP32[(((bdPtr)+(4))>>2)]],
            "dstFactor": WebGPU.BlendFactor[HEAP32[(((bdPtr)+(8))>>2)]],
          };
        }
  
        function makeBlendState(bsPtr) {
          if (!bsPtr) return undefined;
          return {
            "alpha": makeBlendComponent(bsPtr + 12),
            "color": makeBlendComponent(bsPtr + 0),
          };
        }
  
        function makeColorState(csPtr) {
          
          var format = WebGPU.TextureFormat[HEAP32[(((csPtr)+(4))>>2)]];
          return format ? {
            "format": format,
            "blend": makeBlendState(HEAPU32[(((csPtr)+(8))>>2)]),
            "writeMask": HEAPU32[(((csPtr)+(16))>>2)],
          } : undefined;
        }
  
        function makeColorStates(count, csArrayPtr) {
          var states = [];
          for (var i = 0; i < count; ++i) {
            states.push(makeColorState(csArrayPtr + 24 * i));
          }
          return states;
        }
  
        function makeStencilStateFace(ssfPtr) {
          
          return {
            "compare": WebGPU.CompareFunction[HEAP32[((ssfPtr)>>2)]],
            "failOp": WebGPU.StencilOperation[HEAP32[(((ssfPtr)+(4))>>2)]],
            "depthFailOp": WebGPU.StencilOperation[HEAP32[(((ssfPtr)+(8))>>2)]],
            "passOp": WebGPU.StencilOperation[HEAP32[(((ssfPtr)+(12))>>2)]],
          };
        }
  
        function makeDepthStencilState(dssPtr) {
          if (!dssPtr) return undefined;
  
          
          return {
            "format": WebGPU.TextureFormat[HEAP32[(((dssPtr)+(4))>>2)]],
            "depthWriteEnabled": !!(HEAPU32[(((dssPtr)+(8))>>2)]),
            "depthCompare": WebGPU.CompareFunction[HEAP32[(((dssPtr)+(12))>>2)]],
            "stencilFront": makeStencilStateFace(dssPtr + 16),
            "stencilBack": makeStencilStateFace(dssPtr + 32),
            "stencilReadMask": HEAPU32[(((dssPtr)+(48))>>2)],
            "stencilWriteMask": HEAPU32[(((dssPtr)+(52))>>2)],
            "depthBias": HEAP32[(((dssPtr)+(56))>>2)],
            "depthBiasSlopeScale": HEAPF32[(((dssPtr)+(60))>>2)],
            "depthBiasClamp": HEAPF32[(((dssPtr)+(64))>>2)],
          };
        }
  
        function makeVertexAttribute(vaPtr) {
          
          return {
            "format": WebGPU.VertexFormat[HEAP32[(((vaPtr)+(4))>>2)]],
            "offset": readI53FromI64((vaPtr)+(8)),
            "shaderLocation": HEAPU32[(((vaPtr)+(16))>>2)],
          };
        }
  
        function makeVertexAttributes(count, vaArrayPtr) {
          var vas = [];
          for (var i = 0; i < count; ++i) {
            vas.push(makeVertexAttribute(vaArrayPtr + i * 24));
          }
          return vas;
        }
  
        function makeVertexBuffer(vbPtr) {
          if (!vbPtr) return undefined;
          var stepMode = WebGPU.VertexStepMode[HEAP32[(((vbPtr)+(4))>>2)]];
          var attributeCount = HEAPU32[(((vbPtr)+(16))>>2)];
          if (!stepMode && !attributeCount) {
            return null;
          }
          return {
            "arrayStride": readI53FromI64((vbPtr)+(8)),
            "stepMode": stepMode,
            "attributes": makeVertexAttributes(
              attributeCount,
              HEAPU32[(((vbPtr)+(20))>>2)]),
          };
        }
  
        function makeVertexBuffers(count, vbArrayPtr) {
          if (!count) return undefined;
  
          var vbs = [];
          for (var i = 0; i < count; ++i) {
            vbs.push(makeVertexBuffer(vbArrayPtr + i * 24));
          }
          return vbs;
        }
  
        function makeVertexState(viPtr) {
          if (!viPtr) return undefined;
          
          var desc = {
            "module": WebGPU.getJsObject(
              HEAPU32[(((viPtr)+(4))>>2)]),
            "constants": WebGPU.makePipelineConstants(
              HEAPU32[(((viPtr)+(16))>>2)],
              HEAPU32[(((viPtr)+(20))>>2)]),
            "buffers": makeVertexBuffers(
              HEAPU32[(((viPtr)+(24))>>2)],
              HEAPU32[(((viPtr)+(28))>>2)]),
            "entryPoint": WebGPU.makeStringFromOptionalStringView(
              viPtr + 8),
            };
          return desc;
        }
  
        function makeMultisampleState(msPtr) {
          if (!msPtr) return undefined;
          
          return {
            "count": HEAPU32[(((msPtr)+(4))>>2)],
            "mask": HEAPU32[(((msPtr)+(8))>>2)],
            "alphaToCoverageEnabled": !!(HEAPU32[(((msPtr)+(12))>>2)]),
          };
        }
  
        function makeFragmentState(fsPtr) {
          if (!fsPtr) return undefined;
          
          var desc = {
            "module": WebGPU.getJsObject(
              HEAPU32[(((fsPtr)+(4))>>2)]),
            "constants": WebGPU.makePipelineConstants(
              HEAPU32[(((fsPtr)+(16))>>2)],
              HEAPU32[(((fsPtr)+(20))>>2)]),
            "targets": makeColorStates(
              HEAPU32[(((fsPtr)+(24))>>2)],
              HEAPU32[(((fsPtr)+(28))>>2)]),
            "entryPoint": WebGPU.makeStringFromOptionalStringView(
              fsPtr + 8),
            };
          return desc;
        }
  
        var desc = {
          "label": WebGPU.makeStringFromOptionalStringView(
            descriptor + 4),
          "layout": WebGPU.makePipelineLayout(
            HEAPU32[(((descriptor)+(12))>>2)]),
          "vertex": makeVertexState(
            descriptor + 16),
          "primitive": makePrimitiveState(
            descriptor + 48),
          "depthStencil": makeDepthStencilState(
            HEAPU32[(((descriptor)+(72))>>2)]),
          "multisample": makeMultisampleState(
            descriptor + 76),
          "fragment": makeFragmentState(
            HEAPU32[(((descriptor)+(92))>>2)]),
        };
        return desc;
      },
  fillLimitStruct:(limits, limitsOutPtr) => {
        
        var nextInChainPtr = HEAPU32[((limitsOutPtr)>>2)];
  
        function setLimitValueU32(name, basePtr, limitOffset, fallbackValue = 0) {
          var limitValue = limits[name] ?? fallbackValue;
          HEAPU32[(((basePtr)+(limitOffset))>>2)] = limitValue;
        }
        function setLimitValueU64(name, basePtr, limitOffset, fallbackValue = 0) {
          var limitValue = limits[name] ?? fallbackValue;
          // Limits are integer-valued JS `Number`s, so they fit in 'i53'.
          writeI53ToI64((basePtr)+(limitOffset), limitValue);
        }
  
        setLimitValueU32('maxTextureDimension1D',                     limitsOutPtr, 4);
        setLimitValueU32('maxTextureDimension2D',                     limitsOutPtr, 8);
        setLimitValueU32('maxTextureDimension3D',                     limitsOutPtr, 12);
        setLimitValueU32('maxTextureArrayLayers',                     limitsOutPtr, 16);
        setLimitValueU32('maxBindGroups',                             limitsOutPtr, 20);
        setLimitValueU32('maxBindGroupsPlusVertexBuffers',            limitsOutPtr, 24);
        setLimitValueU32('maxBindingsPerBindGroup',                   limitsOutPtr, 28);
        setLimitValueU32('maxDynamicUniformBuffersPerPipelineLayout', limitsOutPtr, 32);
        setLimitValueU32('maxDynamicStorageBuffersPerPipelineLayout', limitsOutPtr, 36);
        setLimitValueU32('maxSampledTexturesPerShaderStage',          limitsOutPtr, 40);
        setLimitValueU32('maxSamplersPerShaderStage',                 limitsOutPtr, 44);
        setLimitValueU32('maxStorageBuffersPerShaderStage',           limitsOutPtr, 48);
        setLimitValueU32('maxStorageTexturesPerShaderStage',          limitsOutPtr, 52);
        setLimitValueU32('maxUniformBuffersPerShaderStage',           limitsOutPtr, 56);
        setLimitValueU32('minUniformBufferOffsetAlignment',           limitsOutPtr, 80);
        setLimitValueU32('minStorageBufferOffsetAlignment',           limitsOutPtr, 84);
        setLimitValueU64('maxUniformBufferBindingSize',               limitsOutPtr, 64);
        setLimitValueU64('maxStorageBufferBindingSize',               limitsOutPtr, 72);
        setLimitValueU32('maxVertexBuffers',                          limitsOutPtr, 88);
        setLimitValueU64('maxBufferSize',                             limitsOutPtr, 96);
        setLimitValueU32('maxVertexAttributes',                       limitsOutPtr, 104);
        setLimitValueU32('maxVertexBufferArrayStride',                limitsOutPtr, 108);
        setLimitValueU32('maxInterStageShaderVariables',              limitsOutPtr, 112);
        setLimitValueU32('maxColorAttachments',                       limitsOutPtr, 116);
        setLimitValueU32('maxColorAttachmentBytesPerSample',          limitsOutPtr, 120);
        setLimitValueU32('maxComputeWorkgroupStorageSize',            limitsOutPtr, 124);
        setLimitValueU32('maxComputeInvocationsPerWorkgroup',         limitsOutPtr, 128);
        setLimitValueU32('maxComputeWorkgroupSizeX',                  limitsOutPtr, 132);
        setLimitValueU32('maxComputeWorkgroupSizeY',                  limitsOutPtr, 136);
        setLimitValueU32('maxComputeWorkgroupSizeZ',                  limitsOutPtr, 140);
        setLimitValueU32('maxComputeWorkgroupsPerDimension',          limitsOutPtr, 144);
        // Note this limit is new and won't be present in all browsers for a while. Fall back to 0.
        setLimitValueU32('maxImmediateSize',                          limitsOutPtr, 148);
  
        if (nextInChainPtr !== 0) {
          var sType = HEAP32[(((nextInChainPtr)+(4))>>2)];
          var compatibilityModeLimitsPtr = nextInChainPtr;
          
  
          // Note these limits are new and won't be present in all browsers for a while. Fall back to exposing the PerShaderStage limit.
          setLimitValueU32('maxStorageBuffersInVertexStage',    compatibilityModeLimitsPtr, 8,    limits.maxStorageBuffersPerShaderStage);
          setLimitValueU32('maxStorageBuffersInFragmentStage',  compatibilityModeLimitsPtr, 16,  limits.maxStorageBuffersPerShaderStage);
          setLimitValueU32('maxStorageTexturesInVertexStage',   compatibilityModeLimitsPtr, 12,   limits.maxStorageTexturesPerShaderStage);
          setLimitValueU32('maxStorageTexturesInFragmentStage', compatibilityModeLimitsPtr, 20, limits.maxStorageTexturesPerShaderStage);
        }
      },
  fillAdapterInfoStruct:(info, infoStruct) => {
        
  
        // Populate subgroup limits.
        HEAPU32[(((infoStruct)+(52))>>2)] = info.subgroupMinSize;
        HEAPU32[(((infoStruct)+(56))>>2)] = info.subgroupMaxSize;
  
        // Append all the strings together to condense into a single malloc.
        var strs = info.vendor + info.architecture + info.device + info.description;
        var strPtr = stringToNewUTF8(strs);
  
        var vendorLen = lengthBytesUTF8(info.vendor);
        WebGPU.setStringView(infoStruct + 4, strPtr, vendorLen);
        strPtr += vendorLen;
  
        var architectureLen = lengthBytesUTF8(info.architecture);
        WebGPU.setStringView(infoStruct + 12, strPtr, architectureLen);
        strPtr += architectureLen;
  
        var deviceLen = lengthBytesUTF8(info.device);
        WebGPU.setStringView(infoStruct + 20, strPtr, deviceLen);
        strPtr += deviceLen;
  
        var descriptionLen = lengthBytesUTF8(info.description);
        WebGPU.setStringView(infoStruct + 28, strPtr, descriptionLen);
        strPtr += descriptionLen;
  
        HEAP32[(((infoStruct)+(36))>>2)] = 2;
        var adapterType = info.isFallbackAdapter ? 3 : 4;
        HEAP32[(((infoStruct)+(40))>>2)] = adapterType;
        HEAPU32[(((infoStruct)+(44))>>2)] = 0;
        HEAPU32[(((infoStruct)+(48))>>2)] = 0;
      },
  AddressMode:[,"clamp-to-edge","repeat","mirror-repeat"],
  BlendFactor:[,"zero","one","src","one-minus-src","src-alpha","one-minus-src-alpha","dst","one-minus-dst","dst-alpha","one-minus-dst-alpha","src-alpha-saturated","constant","one-minus-constant","src1","one-minus-src1","src1-alpha","one-minus-src1-alpha"],
  BlendOperation:[,"add","subtract","reverse-subtract","min","max"],
  BufferBindingType:[,,"uniform","storage","read-only-storage"],
  BufferMapState:[,"unmapped","pending","mapped"],
  CompareFunction:[,"never","less","equal","less-equal","greater","not-equal","greater-equal","always"],
  CompilationInfoRequestStatus:[,"success","callback-cancelled"],
  ComponentSwizzle:[,"0","1","r","g","b","a"],
  CompositeAlphaMode:[,"opaque","premultiplied","unpremultiplied","inherit"],
  CullMode:[,"none","front","back"],
  ErrorFilter:[,"validation","out-of-memory","internal"],
  FeatureLevel:[,"compatibility","core"],
  FeatureName:{
  1:"core-features-and-limits",
  2:"depth-clip-control",
  3:"depth32float-stencil8",
  4:"texture-compression-bc",
  5:"texture-compression-bc-sliced-3d",
  6:"texture-compression-etc2",
  7:"texture-compression-astc",
  8:"texture-compression-astc-sliced-3d",
  9:"timestamp-query",
  10:"indirect-first-instance",
  11:"shader-f16",
  12:"rg11b10ufloat-renderable",
  13:"bgra8unorm-storage",
  14:"float32-filterable",
  15:"float32-blendable",
  16:"clip-distances",
  17:"dual-source-blending",
  18:"subgroups",
  19:"texture-formats-tier1",
  20:"texture-formats-tier2",
  21:"primitive-index",
  22:"texture-component-swizzle",
  327692:"chromium-experimental-unorm16-texture-formats",
  327729:"chromium-experimental-multi-draw-indirect",
  },
  FilterMode:[,"nearest","linear"],
  FrontFace:[,"ccw","cw"],
  IndexFormat:[,"uint16","uint32"],
  InstanceFeatureName:[,"timed-wait-any","shader-source-spirv","multiple-devices-per-adapter"],
  LoadOp:[,"load","clear"],
  MipmapFilterMode:[,"nearest","linear"],
  OptionalBool:["false","true",],
  PowerPreference:[,"low-power","high-performance"],
  PredefinedColorSpace:[,"srgb","display-p3"],
  PrimitiveTopology:[,"point-list","line-list","line-strip","triangle-list","triangle-strip"],
  QueryType:[,"occlusion","timestamp"],
  SamplerBindingType:[,,"filtering","non-filtering","comparison"],
  Status:[,"success","error"],
  StencilOperation:[,"keep","zero","replace","invert","increment-clamp","decrement-clamp","increment-wrap","decrement-wrap"],
  StorageTextureAccess:[,,"write-only","read-only","read-write"],
  StoreOp:[,"store","discard"],
  SurfaceGetCurrentTextureStatus:[,"success-optimal","success-suboptimal","timeout","outdated","lost","error"],
  TextureAspect:[,"all","stencil-only","depth-only"],
  TextureDimension:[,"1d","2d","3d"],
  TextureFormat:[,"r8unorm","r8snorm","r8uint","r8sint","r16unorm","r16snorm","r16uint","r16sint","r16float","rg8unorm","rg8snorm","rg8uint","rg8sint","r32float","r32uint","r32sint","rg16unorm","rg16snorm","rg16uint","rg16sint","rg16float","rgba8unorm","rgba8unorm-srgb","rgba8snorm","rgba8uint","rgba8sint","bgra8unorm","bgra8unorm-srgb","rgb10a2uint","rgb10a2unorm","rg11b10ufloat","rgb9e5ufloat","rg32float","rg32uint","rg32sint","rgba16unorm","rgba16snorm","rgba16uint","rgba16sint","rgba16float","rgba32float","rgba32uint","rgba32sint","stencil8","depth16unorm","depth24plus","depth24plus-stencil8","depth32float","depth32float-stencil8","bc1-rgba-unorm","bc1-rgba-unorm-srgb","bc2-rgba-unorm","bc2-rgba-unorm-srgb","bc3-rgba-unorm","bc3-rgba-unorm-srgb","bc4-r-unorm","bc4-r-snorm","bc5-rg-unorm","bc5-rg-snorm","bc6h-rgb-ufloat","bc6h-rgb-float","bc7-rgba-unorm","bc7-rgba-unorm-srgb","etc2-rgb8unorm","etc2-rgb8unorm-srgb","etc2-rgb8a1unorm","etc2-rgb8a1unorm-srgb","etc2-rgba8unorm","etc2-rgba8unorm-srgb","eac-r11unorm","eac-r11snorm","eac-rg11unorm","eac-rg11snorm","astc-4x4-unorm","astc-4x4-unorm-srgb","astc-5x4-unorm","astc-5x4-unorm-srgb","astc-5x5-unorm","astc-5x5-unorm-srgb","astc-6x5-unorm","astc-6x5-unorm-srgb","astc-6x6-unorm","astc-6x6-unorm-srgb","astc-8x5-unorm","astc-8x5-unorm-srgb","astc-8x6-unorm","astc-8x6-unorm-srgb","astc-8x8-unorm","astc-8x8-unorm-srgb","astc-10x5-unorm","astc-10x5-unorm-srgb","astc-10x6-unorm","astc-10x6-unorm-srgb","astc-10x8-unorm","astc-10x8-unorm-srgb","astc-10x10-unorm","astc-10x10-unorm-srgb","astc-12x10-unorm","astc-12x10-unorm-srgb","astc-12x12-unorm","astc-12x12-unorm-srgb"],
  TextureSampleType:[,,"float","unfilterable-float","depth","sint","uint"],
  TextureViewDimension:[,"1d","2d","2d-array","cube","cube-array","3d"],
  ToneMappingMode:[,"standard","extended"],
  VertexFormat:[,"uint8","uint8x2","uint8x4","sint8","sint8x2","sint8x4","unorm8","unorm8x2","unorm8x4","snorm8","snorm8x2","snorm8x4","uint16","uint16x2","uint16x4","sint16","sint16x2","sint16x4","unorm16","unorm16x2","unorm16x4","snorm16","snorm16x2","snorm16x4","float16","float16x2","float16x4","float32","float32x2","float32x3","float32x4","uint32","uint32x2","uint32x3","uint32x4","sint32","sint32x2","sint32x3","sint32x4","unorm10-10-10-2","unorm8x4-bgra"],
  VertexStepMode:[,"vertex","instance"],
  WGSLLanguageFeatureName:[,"readonly_and_readwrite_storage_textures","packed_4x8_integer_dot_product","unrestricted_pointer_parameters","pointer_composite_access","uniform_buffer_standard_layout","subgroup_id","texture_and_sampler_let","subgroup_uniformity","texture_formats_tier1","linear_indexing"],
  };
  
  var emwgpuStringToInt_DeviceLostReason = {
              'undefined': 1,  // For older browsers
              'unknown': 1,
              'destroyed': 2,
          };
  
  
  
  
  
  
  
  
  function _emwgpuAdapterRequestDevice(adapterPtr, futureId, deviceLostFutureId, devicePtr, queuePtr, descriptor) {
    futureId = bigintToI53Checked(futureId);
    deviceLostFutureId = bigintToI53Checked(deviceLostFutureId);
  
  
      var adapter = WebGPU.getJsObject(adapterPtr);
  
      var desc = {};
      if (descriptor) {
        
        var requiredFeatureCount = HEAPU32[(((descriptor)+(12))>>2)];
        if (requiredFeatureCount) {
          var requiredFeaturesPtr = HEAPU32[(((descriptor)+(16))>>2)];
          // requiredFeaturesPtr is a pointer to an array of FeatureName which is an enum of size uint32_t
          desc["requiredFeatures"] = Array.from(HEAPU32.subarray((((requiredFeaturesPtr)>>2)), ((requiredFeaturesPtr + requiredFeatureCount * 4)>>2)),
            (feature) => WebGPU.FeatureName[feature]);
        }
        var limitsPtr = HEAPU32[(((descriptor)+(20))>>2)];
        if (limitsPtr) {
          
          var nextInChainPtr = HEAPU32[((limitsPtr)>>2)];
          var requiredLimits = {};
          function setLimitU32IfDefined(name, basePtr, limitOffset, ignoreIfZero = false) {
            var ptr = basePtr + limitOffset;
            var value = HEAPU32[((ptr)>>2)];
            if (value != 4294967295 && (!ignoreIfZero || value != 0)) {
              requiredLimits[name] = value;
            }
          }
          function setLimitU64IfDefined(name, basePtr, limitOffset) {
            var ptr = basePtr + limitOffset;
            // Handle WGPU_LIMIT_U64_UNDEFINED.
            var limitPart1 = HEAPU32[((ptr)>>2)];
            var limitPart2 = HEAPU32[(((ptr)+(4))>>2)];
            if (limitPart1 != 0xFFFFFFFF || limitPart2 != 0xFFFFFFFF) {
              requiredLimits[name] = readI53FromI64(ptr);
            }
          }
  
          setLimitU32IfDefined("maxTextureDimension1D",                     limitsPtr, 4);
          setLimitU32IfDefined("maxTextureDimension2D",                     limitsPtr, 8);
          setLimitU32IfDefined("maxTextureDimension3D",                     limitsPtr, 12);
          setLimitU32IfDefined("maxTextureArrayLayers",                     limitsPtr, 16);
          setLimitU32IfDefined("maxBindGroups",                             limitsPtr, 20);
          setLimitU32IfDefined('maxBindGroupsPlusVertexBuffers',            limitsPtr, 24);
          setLimitU32IfDefined('maxBindingsPerBindGroup',                   limitsPtr, 28);
          setLimitU32IfDefined("maxDynamicUniformBuffersPerPipelineLayout", limitsPtr, 32);
          setLimitU32IfDefined("maxDynamicStorageBuffersPerPipelineLayout", limitsPtr, 36);
          setLimitU32IfDefined("maxSampledTexturesPerShaderStage",          limitsPtr, 40);
          setLimitU32IfDefined("maxSamplersPerShaderStage",                 limitsPtr, 44);
          setLimitU32IfDefined("maxStorageBuffersPerShaderStage",           limitsPtr, 48);
          setLimitU32IfDefined("maxStorageTexturesPerShaderStage",          limitsPtr, 52);
          setLimitU32IfDefined("maxUniformBuffersPerShaderStage",           limitsPtr, 56);
          setLimitU32IfDefined("minUniformBufferOffsetAlignment",           limitsPtr, 80);
          setLimitU32IfDefined("minStorageBufferOffsetAlignment",           limitsPtr, 84);
          setLimitU64IfDefined("maxUniformBufferBindingSize",               limitsPtr, 64);
          setLimitU64IfDefined("maxStorageBufferBindingSize",               limitsPtr, 72);
          setLimitU32IfDefined("maxVertexBuffers",                          limitsPtr, 88);
          setLimitU64IfDefined("maxBufferSize",                             limitsPtr, 96);
          setLimitU32IfDefined("maxVertexAttributes",                       limitsPtr, 104);
          setLimitU32IfDefined("maxVertexBufferArrayStride",                limitsPtr, 108);
          setLimitU32IfDefined("maxInterStageShaderVariables",              limitsPtr, 112);
          setLimitU32IfDefined("maxColorAttachments",                       limitsPtr, 116);
          setLimitU32IfDefined("maxColorAttachmentBytesPerSample",          limitsPtr, 120);
          setLimitU32IfDefined("maxComputeWorkgroupStorageSize",            limitsPtr, 124);
          setLimitU32IfDefined("maxComputeInvocationsPerWorkgroup",         limitsPtr, 128);
          setLimitU32IfDefined("maxComputeWorkgroupSizeX",                  limitsPtr, 132);
          setLimitU32IfDefined("maxComputeWorkgroupSizeY",                  limitsPtr, 136);
          setLimitU32IfDefined("maxComputeWorkgroupSizeZ",                  limitsPtr, 140);
          setLimitU32IfDefined("maxComputeWorkgroupsPerDimension",          limitsPtr, 144);
          // Not present in all browsers. If the app requested 0, avoid passing it through so it won't cause an error.
          setLimitU32IfDefined("maxImmediateSize",                          limitsPtr, 148, true);
  
          if (nextInChainPtr !== 0) {
            var sType = HEAP32[(((nextInChainPtr)+(4))>>2)];
            var compatibilityModeLimitsPtr = nextInChainPtr;
            
            // If not present in the browser, don't request these, otherwise they'll cause an error.
            // (Technically, if any of these is higher than the PerShaderStage equivalent, we should
            // raise the PerShaderStage limit instead, but that's complex and apps should be able to
            // deal with that themselves.)
            if ('maxStorageBuffersInVertexStage' in GPUSupportedLimits.prototype) {
              setLimitU32IfDefined('maxStorageBuffersInVertexStage',    compatibilityModeLimitsPtr, 8);
              setLimitU32IfDefined('maxStorageTexturesInVertexStage',   compatibilityModeLimitsPtr, 12);
              setLimitU32IfDefined('maxStorageBuffersInFragmentStage',  compatibilityModeLimitsPtr, 16);
              setLimitU32IfDefined('maxStorageTexturesInFragmentStage', compatibilityModeLimitsPtr, 20);
            }
          }
  
          desc["requiredLimits"] = requiredLimits;
        }
  
        var defaultQueuePtr = HEAPU32[(((descriptor)+(24))>>2)];
        if (defaultQueuePtr) {
          var defaultQueueDesc = {
            "label": WebGPU.makeStringFromOptionalStringView(
              defaultQueuePtr + 4),
          };
          desc["defaultQueue"] = defaultQueueDesc;
        }
        desc["label"] = WebGPU.makeStringFromOptionalStringView(
          descriptor + 4
        );
      }
  
      runtimeKeepalivePush(); // requestDevice
      WebGPU.Internals.futureInsert(futureId, adapter.requestDevice(desc).then((device) => {
        runtimeKeepalivePop(); // requestDevice fulfilled
        callUserCallback(() => {
          WebGPU.Internals.jsObjectInsert(queuePtr, device.queue);
          WebGPU.Internals.jsObjectInsert(devicePtr, device);
  
          
  
          // Set up device lost promise resolution.
          // Don't keepalive here, because this isn't guaranteed to ever happen.
          WebGPU.Internals.futureInsert(deviceLostFutureId, device.lost.then((info) => {
            // If the runtime has exited, avoid calling callUserCallback as it
            // will print an error (e.g. if the device got freed during shutdown).
            callUserCallback(() => {
              // Unset the uncaptured error handler.
              device.onuncapturederror = (ev) => {};
              var sp = stackSave();
              var messagePtr = stringToUTF8OnStack(info.message);
              _emwgpuOnDeviceLostCompleted(deviceLostFutureId, emwgpuStringToInt_DeviceLostReason[info.reason],
                messagePtr);
              stackRestore(sp);
            });
          }));
  
          // Set up uncaptured error handlers.
          device.onuncapturederror = (ev) => {
              var type = 5;
              if (ev.error instanceof GPUValidationError) type = 2;
              else if (ev.error instanceof GPUOutOfMemoryError) type = 3;
              else if (ev.error instanceof GPUInternalError) type = 4;
              var sp = stackSave();
              var messagePtr = stringToUTF8OnStack(ev.error.message);
              _emwgpuOnUncapturedError(devicePtr, type, messagePtr);
              stackRestore(sp);
          };
  
          _emwgpuOnRequestDeviceCompleted(futureId, 1,
            devicePtr, 0);
        });
      }, (ex) => {
        runtimeKeepalivePop(); // requestDevice rejected
        callUserCallback(() => {
          var sp = stackSave();
          var messagePtr = stringToUTF8OnStack(ex.message);
          _emwgpuOnRequestDeviceCompleted(futureId, 3,
            devicePtr, messagePtr);
          if (deviceLostFutureId) {
            _emwgpuOnDeviceLostCompleted(deviceLostFutureId, 4,
              messagePtr);
          }
          stackRestore(sp);
        });
      }));
    ;
  }

  
  var _emwgpuBufferDestroy = (bufferPtr) => {
      var buffer = WebGPU.getJsObject(bufferPtr);
      var onUnmap = WebGPU.Internals.bufferOnUnmaps[bufferPtr];
      if (onUnmap) {
        for (var i = 0; i < onUnmap.length; ++i) {
          onUnmap[i]();
        }
        delete WebGPU.Internals.bufferOnUnmaps[bufferPtr];
      }
  
      buffer.destroy();
    };

  var warnOnce = (text) => {
      warnOnce.shown ||= {};
      if (!warnOnce.shown[text]) {
        warnOnce.shown[text] = 1;
        err(text);
      }
    };
  
  
  
  
  
  var _emwgpuBufferGetConstMappedRange = (bufferPtr, offset, size) => {
      var buffer = WebGPU.getJsObject(bufferPtr);
  
      if (size == -1) size = undefined;
  
      var mapped;
      try {
        mapped = buffer.getMappedRange(offset, size);
      } catch (ex) {
        return 0;
      }
      var data = _memalign(16, mapped.byteLength);
      HEAPU8.set(new Uint8Array(mapped), data);
      WebGPU.Internals.bufferOnUnmaps[bufferPtr].push(() => _free(data));
      return data;
    };

  
  
  
  
  
  var _emwgpuBufferGetMappedRange = (bufferPtr, offset, size) => {
      var buffer = WebGPU.getJsObject(bufferPtr);
  
      if (size == -1) size = undefined;
  
      var mapped;
      try {
        mapped = buffer.getMappedRange(offset, size);
      } catch (ex) {
        return 0;
      }
  
      var data = _memalign(16, mapped.byteLength);
      HEAPU8.fill(0, data, mapped.byteLength);
      WebGPU.Internals.bufferOnUnmaps[bufferPtr].push(() => {
        new Uint8Array(mapped).set(HEAPU8.subarray(data, data + mapped.byteLength));
        _free(data);
      });
      return data;
    };

  
  
  
  
  
  
  var _emwgpuBufferMapAsync = function(bufferPtr, futureId, mode, offset, size) {
    futureId = bigintToI53Checked(futureId);
    mode = bigintToI53Checked(mode);
  
  
      var buffer = WebGPU.getJsObject(bufferPtr);
      WebGPU.Internals.bufferOnUnmaps[bufferPtr] = [];
  
      if (size == -1) size = undefined;
  
      runtimeKeepalivePush(); // mapAsync
      WebGPU.Internals.futureInsert(futureId, buffer.mapAsync(mode, offset, size).then(() => {
        runtimeKeepalivePop(); // mapAsync fulfilled
        callUserCallback(() => {
          _emwgpuOnMapAsyncCompleted(futureId, 1,
            0);
        });
      }, (ex) => {
        runtimeKeepalivePop(); // mapAsync rejected
        callUserCallback(() => {
          var sp = stackSave();
          var messagePtr = stringToUTF8OnStack(ex.message);
          var status =
            ex.name === 'AbortError' ? 4 :
            ex.name === 'OperationError' ? 3 :
            0;
          
          _emwgpuOnMapAsyncCompleted(futureId, status, messagePtr);
          delete WebGPU.Internals.bufferOnUnmaps[bufferPtr];
        });
      }));
    ;
  };

  
  var _emwgpuBufferUnmap = (bufferPtr) => {
      var buffer = WebGPU.getJsObject(bufferPtr);
  
      var onUnmap = WebGPU.Internals.bufferOnUnmaps[bufferPtr];
      if (!onUnmap) {
        // Already unmapped
        return;
      }
  
      for (var i = 0; i < onUnmap.length; ++i) {
        onUnmap[i]();
      }
      delete WebGPU.Internals.bufferOnUnmaps[bufferPtr]
  
      buffer.unmap();
    };

  
  var _emwgpuDelete = (ptr) => {
      delete WebGPU.Internals.jsObjects[ptr];
    };

  
  
  var _emwgpuDeviceCreateBuffer = (devicePtr, descriptor, bufferPtr) => {
      
  
      var mappedAtCreation = !!(HEAPU32[(((descriptor)+(32))>>2)]);
  
      var desc = {
        "label": WebGPU.makeStringFromOptionalStringView(
          descriptor + 4),
        "usage": HEAPU32[(((descriptor)+(16))>>2)],
        "size": readI53FromI64((descriptor)+(24)),
        "mappedAtCreation": mappedAtCreation,
      };
  
      var device = WebGPU.getJsObject(devicePtr);
      var buffer;
      try {
        buffer = device.createBuffer(desc);
      } catch (ex) {
        // The only exception should be RangeError if mapping at creation ran out of memory.
        
        
        return false;
      }
      WebGPU.Internals.jsObjectInsert(bufferPtr, buffer);
      if (mappedAtCreation) {
        WebGPU.Internals.bufferOnUnmaps[bufferPtr] = [];
      }
      return true;
    };

  
  
  
  
  
  
  var _emwgpuDeviceCreateRenderPipelineAsync = function(devicePtr, futureId, descriptor, pipelinePtr) {
    futureId = bigintToI53Checked(futureId);
  
  
      var desc = WebGPU.makeRenderPipelineDesc(descriptor);
      var device = WebGPU.getJsObject(devicePtr);
      runtimeKeepalivePush(); // createRenderPipelineAsync
      WebGPU.Internals.futureInsert(futureId, device.createRenderPipelineAsync(desc).then((pipeline) => {
        runtimeKeepalivePop(); // createRenderPipelineAsync fulfilled
        callUserCallback(() => {
          WebGPU.Internals.jsObjectInsert(pipelinePtr, pipeline);
          _emwgpuOnCreateRenderPipelineCompleted(futureId, 1,
            pipelinePtr, 0);
        });
      }, (pipelineError) => {
        runtimeKeepalivePop(); // createRenderPipelineAsync rejected
        callUserCallback(() => {
          var sp = stackSave();
          var messagePtr = stringToUTF8OnStack(pipelineError.message);
          var status =
            pipelineError.reason === 'validation' ? 3 :
            pipelineError.reason === 'internal' ? 4 :
            0;
          
          _emwgpuOnCreateRenderPipelineCompleted(futureId, status,
            pipelinePtr, messagePtr);
          stackRestore(sp);
        });
      }));
    ;
  };

  
  
  
  var _emwgpuDeviceCreateShaderModule = (devicePtr, descriptor, shaderModulePtr) => {
      
      var nextInChainPtr = HEAPU32[((descriptor)>>2)];
      var sType = HEAP32[(((nextInChainPtr)+(4))>>2)];
  
      var desc = {
        "label": WebGPU.makeStringFromOptionalStringView(
          descriptor + 4),
        "code": "",
      };
  
      switch (sType) {
        case 2: {
          desc["code"] = WebGPU.makeStringFromStringView(
            nextInChainPtr + 8
          );
          break;
        }
      }
  
      var device = WebGPU.getJsObject(devicePtr);
      WebGPU.Internals.jsObjectInsert(shaderModulePtr, device.createShaderModule(desc));
    };

  
  var _emwgpuDeviceDestroy = (devicePtr) => {
      const device = WebGPU.getJsObject(devicePtr);
      // Remove the onuncapturederror handler which holds a pointer to the WGPUDevice.
      device.onuncapturederror = null;
      device.destroy()
    };

  
  var emwgpuStringToInt_PreferredFormat = {
              'rgba8unorm': 22,
              'bgra8unorm': 27,
          };
  
  
  var _emwgpuGetPreferredFormat = () => {
      var format = navigator.gpu.getPreferredCanvasFormat();
      return emwgpuStringToInt_PreferredFormat[format];
    };

  
  
  
  
  
  
  
  
  function _emwgpuInstanceRequestAdapter(instancePtr, futureId, options, adapterPtr) {
    futureId = bigintToI53Checked(futureId);
  
  
      var opts;
      if (options) {
        
        opts = {
          "featureLevel": WebGPU.FeatureLevel[HEAP32[(((options)+(4))>>2)]],
          "powerPreference": WebGPU.PowerPreference[HEAP32[(((options)+(8))>>2)]],
          "forceFallbackAdapter":
            !!(HEAPU32[(((options)+(12))>>2)]),
        };
  
        var nextInChainPtr = HEAPU32[((options)>>2)];
        if (nextInChainPtr !== 0) {
          var sType = HEAP32[(((nextInChainPtr)+(4))>>2)];
          var webxrOptions = nextInChainPtr;
          
          opts.xrCompatible = !!(HEAPU32[(((webxrOptions)+(8))>>2)]);
        }
      }
  
      if (!('gpu' in navigator)) {
        var sp = stackSave();
        var messagePtr = stringToUTF8OnStack('WebGPU not available on this browser (navigator.gpu is not available)');
        _emwgpuOnRequestAdapterCompleted(futureId, 3,
          adapterPtr, messagePtr);
        stackRestore(sp);
        return;
      }
  
      runtimeKeepalivePush(); // requestAdapter
      WebGPU.Internals.futureInsert(futureId, navigator.gpu.requestAdapter(opts).then((adapter) => {
        runtimeKeepalivePop(); // requestAdapter fulfilled
        callUserCallback(() => {
          if (adapter) {
            WebGPU.Internals.jsObjectInsert(adapterPtr, adapter);
            _emwgpuOnRequestAdapterCompleted(futureId, 1,
              adapterPtr, 0);
          } else {
            var sp = stackSave();
            var messagePtr = stringToUTF8OnStack('WebGPU not available on this browser (requestAdapter returned null)');
            _emwgpuOnRequestAdapterCompleted(futureId, 3,
              adapterPtr, messagePtr);
            stackRestore(sp);
          }
        });
      }, (ex) => {
        runtimeKeepalivePop(); // requestAdapter rejected
        callUserCallback(() => {
          var sp = stackSave();
          var messagePtr = stringToUTF8OnStack(ex.message);
          _emwgpuOnRequestAdapterCompleted(futureId, 4,
            adapterPtr, messagePtr);
          stackRestore(sp);
        });
      }));
    ;
  }

  
  
  
  
  
  
  var _emwgpuQueueOnSubmittedWorkDone = function(queuePtr, futureId) {
    futureId = bigintToI53Checked(futureId);
  
  
      var queue = WebGPU.getJsObject(queuePtr);
  
      runtimeKeepalivePush(); // onSubmittedWorkDone
      WebGPU.Internals.futureInsert(futureId, queue.onSubmittedWorkDone().then(() => {
        runtimeKeepalivePop(); // onSubmittedWorkDone fulfilled (assumed not to reject)
        callUserCallback(() => {
          _emwgpuOnWorkDoneCompleted(futureId, 1);
        });
      }));
    ;
  };

  
  
  var _emwgpuWaitAny = (futurePtr, futureCount, timeoutMSPtr) => Asyncify.handleAsync(async () => {
      var promises = [];
      if (timeoutMSPtr) {
        var timeoutMS = HEAP32[((timeoutMSPtr)>>2)];
        promises.length = futureCount + 1;
        promises[futureCount] = new Promise((resolve) => setTimeout(resolve, timeoutMS, 0));
      } else {
        promises.length = futureCount;
      }
  
      for (var i = 0; i < futureCount; ++i) {
        // If any FutureID is not tracked, it means it must be done.
        var futureId = readI53FromI64((futurePtr + i * 8));
        if (!(futureId in WebGPU.Internals.futures)) {
          return futureId;
        }
        promises[i] = WebGPU.Internals.futures[futureId];
      }
  
      const firstResolvedFuture = await Promise.race(promises);
      delete WebGPU.Internals.futures[firstResolvedFuture];
      return firstResolvedFuture;
    });
  _emwgpuWaitAny.isAsync = true;

  var ENV = {
  };
  
  var getExecutableName = () => thisProgram;
  var getEnvStrings = () => {
      if (!getEnvStrings.strings) {
        // Default values.
        var lang = (globalThis.navigator?.language ?? 'C').replace('-', '_') + '.UTF-8';
        var env = {
          'USER': 'web_user',
          'LOGNAME': 'web_user',
          'PATH': '/',
          'PWD': '/',
          'HOME': '/home/web_user',
          'LANG': lang,
          '_': getExecutableName()
        };
        // Apply the user-provided values, if any.
        for (var x in ENV) {
          // x is a key in ENV; if ENV[x] is undefined, that means it was
          // explicitly set to be so. We allow user code to do that to
          // force variables with default values to remain unset.
          if (ENV[x] === undefined) delete env[x];
          else env[x] = ENV[x];
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
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(33, 0, 1, __environ, environ_buf);
  
      var bufSize = 0;
      var envp = 0;
      for (var string of getEnvStrings()) {
        var ptr = environ_buf + bufSize;
        HEAPU32[(((__environ)+(envp))>>2)] = ptr;
        bufSize += stringToUTF8(string, ptr, Infinity) + 1;
        envp += 4;
      }
      return 0;
    
  }
  

  
  
  
  
  function _environ_sizes_get(penviron_count, penviron_buf_size) {
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(34, 0, 1, penviron_count, penviron_buf_size);
  
      var strings = getEnvStrings();
      HEAPU32[((penviron_count)>>2)] = strings.length;
      var bufSize = 0;
      for (var string of strings) {
        bufSize += lengthBytesUTF8(string) + 1;
      }
      HEAPU32[((penviron_buf_size)>>2)] = bufSize;
      return 0;
    
  }
  


  var inetPton4 = (str) => {
      var b = str.split('.');
      for (var i = 0; i < 4; i++) {
        var tmp = Number(b[i]);
        if (isNaN(tmp)) return null;
        b[i] = tmp;
      }
      return (b[0] | (b[1] << 8) | (b[2] << 16) | (b[3] << 24)) >>> 0;
    };
  
  var inetNtop4 = (addr) =>
      (addr & 0xff) + '.' + ((addr >> 8) & 0xff) + '.' + ((addr >> 16) & 0xff) + '.' + ((addr >> 24) & 0xff);
  
  var inetPton6 = (str) => {
      var words;
      var w, offset, z, i;
      /* http://home.deds.nl/~aeron/regex/ */
      var valid6regx = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i
      var parts = [];
      if (!valid6regx.test(str)) {
        return null;
      }
      if (str === '::') {
        return [0, 0, 0, 0, 0, 0, 0, 0];
      }
      // Z placeholder to keep track of zeros when splitting the string on ':'
      if (str.startsWith('::')) {
        str = str.replace('::', 'Z:'); // leading zeros case
      } else {
        str = str.replace('::', ':Z:');
      }
  
      if (str.indexOf('.') > 0) {
        // parse IPv4 embedded address
        str = str.replace(new RegExp('[.]', 'g'), ':');
        words = str.split(':');
        words[words.length-4] = Number(words[words.length-4]) + Number(words[words.length-3])*256;
        words[words.length-3] = Number(words[words.length-2]) + Number(words[words.length-1])*256;
        words = words.slice(0, words.length-2);
      } else {
        words = str.split(':');
      }
  
      offset = 0; z = 0;
      for (w=0; w < words.length; w++) {
        if (typeof words[w] === 'string') {
          if (words[w] === 'Z') {
            // compressed zeros - write appropriate number of zero words
            for (z = 0; z < (8 - words.length+1); z++) {
              parts[w+z] = 0;
            }
            offset = z-1;
          } else {
            // parse hex field to 16-bit value and write it in network byte-order
            parts[w+offset] = _htons(parseInt(words[w],16));
          }
        } else {
          // parsed IPv4 words
          parts[w+offset] = words[w];
        }
      }
      return [
        (parts[1] << 16) | parts[0],
        (parts[3] << 16) | parts[2],
        (parts[5] << 16) | parts[4],
        (parts[7] << 16) | parts[6]
      ];
    };
  
  
  var inetNtop6 = (ints) => {
      //  ref:  http://www.ietf.org/rfc/rfc2373.txt - section 2.5.4
      //  Format for IPv4 compatible and mapped  128-bit IPv6 Addresses
      //  128-bits are split into eight 16-bit words
      //  stored in network byte order (big-endian)
      //  |                80 bits               | 16 |      32 bits        |
      //  +-----------------------------------------------------------------+
      //  |               10 bytes               |  2 |      4 bytes        |
      //  +--------------------------------------+--------------------------+
      //  +               5 words                |  1 |      2 words        |
      //  +--------------------------------------+--------------------------+
      //  |0000..............................0000|0000|    IPv4 ADDRESS     | (compatible)
      //  +--------------------------------------+----+---------------------+
      //  |0000..............................0000|FFFF|    IPv4 ADDRESS     | (mapped)
      //  +--------------------------------------+----+---------------------+
      var str = '';
      var word = 0;
      var longest = 0;
      var lastzero = 0;
      var zstart = 0;
      var len = 0;
      var i = 0;
      var parts = [
        ints[0] & 0xffff,
        (ints[0] >> 16),
        ints[1] & 0xffff,
        (ints[1] >> 16),
        ints[2] & 0xffff,
        (ints[2] >> 16),
        ints[3] & 0xffff,
        (ints[3] >> 16)
      ];
  
      // Handle IPv4-compatible, IPv4-mapped, loopback and any/unspecified addresses
  
      var hasipv4 = true;
      var v4part = '';
      // check if the 10 high-order bytes are all zeros (first 5 words)
      for (i = 0; i < 5; i++) {
        if (parts[i]) {
          hasipv4 = false;
          break;
        }
      }
  
      if (hasipv4) {
        // low-order 32-bits store an IPv4 address (bytes 13 to 16) (last 2 words)
        v4part = inetNtop4(parts[6] | (parts[7] << 16));
        // IPv4-mapped IPv6 address if 16-bit value (bytes 11 and 12) == 0xFFFF (6th word)
        if (parts[5] === -1) {
          str = '::ffff:';
          str += v4part;
          return str;
        }
        // IPv4-compatible IPv6 address if 16-bit value (bytes 11 and 12) == 0x0000 (6th word)
        if (!parts[5]) {
          str = '::';
          // special case IPv6 addresses
          if (v4part === '0.0.0.0') v4part = ''; // any/unspecified address
          if (v4part === '0.0.0.1') v4part = '1';// loopback address
          str += v4part;
          return str;
        }
      }
  
      // Handle all other IPv6 addresses
  
      // first run to find the longest contiguous zero words
      for (word = 0; word < 8; word++) {
        if (!parts[word]) {
          if (word - lastzero > 1) {
            len = 0;
          }
          lastzero = word;
          len++;
        }
        if (len > longest) {
          longest = len;
          zstart = word - longest + 1;
        }
      }
  
      for (word = 0; word < 8; word++) {
        if (longest > 1) {
          // compress contiguous zeros - to produce '::'
          if (!parts[word] && word >= zstart && word < (zstart + longest) ) {
            if (word === zstart) {
              str += ':';
              if (!zstart) str += ':'; //leading zeros case
            }
            continue;
          }
        }
        // converts 16-bit words from big-endian to little-endian before converting to hex string
        str += Number(_ntohs(parts[word] & 0xffff)).toString(16);
        str += word < 7 ? ':' : '';
      }
      return str;
    };
  
  
  
  var zeroMemory = (ptr, size) => HEAPU8.fill(0, ptr, ptr + size);
  
  
  
  var DNS = {
  address_map:{
  id:1,
  addrs:{
  },
  names:{
  },
  },
  lookup_name(name) {
        // If the name is already a valid ipv4 / ipv6 address, don't generate a fake one.
        var res = inetPton4(name);
        if (res !== null) {
          return name;
        }
        res = inetPton6(name);
        if (res !== null) {
          return name;
        }
  
        // See if this name is already mapped.
        var addr;
  
        if (DNS.address_map.addrs[name]) {
          addr = DNS.address_map.addrs[name];
        } else {
          var id = DNS.address_map.id++;
  
          addr = '172.29.' + (id & 0xff) + '.' + (id & 0xff00);
  
          DNS.address_map.names[addr] = name;
          DNS.address_map.addrs[name] = addr;
        }
  
        return addr;
      },
  lookup_addr(addr) {
        if (DNS.address_map.names[addr]) {
          return DNS.address_map.names[addr];
        }
  
        return null;
      },
  };
  
  
  /** @param {number=} addrlen */
  var writeSockaddr = (sa, family, addr, port, addrlen) => {
      switch (family) {
        case 2:
          // The address may still be an unresolved hostname (e.g. a peer name
          // recorded at connect time); map it to its fake IP here so callers can
          // pass names and IPs alike. Real sockets only ever see numeric addresses.
          addr = inetPton4(DNS.lookup_name(addr));
          zeroMemory(sa, 16);
          if (addrlen) {
            HEAP32[((addrlen)>>2)] = 16;
          }
          HEAP16[((sa)>>1)] = family;
          HEAP32[(((sa)+(4))>>2)] = addr;
          HEAP16[(((sa)+(2))>>1)] = _htons(port);
          break;
        case 10:
          addr = inetPton6(DNS.lookup_name(addr));
          zeroMemory(sa, 28);
          if (addrlen) {
            HEAP32[((addrlen)>>2)] = 28;
          }
          HEAP32[((sa)>>2)] = family;
          HEAP32[(((sa)+(8))>>2)] = addr[0];
          HEAP32[(((sa)+(12))>>2)] = addr[1];
          HEAP32[(((sa)+(16))>>2)] = addr[2];
          HEAP32[(((sa)+(20))>>2)] = addr[3];
          HEAP16[(((sa)+(2))>>1)] = _htons(port);
          break;
        default:
          return 5;
      }
      return 0;
    };
  
  
  
  
  
  
  
  
  function _getaddrinfo(node, service, hint, out) {
  if (ENVIRONMENT_IS_PTHREAD)
    return proxyToMainThread(35, 0, 1, node, service, hint, out);
  
      // Note getaddrinfo currently only returns a single addrinfo with ai_next defaulting to NULL. When NULL
      // hints are specified or ai_family set to AF_UNSPEC or ai_socktype or ai_protocol set to 0 then we
      // really should provide a linked list of suitable addrinfo values.
      var addrs = [];
      var canon = null;
      var addr = 0;
      var port = 0;
      var flags = 0;
      var family = 0;
      var type = 0;
      var proto = 0;
      var ai, last;
  
      function allocaddrinfo(family, type, proto, canon, addr, port) {
        var sa, salen, ai;
        var errno;
  
        salen = family === 10 ?
          28 :
          16;
        addr = family === 10 ?
          inetNtop6(addr) :
          inetNtop4(addr);
        sa = _malloc(salen);
        errno = writeSockaddr(sa, family, addr, port);
  
        ai = _malloc(32);
        HEAP32[(((ai)+(4))>>2)] = family;
        HEAP32[(((ai)+(8))>>2)] = type;
        HEAP32[(((ai)+(12))>>2)] = proto;
        HEAPU32[(((ai)+(24))>>2)] = canon;
        HEAPU32[(((ai)+(20))>>2)] = sa;
        if (family === 10) {
          HEAP32[(((ai)+(16))>>2)] = 28;
        } else {
          HEAP32[(((ai)+(16))>>2)] = 16;
        }
        HEAP32[(((ai)+(28))>>2)] = 0;
  
        return ai;
      }
  
      if (hint) {
        flags = HEAP32[((hint)>>2)];
        family = HEAP32[(((hint)+(4))>>2)];
        type = HEAP32[(((hint)+(8))>>2)];
        proto = HEAP32[(((hint)+(12))>>2)];
      }
      if (type && !proto) {
        proto = type === 2 ? 17 : 6;
      }
      if (!type && proto) {
        type = proto === 17 ? 2 : 1;
      }
  
      // If type or proto are set to zero in hints we should really be returning multiple addrinfo values, but for
      // now default to a TCP STREAM socket so we can at least return a sensible addrinfo given NULL hints.
      if (!proto) {
        proto = 6;
      }
      if (!type) {
        type = 1;
      }
  
      if (!node && !service) {
        return -2;
      }
      if (flags & ~(1|2|4|
          1024|8|16|32)) {
        return -1;
      }
      if (hint && (HEAP32[((hint)>>2)] & 2) && !node) {
        return -1;
      }
      if (flags & 32) {
        // TODO
        return -2;
      }
      if (type && type !== 1 && type !== 2) {
        return -7;
      }
      if (family !== 0 && family !== 2 && family !== 10) {
        return -6;
      }
  
      if (service) {
        service = UTF8ToString(service);
        port = parseInt(service, 10);
  
        if (isNaN(port)) {
          if (flags & 1024) {
            return -2;
          }
          // TODO support resolving well-known service names from:
          // http://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.txt
          return -8;
        }
      }
  
      if (!node) {
        if (family === 0) {
          family = 2;
        }
        if (!(flags & 1)) {
          if (family === 2) {
            addr = _htonl(2130706433);
          } else {
            addr = [0, 0, 0, _htonl(1)];
          }
        }
        ai = allocaddrinfo(family, type, proto, null, addr, port);
        HEAPU32[((out)>>2)] = ai;
        return 0;
      }
  
      //
      // try as a numeric address
      //
      node = UTF8ToString(node);
      addr = inetPton4(node);
      if (addr !== null) {
        // incoming node is a valid ipv4 address
        if (family === 0 || family === 2) {
          family = 2;
        }
        else if (family === 10 && (flags & 8)) {
          addr = [0, 0, _htonl(0xffff), addr];
          family = 10;
        } else {
          return -2;
        }
      } else {
        addr = inetPton6(node);
        if (addr !== null) {
          // incoming node is a valid ipv6 address
          if (family === 0 || family === 10) {
            family = 10;
          } else {
            return -2;
          }
        }
      }
      if (addr != null) {
        ai = allocaddrinfo(family, type, proto, node, addr, port);
        HEAPU32[((out)>>2)] = ai;
        return 0;
      }
      if (flags & 4) {
        return -2;
      }
  
      //
      // try as a hostname
      //
      // resolve the hostname to a temporary fake address
      node = DNS.lookup_name(node);
      addr = inetPton4(node);
      if (family === 0) {
        family = 2;
      } else if (family === 10) {
        addr = [0, 0, _htonl(0xffff), addr];
      }
      ai = allocaddrinfo(family, type, proto, null, addr, port);
      HEAPU32[((out)>>2)] = ai;
      return 0;
    
  }
  


  var initRandomFill = () => {
  
      // like with most Web APIs, we can't use Web Crypto API directly on shared memory,
      // so we need to create an intermediate buffer and copy it to the destination
      return (view) => (view.set(crypto.getRandomValues(new Uint8Array(view.byteLength))), 0);
    };
  var randomFill = (view) => (randomFill = initRandomFill())(view);
  
  var _random_get = (buffer, size) => randomFill(HEAPU8.subarray(buffer, buffer + size));

  
  
  var emwgpuStringToInt_FeatureName = {
              'core-features-and-limits': 1,
              'depth-clip-control': 2,
              'depth32float-stencil8': 3,
              'texture-compression-bc': 4,
              'texture-compression-bc-sliced-3d': 5,
              'texture-compression-etc2': 6,
              'texture-compression-astc': 7,
              'texture-compression-astc-sliced-3d': 8,
              'timestamp-query': 9,
              'indirect-first-instance': 10,
              'shader-f16': 11,
              'rg11b10ufloat-renderable': 12,
              'bgra8unorm-storage': 13,
              'float32-filterable': 14,
              'float32-blendable': 15,
              'clip-distances': 16,
              'dual-source-blending': 17,
              'subgroups': 18,
              'texture-formats-tier1': 19,
              'texture-formats-tier2': 20,
              'primitive-index': 21,
              'texture-component-swizzle': 22,
              'chromium-experimental-unorm16-texture-formats': 327692,
              'chromium-experimental-multi-draw-indirect': 327729,
          };
  
  
  
  
  var _wgpuAdapterGetFeatures = (adapterPtr, supportedFeatures) => {
      var adapter = WebGPU.getJsObject(adapterPtr);
  
      // Always allocate enough space for all the features, though some may be unused.
      var featuresPtr = _malloc(adapter.features.size * 4);
      var offset = 0;
      var numFeatures = 0;
      for (const feature of adapter.features) {
        var featureEnumValue = emwgpuStringToInt_FeatureName[feature];
        if (featureEnumValue >= 0) {
          HEAP32[(((featuresPtr)+(offset))>>2)] = featureEnumValue;
          offset += 4;
          numFeatures++;
        }
      };
      HEAPU32[(((supportedFeatures)+(4))>>2)] = featuresPtr;
      HEAPU32[((supportedFeatures)>>2)] = numFeatures;
    };

  
  var _wgpuAdapterGetInfo = (adapterPtr, info) => {
      var adapter = WebGPU.getJsObject(adapterPtr);
      WebGPU.fillAdapterInfoStruct(adapter.info, info);
      return 1;
    };

  
  var _wgpuAdapterGetLimits = (adapterPtr, limitsOutPtr) => {
      var adapter = WebGPU.getJsObject(adapterPtr);
      WebGPU.fillLimitStruct(adapter.limits, limitsOutPtr);
      return 1;
    };

  
  
  
  var _wgpuCommandEncoderBeginComputePass = (encoderPtr, descriptor) => {
      var desc;
  
      if (descriptor) {
        
        desc = {
          "label": WebGPU.makeStringFromOptionalStringView(
            descriptor + 4),
          "timestampWrites": WebGPU.makePassTimestampWrites(
            HEAPU32[(((descriptor)+(12))>>2)]),
        };
      }
      var commandEncoder = WebGPU.getJsObject(encoderPtr);
      var ptr = _emwgpuCreateComputePassEncoder(0);
      WebGPU.Internals.jsObjectInsert(ptr, commandEncoder.beginComputePass(desc));
      return ptr;
    };

  
  
  
  
  
  var _wgpuCommandEncoderBeginRenderPass = (encoderPtr, descriptor) => {
      
  
      function makeColorAttachment(caPtr) {
        var viewPtr = HEAPU32[(((caPtr)+(4))>>2)];
        if (viewPtr === 0) {
          // Null `view` means no attachment in this slot.
          return undefined;
        }
  
        var depthSlice = HEAPU32[(((caPtr)+(8))>>2)];
        if (depthSlice == 0xFFFFFFFF) depthSlice = undefined;
  
        return {
          "view": WebGPU.getJsObject(viewPtr),
          "depthSlice": depthSlice,
          "resolveTarget": WebGPU.getJsObject(
            HEAPU32[(((caPtr)+(12))>>2)]),
          "clearValue": WebGPU.makeColor(caPtr + 24),
          "loadOp": WebGPU.LoadOp[HEAP32[(((caPtr)+(16))>>2)]],
          "storeOp": WebGPU.StoreOp[HEAP32[(((caPtr)+(20))>>2)]],
        };
      }
  
      function makeColorAttachments(count, caPtr) {
        var attachments = [];
        for (var i = 0; i < count; ++i) {
          attachments.push(makeColorAttachment(caPtr + 56 * i));
        }
        return attachments;
      }
  
      function makeDepthStencilAttachment(dsaPtr) {
        if (dsaPtr === 0) return undefined;
  
        return {
          "view": WebGPU.getJsObject(
            HEAPU32[(((dsaPtr)+(4))>>2)]),
          "depthClearValue": HEAPF32[(((dsaPtr)+(16))>>2)],
          "depthLoadOp": WebGPU.LoadOp[HEAP32[(((dsaPtr)+(8))>>2)]],
          "depthStoreOp": WebGPU.StoreOp[HEAP32[(((dsaPtr)+(12))>>2)]],
          "depthReadOnly": !!(HEAPU32[(((dsaPtr)+(20))>>2)]),
          "stencilClearValue": HEAPU32[(((dsaPtr)+(32))>>2)],
          "stencilLoadOp": WebGPU.LoadOp[HEAP32[(((dsaPtr)+(24))>>2)]],
          "stencilStoreOp": WebGPU.StoreOp[HEAP32[(((dsaPtr)+(28))>>2)]],
          "stencilReadOnly": !!(HEAPU32[(((dsaPtr)+(36))>>2)]),
        };
      }
  
      function makeRenderPassDescriptor(descriptor) {
        
        var nextInChainPtr = HEAPU32[((descriptor)>>2)];
  
        var maxDrawCount = undefined;
        if (nextInChainPtr !== 0) {
          var sType = HEAP32[(((nextInChainPtr)+(4))>>2)];
          var renderPassMaxDrawCount = nextInChainPtr;
          
          // Note: The user could have passed a really huge value here, which is technically valid in
          // C but will not be allowed by WebGPU in JS because of [EnforceRange]. We intentionally
          // ignore that case because it's not useful - apps can just pick a smaller maxDrawCount.
          maxDrawCount = readI53FromI64((renderPassMaxDrawCount)+(8));
        }
  
        var desc = {
          "label": WebGPU.makeStringFromOptionalStringView(
            descriptor + 4),
          "colorAttachments": makeColorAttachments(
            HEAPU32[(((descriptor)+(12))>>2)],
            HEAPU32[(((descriptor)+(16))>>2)]),
          "depthStencilAttachment": makeDepthStencilAttachment(
            HEAPU32[(((descriptor)+(20))>>2)]),
          "occlusionQuerySet": WebGPU.getJsObject(
            HEAPU32[(((descriptor)+(24))>>2)]),
          "timestampWrites": WebGPU.makePassTimestampWrites(
            HEAPU32[(((descriptor)+(28))>>2)]),
          "maxDrawCount": maxDrawCount,
        };
        return desc;
      }
  
      var desc = makeRenderPassDescriptor(descriptor);
  
      var commandEncoder = WebGPU.getJsObject(encoderPtr);
      var ptr = _emwgpuCreateRenderPassEncoder(0);
      WebGPU.Internals.jsObjectInsert(ptr, commandEncoder.beginRenderPass(desc));
      return ptr;
    };

  
  
  function _wgpuCommandEncoderCopyBufferToBuffer(encoderPtr, srcPtr, srcOffset, dstPtr, dstOffset, size) {
    srcOffset = bigintToI53Checked(srcOffset);
    dstOffset = bigintToI53Checked(dstOffset);
    size = bigintToI53Checked(size);
  
  
      var commandEncoder = WebGPU.getJsObject(encoderPtr);
      var src = WebGPU.getJsObject(srcPtr);
      var dst = WebGPU.getJsObject(dstPtr);
      commandEncoder.copyBufferToBuffer(src, srcOffset, dst, dstOffset, size);
    ;
  }

  
  var _wgpuCommandEncoderCopyBufferToTexture = (encoderPtr, srcPtr, dstPtr, copySizePtr) => {
      var commandEncoder = WebGPU.getJsObject(encoderPtr);
      var copySize = WebGPU.makeExtent3D(copySizePtr);
      commandEncoder.copyBufferToTexture(
        WebGPU.makeTexelCopyBufferInfo(srcPtr), WebGPU.makeTexelCopyTextureInfo(dstPtr), copySize);
    };

  
  var _wgpuCommandEncoderCopyTextureToBuffer = (encoderPtr, srcPtr, dstPtr, copySizePtr) => {
      var commandEncoder = WebGPU.getJsObject(encoderPtr);
      var copySize = WebGPU.makeExtent3D(copySizePtr);
      commandEncoder.copyTextureToBuffer(
        WebGPU.makeTexelCopyTextureInfo(srcPtr), WebGPU.makeTexelCopyBufferInfo(dstPtr), copySize);
    };

  
  var _wgpuCommandEncoderCopyTextureToTexture = (encoderPtr, srcPtr, dstPtr, copySizePtr) => {
      var commandEncoder = WebGPU.getJsObject(encoderPtr);
      var copySize = WebGPU.makeExtent3D(copySizePtr);
      commandEncoder.copyTextureToTexture(
        WebGPU.makeTexelCopyTextureInfo(srcPtr), WebGPU.makeTexelCopyTextureInfo(dstPtr), copySize);
    };

  
  
  var _wgpuCommandEncoderFinish = (encoderPtr, descriptor) => {
      // TODO: Use the descriptor.
      var commandEncoder = WebGPU.getJsObject(encoderPtr);
      var ptr = _emwgpuCreateCommandBuffer(0);
      WebGPU.Internals.jsObjectInsert(ptr, commandEncoder.finish());
      return ptr;
    };

  
  var _wgpuComputePassEncoderDispatchWorkgroups = (passPtr, x, y, z) => {
      
      
      
      var pass = WebGPU.getJsObject(passPtr);
      pass.dispatchWorkgroups(x, y, z);
    };

  
  var _wgpuComputePassEncoderEnd = (passPtr) => {
      var pass = WebGPU.getJsObject(passPtr);
      pass.end();
    };

  
  
  var _wgpuComputePassEncoderSetBindGroup = (passPtr, groupIndex, groupPtr, dynamicOffsetCount, dynamicOffsetsPtr) => {
      
      var pass = WebGPU.getJsObject(passPtr);
      var group = WebGPU.getJsObject(groupPtr);
      if (dynamicOffsetCount == 0) {
        pass.setBindGroup(groupIndex, group);
      } else {
        pass.setBindGroup(groupIndex, group, HEAPU32, ((dynamicOffsetsPtr)>>2), dynamicOffsetCount);
      }
    };

  
  var _wgpuComputePassEncoderSetPipeline = (passPtr, pipelinePtr) => {
      var pass = WebGPU.getJsObject(passPtr);
      var pipeline = WebGPU.getJsObject(pipelinePtr);
      pass.setPipeline(pipeline);
    };

  
  
  
  var _wgpuDeviceCreateBindGroup = (devicePtr, descriptor) => {
      
  
      function makeEntry(entryPtr) {
        
  
        var bufferPtr = HEAPU32[(((entryPtr)+(8))>>2)];
        var samplerPtr = HEAPU32[(((entryPtr)+(32))>>2)];
        var textureViewPtr = HEAPU32[(((entryPtr)+(36))>>2)];
        var externalTexturePtr = 0;
        WebGPU.iterateExtensions(entryPtr, {
          14: (ptr) => {
            externalTexturePtr = HEAPU32[(((ptr)+(8))>>2)];
          },
        });
  
        var resource;
        if (bufferPtr) {
          // Note the sentinel UINT64_MAX will be read as -1.
          var size = readI53FromI64((entryPtr)+(24));
          if (size == -1) size = undefined;
  
          resource = {
            "buffer": WebGPU.getJsObject(bufferPtr),
            "offset": readI53FromI64((entryPtr)+(16)),
            "size": size,
          };
        } else {
          resource = WebGPU.getJsObject(samplerPtr || textureViewPtr || externalTexturePtr);
        }
        return {
          "binding": HEAPU32[(((entryPtr)+(4))>>2)],
          "resource": resource,
        };
      }
  
      function makeEntries(count, entriesPtrs) {
        var entries = [];
        for (var i = 0; i < count; ++i) {
          entries.push(makeEntry(entriesPtrs +
              40 * i));
        }
        return entries;
      }
  
      var desc = {
        "label": WebGPU.makeStringFromOptionalStringView(
          descriptor + 4),
        "layout": WebGPU.getJsObject(
          HEAPU32[(((descriptor)+(12))>>2)]),
        "entries": makeEntries(
          HEAPU32[(((descriptor)+(16))>>2)],
          HEAPU32[(((descriptor)+(20))>>2)]
        ),
      };
  
      var device = WebGPU.getJsObject(devicePtr);
      var ptr = _emwgpuCreateBindGroup(0);
      WebGPU.Internals.jsObjectInsert(ptr, device.createBindGroup(desc));
      return ptr;
    };

  
  
  
  
  var _wgpuDeviceCreateBindGroupLayout = (devicePtr, descriptor) => {
      
  
      function makeBufferEntry(substructPtr) {
        var typeInt =
          HEAPU32[(((substructPtr)+(4))>>2)];
        if (!typeInt) return undefined;
  
        return {
          "type": WebGPU.BufferBindingType[typeInt],
          "hasDynamicOffset":
            !!(HEAPU32[(((substructPtr)+(8))>>2)]),
          "minBindingSize":
            readI53FromI64((substructPtr)+(16)),
        };
      }
  
      function makeSamplerEntry(substructPtr) {
        var typeInt =
          HEAPU32[(((substructPtr)+(4))>>2)];
        if (!typeInt) return undefined;
  
        return {
          "type": WebGPU.SamplerBindingType[typeInt],
        };
      }
  
      function makeTextureEntry(substructPtr) {
        var sampleTypeInt =
          HEAPU32[(((substructPtr)+(4))>>2)];
        if (!sampleTypeInt) return undefined;
  
        return {
          "sampleType": WebGPU.TextureSampleType[sampleTypeInt],
          "viewDimension": WebGPU.TextureViewDimension[HEAP32[(((substructPtr)+(8))>>2)]],
          "multisampled":
            !!(HEAPU32[(((substructPtr)+(12))>>2)]),
        };
      }
  
      function makeStorageTextureEntry(substructPtr) {
        var accessInt =
          HEAPU32[(((substructPtr)+(4))>>2)]
        if (!accessInt) return undefined;
  
        return {
          "access": WebGPU.StorageTextureAccess[accessInt],
          "format": WebGPU.TextureFormat[HEAP32[(((substructPtr)+(8))>>2)]],
          "viewDimension": WebGPU.TextureViewDimension[HEAP32[(((substructPtr)+(12))>>2)]],
        };
      }
  
      function makeEntry(entryPtr) {
        
  
        var entry = {
          "binding":
            HEAPU32[(((entryPtr)+(4))>>2)],
          "visibility":
            HEAPU32[(((entryPtr)+(8))>>2)],
          "buffer": makeBufferEntry(entryPtr + 24),
          "sampler": makeSamplerEntry(entryPtr + 48),
          "texture": makeTextureEntry(entryPtr + 56),
          "storageTexture": makeStorageTextureEntry(entryPtr + 72),
        };
        WebGPU.iterateExtensions(entryPtr, {
          13: (ptr) => {
            entry["externalTexture"] = {};
          },
        });
        return entry;
      }
  
      function makeEntries(count, entriesPtrs) {
        var entries = [];
        for (var i = 0; i < count; ++i) {
          entries.push(makeEntry(entriesPtrs +
              88 * i));
        }
        return entries;
      }
  
      var desc = {
        "label": WebGPU.makeStringFromOptionalStringView(
          descriptor + 4),
        "entries": makeEntries(
          HEAPU32[(((descriptor)+(12))>>2)],
          HEAPU32[(((descriptor)+(16))>>2)]
        ),
      };
  
      var device = WebGPU.getJsObject(devicePtr);
      var ptr = _emwgpuCreateBindGroupLayout(0);
      WebGPU.Internals.jsObjectInsert(ptr, device.createBindGroupLayout(desc));
      return ptr;
    };

  
  
  var _wgpuDeviceCreateCommandEncoder = (devicePtr, descriptor) => {
      var desc;
      if (descriptor) {
        
        desc = {
          "label": WebGPU.makeStringFromOptionalStringView(
            descriptor + 4),
        };
      }
      var device = WebGPU.getJsObject(devicePtr);
      var ptr = _emwgpuCreateCommandEncoder(0);
      WebGPU.Internals.jsObjectInsert(ptr, device.createCommandEncoder(desc));
      return ptr;
    };

  
  
  var _wgpuDeviceCreateComputePipeline = (devicePtr, descriptor) => {
      var desc = WebGPU.makeComputePipelineDesc(descriptor);
      var device = WebGPU.getJsObject(devicePtr);
      var ptr = _emwgpuCreateComputePipeline(0);
      WebGPU.Internals.jsObjectInsert(ptr, device.createComputePipeline(desc));
      return ptr;
    };

  
  
  
  var _wgpuDeviceCreatePipelineLayout = (devicePtr, descriptor) => {
      
      var bglCount = HEAPU32[(((descriptor)+(12))>>2)];
      var bglPtr = HEAPU32[(((descriptor)+(16))>>2)];
      var bgls = [];
      for (var i = 0; i < bglCount; ++i) {
        bgls.push(WebGPU.getJsObject(
          HEAPU32[(((bglPtr)+(4 * i))>>2)]));
      }
      var desc = {
        "label": WebGPU.makeStringFromOptionalStringView(
          descriptor + 4),
        "bindGroupLayouts": bgls,
      };
  
      var device = WebGPU.getJsObject(devicePtr);
      var ptr = _emwgpuCreatePipelineLayout(0);
      WebGPU.Internals.jsObjectInsert(ptr, device.createPipelineLayout(desc));
      return ptr;
    };

  
  
  var _wgpuDeviceCreateRenderPipeline = (devicePtr, descriptor) => {
      var desc = WebGPU.makeRenderPipelineDesc(descriptor);
      var device = WebGPU.getJsObject(devicePtr);
      var ptr = _emwgpuCreateRenderPipeline(0);
      WebGPU.Internals.jsObjectInsert(ptr, device.createRenderPipeline(desc));
      return ptr;
    };

  
  
  
  
  
  var _wgpuDeviceCreateSampler = (devicePtr, descriptor) => {
      var desc;
      if (descriptor) {
        
  
        desc = {
          "label": WebGPU.makeStringFromOptionalStringView(
            descriptor + 4),
          "addressModeU": WebGPU.AddressMode[HEAP32[(((descriptor)+(12))>>2)]],
          "addressModeV": WebGPU.AddressMode[HEAP32[(((descriptor)+(16))>>2)]],
          "addressModeW": WebGPU.AddressMode[HEAP32[(((descriptor)+(20))>>2)]],
          "magFilter": WebGPU.FilterMode[HEAP32[(((descriptor)+(24))>>2)]],
          "minFilter": WebGPU.FilterMode[HEAP32[(((descriptor)+(28))>>2)]],
          "mipmapFilter": WebGPU.MipmapFilterMode[HEAP32[(((descriptor)+(32))>>2)]],
          "lodMinClamp": HEAPF32[(((descriptor)+(36))>>2)],
          "lodMaxClamp": HEAPF32[(((descriptor)+(40))>>2)],
          "compare": WebGPU.CompareFunction[HEAP32[(((descriptor)+(44))>>2)]],
          "maxAnisotropy": HEAPU16[(((descriptor)+(48))>>1)],
        };
      }
  
      var device = WebGPU.getJsObject(devicePtr);
      var ptr = _emwgpuCreateSampler(0);
      WebGPU.Internals.jsObjectInsert(ptr, device.createSampler(desc));
      return ptr;
    };

  
  
  
  
  var _wgpuDeviceCreateTexture = (devicePtr, descriptor) => {
      
      var nextInChainPtr = HEAPU32[((descriptor)>>2)];
  
      var textureBindingViewDimension;
      if (nextInChainPtr !== 0) {
        var sType = HEAP32[(((nextInChainPtr)+(4))>>2)];
        var textureBindingViewDimensionDescriptor = nextInChainPtr;
        
        textureBindingViewDimension = WebGPU.TextureViewDimension[HEAP32[(((textureBindingViewDimensionDescriptor)+(8))>>2)]];
      }
  
      var desc = {
        "label": WebGPU.makeStringFromOptionalStringView(
          descriptor + 4),
        "size": WebGPU.makeExtent3D(descriptor + 28),
        "mipLevelCount": HEAPU32[(((descriptor)+(44))>>2)],
        "sampleCount": HEAPU32[(((descriptor)+(48))>>2)],
        "dimension": WebGPU.TextureDimension[HEAP32[(((descriptor)+(24))>>2)]],
        "format": WebGPU.TextureFormat[HEAP32[(((descriptor)+(40))>>2)]],
        "usage": HEAPU32[(((descriptor)+(16))>>2)],
        "textureBindingViewDimension": textureBindingViewDimension,
      };
  
      var viewFormatCount = HEAPU32[(((descriptor)+(52))>>2)];
      if (viewFormatCount) {
        var viewFormatsPtr = HEAPU32[(((descriptor)+(56))>>2)];
        // viewFormatsPtr pointer to an array of TextureFormat which is an enum of size uint32_t
        desc['viewFormats'] = Array.from(HEAP32.subarray((((viewFormatsPtr)>>2)), ((viewFormatsPtr + viewFormatCount * 4)>>2)),
          format => WebGPU.TextureFormat[format]);
      }
  
      var device = WebGPU.getJsObject(devicePtr);
      var ptr = _emwgpuCreateTexture(0);
      WebGPU.Internals.jsObjectInsert(ptr, device.createTexture(desc));
      return ptr;
    };

  
  var _wgpuDeviceGetLimits = (devicePtr, limitsOutPtr) => {
      var device = WebGPU.getJsObject(devicePtr);
      WebGPU.fillLimitStruct(device.limits, limitsOutPtr);
      return 1;
    };

  
  
  
  
  var _wgpuInstanceCreateSurface = (instancePtr, descriptor) => {
      
      var nextInChainPtr = HEAPU32[((descriptor)>>2)];
      var sourceCanvasHTMLSelector = nextInChainPtr;
  
      
      var selectorPtr = HEAPU32[(((sourceCanvasHTMLSelector)+(8))>>2)];
      
      var canvas = findCanvasEventTarget(selectorPtr);
      var context = canvas.getContext('webgpu');
      if (!context) return 0;
  
      context.surfaceLabelWebGPU = WebGPU.makeStringFromOptionalStringView(
        descriptor + 4
      );
  
      var ptr = _emwgpuCreateSurface(0);
      WebGPU.Internals.jsObjectInsert(ptr, context);
      return ptr;
    };

  
  
  var _wgpuQueueSubmit = (queuePtr, commandCount, commands) => {
      var queue = WebGPU.getJsObject(queuePtr);
      var cmds = Array.from(HEAP32.subarray((((commands)>>2)), ((commands + commandCount * 4)>>2)),
        (id) => WebGPU.getJsObject(id));
      queue.submit(cmds);
    };

  
  
  
  function _wgpuQueueWriteBuffer(queuePtr, bufferPtr, bufferOffset, data, size) {
    bufferOffset = bigintToI53Checked(bufferOffset);
  
  
      var queue = WebGPU.getJsObject(queuePtr);
      var buffer = WebGPU.getJsObject(bufferPtr);
      // There is a size limitation for ArrayBufferView. Work around by passing in a subarray
      // instead of the whole heap. crbug.com/1201109
      var subarray = HEAPU8.subarray(data, data + size);
      queue.writeBuffer(buffer, bufferOffset, subarray, 0, size);
    ;
  }

  
  
  var _wgpuQueueWriteTexture = (queuePtr, destinationPtr, data, dataSize, dataLayoutPtr, writeSizePtr) => {
      var queue = WebGPU.getJsObject(queuePtr);
  
      var destination = WebGPU.makeTexelCopyTextureInfo(destinationPtr);
      var dataLayout = WebGPU.makeTexelCopyBufferLayout(dataLayoutPtr);
      var writeSize = WebGPU.makeExtent3D(writeSizePtr);
      // This subarray isn't strictly necessary, but helps work around an issue
      // where Chromium makes a copy of the entire heap. crbug.com/1134457
      var subarray = HEAPU8.subarray(data, data + dataSize);
      queue.writeTexture(destination, subarray, dataLayout, writeSize);
    };

  
  var _wgpuRenderPassEncoderDraw = (passPtr, vertexCount, instanceCount, firstVertex, firstInstance) => {
      
      
      firstVertex >>>= 0;
      firstInstance >>>= 0;
      var pass = WebGPU.getJsObject(passPtr);
      pass.draw(vertexCount, instanceCount, firstVertex, firstInstance);
    };

  
  var _wgpuRenderPassEncoderDrawIndexed = (passPtr, indexCount, instanceCount, firstIndex, baseVertex, firstInstance) => {
      
      
      firstIndex >>>= 0;
      firstInstance >>>= 0;
      var pass = WebGPU.getJsObject(passPtr);
      pass.drawIndexed(indexCount, instanceCount, firstIndex, baseVertex, firstInstance);
    };

  
  var _wgpuRenderPassEncoderEnd = (encoderPtr) => {
      var encoder = WebGPU.getJsObject(encoderPtr);
      encoder.end();
    };

  
  var _wgpuRenderPassEncoderPopDebugGroup = (encoderPtr) => {
      var encoder = WebGPU.getJsObject(encoderPtr);
      encoder.popDebugGroup();
    };

  
  var _wgpuRenderPassEncoderPushDebugGroup = (encoderPtr, groupLabelPtr) => {
      var encoder = WebGPU.getJsObject(encoderPtr);
      encoder.pushDebugGroup(WebGPU.makeStringFromStringView(groupLabelPtr));
    };

  
  
  var _wgpuRenderPassEncoderSetBindGroup = (passPtr, groupIndex, groupPtr, dynamicOffsetCount, dynamicOffsetsPtr) => {
      
      var pass = WebGPU.getJsObject(passPtr);
      var group = WebGPU.getJsObject(groupPtr);
      if (dynamicOffsetCount == 0) {
        pass.setBindGroup(groupIndex, group);
      } else {
        pass.setBindGroup(groupIndex, group, HEAPU32, ((dynamicOffsetsPtr)>>2), dynamicOffsetCount);
      }
    };

  
  var _wgpuRenderPassEncoderSetBlendConstant = (passPtr, colorPtr) => {
      var pass = WebGPU.getJsObject(passPtr);
      var color = WebGPU.makeColor(colorPtr);
      pass.setBlendConstant(color);
    };

  
  
  function _wgpuRenderPassEncoderSetIndexBuffer(passPtr, bufferPtr, format, offset, size) {
    offset = bigintToI53Checked(offset);
    size = bigintToI53Checked(size);
  
  
      var pass = WebGPU.getJsObject(passPtr);
      var buffer = WebGPU.getJsObject(bufferPtr);
      if (size == -1) size = undefined;
      pass.setIndexBuffer(buffer, WebGPU.IndexFormat[format], offset, size);
    ;
  }

  
  var _wgpuRenderPassEncoderSetPipeline = (passPtr, pipelinePtr) => {
      var pass = WebGPU.getJsObject(passPtr);
      var pipeline = WebGPU.getJsObject(pipelinePtr);
      pass.setPipeline(pipeline);
    };

  
  var _wgpuRenderPassEncoderSetScissorRect = (passPtr, x, y, w, h) => {
      
      
      
      
      var pass = WebGPU.getJsObject(passPtr);
      pass.setScissorRect(x, y, w, h);
    };

  
  
  function _wgpuRenderPassEncoderSetVertexBuffer(passPtr, slot, bufferPtr, offset, size) {
    offset = bigintToI53Checked(offset);
    size = bigintToI53Checked(size);
  
  
      
      var pass = WebGPU.getJsObject(passPtr);
      var buffer = WebGPU.getJsObject(bufferPtr);
      if (size == -1) size = undefined;
      pass.setVertexBuffer(slot, buffer, offset, size);
    ;
  }

  
  var _wgpuRenderPassEncoderSetViewport = (passPtr, x, y, w, h, minDepth, maxDepth) => {
      var pass = WebGPU.getJsObject(passPtr);
      pass.setViewport(x, y, w, h, minDepth, maxDepth);
    };

  
  
  
  var _wgpuSurfaceConfigure = (surfacePtr, config) => {
      
      var context = WebGPU.getJsObject(surfacePtr);
  
      var canvasSize = [
        HEAPU32[(((config)+(24))>>2)],
        HEAPU32[(((config)+(28))>>2)]
      ];
  
      if (canvasSize[0] !== 0) {
        context["canvas"]["width"] = canvasSize[0];
      }
  
      if (canvasSize[1] !== 0) {
        context["canvas"]["height"] = canvasSize[1];
      }
  
      var configuration = {
        "device": WebGPU.getJsObject(HEAPU32[(((config)+(4))>>2)]),
        "format": WebGPU.TextureFormat[HEAP32[(((config)+(8))>>2)]],
        "usage": HEAPU32[(((config)+(16))>>2)],
        "alphaMode": WebGPU.CompositeAlphaMode[HEAP32[(((config)+(40))>>2)]],
      };
  
      var viewFormatCount = HEAPU32[(((config)+(32))>>2)];
      if (viewFormatCount) {
        var viewFormatsPtr = HEAPU32[(((config)+(36))>>2)];
        // viewFormatsPtr pointer to an array of TextureFormat which is an enum of size uint32_t
        configuration['viewFormats'] = Array.from(HEAP32.subarray((((viewFormatsPtr)>>2)), ((viewFormatsPtr + viewFormatCount * 4)>>2)),
          format => WebGPU.TextureFormat[format]);
      }
  
      {
        var nextInChainPtr = HEAPU32[((config)>>2)];
  
        if (nextInChainPtr !== 0) {
          var sType = HEAP32[(((nextInChainPtr)+(4))>>2)];
          var surfaceColorManagement = nextInChainPtr;
          
          configuration.colorSpace = WebGPU.PredefinedColorSpace[HEAP32[(((surfaceColorManagement)+(8))>>2)]];
          configuration.toneMapping = {
            mode: WebGPU.ToneMappingMode[HEAP32[(((surfaceColorManagement)+(12))>>2)]],
          };
        }
      }
  
      context.configure(configuration);
    };

  
  
  
  
  var _wgpuSurfaceGetCurrentTexture = (surfacePtr, surfaceTexturePtr) => {
      
      var context = WebGPU.getJsObject(surfacePtr);
  
      try {
        var texturePtr = _emwgpuCreateTexture(0);
        WebGPU.Internals.jsObjectInsert(texturePtr, context.getCurrentTexture());
        HEAPU32[(((surfaceTexturePtr)+(4))>>2)] = texturePtr;
        HEAP32[(((surfaceTexturePtr)+(8))>>2)] = 1;
      } catch (ex) {
        HEAPU32[(((surfaceTexturePtr)+(4))>>2)] = 0;
        HEAP32[(((surfaceTexturePtr)+(8))>>2)] = 6;
      }
    };

  
  var _wgpuSurfaceUnconfigure = (surfacePtr) => {
      var context = WebGPU.getJsObject(surfacePtr);
      context.unconfigure();
    };

  
  
  
  
  var _wgpuTextureCreateView = (texturePtr, descriptor) => {
      var desc;
      if (descriptor) {
        var swizzle;
        var nextInChainPtr = HEAPU32[((descriptor)>>2)];
        if (nextInChainPtr !== 0) {
          var sType = HEAP32[(((nextInChainPtr)+(4))>>2)];
          var swizzleDescriptor = nextInChainPtr;
          
          var swizzlePtr = swizzleDescriptor + 8;
          var r = WebGPU.ComponentSwizzle[HEAP32[((swizzlePtr)>>2)]] || 'r';
          var g = WebGPU.ComponentSwizzle[HEAP32[(((swizzlePtr)+(4))>>2)]] || 'g';
          var b = WebGPU.ComponentSwizzle[HEAP32[(((swizzlePtr)+(8))>>2)]] || 'b';
          var a = WebGPU.ComponentSwizzle[HEAP32[(((swizzlePtr)+(12))>>2)]] || 'a';
          swizzle = `${r}${g}${b}${a}`;
        }
  
        var mipLevelCount = HEAPU32[(((descriptor)+(24))>>2)];
        var arrayLayerCount = HEAPU32[(((descriptor)+(32))>>2)];
        desc = {
          "label": WebGPU.makeStringFromOptionalStringView(
            descriptor + 4),
          "format": WebGPU.TextureFormat[HEAP32[(((descriptor)+(12))>>2)]],
          "dimension": WebGPU.TextureViewDimension[HEAP32[(((descriptor)+(16))>>2)]],
          "baseMipLevel": HEAPU32[(((descriptor)+(20))>>2)],
          "mipLevelCount": mipLevelCount === 4294967295 ? undefined : mipLevelCount,
          "baseArrayLayer": HEAPU32[(((descriptor)+(28))>>2)],
          "arrayLayerCount": arrayLayerCount === 4294967295 ? undefined : arrayLayerCount,
          "aspect": WebGPU.TextureAspect[HEAP32[(((descriptor)+(36))>>2)]],
          "usage": HEAPU32[(((descriptor)+(40))>>2)],
          "swizzle": swizzle,
        };
      }
  
      var texture = WebGPU.getJsObject(texturePtr);
      var ptr = _emwgpuCreateTextureView(0);
      WebGPU.Internals.jsObjectInsert(ptr, texture.createView(desc));
      return ptr;
    };

  
  var _wgpuTextureGetFormat = (texturePtr) => {
      var texture = WebGPU.getJsObject(texturePtr);
      // Should return the enum integer instead of string.
      return WebGPU.TextureFormat.indexOf(texture.format);
    };

  
  var _wgpuTextureGetHeight = (texturePtr) => {
      var texture = WebGPU.getJsObject(texturePtr);
      return texture.height;
    };

  
  var _wgpuTextureGetWidth = (texturePtr) => {
      var texture = WebGPU.getJsObject(texturePtr);
      return texture.width;
    };






  var autoResumeAudioContext = (ctx) => {
      for (var event of ['keydown', 'mousedown', 'touchstart']) {
        for (var element of [document, document.getElementById('canvas')]) {
          element?.addEventListener(event, () => {
            if (ctx.state === 'suspended') ctx.resume();
          }, { 'once': true });
        }
      }
    };

  var dynCall = (sig, ptr, args = [], promising = false) => {
      var func = getWasmTableEntry(ptr);
      if (promising) {
        func = WebAssembly.promising(func);
      }
      var rtn = func(...args);
  
      function convert(rtn) {
        return rtn;
      }
  
      if (promising) {
        return rtn.then(convert);
      }
      return convert(rtn);
    };



  var writeArrayToMemory = (array, buffer) => {
      HEAP8.set(array, buffer);
    };

  var MEMFS = {
  createBackend(opts) {
        return _wasmfs_create_memory_backend();
      },
  };
  
  
  
  
  var PATH = {
  isAbs:(path) => path.charAt(0) === '/',
  splitPath:(filename) => {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },
  normalizeArray:(parts, allowAboveRoot) => {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up; up--) {
            parts.unshift('..');
          }
        }
        return parts;
      },
  normalize:(path) => {
        var isAbsolute = PATH.isAbs(path),
            trailingSlash = path.slice(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter((p) => !!p), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },
  dirname:(path) => {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.slice(0, -1);
        }
        return root + dir;
      },
  basename:(path) => path && path.match(/([^\/]+|\/)\/*$/)[1],
join:(...paths) => PATH.normalize(paths.join('/')),
join2:(l, r) => PATH.normalize(l + '/' + r),
};



var withStackSave = (f) => {
    var stack = stackSave();
    var ret = f();
    stackRestore(stack);
    return ret;
  };


var readI53FromU64 = (ptr) => {
    return HEAPU32[((ptr)>>2)] + HEAPU32[(((ptr)+(4))>>2)] * 4294967296;
  };



var FS_mknod = (path, mode, dev) => FS.handleError(withStackSave(() => {
    var pathBuffer = stringToUTF8OnStack(path);
    return __wasmfs_mknod(pathBuffer, mode, dev);
  }));
var FS_create = (path, mode = 0o666) => {
    mode &= 4095;
    mode |= 32768;
    return FS_mknod(path, mode, 0);
  };

var FS_fileDataToTypedArray = (data) => {
    if (typeof data === 'string') {
      data = intArrayFromString(data, true);
    }
    if (!data.subarray) {
      data = new Uint8Array(data);
    }
    return data;
  };






var FS_writeFile = (path, data) => {
    var sp = stackSave();
    var pathBuffer = stringToUTF8OnStack(path);
    data = FS_fileDataToTypedArray(data);
    var len = data.length;
    var dataBuffer = _malloc(len);
    HEAPU8.set(data, dataBuffer);
    var ret = __wasmfs_write_file(pathBuffer, dataBuffer, len);
    _free(dataBuffer);
    stackRestore(sp);
    return ret;
  };
var FS_createDataFile = (parent, name, fileData, canRead, canWrite, canOwn) => {
    var pathName = name ? parent + '/' + name : parent;
    var mode = FS_getMode(canRead, canWrite);

    if (!wasmFSPreloadingFlushed) {
      // WasmFS code in the wasm is not ready to be called yet. Cache the
      // files we want to create here in JS, and WasmFS will read them
      // later.
      wasmFSPreloadedFiles.push({pathName, fileData, mode});
    } else {
      // WasmFS is already running, so create the file normally.
      FS_create(pathName, mode);
      FS_writeFile(pathName, fileData);
    }
  };

var asyncLoad = async (url) => {
    var arrayBuffer = await readAsync(url);
    return new Uint8Array(arrayBuffer);
  };



var PATH_FS = {
resolve:(...args) => {
      var resolvedPath = '',
        resolvedAbsolute = false;
      for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        var path = (i >= 0) ? args[i] : FS.cwd();
        // Skip empty and invalid entries
        if (typeof path !== 'string') {
          throw new TypeError('Arguments to path.resolve must be strings');
        } else if (!path) {
          return ''; // an invalid portion invalidates the whole thing
        }
        resolvedPath = path + '/' + resolvedPath;
        resolvedAbsolute = PATH.isAbs(path);
      }
      // At this point the path should be resolved to a full absolute path, but
      // handle relative paths to be safe (might happen when process.cwd() fails)
      resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter((p) => !!p), !resolvedAbsolute).join('/');
      return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
    },
relative:(from, to) => {
      from = PATH_FS.resolve(from).slice(1);
      to = PATH_FS.resolve(to).slice(1);
      function trim(arr) {
        var start = 0;
        for (; start < arr.length; start++) {
          if (arr[start] !== '') break;
        }
        var end = arr.length - 1;
        for (; end >= 0; end--) {
          if (arr[end] !== '') break;
        }
        if (start > end) return [];
        return arr.slice(start, end - start + 1);
      }
      var fromParts = trim(from.split('/'));
      var toParts = trim(to.split('/'));
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
        outputParts.push('..');
      }
      outputParts = outputParts.concat(toParts.slice(samePartsLength));
      return outputParts.join('/');
    },
};


var getUniqueRunDependency = (id) => {
    return id;
  };



var FS_handledByPreloadPlugin = async (byteArray, fullname) => {
    // Ensure plugins are ready.
    if (typeof Browser !== 'undefined') Browser.init();

    for (var plugin of preloadPlugins) {
      if (plugin['canHandle'](fullname)) {
        return plugin['handle'](byteArray, fullname);
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
    var dep = getUniqueRunDependency(`cp ${fullname}`); // might have several active requests for the same fullname
    addRunDependency(dep);

    try {
      var byteArray = url;
      if (typeof url === 'string') {
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


var FS_getMode = (canRead, canWrite) => {
    var mode = 0;
    if (canRead) mode |= 292 | 73;
    if (canWrite) mode |= 146;
    return mode;
  };


var FS_modeStringToFlags = (str) => {
    if (typeof str !== 'string') return str;
    var flagModes = {
      'r': 0,
      'r+': 2,
      'w': 512 | 64 | 1,
      'w+': 512 | 64 | 2,
      'a': 1024 | 64 | 1,
      'a+': 1024 | 64 | 2,
    };
    var flags = flagModes[str];
    if (typeof flags === 'undefined') {
      throw new Error(`Unknown file open mode: ${str}`);
    }
    return flags;
  };



var FS_mkdir = (path, mode = 0o777) => FS.handleError(withStackSave(() => {
    var buffer = stringToUTF8OnStack(path);
    return __wasmfs_mkdir(buffer, mode);
  }));


  /**
   * @param {number=} mode Optionally, the mode to create in. Uses mkdir's
   *                       default if not set.
   */
  var FS_mkdirTree = (path, mode) => {
      var dirs = path.split('/');
      var d = '';
      for (var dir of dirs) {
        if (!dir) continue;
        if (d || PATH.isAbs(path)) d += '/';
        d += dir;
        try {
          FS_mkdir(d, mode);
        } catch(e) {
          if (e.errno != 20) throw e;
        }
      }
    };
  
  
  var FS_unlink = (path) => withStackSave(() => {
      var buffer = stringToUTF8OnStack(path);
      return __wasmfs_unlink(buffer);
    });
  
  
  
  
  
  var wasmFSDevices = {
  };
  
  var wasmFSDeviceStreams = {
  };
  
  
  
  
  
  var FS = {
  ErrnoError:class extends Error {
        name = 'ErrnoError';
        message = 'FS error';
        constructor(code) {
          super();
          this.errno = code
        }
      },
  handleError(returnValue) {
        // Assume errors correspond to negative returnValues
        // since some functions like _wasmfs_open() return positive
        // numbers on success (some callers of this function may need to negate the parameter).
        if (returnValue < 0) {
          throw new FS.ErrnoError(-returnValue);
        }
  
        return returnValue;
      },
  createDataFile(parent, name, fileData, canRead, canWrite, canOwn) {
        FS_createDataFile(parent, name, fileData, canRead, canWrite, canOwn);
      },
  createPath(parent, path, canRead, canWrite) {
        // Cache file path directory names.
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          if (!wasmFSPreloadingFlushed) {
            wasmFSPreloadedDirs.push({parentPath: parent, childName: part});
          } else {
            try {
              FS.mkdir(current);
            } catch (e) {
              if (e.errno != 20) throw e;
            }
          }
          parent = current;
        }
        return current;
      },
  createPreloadedFile(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
        return FS_createPreloadedFile(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish);
      },
  async preloadFile(parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish) {
        return FS_preloadFile(parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish);
      },
  readFile(path, opts = {}) {
        opts.encoding ??= 'binary';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error(`Invalid encoding type "${opts.encoding}"`);
        }
  
        var buf, length;
        // Copy the file into a JS buffer on the heap.
        withStackSave(() => {
          var bufPtr = stackAlloc(4);
          var sizePtr = stackAlloc(4);
          FS.handleError(-__wasmfs_read_file(stringToUTF8OnStack(path), bufPtr, sizePtr));
          buf = HEAPU32[((bufPtr)>>2)];
          length = readI53FromI64(sizePtr);
        });
  
        // Default return type is binary.
        // The buffer contents exist 8 bytes after the returned pointer.
        return opts.encoding === 'utf8' ? UTF8ToString(buf, length) : HEAPU8.slice(buf, buf + length);
      },
  cwd:() => UTF8ToString(__wasmfs_get_cwd()),
  mkdir:(path, mode) => FS_mkdir(path, mode),
  mkdirTree:(path, mode) => FS_mkdirTree(path, mode),
  rmdir:(path) => FS.handleError(
        withStackSave(() => __wasmfs_rmdir(stringToUTF8OnStack(path)))
      ),
  open:(path, flags, mode = 0o666) => withStackSave(() => {
        flags = FS_modeStringToFlags(flags);
        var buffer = stringToUTF8OnStack(path);
        var fd = FS.handleError(__wasmfs_open(buffer, flags, mode));
        return { fd : fd };
      }),
  create:(path, mode) => FS_create(path, mode),
  close:(stream) => FS.handleError(-__wasmfs_close(stream.fd)),
  unlink:(path) => FS_unlink(path),
  chdir:(path) => withStackSave(() => __wasmfs_chdir(stringToUTF8OnStack(path))),
  read(stream, buffer, offset, length, position) {
        var seeking = typeof position !== 'undefined';
  
        var dataBuffer = _malloc(length);
  
        var bytesRead;
        if (seeking) {
          bytesRead = __wasmfs_pread(stream.fd, dataBuffer, length, BigInt(position));
        } else {
          bytesRead = __wasmfs_read(stream.fd, dataBuffer, length);
        }
        if (bytesRead > 0) {
          buffer.set(HEAPU8.subarray(dataBuffer, dataBuffer + bytesRead), offset);
        }
  
        _free(dataBuffer);
        return FS.handleError(bytesRead);
      },
  write(stream, buffer, offset, length, position, canOwn) {
        var seeking = typeof position !== 'undefined';
  
        var dataBuffer = _malloc(length);
        for (var i = 0; i < length; i++) {
          HEAP8[(dataBuffer)+(i)] = buffer[offset + i];
        }
  
        var bytesRead;
        if (seeking) {
          bytesRead = __wasmfs_pwrite(stream.fd, dataBuffer, length, BigInt(position));
        } else {
          bytesRead = __wasmfs_write(stream.fd, dataBuffer, length);
        }
        _free(dataBuffer);
        return FS.handleError(bytesRead);
      },
  writeFile:(path, data) => FS_writeFile(path, data),
  mmap:(stream, length, offset, prot, flags) => {
        var buf = FS.handleError(__wasmfs_mmap(length, prot, flags, stream.fd, BigInt(offset)));
        return { ptr: buf, allocated: true };
      },
  msync:(stream, bufferPtr, offset, length, mmapFlags) => {
        // TODO: assert that stream has the fd corresponding to the mapped buffer (bufferPtr).
        return FS.handleError(__wasmfs_msync(bufferPtr, length, mmapFlags));
      },
  munmap:(addr, length) => (
        FS.handleError(__wasmfs_munmap(addr, length))
      ),
  symlink:(target, linkpath) => withStackSave(() => (
        __wasmfs_symlink(stringToUTF8OnStack(target), stringToUTF8OnStack(linkpath))
      )),
  readlink(path) {
        return withStackSave(() => {
          var bufPtr = stackAlloc(4);
          FS.handleError(__wasmfs_readlink(stringToUTF8OnStack(path), bufPtr));
          var readBuffer = HEAPU32[((bufPtr)>>2)];
          return UTF8ToString(readBuffer);
        });
      },
  statBufToObject(statBuf) {
        // i53/u53 are enough for times and ino in practice.
        return {
            dev: HEAPU32[((statBuf)>>2)],
            mode: HEAPU32[(((statBuf)+(4))>>2)],
            nlink: HEAPU32[(((statBuf)+(8))>>2)],
            uid: HEAPU32[(((statBuf)+(12))>>2)],
            gid: HEAPU32[(((statBuf)+(16))>>2)],
            rdev: HEAPU32[(((statBuf)+(20))>>2)],
            size: readI53FromI64((statBuf)+(24)),
            blksize: HEAP32[(((statBuf)+(32))>>2)],
            blocks: HEAP32[(((statBuf)+(36))>>2)],
            atime: readI53FromI64((statBuf)+(40)),
            mtime: readI53FromI64((statBuf)+(56)),
            ctime: readI53FromI64((statBuf)+(72)),
            ino: readI53FromU64((statBuf)+(88))
        }
      },
  stat(path) {
        return withStackSave(() => {
          var statBuf = stackAlloc(96);
          FS.handleError(__wasmfs_stat(stringToUTF8OnStack(path), statBuf));
          return FS.statBufToObject(statBuf);
        });
      },
  lstat(path) {
        return withStackSave(() => {
          var statBuf = stackAlloc(96);
          FS.handleError(__wasmfs_lstat(stringToUTF8OnStack(path), statBuf));
          return FS.statBufToObject(statBuf);
        });
      },
  chmod(path, mode) {
        return FS.handleError(withStackSave(() => {
          var buffer = stringToUTF8OnStack(path);
          return __wasmfs_chmod(buffer, mode);
        }));
      },
  lchmod(path, mode) {
        return FS.handleError(withStackSave(() => {
          var buffer = stringToUTF8OnStack(path);
          return __wasmfs_lchmod(buffer, mode);
        }));
      },
  fchmod(fd, mode) {
        return FS.handleError(__wasmfs_fchmod(fd, mode));
      },
  utime:(path, atime, mtime) => (
        FS.handleError(withStackSave(() => (
          __wasmfs_utime(stringToUTF8OnStack(path), atime, mtime)
        )))
      ),
  truncate(path, len) {
        return FS.handleError(withStackSave(() => (__wasmfs_truncate(stringToUTF8OnStack(path), BigInt(len)))));
      },
  ftruncate(fd, len) {
        return FS.handleError(__wasmfs_ftruncate(fd, BigInt(len)));
      },
  readdir:(path) => withStackSave(() => {
        var pathBuffer = stringToUTF8OnStack(path);
        var entries = [];
        var state = __wasmfs_readdir_start(pathBuffer);
        if (!state) {
          // TODO: The old FS threw an ErrnoError here.
          throw new Error('No such directory');
        }
        var entry;
        while (entry = __wasmfs_readdir_get(state)) {
          entries.push(UTF8ToString(entry));
        }
        __wasmfs_readdir_finish(state);
        return entries;
      }),
  mount:(type, opts, mountpoint) => {
        var backendPointer = type.createBackend(opts);
        return FS.handleError(withStackSave(() => __wasmfs_mount(stringToUTF8OnStack(mountpoint), backendPointer)));
      },
  unmount:(mountpoint) => (
        FS.handleError(withStackSave(() => _wasmfs_unmount(stringToUTF8OnStack(mountpoint))))
      ),
  mknod:(path, mode, dev) => FS_mknod(path, mode, dev),
  makedev:(ma, mi) => ((ma) << 8 | (mi)),
  registerDevice(dev, ops) {
        var backendPointer = _wasmfs_create_jsimpl_backend();
        var definedOps = {
          userRead: ops.read,
          userWrite: ops.write,
  
          allocFile: (file) => {
            wasmFSDeviceStreams[file] = {}
          },
          freeFile: (file) => {
            wasmFSDeviceStreams[file] = undefined;
          },
          getSize: (file) => {},
          // Devices cannot be resized.
          setSize: (file, size) => 0,
          read: (file, buffer, length, offset) => {
            var bufferArray = HEAP8.subarray(buffer, buffer + length);
            try {
              var bytesRead = definedOps.userRead(wasmFSDeviceStreams[file], bufferArray, 0, length, offset);
            } catch (e) {
              return -e.errno;
            }
            HEAP8.set(bufferArray, buffer);
            return bytesRead;
          },
          write: (file, buffer, length, offset) => {
            var bufferArray = HEAP8.subarray(buffer, buffer + length);
            try {
              var bytesWritten = definedOps.userWrite(wasmFSDeviceStreams[file], bufferArray, 0, length, offset);
            } catch (e) {
              return -e.errno;
            }
            HEAP8.set(bufferArray, buffer);
            return bytesWritten;
          },
        };
  
        wasmFS$backends[backendPointer] = definedOps;
        wasmFSDevices[dev] = backendPointer;
      },
  createDevice(parent, name, input, output) {
        if (typeof parent !== 'string') {
          // The old API allowed parents to be objects, which do not exist in WasmFS.
          throw new Error('Only string paths are accepted');
        }
        var path = PATH.join2(parent, name);
        var mode = FS_getMode(!!input, !!output);
        FS.createDevice.major ??= 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device with a set of stream ops to emulate
        // the old API's createDevice().
        FS.registerDevice(dev, {
          read(stream, buffer, offset, length, pos /* ignored */) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              if (result === undefined && !bytesRead) {
                throw new FS.ErrnoError(6);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            return bytesRead;
          },
          write(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },
  mkdev(path, mode, dev) {
        if (typeof dev === 'undefined') {
          dev = mode;
          mode = 0o666;
        }
  
        var deviceBackend = wasmFSDevices[dev];
        if (!deviceBackend) {
          throw new Error('Invalid device ID.');
        }
  
        return FS.handleError(withStackSave(() => (
          _wasmfs_create_file(stringToUTF8OnStack(path), mode, deviceBackend)
        )));
      },
  rename(oldPath, newPath) {
        return FS.handleError(withStackSave(() => {
          var oldPathBuffer = stringToUTF8OnStack(oldPath);
          var newPathBuffer = stringToUTF8OnStack(newPath);
          return __wasmfs_rename(oldPathBuffer, newPathBuffer);
        }));
      },
  llseek(stream, offset, whence) {
        return FS.handleError(__wasmfs_llseek(stream.fd, BigInt(offset), whence));
      },
  };

  var runAndAbortIfError = (func) => {
      try {
        return func();
      } catch (e) {
        abort(e);
      }
    };
  
  
  
  
  
  var Asyncify = {
  instrumentWasmImports(imports) {
        var importPattern = /^(invoke_.*|__asyncjs__.*)$/;
  
        for (let [x, original] of Object.entries(imports)) {
          if (typeof original === 'function') {
            let isAsyncifyImport = original.isAsync || importPattern.test(x);
            // Wrap async imports with a suspending WebAssembly function.
            if (isAsyncifyImport) {
              imports[x] = original = new WebAssembly.Suspending(original);
            }
          }
        }
      },
  instrumentWasmExports(exports) {
        var exportPattern = /^(mkw_gx_pump|main|__main_argc_argv)$/;
        Asyncify.asyncExports = new Set();
        var ret = {};
        for (let [x, original] of Object.entries(exports)) {
          if (typeof original === 'function') {
            // Wrap all exports with a promising WebAssembly function.
            let isAsyncifyExport = exportPattern.test(x);
            if (isAsyncifyExport) {
              Asyncify.asyncExports.add(original);
              original = Asyncify.makeAsyncFunction(original);
            }
            ret[x] = original;
          } else {
            ret[x] = original;
          }
        }
        return ret;
      },
  asyncExports:null,
  isAsyncExport(func) {
        return Asyncify.asyncExports?.has(func);
      },
  handleAsync:async (startAsync) => {
        runtimeKeepalivePush();
        try {
          return await startAsync();
        } finally {
          runtimeKeepalivePop();
        }
      },
  handleSleep:(startAsync) => Asyncify.handleAsync(() => new Promise(startAsync)),
  makeAsyncFunction(original) {
        return WebAssembly.promising(original);
      },
  };





  
  
  
  
  
  
  
    /**
   * @param {number} ptr
   * @param {number} value
   * @param {string} type
   */
  function setValue(ptr, value, type = 'i8') {
    if (type.endsWith('*')) type = '*';
    switch (type) {
      case 'i1': HEAP8[ptr] = value; break;
      case 'i8': HEAP8[ptr] = value; break;
      case 'i16': HEAP16[((ptr)>>1)] = value; break;
      case 'i32': HEAP32[((ptr)>>2)] = value; break;
      case 'i64': HEAP64[((ptr)>>3)] = BigInt(value); break;
      case 'float': HEAPF32[((ptr)>>2)] = value; break;
      case 'double': HEAPF64[((ptr)>>3)] = value; break;
      case '*': HEAPU32[((ptr)>>2)] = value; break;
      default: abort(`invalid type for setValue: ${type}`);
    }
  }






















  var FS_createPath = FS.createPath;




PThread.init();;

      Module['requestAnimationFrame'] = MainLoop.requestAnimationFrame;
      Module['pauseMainLoop'] = MainLoop.pause;
      Module['resumeMainLoop'] = MainLoop.resume;
      MainLoop.init();;
safeSetTimeout.pending = new Map(); safeSetTimeout.nextId = 1;;
for (let i = 0; i < 32; ++i) tempFixedLengthArray.push(new Array(i));;
var miniTempWebGLFloatBuffersStorage = new Float32Array(288);
  // Create GL_POOL_TEMP_BUFFERS_SIZE+1 temporary buffers, for uploads of size 0 through GL_POOL_TEMP_BUFFERS_SIZE inclusive
  for (/**@suppress{duplicate}*/var i = 0; i <= 288; ++i) {
    miniTempWebGLFloatBuffers[i] = miniTempWebGLFloatBuffersStorage.subarray(0, i);
  };
var miniTempWebGLIntBuffersStorage = new Int32Array(288);
  // Create GL_POOL_TEMP_BUFFERS_SIZE+1 temporary buffers, for uploads of size 0 through GL_POOL_TEMP_BUFFERS_SIZE inclusive
  for (/**@suppress{duplicate}*/var i = 0; i <= 288; ++i) {
    miniTempWebGLIntBuffers[i] = miniTempWebGLIntBuffersStorage.subarray(0, i);
  };
// End JS library code

// include: postlibrary.js
// This file is included after the automatically-generated JS library code
// but before the wasm module is created.

{
  // With WASM_ESM_INTEGRATION this has to happen at the top level and not
  // delayed until processModuleArgs.
  initMemory();

  // Begin ATMODULES hooks
  if (Module['noExitRuntime']) noExitRuntime = Module['noExitRuntime'];

if (Module['print']) out = Module['print'];
if (Module['printErr']) err = Module['printErr'];
  // End ATMODULES hooks

  if (Module['arguments']) programArgs = Module['arguments'];
  if (Module['thisProgram']) thisProgram = Module['thisProgram'];

  var preInit = Module['preInit'];
  if (preInit) {
    if (typeof preInit === 'function') Module['preInit'] = preInit = [preInit];
    // Written as a loop so that preInit functions that themselves add more
    // preInit functions.  Is this actually needed?
    while (preInit.length > 0) {
      preInit.shift()();
    }
  }
}

// Begin runtime exports
  Module['addRunDependency'] = addRunDependency;
  Module['removeRunDependency'] = removeRunDependency;
  Module['FS_preloadFile'] = FS_preloadFile;
  Module['FS_unlink'] = FS_unlink;
  Module['FS_createPath'] = FS_createPath;
  Module['FS_createDataFile'] = FS_createDataFile;
  // End runtime exports
  // Begin JS library exports
  // End JS library exports

// end include: postlibrary.js


// proxiedFunctionTable specifies the list of functions that can be called
// either synchronously or asynchronously from other threads in postMessage()d
// or internally queued events. This way a pthread in a Worker can synchronously
// access e.g. the DOM on the main thread.
var proxiedFunctionTable = [
  _proc_exit,
  exitOnMainThread,
  pthreadCreateProxied,
  _emscripten_exit_fullscreen,
  getCanvasSizeMainThread,
  setCanvasElementSizeMainThread,
  _emscripten_exit_pointerlock,
  _emscripten_get_device_pixel_ratio,
  _emscripten_get_element_css_size,
  _emscripten_get_fullscreen_status,
  _emscripten_get_gamepad_status,
  _emscripten_get_num_gamepads,
  _emscripten_get_screen_size,
  _emscripten_request_fullscreen_strategy,
  _emscripten_request_pointerlock,
  _emscripten_sample_gamepad_data,
  _emscripten_set_beforeunload_callback_on_thread,
  _emscripten_set_blur_callback_on_thread,
  _emscripten_set_devicemotion_callback_on_thread,
  _emscripten_set_element_css_size,
  _emscripten_set_focus_callback_on_thread,
  _emscripten_set_fullscreenchange_callback_on_thread,
  _emscripten_set_gamepadconnected_callback_on_thread,
  _emscripten_set_gamepaddisconnected_callback_on_thread,
  _emscripten_set_keydown_callback_on_thread,
  _emscripten_set_keypress_callback_on_thread,
  _emscripten_set_keyup_callback_on_thread,
  _emscripten_set_orientationchange_callback_on_thread,
  _emscripten_set_pointerlockchange_callback_on_thread,
  _emscripten_set_resize_callback_on_thread,
  _emscripten_set_visibilitychange_callback_on_thread,
  _emscripten_set_wheel_callback_on_thread,
  _emscripten_set_window_title,
  _environ_get,
  _environ_sizes_get,
  _getaddrinfo
];

var ASM_CONSTS = {
  11083248: () => { Module.mkwStartGxPump(); },  
 11083277: () => { console.error('terminate on ' + (typeof document === 'undefined' ? 'worker' : 'main') + ': ' + new Error().stack); },  
 11083396: () => { if (typeof(Module['SDL3']) === 'undefined') { Module['SDL3'] = {}; } var SDL3 = Module['SDL3']; if (typeof(SDL3.JSVarToCPtr) === 'undefined') { SDL3.JSVarToCPtr = function(v) { return v; }; } if (typeof(SDL3.CPtrToHeap32Index) === 'undefined') { SDL3.CPtrToHeap32Index = function(ptr) { return ptr >>> 2; }; } },  
 11083710: ($0) => { var str = UTF8ToString($0) + '\n\n' + 'Abort/Retry/Ignore/AlwaysIgnore? [ariA] :'; var reply = window.prompt(str, "i"); if (reply === null) { reply = "i"; } return reply.length === 1 ? reply.charCodeAt(0) : -1; },  
 11083925: () => { Module['SDL3'].dummy_audio = {}; Module['SDL3'].dummy_audio.timers = []; Module['SDL3'].dummy_audio.timers[0] = undefined; Module['SDL3'].dummy_audio.timers[1] = undefined; },  
 11084102: ($0, $1, $2, $3, $4) => { var a = Module['SDL3'].dummy_audio; if (a.timers[$0] !== undefined) { clearInterval(a.timers[$0]); } a.timers[$0] = setInterval(function() { dynCall('vi', $3, [$4]); }, ($1 / $2) * 1000); },  
 11084294: ($0) => { var a = Module['SDL3'].dummy_audio; if (a.timers[$0] !== undefined) { clearInterval(a.timers[$0]); } a.timers[$0] = undefined; },  
 11084425: ($0) => { window.open(UTF8ToString($0), "_blank") },  
 11084465: () => { if (typeof(AudioContext) !== 'undefined') { return true; } else if (typeof(webkitAudioContext) !== 'undefined') { return true; } return false; },  
 11084612: () => { if ((typeof(navigator.mediaDevices) !== 'undefined') && (typeof(navigator.mediaDevices.getUserMedia) !== 'undefined')) { return true; } else if (typeof(navigator.webkitGetUserMedia) !== 'undefined') { return true; } return false; },  
 11084846: () => { var SDL3 = Module['SDL3']; if (typeof(SDL3.audio_playback) === 'undefined') { SDL3.audio_playback = {}; } if (typeof(SDL3.audio_recording) === 'undefined') { SDL3.audio_recording = {}; } if (!SDL3.audioContext) { if (typeof(AudioContext) !== 'undefined') { SDL3.audioContext = new AudioContext(); } else if (typeof(webkitAudioContext) !== 'undefined') { SDL3.audioContext = new webkitAudioContext(); } if (SDL3.audioContext) { if ((typeof navigator.userActivation) === 'undefined') { autoResumeAudioContext(SDL3.audioContext); } } } return (SDL3.audioContext !== undefined); },  
 11085425: () => { return Module['SDL3'].audioContext.sampleRate; },  
 11085476: ($0, $1, $2, $3) => { var SDL3 = Module['SDL3']; var have_microphone = function(stream) { if (SDL3.audio_recording.silenceTimer !== undefined) { clearInterval(SDL3.audio_recording.silenceTimer); SDL3.audio_recording.silenceTimer = undefined; SDL3.audio_recording.silenceBuffer = undefined } SDL3.audio_recording.mediaStreamNode = SDL3.audioContext.createMediaStreamSource(stream); SDL3.audio_recording.scriptProcessorNode = SDL3.audioContext.createScriptProcessor($1, $0, 1); SDL3.audio_recording.scriptProcessorNode.onaudioprocess = function(audioProcessingEvent) { if ((SDL3 === undefined) || (SDL3.audio_recording === undefined)) { return; } audioProcessingEvent.outputBuffer.getChannelData(0).fill(0.0); SDL3.audio_recording.currentRecordingBuffer = audioProcessingEvent.inputBuffer; dynCall('ip', $2, [$3]); }; SDL3.audio_recording.mediaStreamNode.connect(SDL3.audio_recording.scriptProcessorNode); SDL3.audio_recording.scriptProcessorNode.connect(SDL3.audioContext.destination); SDL3.audio_recording.stream = stream; }; var no_microphone = function(error) { }; SDL3.audio_recording.silenceBuffer = SDL3.audioContext.createBuffer($0, $1, SDL3.audioContext.sampleRate); SDL3.audio_recording.silenceBuffer.getChannelData(0).fill(0.0); var silence_callback = function() { SDL3.audio_recording.currentRecordingBuffer = SDL3.audio_recording.silenceBuffer; dynCall('ip', $2, [$3]); }; SDL3.audio_recording.silenceTimer = setInterval(silence_callback, ($1 / SDL3.audioContext.sampleRate) * 1000); if ((navigator.mediaDevices !== undefined) && (navigator.mediaDevices.getUserMedia !== undefined)) { navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(have_microphone).catch(no_microphone); } else if (navigator.webkitGetUserMedia !== undefined) { navigator.webkitGetUserMedia({ audio: true, video: false }, have_microphone, no_microphone); } },  
 11087317: ($0, $1, $2, $3) => { var SDL3 = Module['SDL3']; SDL3.audio_playback.scriptProcessorNode = SDL3.audioContext['createScriptProcessor']($1, 0, $0); SDL3.audio_playback.scriptProcessorNode['onaudioprocess'] = function (e) { if ((SDL3 === undefined) || (SDL3.audio_playback === undefined)) { return; } if (SDL3.audio_playback.silenceTimer !== undefined) { clearInterval(SDL3.audio_playback.silenceTimer); SDL3.audio_playback.silenceTimer = undefined; SDL3.audio_playback.silenceBuffer = undefined; } SDL3.audio_playback.currentPlaybackBuffer = e['outputBuffer']; dynCall('ip', $2, [$3]); }; SDL3.audio_playback.scriptProcessorNode['connect'](SDL3.audioContext['destination']); if (SDL3.audioContext.state === 'suspended') { SDL3.audio_playback.silenceBuffer = SDL3.audioContext.createBuffer($0, $1, SDL3.audioContext.sampleRate); SDL3.audio_playback.silenceBuffer.getChannelData(0).fill(0.0); var silence_callback = function() { if ((typeof navigator.userActivation) !== 'undefined') { if (navigator.userActivation.hasBeenActive) { SDL3.audioContext.resume(); } } SDL3.audio_playback.currentPlaybackBuffer = SDL3.audio_playback.silenceBuffer; dynCall('ip', $2, [$3]); SDL3.audio_playback.currentPlaybackBuffer = undefined; }; SDL3.audio_playback.silenceTimer = setInterval(silence_callback, ($1 / SDL3.audioContext.sampleRate) * 1000); } },  
 11088633: ($0) => { var SDL3 = Module['SDL3']; if ($0) { if (SDL3.audio_recording.silenceTimer !== undefined) { clearInterval(SDL3.audio_recording.silenceTimer); } if (SDL3.audio_recording.stream !== undefined) { var tracks = SDL3.audio_recording.stream.getAudioTracks(); for (var i = 0; i < tracks.length; i++) { SDL3.audio_recording.stream.removeTrack(tracks[i]); } } if (SDL3.audio_recording.scriptProcessorNode !== undefined) { SDL3.audio_recording.scriptProcessorNode.onaudioprocess = function(audioProcessingEvent) {}; SDL3.audio_recording.scriptProcessorNode.disconnect(); } if (SDL3.audio_recording.mediaStreamNode !== undefined) { SDL3.audio_recording.mediaStreamNode.disconnect(); } SDL3.audio_recording = undefined; } else { if (SDL3.audio_playback.scriptProcessorNode != undefined) { SDL3.audio_playback.scriptProcessorNode.disconnect(); } if (SDL3.audio_playback.silenceTimer !== undefined) { clearInterval(SDL3.audio_playback.silenceTimer); } SDL3.audio_playback = undefined; } if ((SDL3.audioContext !== undefined) && (SDL3.audio_playback === undefined) && (SDL3.audio_recording === undefined)) { SDL3.audioContext.close(); SDL3.audioContext = undefined; } },  
 11089789: ($0, $1) => { var SDL3 = Module['SDL3']; var buf = SDL3.CPtrToHeap32Index($0); var numChannels = SDL3.audio_playback.currentPlaybackBuffer['numberOfChannels']; for (var c = 0; c < numChannels; ++c) { var channelData = SDL3.audio_playback.currentPlaybackBuffer['getChannelData'](c); if (channelData.length != $1) { throw 'Web Audio playback buffer length mismatch! Destination size: ' + channelData.length + ' samples vs expected ' + $1 + ' samples!'; } for (var j = 0; j < $1; ++j) { channelData[j] = HEAPF32[buf + (j * numChannels + c)]; } } },  
 11090322: ($0, $1) => { var SDL3 = Module['SDL3']; var numChannels = SDL3.audio_recording.currentRecordingBuffer.numberOfChannels; for (var c = 0; c < numChannels; ++c) { var channelData = SDL3.audio_recording.currentRecordingBuffer.getChannelData(c); if (channelData.length != $1) { throw 'Web Audio recording buffer length mismatch! Destination size: ' + channelData.length + ' samples vs expected ' + $1 + ' samples!'; } if (numChannels == 1) { for (var j = 0; j < $1; ++j) { setValue($0 + (j * 4), channelData[j], 'float'); } } else { for (var j = 0; j < $1; ++j) { setValue($0 + (((j * numChannels) + c) * 4), channelData[j], 'float'); } } } },  
 11090949: () => { Module['SDL3'].camera = {}; },  
 11090981: () => { return (navigator.mediaDevices === undefined) ? 0 : 1; },  
 11091040: ($0, $1, $2, $3, $4) => { const device = $0; const w = $1; const h = $2; const framerate_numerator = $3; const framerate_denominator = $4; const outcome = Module._SDLEmscriptenCameraPermissionOutcome; const iterate = Module._SDLEmscriptenThreadIterate; const constraints = {}; if ((w <= 0) || (h <= 0)) { constraints.video = true; } else { constraints.video = {}; constraints.video.width = w; constraints.video.height = h; } if ((framerate_numerator > 0) && (framerate_denominator > 0)) { var fps = framerate_numerator / framerate_denominator; constraints.video.frameRate = { ideal: fps }; } function grabNextCameraFrame() { const SDL3 = Module['SDL3']; if ((typeof(SDL3) === 'undefined') || (typeof(SDL3.camera) === 'undefined') || (typeof(SDL3.camera.stream) === 'undefined')) { return; } const nextframems = SDL3.camera.next_frame_time; const now = performance.now(); if (now >= nextframems) { iterate(device); while (SDL3.camera.next_frame_time < now) { SDL3.camera.next_frame_time += SDL3.camera.fpsincrms; } } requestAnimationFrame(grabNextCameraFrame); } navigator.mediaDevices.getUserMedia(constraints) .then((stream) => { const settings = stream.getVideoTracks()[0].getSettings(); const actualw = settings.width; const actualh = settings.height; const actualfps = settings.frameRate; console.log("Camera is opened! Actual spec: (" + actualw + "x" + actualh + "), fps=" + actualfps); if (outcome(device, 1, actualw, actualh, actualfps)) { const video = document.createElement("video"); video.width = actualw; video.height = actualh; video.style.display = 'none'; video.srcObject = stream; const canvas = document.createElement("canvas"); canvas.width = actualw; canvas.height = actualh; canvas.style.display = 'none'; const ctx2d = canvas.getContext('2d'); const SDL3 = Module['SDL3']; SDL3.camera.width = actualw; SDL3.camera.height = actualh; SDL3.camera.fps = actualfps; SDL3.camera.fpsincrms = 1000.0 / actualfps; SDL3.camera.stream = stream; SDL3.camera.video = video; SDL3.camera.canvas = canvas; SDL3.camera.ctx2d = ctx2d; SDL3.camera.next_frame_time = performance.now(); video.play(); video.addEventListener('loadedmetadata', () => { grabNextCameraFrame(); }); } }) .catch((err) => { console.error("Tried to open camera but it threw an error! " + err.name + ": " + err.message); outcome(device, 0, 0, 0, 0); }); },  
 11093346: () => { const SDL3 = Module['SDL3']; if ((typeof(SDL3) === 'undefined') || (typeof(SDL3.camera) === 'undefined') || (typeof(SDL3.camera.stream) === 'undefined')) { return; } SDL3.camera.stream.getTracks().forEach(track => track.stop()); SDL3.camera = {}; },  
 11093597: ($0, $1, $2) => { const w = $0; const h = $1; const rgba = $2; const SDL3 = Module['SDL3']; if ((typeof(SDL3) === 'undefined') || (typeof(SDL3.camera) === 'undefined') || (typeof(SDL3.camera.ctx2d) === 'undefined')) { return 0; } SDL3.camera.ctx2d.drawImage(SDL3.camera.video, 0, 0, w, h); const imgrgba = SDL3.camera.ctx2d.getImageData(0, 0, w, h).data; HEAPU8.set(imgrgba, rgba); return 1; },  
 11093975: () => { if (typeof(Module['SDL3']) !== 'undefined') { Module['SDL3'].camera = undefined; } },  
 11094062: ($0) => { let gamepad = navigator['getGamepads']()[$0]; if (!gamepad) { return 0; } let vendor_str = 'Vendor: '; if (gamepad['id']['indexOf'](vendor_str) > 0) { let vendor_str_index = gamepad['id']['indexOf'](vendor_str) + vendor_str['length']; return parseInt(gamepad['id']['substr'](vendor_str_index, 4), 16); } let id_split = gamepad['id']['split']('-'); if (id_split['length'] > 1 && !isNaN(parseInt(id_split[0], 16))) { return parseInt(id_split[0], 16); } return 0; },  
 11094527: ($0) => { let gamepad = navigator['getGamepads']()[$0]; if (!gamepad) { return 0; } let product_str = 'Product: '; if (gamepad['id']['indexOf'](product_str) > 0) { let product_str_index = gamepad['id']['indexOf'](product_str) + product_str['length']; return parseInt(gamepad['id']['substr'](product_str_index, 4), 16); } let id_split = gamepad['id']['split']('-'); if (id_split['length'] > 1 && !isNaN(parseInt(id_split[1], 16))) { return parseInt(id_split[1], 16); } return 0; },  
 11094999: ($0) => { let gamepad = navigator['getGamepads']()[$0]; if (!gamepad) { return 0; } return gamepad['id']['toLowerCase']()['indexOf']('xinput') >= 0; },  
 11095142: () => { const os = ([ 'Android', 'Linux', 'iPhone', 'Macintosh', 'Windows', ]); const ua = navigator['userAgent']; for (let i = 0; i < os.length; i++) { if (ua['indexOf'](os[i]) >= 0) { return i + 1; } } return 0; },  
 11095352: ($0) => { let gamepad = navigator['getGamepads']()[$0]; return gamepad && gamepad['vibrationActuator'] && gamepad['vibrationActuator']['effects'] && gamepad['vibrationActuator']['effects']['includes']('dual-rumble'); },  
 11095563: ($0) => { let gamepad = navigator['getGamepads']()[$0]; return gamepad && gamepad['vibrationActuator'] && gamepad['vibrationActuator']['effects'] && gamepad['vibrationActuator']['effects']['includes']('trigger-rumble'); },  
 11095777: ($0, $1, $2, $3, $4) => { let gamepad = navigator['getGamepads']()[$0]; if (!gamepad) { return false; } gamepad['vibrationActuator']['playEffect']('dual-rumble', { 'startDelay': 0, 'duration': 3000, 'weakMagnitude': $1 / 0xFFFF, 'strongMagnitude': $2 / 0xFFFF, 'leftTrigger': $3 / 0xFFFF, 'rightTrigger': $4 / 0xFFFF, }); return true; },  
 11096090: ($0, $1, $2, $3) => { var w = $0; var h = $1; var pixels = $2; var canvasId = UTF8ToString($3); var canvas = document.querySelector(canvasId); var SDL3 = Module['SDL3']; if (SDL3.ctxCanvas !== canvas) { SDL3.ctx = Browser.createContext(canvas, false, true); if (!SDL3.ctx) { return false; } SDL3.ctxCanvas = canvas; } if (SDL3.w !== w || SDL3.h !== h || SDL3.imageCtx !== SDL3.ctx) { SDL3.image = SDL3.ctx.createImageData(w, h); SDL3.w = w; SDL3.h = h; SDL3.imageCtx = SDL3.ctx; } var data = SDL3.image.data; var src = pixels / 4; if (SDL3.data32Data !== data) { SDL3.data32 = new Int32Array(data.buffer); SDL3.data32Data = data; } var data32 = SDL3.data32; data32.set(HEAP32.subarray(src, src + data32.length)); SDL3.ctx.putImageData(SDL3.image, 0, 0); return true; },  
 11096839: () => { var SDL3 = Module['SDL3']; SDL3['mouse_x'] = 0; SDL3['mouse_y'] = 0; SDL3['mouse_buttons'] = []; for (var i = 0; i < 5; ++i) { SDL3['mouse_buttons'][i] = false; } document.addEventListener('mousemove', function(e) { var SDL3 = Module['SDL3']; SDL3['mouse_x'] = e.clientX; SDL3['mouse_y'] = e.clientY; }); document.addEventListener('mousedown', function(e) { var SDL3 = Module['SDL3']; if (0 <= e.button && e.button < SDL3['mouse_buttons'].length) { SDL3['mouse_buttons'][e.button] = true; } }); document.addEventListener('mouseup', function(e) { var SDL3 = Module['SDL3']; if (0 <= e.button && e.button < SDL3['mouse_buttons'].length) { SDL3['mouse_buttons'][e.button] = false; } }); },  
 11097527: ($0, $1, $2, $3, $4) => { var w = $0; var h = $1; var hot_x = $2; var hot_y = $3; var pixels = $4; var canvas = document.createElement("canvas"); canvas.width = w; canvas.height = h; var ctx = canvas.getContext("2d"); var image = ctx.createImageData(w, h); var data = image.data; var src = pixels / 4; var data32 = new Int32Array(data.buffer); data32.set(HEAP32.subarray(src, src + data32.length)); ctx.putImageData(image, 0, 0); var url = hot_x === 0 && hot_y === 0 ? "url(" + canvas.toDataURL() + "), auto" : "url(" + canvas.toDataURL() + ") " + hot_x + " " + hot_y + ", auto"; var urlBuf = _SDL_malloc(url.length + 1); stringToUTF8(url, urlBuf, url.length + 1); return urlBuf; },  
 11098185: ($0) => { if (Module['canvas']) { Module['canvas'].style['cursor'] = UTF8ToString($0); } },  
 11098268: () => { if (Module['canvas']) { Module['canvas'].style['cursor'] = 'none'; } },  
 11098337: () => { return Module['SDL3']['mouse_x']; },  
 11098375: () => { return Module['SDL3']['mouse_y']; },  
 11098413: ($0) => { return Module['SDL3']['mouse_buttons'][$0]; },  
 11098461: ($0) => { var data = $0; if (document.sdlEventHandlerLockKeysCheck) { document.removeEventListener("keydown", document.sdlEventHandlerLockKeysCheck); } document.sdlEventHandlerLockKeysCheck = function(event) { if ((event.key != "CapsLock") && (event.key != "NumLock") && (event.key != "ScrollLock")) { _Emscripten_HandleLockKeysCheck(Module['SDL3'].JSVarToCPtr(data), event.getModifierState("CapsLock"), event.getModifierState("NumLock"), event.getModifierState("ScrollLock")); } }; document.addEventListener("keydown", document.sdlEventHandlerLockKeysCheck); },  
 11099015: () => { document.removeEventListener("keydown", document.sdlEventHandlerLockKeysCheck); },  
 11099099: ($0) => { var target = document; if (target) { target.sdlEventHandlerMouseButtonUpGlobal = function(event) { var SDL3 = Module['SDL3']; var d = SDL3.makePointerEventCStruct(0, 0, event); if (d != 0) { _Emscripten_HandleMouseButtonUpGlobal(SDL3.JSVarToCPtr($0), d); _SDL_free(d); } }; target.addEventListener("pointerup", target.sdlEventHandlerMouseButtonUpGlobal); } },  
 11099460: ($0) => { var SDL3 = Module['SDL3']; if (SDL3.makePointerEventCStruct === undefined) { SDL3.makePointerEventCStruct = function(left, top, event) { var ptrtype = 0; if (event.pointerType == "mouse") { ptrtype = 1; } else if (event.pointerType == "touch") { ptrtype = 2; } else if (event.pointerType == "pen") { ptrtype = 3; } else { return 0; } var ptr = _SDL_malloc($0); if (ptr != 0) { var idx = SDL3.CPtrToHeap32Index(ptr); HEAP32[idx++] = ptrtype; HEAP32[idx++] = event.pointerId; HEAP32[idx++] = (typeof(event.button) !== "undefined") ? event.button : -1; HEAP32[idx++] = event.buttons; HEAP32[idx++] = (event.type == "pointerdown") ? 1 : 0; HEAPF32[idx++] = event.movementX; HEAPF32[idx++] = event.movementY; HEAPF32[idx++] = event.clientX - left; HEAPF32[idx++] = event.clientY - top; if (ptrtype == 3) { HEAPF32[idx++] = event.pressure; HEAPF32[idx++] = event.tangentialPressure; HEAPF32[idx++] = event.tiltX; HEAPF32[idx++] = event.tiltY; HEAPF32[idx++] = event.twist; } } return ptr; }; } },  
 11100452: ($0) => { var id = UTF8ToString($0); try { var canvas = document.querySelector(id); if (canvas) { return canvas === document.activeElement; } } catch (e) { } return false; },  
 11100618: () => { return document.hasFocus(); },  
 11100650: () => { var target = document; if (target) { target.removeEventListener("pointerup", target.sdlEventHandlerMouseButtonUpGlobal); target.sdlEventHandlerMouseButtonUpGlobal = undefined; } },  
 11100832: () => { return document.body.clientWidth; },  
 11100870: () => { return document.body.clientHeight; },  
 11100909: () => { return window.innerWidth; },  
 11100939: () => { return window.innerHeight; },  
 11100970: () => { return window.outerWidth; },  
 11101000: () => { return window.outerHeight; },  
 11101031: () => { return window.pageXOffset; },  
 11101062: () => { return window.pageYOffset; },  
 11101093: ($0, $1) => { var target = document.querySelector(UTF8ToString($1)); if (target) { var SDL3 = Module['SDL3']; var data = $0; target.sdlEventHandlerPointerEnter = function(event) { var rect = target.getBoundingClientRect(); var d = SDL3.makePointerEventCStruct(rect.left, rect.top, event); if (d != 0) { _Emscripten_HandlePointerEnter(SDL3.JSVarToCPtr(data), d); _SDL_free(d); } }; target.sdlEventHandlerPointerLeave = function(event) { var rect = target.getBoundingClientRect(); var d = SDL3.makePointerEventCStruct(rect.left, rect.top, event); if (d != 0) { _Emscripten_HandlePointerLeave(SDL3.JSVarToCPtr(data), d); _SDL_free(d); } }; target.sdlEventHandlerPointerGeneric = function(event) { var rect = target.getBoundingClientRect(); var d = SDL3.makePointerEventCStruct(rect.left, rect.top, event); if (d != 0) { _Emscripten_HandlePointerGeneric(SDL3.JSVarToCPtr(data), d); _SDL_free(d); } }; target.style.touchAction = "none"; target.addEventListener("pointerenter", target.sdlEventHandlerPointerEnter); target.addEventListener("pointerleave", target.sdlEventHandlerPointerLeave); target.addEventListener("pointercancel", target.sdlEventHandlerPointerLeave); target.addEventListener("pointerdown", target.sdlEventHandlerPointerGeneric); target.addEventListener("pointermove", target.sdlEventHandlerPointerGeneric); target.addEventListener("pointerup", target.sdlEventHandlerPointerGeneric); } },  
 11102481: ($0, $1, $2) => { var target = document.querySelector(UTF8ToString($1)); if (target) { var data = $0; var SDL3 = Module['SDL3']; var makeDropEventCStruct = function(event) { var ptr = 0; ptr = _SDL_malloc($2); if (ptr != 0) { var idx = ptr >> 2; var rect = target.getBoundingClientRect(); HEAP32[idx++] = event.clientX - rect.left; HEAP32[idx++] = event.clientY - rect.top; } return ptr; }; SDL3.eventHandlerDropDragover = function(event) { event.preventDefault(); var d = makeDropEventCStruct(event); if (d != 0) { _Emscripten_SendDragEvent(data, d); _SDL_free(d); } }; target.addEventListener("dragover", SDL3.eventHandlerDropDragover); SDL3.drop_count = 0; try { FS.mkdir("/tmp/filedrop"); } catch (e) {} SDL3.eventHandlerDropDrop = function(event) { event.preventDefault(); if (event.dataTransfer.types.includes("text/plain")) { let plain_text = stringToNewUTF8(event.dataTransfer.getData("text/plain")); _Emscripten_SendDragTextEvent(data, plain_text); _Emscripten_force_free(plain_text); } else if (event.dataTransfer.types.includes("Files")) { let files_read = 0; const files_to_read = event.dataTransfer.files.length; for (let i = 0; i < files_to_read; i++) { const file = event.dataTransfer.files.item(i); const file_reader = new FileReader(); file_reader.readAsArrayBuffer(file); file_reader.onload = function(event) { const fs_dropdir = `/tmp/filedrop/${SDL3.drop_count}`; SDL3.drop_count += 1; const fs_filepath = `${fs_dropdir}/${file.name}`; const c_fs_filepath = stringToNewUTF8(fs_filepath); const contents_array8 = new Uint8Array(event.target.result); try { FS.mkdir(fs_dropdir); var stream = FS.open(fs_filepath, "w"); FS.write(stream, contents_array8, 0, contents_array8.length, 0); FS.close(stream); _Emscripten_SendDragFileEvent(data, c_fs_filepath); } catch (e) { } _Emscripten_force_free(c_fs_filepath); onFileRead(); }; file_reader.onerror = function(event) { onFileRead(); }; } function onFileRead() { ++files_read; if (files_read === files_to_read) { _Emscripten_SendDragCompleteEvent(data); } } } _Emscripten_SendDragCompleteEvent(data); }; target.addEventListener("drop", SDL3.eventHandlerDropDrop); SDL3.eventHandlerDropDragend = function(event) { event.preventDefault(); _Emscripten_SendDragCompleteEvent(data); }; target.addEventListener("dragend", SDL3.eventHandlerDropDragend); target.addEventListener("dragleave", SDL3.eventHandlerDropDragend); } },  
 11104848: ($0) => { var target = document.querySelector(UTF8ToString($0)); if (target) { var SDL3 = Module['SDL3']; target.removeEventListener("dragleave", SDL3.eventHandlerDropDragend); target.removeEventListener("dragend", SDL3.eventHandlerDropDragend); target.removeEventListener("drop", SDL3.eventHandlerDropDrop); SDL3.drop_count = undefined; function recursive_remove(dirpath) { FS.readdir(dirpath).forEach((filename) => { const p = `${dirpath}/${filename}`; const p_s = FS.stat(p); if (FS.isFile(p_s.mode)) { FS.unlink(p); } else if (FS.isDir(p)) { recursive_remove(p); } }); FS.rmdir(dirpath); }("/tmp/filedrop"); FS.rmdir("/tmp/filedrop"); target.removeEventListener("dragover", SDL3.eventHandlerDropDragover); SDL3.eventHandlerDropDragover = undefined; SDL3.eventHandlerDropDrop = undefined; SDL3.eventHandlerDropDragend = undefined; } },  
 11105678: ($0) => { var target = document.querySelector(UTF8ToString($0)); if (target) { target.removeEventListener("pointerenter", target.sdlEventHandlerPointerEnter); target.removeEventListener("pointerleave", target.sdlEventHandlerPointerLeave); target.removeEventListener("pointercancel", target.sdlEventHandlerPointerLeave); target.removeEventListener("pointerdown", target.sdlEventHandlerPointerGeneric); target.removeEventListener("pointermove", target.sdlEventHandlerPointerGeneric); target.removeEventListener("pointerup", target.sdlEventHandlerPointerGeneric); target.style.touchAction = ""; target.sdlEventHandlerPointerEnter = undefined; target.sdlEventHandlerPointerLeave = undefined; target.sdlEventHandlerPointerGeneric = undefined; } },  
 11106412: () => { if (!window.matchMedia) { return -1; } if (window.matchMedia('(prefers-color-scheme: light)').matches) { return 0; } if (window.matchMedia('(prefers-color-scheme: dark)').matches) { return 1; } return -1; },  
 11106621: () => { if (typeof(Module['SDL3']) !== 'undefined') { var SDL3 = Module['SDL3']; SDL3.themeChangedMatchMedia.removeEventListener('change', SDL3.eventHandlerThemeChanged); SDL3.themeChangedMatchMedia = undefined; SDL3.eventHandlerThemeChanged = undefined; } },  
 11106874: () => { return window.innerWidth; },  
 11106904: () => { return window.innerHeight; },  
 11106935: ($0) => { Module['requestFullscreen'] = function(lockPointer, resizeCanvas) { _requestFullscreenThroughSDL($0); }; },  
 11107044: ($0, $1) => { var pngData = HEAPU8.buffer instanceof ArrayBuffer ? HEAPU8.subarray($0, $0 + $1) : HEAPU8.slice($0, $0 + $1); var blob = new Blob([pngData], {type: 'image/png'}); var url = URL.createObjectURL(blob); var link = document.querySelector("link[rel~='icon']"); if (!link) { link = document.createElement('link'); link.rel = 'icon'; link.type = 'image/png'; document.head.appendChild(link); } if (link.href && link.href.startsWith('blob:')) { URL.revokeObjectURL(link.href); } link.href = url; },  
 11107537: () => { Module['requestFullscreen'] = function(lockPointer, resizeCanvas) {}; },  
 11107611: () => { return window.innerWidth; },  
 11107641: () => { return window.innerHeight; },  
 11107672: ($0) => { var canvas = document.querySelector(UTF8ToString($0)); canvas.SDL3_original_position = canvas.style.position; canvas.SDL3_original_top = canvas.style.top; canvas.SDL3_original_left = canvas.style.left; var div = document.createElement('div'); div.id = 'SDL3_fill_document_background_elements'; div.SDL3_canvas = canvas; div.SDL3_canvas_parent = canvas.parentNode; div.SDL3_canvas_nextsib = canvas.nextSibling; var children = Array.from(document.body.children); for (var child of children) { div.appendChild(child); } document.body.appendChild(div); div.style.display = 'none'; document.body.appendChild(canvas); canvas.style.position = 'fixed'; canvas.style.top = '0'; canvas.style.left = '0'; },  
 11108370: () => { var div = document.getElementById('SDL3_fill_document_background_elements'); if (div) { if (div.SDL3_canvas_nextsib) { div.SDL3_canvas_parent.insertBefore(div.SDL3_canvas, div.SDL3_canvas_nextsib); } else { div.SDL3_canvas_parent.appendChild(div.SDL3_canvas); } while (div.firstChild) { document.body.insertBefore(div.firstChild, div); } div.SDL3_canvas.style.position = div.SDL3_canvas.SDL3_original_position; div.SDL3_canvas.style.top = div.SDL3_canvas.SDL3_original_top; div.SDL3_canvas.style.left = div.SDL3_canvas.SDL3_original_left; div.remove(); } },  
 11108929: () => { if (window.matchMedia) { var SDL3 = Module['SDL3']; SDL3.eventHandlerThemeChanged = function(event) { _Emscripten_SendSystemThemeChangedEvent(); }; SDL3.themeChangedMatchMedia = window.matchMedia('(prefers-color-scheme: dark)'); SDL3.themeChangedMatchMedia.addEventListener('change', SDL3.eventHandlerThemeChanged); } },  
 11109251: ($0, $1, $2, $3, $4) => { var title = UTF8ToString($0); var message = UTF8ToString($1); var background = UTF8ToString($2); var color = UTF8ToString($3); var id = UTF8ToString($4); var dialog = document.createElement("dialog"); dialog.classList.add("SDL3_messagebox"); dialog.id = id; dialog.style.color = color; dialog.style.backgroundColor = background; document.body.append(dialog); var h1 = document.createElement("h1"); h1.innerText = title; dialog.append(h1); var p = document.createElement("p"); p.innerText = message; dialog.append(p); dialog.showModal(); },  
 11109792: ($0, $1, $2, $3, $4, $5, $6, $7) => { var dialog_id = UTF8ToString($0); var text = UTF8ToString($1); var responseId = $2; var clickOnReturn = $3; var clickOnEscape = $4; var border = UTF8ToString($5); var background = UTF8ToString($6); var hovered = UTF8ToString($7); var dialog = document.getElementById(dialog_id); if (!dialog) { return false; } var button = document.createElement("button"); button.innerText = text; button.style.borderColor = border; button.style.backgroundColor = background; dialog.addEventListener('keydown', function(e) { if (clickOnReturn && e.key === "Enter") { e.preventDefault(); button.click(); } else if (clickOnEscape && e.key === "Escape") { e.preventDefault(); button.click(); } }); dialog.addEventListener('cancel', function(e){ e.preventDefault(); }); button.onmouseenter = function(e){ button.style.backgroundColor = hovered; }; button.onmouseleave = function(e){ button.style.backgroundColor = background; }; button.onclick = function(e) { dialog.close(responseId); }; dialog.append(button); return true; },  
 11110801: ($0) => { var dialog_id = UTF8ToString($0); var dialog = document.getElementById(dialog_id); if (!dialog) { return false; } return dialog.open; },  
 11110939: ($0) => { var dialog_id = UTF8ToString($0); var dialog = document.getElementById(dialog_id); if (!dialog) { return 0; } try { return parseInt(dialog.returnValue); } catch(e) { return 0; } },  
 11111121: ($0, $1) => { alert(UTF8ToString($0) + "\n\n" + UTF8ToString($1)); }
};
function __asyncjs__aurora_yield_to_browser() { return Asyncify.handleAsync(async () => { await new Promise((resolve) => { const channel = new MessageChannel(); channel.port1.onmessage = resolve; channel.port2.postMessage(0); }); }); }
__asyncjs__aurora_yield_to_browser.sig = 'v';

// Imports from the Wasm binary.
var _htons,
  _htonl,
  _ntohs,
  _wasmfs_create_file,
  _mkw_gx_pump,
  _mkw_gx_pump_signal,
  _main,
  _SDL_free,
  _malloc,
  _free,
  _pthread_self,
  _SDL_malloc,
  _SDL_calloc,
  _Emscripten_force_free,
  _SDL_realloc,
  _SDLEmscriptenCameraPermissionOutcome,
  _SDLEmscriptenThreadIterate,
  _Emscripten_HandlePointerEnter,
  _Emscripten_HandlePointerLeave,
  _Emscripten_HandlePointerGeneric,
  _Emscripten_HandleMouseButtonUpGlobal,
  _Emscripten_SendDragEvent,
  _Emscripten_SendDragCompleteEvent,
  _Emscripten_SendDragTextEvent,
  _Emscripten_SendDragFileEvent,
  _Emscripten_HandleLockKeysCheck,
  _Emscripten_SendSystemThemeChangedEvent,
  _requestFullscreenThroughSDL,
  _emwgpuCreateBindGroup,
  _emwgpuCreateBindGroupLayout,
  _emwgpuCreateCommandBuffer,
  _emwgpuCreateCommandEncoder,
  _emwgpuCreateComputePassEncoder,
  _emwgpuCreateComputePipeline,
  _emwgpuCreateExternalTexture,
  _emwgpuCreatePipelineLayout,
  _emwgpuCreateQuerySet,
  _emwgpuCreateRenderBundle,
  _emwgpuCreateRenderBundleEncoder,
  _emwgpuCreateRenderPassEncoder,
  _emwgpuCreateRenderPipeline,
  _emwgpuCreateSampler,
  _emwgpuCreateSurface,
  _emwgpuCreateTexture,
  _emwgpuCreateTextureView,
  _emwgpuCreateAdapter,
  _emwgpuImportBuffer,
  _emwgpuCreateDevice,
  _emwgpuCreateQueue,
  _emwgpuCreateShaderModule,
  _emwgpuOnCompilationInfoCompleted,
  _emwgpuOnCreateComputePipelineCompleted,
  _emwgpuOnCreateRenderPipelineCompleted,
  _emwgpuOnDeviceLostCompleted,
  _emwgpuOnMapAsyncCompleted,
  _emwgpuOnPopErrorScopeCompleted,
  _emwgpuOnRequestAdapterCompleted,
  _emwgpuOnRequestDeviceCompleted,
  _emwgpuOnWorkDoneCompleted,
  _emwgpuOnUncapturedError,
  __emscripten_tls_init,
  _emscripten_builtin_memalign,
  __emscripten_run_callback_on_thread,
  __emscripten_thread_init,
  ___set_thread_state,
  __emscripten_thread_crashed,
  _emscripten_proxy_execute_queue,
  _emscripten_proxy_finish,
  __emscripten_run_js_on_main_thread_done,
  __emscripten_run_js_on_main_thread,
  __emscripten_thread_free_data,
  __emscripten_thread_exit,
  __emscripten_check_mailbox,
  _memalign,
  ___trap,
  _emscripten_stack_set_limits,
  __emscripten_stack_restore,
  __emscripten_stack_alloc,
  _emscripten_stack_get_current,
  __wasmfs_fetch_get_file_url,
  __wasmfs_fetch_get_chunk_size,
  __wasmfs_read_file,
  __wasmfs_write_file,
  __wasmfs_mkdir,
  __wasmfs_rmdir,
  __wasmfs_open,
  __wasmfs_mknod,
  __wasmfs_unlink,
  __wasmfs_chdir,
  __wasmfs_symlink,
  __wasmfs_readlink,
  __wasmfs_write,
  __wasmfs_pwrite,
  __wasmfs_chmod,
  __wasmfs_fchmod,
  __wasmfs_lchmod,
  __wasmfs_llseek,
  __wasmfs_rename,
  __wasmfs_read,
  __wasmfs_pread,
  __wasmfs_truncate,
  __wasmfs_ftruncate,
  __wasmfs_close,
  __wasmfs_mmap,
  __wasmfs_msync,
  __wasmfs_munmap,
  __wasmfs_utime,
  __wasmfs_stat,
  __wasmfs_lstat,
  __wasmfs_mount,
  __wasmfs_readdir_start,
  __wasmfs_readdir_get,
  __wasmfs_readdir_finish,
  __wasmfs_get_cwd,
  _wasmfs_create_jsimpl_backend,
  _wasmfs_create_memory_backend,
  __wasmfs_opfs_record_entry,
  _wasmfs_unmount,
  __indirect_function_table,
  wasmTable;


function assignWasmExports(wasmExports) {
  _htons = wasmExports['htons'];
  _htonl = wasmExports['htonl'];
  _ntohs = wasmExports['ntohs'];
  _wasmfs_create_file = wasmExports['wasmfs_create_file'];
  _mkw_gx_pump = Module['_mkw_gx_pump'] = wasmExports['mkw_gx_pump'];
  _mkw_gx_pump_signal = Module['_mkw_gx_pump_signal'] = wasmExports['mkw_gx_pump_signal'];
  _main = Module['_main'] = wasmExports['__main_argc_argv'];
  _SDL_free = Module['_SDL_free'] = wasmExports['SDL_free'];
  _malloc = wasmExports['malloc'];
  _free = wasmExports['free'];
  _pthread_self = wasmExports['pthread_self'];
  _SDL_malloc = Module['_SDL_malloc'] = wasmExports['SDL_malloc'];
  _SDL_calloc = Module['_SDL_calloc'] = wasmExports['SDL_calloc'];
  _Emscripten_force_free = Module['_Emscripten_force_free'] = wasmExports['Emscripten_force_free'];
  _SDL_realloc = Module['_SDL_realloc'] = wasmExports['SDL_realloc'];
  _SDLEmscriptenCameraPermissionOutcome = Module['_SDLEmscriptenCameraPermissionOutcome'] = wasmExports['SDLEmscriptenCameraPermissionOutcome'];
  _SDLEmscriptenThreadIterate = Module['_SDLEmscriptenThreadIterate'] = wasmExports['SDLEmscriptenThreadIterate'];
  _Emscripten_HandlePointerEnter = Module['_Emscripten_HandlePointerEnter'] = wasmExports['Emscripten_HandlePointerEnter'];
  _Emscripten_HandlePointerLeave = Module['_Emscripten_HandlePointerLeave'] = wasmExports['Emscripten_HandlePointerLeave'];
  _Emscripten_HandlePointerGeneric = Module['_Emscripten_HandlePointerGeneric'] = wasmExports['Emscripten_HandlePointerGeneric'];
  _Emscripten_HandleMouseButtonUpGlobal = Module['_Emscripten_HandleMouseButtonUpGlobal'] = wasmExports['Emscripten_HandleMouseButtonUpGlobal'];
  _Emscripten_SendDragEvent = Module['_Emscripten_SendDragEvent'] = wasmExports['Emscripten_SendDragEvent'];
  _Emscripten_SendDragCompleteEvent = Module['_Emscripten_SendDragCompleteEvent'] = wasmExports['Emscripten_SendDragCompleteEvent'];
  _Emscripten_SendDragTextEvent = Module['_Emscripten_SendDragTextEvent'] = wasmExports['Emscripten_SendDragTextEvent'];
  _Emscripten_SendDragFileEvent = Module['_Emscripten_SendDragFileEvent'] = wasmExports['Emscripten_SendDragFileEvent'];
  _Emscripten_HandleLockKeysCheck = Module['_Emscripten_HandleLockKeysCheck'] = wasmExports['Emscripten_HandleLockKeysCheck'];
  _Emscripten_SendSystemThemeChangedEvent = Module['_Emscripten_SendSystemThemeChangedEvent'] = wasmExports['Emscripten_SendSystemThemeChangedEvent'];
  _requestFullscreenThroughSDL = Module['_requestFullscreenThroughSDL'] = wasmExports['requestFullscreenThroughSDL'];
  _emwgpuCreateBindGroup = wasmExports['emwgpuCreateBindGroup'];
  _emwgpuCreateBindGroupLayout = wasmExports['emwgpuCreateBindGroupLayout'];
  _emwgpuCreateCommandBuffer = wasmExports['emwgpuCreateCommandBuffer'];
  _emwgpuCreateCommandEncoder = wasmExports['emwgpuCreateCommandEncoder'];
  _emwgpuCreateComputePassEncoder = wasmExports['emwgpuCreateComputePassEncoder'];
  _emwgpuCreateComputePipeline = wasmExports['emwgpuCreateComputePipeline'];
  _emwgpuCreateExternalTexture = wasmExports['emwgpuCreateExternalTexture'];
  _emwgpuCreatePipelineLayout = wasmExports['emwgpuCreatePipelineLayout'];
  _emwgpuCreateQuerySet = wasmExports['emwgpuCreateQuerySet'];
  _emwgpuCreateRenderBundle = wasmExports['emwgpuCreateRenderBundle'];
  _emwgpuCreateRenderBundleEncoder = wasmExports['emwgpuCreateRenderBundleEncoder'];
  _emwgpuCreateRenderPassEncoder = wasmExports['emwgpuCreateRenderPassEncoder'];
  _emwgpuCreateRenderPipeline = wasmExports['emwgpuCreateRenderPipeline'];
  _emwgpuCreateSampler = wasmExports['emwgpuCreateSampler'];
  _emwgpuCreateSurface = wasmExports['emwgpuCreateSurface'];
  _emwgpuCreateTexture = wasmExports['emwgpuCreateTexture'];
  _emwgpuCreateTextureView = wasmExports['emwgpuCreateTextureView'];
  _emwgpuCreateAdapter = wasmExports['emwgpuCreateAdapter'];
  _emwgpuImportBuffer = wasmExports['emwgpuImportBuffer'];
  _emwgpuCreateDevice = wasmExports['emwgpuCreateDevice'];
  _emwgpuCreateQueue = wasmExports['emwgpuCreateQueue'];
  _emwgpuCreateShaderModule = wasmExports['emwgpuCreateShaderModule'];
  _emwgpuOnCompilationInfoCompleted = wasmExports['emwgpuOnCompilationInfoCompleted'];
  _emwgpuOnCreateComputePipelineCompleted = wasmExports['emwgpuOnCreateComputePipelineCompleted'];
  _emwgpuOnCreateRenderPipelineCompleted = wasmExports['emwgpuOnCreateRenderPipelineCompleted'];
  _emwgpuOnDeviceLostCompleted = wasmExports['emwgpuOnDeviceLostCompleted'];
  _emwgpuOnMapAsyncCompleted = wasmExports['emwgpuOnMapAsyncCompleted'];
  _emwgpuOnPopErrorScopeCompleted = wasmExports['emwgpuOnPopErrorScopeCompleted'];
  _emwgpuOnRequestAdapterCompleted = wasmExports['emwgpuOnRequestAdapterCompleted'];
  _emwgpuOnRequestDeviceCompleted = wasmExports['emwgpuOnRequestDeviceCompleted'];
  _emwgpuOnWorkDoneCompleted = wasmExports['emwgpuOnWorkDoneCompleted'];
  _emwgpuOnUncapturedError = wasmExports['emwgpuOnUncapturedError'];
  __emscripten_tls_init = wasmExports['_emscripten_tls_init'];
  _emscripten_builtin_memalign = wasmExports['emscripten_builtin_memalign'];
  __emscripten_run_callback_on_thread = wasmExports['_emscripten_run_callback_on_thread'];
  __emscripten_thread_init = wasmExports['_emscripten_thread_init'];
  ___set_thread_state = wasmExports['__set_thread_state'];
  __emscripten_thread_crashed = wasmExports['_emscripten_thread_crashed'];
  _emscripten_proxy_execute_queue = wasmExports['emscripten_proxy_execute_queue'];
  _emscripten_proxy_finish = wasmExports['emscripten_proxy_finish'];
  __emscripten_run_js_on_main_thread_done = wasmExports['_emscripten_run_js_on_main_thread_done'];
  __emscripten_run_js_on_main_thread = wasmExports['_emscripten_run_js_on_main_thread'];
  __emscripten_thread_free_data = wasmExports['_emscripten_thread_free_data'];
  __emscripten_thread_exit = wasmExports['_emscripten_thread_exit'];
  __emscripten_check_mailbox = wasmExports['_emscripten_check_mailbox'];
  _memalign = wasmExports['memalign'];
  ___trap = wasmExports['__trap'];
  _emscripten_stack_set_limits = wasmExports['emscripten_stack_set_limits'];
  __emscripten_stack_restore = wasmExports['_emscripten_stack_restore'];
  __emscripten_stack_alloc = wasmExports['_emscripten_stack_alloc'];
  _emscripten_stack_get_current = wasmExports['emscripten_stack_get_current'];
  __wasmfs_fetch_get_file_url = wasmExports['_wasmfs_fetch_get_file_url'];
  __wasmfs_fetch_get_chunk_size = wasmExports['_wasmfs_fetch_get_chunk_size'];
  __wasmfs_read_file = wasmExports['_wasmfs_read_file'];
  __wasmfs_write_file = wasmExports['_wasmfs_write_file'];
  __wasmfs_mkdir = wasmExports['_wasmfs_mkdir'];
  __wasmfs_rmdir = wasmExports['_wasmfs_rmdir'];
  __wasmfs_open = wasmExports['_wasmfs_open'];
  __wasmfs_mknod = wasmExports['_wasmfs_mknod'];
  __wasmfs_unlink = wasmExports['_wasmfs_unlink'];
  __wasmfs_chdir = wasmExports['_wasmfs_chdir'];
  __wasmfs_symlink = wasmExports['_wasmfs_symlink'];
  __wasmfs_readlink = wasmExports['_wasmfs_readlink'];
  __wasmfs_write = wasmExports['_wasmfs_write'];
  __wasmfs_pwrite = wasmExports['_wasmfs_pwrite'];
  __wasmfs_chmod = wasmExports['_wasmfs_chmod'];
  __wasmfs_fchmod = wasmExports['_wasmfs_fchmod'];
  __wasmfs_lchmod = wasmExports['_wasmfs_lchmod'];
  __wasmfs_llseek = wasmExports['_wasmfs_llseek'];
  __wasmfs_rename = wasmExports['_wasmfs_rename'];
  __wasmfs_read = wasmExports['_wasmfs_read'];
  __wasmfs_pread = wasmExports['_wasmfs_pread'];
  __wasmfs_truncate = wasmExports['_wasmfs_truncate'];
  __wasmfs_ftruncate = wasmExports['_wasmfs_ftruncate'];
  __wasmfs_close = wasmExports['_wasmfs_close'];
  __wasmfs_mmap = wasmExports['_wasmfs_mmap'];
  __wasmfs_msync = wasmExports['_wasmfs_msync'];
  __wasmfs_munmap = wasmExports['_wasmfs_munmap'];
  __wasmfs_utime = wasmExports['_wasmfs_utime'];
  __wasmfs_stat = wasmExports['_wasmfs_stat'];
  __wasmfs_lstat = wasmExports['_wasmfs_lstat'];
  __wasmfs_mount = wasmExports['_wasmfs_mount'];
  __wasmfs_readdir_start = wasmExports['_wasmfs_readdir_start'];
  __wasmfs_readdir_get = wasmExports['_wasmfs_readdir_get'];
  __wasmfs_readdir_finish = wasmExports['_wasmfs_readdir_finish'];
  __wasmfs_get_cwd = wasmExports['_wasmfs_get_cwd'];
  _wasmfs_create_jsimpl_backend = wasmExports['wasmfs_create_jsimpl_backend'];
  _wasmfs_create_memory_backend = wasmExports['wasmfs_create_memory_backend'];
  __wasmfs_opfs_record_entry = wasmExports['_wasmfs_opfs_record_entry'];
  _wasmfs_unmount = wasmExports['wasmfs_unmount'];
  __indirect_function_table = wasmTable = wasmExports['__indirect_function_table'];
}

  var wasmImports;
  function assignWasmImports() {
    wasmImports = {
    /** @export */
    __assert_fail: ___assert_fail,
    /** @export */
    __asyncjs__aurora_yield_to_browser,
    /** @export */
    __call_sighandler: ___call_sighandler,
    /** @export */
    __pthread_create_js: ___pthread_create_js,
    /** @export */
    __syscall_geteuid32: ___syscall_geteuid32,
    /** @export */
    __syscall_getuid32: ___syscall_getuid32,
    /** @export */
    _abort_js: __abort_js,
    /** @export */
    _emscripten_init_main_thread_js: __emscripten_init_main_thread_js,
    /** @export */
    _emscripten_notify_mailbox_postmessage: __emscripten_notify_mailbox_postmessage,
    /** @export */
    _emscripten_receive_on_main_thread_js: __emscripten_receive_on_main_thread_js,
    /** @export */
    _emscripten_runtime_keepalive_clear: __emscripten_runtime_keepalive_clear,
    /** @export */
    _emscripten_thread_cleanup: __emscripten_thread_cleanup,
    /** @export */
    _emscripten_thread_mailbox_await: __emscripten_thread_mailbox_await,
    /** @export */
    _emscripten_thread_set_strongref: __emscripten_thread_set_strongref,
    /** @export */
    _localtime_js: __localtime_js,
    /** @export */
    _tzset_js: __tzset_js,
    /** @export */
    _wasmfs_copy_preloaded_file_data: __wasmfs_copy_preloaded_file_data,
    /** @export */
    _wasmfs_create_fetch_backend_js: __wasmfs_create_fetch_backend_js,
    /** @export */
    _wasmfs_get_num_preloaded_dirs: __wasmfs_get_num_preloaded_dirs,
    /** @export */
    _wasmfs_get_num_preloaded_files: __wasmfs_get_num_preloaded_files,
    /** @export */
    _wasmfs_get_preloaded_child_path: __wasmfs_get_preloaded_child_path,
    /** @export */
    _wasmfs_get_preloaded_file_mode: __wasmfs_get_preloaded_file_mode,
    /** @export */
    _wasmfs_get_preloaded_file_size: __wasmfs_get_preloaded_file_size,
    /** @export */
    _wasmfs_get_preloaded_parent_path: __wasmfs_get_preloaded_parent_path,
    /** @export */
    _wasmfs_get_preloaded_path_name: __wasmfs_get_preloaded_path_name,
    /** @export */
    _wasmfs_jsimpl_alloc_file: __wasmfs_jsimpl_alloc_file,
    /** @export */
    _wasmfs_jsimpl_async_alloc_file: __wasmfs_jsimpl_async_alloc_file,
    /** @export */
    _wasmfs_jsimpl_async_free_file: __wasmfs_jsimpl_async_free_file,
    /** @export */
    _wasmfs_jsimpl_async_get_size: __wasmfs_jsimpl_async_get_size,
    /** @export */
    _wasmfs_jsimpl_async_read: __wasmfs_jsimpl_async_read,
    /** @export */
    _wasmfs_jsimpl_async_write: __wasmfs_jsimpl_async_write,
    /** @export */
    _wasmfs_jsimpl_free_file: __wasmfs_jsimpl_free_file,
    /** @export */
    _wasmfs_jsimpl_get_size: __wasmfs_jsimpl_get_size,
    /** @export */
    _wasmfs_jsimpl_read: __wasmfs_jsimpl_read,
    /** @export */
    _wasmfs_jsimpl_set_size: __wasmfs_jsimpl_set_size,
    /** @export */
    _wasmfs_jsimpl_write: __wasmfs_jsimpl_write,
    /** @export */
    _wasmfs_opfs_close_access: __wasmfs_opfs_close_access,
    /** @export */
    _wasmfs_opfs_close_blob: __wasmfs_opfs_close_blob,
    /** @export */
    _wasmfs_opfs_flush_access: __wasmfs_opfs_flush_access,
    /** @export */
    _wasmfs_opfs_free_directory: __wasmfs_opfs_free_directory,
    /** @export */
    _wasmfs_opfs_free_file: __wasmfs_opfs_free_file,
    /** @export */
    _wasmfs_opfs_get_child: __wasmfs_opfs_get_child,
    /** @export */
    _wasmfs_opfs_get_entries: __wasmfs_opfs_get_entries,
    /** @export */
    _wasmfs_opfs_get_size_access: __wasmfs_opfs_get_size_access,
    /** @export */
    _wasmfs_opfs_get_size_blob: __wasmfs_opfs_get_size_blob,
    /** @export */
    _wasmfs_opfs_get_size_file: __wasmfs_opfs_get_size_file,
    /** @export */
    _wasmfs_opfs_init_root_directory: __wasmfs_opfs_init_root_directory,
    /** @export */
    _wasmfs_opfs_insert_directory: __wasmfs_opfs_insert_directory,
    /** @export */
    _wasmfs_opfs_insert_file: __wasmfs_opfs_insert_file,
    /** @export */
    _wasmfs_opfs_move_file: __wasmfs_opfs_move_file,
    /** @export */
    _wasmfs_opfs_open_access: __wasmfs_opfs_open_access,
    /** @export */
    _wasmfs_opfs_open_blob: __wasmfs_opfs_open_blob,
    /** @export */
    _wasmfs_opfs_read_access: __wasmfs_opfs_read_access,
    /** @export */
    _wasmfs_opfs_read_blob: __wasmfs_opfs_read_blob,
    /** @export */
    _wasmfs_opfs_remove_child: __wasmfs_opfs_remove_child,
    /** @export */
    _wasmfs_opfs_set_size_access: __wasmfs_opfs_set_size_access,
    /** @export */
    _wasmfs_opfs_set_size_file: __wasmfs_opfs_set_size_file,
    /** @export */
    _wasmfs_opfs_write_access: __wasmfs_opfs_write_access,
    /** @export */
    _wasmfs_stdin_get_char: __wasmfs_stdin_get_char,
    /** @export */
    _wasmfs_thread_utils_heartbeat: __wasmfs_thread_utils_heartbeat,
    /** @export */
    clock_time_get: _clock_time_get,
    /** @export */
    emscripten_asm_const_double_sync_on_main_thread: _emscripten_asm_const_double_sync_on_main_thread,
    /** @export */
    emscripten_asm_const_int: _emscripten_asm_const_int,
    /** @export */
    emscripten_asm_const_int_sync_on_main_thread: _emscripten_asm_const_int_sync_on_main_thread,
    /** @export */
    emscripten_asm_const_ptr_sync_on_main_thread: _emscripten_asm_const_ptr_sync_on_main_thread,
    /** @export */
    emscripten_check_blocking_allowed: _emscripten_check_blocking_allowed,
    /** @export */
    emscripten_date_now: _emscripten_date_now,
    /** @export */
    emscripten_err: _emscripten_err,
    /** @export */
    emscripten_exit_fullscreen: _emscripten_exit_fullscreen,
    /** @export */
    emscripten_exit_pointerlock: _emscripten_exit_pointerlock,
    /** @export */
    emscripten_exit_with_live_runtime: _emscripten_exit_with_live_runtime,
    /** @export */
    emscripten_get_device_pixel_ratio: _emscripten_get_device_pixel_ratio,
    /** @export */
    emscripten_get_element_css_size: _emscripten_get_element_css_size,
    /** @export */
    emscripten_get_fullscreen_status: _emscripten_get_fullscreen_status,
    /** @export */
    emscripten_get_gamepad_status: _emscripten_get_gamepad_status,
    /** @export */
    emscripten_get_heap_max: _emscripten_get_heap_max,
    /** @export */
    emscripten_get_main_loop_timing: _emscripten_get_main_loop_timing,
    /** @export */
    emscripten_get_now: _emscripten_get_now,
    /** @export */
    emscripten_get_num_gamepads: _emscripten_get_num_gamepads,
    /** @export */
    emscripten_get_screen_size: _emscripten_get_screen_size,
    /** @export */
    emscripten_glActiveTexture: _emscripten_glActiveTexture,
    /** @export */
    emscripten_glAttachShader: _emscripten_glAttachShader,
    /** @export */
    emscripten_glBeginQueryEXT: _emscripten_glBeginQueryEXT,
    /** @export */
    emscripten_glBindAttribLocation: _emscripten_glBindAttribLocation,
    /** @export */
    emscripten_glBindBuffer: _emscripten_glBindBuffer,
    /** @export */
    emscripten_glBindFramebuffer: _emscripten_glBindFramebuffer,
    /** @export */
    emscripten_glBindRenderbuffer: _emscripten_glBindRenderbuffer,
    /** @export */
    emscripten_glBindTexture: _emscripten_glBindTexture,
    /** @export */
    emscripten_glBindVertexArrayOES: _emscripten_glBindVertexArrayOES,
    /** @export */
    emscripten_glBlendColor: _emscripten_glBlendColor,
    /** @export */
    emscripten_glBlendEquation: _emscripten_glBlendEquation,
    /** @export */
    emscripten_glBlendEquationSeparate: _emscripten_glBlendEquationSeparate,
    /** @export */
    emscripten_glBlendFunc: _emscripten_glBlendFunc,
    /** @export */
    emscripten_glBlendFuncSeparate: _emscripten_glBlendFuncSeparate,
    /** @export */
    emscripten_glBufferData: _emscripten_glBufferData,
    /** @export */
    emscripten_glBufferSubData: _emscripten_glBufferSubData,
    /** @export */
    emscripten_glCheckFramebufferStatus: _emscripten_glCheckFramebufferStatus,
    /** @export */
    emscripten_glClear: _emscripten_glClear,
    /** @export */
    emscripten_glClearColor: _emscripten_glClearColor,
    /** @export */
    emscripten_glClearDepthf: _emscripten_glClearDepthf,
    /** @export */
    emscripten_glClearStencil: _emscripten_glClearStencil,
    /** @export */
    emscripten_glClipControlEXT: _emscripten_glClipControlEXT,
    /** @export */
    emscripten_glColorMask: _emscripten_glColorMask,
    /** @export */
    emscripten_glCompileShader: _emscripten_glCompileShader,
    /** @export */
    emscripten_glCompressedTexImage2D: _emscripten_glCompressedTexImage2D,
    /** @export */
    emscripten_glCompressedTexSubImage2D: _emscripten_glCompressedTexSubImage2D,
    /** @export */
    emscripten_glCopyTexImage2D: _emscripten_glCopyTexImage2D,
    /** @export */
    emscripten_glCopyTexSubImage2D: _emscripten_glCopyTexSubImage2D,
    /** @export */
    emscripten_glCreateProgram: _emscripten_glCreateProgram,
    /** @export */
    emscripten_glCreateShader: _emscripten_glCreateShader,
    /** @export */
    emscripten_glCullFace: _emscripten_glCullFace,
    /** @export */
    emscripten_glDeleteBuffers: _emscripten_glDeleteBuffers,
    /** @export */
    emscripten_glDeleteFramebuffers: _emscripten_glDeleteFramebuffers,
    /** @export */
    emscripten_glDeleteProgram: _emscripten_glDeleteProgram,
    /** @export */
    emscripten_glDeleteQueriesEXT: _emscripten_glDeleteQueriesEXT,
    /** @export */
    emscripten_glDeleteRenderbuffers: _emscripten_glDeleteRenderbuffers,
    /** @export */
    emscripten_glDeleteShader: _emscripten_glDeleteShader,
    /** @export */
    emscripten_glDeleteTextures: _emscripten_glDeleteTextures,
    /** @export */
    emscripten_glDeleteVertexArraysOES: _emscripten_glDeleteVertexArraysOES,
    /** @export */
    emscripten_glDepthFunc: _emscripten_glDepthFunc,
    /** @export */
    emscripten_glDepthMask: _emscripten_glDepthMask,
    /** @export */
    emscripten_glDepthRangef: _emscripten_glDepthRangef,
    /** @export */
    emscripten_glDetachShader: _emscripten_glDetachShader,
    /** @export */
    emscripten_glDisable: _emscripten_glDisable,
    /** @export */
    emscripten_glDisableVertexAttribArray: _emscripten_glDisableVertexAttribArray,
    /** @export */
    emscripten_glDrawArrays: _emscripten_glDrawArrays,
    /** @export */
    emscripten_glDrawArraysInstancedANGLE: _emscripten_glDrawArraysInstancedANGLE,
    /** @export */
    emscripten_glDrawBuffersWEBGL: _emscripten_glDrawBuffersWEBGL,
    /** @export */
    emscripten_glDrawElements: _emscripten_glDrawElements,
    /** @export */
    emscripten_glDrawElementsInstancedANGLE: _emscripten_glDrawElementsInstancedANGLE,
    /** @export */
    emscripten_glEnable: _emscripten_glEnable,
    /** @export */
    emscripten_glEnableVertexAttribArray: _emscripten_glEnableVertexAttribArray,
    /** @export */
    emscripten_glEndQueryEXT: _emscripten_glEndQueryEXT,
    /** @export */
    emscripten_glFinish: _emscripten_glFinish,
    /** @export */
    emscripten_glFlush: _emscripten_glFlush,
    /** @export */
    emscripten_glFramebufferRenderbuffer: _emscripten_glFramebufferRenderbuffer,
    /** @export */
    emscripten_glFramebufferTexture2D: _emscripten_glFramebufferTexture2D,
    /** @export */
    emscripten_glFrontFace: _emscripten_glFrontFace,
    /** @export */
    emscripten_glGenBuffers: _emscripten_glGenBuffers,
    /** @export */
    emscripten_glGenFramebuffers: _emscripten_glGenFramebuffers,
    /** @export */
    emscripten_glGenQueriesEXT: _emscripten_glGenQueriesEXT,
    /** @export */
    emscripten_glGenRenderbuffers: _emscripten_glGenRenderbuffers,
    /** @export */
    emscripten_glGenTextures: _emscripten_glGenTextures,
    /** @export */
    emscripten_glGenVertexArraysOES: _emscripten_glGenVertexArraysOES,
    /** @export */
    emscripten_glGenerateMipmap: _emscripten_glGenerateMipmap,
    /** @export */
    emscripten_glGetActiveAttrib: _emscripten_glGetActiveAttrib,
    /** @export */
    emscripten_glGetActiveUniform: _emscripten_glGetActiveUniform,
    /** @export */
    emscripten_glGetAttachedShaders: _emscripten_glGetAttachedShaders,
    /** @export */
    emscripten_glGetAttribLocation: _emscripten_glGetAttribLocation,
    /** @export */
    emscripten_glGetBooleanv: _emscripten_glGetBooleanv,
    /** @export */
    emscripten_glGetBufferParameteriv: _emscripten_glGetBufferParameteriv,
    /** @export */
    emscripten_glGetError: _emscripten_glGetError,
    /** @export */
    emscripten_glGetFloatv: _emscripten_glGetFloatv,
    /** @export */
    emscripten_glGetFramebufferAttachmentParameteriv: _emscripten_glGetFramebufferAttachmentParameteriv,
    /** @export */
    emscripten_glGetIntegerv: _emscripten_glGetIntegerv,
    /** @export */
    emscripten_glGetProgramInfoLog: _emscripten_glGetProgramInfoLog,
    /** @export */
    emscripten_glGetProgramiv: _emscripten_glGetProgramiv,
    /** @export */
    emscripten_glGetQueryObjecti64vEXT: _emscripten_glGetQueryObjecti64vEXT,
    /** @export */
    emscripten_glGetQueryObjectivEXT: _emscripten_glGetQueryObjectivEXT,
    /** @export */
    emscripten_glGetQueryObjectui64vEXT: _emscripten_glGetQueryObjectui64vEXT,
    /** @export */
    emscripten_glGetQueryObjectuivEXT: _emscripten_glGetQueryObjectuivEXT,
    /** @export */
    emscripten_glGetQueryivEXT: _emscripten_glGetQueryivEXT,
    /** @export */
    emscripten_glGetRenderbufferParameteriv: _emscripten_glGetRenderbufferParameteriv,
    /** @export */
    emscripten_glGetShaderInfoLog: _emscripten_glGetShaderInfoLog,
    /** @export */
    emscripten_glGetShaderPrecisionFormat: _emscripten_glGetShaderPrecisionFormat,
    /** @export */
    emscripten_glGetShaderSource: _emscripten_glGetShaderSource,
    /** @export */
    emscripten_glGetShaderiv: _emscripten_glGetShaderiv,
    /** @export */
    emscripten_glGetString: _emscripten_glGetString,
    /** @export */
    emscripten_glGetTexParameterfv: _emscripten_glGetTexParameterfv,
    /** @export */
    emscripten_glGetTexParameteriv: _emscripten_glGetTexParameteriv,
    /** @export */
    emscripten_glGetUniformLocation: _emscripten_glGetUniformLocation,
    /** @export */
    emscripten_glGetUniformfv: _emscripten_glGetUniformfv,
    /** @export */
    emscripten_glGetUniformiv: _emscripten_glGetUniformiv,
    /** @export */
    emscripten_glGetVertexAttribPointerv: _emscripten_glGetVertexAttribPointerv,
    /** @export */
    emscripten_glGetVertexAttribfv: _emscripten_glGetVertexAttribfv,
    /** @export */
    emscripten_glGetVertexAttribiv: _emscripten_glGetVertexAttribiv,
    /** @export */
    emscripten_glHint: _emscripten_glHint,
    /** @export */
    emscripten_glIsBuffer: _emscripten_glIsBuffer,
    /** @export */
    emscripten_glIsEnabled: _emscripten_glIsEnabled,
    /** @export */
    emscripten_glIsFramebuffer: _emscripten_glIsFramebuffer,
    /** @export */
    emscripten_glIsProgram: _emscripten_glIsProgram,
    /** @export */
    emscripten_glIsQueryEXT: _emscripten_glIsQueryEXT,
    /** @export */
    emscripten_glIsRenderbuffer: _emscripten_glIsRenderbuffer,
    /** @export */
    emscripten_glIsShader: _emscripten_glIsShader,
    /** @export */
    emscripten_glIsTexture: _emscripten_glIsTexture,
    /** @export */
    emscripten_glIsVertexArrayOES: _emscripten_glIsVertexArrayOES,
    /** @export */
    emscripten_glLineWidth: _emscripten_glLineWidth,
    /** @export */
    emscripten_glLinkProgram: _emscripten_glLinkProgram,
    /** @export */
    emscripten_glPixelStorei: _emscripten_glPixelStorei,
    /** @export */
    emscripten_glPolygonModeWEBGL: _emscripten_glPolygonModeWEBGL,
    /** @export */
    emscripten_glPolygonOffset: _emscripten_glPolygonOffset,
    /** @export */
    emscripten_glPolygonOffsetClampEXT: _emscripten_glPolygonOffsetClampEXT,
    /** @export */
    emscripten_glQueryCounterEXT: _emscripten_glQueryCounterEXT,
    /** @export */
    emscripten_glReadPixels: _emscripten_glReadPixels,
    /** @export */
    emscripten_glReleaseShaderCompiler: _emscripten_glReleaseShaderCompiler,
    /** @export */
    emscripten_glRenderbufferStorage: _emscripten_glRenderbufferStorage,
    /** @export */
    emscripten_glSampleCoverage: _emscripten_glSampleCoverage,
    /** @export */
    emscripten_glScissor: _emscripten_glScissor,
    /** @export */
    emscripten_glShaderBinary: _emscripten_glShaderBinary,
    /** @export */
    emscripten_glShaderSource: _emscripten_glShaderSource,
    /** @export */
    emscripten_glStencilFunc: _emscripten_glStencilFunc,
    /** @export */
    emscripten_glStencilFuncSeparate: _emscripten_glStencilFuncSeparate,
    /** @export */
    emscripten_glStencilMask: _emscripten_glStencilMask,
    /** @export */
    emscripten_glStencilMaskSeparate: _emscripten_glStencilMaskSeparate,
    /** @export */
    emscripten_glStencilOp: _emscripten_glStencilOp,
    /** @export */
    emscripten_glStencilOpSeparate: _emscripten_glStencilOpSeparate,
    /** @export */
    emscripten_glTexImage2D: _emscripten_glTexImage2D,
    /** @export */
    emscripten_glTexParameterf: _emscripten_glTexParameterf,
    /** @export */
    emscripten_glTexParameterfv: _emscripten_glTexParameterfv,
    /** @export */
    emscripten_glTexParameteri: _emscripten_glTexParameteri,
    /** @export */
    emscripten_glTexParameteriv: _emscripten_glTexParameteriv,
    /** @export */
    emscripten_glTexSubImage2D: _emscripten_glTexSubImage2D,
    /** @export */
    emscripten_glUniform1f: _emscripten_glUniform1f,
    /** @export */
    emscripten_glUniform1fv: _emscripten_glUniform1fv,
    /** @export */
    emscripten_glUniform1i: _emscripten_glUniform1i,
    /** @export */
    emscripten_glUniform1iv: _emscripten_glUniform1iv,
    /** @export */
    emscripten_glUniform2f: _emscripten_glUniform2f,
    /** @export */
    emscripten_glUniform2fv: _emscripten_glUniform2fv,
    /** @export */
    emscripten_glUniform2i: _emscripten_glUniform2i,
    /** @export */
    emscripten_glUniform2iv: _emscripten_glUniform2iv,
    /** @export */
    emscripten_glUniform3f: _emscripten_glUniform3f,
    /** @export */
    emscripten_glUniform3fv: _emscripten_glUniform3fv,
    /** @export */
    emscripten_glUniform3i: _emscripten_glUniform3i,
    /** @export */
    emscripten_glUniform3iv: _emscripten_glUniform3iv,
    /** @export */
    emscripten_glUniform4f: _emscripten_glUniform4f,
    /** @export */
    emscripten_glUniform4fv: _emscripten_glUniform4fv,
    /** @export */
    emscripten_glUniform4i: _emscripten_glUniform4i,
    /** @export */
    emscripten_glUniform4iv: _emscripten_glUniform4iv,
    /** @export */
    emscripten_glUniformMatrix2fv: _emscripten_glUniformMatrix2fv,
    /** @export */
    emscripten_glUniformMatrix3fv: _emscripten_glUniformMatrix3fv,
    /** @export */
    emscripten_glUniformMatrix4fv: _emscripten_glUniformMatrix4fv,
    /** @export */
    emscripten_glUseProgram: _emscripten_glUseProgram,
    /** @export */
    emscripten_glValidateProgram: _emscripten_glValidateProgram,
    /** @export */
    emscripten_glVertexAttrib1f: _emscripten_glVertexAttrib1f,
    /** @export */
    emscripten_glVertexAttrib1fv: _emscripten_glVertexAttrib1fv,
    /** @export */
    emscripten_glVertexAttrib2f: _emscripten_glVertexAttrib2f,
    /** @export */
    emscripten_glVertexAttrib2fv: _emscripten_glVertexAttrib2fv,
    /** @export */
    emscripten_glVertexAttrib3f: _emscripten_glVertexAttrib3f,
    /** @export */
    emscripten_glVertexAttrib3fv: _emscripten_glVertexAttrib3fv,
    /** @export */
    emscripten_glVertexAttrib4f: _emscripten_glVertexAttrib4f,
    /** @export */
    emscripten_glVertexAttrib4fv: _emscripten_glVertexAttrib4fv,
    /** @export */
    emscripten_glVertexAttribDivisorANGLE: _emscripten_glVertexAttribDivisorANGLE,
    /** @export */
    emscripten_glVertexAttribPointer: _emscripten_glVertexAttribPointer,
    /** @export */
    emscripten_glViewport: _emscripten_glViewport,
    /** @export */
    emscripten_has_asyncify: _emscripten_has_asyncify,
    /** @export */
    emscripten_num_logical_cores: _emscripten_num_logical_cores,
    /** @export */
    emscripten_out: _emscripten_out,
    /** @export */
    emscripten_request_fullscreen_strategy: _emscripten_request_fullscreen_strategy,
    /** @export */
    emscripten_request_pointerlock: _emscripten_request_pointerlock,
    /** @export */
    emscripten_resize_heap: _emscripten_resize_heap,
    /** @export */
    emscripten_sample_gamepad_data: _emscripten_sample_gamepad_data,
    /** @export */
    emscripten_set_beforeunload_callback_on_thread: _emscripten_set_beforeunload_callback_on_thread,
    /** @export */
    emscripten_set_blur_callback_on_thread: _emscripten_set_blur_callback_on_thread,
    /** @export */
    emscripten_set_canvas_element_size: _emscripten_set_canvas_element_size,
    /** @export */
    emscripten_set_devicemotion_callback_on_thread: _emscripten_set_devicemotion_callback_on_thread,
    /** @export */
    emscripten_set_element_css_size: _emscripten_set_element_css_size,
    /** @export */
    emscripten_set_focus_callback_on_thread: _emscripten_set_focus_callback_on_thread,
    /** @export */
    emscripten_set_fullscreenchange_callback_on_thread: _emscripten_set_fullscreenchange_callback_on_thread,
    /** @export */
    emscripten_set_gamepadconnected_callback_on_thread: _emscripten_set_gamepadconnected_callback_on_thread,
    /** @export */
    emscripten_set_gamepaddisconnected_callback_on_thread: _emscripten_set_gamepaddisconnected_callback_on_thread,
    /** @export */
    emscripten_set_keydown_callback_on_thread: _emscripten_set_keydown_callback_on_thread,
    /** @export */
    emscripten_set_keypress_callback_on_thread: _emscripten_set_keypress_callback_on_thread,
    /** @export */
    emscripten_set_keyup_callback_on_thread: _emscripten_set_keyup_callback_on_thread,
    /** @export */
    emscripten_set_main_loop_timing: _emscripten_set_main_loop_timing,
    /** @export */
    emscripten_set_orientationchange_callback_on_thread: _emscripten_set_orientationchange_callback_on_thread,
    /** @export */
    emscripten_set_pointerlockchange_callback_on_thread: _emscripten_set_pointerlockchange_callback_on_thread,
    /** @export */
    emscripten_set_resize_callback_on_thread: _emscripten_set_resize_callback_on_thread,
    /** @export */
    emscripten_set_visibilitychange_callback_on_thread: _emscripten_set_visibilitychange_callback_on_thread,
    /** @export */
    emscripten_set_wheel_callback_on_thread: _emscripten_set_wheel_callback_on_thread,
    /** @export */
    emscripten_set_window_title: _emscripten_set_window_title,
    /** @export */
    emscripten_sleep: _emscripten_sleep,
    /** @export */
    emscripten_unwind_to_js_event_loop: _emscripten_unwind_to_js_event_loop,
    /** @export */
    emscripten_webgl_create_context: _emscripten_webgl_create_context,
    /** @export */
    emscripten_webgl_destroy_context: _emscripten_webgl_destroy_context,
    /** @export */
    emscripten_webgl_make_context_current: _emscripten_webgl_make_context_current,
    /** @export */
    emwgpuAdapterRequestDevice: _emwgpuAdapterRequestDevice,
    /** @export */
    emwgpuBufferDestroy: _emwgpuBufferDestroy,
    /** @export */
    emwgpuBufferGetConstMappedRange: _emwgpuBufferGetConstMappedRange,
    /** @export */
    emwgpuBufferGetMappedRange: _emwgpuBufferGetMappedRange,
    /** @export */
    emwgpuBufferMapAsync: _emwgpuBufferMapAsync,
    /** @export */
    emwgpuBufferUnmap: _emwgpuBufferUnmap,
    /** @export */
    emwgpuDelete: _emwgpuDelete,
    /** @export */
    emwgpuDeviceCreateBuffer: _emwgpuDeviceCreateBuffer,
    /** @export */
    emwgpuDeviceCreateRenderPipelineAsync: _emwgpuDeviceCreateRenderPipelineAsync,
    /** @export */
    emwgpuDeviceCreateShaderModule: _emwgpuDeviceCreateShaderModule,
    /** @export */
    emwgpuDeviceDestroy: _emwgpuDeviceDestroy,
    /** @export */
    emwgpuGetPreferredFormat: _emwgpuGetPreferredFormat,
    /** @export */
    emwgpuInstanceRequestAdapter: _emwgpuInstanceRequestAdapter,
    /** @export */
    emwgpuQueueOnSubmittedWorkDone: _emwgpuQueueOnSubmittedWorkDone,
    /** @export */
    emwgpuWaitAny: _emwgpuWaitAny,
    /** @export */
    environ_get: _environ_get,
    /** @export */
    environ_sizes_get: _environ_sizes_get,
    /** @export */
    exit: _exit,
    /** @export */
    getaddrinfo: _getaddrinfo,
    /** @export */
    memory: wasmMemory,
    /** @export */
    proc_exit: _proc_exit,
    /** @export */
    random_get: _random_get,
    /** @export */
    wgpuAdapterGetFeatures: _wgpuAdapterGetFeatures,
    /** @export */
    wgpuAdapterGetInfo: _wgpuAdapterGetInfo,
    /** @export */
    wgpuAdapterGetLimits: _wgpuAdapterGetLimits,
    /** @export */
    wgpuCommandEncoderBeginComputePass: _wgpuCommandEncoderBeginComputePass,
    /** @export */
    wgpuCommandEncoderBeginRenderPass: _wgpuCommandEncoderBeginRenderPass,
    /** @export */
    wgpuCommandEncoderCopyBufferToBuffer: _wgpuCommandEncoderCopyBufferToBuffer,
    /** @export */
    wgpuCommandEncoderCopyBufferToTexture: _wgpuCommandEncoderCopyBufferToTexture,
    /** @export */
    wgpuCommandEncoderCopyTextureToBuffer: _wgpuCommandEncoderCopyTextureToBuffer,
    /** @export */
    wgpuCommandEncoderCopyTextureToTexture: _wgpuCommandEncoderCopyTextureToTexture,
    /** @export */
    wgpuCommandEncoderFinish: _wgpuCommandEncoderFinish,
    /** @export */
    wgpuComputePassEncoderDispatchWorkgroups: _wgpuComputePassEncoderDispatchWorkgroups,
    /** @export */
    wgpuComputePassEncoderEnd: _wgpuComputePassEncoderEnd,
    /** @export */
    wgpuComputePassEncoderSetBindGroup: _wgpuComputePassEncoderSetBindGroup,
    /** @export */
    wgpuComputePassEncoderSetPipeline: _wgpuComputePassEncoderSetPipeline,
    /** @export */
    wgpuDeviceCreateBindGroup: _wgpuDeviceCreateBindGroup,
    /** @export */
    wgpuDeviceCreateBindGroupLayout: _wgpuDeviceCreateBindGroupLayout,
    /** @export */
    wgpuDeviceCreateCommandEncoder: _wgpuDeviceCreateCommandEncoder,
    /** @export */
    wgpuDeviceCreateComputePipeline: _wgpuDeviceCreateComputePipeline,
    /** @export */
    wgpuDeviceCreatePipelineLayout: _wgpuDeviceCreatePipelineLayout,
    /** @export */
    wgpuDeviceCreateRenderPipeline: _wgpuDeviceCreateRenderPipeline,
    /** @export */
    wgpuDeviceCreateSampler: _wgpuDeviceCreateSampler,
    /** @export */
    wgpuDeviceCreateTexture: _wgpuDeviceCreateTexture,
    /** @export */
    wgpuDeviceGetLimits: _wgpuDeviceGetLimits,
    /** @export */
    wgpuInstanceCreateSurface: _wgpuInstanceCreateSurface,
    /** @export */
    wgpuQueueSubmit: _wgpuQueueSubmit,
    /** @export */
    wgpuQueueWriteBuffer: _wgpuQueueWriteBuffer,
    /** @export */
    wgpuQueueWriteTexture: _wgpuQueueWriteTexture,
    /** @export */
    wgpuRenderPassEncoderDraw: _wgpuRenderPassEncoderDraw,
    /** @export */
    wgpuRenderPassEncoderDrawIndexed: _wgpuRenderPassEncoderDrawIndexed,
    /** @export */
    wgpuRenderPassEncoderEnd: _wgpuRenderPassEncoderEnd,
    /** @export */
    wgpuRenderPassEncoderPopDebugGroup: _wgpuRenderPassEncoderPopDebugGroup,
    /** @export */
    wgpuRenderPassEncoderPushDebugGroup: _wgpuRenderPassEncoderPushDebugGroup,
    /** @export */
    wgpuRenderPassEncoderSetBindGroup: _wgpuRenderPassEncoderSetBindGroup,
    /** @export */
    wgpuRenderPassEncoderSetBlendConstant: _wgpuRenderPassEncoderSetBlendConstant,
    /** @export */
    wgpuRenderPassEncoderSetIndexBuffer: _wgpuRenderPassEncoderSetIndexBuffer,
    /** @export */
    wgpuRenderPassEncoderSetPipeline: _wgpuRenderPassEncoderSetPipeline,
    /** @export */
    wgpuRenderPassEncoderSetScissorRect: _wgpuRenderPassEncoderSetScissorRect,
    /** @export */
    wgpuRenderPassEncoderSetVertexBuffer: _wgpuRenderPassEncoderSetVertexBuffer,
    /** @export */
    wgpuRenderPassEncoderSetViewport: _wgpuRenderPassEncoderSetViewport,
    /** @export */
    wgpuSurfaceConfigure: _wgpuSurfaceConfigure,
    /** @export */
    wgpuSurfaceGetCurrentTexture: _wgpuSurfaceGetCurrentTexture,
    /** @export */
    wgpuSurfaceUnconfigure: _wgpuSurfaceUnconfigure,
    /** @export */
    wgpuTextureCreateView: _wgpuTextureCreateView,
    /** @export */
    wgpuTextureGetFormat: _wgpuTextureGetFormat,
    /** @export */
    wgpuTextureGetHeight: _wgpuTextureGetHeight,
    /** @export */
    wgpuTextureGetWidth: _wgpuTextureGetWidth
  };
  }


// include: postamble.js
// === Auto-generated postamble setup entry stuff ===

async function callMain(args = []) {

  var entryFunction = _main;

  args.unshift(thisProgram);

  var argc = args.length;
  var argv = stackAlloc((argc + 1) * 4);
  var argv_ptr = argv;
  for (var arg of args) {
    HEAPU32[((argv_ptr)>>2)] = stringToUTF8OnStack(arg);
    argv_ptr += 4;
  }
  HEAPU32[((argv_ptr)>>2)] = 0;

  try {

    var ret = entryFunction(argc, argv);

    // The current spec of JSPI returns a promise only if the function suspends
    // and a plain value otherwise. This will likely change:
    // https://github.com/WebAssembly/js-promise-integration/issues/11
    ret = await ret;
    // if we're not running an evented main loop, it's time to exit
    exitJS(ret, /* implicit = */ true);
    return ret;
  } catch (e) {
    return handleException(e);
  }
}

async function run(args = programArgs) {

  if ((ENVIRONMENT_IS_PTHREAD)) {
    initRuntime();
    return;
  }

  preRun();

  if (runDependencies) {
    await resolveRunDependencies();
  }

  var setStatus = Module['setStatus'];
  if (setStatus) {
    setStatus('Running...');
    // Yield to the event loop to allow the browser to paint "Running..."
    await new Promise((resolve) => setTimeout(resolve, 1));
    // Then we want to clear the status text, but only after the rest of this function runs.
    setTimeout(setStatus, 1, '');
  }

  if (ABORT) return;

  initRuntime();

  // No ATMAINS hooks

  Module['onRuntimeInitialized']?.();

  var noInitialRun = Module['noInitialRun'] || false;
  if (!noInitialRun) await callMain(args);

  postRun();
}

var wasmExports;

if ((!(ENVIRONMENT_IS_PTHREAD))) {
// Call createWasm on startup if we are the main thread.
// Worker threads call this once they receive the module via postMessage

// With async instantation wasmExports is assigned asynchronously when the
// instance is received.
createWasm().then(() => run());

}

// end include: postamble.js

