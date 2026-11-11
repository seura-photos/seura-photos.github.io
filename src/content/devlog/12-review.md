---
title: Review
description: Sorting through new photos one at a time, one key per action, with nothing deleted until the end. The sixth milestone, built in a day, and the two places where only the Mac could show what was wrong.
date: 2026-11-10
part: 12
draft: true
---

The sixth milestone, Review, is one flow for new photos: rate, rotate, Enhance, tag, edit, and mark the ones to delete, one photo at a time. Its test is that I run my own newly added photos through it, end to end.

## Planning

After I confirmed M5 was done, Claude Code drafted the [M6 work plan](https://github.com/seura-photos/seura/blob/main/docs/m6-plan.md). It came with fifteen questions for a design session, each with a suggestion. Three were places where our own documents disagreed: the banner's words, the order of the action bar, and what the summary counts.

Most of the design session's answers were Claude Code's suggestions. A few weren't:

- **The banner keeps the wireframes' words,** "Sort through them one at a time?", rather than "Review them?", which next to a Review button tells a first-time user nothing about what Review is.
- **Photos that sync while Seura is open count as new,** not just those found at launch, since phone photos often arrive that way. Claude Code had suggested launch only, to avoid keeping any state.
- **Marked photos show in the Library too,** dimmed with a red outline, so a mark left behind isn't forgotten. That was the design session's addition.

Then Claude Code built it in six slices and a wrap-up, all on one day. I tried most slices on both computers before merging them.

## The Review screen

<figure class="wide">
  <img src="/images/devlog/m6-review.webp" alt="The Review screen in dark mode on Windows, titled Reviewing Flowers, with Exit review at the top left and 9 of 18 with a progress bar at the top right. A photo of white rhododendron blossom fills most of the window. Beneath it, a line reads CIMG0624.JPG, Mar 26, 2007, four stars, and the tag Garden. The action bar at the bottom has Back, rotate left and rotate right with the keys [ and ], Edit (E), Tag (T), Mark to delete (X), Enhance (A), five stars with four filled, and a blue Next button." loading="lazy">
  <figcaption>Halfway through a review: the photo's name, date, rating and tags under it, and each action's key on its button.</figcaption>
</figure>

Review opens over the Library: the photo as large as the window allows, "1 of 5" with a progress bar, and the file name, date, rating and tags underneath. Every action is one key: 0 to 5 for stars, [ and ] to rotate, A for Enhance, T to tag, E to edit, X to mark, and → for the next photo. Home, End and a click on the progress bar jump within a batch.

A review keeps its own list of photos, Claude Code's choice. Reading the grid's list would have been simpler, but with a filter on, rating a photo out of the filter would have dropped it from the review while it was on screen.

## Marking, and two Mac surprises

Marking deletes nothing. A mark lives in a file in Seura's own folder, not in the photo's edit file, so it doesn't create files beside photos or travel to other computers. If a photo is renamed while marked, the mark follows it to the one photo with the same size and date. If two match, the mark is dropped rather than guessed: losing a mark removes nothing, and the wrong mark could lead to deleting the wrong photo.

On Windows, a marked photo looked right. On my Mac, in a review, it looked unmarked: no dimming, no red edge. Review draws the photo on a GPU canvas, and the dimming was a CSS effect on that canvas. Claude Code's reading, which it couldn't confirm from Windows, is that the Mac's web view doesn't apply such effects to that kind of canvas. The dimming is now a plain layer over the photo. No test on Windows could have shown it.

While testing, I asked for a key to start a review, and for X in the Library. R starts one. X in the Library only takes marks off. The design session pointed out that a mark made outside a review waits for a later review that might never include it: a second, open-ended way to delete, beside Delete. I'd mostly wanted to clear marks, so I agreed to err on the side of caution.

Then I found a gap: X won't put a mark back in the Library, but Ctrl+Z will. Claude Code recommended keeping it, and I agreed. Undo can only restore a mark a review made, from the last few actions, and without it a stray X on a selection would lose review work for good.

## Finishing

<figure class="wide">
  <img src="/images/devlog/m6-summary.webp" alt="The end of the same review, titled End of review. Four counts read 16 Rated, 0 Edited, 5 Tagged and 2 Marked for deletion. Below them: Everything is saved, and nothing has been deleted yet. A button reads Move 2 marked photos to the Recycle Bin. Next to Rating, a chooser set to At least 4 stars sits beside a button reading Export 12 photos. A blue button reads Back to the Library, and a Back button is at the bottom." loading="lazy">
  <figcaption>The end of a review: nothing has gone anywhere until one of these buttons is pressed.</figcaption>
</figure>

Next on the last photo opens a summary of what changed: rated, tagged, edited and marked. It offers to move the marked photos to the Recycle Bin or Trash in one confirmation, and to export the photos rated at or above a number of stars. The counts come from each photo's edit history, Claude Code's choice. A change made in the Editor counts like any other, and one that's undone drops out by itself.

The Mac session, the Claude Code session on my MacBook, set up a hands-on script for me there, then checked the results on disk. Thirteen steps passed. Then I restored a photo from the Trash, and Finder offered Put Back for the photo but not for its edit file, though Seura moves both the same way. I asked whether moving them in one call was the cause. It isn't: Seura already moves each file on its own. The Mac session then tried eight moves with a small test tool, with me reading Finder's menu each time. Put Back was missing only once, so the cause is still unknown. I decided to keep the current method rather than script Finder, which would bring a permission prompt. It's [#254](https://github.com/seura-photos/seura/issues/254), and a known issue in the release notes.

## Photos in the cloud, and new photos

A review with photos only in OneDrive asks once: download them as I go, a few ahead, or show thumbnails only. Marked cloud photos are downloaded only after the final confirmation, which says how many and how large, and that they leave OneDrive too. Claude Code tested this on real cloud-only files in a OneDrive folder I made for tests. That run caught a thumbnail painting over a marked photo's red banner, which no unit test would have seen.

The banner appears when photos arrive in a library folder: at launch, or a minute after the last one syncs while Seura is open. Exports don't count, and neither does a folder just added. Claude Code added one check the plan didn't ask for: a photo renamed in Explorer would otherwise have looked new. I checked the banner by hand on both machines.

## Measuring

Next photo in Review takes a median of 49 milliseconds on Windows, and 30 on the Mac. Every target was met but one: scrolling on the Mac read 58 frames a second against a goal of 60. I asked for a rerun: 59.6, 59.6 and 58.4. The table rounds, so earlier milestones' 60 may have been 59.6 too. And one of the Windows repeats failed once, the Viewer never drawing a photo during measuring, which never happened again ([#258](https://github.com/seura-photos/seura/issues/258)).

## Also

On Windows, Google Drive turned out not to use the system's way of marking files as in the cloud, as OneDrive and Dropbox do, so Seura can't tell its photos are cloud-only ([#162](https://github.com/seura-photos/seura/issues/162), for M7). And Select All in the Mac's Edit menu now selects photos.

## What's next

All of this is in [build 0.5](https://github.com/seura-photos/seura/releases/tag/v0.5.0), a pre-release. M6 is done once I've run my own new photos through Review with it. Then M7 is release readiness: settings, cleanup, signed installers, the user guide, automatic updates, and a beta with volunteers as build 0.6.
