# buildwithsahil

Portfolio for Sahil, automation and frontend developer. React + Vite, with no UI, routing or animation libraries: every effect is hand-written CSS and a small motion module, so the bundle stays light.

Live: https://buildwithsahil.me

## Run it

```bash
npm install
npm run dev       # local dev server
npm run build     # production build in dist/
npm run preview   # serve the production build
```

Requires Node 18 or newer.

## Pages

| URL           | Page       | What is on it |
| ------------- | ---------- | ------------- |
| `/`           | Home       | Rotating-service hero with live workflow and particles, service cards, busywork scroll scene, savings calculator, featured work, intro |
| `/services`   | Services   | Sticky service tabs, a detailed section per service (what you get, tools, animated preview), project process, calculator, FAQ, call to action |
| `/work`       | Work       | Filter by service, pinned sideways scroll through projects, GitHub repos |
| `/about`      | About      | Portrait, scroll-lit statement, focus areas, code card, "How I work" |
| `/experience` | Experience | Timeline with highlights and CV download |
| `/skills`     | Toolkit    | Tool stream and skills by category |
| `/contact`    | Contact    | Three-step project brief builder, direct links, FAQ |

Unknown URLs show a 404 page. Every page ends with a "Next page" link, and page changes play a liquid curtain transition.

Routing is a tiny built-in router (`src/lib/router.jsx`). It uses clean URLs on the real site and `#/page` URLs when opened as a static file. `vercel.json` rewrites every path to `index.html` so deep links like `/services` load correctly on Vercel.

## Getting more enquiries

The site is built to turn visitors into briefs:

- **Five services** (`services` in `content.js`): Frontend development, Automations, No-code platforms, Database integration and Websites. Each has a short pitch, deliverables, tools, a call-to-action label and an animated preview.
- **Service shortcuts**: hero chips and home cards open the Services page at the right section.
- **Savings calculator** (`components/Calculator.jsx`): visitors estimate hours and money saved; "Plan this automation" opens the brief with Automations selected and their numbers written into the message.
- **Project brief builder** (`components/BriefBuilder.jsx`): three steps (services, tools / size / timeline, contact details) with a live summary. It sends through Web3Forms, and also offers "Email it" and, if configured, "Send on WhatsApp" with the brief pre-written.
- **Pre-filled briefs**: every "Plan a ..." button pre-selects its service (`lib/intent.js` carries the choice across pages).
- **Related work**: each service links to the Work page already filtered to matching projects (`services` on each project).
- **Quick dock**: a floating "Let's talk" button with the brief, email, CV and optional WhatsApp and booking links.
- **FAQ** (`faqs` in `content.js`): answers common questions before they become objections. Review the answers so they match how you work.

### Switch on WhatsApp and call booking

In `src/data/content.js`:

```js
whatsapp: '919876543210',                       // country code + number, digits only
booking: 'https://cal.com/your-name/intro',     // any Calendly or Cal.com link
```

Once filled in, WhatsApp and "Book a call" buttons appear in the dock, the contact page, the call-to-action band and the brief builder. Leave them empty to keep them hidden.

### Add your no-code tools

The No-code platforms service lists Airtable, Supabase, make.com and n8n. Add the builders you actually use (for example Softr or Glide) to its `tools` array.

## Moving from the old version

1. Delete these from the repo:
   - `src/` (replaced entirely)
   - `tailwind.config.js`, `postcss.config.js`
   - `download.js`, `download.mjs` (they fetched AI-generated HTML and are not used)
   - `.env.example` (the form uses Web3Forms, configured in `src/data/content.js`)
   - `public/Images/` (the photo now lives in `public/img/`)
2. Copy in everything from this folder, including `vercel.json`, replacing `package.json`, `index.html` and `vite.config.js`.
3. Delete `package-lock.json` and `node_modules`, then run `npm install`.
4. Run `npm run dev` and click through every page.

## Where things live

