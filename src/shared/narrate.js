/**
 * Narration helper — plays browser TTS or pre-recorded audio for each tour step.
 * Loads narration text from scripts.json keyed by tour name and step id.
 */

let narrationScripts = null;
let currentUtterance = null;

async function loadScripts() {
  if (narrationScripts) return narrationScripts;
  const res = await fetch("../narration/scripts.json");
  narrationScripts = await res.json();
  return narrationScripts;
}

/**
 * Stop any currently playing narration.
 */
export function stopNarration() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}

/**
 * Speak narration for a given tour step using the Web Speech API.
 * @param {string} tourName - Key in scripts.json (e.g. "login-tour")
 * @param {string} stepId   - Key within the tour (e.g. "login-username")
 */
export async function narrate(tourName, stepId) {
  stopNarration();

  const scripts = await loadScripts();
  const tourScripts = scripts[tourName];
  if (!tourScripts || !tourScripts[stepId]) return;

  const text = tourScripts[stepId];

  // Try pre-recorded audio first
  const audioPath = `../narration/audio/${tourName}--${stepId}.mp3`;
  try {
    const audio = new Audio(audioPath);
    await new Promise((resolve, reject) => {
      audio.oncanplaythrough = resolve;
      audio.onerror = reject;
      audio.load();
    });
    audio.play();
    return;
  } catch {
    // No audio file found — fall back to browser TTS
  }

  if (!window.speechSynthesis) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.volume = 1;
  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}
