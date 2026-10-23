---
title: Browse
description: Seura becomes a photo viewer I can use every day. A styled Library, a Viewer with zoom, photo details, cloud photos handled honestly, and the first numbered build. Plus what we measured, and what we got wrong.
date: 2026-10-22
part: 8
draft: false
---

The second milestone, Browse, had one test: I point Seura at my real photo library and use it as my photo viewer, every day, on both machines. That meant the styled Library from the design sessions, a Viewer, photo details, watching folders for changes, and speed measured rather than assumed. Claude Code drafted the [M2 work plan](https://github.com/seura-photos/seura/blob/main/docs/m2-plan.md) itself this time, with ten slices and the questions it couldn't settle listed for a design session.

It took three days and about forty pull requests. At the end, build 0.1.1 went out as Seura's first numbered pre-release, unsigned, for my own use.

<figure class="wide">
  <img src="/images/devlog/m2-library.webp" alt="Seura's Library in dark mode on Windows: the Folders list on the left with a plus button in its heading and one folder, Test Images, with 3 photos; three thumbnails in the grid, the Gateway Arch from below (selected, with a small edited badge) and two snowy city streets; on the right, the Info panel with the arch's thumbnail, its name and date taken, size 3264 × 2448 and 5.8 MB, camera OLYMPUS IMAGING CORP. E-500, lens 14 mm ƒ/11, exposure 1/500 s, ISO 100, -0.3 EV, and Edited." loading="lazy">
  <figcaption>The Library on Windows, in dark mode, with a photo's details in the Info panel.</figcaption>
</figure>

<figure class="wide">
  <img src="/images/devlog/m2-library-light.webp" alt="The same Library in light mode on a Mac: the Test Images folder with the same three photos, sorted by file name, and the Info panel saying Select a photo to see its details." loading="lazy">
  <figcaption>The same folder on the Mac, in light mode.</figcaption>
</figure>

## Moving Seura's folder out of Documents

The plan asked a small question: where to suggest the cache when Documents is synced to the cloud. I asked a bigger one. Windows pushes hard for OneDrive backup of Documents (I've refused it several times on my own PC), and macOS offers the same with iCloud. I asked to reconsider the location as a whole, with nothing hidden.

Claude's analysis was that none of Seura's own files should sync. The cache is large and specific to each computer, and the settings hold folder paths that differ between machines, so two computers would fight over them. Hidden folders like AppData and `~/Library` were out by my rule, and an app's install folder isn't writable. So Seura now keeps a visible `Seura Photos` folder in the home folder ([decision 0015](https://github.com/seura-photos/seura/blob/main/docs/decisions/0015-app-data-in-home-folder.md)), and names it on the first-run screen, since fewer people look in their home folder.

## Built to be translated

I asked whether translation had ever been discussed. It hadn't, beyond "English only in v1". Claude suggested keeping v1 in English but settling now what is cheap early and expensive later, and I agreed. Interface text lives in Project Fluent catalogs, which handle plurals properly ("1 photos" was already in the first draft); dates and numbers follow your region; and a pseudo-translated build stretches every string by about 40% to check that longer languages fit.

## Measure first

Thumbnails were the speed work M1 left open. Claude wrote a benchmark before changing anything: 46 thumbnails a second on my PC, above the target of 30 but below our aim of 60. The surprise was how badly it used the processor's cores. Resizing started by copying each full-size photo, about 48 MB, and removing that copy alone took it to 67. Claude then judged that decoding photos at reduced size could wait. CI's first run disagreed: GitHub's small runners managed 10 to 15 a second. So the reduced-size decoding went in, and my PC reached 105.

<figure class="wide">
  <img src="/images/devlog/m2-viewer-zoom.webp" alt="The Viewer at 100% on a photo of a snowy street lined with apartment buildings, a radio tower in the distance and a person crossing the road; the bar shows the file name, 2 of 3, and the zoom buttons with 100% selected; the Info panel lists a Panasonic DMC-TZ4, 28 mm ƒ/3.3, 1/500 s, ISO 100." loading="lazy">
  <figcaption>The Viewer at 100%: one pixel of the photo for each pixel of the screen.</figcaption>
</figure>

At the end of the milestone we measured every browsing target with a release build: the app runs a script on itself, on generated test photos, with its own separate settings so my library is never touched. Everything passed on both machines, most by a wide margin. Opening a 1,000-photo folder takes 0.05 seconds, the next photo appears in 36 to 48 milliseconds, and a 50,000-photo library uses 70 to 170 MB in Seura's core. The full table is in the [benchmarks](https://github.com/seura-photos/seura/blob/main/docs/benchmarks/m2-browsing.md). The first full run failed: the script missed a large scan starting and opened a photo while the library was still changing underneath it. Claude found the cause after three tries.

## Cloud photos, honestly

On the Mac, cloud-only photos now show real thumbnails, taken from the sync service through Quick Look, as Finder shows them. All 5,997 photos in my OneDrive Pictures folder on the Mac are cloud-only. The Mac Claude session tried four of them: each got its thumbnail, and none was downloaded.

Opening a cloud-only photo has to download it, and the spec promised "progress shown and a way to cancel". Before building that, Claude measured what Windows and macOS actually allow, with my permission, on two photos per machine. Neither tells an app how far a download has got: the file stays empty, then is suddenly complete. And stopping one means different things: on Windows the download finishes anyway, on the Mac it stops. So the promise couldn't be kept. My first thought was simpler anyway: show that it's downloading, then show the photo. The design session agreed and rewrote the requirement ([LIB-9](https://github.com/seura-photos/seura/blob/main/docs/functional-spec.md)): a blurred thumbnail, "Downloading 9.4 MB from the cloud…", no progress bar, and moving on is how you abandon it.

<figure class="wide">
  <img src="/images/devlog/m2-cloud-download.webp" alt="The Viewer opening a cloud-only photo: its thumbnail enlarged and blurred behind a small panel with a spinner and the words Downloading 3.4 MB from the cloud; the Info panel notes that the photo is in the cloud and its camera, lens, and location show once it's on this computer." loading="lazy">
  <figcaption>Opening a photo that's only in the cloud: no progress bar, because the system doesn't report one.</figcaption>
</figure>

## Checking against the phone

The Info panel shows each photo's camera, lens, exposure, and location. I compared it with my iPhone. The phone said 24 mm ƒ/1.78; Seura said 6.8 mm ƒ/1.8. Both numbers were in the photo: 6.8 mm is the lens's real focal length, and 24 mm is the "35 mm equivalent" phones show instead. Seura now shows the equivalent when there is one, and stops rounding the f-number. Comparing with Explorer and Finder also added shutter speed and ISO.

iPhone photos also looked brighter in Apple's Photos than in Seura. Claude's first guess was HDR, but turning HDR off didn't fully explain it, so it suggested a cleaner test: a JPEG and an iPhone HEIC across the Mac's display settings. The JPEG matched in every setting, so Seura's color is right, and the difference is HDR, which Seura doesn't show yet. Whether it should is now a question for a design session.

## What I found, and what Claude got wrong

Testing the builds myself found real bugs:
- **Zoom on the Mac:** it didn't work at all at first. Development builds set up the Viewer twice, and on the Mac the first setup's teardown switched off the second one's canvas.
- **A frozen grid:** while my OneDrive Pictures folder (5,835 photos) was being scanned, the grid wouldn't change folders. Each finished thumbnail sent its own message, and clicking a folder waited behind all of them.
- **A heading over the photo:** in build 0.1, the sidebar's Folders heading showed through the Viewer.

I also noticed a design problem: with many folders in the sidebar, "Add folder" at the bottom of the list scrolled out of sight. I'd have moved it to the top, but asked what's usual. Claude found that apps either pin an add button to the bottom of the sidebar or put a + in the section's heading, and recommended the heading, since the sidebar gains a Tags section in M3 and a bottom button would end up under the tags. I agreed, and the design session updated the mockups.

Claude made its own mistakes, and recorded them in the journal:
- **The wrong branch:** it built one pull request on another's branch, and when I merged the second one, the first one's branch was still there, so the work landed on that branch instead of `main`. Nothing was lost; it now opens every pull request against `main`.
- **A day ahead:** after I said good night, past midnight, it dated the rest of that day's work a day ahead. The design session caught it.
- **A closed pull request:** cleaning up, it deleted a branch whose pull request I hadn't merged yet, which closed it, and then wrongly assumed I had closed it. It now checks each one first.

## Known issues in 0.1.1

- **On a Mac, macOS says the app is "damaged".** It isn't: the build isn't signed, and macOS treats an unsigned app downloaded on Apple Silicon that way. To open it, run `xattr -dr com.apple.quarantine "/Applications/Seura Photos.app"` once in Terminal. The next build is ad-hoc signed, so macOS will instead block it once and offer Open Anyway in System Settings → Privacy & Security; properly signed builds come with the beta.
- **A long folder path squeezes the folder's name** onto two lines above the grid. It'll be fixed in M3.
- **iPhone HDR photos look less bright** than in Apple's Photos on an HDR screen, because Seura shows the standard picture. Whether it should show HDR is still to be decided.

## What's next

M3 is Organize: tags, ratings, search, and the first time Seura writes to your files in earnest, to the edit file beside each photo. It's done when I'm tagging and rating my own library, and every new write path is covered by the data-safety tests.
