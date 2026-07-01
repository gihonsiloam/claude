# Alessandro & Valentina — Luxury Digital Wedding Invitation

A cinematic, single-page digital wedding invitation with an obsidian-and-champagne-gold
aesthetic. Built as a dependency-free static site — pure HTML, CSS, and vanilla JS.

## ✦ Features

- **Wax-seal envelope intro** — tap the seal to open; the flap lifts and the card rises.
- **Ambient music** with a graceful fade-in and an animated equalizer toggle.
- **Live countdown** to the wedding day (days / hours / minutes / seconds).
- **Animated "Our Story" timeline** with alternating milestones.
- **Details cards** for ceremony, reception, and dress code (hover-lift, gold glow).
- **Filterable photo gallery** with a keyboard-navigable lightbox.
- **RSVP form** with a segmented accept/decline control; responses saved to `localStorage`.
- **Guest wishes wall** — visitors leave messages that persist locally.
- **Add to Calendar** — generates and downloads a real `.ics` file.
- **Falling gold-petal canvas** animation with celebration bursts on submit.
- Fully **responsive** and honours `prefers-reduced-motion`.

## ✦ Structure

```
index.html        # markup
css/styles.css    # the entire luxury design system
js/main.js        # all interactivity (no frameworks)
```

## ✦ Run it

No build step. Open `index.html` directly, or serve locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## ✦ Make it yours

| What | Where |
|------|-------|
| Names, dates, venue, copy | `index.html` |
| Wedding date & time | `WEDDING_DATE` in `js/main.js` |
| Gallery photos | `GALLERY` array in `js/main.js` |
| Ambient track | `<audio>` `src` in `index.html` |
| Colours & type | `:root` variables in `css/styles.css` |

### Collecting real RSVPs
RSVPs currently persist to `localStorage` (demo). To collect them for real, point the
form submit at a backend, a Google Form, or a service like Formspree — the handler is in
`js/main.js` under **RSVP FORM**.

Gallery images are loaded from Unsplash for the demo; swap in your own photos for the
final version.
