// All site copy lives here. Edit this file to update the portfolio.

export const profile = {
  name: 'Sahil',
  role: 'No-code, Automation & Frontend Developer',
  availability: 'Open to freelance projects',
  email: 'sahilsgt010@gmail.com',
  gmail: 'https://mail.google.com/mail/?view=cm&fs=1&to=sahilsgt010@gmail.com',
  github: 'https://github.com/Sahil3785',
  linkedin: 'https://linkedin.com/in/sahil3785',
  cv: '/Sahil_CV.pdf',
  // Optional. Fill these in to switch on the WhatsApp and booking buttons.
  // whatsapp: country code + number, digits only, for example '919876543210'
  whatsapp: '',
  // booking: a Calendly / Cal.com link, for example 'https://cal.com/your-name/intro'
  booking: '',
  photo: '/img/sahil.webp',
  photoFallback: '/img/sahil.jpg',
  domain: 'buildwithsahil',
};

// Web3Forms public access key (this key is meant to be used client side).
export const WEB3FORMS_KEY = '96a0fee7-758c-4d3a-b4a3-e1bd68c35cd4';

export const hero = {
  lead: 'I build',
  rotate: ['websites', 'automations', 'no-code platforms', 'web and mobile apps', 'database integrations'],
  tail: 'that run your business.',
  intro:
    "Hi, I'm Sahil. I build websites in Framer, Squarespace and code, no-code platforms in Softr and Airtable, automations, and apps that run on the web, Android and Windows, so your team spends less time on busywork and more on the work that matters.",
};

export const statement =
  'I work where no-code speed meets real engineering. Most days that means Softr and Airtable portals, Framer and Squarespace sites, and n8n workflows wired together with webhooks and REST APIs, so data moves between your tools without anyone copying it by hand. When a client needs more, I ship one codebase to the web, Android and Windows. And when something fails, the system should retry, log it, and recover on its own.';

export const focus = [
  'No-code platforms and websites with Softr, Airtable, Framer and Squarespace',
  'Event-driven integration workflows with n8n, make.com and APIs',
  'One codebase shipped to the web, Android and Windows',
  'Full-stack apps with React, Next.js and Supabase',
];

export const stream = [
  'Softr', 'Framer', 'Squarespace', 'Airtable', 'n8n', 'make.com', 'trigger.dev', 'Webhooks',
  'REST APIs', 'React', 'Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Capacitor',
  'Electron', 'Tauri', 'Three.js', 'Shopify Liquid', 'Postman',
];

// preview: which animated preview to render ('workflow' | 'storefront' | 'portal' | 'hub' | 'nocode' | 'sync')
// media:   optional path to a screenshot, recording or GIF in /public/media.
//          .mp4 / .webm render as a looping video, .gif / .webp / .png / .jpg render as an image.
//          When media is set it replaces the animated preview.
// live:    optional live site. link: the source code.
// badge:   optional short label shown above the title, for example 'Featured'.
export const projects = [
  {
    title: 'Asha Deep School Portal',
    badge: 'Featured · Web + Android + Windows',
    tech: ['React', 'Supabase', 'Capacitor', 'Electron'],
    desc: 'A complete school system from one codebase: a public website for results, UPI fees and admissions, an Android app for teachers and a Windows app for the office, all on one Supabase database.',
    live: 'https://ashaadeep.vercel.app',
    link: 'https://github.com/Sahil3785/Ashaadeep',
    services: ['websites', 'frontend', 'database'],
    preview: 'portal',
    media: '/media/projects/ashaadeep.jpg',
  },
  {
    title: 'Home Designer',
    badge: 'Desktop app · macOS + Windows',
    tech: ['React', 'TypeScript', 'Three.js', 'Tauri'],
    desc: 'An offline desktop studio for planning Indian homes: draw the plan in 2D, walk through it in 3D, check Vastu zones and estimate the cost of the whole build.',
    link: 'https://github.com/Sahil3785/home-designer',
    services: ['frontend'],
    preview: 'portal',
    media: '/media/projects/home-designer.jpg',
  },
  {
    title: 'Company CRM',
    tech: ['Next.js', 'Supabase', 'TypeScript'],
    desc: 'A CRM with separate admin, HR and employee portals: lead pipeline, call logs, attendance, tasks, tickets and documents. Try it live with the one-click demo logins.',
    live: 'https://startup-squad-crm.vercel.app',
    link: 'https://github.com/Sahil3785/crm-web-application',
    services: ['frontend', 'database'],
    preview: 'portal',
    media: '',
  },
  {
    title: 'Quotation Generator',
    tech: ['Next.js', 'Airtable', 'jsPDF'],
    desc: 'Builds GST-ready quotations with auto-numbering, a client list stored in Airtable and one-click PDF export, built for a live trading business.',
    live: 'https://quotation-generator-phi.vercel.app',
    link: 'https://github.com/Sahil3785/Quotation-Generator',
    services: ['frontend', 'database'],
    preview: 'sync',
    media: '/media/projects/quotation-generator.jpg',
  },
  {
    title: 'LibraryOS',
    tech: ['Next.js', 'Supabase', 'PWA'],
    desc: 'An installable library management app with barcode book entry, device session control and automated due-date email reminders on a schedule.',
    link: 'https://github.com/Sahil3785/Library-system',
    services: ['frontend', 'database', 'automation'],
    preview: 'portal',
    media: '/media/projects/library-system.jpg',
  },
  {
    title: 'AI Lead System',
    tech: ['Node.js', 'Express', 'Supabase', 'Next.js'],
    desc: 'Lead intake run by modular agents (intake, qualification, dispatch) with retry logic, structured logging and an admin dashboard.',
    link: 'https://github.com/Sahil3785/lead-system',
    services: ['automation', 'database'],
    preview: 'hub',
    media: '',
  },
  {
    title: 'Workflow Engine',
    tech: ['n8n', 'Airtable', 'APIs'],
    desc: 'A mission-critical automation layer for cross-platform data synchronization and CRM auditing.',
    link: 'https://github.com/Sahil3785/N8N-automation/tree/main',
    services: ['automation', 'database'],
    preview: 'workflow',
    media: '',
  },
  {
    title: 'Call Log Sync',
    tech: ['trigger.dev', 'Supabase', 'REST API'],
    desc: 'A scheduled job that pulls every call from the Callyzer API and stores it in Supabase in batches, with retries for failed requests.',
    link: 'https://github.com/Sahil3785/callyzer-supabase-sync',
    services: ['automation', 'database'],
    preview: 'sync',
    media: '',
  },
];

