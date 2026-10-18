---
title: Specs before code
description: A product brief, a functional spec with numbered requirements, an open file format, and a record of every big decision. All before writing a single line of the app.
date: 2026-10-18
part: 2
---

The current best practice for building software with an AI assistant has a name: spec-driven development. The idea is simple. An AI model will happily build whatever you describe, so the quality of what you get depends heavily on how well you describe it. Vague requests produce plausible-looking software that does the wrong thing. A written specification gives both of you something fixed to build against and check against.

So before any code, Seura Photos got a stack of documents, in this order:

1. A **product brief**: what it is, who it's for, and the principles behind it.
2. A **functional spec**: what version 1 does, as testable requirements.
3. An **edit format specification**: the file format for edits, in its own repository.
4. **User flows and wireframes**: the screens and how you move between them.
5. A **technical design**: architecture, libraries, testing.
6. A **milestone plan**: the order of work from first code to version 1.0.

All of them are public in the [seura repository](https://github.com/seura-photos/seura/tree/main/docs).

## The brief: deciding what it isn't

Claude drafted the brief from a list of questions, and my answers shaped it:

- **Who it's for:** former Picasa users who want something easy, centered on editing and retouching. Not professionals with raw workflows.
- **Your files:** Seura works on your folders where they are. It never moves, copies, or renames your photos.
- **Where data lives:** edit files sit visibly beside each photo, in a documented format. Settings go in `Documents/Seura Photos`. Nothing hides in AppData or other hidden folders, and there's a cleanup function for removing everything Seura has written.
- **Editing:** the basics. Crop, rotate, straighten, color and tint, exposure and contrast, a few classic effects like vignette and sepia, and red-eye.
- **Organizing:** tags with subtags, the way my bookmark manager works.
- **Cost:** free and open source. No one will ever have to pay to use it or create an account. (If I ever offer a paid service, it will only be for features that cost me money to run, like hosted AI; the details are in the [pricing promise](/#promise-title).)

## Tags, settled precisely

The tags discussion is a good example of why writing things down matters. I wanted tags like `family/kids`, shown as folders in a tree. Simple enough, until you ask what happens when you click `family`. Do you see everything under it?

We settled on exact tags: `family`, `kids`, and `family/kids` are three separate tags, and the slash only affects how they're displayed. Clicking a tag shows the photos with exactly that tag. I also decided there's no renaming tags, since renaming would mean rewriting the edit file beside every photo that uses it. Each of those decisions is now a numbered requirement (TAG-1 to TAG-7) that the code will be tested against.

## Settings, not steps

My favorite question from this stage was mine, and the answer changed the design. If you raise the contrast, then change the tint, then raise the contrast again, does the order matter? Should the edit file record every step, so undo works forever?

Claude's answer was to store **settings, not steps**. The file records the final value of each adjustment, and the app always applies them in a fixed order. Contrast, then tint, then contrast again is just one contrast setting. That keeps files small, makes edits predictable, and means any app reading the format gets the same result.

Undo still matters, though. So each file also keeps a short history of recent changes, capped at the last 50, so you can undo even after closing the app. I preferred plain, readable JSON over compressing it.

## A format other apps can use

The edit format got its own repository, [seura-photos/edit-format](https://github.com/seura-photos/edit-format), with a written specification, a JSON Schema, examples, tests for invalid files, and a checker script. It's licensed so anyone can implement it. Here's part of one, for a photo that was rotated, cropped, brightened, and tagged:

```json
{
  "format": "seura-edit",
  "formatVersion": "1.0",
  "photo": { "file": "IMG_1234.jpg", "width": 4032, "height": 3024 },
  "operations": [
    { "id": "seura.orient", "version": 1, "params": { "rotate": 90, "flipH": false, "flipV": false } },
    { "id": "seura.crop", "version": 1, "params": { "x": 0.05, "y": 0.1, "width": 0.9, "height": 0.75, "aspect": "4:3" } },
    { "id": "seura.exposure", "version": 1, "params": { "ev": 0.3 } },
    { "id": "seura.contrast", "version": 1, "params": { "amount": 35 } }
  ],
  "tags": ["family/kids", "vacation/2026"],
  "rating": 4
}
```

It's designed to grow: plugins can add their own operations, and an app that doesn't recognize an operation must keep it intact when saving.

## Recording decisions

The last habit worth mentioning is decision records: short documents saying what was chosen, why, and what was rejected. There are twelve so far, covering things like Tauri and Rust, storing edits beside photos, and refusing GPL-licensed dependencies. Their real audience is future me, and future AI sessions: anyone about to undo a deliberate choice should first read why it was made.

Next: [finding a name](/devlog/03-finding-a-name/).
