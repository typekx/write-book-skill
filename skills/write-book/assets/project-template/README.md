# Book project — organisation template

This folder is a template to copy into a separate book project. Fill it in with the author's decisions and keep only the registers you need. It contains no written prose and no running automation.

| Folder | Entry point | What it holds |
|---|---|---|
| Rules | [Project rules](01_Project_Rules/README.md) | Sources, structure, length and style. |
| Characters | [Character index](02_Characters/main_characters.md) | Cards, arcs and relationships. |
| World and notes | [Timeline](03_World_and_Notes/timeline.md) | Chronology, locations, research, props and the [name catalogue](03_World_and_Notes/name_catalogue.md). |
| Manuscript | [Manuscript rules](04_Manuscript/README.md) | Volumes and the order of units. |
| Exports | [Export register](05_Exports/README.md) | Editions and the versions of their sources. |
| Control | [State and reports](06_Control/README.md) | Decisions, unit reports, audits and the continuation state. |
| Series | [Series architecture](07_Series_Architecture/SERIES_ARCHITECTURE.md) | Plan of all volumes, arcs, seeds and reveal limits. |

## Current stage

- Title and author: not filled in.
- Stage: template, no manuscript.
- Current task: to be decided from the author's instruction.
- Chosen text version: none.
- Next unit: undecided; the existence of the template does not order a prologue.

## Getting started

Fill in the rules. Create a volume folder in `04_Manuscript/` only when needed and add its order list. With the skill, copy its profile template into the rules and the state and report templates into control as needed. After each unit, record the facts actually written and the current stage. Save clean prose separately from reports.

For a series, start with the architecture of the whole, the [volume cards](07_Series_Architecture/VOLUME_CARD.md) and the [reveal matrix](07_Series_Architecture/SEEDS_AND_REVEALS.md). For a standalone book, do not create fictional further volumes. Base the [style profile](01_Project_Rules/STYLE_PROFILE.md) on passages chosen by the author; after editing, use the [style and immersion audit](06_Control/STYLE_AND_IMMERSION_AUDIT.md) and the [change impact register](06_Control/VALIDATION_AND_CHANGE_IMPACT.md).

## History and editions

In Git, describe changes by what they mean for the book. Editor working files are ignored by the included `.gitignore`; finished exports can be versioned or stored separately, as the author decides. When exporting, follow the unit list and record which sources the result came from.
