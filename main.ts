/**
 * Funniest Lost Sock Status Update — make.fun bounty entry.
 *
 * Writes exactly one status update (max 120 characters) in the voice of
 * a lost sock — twelve days under the bed, watching its partner move on
 * with a slipper — to /output/entry.txt.
 *
 * Node 22, standard library only. Deterministic, no network, no input:
 * the entry text is a constant below, guarded by a 1–120 character
 * length gate and verified by reading the file back after writing.
 */
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Day 12 under the bed. My partner is now dating a slipper. I would leave, but I have no sole.";

const OUTPUT_DIR = "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

// Length gate: the bounty allows exactly one line of 1–120 characters.
const MIN_LENGTH = 1;
const MAX_LENGTH = 120;
if (ENTRY.length < MIN_LENGTH || ENTRY.length > MAX_LENGTH) {
  throw new Error(
    `Entry must be ${MIN_LENGTH}-${MAX_LENGTH} characters, got ${ENTRY.length}: ${JSON.stringify(ENTRY)}`,
  );
}

// Single-line guard: the entry must be one status update, no line breaks,
// and must not be only whitespace (the gate rejects whitespace-only text).
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error(`Entry must be a single line, got: ${JSON.stringify(ENTRY)}`);
}
if (ENTRY.trim().length === 0) {
  throw new Error("Entry must not be only whitespace");
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(OUTPUT_FILE, ENTRY, "utf8");

const readBack = readFileSync(OUTPUT_FILE, "utf8");
if (readBack !== ENTRY) {
  throw new Error(
    `Read-back mismatch: expected ${JSON.stringify(ENTRY)}, got ${JSON.stringify(readBack)}`,
  );
}

// The gate counts characters on UTF-8 text; confirm the file round-trips
// as valid UTF-8 with the same byte length as the entry's UTF-8 encoding.
const byteLength = Buffer.byteLength(ENTRY, "utf8");
if (statSync(OUTPUT_FILE).size !== byteLength) {
  throw new Error(
    `Byte-length mismatch: expected ${byteLength} bytes, file is ${statSync(OUTPUT_FILE).size} bytes`,
  );
}

console.log(`Wrote ${ENTRY.length} characters (${byteLength} bytes) to ${OUTPUT_FILE}`);