```
src/
  data/content.js          all text, links, pages, projects, experience, skills
  lib/router.jsx           tiny router: RouterProvider, useRouter, Link
  lib/motion.js            scroll ticker, smooth scrolling, reveals, helpers
  styles/global.css        design tokens, type, buttons, nav, spine, wipe, cursor
  styles/sections.css      hero, workflow graph, profile, work, previews, experience, toolkit, contact
  styles/pages.css         page header, services, featured work, teaser, process, next page, footer, 404
  styles/motion.css        particles, kinetic type, drawing icons, busywork scene
  styles/productive.css    rotator, service cards, calculator, services page, FAQ, band, filters, brief builder, dock, new previews
  lib/intent.js            carries a chosen service or calculator result to the brief
  pages/                   Home, ServicesPage, WorkPage, About, ExperiencePage, ToolkitPage, ContactPage, NotFound
  components/
    Nav.jsx                fixed glass navbar with sliding pill and scroll progress
    Spine.jsx              left-edge site map, the packet tracks where you are
    Transition.jsx         curtain shown between pages
    PageHeader.jsx         breadcrumb, big title and animated wire art
    NextPage.jsx           large link to the next page
    Services.jsx           home service cards
    Calculator.jsx         automation savings estimator
    BriefBuilder.jsx       three-step project brief
    Faq.jsx, CtaBand.jsx, QuickDock.jsx, motion/Rotator.jsx
    Hero.jsx, WorkflowGraph.jsx, Stream.jsx, Services.jsx, Profile.jsx, Process.jsx,
    Work.jsx, previews/Previews.jsx, Experience.jsx, Toolkit.jsx, Contact.jsx, Footer.jsx,
    Cursor.jsx, Preloader.jsx, UI.jsx, Icons.jsx, ErrorBoundary.jsx
public/
  img/sahil.webp, img/sahil.jpg   portrait
  Sahil_CV.pdf                    CV download
  media/                          project recordings
vercel.json                        SPA rewrites for clean URLs
```

## Editing content

Everything you are likely to change is in `src/data/content.js`:

- `profile`: name, role, email, links, CV path, photo
- `pages`: nav label, browser title, description, page title lines and intro for each page
- `hero` (lead, rotating words, tail, intro), `statement`, `focus`, `workSteps`, `highlights`
- `services`, `engagement`, `faqs`, `briefOptions`
- `projects`, `repos`, `experience`, `skills`

To add a page: create it in `src/pages/`, add an entry to `pages` in `content.js`, and register it in `ROUTES` in `src/App.jsx`.

## Motion graphics

All motion is hand-built (Canvas, SVG and CSS), with no animation libraries.

| Piece | File | What it does |
| ----- | ---- | ------------ |
| Chaos to order | `components/motion/ChaosField.jsx` | Canvas particles drift randomly, then stream into the Webhook node of the hero workflow |
| Busywork to system | `components/motion/Busywork.jsx` | Pinned scroll scene on Home: scattered emails, sheets, forms and messages get pulled into a workflow hub and come out as Airtable rows, a WhatsApp reply and a recovered retry |
| Live workflow | `components/WorkflowGraph.jsx` | Packets travel between nodes, nodes flash, the log streams results |
| Kinetic type | `components/UI.jsx` (`SplitWords`, `MaskLines split`) | Hero and page titles rise letter by letter, letters lift on hover |
| Liquid transition | `components/Transition.jsx` | Curved gradient curtain between pages |
| Scramble text | `lib/motion.js` (`scramble`) | Nav links decode on hover |
| Self-drawing icons | `styles/motion.css` | Service and toolkit icons draw their strokes on reveal and hover |

Scene copy (the three steps, the card labels and the Airtable rows) lives in `busywork` in `content.js`. Every piece pauses when off screen and switches to a static version for visitors with reduced motion turned on.

## Theme

The theme is a soft light palette with a slowly drifting pastel gradient behind everything. All colours are CSS variables at the top of `src/styles/global.css`:

- `--ink` for type, `--muted` for secondary text
- `--accent` (tangerine) for live signals, `--wire` (indigo) for connections
- `--sunset` is the gradient used on hover states, progress lines and highlights
- The four background blobs are `.blob--a` to `.blob--d`

## Adding real project recordings (GIF or video)

Each project shows an animated preview built in code. To show a real recording instead, drop a file in `public/media/` and set `media` on that project:

```js
media: '/media/workflow-engine.mp4',
```

MP4 or WebM loops like a GIF at a fraction of the size. See `public/media/README.md`.

## Contact form

Submissions go through Web3Forms to the inbox tied to `WEB3FORMS_KEY` in `content.js`. The key is designed to be public. A hidden `botcheck` field filters spam.

## Motion and accessibility

- Visitors with "reduce motion" on get a static site: no intro, transitions, pinning or loops.
- Looping animations only run while visible.
- The custom cursor only appears on devices with a mouse.
- Headings shrink to fit their space, so they never break awkwardly whatever font loads.
- Focus moves to the new page after navigation, and each page sets its own title and description.

## Deploy

Push to `main`. Vercel builds with `npm run build`, serves `dist/`, and uses `vercel.json` for clean URLs. The custom domain `buildwithsahil.me` stays as it is.
