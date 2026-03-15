/**
 * YIN pitch detection algorithm
 * Based on: de Cheveigné & Kawahara (2002)
 * Returns frequency in Hz, or -1 if no pitch detected.
 */

const DEFAULT_THRESHOLD = 0.20; // acoustic guitars need a more lenient threshold due to rich harmonics

// Guitar frequency range: high-e string up the neck (~1380 Hz) → low E string (82 Hz).
// tau = sampleRate / frequency, so:
//   tau_min = 44100 / 1380 ≈ 32   (highest playable note)
//   tau_max = 44100 /   82 ≈ 537  (low open E string)
// Only scanning this tau window cuts the outer-loop from halfSize iterations to ~505,
// giving a ~7× speedup. Combined with buffer size 4096 (vs 8192) the total speedup
// over the naive approach is roughly 15×.
const GUITAR_TAU_MIN = 32;
const GUITAR_TAU_MAX = 540;

export function yin(buffer: Float32Array<ArrayBuffer>, sampleRate: number, threshold = DEFAULT_THRESHOLD): number {
  const bufferSize = buffer.length;
  const halfSize   = Math.floor(bufferSize / 2);
  const tauMax     = Math.min(halfSize, GUITAR_TAU_MAX + 1);

  // yinBuffer only needs to hold values up to tauMax
  const yinBuffer = new Float32Array(tauMax);

  // Step 1 + 3: Difference function + cumulative mean normalisation.
  // We must compute the running sum from tau=1 (even for tau < GUITAR_TAU_MIN)
  // so that the normalisation is correct when we start reading results.
  yinBuffer[0] = 1;
  let runningSum = 0;

  for (let tau = 1; tau < tauMax; tau++) {
    let sum = 0;
    for (let i = 0; i < halfSize; i++) {
      const delta = buffer[i] - buffer[i + tau];
      sum += delta * delta;
    }
    yinBuffer[tau] = sum;

    // Step 3: Cumulative mean normalized difference
    runningSum += yinBuffer[tau];
    yinBuffer[tau] *= tau / runningSum;
  }

  // Step 4: Absolute threshold — search only within the guitar tau window
  let tau = Math.max(2, GUITAR_TAU_MIN);
  while (tau < tauMax) {
    if (yinBuffer[tau] < threshold) {
      // Walk to local minimum
      while (tau + 1 < tauMax && yinBuffer[tau + 1] < yinBuffer[tau]) {
        tau++;
      }
      break;
    }
    tau++;
  }

  if (tau >= tauMax || yinBuffer[tau] >= threshold) {
    return -1; // No pitch detected
  }

  // Step 5: Parabolic interpolation for sub-sample accuracy
  const betterTau = parabolicInterpolation(yinBuffer, tau);
  return sampleRate / betterTau;
}

function parabolicInterpolation(yinBuffer: Float32Array, tau: number): number {
  const x0 = tau < 1 ? tau : tau - 1;
  const x2 = tau + 1 < yinBuffer.length ? tau + 1 : tau;

  if (x0 === tau) return yinBuffer[tau] <= yinBuffer[x2] ? tau : x2;
  if (x2 === tau) return yinBuffer[tau] <= yinBuffer[x0] ? tau : x0;

  const s0 = yinBuffer[x0];
  const s1 = yinBuffer[tau];
  const s2 = yinBuffer[x2];

  return tau + (s2 - s0) / (2 * (2 * s1 - s2 - s0));
}

// --- Note detection ---

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const A4 = 440;
const A4_MIDI = 69;

export interface DetectedNote {
  name: string;   // e.g. "E2"
  cents: number;  // -50..+50
  frequency: number;
  octave: number;
}

export function frequencyToNote(frequency: number): DetectedNote {
  // MIDI note number (float)
  const midiNote = 12 * Math.log2(frequency / A4) + A4_MIDI;
  const roundedMidi = Math.round(midiNote);
  const cents = Math.round((midiNote - roundedMidi) * 100);

  const octave = Math.floor(roundedMidi / 12) - 1;
  const noteIndex = ((roundedMidi % 12) + 12) % 12;
  const name = NOTE_NAMES[noteIndex] + octave;

  return { name, cents, frequency, octave };
}
