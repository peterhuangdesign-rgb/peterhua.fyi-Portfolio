# peterhua.fyi-Portfolio

Portfolio for UXR and UXD and personal works. The repository root is the live site; `design/` holds explorations and notes.

## Edit content

- **Projects, profile text, résumé, contact:** `shared/core.js` (`DATA`, `PROFILE`, `RESUME`, `CONTACT`)
- **Intro sentences:** `STORY` in `site/app.js`
- **Photos and audio:** add files to `media/` and list them in `DATA.mePhotos`, `DATA.photos` or `DATA.tracks`
- **Styles:** `site/app.css` (site), `shared/core.css` (shared parts)

## Preview locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000. Add `#home` to the URL to skip the intro. Opening `index.html` directly from disk also works.

## Publish with GitHub Pages

1. On GitHub, go to **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, with branch `main` and folder `/ (root)`.
3. The custom domain `peterhua.fyi` is already set in `CNAME`. Point the domain's DNS at GitHub Pages: four `A` records for the apex domain (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`), plus a `CNAME` for `www` → `peterhuangdesign-rgb.github.io`. Do this at your registrar, or wherever Framer currently manages the domain.
4. Once DNS resolves, tick **Enforce HTTPS** in the same settings page.

After that, every push to `main` updates peterhua.fyi within a minute or two.

## Routes

- `/` shows the intro to first-time visitors, then the home page.
- `/home` goes straight to the home page.
- `/#research`, `/#design`, `/#profile` and `/#contact` open the sections.

## Rules

Design rules, the current structure and the working agreement are in `CLAUDE.md`.
