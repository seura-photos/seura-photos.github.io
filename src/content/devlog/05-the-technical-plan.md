---
title: The technical plan
description: Rust and a web interface, one GPU implementation of every edit, a patent problem with iPhone photos, a license problem I didn't see coming, and only two computers to test on.
date: 2026-10-18
part: 5
---

With the what and the how-it-feels settled, the next document was the technical design: how Seura will actually be built. Claude drafted it, researching current libraries and their licenses, and I made the calls where there was a real choice. Here are the decisions that mattered most.

## The shape of the app

Seura is a [Tauri](https://tauri.app) app. A Rust core does everything that touches your files: scanning folders, reading photos, writing edit files, generating thumbnails. The interface is a web app built with React and TypeScript, running in the web view each operating system provides. One rule makes this safe: **only the Rust core touches files**. The interface asks; the core decides. That keeps every rule protecting your photos in one place, where it can be tested.

I'd asked whether React was overkill. The conclusion was that it isn't. There's a lot of connected state (views, selection, filters, edits, history), and the parts that need to be fast, the photo grid and the edit preview, don't depend on React anyway.

## One implementation of every edit

The most important technical decision: every edit operation is written **once**, as a GPU shader, and the same code runs both the live preview and the final export. A classic bug in photo editors is a preview that doesn't quite match the exported file, because they're two different implementations. With one shared implementation, they match by construction.

That plan hit a snag. The preview runs on WebGPU in the web view, but Apple only turned WebGPU on by default in macOS Tahoe 26. Rather than raise the minimum to the newest macOS, the shaders get automatically translated to an older graphics API (WebGL 2) for older Macs. It's still one source of truth.

## iPhone photos and patents

iPhones save photos as HEIC, which uses HEVC video compression, and HEVC is covered by patent pools. macOS decodes HEIC natively, under Apple's license. Windows can too, if you have Microsoft's HEIF and HEVC extensions installed. Those are often preinstalled, but not always, and they can't be bundled into Seura's installer.

So Seura uses the operating system's decoder whenever one is available, and falls back to the open-source libheif library on Windows when it isn't. The user guide will explain how to install Microsoft's extensions for anyone who prefers them.

## The license problem I didn't see coming

This one is worth telling honestly. Reading photo metadata (dates, camera, location) needs a library, and the obvious candidate is exiv2. It appeared in Claude's early suggestions, until the license research caught that exiv2 is GPL-licensed. Using it would force the whole app under the GPL, which conflicts with Seura's Apache license.

So there's now a decision record: **no GPL dependencies**. Metadata is handled by permissively licensed Rust crates instead. It's a good example of why the technical design checks every dependency's license before any code exists, rather than after.

## No database, unless it's needed

I'd asked from the start to avoid SQLite unless performance demanded it. The design keeps the photo index in memory, saved to a snapshot file between launches. Rather than leaving that as a hope, the plan includes a benchmark with 100,000 photos. If the in-memory index can't hit the speed targets, we switch to SQLite and record why.

## Two computers

Seura supports Windows 10 and 11 and macOS 13 and later. I have one Windows desktop and one MacBook Pro, and both are always up to date. That means I can't personally test Windows 10, or the WebGL fallback on older Macs.

So testing comes in three tiers. My own machines cover current Windows and macOS. Automated tests run on GitHub's older macOS and Windows machines. And before version 1.0, a short beta with volunteers on older computers. If nobody with an older Mac turns up, the plan is to raise the macOS minimum rather than ship something no one has seen run.

## The milestone plan

The last planning document breaks the work into eight milestones, from a "walking skeleton" that proves the risky pieces on both platforms, through browsing, organizing, editing, sharing, and the Review flow, to release. There are no dates. This is a one-person project, so the plan fixes the order and what "done" means, not the pace. Every milestone ends with a build I can use for more of my own photos than before, and a post here.

Next: [finding a look](/devlog/06-finding-a-look/).
