// ttyd-audio-worklet.js - plays Dolphin's mixer output from the shared WebAudioRing
// (AudioCommon/WebAudioStream.h): u32 capacity, u32 read, u32 write, s16 samples[capacity * 2].
//
// When the emulator falls behind, the ring runs dry. Playing whatever trickles in then gives a
// buzz of 128-frame blips; instead, after an underrun the worklet fades out, waits until
// RESUME_FRAMES are buffered and fades back in, so slow stretches sound like short gaps.
// When it runs ahead (e.g. after a tab switch), it drops audio beyond MAX_FRAMES to keep
// latency bounded.
const RESUME_FRAMES = 2400;  // 50 ms at 48 kHz
const MAX_FRAMES = 14400;    // 300 ms
const KEEP_FRAMES = 4800;    // after dropping, keep 100 ms
const FADE = 64;

class SadxAudio extends AudioWorkletProcessor {
  constructor() {
    super();
    this.ready = false;
    this.playing = false;
    this.lastL = 0;
    this.lastR = 0;
    this.port.onmessage = ({ data }) => {
      const { buffer, ring } = data;
      this.header = new Uint32Array(buffer, ring, 3);
      this.capacity = this.header[0];
      this.samples = new Int16Array(buffer, ring + 12, this.capacity * 2);
      this.ready = true;
    };
  }

  process(_inputs, outputs) {
    const out = outputs[0];
    const left = out[0], right = out[1] || out[0];
    const n = left.length;
    if (!this.ready) return true;
    let read = Atomics.load(this.header, 1);
    const write = Atomics.load(this.header, 2);
    let available = (write - read) >>> 0;
    if (available > MAX_FRAMES) {
      read = (read + available - KEEP_FRAMES) >>> 0;
      available = KEEP_FRAMES;
    }
    let i = 0;
    if (!this.playing && available >= RESUME_FRAMES) {
      this.playing = true;
      this.fadeIn = 0;
    }
    if (this.playing) {
      const frames = Math.min(n, available);
      for (; i < frames; i++, read++) {
        const slot = (read % this.capacity) * 2;
        let l = this.samples[slot] / 32768, r = this.samples[slot + 1] / 32768;
        if (this.fadeIn < FADE) {
          const g = this.fadeIn++ / FADE;
          l *= g; r *= g;
        }
        left[i] = l; right[i] = r;
      }
      if (frames > 0) {
        this.lastL = left[frames - 1];
        this.lastR = right[frames - 1];
      }
      if (frames < n) this.playing = false;  // underrun: rebuffer before playing again
    }
    // Silence, ramping down from the last sample so the cut does not click.
    for (let k = 0; i < n; i++, k++) {
      const g = k < FADE ? 1 - k / FADE : 0;
      left[i] = this.lastL * g;
      right[i] = this.lastR * g;
    }
    if (!this.playing) { this.lastL = 0; this.lastR = 0; }
    Atomics.store(this.header, 1, read >>> 0);
    return true;
  }
}
registerProcessor('sadx-audio', SadxAudio);
