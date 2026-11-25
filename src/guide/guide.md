Seura Photos shows, fixes, tags, and sorts the photos already on your computer, in the folders where they are. It never imports, copies, or moves them, and it never changes them: every edit is saved separately, so you can undo it at any time.

This guide describes the current early build. Seura isn't finished yet, so a few parts are marked as coming, and [Known issues](#known-issues) lists what doesn't work as it should.

## Installing

### What you need

- **Windows** 10 (22H2) or 11, on an x64 PC. Windows on ARM isn't supported.
- **macOS** 13 Ventura or later, on a Mac with Apple silicon.
- A screen at least 1280 × 720.

### Windows

1. Download `Seura.Photos_<version>_x64-setup.exe` from the [releases page](https://github.com/seura-photos/seura/releases).
2. Run it. It installs for you alone, with no administrator rights needed.
3. The early builds aren't signed yet, so Windows SmartScreen may warn that it doesn't recognize the app. Choose **More info**, then **Run anyway**.

### macOS

1. Download the `.dmg` file from the [releases page](https://github.com/seura-photos/seura/releases) and open it.
2. Drag **Seura Photos** to **Applications**, then open it.
3. The early builds aren't signed by a registered developer yet, so the first time, macOS says it can't check the app. Open **System Settings → Privacy & Security**, scroll down, and choose **Open Anyway**.

Signed installers, which open without these warnings, are coming in the beta.

### Updating

There are no automatic updates yet. To update, download the new build and install it over the old one; your library, edits, and settings stay. The [devlog](/devlog/) announces each new build. Automatic update checks are coming in the beta.

## HEIC photos on Windows

iPhones save photos as HEIC. On a Mac, Seura shows them with nothing extra. On Windows, it uses Windows' own decoder, which needs two extensions from the Microsoft Store:

- HEIF Image Extensions, free
- HEVC Video Extensions, free or inexpensive, depending on your PC

Many PCs already have them. Without them, a HEIC photo's thumbnail says **Needs Microsoft's HEIF and HEVC extensions**, and opening it says which one is missing. After installing them, quit and reopen Seura.

Most iPhone photos reach a Windows PC as JPEG anyway, through OneDrive's camera upload, iCloud for Windows, or a USB transfer.

## Getting started

The first time you open Seura, the Welcome screen asks which folders hold your photos, suggesting your Pictures folder. Choose **Get started**, and the Library opens while thumbnails fill in.

It also tells you where Seura keeps its own files: a folder called **Seura Photos** in your home folder. If that folder is synced to a cloud service, Seura says so and offers to store its thumbnails somewhere else, since they'd use space and be uploaded too.

## Your library

A library folder includes all the folders inside it. Add more with the **+** beside FOLDERS in the sidebar (on a Mac, also **File → Add Folder…**).

- The sidebar shows only folders that hold photos, each with its photo count. Selecting one shows the photos directly in it, not in its subfolders.
- Seura shows **JPEG, HEIC, and PNG** photos and ignores other files. For an iPhone Live Photo, it shows the still photo.
- While Seura runs, new, changed, renamed, and deleted photos show up within a few seconds. Changes made while it was closed are found when you next open it.
- Hidden files and folders, and the Recycle Bin and Trash, are skipped.
- A folder on a drive that isn't connected stays in your library, marked **Not connected**, and comes back when the drive does.
- In a read-only folder, you can view photos but not tag, rate, or edit them, and the Info panel says why.
- To stop showing a folder, right-click it and choose **Remove from library…**. Its photos and their edits stay where they are.

## Your photos are safe

Seura never modifies, moves, renames, or copies your photos. The only exception is when you delete photos yourself and confirm it: they go to the Recycle Bin or Trash, never deleted permanently.

### The file beside each photo

The first time you edit, tag, or rate a photo, Seura creates a small file beside it, named after the photo: `IMG_1234.jpg` gets `IMG_1234.jpg.seura.json`. It holds that photo's edits, tags, and rating, and its recent changes for undo, in plain readable text, in the open [Seura edit format](https://github.com/seura-photos/edit-format) that any app can implement.

- Keep it beside the photo. If you copy or move a photo to another place, take its `.seura.json` file too.
- When a photo has no edits, tags, or rating left, its file goes to the Recycle Bin or Trash.
- If another app or a newer version of Seura added something Seura doesn't understand, it's kept, and a notice says it isn't shown.
- If the file can't be read, Seura never overwrites it. The photo shows unedited with a warning, and **Start over** sets the old file aside in Seura's folder and begins again.
- If the file is changed elsewhere, for example synced from another computer, Seura picks up the change. If that photo is open in the Editor, it asks whether to keep your version or load theirs.

### Seura's own folder

Everything else Seura keeps is in the **Seura Photos** folder in your home folder, visible, not hidden:

- `settings.json`: your library folders and other settings, readable text.
- `Presets`: one file for each preset you save.
- `marks.json`: photos you've marked for deletion in a review.
- `Cache`: thumbnails and previews, about 500 MB for every 10,000 photos. It's always safe to delete; Seura rebuilds it. To empty it, use **Clear** in Settings rather than deleting the folder: after a deletion by hand, the next launch reads every edit file in your library again, which in a cloud-synced folder downloads them (see [Cloud-synced folders](#cloud-synced-folders)).
- `Unreadable edit files`: old edit files set aside by Start over.

Exports go only to the folders you choose. Seura sends nothing about you anywhere: it has no telemetry and no account.

## Browsing

### The Library

- **Sort** by date taken, file name, or date modified, from the menu above the grid. The order applies everywhere and is remembered.
- **Thumbnail size:** drag the slider; double-click it to go back to the default.
- **Select** with a click, Ctrl-click (Cmd-click on a Mac), Shift-click, or Select All. From the keyboard, the arrow keys move between photos.
- Small badges show which photos are edited, their ratings, which are in the cloud, and which are marked for deletion (dimmed, with a red outline).
- **The Info panel** on the right shows the selected photo's name, date, size, camera, lens, exposure, location, and edits, with its rating and tags. With several photos selected, it shows what they have in common.
- **Right-click** a photo for Show in Explorer or Finder, Open in default app, Presets, and Move to Recycle Bin or Trash.

### The Viewer

Double-click a photo or press Enter to see it full size. The arrow keys move to the next and previous photo; zoom with the mouse wheel, a pinch, + and −, or Fit and 100%, and drag to pan. Esc goes back to the Library.

### Quick fixes without the Editor

In the Library and the Viewer, you can rotate (`[` and `]`), Enhance (A), and rate (0 to 5) without opening the Editor, on one photo or a whole selection. In the Library, rotate and Enhance also appear on a thumbnail when you point at it.

## Editing

Press **E** or choose **Edit**. The tools run top to bottom in the order you'd usually use them:

- **Enhance:** one click to fix brightness and color. It sets the light and color sliders, which you can then adjust; pressing it again doesn't make it stronger.
- **Crop and straighten (C):** choose a ratio (Freeform, Original, 1:1, 4:3, 3:2, 16:9, 5:4, each landscape or portrait), drag the box, and straighten up to 45° either way. The crop shrinks so no empty corners show. Enter applies, Esc cancels.
- **Rotate and flip.** A crop turns with the photo.
- **Light:** Brightness, Contrast, Highlights, Shadows.
- **Color:** Temperature (Cool to Warm), Tint (Green to Magenta), Saturation.
- **Effects:** Black and white, Sepia, and Vignette, each switched on with one click, then adjusted.
- **Red-eye (R):** click or drag over each red eye; drag a circle to move it, and press Delete to remove it. `[` and `]` change the circle's size. Zoom in to reach small eyes, and hold Space and drag to move around. There's no automatic detection.
- **Presets:** point at one to preview it, click to apply it.

Sliders change the photo as you drag, and double-clicking one resets it. To compare with the original, hold `\` or the **Compare** button. Zoom works as in the Viewer, and the filmstrip, or the arrow keys, move to the next photo without leaving the Editor.

**Revert to original**, at the bottom, removes all of Seura's edits to the photo, after asking in place. Tags and ratings stay, and you can undo it.

### No Save button

Every change is saved by itself, a moment after you make it; the Editor says **Edits saved automatically**. Tags, ratings, and quick fixes are saved at once.

### Undo

- **In the Editor,** Ctrl+Z (Cmd+Z) steps back through that photo's own changes, its last 50, even after you've closed and reopened Seura.
- **Elsewhere,** Ctrl+Z undoes your last action, whatever is selected now, such as a rating given to five photos, and a message says what was undone. Seura remembers the last 10 actions until you quit. Redo is Shift+Ctrl+Z, or Ctrl+Y on Windows (Shift+Cmd+Z on a Mac).
- Moving photos to the Recycle Bin or Trash can't be undone this way; restore them from there.

## Tags, ratings, and finding photos

### Tags

Press **T** to tag the selected photos. Start typing, and the list narrows to matching tags; Enter adds the highlighted one. To make a new tag, keep typing; when nothing matches, Enter creates it, or choose **Create tag** in the list. Esc closes the picker. Remove a tag with the × on its chip in the Info panel.

A slash makes levels: `family/kids` shows as **kids** under **family** in the sidebar's TAGS list. Selecting a tag there shows every photo with exactly that tag, from every folder. Capital letters don't matter: `Beach` and `beach` are the same tag.

### Ratings

Press 0 to 5, or click a star in the Info panel. Clicking the current rating's star clears it.

### Search and filters

The search box (Ctrl+F, or Cmd+F) finds photos by file name or tag across your whole library as you type. Esc ends the search.

**Filter** narrows what's shown by minimum rating, tags, edited or not, and date taken. Active filters stay set as you move between folders, until you clear them or restart Seura.

## Copying edits and presets

- **Copy edits** from one photo (Shift+Ctrl+C, or Shift+Cmd+C), select others, and **paste** them (Shift+Ctrl+V, or Shift+Cmd+V). You choose what to paste: Adjustments and Effects are ticked, Crop and rotation isn't. Red-eye fixes are never pasted.
- **Presets** save a photo's edits to use again: in the Editor, choose **Save current edits as a preset…**. Apply one from the Editor's list, or to a selection from the Library's right-click menu.
- Each preset is a file in `Seura Photos/Presets`. Copy the files to another computer's Presets folder to use them there.

## Review

Review takes you through photos one at a time, as large as the window allows, so you can sort them quickly.

- **Start:** press **R** or **Review** in the Library. With several photos selected, it reviews those; otherwise everything the grid shows.
- **One key for each action:** ← and → move between photos, 0 to 5 rate, `[` and `]` rotate, A enhances, T tags, E opens the Editor, and X marks the photo for deletion. Rating doesn't move you on, so you can rate and then tag.
- **Marking deletes nothing yet.** Marked photos are deleted only when you finish the review and confirm. Marks are kept if you leave the review or quit, and marked photos show dimmed in the Library, where X or **Unmark** in the Info panel takes a mark off.
- **Finishing:** after the last photo, a summary shows what you rated, edited, tagged, and marked, then offers to move the marked photos to the Recycle Bin or Trash in one step, and to export the photos you rated highest. ← takes you back to the last photo if you want to change something first.
- **Esc** leaves at any time; everything you've done is already saved.

### New photos

When new photos arrive in your library's folders, whether Seura was open or not, a banner offers to review just those: **84 new photos in Summer. Sort through them one at a time?** Your own exports, and the photos of a folder you've just added, don't count.

## Deleting photos

Select photos and press Delete (Cmd+Delete on a Mac), or right-click and choose **Move to Recycle Bin** (**Move to Trash**), then confirm.

- Photos always go to the Recycle Bin or Trash, never deleted permanently, together with their `.seura.json` files. To get a photo back with its edits, tags, and rating, restore both.
- A photo in a cloud-synced folder is deleted from the cloud and your other devices too; the confirmation names the service.
- Some photos are left as they are, and the confirmation says why: photos only in the cloud, photos in read-only folders, and on Windows, photos on a USB stick, memory card, or network share, where deleting would be permanent. Delete those in File Explorer or Finder, which warn you first.

## Exporting

Select photos and press Ctrl+E (Cmd+E), or choose **Export**. Choose:

- **Where:** any folder. Seura remembers it, starting with your Pictures folder.
- **Format:** JPEG, with a quality setting, or PNG.
- **Size:** original, or a longest side of up to 2048, 1600, or 1024 pixels, or your own limit. Smaller photos are never enlarged.
- **Details:** remove location data, and include tags and rating as keywords other photo apps can read.

Your edits are applied to the exported copies; the originals don't change. Colors are converted to sRGB, so exports look right in any app. Dates, camera, and lens are kept; the photo's embedded thumbnail isn't, so nothing you cropped out survives in the file.

**Export never replaces a file.** If a name is already taken in that folder, the new file gets a number, such as `IMG_4417 (1).jpg`. So exporting the same photos again into the same folder gives you second copies.

**PNGs and location in File Explorer:** Explorer doesn't show the location stored in a PNG. If you didn't remove location data, it's still in the file; macOS's Preview and Get Info show it.

## Cloud-synced folders

Seura works with folders synced by OneDrive, Dropbox, iCloud Drive, and similar services, including photos that are only in the cloud and not yet on your computer.

### What downloads a photo

Adding a synced folder and browsing it never downloads anything: photos only in the cloud show their thumbnails, with a small cloud badge. A photo is downloaded, one at a time, only when you:

- open it in the Viewer or Editor;
- Enhance it, open it in another app, or export it;
- or, in a review, choose **Download as I go**.

Rotating, rating, tagging, pasting edits, applying presets, and marking for deletion never download a photo. When a selection includes cloud photos, Enhance and Export say how many and how much will download before they start.

Your tags, ratings, and edits are kept only in the small `.seura.json` file beside each photo, a few KB each, so Seura downloads those files when it needs to read them:

- when you add a folder: every edit file in it;
- when Seura rebuilds an edited photo's thumbnail, after you clear the cache or when the thumbnail is missing: that photo's edit file only;
- on the first launch after the `Cache` folder was deleted by hand: every edit file in your library. **Clear** in Settings doesn't cause this.

While a photo downloads, Seura shows its thumbnail with the size being downloaded. Move on whenever you like; the download may still finish in the background. If it fails, **Try again** appears.

### Getting your space back

Photos Seura downloaded stay on your computer until you free the space. Seura leaves that to your system:

- **Windows:** in File Explorer, right-click the photos or their folder and choose **Free up space**. OneDrive's **Storage Sense** can also do this automatically for files you haven't opened for a while.
- **Mac:** in Finder, right-click and choose **Remove Download**.

The cloud badge comes back within a few seconds.

### Deleting

On Windows, a downloaded photo in a OneDrive or Dropbox folder goes to the Recycle Bin and leaves the service on all your devices. Photos only in the cloud are left alone, since Windows would delete them without the Recycle Bin. On a Mac, see [Known issues](#known-issues).

When a photo's last edit, tag, or rating is removed, its small `.seura.json` file goes to the Recycle Bin or Trash, and some services then say a file was deleted. The photo itself isn't affected, and Seura explains this the first time.

### Each service

| Service | Windows | Mac |
| --- | --- | --- |
| OneDrive | Works | Works, except deleting |
| Dropbox | Works, mostly tested | Not tested yet; deleting doesn't work |
| Google Drive | Photos aren't recognized as in the cloud yet | Not tested yet; deleting doesn't work |
| iCloud Drive | Expected to work, not tested yet | Expected to work, not tested yet |

Two services aren't folders Seura can use:

- **iCloud Photos on a Mac** lives inside the Photos app's library. Export photos from Photos into a folder, or use iCloud Drive or another service for your photos.
- **Google Photos** has no desktop sync. On your phone, a camera backup to OneDrive or Dropbox brings photos to your computer instead.

## Colors

Seura shows photos with their true colors: it honors each photo's color profile, so an iPhone's wide-gamut colors look right, and it follows the color description a PNG file carries. A PNG made by an app that labels its colors unusually may look a little different in Seura than in apps that ignore the label.

## Keyboard shortcuts

Ctrl on Windows is Cmd on a Mac. Single keys don't act while you're typing in a text box. Rating and tagging aren't available in the Editor, which is for editing the photo itself; rate and tag in the Library, Viewer, or Review.

| Action | Keys | Where |
| --- | --- | --- |
| Open a photo | Enter, or double-click | Library |
| Go back | Esc | Everywhere |
| Next, previous photo | → ← | Viewer, Editor, Review |
| Rotate left, right | `[` `]` | Library, Viewer, Editor, Review |
| Enhance | A | Library, Viewer, Editor, Review |
| Rate | 0 to 5 | Library, Viewer, Review |
| Tag | T | Library, Viewer, Review |
| Edit | E | Library, Viewer, Review |
| Start a review | R | Library |
| Mark or unmark for deletion | X | Review (in the Library and Viewer, X only unmarks) |
| Zoom in, out | + − | Viewer, Editor |
| Crop | C | Editor |
| Fix red-eye | R | Editor |
| Compare with the original | Hold `\` | Editor |
| Undo | Ctrl+Z | Everywhere |
| Redo | Shift+Ctrl+Z, or Ctrl+Y on Windows | Everywhere |
| Copy edits, paste edits | Shift+Ctrl+C, Shift+Ctrl+V | Everywhere |
| Export | Ctrl+E | Everywhere |
| Search | Ctrl+F | Library |
| Select all | Ctrl+A | Library |
| Delete | Delete (Cmd+Delete on a Mac) | Library, Viewer |
| Photo menu | Shift+F10 | Library, Viewer |

On Windows, there's no menu bar: **About** is under the **⋯** button at the right end of the toolbar. On a Mac, everything is in the menu bar.

## Uninstalling

- **Windows:** uninstall Seura Photos from **Settings → Apps**, like any other program.
- **Mac:** drag Seura Photos from Applications to the Trash.

Either way, your photos aren't touched, and two things stay until you remove them:

- The **Seura Photos** folder in your home folder: your settings, presets, and cache. It's safe to delete.
- The `.seura.json` files beside your photos. They hold your edits, tags, and ratings, so delete them only if you no longer want those.

A Clean up command that removes these for you, from a single folder or the whole library, is coming in the beta.

## Known issues

- **Restoring from the Trash on a Mac:** Finder may offer **Put Back** for a deleted photo but not for its `.seura.json` file. Move that file back to the same folder too, to keep the photo's edits, tags, and rating.
- **Deleting cloud photos on a Mac:** macOS doesn't let Seura move photos in OneDrive, Google Drive, and Dropbox folders to the Trash. Seura explains this and offers **Show in Finder**, where you can delete them.
- **Google Drive on Windows:** Seura can't yet tell which photos are only in the cloud, so it may download them, and shows no cloud badges.
- **Network shares on a Mac:** where a drive has no Trash, deleting photos reports that they couldn't be moved, and removing a photo's last tag or rating doesn't work. Nothing is lost.
- **Bright iPhone photos on a Mac:** on a Mac with an XDR display, iPhone HEIC photos can look brighter in Apple's Photos than in Seura, which shows the standard picture.

## Getting help

To report a problem or ask a question, [open an issue on GitHub](https://github.com/seura-photos/seura/issues). Saying which build you have helps: on Windows, choose **⋯ → About**; on a Mac, **Seura Photos → About Seura Photos**. Both have a Copy button for the version.
