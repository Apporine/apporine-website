"""Track the two bridge decks in the ai-bridge-gap proxy, for the citrine threads (src/thread.tsx).

Needs Python with opencv-python-headless and numpy:
    python scripts/track-bridge.py   ->  src/tracking.json (one entry per 25 fps proxy frame)
"""

import json
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
PROXY = ROOT / "proxies" / "ai-bridge-gap.mp4"
OUT = ROOT / "src" / "tracking.json"

# Measured on proxy frame 52 (2.08 s): the top of each deck at the tower face and at its open end.
REFERENCE_FRAME = 52
POINTS = {
    ("left", "tower"): (422, 487),
    ("left", "end"): (880, 487),
    ("right", "end"): (1072, 487),
    ("right", "tower"): (1480, 487),
}
PATCH = (36, 28)  # half width, half height of the template
SEARCH = 40  # pixels around the last position
SMOOTH = 5  # frames, centred moving average


def read_frames(path: Path) -> list[np.ndarray]:
    capture = cv2.VideoCapture(str(path))
    frames = []
    while True:
        ok, frame = capture.read()
        if not ok:
            return frames
        frames.append(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY))


def patch(image: np.ndarray, x: float, y: float, half_w: int, half_h: int) -> np.ndarray:
    x, y = int(round(x)), int(round(y))
    return image[y - half_h : y + half_h, x - half_w : x + half_w]


def subpixel(scores: np.ndarray, x: int, y: int) -> tuple[float, float]:
    """Parabola fit around the best match."""
    def offset(a: float, b: float, c: float) -> float:
        denominator = a - 2 * b + c
        return 0.0 if denominator == 0 else 0.5 * (a - c) / denominator

    dx = offset(scores[y, x - 1], scores[y, x], scores[y, x + 1]) if 0 < x < scores.shape[1] - 1 else 0.0
    dy = offset(scores[y - 1, x], scores[y, x], scores[y + 1, x]) if 0 < y < scores.shape[0] - 1 else 0.0
    return x + dx, y + dy


def track(frames: list[np.ndarray], start: tuple[int, int]) -> np.ndarray:
    half_w, half_h = PATCH
    template = patch(frames[REFERENCE_FRAME], *start, half_w, half_h)
    positions = np.zeros((len(frames), 2))
    positions[REFERENCE_FRAME] = start
    order = [range(REFERENCE_FRAME + 1, len(frames)), range(REFERENCE_FRAME - 1, -1, -1)]
    for frame_range in order:
        last = np.array(start, dtype=float)
        for index in frame_range:
            region = patch(frames[index], *last, half_w + SEARCH, half_h + SEARCH)
            scores = cv2.matchTemplate(region, template, cv2.TM_CCOEFF_NORMED)
            _, best, _, (bx, by) = cv2.minMaxLoc(scores)
            sx, sy = subpixel(scores, bx, by)
            last = last + np.array([sx - SEARCH, sy - SEARCH])
            positions[index] = last
            if best < 0.6:
                print(f"  weak match {best:.2f} at frame {index}")
    kernel = np.ones(SMOOTH) / SMOOTH
    padded = np.pad(positions, ((SMOOTH // 2, SMOOTH // 2), (0, 0)), mode="edge")
    return np.stack([np.convolve(padded[:, axis], kernel, mode="valid") for axis in (0, 1)], axis=1)


def main() -> None:
    frames = read_frames(PROXY)
    print(f"{len(frames)} frames")
    tracks = {}
    for key, start in POINTS.items():
        tracks[key] = track(frames, start)
        drift = tracks[key] - np.array(start)
        print(f"  {key}: x {drift[:, 0].min():+.1f}..{drift[:, 0].max():+.1f}, y {drift[:, 1].min():+.1f}..{drift[:, 1].max():+.1f}")
    out = [
        {
            side: {part: [round(float(v), 1) for v in tracks[(side, part)][index]] for part in ("tower", "end")}
            for side in ("left", "right")
        }
        for index in range(len(frames))
    ]
    OUT.write_text(json.dumps({"frames": out}))
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
