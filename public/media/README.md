# Project media

Drop real screen recordings or GIFs of your projects here, then point to them
from `src/data/content.js` using the `media` field, for example:

    media: '/media/workflow-engine.mp4',

Tips
- Prefer MP4 or WebM over GIF. A 10 second MP4 is usually 10x smaller than the same GIF.
- Record at 1280x800 or similar, trim to 6 to 12 seconds, and keep it silent.
- Free tools: OBS or ScreenToGif to record, HandBrake or ffmpeg to compress:
      ffmpeg -i input.mov -vf "scale=1280:-2,fps=30" -c:v libx264 -crf 28 -an -movflags +faststart output.mp4
- Leave `media` empty to keep the animated code preview instead.
