# English in Motion — Digital Language Observatory

A static website ready for Netlify. No build step, no frameworks — plain HTML/CSS/JS.

## Deploy to Netlify (30 seconds)

1. Go to https://app.netlify.com/drop
2. Drag this entire folder onto the page.
3. Done — the site is live. Netlify gives you a URL immediately.

To update the site later: change any file, then drag the folder again (or connect
your GitHub/GitLab repo to Netlify for automatic deploys on every save).

## Add a video (Materials section)

Open `materials.js` and add a line to the `MATERIALS` list:

    // YouTube (watch, share, or shorts link — all work)
    { title: "Project overview", youtube: "https://youtu.be/VIDEO_ID", desc: "Optional description" },

    // Vimeo
    { title: "Interview", vimeo: "https://vimeo.com/123456789" },

    // Video file from your PC:
    // 1) copy the file into the "videos" folder next to index.html
    // 2) reference it like this (formats: .mp4, .webm; max ~100 MB per file)
    { title: "Lesson recording", mp4: "videos/lesson1.mp4" },

Save the file and redeploy — the video appears on the site automatically.

## Files

- `index.html` — page structure (all six sections + Materials)
- `styles.css` — editorial archive design (warm paper / dark ink / accent colors)
- `data.js` — all site content: 7 atlas phenomena, 39 archive examples, 5 claims, 6 signals, case file, 9 sources
- `materials.js` — video list (edit this to add videos)
- `videos/` — put your own video files here (from PC), then reference them in materials.js
- `app.js` — interactive behavior (tabs, search, filters, live count, expandables)

## Accessibility & behavior

- Keyboard-operable tabs, filters, and expandable cards
- Live result count for archive search
- Reduced-motion support
- All interface copy in English; Kazakh appears only inside constructed bilingual examples
