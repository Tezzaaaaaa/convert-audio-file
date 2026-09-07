# Convert Audio File

A macOS Shortcut for converting audio files locally with **FFmpeg**.

Convert audio without uploading your files to an online conversion service. Processing is performed on your Mac using your local FFmpeg installation.

## Features

- Local audio conversion
- FFmpeg-powered processing
- No online conversion service required
- No audio upload required
- Runs through Apple Shortcuts on macOS
- Uses your Mac's own processing power
- Designed for locally stored audio files

## Requirements

- A Mac running macOS
- Apple Shortcuts
- FFmpeg

## Install FFmpeg

The recommended way to install FFmpeg on macOS is with [Homebrew](https://brew.sh/).

Open **Terminal** and run:

```bash
brew install ffmpeg
```

Verify the installation with:

```bash
which ffmpeg
```

If the command returns a path to `ffmpeg`, the executable is installed on your Mac.

## Install the Shortcut

Download the **Convert Audio File** Shortcut from this repository and open it with Apple Shortcuts.

> **Repository status:** The Shortcut file itself still needs to be added to this repository. Until it is uploaded, this repository contains the project documentation only.

Once the Shortcut is added, open the `.shortcut` file on your Mac and follow any macOS or Shortcuts permission prompts.

## How to Use

1. Make sure FFmpeg is installed.
2. Open **Convert Audio File** in Apple Shortcuts.
3. Select the audio file you want to convert.
4. Choose the available conversion options configured in the Shortcut.
5. Let FFmpeg process the file locally.
6. Find the converted audio file at the output location configured by the Shortcut.

## Privacy

Audio processing is performed locally on your Mac using FFmpeg.

The Shortcut does not require an online conversion website or an account, and it does not need to upload your audio files to a third-party conversion service.

## FFmpeg

This project uses [FFmpeg](https://ffmpeg.org/), an independent open-source multimedia framework.

FFmpeg is **not included with this Shortcut** and must be installed separately.

This project does not redistribute FFmpeg.

## Compatibility

This project is intended for **macOS** and Apple Shortcuts on Mac.

It is not intended for iPhone or iPad.

The formats that can be converted depend on the FFmpeg installation and the conversion settings implemented by the Shortcut.

## Troubleshooting

### FFmpeg is not found

Run:

```bash
which ffmpeg
```

If nothing is returned, install FFmpeg with:

```bash
brew install ffmpeg
```

If FFmpeg is installed but the Shortcut cannot find it, check that the Shortcut's shell command points to the correct FFmpeg executable path on your Mac.

### The Shortcut cannot access a file

Check the file-access permissions granted to **Shortcuts** in macOS and allow access to the location containing your audio files.

### A particular format does not work

Supported formats depend on the installed FFmpeg build and the conversion settings implemented by the Shortcut.

## Credits

Uses **FFmpeg** for local audio processing.

FFmpeg is an independent open-source project and is not affiliated with this project.

## Version

**1.0 — Initial Release**

### Changelog

- Initial release
- Local FFmpeg-based audio conversion
- macOS Shortcuts integration
- Local/offline processing
- No online conversion service required
