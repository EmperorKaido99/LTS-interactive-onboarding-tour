/**
 * Narration helper — plays pre-recorded MP3 audio for each tour step.
 * Audio files are in src/audio/<tour-name>/<step-id>.mp3
 * For offline builds, audio is embedded as base64 data URIs in window.__LTS_AUDIO.
 */

let currentAudio = null;

/**
 * Stop any currently playing narration.
 */
export function stopNarration() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

/**
 * Play pre-recorded narration for a given tour step.
 * @param {string} tourName - Tour name (e.g. "login-tour")
 * @param {string} stepId   - Step ID (e.g. "login-username" or "step-0")
 */
export async function narrate(tourName, stepId) {
  stopNarration();

  if (!stepId) return;

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
    currentAudio = audio;
    audio.play().catch(() => {});
  } catch {
    // Audio file not found — silent
  }
}
