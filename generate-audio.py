"""
Generate MP3 audio files for all narration scripts using edge-tts.
Outputs to src/audio/<tour-name>/<step-id>.mp3

Usage: python generate-audio.py
"""

import asyncio
import json
import os
import edge_tts

ROOT = os.path.dirname(os.path.abspath(__file__))
SCRIPTS_PATH = os.path.join(ROOT, "src", "narration", "scripts.json")
AUDIO_DIR = os.path.join(ROOT, "src", "audio")

# Microsoft neural voice — clear, professional female English voice
VOICE = "en-ZA-LeahNeural"  # South African English (matches LTS context)
RATE = "-5%"  # Slightly slower for clarity


async def generate_audio(text, output_path):
    """Generate a single MP3 file from text."""
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
    await communicate.save(output_path)


async def main():
    with open(SCRIPTS_PATH, "r", encoding="utf-8") as f:
        scripts = json.load(f)

    total = sum(len(steps) for steps in scripts.values())
    count = 0

    for tour_name, steps in scripts.items():
        tour_dir = os.path.join(AUDIO_DIR, tour_name)
        os.makedirs(tour_dir, exist_ok=True)

        for step_id, text in steps.items():
            count += 1
            output_path = os.path.join(tour_dir, f"{step_id}.mp3")

            # Skip if already generated
            if os.path.exists(output_path):
                print(f"  [{count}/{total}] SKIP {tour_name}/{step_id}.mp3 (exists)")
                continue

            print(f"  [{count}/{total}] Generating {tour_name}/{step_id}.mp3 ...")
            try:
                await generate_audio(text, output_path)
            except Exception as e:
                print(f"    ERROR: {e}")

    print(f"\n=== Done! Generated audio for {total} narration steps ===")
    print(f"Output: {AUDIO_DIR}")


if __name__ == "__main__":
    asyncio.run(main())
