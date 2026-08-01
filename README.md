# Happy Friendship Day 💖

A 10-page, premium Friendship Day website built with vanilla HTML5, CSS3, and JavaScript — no frameworks.

## Structure
```
index.html        Page 1  — Welcome
gallery.html       Page 2  — Our Memories (slideshow + lightbox gallery)
message.html        Page 3  — Special Message (glassmorphism + typing effect)
timeline.html        Page 4  — Friendship Timeline
gifts.html            Page 5  — Gifts (tap-to-open cards)
celebrate.html          Page 6  — Celebration (confetti / fireworks / hearts / balloons)
letter.html                Page 7  — Secret Letter (envelope animation)
video.html                    Page 8  — Memory Video
countdown.html                  Page 9  — Countdown to next Friendship Day
final.html                         Page 10 — Final Surprise + Replay

css/style.css        Shared design system (pink / purple / white / gold, glassmorphism)
js/script.js          Shared interactivity (nav, cursor, effects, all page logic)
assets/images/          5 of your uploaded photos (photo1–photo5.jpg) + 5 open placeholder slots
assets/music/            Drop a theme.mp3 here for background music
assets/videos/             Drop a memories.mp4 here for the video page
```

## Adding your own content
- **More/replace photos:** put files in `assets/images/` and update the `src`/`data-lightbox` attributes in `gallery.html`.
- **Music:** add `assets/music/theme.mp3` — the music badge (bottom-left) and the 🔈 icon in the navbar control playback. Browsers require a user click before audio can play, so it starts on first tap anywhere on the page.
- **Video:** add `assets/videos/memories.mp4` on `video.html` (or swap the `<video>` for a YouTube/Vimeo `<iframe>`).
- **Letter / message text:** edit the `data-message` attributes in `message.html` and `letter.html`.
- **Countdown target:** `js/script.js` calculates the next first-Sunday-of-August automatically.

## Features included
Loading screen · scroll progress bar · sticky glass navbar with mobile menu · dark/light mode (saved to `localStorage`) · custom cursor (desktop) · ambient floating hearts/sparkles canvas on every page · typewriter hero text · auto slideshow + lightbox · glassmorphism message card with typing animation · animated vertical timeline · flip-to-open gift cards · confetti + fireworks + heart rain + balloons · envelope-opening secret letter with handwriting effect · responsive video frame · live countdown · final full-screen finale with replay · back-to-top button · reduced-motion support.

## Deploying for free
This is a fully static site — no build step required.
- **GitHub Pages:** push this folder to a repo, enable Pages on the `main` branch.
- **Netlify / Vercel / Cloudflare Pages:** drag-and-drop this folder (or connect the repo); no build command needed, publish directory is the project root.

Just open `index.html` in a browser to preview locally, or serve it with any static server.
