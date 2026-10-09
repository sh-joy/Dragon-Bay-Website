# Dragon Bay image map

Paths below are relative to the `website/` folder.

## Application gallery

Edit `assets/applications.json` to choose different filenames or image formats. Set both `image` and `thumbnail` to the same path to use one picture for both views.

| Position | Gallery title | Full-size file | Thumbnail |
| --- | --- | --- | --- |
| 1 | Fleet & transport | `assets/applications/fleet.webp` | `assets/applications/fleet-thumb.webp` |
| 2 | Corporate stationery | `assets/applications/stationery.webp` | `assets/applications/stationery-thumb.webp` |
| 3 | Packaging & merchandise | `assets/applications/packaging.webp` | `assets/applications/packaging-thumb.webp` |
| 4 | Brand signage | `assets/applications/signage.webp` | `assets/applications/signage-thumb.webp` |
| 5 | Cargo containers | `assets/applications/containers.webp` | `assets/applications/containers-thumb.webp` |
| 6 | Digital touchpoints | `assets/applications/digital.webp` | `assets/applications/digital-thumb.webp` |
| 7 | Outdoor communication | `assets/applications/billboard.webp` | `assets/applications/billboard-thumb.webp` |
| 8 | Packing tape | `assets/applications/tape.webp` | `assets/applications/tape-thumb.webp` |
| 9 | Signage & identification | `assets/applications/wayfinding.webp` | `assets/applications/wayfinding-thumb.webp` |
| 10 | Everyday merchandise | `assets/applications/merchandise.webp` | `assets/applications/merchandise-thumb.webp` |
| 11 | Workplace & web | `assets/applications/workplace.webp` | `assets/applications/workplace-thumb.webp` |
| 12 | Labels & sealed packaging | `assets/applications/labels.webp` | `assets/applications/labels-thumb.webp` |
| 13 | Display systems | `assets/applications/displays.webp` | `assets/applications/displays-thumb.webp` |
| 14 | Branded accessories | `assets/applications/keyring.webp` | `assets/applications/keyring-thumb.webp` |

The first six entries appear initially; the remaining eight appear when the visitor expands the gallery.

Example replacement for the first entry:

```json
{
  "id": "fleet",
  "title": "Our delivery fleet",
  "image": "assets/applications/my-truck.jpg",
  "thumbnail": "assets/applications/my-truck.jpg",
  "alt": "Dragon Bay delivery truck at our warehouse",
  "caption": "Our delivery fleet"
}
```

Replace one entry inside the existing JSON array; keep valid commas between entries. For a new photograph, change the caption and remove its old `page` field.

## Other page images

| Page section | File to replace |
| --- | --- |
| Clear-space diagram | `assets/clear-space.webp` |
| Co-branding diagram | `assets/co-branding.webp` |
| Propeller pattern | `assets/pattern-propeller.webp` |
| Forward-motion pattern | `assets/pattern-forward.webp` |
| Photography examples | `assets/photography.webp` |

These files are referenced directly in `index.html`. Keep the same filename and format, or change the matching `src` path in that file.

## Logos and profile pictures

All logo exports are in `assets/logos/`. The original master vectors are also inside the bundled `assets/dragon-bay-brand-kit.zip`, in its `Dragon-Bay/originals/` folder.

| Use | Filename |
| --- | --- |
| Sidebar and footer | `horizontal-primary-original.svg` |
| Red cover panel | `horizontal-primary-white.svg` |
| Wordmark explanation | `wordmark-primary-black.svg` |
| Brand-kit panel symbol | `symbol-white.svg` |
| Profile: symbol on light | `profile-symbol-light.svg` |
| Profile: symbol on red | `profile-symbol-red.svg` |
| Profile: wordmark on light | `profile-wordmark-light.svg` |
| Profile: wordmark on dark | `profile-wordmark-dark.svg` |

Interactive previews and downloads use the horizontal, stacked, wordmark, and symbol variants in that same folder. If you replace a logo, keep its proportions and update its matching SVG and PNG versions.

The browser favicon is embedded in the `<link rel="icon">` line in `index.html`. A matching standalone `favicon.svg` is included; to use a replacement file, change that link to `href="favicon.svg"`.
