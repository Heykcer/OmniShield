import io
import wave

import numpy as np
from PIL import Image, UnidentifiedImageError

from app.schemas import Indicator

MAX_IMAGE_PIXELS = 25_000_000


def _frequency_indicator(samples: np.ndarray, code: str) -> Indicator:
    spectrum = np.abs(np.fft.fftshift(np.fft.fft2(samples)))
    height, width = spectrum.shape
    yy, xx = np.ogrid[:height, :width]
    high_frequency = spectrum[(xx - width // 2) ** 2 + (yy - height // 2) ** 2 > (min(height, width) * 0.08) ** 2]
    median = float(np.median(high_frequency)) if high_frequency.size else 0.0
    peak_ratio = float(np.mean(high_frequency > median * 20)) if median else 0.0
    contribution = min(55, round(15 + peak_ratio * 4000))
    return Indicator(
        code=code,
        detail=f"Frequency-domain signal check found a {peak_ratio:.1%} concentration of strong spectral peaks; this is not proof of manipulation.",
        contribution=contribution,
    )


def analyze_image(data: bytes) -> list[Indicator]:
    try:
        with Image.open(io.BytesIO(data)) as image:
            if image.width * image.height > MAX_IMAGE_PIXELS:
                raise ValueError("Image dimensions exceed the analysis limit")
            gray = image.convert("L").resize((256, 256))
            samples = np.asarray(gray, dtype=np.float32)
    except (UnidentifiedImageError, OSError) as exc:
        raise ValueError("Upload is not a supported image") from exc
    return [_frequency_indicator(samples, "image_fft")]


def analyze_wav(data: bytes) -> list[Indicator]:
    try:
        with wave.open(io.BytesIO(data), "rb") as audio:
            if audio.getcomptype() != "NONE" or audio.getnchannels() not in (1, 2):
                raise ValueError("Only uncompressed mono or stereo WAV audio is supported")
            width = audio.getsampwidth()
            if width not in (1, 2, 4):
                raise ValueError("Unsupported WAV sample width")
            frames = audio.readframes(min(audio.getnframes(), audio.getframerate() * 30))
            sample_rate = audio.getframerate()
    except (wave.Error, EOFError) as exc:
        raise ValueError("Upload is not a valid WAV file") from exc
    dtype = {1: np.uint8, 2: np.int16, 4: np.int32}[width]
    samples = np.frombuffer(frames, dtype=dtype).astype(np.float32)
    if samples.size < 256:
        raise ValueError("WAV audio is too short to analyze")
    samples -= samples.mean()
    if sample_rate > 16_000:
        samples = samples[:: max(1, sample_rate // 16_000)]
    window = min(256, samples.size)
    samples = samples[: window * (samples.size // window)].reshape(-1, window).mean(axis=0)
    return [_frequency_indicator(samples.reshape(16, 16), "audio_fft")]