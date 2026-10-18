---
title: Why I'm building a Picasa successor
description: I missed Picasa, couldn't find anything that replaced it, and decided to build it. Properly, this time, from a spec.
date: 2026-10-18
part: 1
---

I used Picasa for years, and I liked it. You pointed it at the folders where your photos already lived, and it showed you everything. You could crop, straighten, fix the color, add a tag, and move on. It never asked you to import anything into a library it controlled. And it didn't touch your originals: your edits were remembered separately, so you could always go back.

Google retired Picasa in 2016. I never found anything that quite replaced it.

## Asking whether it already exists

Before building anything, I wanted to know whether I'd be reinventing a wheel someone else had already made. So I started by asking Claude, Anthropic's AI model, a few questions. Is there a free, open-source app like Picasa that keeps originals untouched and remembers edits? Can any of them be extended with plugins? Where are the gaps?

There's no shortage of excellent open-source photo software. But what came back was a pattern: the strong options lean toward professional raw-photo workflows, or managed libraries, or long feature lists. What seemed to be missing was the thing Picasa was: **simple, local, open source, and available on both Windows and macOS**.

I assumed phone photo apps were destructive, and that was the reason nothing had replaced Picasa there. That turned out to be wrong. Apple Photos, for one, keeps edits separately and can revert them. But I prefer working on a desktop with a real screen, and that's where the gap is.

## The idea that made it worth doing

The part I kept coming back to was where edits live. Picasa kept its edit information in its own files. I wanted something more open: a small JSON file beside each photo that records what was done to it (which tool, which effect, which settings), which the app reads back so every edit stays adjustable. If the format were documented, other apps could read it too. Your edits wouldn't be locked inside one program.

That idea became the core of Seura Photos, and it's now its own open specification. More on that in a later post.

## What to build it with

I've worked on a cross-platform desktop codebase before: shared C++, platform-specific code in C++ and Objective-C++, and a web view hosting most of the interface in HTML (Safari's engine on the Mac, Chromium on Windows). So I suspected Electron wasn't the best choice, and asked what the current equivalent of that architecture would be.

The answer was [Tauri](https://tauri.app): a Rust core that does the real work, with a web interface on top that uses the web view each operating system already provides. It's essentially the architecture I knew, modernized. I've never written Rust. I'm treating that as part of the appeal.

## Doing it right

At that point I had to decide whether this was a weekend experiment or a real project. I decided it was real: something I'd use myself and make available to anyone who wants it. What I told Claude was, "I want to do this. But I want to do it right."

For me, "right" meant following current best practices for building software with an AI assistant: writing down what the app is and isn't before writing any code, deciding the important things deliberately, and recording why. It also meant building it in the open, which is why this devlog exists.

## How I'm working with Claude

Since this is a showcase as much as a project, I want to be clear about how it's being made. I'm doing the work in conversation with Claude. I decide what Seura is, what it does, and how it should feel. Claude drafts specifications, researches libraries and licenses, proposes designs, and (later) writes much of the code. I review everything, push back, and correct it when it's wrong, which happens. When something in these posts was Claude's suggestion rather than mine, I'll say so.

That includes the posts themselves. Claude writes most of them, in my voice, from our working sessions and the project's records. I review and edit every one for accuracy before it's published.

Next: [writing the specs before the code](/devlog/02-specs-before-code/).
