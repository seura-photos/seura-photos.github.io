---
title: Organize
description: Seura starts writing to my photo folders. Tags, ratings, search, undo, and Delete, in two days and the first public builds. Plus the worst bug so far, which my USB stick found.
date: 2026-10-27
part: 9
draft: true
---

The third milestone, Organize, is the first where Seura writes to my photo folders in earnest. Tags and ratings go into a small edit file beside each photo, and Delete sends photos to the Recycle Bin or Trash. Its test: I tag and rate my own library, every edit file passes the edit format's checker, and the data-safety tests cover every new way Seura writes.

Claude Code drafted the [M3 work plan](https://github.com/seura-photos/seura/blob/main/docs/m3-plan.md) with eight questions for a design session, and built it in eleven slices over two days, in about thirty pull requests. At the end came builds 0.2.0 and 0.2.1, the first [early builds](https://github.com/seura-photos/seura/releases) anyone can try ([decision 0016](https://github.com/seura-photos/seura/blob/main/docs/decisions/0016-public-early-builds.md)).

<figure class="wide">
  <img src="/images/devlog/m3-library.webp" alt="Seura's Library in dark mode on Windows, showing the tag flowers/blossom: 13 photos from every folder, of white tree blossom and pink-and-white rhododendrons, several with small star ratings under them. The sidebar lists the Flowers folder with 18 photos, then TAGS: flowers, opened to show blossom (13, selected) and rhododendron (6), and garden (3). A rhododendron is selected, and the Info panel shows its camera, a Casio EX-S500, a rating of four stars out of five, and two tags, flowers/blossom and flowers/rhododendron, each with a remove button, above Add tag." loading="lazy">
  <figcaption>Tags and ratings in the Library. Choosing a tag shows its photos from every folder.</figcaption>
</figure>

## One way to write

Every change from the Library goes through one path in Seura's core: read the edit file, apply the change, save it atomically, record what was written. Each slice that wrote something added a test to the data-safety suite before it merged.

An edit file with nothing left in it goes to the Recycle Bin, so clearing a photo's only rating leaves no empty file behind. That raised a question about undo: if the file is gone, what does Ctrl+Z undo? I asked whether the file's history counts as content. It doesn't. Then I asked whether this was a choice between data safety and clutter. Claude's answer was that it's clutter against complexity, since nothing is lost either way. It recommended that the Library keep an emptied file in memory and write it back on undo. I chose that.

## Undo, and tags that match

Undo took the most discussion. I wanted the edit files to be the only record of changes, and asked what Ctrl+Z should do with ten photos selected when the last two actions each touched five of them. Claude recommended undoing the last action, whatever is selected now, as almost every app does, and using each file's own undo rather than adding a new change. So the Library and, later, the Editor share one history per photo. The app only remembers which photos each of the last ten actions touched.

Tags match the way people expect, in any language: `Ärzte` finds `ärzte`, `STRASSE` finds `straße`, and an accented letter typed one way finds the same letter stored another way, as macOS often stores it. Typing `Family` when `family` exists adds `family`.

<figure class="wide">
  <img src="/images/devlog/m3-tag-picker.webp" alt="Three photos of rhododendrons selected in the Flowers folder, with the tag picker open beside one of them. The picker is titled Tag 3 photos, with the hints Enter adds and Esc closes. It shows the tag all three share, flowers/rhododendron, as a chip, then a field with bl typed, an option to create the tag bl, and the existing tag flowers/blossom, used by 13 photos, highlighted. The Info panel says 3 photos selected, the rating is Mixed, and the tag garden is on 1 of 3." loading="lazy">
  <figcaption>The tag picker, opened with T. Typing finds the existing tag, and Enter adds it.</figcaption>
</figure>

## Deleting, measured first

Before building Delete, I measured what the system does with OneDrive photos, on throwaway copies, with a small tool Claude wrote. A photo that's only in the cloud can't reach the local Recycle Bin or Trash on either platform: on Windows it silently goes to OneDrive's recycle bin online, and on the Mac the system refuses. So Seura leaves cloud-only photos out of Delete and says why. Anything I've opened is downloaded, so it can be deleted normally.

Then I tried Delete on a photo on a USB stick, with build 0.2.0. It was gone for good: no prompt, not in the Recycle Bin. Explorer asks first for the same file. It's the worst bug so far, and it broke the rule that matters most: Seura never deletes anything permanently. The specs had planned to leave such drives out "once measured", and Claude Code had assumed Windows would ask first, because the library it uses requests that warning. The same library also turns every prompt off, and that wins. Nobody had measured it until I plugged in a stick.

Claude Code fixed it the same day ([#115](https://github.com/seura-photos/seura/issues/115)). Seura now asks Windows what kind of drive a photo is on, and leaves photos on drives without a Recycle Bin where they are. I proposed one exception: an edit file with nothing left in it can be deleted directly there, since nothing in it can be lost. The design session agreed, with conditions, in [decision 0017](https://github.com/seura-photos/seura/blob/main/docs/decisions/0017-drives-without-trash.md), and a new test lists every place in the code allowed to delete a file directly, so a new one fails until it's reviewed. The lesson is in the journal: an assumption about a destructive path is tested before it ships, not after.

## What I found by using it

- **Select All selected the window's text** like a web page, rather than the photos, unless the grid had the focus.
- **The date filter missed photos.** I suspected the date taken against the file's date, then cloud photos. Both were right: photos whose date taken wasn't known yet were left out. They're now placed by file date, as the grid already sorts them.
- **Messages were easy to miss** in the sidebar. They're now a brief box near the bottom of the photo area.
- **After the Viewer, the grid lost the keyboard focus,** so the arrow keys needed a click first.
- **Windows showed the version nowhere,** since there's no menu bar. 0.3 gets a ⋯ button with an About dialog.

I also checked dates and numbers with Windows set to English (Germany): day-first dates, German separators, and the filter's calendar starting on Monday, with the app in English. The Mac, set to Germany, looked right too.

## Fast with 50,000 photos

Search is meant to update within 200 ms on a 10,000-photo library. It did, but at 50,000 photos the first letters of a search took up to 430 ms. Timing showed the index searching in under 2 ms. The rest was in the code around it: one word wrong in the sort (`then` where `then_with` was meant) compared file names on every comparison, not just to break ties. With that and a few smaller fixes, even 50,000 photos stay under 150 ms.

## How we work now

At the end of M3, Claude Code brought fourteen questions to a design session. I agreed with all of Claude's recommendations, and said how I'd like to work from here: I'll generally defer to Claude on current practice, and ask for changes after seeing the running app. Trust, then verify.

The verifying is mine. For an AI-first project, I do a lot of testing by hand, and M3 showed why. Every bug in the list above passed the automated tests, and so did the worst one: no test had a drive without a Recycle Bin until I plugged in a USB stick. Some problems only showed in the installed app, not the development build. What the automated tests do well is keep a problem fixed: each of those bugs now has a test that fails without its fix. Claude writes the tests; I use the app. There's no substitute for either.

## Known issues in 0.2.1

- **On the Mac, photos in OneDrive folders can't be deleted yet.** They stay where they are, and Seura says so. The system refuses it, probably because the build is only ad-hoc signed: started from Terminal, it works ([#112](https://github.com/seura-photos/seura/issues/112)).
- **Cloud-only photos, and photos on USB sticks and network shares, are left out of Delete.** That's by design.

## What's next

M3 ends once I'm tagging and rating my library with 0.2.1 on both machines. Then M4 is Fix: the full editor, with crop, straighten, adjustments and Enhance, each built once, for both the preview and the export.
