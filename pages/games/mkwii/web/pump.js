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
