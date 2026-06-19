/**
 * Narration helper — plays browser TTS or pre-recorded audio for each tour step.
 * Loads narration text from scripts.json keyed by tour name and step id.
 */

let narrationScripts = null;
let currentUtterance = null;
let currentAudio = null;
let preferredVoice = null;
let voicesReady = false;

/**
 * Select the best available voice for narration.
 * Prefers natural/premium English voices, falls back to any English voice.
 */
function selectVoice() {
  if (preferredVoice) return preferredVoice;
  if (!window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  // Priority list: prefer natural/premium English voices
  const preferred = [
    "Microsoft Zira",    // Windows natural female
    "Microsoft David",   // Windows natural male
    "Google UK English Female",
    "Google UK English Male",
    "Google US English",
    "Samantha",          // macOS
    "Karen",             // macOS Australian
    "Daniel",            // macOS British
    "Moira",             // macOS Irish
  ];

  // Try preferred voices first
  for (const name of preferred) {
    const match = voices.find(v => v.name.includes(name));
    if (match) {
      preferredVoice = match;
      return match;
    }
  }

  // Fall back to any English voice that's not a novelty voice
  const englishVoices = voices.filter(
    v => v.lang.startsWith("en") && !v.name.includes("Zarvox") && !v.name.includes("Whisper")
  );

  // Prefer voices marked as localService (usually higher quality)
  const localEnglish = englishVoices.filter(v => v.localService);
  if (localEnglish.length) {
    preferredVoice = localEnglish[0];
    return preferredVoice;
  }

  if (englishVoices.length) {
    preferredVoice = englishVoices[0];
    return preferredVoice;
  }

  // Absolute fallback
  preferredVoice = voices[0];
  return preferredVoice;
}

// Pre-load voices (they load asynchronously in some browsers)
if (window.speechSynthesis) {
  window.speechSynthesis.getVoices(); // trigger initial load
  window.speechSynthesis.onvoiceschanged = () => {
    voicesReady = true;
    selectVoice();
  };
  // Some browsers fire the event synchronously
  if (window.speechSynthesis.getVoices().length) {
    voicesReady = true;
    selectVoice();
  }
}

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
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  currentUtterance = null;
}

/**
 * Speak narration for a given tour step using the Web Speech API.
 * Supports both element-based step IDs and index-based fallback.
 * @param {string} tourName - Key in scripts.json (e.g. "login-tour")
 * @param {string} stepId   - Key within the tour (e.g. "login-username" or "step-0")
 */
export async function narrate(tourName, stepId) {
  stopNarration();

  if (!stepId) return;

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
    currentAudio = audio;
    audio.play();
    return;
  } catch {
    // No audio file found — fall back to browser TTS
  }

  if (!window.speechSynthesis) return;

  const utterance = new SpeechSynthesisUtterance(text);

  // Apply voice settings for better quality
  const voice = selectVoice();
  if (voice) utterance.voice = voice;

  utterance.rate = 0.92;    // Slightly slower for clarity
  utterance.pitch = 1.0;
  utterance.volume = 1;
  utterance.lang = "en-US";

  currentUtterance = utterance;

  // Chrome bug workaround: TTS stops after ~15 seconds
  // Resume periodically to prevent cutoff
  const resumeInterval = setInterval(() => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    } else {
      clearInterval(resumeInterval);
    }
  }, 10000);

  utterance.onend = () => clearInterval(resumeInterval);
  utterance.onerror = () => clearInterval(resumeInterval);

  window.speechSynthesis.speak(utterance);
}
