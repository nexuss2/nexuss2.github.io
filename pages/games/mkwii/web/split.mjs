#!/usr/bin/env node
// Packages a build into a folder of files no larger than --piece bytes. The game code is stripped of
// debug names, gzipped and cut into parts that the page streams back together. The disc is laid end
// to end and cut into packs, which web/wasmfs_fetch.js reads by offset.
//
// The output holds translated game code and game data, so it stays on this machine.
//
//   node web/split.mjs --build <dir> --disc <Assets/DATA> --out <new dir> [--piece 25000000]

import { closeSync, copyFileSync, existsSync, mkdirSync, openSync, readFileSync, readSync,
         readdirSync, writeFileSync, writeSync } from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

function parseArguments(argv) {
    const options = { piece: 25_000_000 };
    for (let i = 0; i < argv.length; i += 2) {
        const value = argv[i + 1];
        if (argv[i] === '--build') options.build = path.resolve(value);
        else if (argv[i] === '--disc') options.disc = path.resolve(value);
        else if (argv[i] === '--out') options.out = path.resolve(value);
        else if (argv[i] === '--piece') options.piece = Number(value);
        else throw new Error(`Unknown option ${argv[i]}`);
    }
    if (!options.build || !options.disc || !options.out) {
        throw new Error('Usage: node web/split.mjs --build <dir> --disc <dir> --out <dir> [--piece bytes]');
    }
    return options;
}

function readLeb(bytes, at) {
    let value = 0;
    let shift = 0;
    for (;;) {
        const byte = bytes[at++];
        value += (byte & 0x7f) * 2 ** shift;
        shift += 7;
        if ((byte & 0x80) === 0) {
            return { value, next: at };
        }
    }
}

// Drops the custom sections that only serve debuggers and profilers.
function stripDebugSections(wasm) {
    const kept = [wasm.subarray(0, 8)];
    let at = 8;
    while (at < wasm.length) {
        const start = at;
        const { value: size, next } = readLeb(wasm, at + 1);
        at = next + size;
        if (wasm[start] === 0) {
            const { value: nameLength, next: nameAt } = readLeb(wasm, next);
            const name = wasm.toString('latin1', nameAt, nameAt + nameLength);
            if (name === 'name' || name === 'producers') {
                continue;
            }
        }
        kept.push(wasm.subarray(start, at));
    }
    return Buffer.concat(kept);
}

function writePieces(bytes, directory, piece) {
    mkdirSync(directory);
    let count = 0;
    for (let at = 0; at < bytes.length; at += piece, count++) {
        const name = `part${String(count).padStart(3, '0')}.bin`;
        writeFileSync(path.join(directory, name), bytes.subarray(at, at + piece));
    }
    return count;
}

// Lays the disc end to end across fixed-size packs and returns the index the page reads.
function writeDiscPacks(discRoot, buildDir, outDir, piece) {
    mkdirSync(outDir);
    const entries = readFileSync(path.join(buildDir, 'disc_index.txt'), 'utf8')
        .split(/\r?\n/).filter(Boolean).map((line) => line.split('\t'));
    const buffer = Buffer.allocUnsafe(8 * 1024 * 1024);
    let lines = `#piece\t${piece}\n`;
    let packIndex = 0;
    let packUsed = 0;
    let virtualOffset = 0;
    let pack = openSync(path.join(outDir, 'pack000.bin'), 'w');

    for (const [sizeText, relative] of entries) {
        lines += `${sizeText}\t${relative}\t${virtualOffset}\n`;
        const input = openSync(path.join(discRoot, relative), 'r');
        let remaining = Number(sizeText);
        while (remaining > 0) {
            if (packUsed === piece) {
                closeSync(pack);
                packIndex++;
                packUsed = 0;
                pack = openSync(path.join(outDir, `pack${String(packIndex).padStart(3, '0')}.bin`), 'w');
            }
            const want = Math.min(buffer.length, remaining, piece - packUsed);
            const got = readSync(input, buffer, 0, want, null);
            if (got <= 0) {
                throw new Error(`${relative} is shorter than the index says`);
            }
            writeSync(pack, buffer, 0, got);
            packUsed += got;
            remaining -= got;
            virtualOffset += got;
        }
        closeSync(input);
    }
    closeSync(pack);
    return { lines, packs: packIndex + 1, bytes: virtualOffset };
}

const options = parseArguments(process.argv.slice(2));
if (existsSync(options.out)) {
    throw new Error(`${options.out} already exists; choose a new folder`);
}
mkdirSync(options.out, { recursive: true });

for (const name of ['WiiCompiled.html', 'WiiCompiled.js', 'WiiCompiled.data']) {
    copyFileSync(path.join(options.build, name), path.join(options.out, name));
}

const wasm = readFileSync(path.join(options.build, 'WiiCompiled.wasm'));
const stripped = stripDebugSections(wasm);
const compressed = gzipSync(stripped, { level: 9 });
const count = writePieces(compressed, path.join(options.out, 'wasm'), options.piece);
writeFileSync(path.join(options.out, 'wasm_parts.json'), JSON.stringify({ count }));

const disc = writeDiscPacks(options.disc, options.build, path.join(options.out, 'disc'), options.piece);
writeFileSync(path.join(options.out, 'disc_index.txt'), disc.lines);

const megabytes = (bytes) => (bytes / 1e6).toFixed(1);
console.log(`code: ${megabytes(wasm.length)} MB -> ${megabytes(stripped.length)} MB stripped -> ` +
            `${megabytes(compressed.length)} MB gzipped, ${count} part(s)`);
console.log(`disc: ${megabytes(disc.bytes)} MB in ${disc.packs} pack(s)`);
const pieces = readdirSync(path.join(options.out, 'wasm')).length + disc.packs;
console.log(`total pieces: ${pieces}, each at most ${megabytes(options.piece)} MB`);
