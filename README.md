# PackWise — Personal Packing List Manager

**Tagline:** Pack smarter. Forget nothing.

A lightweight, offline-first website for creating reusable packing checklists for trips, university, gym, work, and everyday outings. Pure HTML, CSS, and vanilla JavaScript. IndexedDB for storage. No backend, no accounts, no external requests.

## Pages

- **Dashboard** — total, active, and fully packed list counts; items still to pack; trips departing in the next 14 days; every list with its packing progress.
- **My Lists** — create, edit, duplicate (items reset to unpacked), and delete lists; search by name; filter by category.
- **Packing Checklist** — check items off, grouped by category (Clothing, Electronics, Toiletries, Documents, Essentials, Food, Other); packed/total counts and a live progress bar; All / Packed / Unpacked filters; Reset Packing; a "Ready to go" state when everything is packed; add, edit, remove, and reorder items with up/down controls.
- **Templates** — five built-in templates (Weekend Trip, International Travel, Gym Bag, University Day, Business Trip). Using one creates an editable copy; the template itself never changes.
- **Settings** — light/dark theme, JSON export, validated JSON import (invalid backups are rejected and existing data is untouched), storage usage estimate, delete all data with confirmation. The backup file includes the theme setting, so restoring it on another device restores the theme too.

## Run it

Open `index.html` in a browser, or serve the folder with any static server:

```
python3 -m http.server 8000
```

Then visit http://localhost:8000/

## Privacy

All data stays in your browser's IndexedDB. Nothing is sent anywhere.
