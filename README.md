# MAS International website

Static marketing site with separate employer and applicant journeys. No dependencies beyond Node.

```
src/pages/        one HTML file per page (meta block at the top: title, description, nav)
src/partials/     layout, header, footer, icon sprite
src/assets/css/   styles.css (the whole design system)
src/assets/js/    config.js (phone / WhatsApp / form endpoint), roles.js (role matrix), main.js
build.mjs         assembles pages -> site/  (+ sitemap.xml, robots.txt)
site/             build output, upload this folder to any static host
```

## Run locally
```bash
node build.mjs && python3 -m http.server 4321 -d site
```
Then open http://localhost:4321

## Live preview link (GitHub Pages)
https://masconsultants.in is served by GitHub Pages (repo playcamhq/mas-international) and rebuilt
from `docs/` on every push. DNS at GoDaddy: four A records for `@` → 185.199.108–111.153, CNAME `www` → playcamhq.github.io.
A pre-commit hook runs `node build.mjs --pages` automatically, so publishing an update is just:
```bash
git add -A && git commit -m "Describe the change" && git push
```
After a fresh clone, turn the hook on once with `git config core.hooksPath .githooks`.
The preview is hidden from search engines (noindex) until launch.

## Common edits
- **Open a vacancy:** in `src/assets/js/roles.js` set the role's `status` to `"open"` and add `verified`.
- **Turn on WhatsApp / connect forms:** `src/assets/js/config.js`.
- **Change copy:** edit the page in `src/pages/`, then rebuild.

See `PLAN.md` for the strategy and `LAUNCH-CHECKLIST.md` for what must be filled in before going live.
