#!/usr/bin/env node
// Local host for the WebAssembly build. Serves the compiled page from one directory and the
// extracted disc from another, with the isolation headers SharedArrayBuffer requires. A folder from
// web/split.mjs already holds its disc, so it needs no --disc.
//
// The build contains translated game code and /disc exposes extracted game data, so this binds to
// the loopback interface only. Do not put either behind a public server.
//
//   node web/serve.mjs --build <dir> [--disc <Assets/DATA>] [--port 8642]

import { appendFile } from 'node:fs/promises';
import { createReadStream, promises as fs } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.wasm': 'application/wasm',
    '.json': 'application/json',
    '.data': 'application/octet-stream',
};

function parseArguments(argv) {
    const options = { port: 8642 };
    for (let i = 0; i < argv.length; i += 2) {
        const value = argv[i + 1];
        if (argv[i] === '--build') options.build = path.resolve(value);
        else if (argv[i] === '--disc') options.disc = path.resolve(value);
        else if (argv[i] === '--port') options.port = Number(value);
        else throw new Error(`Unknown option ${argv[i]}`);
    }
    if (!options.build) {
        throw new Error('Usage: node web/serve.mjs --build <dir> [--disc <dir>] [--port 8642]');
    }
    return options;
}

// Maps a URL path under `root`, refusing anything that escapes it.
function resolveInside(root, urlPath) {
    const resolved = path.resolve(root, `.${path.posix.normalize(`/${urlPath}`)}`);
    return resolved === root || resolved.startsWith(root + path.sep) ? resolved : null;
}

function parseRange(header, size) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(header ?? '');
    if (!match || (match[1] === '' && match[2] === '')) return null;
    if (match[1] === '') {
        const suffix = Math.min(Number(match[2]), size);
        return { start: size - suffix, end: size - 1 };
    }
    const start = Number(match[1]);
    const end = match[2] === '' ? size - 1 : Math.min(Number(match[2]), size - 1);
    return start <= end ? { start, end } : null;
}

async function sendFile(request, response, file) {
    let info;
    try {
        info = await fs.stat(file);
    } catch {
        info = null;
    }
    if (!info?.isFile()) {
        response.writeHead(404);
        response.end();
        return;
    }

    const headers = {
        'Content-Type': MIME_TYPES[path.extname(file)] ?? 'application/octet-stream',
        'Accept-Ranges': 'bytes',
    };
    // The page itself must revalidate rather than skip the cache: V8 only keeps compiled WebAssembly
    // for a cacheable response, and recompiling 145 MB costs every load seconds and frame rate.
    if (!options.disc || !file.startsWith(options.disc + path.sep)) {
        const etag = `"${info.size}-${Math.round(info.mtimeMs)}"`;
        headers['Cache-Control'] = 'no-cache';
        headers.ETag = etag;
        if (request.headers['if-none-match'] === etag) {
            response.writeHead(304, headers);
            response.end();
            return;
        }
    } else {
        headers['Cache-Control'] = 'no-store';
    }
    if (request.headers.range !== undefined) {
        const range = parseRange(request.headers.range, info.size);
        if (range === null) {
            response.writeHead(416, { 'Content-Range': `bytes */${info.size}` });
            response.end();
            return;
        }
        response.writeHead(206, {
            ...headers,
            'Content-Range': `bytes ${range.start}-${range.end}/${info.size}`,
            'Content-Length': range.end - range.start + 1,
        });
        createReadStream(file, range).pipe(response);
        return;
    }
    response.writeHead(200, { ...headers, 'Content-Length': info.size });
    if (request.method === 'HEAD') {
        response.end();
        return;
    }
    createReadStream(file).pipe(response);
}

const options = parseArguments(process.argv.slice(2));

createServer(async (request, response) => {
    response.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    response.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    response.setHeader('Cross-Origin-Resource-Policy', 'same-origin');

    const urlPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    // The page reports its log here, which is the only record of a crash in another browser.
    if (request.method === 'POST' && urlPath === '/log') {
        const parts = [];
        for await (const part of request) {
            parts.push(part);
        }
        await appendFile(path.join(options.build, 'game.log'), Buffer.concat(parts));
        response.writeHead(204);
        response.end();
        return;
    }
    const file = options.disc && urlPath.startsWith('/disc/')
        ? resolveInside(options.disc, urlPath.slice('/disc/'.length))
        : resolveInside(options.build, urlPath === '/' ? 'WiiCompiled.html' : urlPath);
    if (file === null) {
        response.writeHead(403);
        response.end();
        return;
    }
    await sendFile(request, response, file);
}).listen(options.port, '127.0.0.1', () => {
    console.log(`WiiCompiled web build: http://localhost:${options.port}/`);
});
