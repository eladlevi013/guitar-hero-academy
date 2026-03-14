/**
 * YIN pitch detection algorithm
 * Based on: de Cheveigné & Kawahara (2002)
 * Returns frequency in Hz, or -1 if no pitch detected.
 */

const DEFAULT_THRESHOLD = 0.10;

export function yin(buffer: Float32Array<ArrayBuffer>, sampleRate: number, threshold = DEFAULT_THRESHOLD): number {
  const bufferSize = buffer.length;
  const halfSize = Math.floor(bufferSize / 2);
  const yinBuffer = new Float32Array(halfSize);

  // Step 1: Autocorrelation difference function
  yinBuffer[0] = 1;
  let runningSum = 0;

  for (let tau = 1; tau < halfSize; tau++) {
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

  // Step 4: Absolute threshold — find first tau where yinBuffer[tau] < threshold
  let tau = 2;
  while (tau < halfSize) {
    if (yinBuffer[tau] < threshold) {
      // Walk to local minimum
      while (tau + 1 < halfSize && yinBuffer[tau + 1] < yinBuffer[tau]) {
        tau++;
      }
      break;
    }
    tau++;
  }

  if (tau === halfSize || yinBuffer[tau] >= threshold) {
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
