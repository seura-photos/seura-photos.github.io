---
title: Fix
description: The Editor, built in four days and shipped in build 0.3. Each edit is one shader for the preview and the export, and the edit format gained a formulas appendix that another app could follow. Plus what I found by using it.
date: 2026-10-31
part: 10
draft: true
---

The fourth milestone, Fix, is the Editor: crop and straighten, rotate and flip, light and color, effects, red-eye, and Enhance, with undo that survives closing the photo. Its test is that I fix my own photos with Seura instead of another app. As of [build 0.3](https://github.com/seura-photos/seura/releases/tag/v0.3.0), I can.

<!-- Screenshot: the Editor on one of Nevada's photos, the panel showing Light and Color with some sliders moved. -->

Claude Code drafted the [M4 work plan](https://github.com/seura-photos/seura/blob/main/docs/m4-plan.md) with eight questions, six for a design session and two for me, and built it in twelve slices over four days, in about forty pull requests. First came an interim build, 0.2.2, my choice, so testers could say which version they have.

## One formula, written down

Every edit is one function in a shader that both the live preview and the export run ([decision 0004](https://github.com/seura-photos/seura/blob/main/docs/decisions/0004-single-render-pipeline.md)), so what you see while dragging a slider is what you get. That was the plan from the start. M4 added something the plan had only promised: the [edit format](https://github.com/seura-photos/edit-format) said its formulas would be "added alongside the reference implementation", and M4 is that implementation.

So Claude Code wrote each formula into the format's appendix as it built the operation, with test values another app can check itself against, and the design session reviewed them. Writing them down caught real problems. A crop's numbers needed full 64-bit precision: in 32 bits, a 0.7-high crop of a 5-pixel photo comes out 3 pixels high instead of 4. And the review changed code already merged: saturation had been clipping colors outside the working color space.

At the end, a small Python program written straight from the appendix's text rendered seven test images, and Seura's GPU matched all seven within one level on the first run. The appendix is complete enough for another app to follow it. Freezing the format at 1.0 waits for M7.

## Highlights and shadows

Highlights and shadows need to know what's bright and dark around each pixel, without the glow a plain blur leaves along edges. Claude Code compared three methods on generated scenes with hard edges, such as a dark tree against a bright sky, and recommended a guided filter: its halo is too small to see, and the older WebGL2 preview on macOS 13 to 15 can run it. I agreed, and on my own photos the sliders don't feel too strong or too weak. Claude Code's view was that they're a little gentler than Lightroom's at the extremes, which also keeps noise down.

## What I found by using it

As in M3, the automated tests passed and my testing found what they couldn't:

- **The Editor couldn't zoom,** though the Viewer could. This one had been in the design since the beginning: the Editor's wireframe simply had no zoom, and no review had noticed. I took it to the design session, which specified it. Claude Code built it before crop and red-eye, which both depend on it.
- **In crop mode, the arrow keys could only make the box bigger,** from a corner with the ratio locked.
- **On a straightened photo, a dragged crop box stopped short of the edge.** Claude's first explanation was that this is just the geometry: one corner reaches the slanted edge first. I tried again and showed it was wrong. Moving the pointer down in the same drag didn't let the box go further, but letting go and dragging again did, a step at a time. The real cause was that each drag worked out its position across first, then down. Claude's probe had tried few starting places and missed it. A dragged box now slides along the slanted edge. After the fix: "It appears to be working wonderfully now. Nice and smooth."
- **The flip buttons' icons were swapped.** Claude Code had chosen them by name without looking at the drawings.
- **Revert to original was hard to reach.** Once Effects were added, the panel scrolled, and Revert's confirmation opened below the window, out of sight. Scrolling to it would put the pointer over the confirm button, which our interaction rules forbid. Claude Code suggested pinning Revert to the panel's bottom with its confirmation opening upward, and the design session agreed.
- **No button changed under the mouse;** only the pointer turned into a hand. I hadn't noticed in three milestones. The design session specified hover and pressed states, and the arrow pointer everywhere but links, as native apps have.
- **After clicking Enhance in the Library, Enter didn't open the photo.** I found it just before tagging 0.3. The click had moved the keyboard focus to the button, so Enter pressed Enhance again. Clicking a quick fix now leaves the focus where it was.

Enhance and red-eye were Claude Code's to build and mine to judge. Enhance's white balance took three methods to get right; on my photos it does make them generally better, and I accepted it as it is. Red-eye on an extreme photo left a little red but clearly improved it. I set aside a strength slider, which would change the format for what's usually a one-click fix.

## Built for an unlikely case

Seura notices when a photo's edits change outside it while the photo is open in the Editor, and asks whether to keep yours or load theirs. The main way that happens is editing the same photo on two computers at once through a synced folder, which is uncommon. Claude Code agreed, and gave two reasons it was worth building anyway:

- **The detection runs far more often than the question appears.** Tags and ratings changed on my other computer sync in while a photo is open, and the Editor quietly follows them, so its undo never works from an out-of-date history.
- **The data was already safe.** Seura saves onto the edit file as it is on disk, never over it, so the other computer's edits are never lost. What M4 added is the choice of what's shown, and a data-safety test that checks the other app's edits survive.

## Fast enough

The target for live preview is 30 frames a second while dragging a slider on a 12 to 48 megapixel photo. With every operation on, every slider drew every frame the display shows, on both preview paths: 120 a second on my Windows PC, and 60 on the Mac, as many as macOS's web view gives a page ([M4 benchmarks](https://github.com/seura-photos/seura/blob/main/docs/benchmarks/m4-editor.md)).

Measuring everything again found one slowdown. On Windows, the next photo in the Viewer went from 62 ms in M3 to about 80 ms: within the 150 ms target, but over our aim of half that. Claude Code compared two builds back to back and traced it to highlights and shadows, which load an extra 6 MB image per photo, and large transfers into the Windows web view are slow. I chose to fix it later ([#190](https://github.com/seura-photos/seura/issues/190)).

## Known issues in 0.3

- **No export yet.** Edits show only in Seura until the next build. I left M1's development-only export out of 0.3, since it lacks export's color conversion and choices.
- **A change made in the last second before quitting may not be saved** ([#174](https://github.com/seura-photos/seura/issues/174)). The measurement script found it.
- **Colors beyond Display P3,** in some photos with Adobe RGB or ProPhoto profiles, are shown less saturated than they are ([#188](https://github.com/seura-photos/seura/issues/188)). Claude Code found it while checking Seura against the format's new advice on decoding. iPhone photos aren't affected.
- **On the Mac, photos in OneDrive, Google Drive and Dropbox folders still can't be deleted** ([#112](https://github.com/seura-photos/seura/issues/112)). Signing the app with an Apple certificate didn't help, and the Mac session found that macOS refuses every way of moving synced files there to the Trash, from any app it tried. Seura leaves them as they are, says why, and offers Show in Finder.

## What's next

M4 is done once I've fixed my own photos with 0.3 on both machines, which I'm starting now. M5 is Reuse and share: export, with the conversion to standard colors that other apps expect, copying edits between photos, and presets. The color fix in #188 comes first, so exports start from colors that weren't clipped.
