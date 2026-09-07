Convert Audio File

Convert audio files locally on macOS using FFmpeg and Apple Shortcuts.

No online converter. No file uploads. Your audio is processed directly on your Mac.

Features

* Local audio conversion
* Powered by FFmpeg
* Offline/local processing
* No third-party conversion website required
* No audio uploads
* Runs through Apple Shortcuts
* Uses your Mac’s processing power
* Designed for locally stored audio files

Requirements

* macOS
* Apple Shortcuts
* FFmpeg

Installation

1. Install FFmpeg

The recommended way to install FFmpeg on macOS is with Homebrew.

Open Terminal and run:

brew install ffmpeg

Verify that FFmpeg is installed:

which ffmpeg

You should see the location of your FFmpeg executable.

2. Install the Shortcut

Download Convert Audio File.shortcut from this repository and open it with Apple Shortcuts.

If macOS asks for permission to access files or folders, allow the requested access.

How to Use

1. Open Convert Audio File.
2. Select the audio file you want to convert.
3. Choose the available conversion settings.
4. FFmpeg processes the audio locally.
5. The converted file is saved on your Mac.

Privacy

All audio processing takes place locally on your Mac using your installed FFmpeg executable.

Your audio files are not uploaded to an online conversion service.

No conversion website or account is required.

FFmpeg

This Shortcut uses FFmpeg, an independent open-source multimedia framework.

FFmpeg is not included with this Shortcut and must be installed separately.

This repository does not redistribute FFmpeg.

Compatibility

Convert Audio File is designed for macOS.

It is not intended for iPhone or iPad.

Supported input and output formats depend on the conversion settings configured in the Shortcut and the capabilities of the installed FFmpeg version.

Troubleshooting

FFmpeg cannot be found

Run:

which ffmpeg

If FFmpeg is not installed, run:

brew install ffmpeg

The Shortcut cannot access my files

Check the permissions granted to Shortcuts in macOS and allow access to the files or folders required by the Shortcut.

A format does not work

Format support depends on your installed FFmpeg version and the conversion settings configured in the Shortcut.

Credits

Uses FFmpeg for local audio processing.

FFmpeg is an independent open-source project and is not affiliated with this Shortcut.

Version

1.0 — Initial Release

Changelog

* Initial release
* Local FFmpeg-based audio conversion
* macOS Shortcuts integration
* Offline/local processing
* No online conversion service required
