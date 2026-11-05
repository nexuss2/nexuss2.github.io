// Replaces Emscripten's src/lib/libwasmfs_fetch.js for the disc mount. The stock backend learns a
// file's size by downloading it and keeps everything it fetches for the life of the page, so the
// game's scan of 2,000 disc files downloaded most of the disc. Sizes come from an index here, and
// only the chunks a read touches are fetched, into a bounded cache. A packaged build (web/split.mjs)
// has no separate disc files: its index gives each file's offset across fixed-size packs.

addToLibrary({
  _wasmfs_create_fetch_backend_js__deps: [
    '$wasmFS$backends',
    '_wasmfs_fetch_get_file_url',
    '_wasmfs_fetch_get_chunk_size',
  ],
  _wasmfs_create_fetch_backend_js: function (backend) {
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

      write: async (file, buffer, length, offset) => -{{{ cDefs.EROFS }}},

      read: async (file, buffer, length, offset) => {
        if (offset < 0 || length <= 0) {
          return 0;
        }
        const url = urlOf(file);
        const entry = (await entriesReady).get(indexKey(url));
        if (entry === undefined) {
          return -{{{ cDefs.ENOENT }}};
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
          return failed.status === 404 ? -{{{ cDefs.ENOENT }}} : -{{{ cDefs.EIO }}};
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
  },
});
