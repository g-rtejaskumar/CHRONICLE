// Curated showcase posts to make the Chronicle feed feel alive, rich, and full of editorial depth.

export const DEFAULT_COVERS = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80",
];

export const PRESET_COVERS = [
  {
    name: "Cyber Neon",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    category: "AI & Tech",
  },
  {
    name: "Prism Glass",
    url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
    category: "Design",
  },
  {
    name: "Deep Violet",
    url: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=1200&q=80",
    category: "Engineering",
  },
  {
    name: "Crystal Sphere",
    url: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1200&q=80",
    category: "Future",
  },
  {
    name: "Grid Matrix",
    url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80",
    category: "Architecture",
  },
  {
    name: "Minimal Dark",
    url: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=1200&q=80",
    category: "Product",
  },
];

export const SHOWCASE_POSTS = [
  {
    $id: "architecture-of-decentralized-frontend",
    title: "The Architecture of Modern Frontend: Micro-Frontends, Edge Rendering & Zero-Trust",
    category: "Engineering",
    featuredImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    status: "active",
    $createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    userId: "editorial-staff",
    authorName: "Elena Vance",
    authorRole: "Principal Systems Architect",
    content: `
      <h2>The Shift Toward Edge Compute</h2>
      <p>Over the last five years, client-side single page applications grew from nimble UI containers into monolithic bundles weighing multiple megabytes. As browsers became operating systems in their own right, user performance plateaued. The reaction from web architects was decisive: move the rendering layer as close to the physical user as possible.</p>
      
      <blockquote>
        "The fastest byte across the wire is the byte that never had to cross an ocean."
      </blockquote>

      <h3>1. Edge Middleware & Dynamic Hydration</h3>
      <p>Edge runtime environments execute JavaScript with sub-millisecond cold starts right at geographically distributed points of presence. By inspecting inbound cookies, geolocations, and authentication headers before hitting the origin server, applications can stream personalized, prerendered HTML directly to the browser.</p>

      <h3>2. Zero-Trust Security at the Edge</h3>
      <p>Modern applications no longer trust the perimeter. By validating token payloads cryptographically at the edge, bad actors and malformed requests are terminated thousands of miles away from primary database clusters.</p>

      <p>As we advance into 2026, architectures that balance serverless computation with client-side reactive frameworks will continue to establish the gold standard for high-performance applications.</p>
    `,
  },
  {
    $id: "designing-for-depth-spatial-ui",
    title: "Designing for Depth: The Renaissance of Spatial UI and Tactile Glassmorphism",
    category: "Design",
    featuredImage: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
    status: "active",
    $createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    userId: "editorial-staff",
    authorName: "Julian Chen",
    authorRole: "Head of Product Design",
    content: `
      <h2>Beyond the Flat Surface</h2>
      <p>For more than a decade, digital interfaces were trapped in the flat aesthetic — stark borders, zero shadows, and uniform gray palettes. But human perception evolved in a world of physical tactile objects, refraction, ambient occlusion, and lighting gradients.</p>

      <h3>The New Spatial Principles</h3>
      <ul>
        <li><strong>Physical Lighting:</strong> Shadows are no longer arbitrary drop offsets; they calculate angle from a simulated ambient light source.</li>
        <li><strong>Chromatic Aberration & Refraction:</strong> Semi-translucent panels gently blur background geometry while separating light wavelengths at the border.</li>
        <li><strong>Inertial Physics:</strong> Cards and interactive elements react to cursor momentum with spring kinetics rather than linear transitions.</li>
      </ul>

      <blockquote>
        "Interfaces that acknowledge depth respect the spatial intuition humans have cultivated for millions of years."
      </blockquote>

      <p>When done with discipline, depth elevates mundane data visualization into an inspiring, cinematic sensory experience.</p>
    `,
  },
  {
    $id: "autonomous-ai-agents-codebase-scale",
    title: "Autonomous AI Agents: Orchestrating Multi-Agent Swarms in Complex Codebases",
    category: "AI",
    featuredImage: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1200&q=80",
    status: "active",
    $createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    userId: "editorial-staff",
    authorName: "Dr. Marcus Thorne",
    authorRole: "AI Research Scientist",
    content: `
      <h2>From Autocomplete to Autonomous Systems</h2>
      <p>The first era of AI assistance was passive autocomplete: suggesting single lines or functions inside an open file buffer. The current frontier represents an inflection point: agentic systems capable of goal formulation, multi-turn tool calling, hypothesis testing, and continuous self-correction across hundreds of files.</p>

      <h3>Architectural Pillars of Agentic Swarms</h3>
      <p>When multiple autonomous agents collaborate on a codebase, deterministic coordination becomes paramount:</p>
      <ol>
        <li><strong>Deterministic Verification:</strong> Agents must run type-checkers, test suites, and linters after every synthesis step to catch hallucinations before submitting code.</li>
        <li><strong>Task Partitioning:</strong> Specialized subagents handle research, security auditing, and refactoring independently to avoid context saturation.</li>
        <li><strong>Shared Memory & State Synchronization:</strong> Peer agents communicate findings and avoid overlapping edits through coordinated workspaces.</li>
      </ol>

      <p>The future software team is not human vs. machine; it is a human conductor directing a symphony of autonomous digital engineers.</p>
    `,
  },
  {
    $id: "high-velocity-engineering-shipping-daily",
    title: "High-Velocity Engineering: How Modern Startups Ship Daily Without Downtime",
    category: "Startups",
    featuredImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80",
    status: "active",
    $createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    userId: "editorial-staff",
    authorName: "Sarah Al-Mansoor",
    authorRole: "VP of Engineering",
    content: `
      <h2>The Myth of the Big-Bang Release</h2>
      <p>Every engineering organization dreams of shipping rapidly. Yet traditional release trains often degenerate into days of manual regression testing, merge conflicts, and tense midnight deployments. High-performing startups operate differently: they ship continuously in small, reversible increments.</p>

      <h3>Key Practices for Continuous Delivery</h3>
      <p>Teams deploying 20+ times per day rely on three core engineering pillars:</p>
      <ul>
        <li><strong>Trunk-Based Development:</strong> Branches live for hours, not weeks. Short-lived pull requests minimize integration debt.</li>
        <li><strong>Feature Flagging:</strong> Code is separated from exposure. Features are merged dark into production and dialed up gradually.</li>
        <li><strong>Ephemeral Preview Environments:</strong> Every PR spawns an isolated preview instance for automatic testing and stakeholder review.</li>
      </ul>

      <blockquote>
        "Velocity is a product of safety, not carelessness. When rollback takes thirty seconds, fear evaporates."
      </blockquote>
    `,
  },
  {
    $id: "crafting-high-performance-react-19",
    title: "Mastering React 19: Server Actions, Concurrent Rendering & Optimistic UI",
    category: "Engineering",
    featuredImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80",
    status: "active",
    $createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    userId: "editorial-staff",
    authorName: "Liam O'Connor",
    authorRole: "Frontend Lead",
    content: `
      <h2>The Evolution of Component Lifecycle</h2>
      <p>React 19 introduces a fundamental shift in how developers handle mutations, server-side data synchronization, and form submission states. By formalizing actions and transitions into the core reconciler, manual loading spinners and complex redux reducers can be streamlined dramatically.</p>

      <h3>1. Server Actions & Form Status</h3>
      <p>Instead of manually managing <code>useState</code> flags for submission, form hooks natively expose pending states and automatic reset semantics.</p>

      <h3>2. Optimistic Updates Made Intuitive</h3>
      <p>The <code>useOptimistic</code> hook allows UI components to immediately reflect user actions—such as upvoting, deleting, or editing—before the network request completes, rolling back automatically if the server responds with an error.</p>

      <p>Combined with TanStack Query and edge caching, modern web apps now deliver instantaneous desktop-like responsiveness.</p>
    `,
  },
  {
    $id: "psychology-of-calm-interfaces",
    title: "The Psychology of Calm Interfaces: Reducing Cognitive Fatigue in the Age of Noise",
    category: "Culture",
    featuredImage: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=1200&q=80",
    status: "active",
    $createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
    userId: "editorial-staff",
    authorName: "Maya Lin",
    authorRole: "Design Anthropologist",
    content: `
      <h2>The Attention Economy's Toll</h2>
      <p>Modern internet users are bombarded by notifications, animated banners, autoplaying media, and aggressive popups. The cognitive penalty is profound: fragmented attention spans, decision paralysis, and persistent digital fatigue.</p>

      <h3>Principles of Calm Software Design</h3>
      <ol>
        <li><strong>Intentional Silence:</strong> Let whitespace breathe. Not every empty pixel needs an interactive widget or promotion.</li>
        <li><strong>Predictable Hierarchies:</strong> Use size, weight, and subtle opacity to guide the eye naturally rather than screaming with saturated hues.</li>
        <li><strong>Non-Intrusive Feedback:</strong> Toast notifications and status badges should appear gracefully and dismiss themselves without hijacking mouse focus.</li>
      </ol>

      <p>Chronicle is built on this belief: stories worth your time deserve a serene, cinematic sanctuary where words and ideas take center stage.</p>
    `,
  },
];

export function getShowcasePost(slug) {
  return SHOWCASE_POSTS.find((p) => p.$id === slug);
}

export function getAllMergedPosts(livePosts = []) {
  const liveSlugs = new Set(livePosts.map((p) => p.$id));
  const filteredShowcase = SHOWCASE_POSTS.filter((p) => !liveSlugs.has(p.$id));
  return [...livePosts, ...filteredShowcase];
}
