/**
 * Narration helper — plays pre-recorded MP3 audio for each tour step.
 * Audio files are in src/audio/<tour-name>/<step-id>.mp3
 * For offline builds, audio is embedded as base64 data URIs in window.__LTS_AUDIO.
 *
 * When no MP3 exists for a step (e.g. audio not generated yet), the narration
 * script for that step is spoken with the browser's built-in speech engine
 * (Web Speech API) so the tour always has a TTS voice over. Run
 * `python generate-audio.py` to produce the pre-recorded neural voice MP3s.
 */

let currentAudio = null;
let narrationToken = 0;
let scriptsPromise = null;

/**
 * Stop any currently playing narration.
 */
export function stopNarration() {
  narrationToken++;
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Load the narration scripts once (used for the browser-speech fallback).
 */
function loadScripts() {
  if (!scriptsPromise) {
    scriptsPromise = fetch("../narration/scripts.json")
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => ({}));
  }
  return scriptsPromise;
}

/**
 * Speak text with the browser's built-in speech engine (fallback TTS).
 */
function speak(text) {
  if (!window.speechSynthesis || !text) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  const voices = window.speechSynthesis
    .getVoices()
    .filter((v) => /^en([-_]|$)/i.test(v.lang));
  const preferred =
    voices.filter((v) => /female|zira|hazel|sonia|libby|susan|serena/i.test(v.name))[0] ||
    voices[0];
  if (preferred) utterance.voice = preferred;
  window.speechSynthesis.speak(utterance);
}

/**
 * Play pre-recorded narration for a given tour step.
 * @param {string} tourName - Tour name (e.g. "login-tour")
 * @param {string} stepId   - Step ID (e.g. "login-username" or "step-0")
 */
export async function narrate(tourName, stepId) {
  stopNarration();

  if (!stepId) return;

  const token = narrationToken;

  // Check for embedded base64 audio (offline build)
  if (window.__LTS_AUDIO && window.__LTS_AUDIO[tourName] && window.__LTS_AUDIO[tourName][stepId]) {
    const dataUri = window.__LTS_AUDIO[tourName][stepId];
    const audio = new Audio(dataUri);
    currentAudio = audio;
    audio.play().catch(() => {});
    return;
  }

  // Online mode: load from audio file
  const audioPath = `../audio/${tourName}/${stepId}.mp3`;
  try {
    const audio = new Audio(audioPath);
    await new Promise((resolve, reject) => {
      audio.oncanplaythrough = resolve;
      audio.onerror = reject;
      audio.load();
    });
    if (token !== narrationToken) return; // superseded by a newer step
    currentAudio = audio;
    audio.play().catch(() => {});
  } catch {
    // No MP3 for this step — speak the narration script instead
    const scripts = await loadScripts();
    if (token !== narrationToken) return;
    const text = scripts && scripts[tourName] && scripts[tourName][stepId];
    if (text) speak(text);
  }
}