// The featured case study shown on the Home and Work pages.
export const spotlight = {
  label: 'Featured project',
  title: 'Asha Deep School Portal',
  lede: 'A full school system for Asha Deep Adarsh High School, Panipat. Parents check results and pay fees on the website, teachers enter marks on an Android app, and the office runs the fee desk from a Windows app, all sharing one live Supabase database.',
  repo: 'https://github.com/Sahil3785/Ashaadeep',
  image: '/media/projects/ashaadeep.jpg',
  imageAlt: 'Asha Deep Adarsh High School website home page',
  image2: '/media/projects/ashaadeep-apps.jpg',
  image2Alt: 'Asha Deep staff apps download page',
  stats: [
    { value: '3', label: 'platforms' },
    { value: '1', label: 'shared codebase' },
    { value: '15+', label: 'pages and tools' },
  ],
  platforms: [
    {
      icon: 'globe',
      title: 'Website',
      text: 'Results by roll number, month-wise UPI fee payment, admissions, notices and a sign-in faculty dashboard.',
      action: 'Visit the site',
      href: 'https://ashaadeep.vercel.app',
    },
    {
      icon: 'phone',
      title: 'Android app',
      text: 'For teachers: marks entry, enrolment, the student register and fee collection. Works offline and syncs later.',
      action: 'Download the APK',
      href: 'https://ashaadeep.vercel.app/downloads/AshaDeepFaculty.apk',
      download: true,
    },
    {
      icon: 'monitor',
      title: 'Windows app',
      text: 'For the office: the full staff dashboard with the fee desk, printed receipts, notices and an activity log.',
      action: 'Download the .exe',
      href: 'https://github.com/Sahil3785/Ashaadeep/releases/latest/download/AshaDeepStaff-Setup.exe',
      download: true,
    },
  ],
  tech: ['React', 'Vite', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Row-level security', 'Capacitor', 'Electron', 'jsPDF'],
};

export const repos = [
  { name: 'zinzino-form', lang: 'JavaScript' },
  { name: 'Demo-Publish-page', lang: 'JavaScript' },
  { name: 'Portfolio', lang: 'JavaScript' },
];

export const experience = [
  {
    kind: 'work',
    title: 'No-Code Developer',
    org: 'VR Automations',
    date: 'May 2026 to present',
    current: true,
    bullets: [
      'Build client portals, internal tools and business apps on no-code platforms such as Softr and Airtable.',
      'Design and launch business websites in Framer and Squarespace.',
      'Automate client workflows with n8n and make.com, connecting forms, CRMs, databases and messaging tools.',
      'Turn client requirements into data models, user roles and automations their teams can run and edit themselves.',
    ],
  },
  {
    kind: 'work',
    title: 'AI & Automation Engineer',
    org: 'ZappLocal Technologies',
    date: 'Feb 2026 to May 2026',
    bullets: [
      'Built AI-powered automation workflows for social media and customer communication platforms.',
      'Developed WhatsApp chatbot systems for automated customer support and lead handling.',
      'Created automated content creation and publishing pipelines for Instagram, LinkedIn, Facebook and X.',
      'Integrated APIs and webhooks to enable seamless multi-platform automation workflows.',
      'Implemented AI-assisted content generation and scheduling systems for marketing automation.',
    ],
  },
  {
    kind: 'work',
    title: 'Software Developer',
    org: 'Lumbee International Pvt. Ltd.',
    date: 'Jul 2025 to Jan 2026',
    bullets: [
      'Designed and implemented API-based integrations between internal systems and third-party platforms using webhooks.',
      'Built and maintained modular automation workflows for reliable data synchronization across multiple applications.',
      'Automated CRM workflows by integrating frontend interfaces with backend logic, reducing manual operations.',
      'Implemented error handling, validation and fallback logic to improve system reliability and uptime.',
      'Collaborated with product and operations teams to align integration logic with business requirements.',
      'Monitored and optimized automation workflows to improve performance and reduce latency.',
      'Managed structured datasets in Supabase and Airtable for secure access and consistent data flow.',
    ],
  },
  {
    kind: 'education',
    title: 'Bachelor of Computer Applications',
    org: 'SGT University',
    date: 'Aug 2024 to present',
    current: true,
    bullets: [
      'Focusing on core computer science, system architecture and advanced software development patterns, while applying the theory to real automation projects.',
    ],
  },
];

export const skills = [
  { category: 'No-code platforms', glyph: 'blocks', items: ['Softr', 'Airtable', 'Airtable Interfaces', 'Supabase as a no-code backend'] },
  { category: 'Website builders', glyph: 'globe', items: ['Framer', 'Squarespace', 'Responsive design', 'SEO setup', 'Custom domains'] },
  { category: 'Automation', glyph: 'flow', items: ['n8n', 'make.com', 'trigger.dev', 'WhatsApp chatbots', 'AI-assisted workflows', 'Scheduled jobs'] },
  { category: 'Frontend', glyph: 'layout', items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Vite', 'Three.js'] },
  { category: 'Mobile & desktop apps', glyph: 'spark', items: ['Android apps with Capacitor', 'Windows apps with Electron', 'macOS and Windows apps with Tauri', 'Progressive web apps (PWA)'] },
  { category: 'APIs & backend', glyph: 'plug', items: ['REST APIs', 'Webhooks', 'OAuth', 'Node.js', 'Express', 'API testing with Postman'] },
  { category: 'Databases', glyph: 'db', items: ['Supabase', 'PostgreSQL', 'Row-level security', 'Airtable', 'Firebase', 'MongoDB'] },
  { category: 'E-commerce', glyph: 'bag', items: ['Shopify theme development', 'Liquid templating', 'Storefront customization', 'UPI payment flows'] },
  { category: 'Dev tools', glyph: 'branch', items: ['Git', 'GitHub', 'GitHub Releases', 'Vercel'] },
  { category: 'System concepts', glyph: 'shield', items: ['System integrations', 'Offline-first sync', 'Error handling and retries', 'Data consistency', 'PDF generation'] },
];

// One entry per page. `lines` is the big page title, split into lines.
// One entry per page, in site order. `nav: true` shows it in the top bar.
// `lines` is the big page title, split into lines.
export const pages = [
  {
    path: '/',
    label: 'Home',
    title: 'Sahil | Frontend, Automation and No-code Developer',
    description:
      'Sahil builds frontends, websites, automations, no-code platforms and database integrations that save teams hours every week.',
  },
  {
    path: '/services',
    label: 'Services',
    nav: true,
    title: 'Services | Sahil',
    description: 'Frontend development, automations, no-code platforms, database integration and websites.',
    lines: ['Services built', 'around your work.'],
    lede: 'Five ways I help teams move faster. Pick one, or combine them into a single system that runs on its own.',
  },
  {
    path: '/work',
    label: 'Work',
    nav: true,
    title: 'Work | Sahil',
    description: 'Selected projects: a school portal on web, Android and Windows, desktop apps, CRMs and automation layers.',
    lines: ['Selected work'],
    lede: 'School portals, desktop apps, CRMs and automation layers, each built to keep running without supervision.',
  },
  {
    path: '/about',
    label: 'About',
    nav: true,
    title: 'About | Sahil',
    description: 'Who Sahil is, how he works, and what he focuses on.',
    lines: ['The person behind', 'the workflows.'],
    lede: 'A developer who likes systems that quietly do their job, and pages that feel good to use.',
  },
  {
    path: '/experience',
    label: 'Experience',
    nav: true,
    title: 'Experience | Sahil',
    description: 'Roles, responsibilities and education.',
    lines: ['Where I have', 'built things.'],
    lede: 'Three roles building no-code platforms and automation that teams rely on every day, alongside a degree in computer applications.',
  },
  {
    path: '/skills',
    label: 'Toolkit',
    title: 'Toolkit | Sahil',
    description: 'The tools Sahil uses to build, connect and ship.',
    lines: ['The toolkit'],
    lede: 'What I reach for when a workflow needs to be built, connected or shipped.',
  },
  {
    path: '/contact',
    label: 'Contact',
    title: 'Start a project | Sahil',
    description: 'Build a project brief in two minutes. Replies within 24 hours.',
  },
];

export const pageFor = (path) => pages.find((p) => p.path === path);

// The five core services. `id` is used for links, filters and the brief builder.
export const services = [
  {
    id: 'frontend',
    cta: 'Plan a frontend build',
    glyph: 'layout',
    title: 'Frontend development',
    short: 'Web, Android and Windows apps from one codebase.',
    text: 'Dashboards, internal tools and web apps with a clean component system, responsive layouts and smooth interactions, wired to your APIs. When your team needs it on a phone or a PC, the same code ships as an Android or Windows app.',
    deliverables: [
      'Responsive React or Next.js app',
      'Optional Android and Windows builds',
      'Screens connected to your APIs',
      'Performance and accessibility pass',
    ],
    tools: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Capacitor', 'Electron'],
    preview: 'portal',
  },
  {
    id: 'automation',
    cta: 'Plan an automation',
    glyph: 'flow',
    title: 'Automations',
    short: 'Workflows that take repetitive work off your plate.',
    text: 'n8n, make.com and trigger.dev workflows for lead handling, content publishing, WhatsApp chatbots and AI-assisted tasks, with retries and alerts built in.',
    deliverables: [
      'Mapped workflow with clear triggers',
      'Production-ready workflows',
      'Error handling, retries and alerts',
      'Handover notes for your team',
    ],
    tools: ['n8n', 'make.com', 'trigger.dev', 'Webhooks', 'WhatsApp'],
    preview: 'workflow',
  },
  {
    id: 'nocode',
    cta: 'Plan a no-code platform',
    glyph: 'blocks',
    title: 'No-code platforms',
    short: 'Portals and internal tools, shipped fast.',
    text: 'Client portals, internal tools and admin panels in Softr and Airtable, backed by a proper database, so your team can change things without waiting on a developer.',
    deliverables: [
      'Portal or internal tool with user roles',
      'Data model behind every screen',
      'Automated notifications and updates',
      'A walkthrough so your team can edit it',
    ],
    tools: ['Softr', 'Airtable', 'Supabase', 'make.com', 'n8n'],
    preview: 'nocode',
  },
  {
    id: 'database',
    cta: 'Plan a database integration',
    glyph: 'db',
    title: 'Database integration',
    short: 'Your data, connected and always in sync.',
    text: 'Supabase, Airtable and MongoDB set up properly and connected to your apps through REST APIs, webhooks and OAuth, with validation that keeps every record consistent.',
    deliverables: [
      'Schema and data model',
      'Sync between your tools',
      'API and webhook integrations',
      'Validation and consistency checks',
    ],
    tools: ['Supabase', 'Airtable', 'MongoDB', 'REST APIs', 'OAuth', 'Postman'],
    preview: 'sync',
  },
  {
    id: 'websites',
    cta: 'Plan a website',
    glyph: 'globe',
    title: 'Websites',
    short: 'Framer, Squarespace and custom-coded sites that convert.',
    text: 'Landing pages, business websites and Shopify stores that load fast, look sharp on every screen and are easy for you to update. Built in Framer or Squarespace when you want to edit it yourself, or in code when you need more.',
    deliverables: [
      'Designed, responsive website',
      'Framer, Squarespace or custom build',
      'Forms connected to your tools',
      'SEO-ready structure and launch',
    ],
    tools: ['Framer', 'Squarespace', 'Next.js', 'React', 'Shopify', 'Liquid'],
    preview: 'storefront',
  },
];

export const serviceFor = (id) => services.find((s) => s.id === id);

// How a project runs, shown on the Services page.
export const engagement = [
  { title: 'Share your brief', text: 'Use the project planner or message me. Tell me what slows your team down.' },
  { title: 'Plan the build', text: 'I map the workflow or pages, pick the right tools and send you a clear plan.' },
  { title: 'Build and review', text: 'I build in stages, and you review each one before we move on.' },
  { title: 'Launch and hand over', text: 'We go live, and you get notes so your team can run it with confidence.' },
];

// Review these answers and edit them to match how you work.
export const faqs = [
  {
    q: 'Can you work with the tools we already use?',
    a: 'Usually, yes. Most projects start by connecting what you already have, like Google Sheets, Airtable, Shopify or WhatsApp, through APIs and webhooks.',
  },
  {
    q: 'Can you build in Framer, Squarespace or Softr?',
    a: 'Yes. I build websites in Framer and Squarespace and portals in Softr on top of Airtable, so you can edit text, images and records yourself after launch. If a project outgrows them, I extend it with code.',
  },
  {
    q: 'Do I need to know anything technical?',
    a: 'No. Describe the work that eats your time and I will turn it into a plan. You review the result in plain language, not code.',
  },
  {
    q: 'Can my team make changes after launch?',
    a: 'That is the goal. No-code platforms and clear handover notes mean small edits do not need a developer.',
  },
  {
    q: 'What happens if an automation fails?',
    a: 'Workflows are built with validation, retries and alerts, so failures are caught, retried and reported instead of silently lost.',
  },
  {
    q: 'How quickly will you reply?',
    a: 'Usually within 24 hours. The more detail in your brief, the faster I can come back with a plan.',
  },
];

// Options in the project brief builder.
export const briefOptions = {
  tools: ['Google Sheets', 'Airtable', 'Softr', 'Supabase', 'Framer', 'Squarespace', 'Shopify', 'WhatsApp', 'Gmail', 'Notion', 'A CRM', 'Other'],
  size: ['A quick fix or small task', 'A complete project', 'Ongoing work', 'Not sure yet'],
  timeline: ['As soon as possible', 'Within a month', 'Within 3 months', 'Flexible'],
};

export const workSteps = [
  { title: 'Map the manual steps', text: 'Find the repeated work, and every tool and person it touches.' },
  { title: 'Connect the tools', text: 'Wire them together with n8n, webhooks and REST APIs.' },
  { title: 'Plan for failure', text: 'Validation, retries and fallbacks, so nothing gets silently lost.' },
  { title: 'Monitor and tune', text: 'Watch the runs, cut latency and keep the data consistent.' },
];

export const highlights = [
  'Softr and Airtable portals',
  'Framer and Squarespace sites',
  'Web + Android + Windows apps',
  'WhatsApp chatbots',
  'Social publishing pipelines',
  'CRM automation',
  'Webhook integrations',
  'Error handling and retries',
  'Supabase and Airtable data',
];

// "Busywork to system" scroll scene on the home page.
export const busywork = {
  steps: [
    {
      label: 'Before',
      title: "Your team's week, right now.",
      text: 'Leads sit in inboxes, orders live in spreadsheets, and messages arrive everywhere. Someone copies it all by hand.',
    },
    {
      label: 'Automate',
      title: 'Everything flows into one pipeline.',
      text: 'Webhooks catch every event the moment it happens. The workflow validates it, enriches it and routes it.',
    },
    {
      label: 'After',
      title: 'And lands exactly where it belongs.',
      text: 'Clean rows in Airtable, instant replies on WhatsApp, and an alert only when something truly needs a person.',
    },
  ],
  cards: [
    { icon: 'mail', label: 'New lead' },
    { icon: 'sheet', label: 'orders.xlsx' },
    { icon: 'form', label: 'Contact form' },
    { icon: 'chat', label: 'WhatsApp' },
    { icon: 'cart', label: 'Order #1042' },
    { icon: 'mail', label: 'Follow-up' },
    { icon: 'sheet', label: 'CRM export' },
    { icon: 'chat', label: 'Support ticket' },
    { icon: 'form', label: 'Signup' },
    { icon: 'doc', label: 'Invoice' },
    { icon: 'cart', label: 'Refund' },
    { icon: 'doc', label: 'Weekly report' },
  ],
  rows: ['Lead scored and tagged', 'Order synced', 'Contact updated', 'Reply sent', 'Invoice filed', 'Report generated'],
};
