// All site copy lives here. Edit this file to update the portfolio.

export const profile = {
  name: 'Sahil',
  role: 'Automation & Frontend Developer',
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
  rotate: ['websites', 'automations', 'no-code platforms', 'database integrations', 'frontends'],
  tail: 'that run your business.',
  intro:
    "Hi, I'm Sahil. I build frontends, websites, automations, no-code platforms and database integrations, so your team spends less time on busywork and more on the work that matters.",
};

export const statement =
  'I work where storefronts meet backend logic. Most days that means event-driven workflows in n8n, webhooks and REST APIs, so data moves between your tools without anyone copying it by hand. And when something fails, the system should retry, log it, and recover on its own.';

export const focus = [
  'Full-stack architecture with React and Node',
  'Event-driven integration workflows with n8n and APIs',
  'High-converting Shopify storefront setups',
];

export const stream = [
  'n8n', 'Make', 'trigger.dev', 'Webhooks', 'REST APIs', 'OAuth', 'React',
  'Next.js', 'TypeScript', 'Shopify Liquid', 'Supabase', 'Airtable', 'MongoDB', 'Postman',
];

// preview: which animated preview to render ('workflow' | 'storefront' | 'portal' | 'hub')
// media:   optional path to a real screen recording or GIF in /public/media.
//          .mp4 / .webm render as a looping video, .gif / .webp / .png render as an image.
//          When media is set it replaces the animated preview.
export const projects = [
  {
    title: 'Workflow Engine',
    tech: ['n8n', 'Airtable', 'APIs'],
    desc: 'A mission-critical automation layer for cross-platform data synchronization and CRM auditing.',
    link: 'https://github.com/Sahil3785/N8N-automation/tree/main',
    linkLabel: 'View the repo',
    services: ['automation', 'database'],
    preview: 'workflow',
    media: '',
  },
  {
    title: 'E-comm Storefront',
    tech: ['JavaScript', 'Shopify', 'Liquid'],
    desc: 'Custom Shopify theme with a dynamic section architecture and high-converting product schemas.',
    link: 'https://github.com/Sahil3785',
    linkLabel: 'View on GitHub',
    services: ['websites', 'frontend'],
    preview: 'storefront',
    media: '',
  },
  {
    title: 'Security Portal',
    tech: ['React', 'JWT', 'REST'],
    desc: 'Internal client dashboard with role-based access control and real-time API state management.',
    link: '',
    linkLabel: '',
    services: ['frontend', 'database'],
    preview: 'portal',
    media: '',
  },
  {
    title: 'Integrations Hub',
    tech: ['Webhooks', 'Supabase'],
    desc: 'A central place to manage third-party, event-driven data flows, with retry logic built in.',
    link: '',
    linkLabel: '',
    services: ['automation', 'database'],
    preview: 'hub',
    media: '',
  },
];

export const repos = [
  { name: 'crm-web-application', lang: 'TypeScript' },
  { name: 'callyzer-supabase-sync', lang: 'TypeScript' },
  { name: 'Quotation-Generator', lang: 'TypeScript' },
  { name: 'home-designer', lang: 'TypeScript' },
  { name: 'lead-system', lang: 'JavaScript' },
  { name: 'Library-system', lang: 'JavaScript' },
];

export const experience = [
  {
    kind: 'work',
    title: 'AI & Automation Engineer',
    org: 'ZappLocal Technologies',
    date: 'Feb 2026 to present',
    current: true,
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
  { category: 'Automation', glyph: 'flow', items: ['n8n', 'trigger.dev', 'make.com'] },
  { category: 'Frontend', glyph: 'layout', items: ['React', 'Next.js', 'Tailwind CSS', 'JavaScript', 'TypeScript'] },
  { category: 'APIs & integrations', glyph: 'plug', items: ['REST APIs', 'Webhooks', 'OAuth', 'API testing with Postman'] },
  { category: 'E-commerce', glyph: 'bag', items: ['Shopify theme development', 'Liquid templating', 'Storefront customization'] },
  { category: 'Databases', glyph: 'db', items: ['Supabase', 'Airtable', 'MongoDB'] },
  { category: 'Dev tools', glyph: 'branch', items: ['Git', 'GitHub'] },
  { category: 'System concepts', glyph: 'shield', items: ['System integrations', 'Error handling and retries', 'Data consistency'] },
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
    description: 'Selected projects: automation layers, storefronts and internal tools.',
    lines: ['Selected work'],
    lede: 'Automation layers, storefronts and internal tools, each built to keep running without supervision.',
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
    lede: 'Two roles building automation that teams rely on every day, alongside a degree in computer applications.',
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
    short: 'Fast, polished interfaces in React and Next.js.',
    text: 'Dashboards, internal tools and web apps with a clean component system, responsive layouts and smooth interactions, wired to your APIs.',
    deliverables: [
      'Responsive React or Next.js app',
      'Reusable component system',
      'Screens connected to your APIs',
      'Performance and accessibility pass',
    ],
    tools: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'JavaScript'],
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
    text: 'Client portals, internal tools and admin panels on no-code platforms, backed by a proper database, so your team can change things without waiting on a developer.',
    deliverables: [
      'Portal or internal tool with user roles',
      'Data model behind every screen',
      'Automated notifications and updates',
      'A walkthrough so your team can edit it',
    ],
    // Add the no-code builders you use here, for example 'Softr' or 'Glide'.
    tools: ['Airtable', 'Supabase', 'make.com', 'n8n'],
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
    short: 'Business websites and Shopify stores that convert.',
    text: 'Landing pages, business websites and custom Shopify themes that load fast, look sharp on every screen and are easy for you to update.',
    deliverables: [
      'Designed, responsive website',
      'Shopify theme and Liquid sections',
      'Forms connected to your tools',
      'SEO-ready structure and launch',
    ],
    tools: ['Next.js', 'React', 'Shopify', 'Liquid', 'Tailwind CSS'],
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
  tools: ['Google Sheets', 'Airtable', 'Supabase', 'Shopify', 'WhatsApp', 'Gmail', 'Notion', 'A CRM', 'Other'],
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
