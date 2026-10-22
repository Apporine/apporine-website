"""Generate the Apporine brand film voiceover with Kokoro (British English).

Usage: .venv/Scripts/python.exe make_voice.py [voice ...]
Writes ../voice/voice-<name>.wav (48 kHz, mono, 24 bit, about -16 LUFS).
"""

import json
import subprocess
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro import KPipeline

SAMPLE_RATE = 24000
SPEED = 0.88
LEAD_IN = 0.4
OUT_DIR = Path(__file__).resolve().parent.parent / "voice"
TMP_DIR = Path(__file__).resolve().parent / "tmp"

# Kokoro’s inline pronunciation syntax: [word](/phonemes/). APP-oh-reen
# (misaki’s British notation: “a” as in cat, Q for the “oh” diphthong).
APPORINE = "[Apporine](/ˈapQɹiːn/)"

# (line, seconds of silence after it)
SCRIPT = [
    ("The world’s great industries were built to last.", 1.2),
    ("Capital.", 0.45),
    ("Energy.", 0.45),
    ("Networks.", 0.45),
    ("Trade.", 1.2),
    ("They were built for their century.", 0.5),
    ("And they delivered.", 1.3),
    ("But the world no longer waits.", 0.9),
    ("Every year, it asks them to move faster, than they were ever designed to move.", 1.3),
    ("Between that ambition, and the systems beneath it,", 0.7),
    ("there is a gap.", 2.0),
    ("Others will advise you on it.", 0.7),
    ("We build what closes it.", 1.4),
    ("Products and platforms, engineered to be relied on, for a decade.", 0.5),
    ("Not a quarter.", 1.6),
    (f"{APPORINE}.", 0.8),
    ("Pristine, by design.", 1.0),
]

VOICES = ["bm_george", "bm_lewis", "bm_fable", "bm_daniel"]


def trim(audio: np.ndarray, threshold_db: float = -50.0, pad: float = 0.03) -> np.ndarray:
    """Remove Kokoro's own leading and trailing silence so the gaps are exact."""
    threshold = 10 ** (threshold_db / 20)
    loud = np.flatnonzero(np.abs(audio) > threshold)
    if loud.size == 0:
        return audio
    pad_samples = int(pad * SAMPLE_RATE)
    start = max(loud[0] - pad_samples, 0)
    end = min(loud[-1] + pad_samples + 1, audio.size)
    return audio[start:end]


def silence(seconds: float) -> np.ndarray:
    return np.zeros(int(round(seconds * SAMPLE_RATE)), dtype=np.float32)


def speak(pipeline: KPipeline, text: str, voice: str) -> np.ndarray:
    parts = []
    for result in pipeline(text, voice=voice, speed=SPEED, split_pattern=None):
        print(f"    {result.phonemes}")
        parts.append(result.audio.numpy())
    return trim(np.concatenate(parts))


def normalise(src: Path, dst: Path) -> None:
    """Two pass EBU R128 loudnorm to -16 LUFS, true peak -1 dB, 48 kHz mono 24 bit."""
    target = "I=-16:TP=-1:LRA=11"
    measure = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", str(src), "-af", f"loudnorm={target}:print_format=json", "-f", "null", "-"],
        capture_output=True, text=True, check=True,
    ).stderr
    stats = json.loads(measure[measure.rindex("{"):measure.rindex("}") + 1])
    filt = (
        f"loudnorm={target}:linear=true"
        f":measured_I={stats['input_i']}:measured_TP={stats['input_tp']}"
        f":measured_LRA={stats['input_lra']}:measured_thresh={stats['input_thresh']}"
        f":offset={stats['target_offset']}"
    )
    subprocess.run(
        ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(src), "-af", filt,
         "-ar", "48000", "-ac", "1", "-c:a", "pcm_s24le", str(dst)],
        check=True,
    )


def main(voices: list[str]) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    TMP_DIR.mkdir(exist_ok=True)
    pipeline = KPipeline(lang_code="b", repo_id="hexgrad/Kokoro-82M")
    for voice in voices:
        print(f"{voice}:")
        take = [silence(LEAD_IN)]
        for text, gap in SCRIPT:
            take += [speak(pipeline, text, voice), silence(gap)]
        raw = TMP_DIR / f"{voice}.wav"
        sf.write(raw, np.concatenate(take), SAMPLE_RATE, subtype="FLOAT")
        dst = OUT_DIR / f"voice-{voice.split('_', 1)[1]}.wav"
        normalise(raw, dst)
        print(f"  -> {dst.name}: {sf.info(dst).duration:.2f} s")


if __name__ == "__main__":
    main(sys.argv[1:] or VOICES)
