---
title: Finding a name
description: Picasa was named for a painter. I wanted the same for its successor, and then I had to make sure nobody else was using it.
date: 2026-10-18
part: 3
---

Picasa's name was a play on Picasso. I liked that, and asked for names in the same spirit: an artist or a photographer, adapted into something short and ownable.

## Seura

Of the candidates, **Seura** stuck. It comes from Georges Seurat, the painter who made pictures out of thousands of small dots of color, which is not a bad description of a digital photograph. I also had Claude check two other candidates I liked, Daguera and Talba, but Seura was the one.

One complication: seura.app is already taken, by a Spanish app for running sports clubs over WhatsApp. That's why the full name is **Seura Photos**, which is clearer anyway. I decided to go with it, knowing we could change it later if we had to.

## Checking that nobody else owns it

A name you're going to put on a public website deserves at least a basic trademark check. For a free open-source project, the free public databases are a reasonable level of care. (Neither Claude nor I is a lawyer, and if Seura ever became commercial, I'd have an attorney do a proper search.)

The key thing I learned is that trademarks are about **what** a name is used for. Registrations are grouped into numbered classes of goods and services, and two businesses can usually share a name if they're in unrelated fields. For software, the classes that matter are 9 (downloadable software) and 42 (software services).

Here's what I found:

| Search | What turned up | Verdict |
| --- | --- | --- |
| "Seura" in the US trademark database | One live registration, SÉURA, in class 20: furniture, mirrors, and frames. The accent doesn't make it a different name. | Different field; low risk |
| "Seurat" in classes 9 and 42 | One company making industrial 3D printers and their software | Different product and buyers; low risk |
| "Sura" in classes 9 and 42 | Five marks: university research, massage devices, dog training, an online drama series, a medical practice | No conflict |
| WIPO Global Brand Database (international) | The same US registration, plus one expired registration in Japan | No conflict |

Nothing in software or photography. The name stays.

## The organization

The project lives in a GitHub organization, [seura-photos](https://github.com/seura-photos), with one repository for the app and one for the edit format. This site lives there too, at [seuraphotos.app](https://seuraphotos.app).

Next: [an opinionated interface](/devlog/04-an-opinionated-interface/).
