---
title: The walking skeleton
description: The first code. A window on Windows and macOS, a folder of photos read without touching them, iPhone photos the right way up, and one edit working from slider to exported JPEG.
date: 2026-10-19
part: 7
draft: true
---

The plan for the first milestone was a walking skeleton: every risky piece of the app working once, on both Windows and macOS, before any feature is built on top. No styling, no polish. A window, a folder of photos, an iPhone photo decoded correctly, and one edit (exposure) working from the slider to an exported file. The [M1 work plan](https://github.com/seura-photos/seura/blob/main/docs/m1-plan.md) split it into six slices, one pull request each.

It took two days and eight pull requests. Claude Code wrote the code on my Windows PC; I reviewed and merged each pull request and checked the app on both machines. For the Mac, I turned on Remote Control, so the Windows session could hand checks to a second Claude Code session running on my MacBook Pro and get the results back. That worked better than I expected: the Mac session found real problems the Windows side couldn't see.

## Making the tests fail on purpose

Early in the first slice, a check that was supposed to fail the build if the app wrote outside its allowed folders turned out to have no failure path at all: a scripted edit hadn't applied, and nothing complained. Claude caught it by planting a file where the app must never write and seeing the check pass anyway.

From then on, every important test was checked by breaking the code it guards and confirming the test noticed. Claude did this for the never-overwrite rule for edit files, the data-safety suite, the render tests, and the autosave. A test that can't fail only makes you feel safer.

## Not touching your files

Seura's [first rule](https://github.com/seura-photos/seura/blob/main/CLAUDE.md) is that it never changes your photos. M1 built a data-safety test suite that runs real operations on a temporary library and compares every file before and after, down to modification times. It runs on both platforms on every pull request.

It also found that the app was breaking its own second rule before it did anything at all. One test run left 79 MB in a hidden app-data folder on Windows: the web view's own cache. I decided to run the web view privately on both platforms and move what Windows keeps into Seura's visible cache folder, and we wrote that down as [decision 0013](https://github.com/seura-photos/seura/blob/main/docs/decisions/0013-web-view-and-os-data.md). Now CI checks where the app writes on both platforms.

## Photos that are only in the cloud

I raised this one: my phone photos reach my PC through OneDrive's camera roll, and most of those files exist only in the cloud. An app that reads them downloads them. Claude researched how each sync service marks these files, and Seura now recognizes them and never reads them. On Windows it shows the thumbnail the system already has; on the Mac, a placeholder for now. On my camera roll (3,947 files, about 3,885 of them cloud-only, 21 GB), I scrolled through the whole folder in Seura and not a single photo was downloaded.

This changed the edit format too. Tagging a cloud-only photo shouldn't download it, but an edit file needed the photo's fingerprint and dimensions, which means reading the whole file. Claude pointed this out; I made both optional, filled in when the photo is next read. Building the app this early raised two more questions the format hadn't settled, how to read files from a newer version and how redo survives a restart, and the [format](https://github.com/seura-photos/edit-format) now answers both.

## An index without a database

The technical plan bet on keeping the photo index in memory instead of in a database, with a benchmark to settle it. At 100,000 photos the index takes 34 MB, loads in under a tenth of a second, and answers a search keystroke in under 8 milliseconds, at least five times inside every target. The bet held ([decision 0010](https://github.com/seura-photos/seura/blob/main/docs/decisions/0010-in-memory-index.md)). One detail: the serialization library the plan named had been abandoned by its developers in late 2025. Claude found that before adding it and chose a maintained one.

## iPhone photos, and dropping a dependency

HEIC, the iPhone's format, was the riskiest piece. It uses a video codec covered by patents. The plan used each operating system's own licensed decoder, with an open-source fallback on Windows for PCs without Microsoft's free extensions.

Test files made with Apple's own software on my Mac caught a real bug: Windows' decoder already turns photos the right way up, and Claude's first version turned them again. Real photos from my iPhone confirmed the fix.

Then the research showed how rarely HEIC actually reaches a Windows PC: OneDrive, iCloud for Windows, and plain USB transfers all convert photos to JPEG by default. Getting real HEIC files onto my own PC took effort. So I asked whether removing the fallback would be erring on the side of caution, and simpler. Claude agreed and recommended it. The fallback's video decoder has no patent license, and it brought a build tool to every Windows setup and two libraries into the installer. I decided to remove it ([decision 0014](https://github.com/seura-photos/seura/blob/main/docs/decisions/0014-heic-system-decoders-only.md)). Without Microsoft's extensions, a HEIC photo now says so instead of failing. If people need the fallback, it can come back.

## One edit, end to end

The last slice put the whole editing path together. Every edit is written once, as a small GPU program (a shader), and that one program produces both the live preview and the exported file, so they can't disagree ([decision 0004](https://github.com/seura-photos/seura/blob/main/docs/decisions/0004-single-render-pipeline.md)). Where the web view has no WebGPU, as on Macs before macOS 26, the same shader is translated automatically for the older WebGL2.

To prove the preview matches the export, we agreed on a check that runs inside the real app: it renders a test image with every preview path the window has and compares the pixels with the exported version. On my PC they match exactly; on my Mac, within one level out of 255. It also answered an open question: Apple's web view in an app like Seura does have WebGPU on macOS 26. No source we found had confirmed it.

Opening a photo now shows the preview and an exposure slider. Drag it and the photo follows, the edit file beside the photo is saved within a second, and Export writes a JPEG in standard color that looks right everywhere.

## What's still open

The automated checks cover a lot, but not everything a person sees: whether the preview on screen is the right way up, whether wide-gamut colors look right on the display, and whether the slider feels smooth. I decided to fold that hands-on check into a larger round of testing once the app is more complete. Claude listed exactly what it has to cover, so it doesn't get lost.

## What's next

The next milestone is Browse: the real Library with the visual design applied, sorting and photo details, and the thumbnail speed work M1 showed is needed. It's done when I can point Seura at my real photo library and browse it every day on both machines.
