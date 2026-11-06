---
title: Share
description: Edited photos can leave Seura now. Export with the conversion to standard colors, copy and paste of edits, and presets saved as files, in three days. Plus build 0.3.1, and a Cancel button that wouldn't hold still.
date: 2026-11-06
part: 11
draft: false
---

Since build 0.3, my edits could be seen in Seura and nowhere else. The fifth milestone, Reuse and share, fixes that: export, copying edits between photos, and presets. Its test is that I export real photos for sharing, and they look right in other apps on both platforms.

Claude Code drafted the [M5 work plan](https://github.com/seura-photos/seura/blob/main/docs/m5-plan.md) with its open questions for a design session and me, and built it in ten slices over three days. Putting export first, ahead of copy and paste, was its suggestion: reusing edits matters less while they can't leave the app.

## First, 0.3.1

Using 0.3, I asked for a cloud icon on photos that are only in OneDrive, and for a way to download them when something in the grid, such as Enhance, needs their pixels. The design session settled how: one photo downloads without asking, as opening it does, and a selection asks once, then shows progress and a Stop button.

Testing Stop on real cloud photos, I caught a message that wasn't true. Stopping a batch of four right away said four photos weren't downloaded, but on the Mac the first one arrived anyway: Seura stops waiting, but a read already under way can't be cancelled. The message now says they "weren't enhanced", which holds either way. I also found that rotating a cloud-only photo didn't turn its thumbnail, as Claude Code had flagged it might.

That went out as [build 0.3.1](https://github.com/seura-photos/seura/releases/tag/v0.3.1), a pre-release: Claude Code's suggestion, my decision.

## Export

<figure class="wide">
  <img src="/images/devlog/m5-export.webp" alt="The Export dialog in dark mode on Windows, over the Flowers folder with four photos selected. It's titled Export 4 photos. Save to shows C:\Users\Nevada\Documents\Seura devlog\Exports with a Choose button. Under Format, JPEG is chosen with Quality at 90, and PNG is the other choice. Under Size, Long edge up to 2048 px is chosen, among Original size, up to 1600 px, up to 1024 px and a custom limit, with the note Photos smaller than the limit keep their size and aren't enlarged. Under Details, Remove location data and Include tags and rating as keywords are both ticked. A note says edits are applied to the exported copies, originals aren't changed, and existing files are never overwritten: a name that's taken gets a number, like IMG_4417 (1).jpg. Cancel and Export are at the bottom." loading="lazy">
</figure>

Exports should start from colors that weren't clipped, so slice 1 fixed [#188](https://github.com/seura-photos/seura/issues/188). Claude Code measured the plan's approach first, as the plan asked, and found wrong values and about fifteen times the time. Seura now applies each profile's curves and matrix itself: nothing clips, and it's three times faster than before.

Export converts to sRGB, the colors other apps expect, as JPEG or PNG. Some of the choices:

- **Sizes are limits.** A photo smaller than the limit keeps its size. I checked that, and saw that "Long edge 2048 px" read like an exact size. It now says "up to", with a note that smaller photos aren't enlarged. The first export is at the original size, Claude Code's suggestion, since a photo smaller than expected is the worse surprise. I agreed.
- **Scaling happens in linear light** (Claude Code's choice). Scaling the stored values darkens fine detail: black and white stripes come out at 128 instead of 188.
- **Metadata is rebuilt, not copied.** Only standard EXIF tags go in. The embedded thumbnail goes, since it would show what I cropped out, and so do cameras' private maker notes. Location can be removed. Tags and rating become keywords, each level of a tag on its own, as Lightroom writes them: the design session's change to Claude Code's suggestion. digiKam, which I chose for the check, read them all.
- **An export never replaces a file.** A name in use gets a number. I agreed, but rerunning a batch after a dropped connection would quietly give the photos that had worked a second copy, so at my suggestion the summary says how many got one.

The other systems had surprises. File Explorer doesn't show a PNG's EXIF, so PNG exports carry the date, camera and lens in XMP too. And the Mac session found that exports could be read only by their owner, true since M1 and missed by the tests.

## The Cancel button that moved

My first run of the export's manual tests was nine checks: a batch, Cancel, and photos in the cloud. During a batch with cloud photos, the progress message grew and shrank with each photo's name, and since it's centered, the Cancel button beside it moved and was hard to click.

The tests couldn't see that. Seura's UI tests check what a message says and what a click does, but they don't apply the stylesheet, so they don't know where a button sits. And the automation Claude Code uses to drive the real app can't select several photos, so batches were covered only by tests until I ran one.

The message now keeps one width, with Cancel at its right edge, and long names are cut short. The count comes before the name, so it's never the part cut off, and progress sits below any other message, so one going away doesn't move it. Enhance's progress got the same fix. On both machines, it looked fixed.

## Copy and paste

<figure class="wide">
  <img src="/images/devlog/m5-paste.webp" alt="The Paste edits dialog over the Flowers folder, with four photos of white rhododendrons and blossom selected. It's titled Paste edits onto 4 photos, and says Copied from P1000036.JPG. Adjustments (tone and color) is ticked. Effects and Crop and rotation are not, and each says None copied. Cancel and Paste are at the bottom." loading="lazy">
</figure>

Shift+Ctrl+C (Shift+Cmd+C on the Mac) copies a photo's edits, and Shift+Ctrl+V asks which groups to paste: Adjustments, Effects, and Crop and rotation. Photos in the cloud aren't downloaded.

A crop locked to a ratio, pasted onto a photo of another shape, keeps its ratio, its center and its share of the photo, shrinking or moving inward only if it must. Claude Code chose that rule, as the design session asked. A cloud photo whose shape isn't known yet keeps its own crop and rotation, and the message says so.

Two decisions were mine. If a group is pasted, the photo should match the source, even if that removes something: contrast set on the target but not on the source goes. And Copy with several photos selected takes the one last clicked or reached with the arrow keys. I considered refusing instead, but the message names the photo, so I kept it and asked for it to be written into the [functional spec](https://github.com/seura-photos/seura/blob/main/docs/functional-spec.md).

## Presets

A preset is a file in `Seura Photos/Presets`, in the [edit format](https://github.com/seura-photos/edit-format), so it travels like any file. I saved one on Windows and copied it to the Mac through OneDrive, and it appeared in the list there and passed the format's checker. Claude Code suggested that a preset's name be its file's name, and that Rename and Delete go in its right-click menu. I took both.

In the Editor, hovering over a preset shows it on the photo without saving anything, and a click applies it as one step to undo. In the Library, a Presets submenu in the right-click menu applies one to a selection. I found it opened only on a click, Claude Code's choice; it now opens on hover. Then I asked how a long list would look. It wouldn't have fit: menus had no height limit. Every menu now stays inside the window, checked with 43 presets.

## OneDrive's notice

When a photo's last edit is removed, its empty edit file goes to the Trash, and on the Mac OneDrive answers with its own notice that a file was deleted everywhere. I proposed a warning first, with a way to turn it off. Claude Code raised that two dialogs for one undo may be too much, with no real choice to offer. The design session chose a message instead, shown once for each cloud service, saying the photo isn't affected. On both machines, it explained once and not again.

## Also fixed

A change made just before quitting is now saved ([#174](https://github.com/seura-photos/seura/issues/174)), a known issue in 0.3. And I found that the Info panel's picture hadn't followed edits since M2, then a flicker in its fix on the Mac.

## What's next

All of this is in [build 0.4](https://github.com/seura-photos/seura/releases/tag/v0.4.0), a pre-release. M5 is done once I've exported real photos for sharing with it and they look right in other apps. Then M6 is Review: running newly added photos through rating, rotating, Enhance, tags, marking for deletion and editing, in one flow.
