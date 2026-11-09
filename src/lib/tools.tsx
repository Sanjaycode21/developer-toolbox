import {
  Code,
  Star,
  History,
  Palette,
  Layers,
  Settings,
  Terminal,
  Hash,
  Shield,
  FileText,
  Binary,
  Calendar,
  Sparkles,
  Clock,
  Key,
  Search,
  Image,
  Type,
  Layout,
  Table,
  Database, // This icon will be used in Sidebar.tsx if it has a mapping
  Braces,
  Link,
  Eye,
  Bot,
  Map,
  MessageSquare,
  Cpu,
  Lock,
  SquareTerminal,
  Server,
  Globe,
  Timer,
  Fingerprint,
  TextCursorInput,
  BookOpenText,
} from "lucide-react";

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
}

// IMPORTANT: The 'icon' property is NOT part of the Tool interface
// and is NOT added to the tools array, as per prompt instructions.
// The Sidebar component must have its own mechanism to map slugs to icons.
export const tools: Tool[] = [
  // Favorites & History
  {
    slug: "favorites",
    name: "Favorites",
    category: "General",
    path: "/tools/favorites",
    description: "Your most loved tools, all in one place.",
  },
  {
    slug: "history",
    name: "History",
    category: "General",
    path: "/tools/history",
    description: "Recently used tools for quick access.",
  },

  // Converters
  {
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder / Decoder",
    category: "Converters",
    path: "/tools/base64-encoder-decoder",
    description: "Encode and decode Base64 strings.",
  },
  {
    slug: "base64-image-encoder-decoder",
    name: "Base64 Image Encoder / Decoder",
    category: "Converters",
    path: "/tools/base64-image-encoder-decoder",
    description: "Encode and decode Base64 images.",
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    category: "Converters",
    path: "/tools/url-encoder-decoder",
    description: "Encode and decode URLs.",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Converters",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools",
    description: "Convert text between different cases (e.g., camelCase, snake_case).",
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Converters",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice-versa.",
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer / Converter",
    category: "Converters",
    path: "/tools/csv-viewer-converter",
    description: "View, format, and convert CSV data.",
  },

  // Formatters
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Formatters",
    path: "/tools/json-formatter",
    description: "Beautify or minify JSON data.",
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    category: "Formatters",
    path: "/tools/xml-formatter",
    description: "Beautify or minify XML data.",
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Formatters",
    path: "/tools/yaml-formatter",
    description: "Beautify or minify YAML data.",
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "Formatters",
    path: "/tools/sql-formatter",
    description: "Beautify or minify SQL queries.",
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Formatters",
    path: "/tools/html-formatter",
    description: "Beautify or minify HTML markup.",
  },

  // Generators
  {
    slug: "hash-generator",
    name: "Hash Generator",
    category: "Generators",
    path: "/tools/hash-generator",
    description: "Generate various cryptographic hashes (MD5, SHA1, SHA256, etc.).",
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    category: "Generators",
    path: "/tools/day-6-implement-uuid-password-generator-tools",
    description: "Generate universally unique identifiers (UUIDs).",
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "Generators",
    path: "/tools/day-6-implement-uuid-password-generator-tools",
    description: "Generate strong, random passwords.",
  },
  {
    slug: "cron-expression-builder",
    name: "Cron Expression Builder",
    category: "Generators",
    path: "/tools/cron-expression-builder",
    description: "Build and visualize cron job schedules.",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Generators",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools",
    description: "Generate placeholder text for your designs.",
  },
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator",
    category: "Generators",
    path: "/tools/meta-tag-generator",
    description: "Generate essential meta tags for SEO.",
  },
  {
    slug: "robots-txt-generator",
    name: "Robots.txt Generator",
    category: "Generators",
    path: "/tools/robots-txt-generator",
    description: "Create a robots.txt file to manage web crawler access.",
  },
  {
    slug: "sitemap-xml-generator",
    name: "Sitemap XML Generator",
    category: "Generators",
    path: "/tools/sitemap-xml-generator",
    description: "Generate an XML sitemap for your website.",
  },
  {
    slug: "css-shadow-generator",
    name: "CSS Shadow Generator",
    category: "Generators",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools",
    description: "Generate complex CSS box and text shadows.",
  },
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Generator",
    category: "Generators",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools",
    description: "Create beautiful CSS linear and radial gradients.",
  },

  // Web & API
  {
    slug: "http-header-viewer",
    name: "HTTP Header Viewer",
    category: "Web & API",
    path: "/tools/http-header-viewer",
    description: "View HTTP headers of any URL.",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Web & API",
    path: "/tools/jwt-decoder",
    description: "Decode JSON Web Tokens to inspect header, payload, and signature.",
  },
  {
    slug: "websocket-tester",
    name: "WebSocket Tester",
    category: "Web & API",
    path: "/tools/websocket-tester",
    description: "Test WebSocket connections and send/receive messages.",
  },
  {
    slug: "meta-tag-og-preview",
    name: "Meta Tag & OG Preview",
    category: "Web & API",
    path: "/tools/meta-tag-generator-og-preview",
    description: "Preview how your website appears on social media.",
  },

  // Utilities
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Utilities",
    path: "/tools/color-picker",
    description: "Pick colors and convert between formats (HEX, RGB, HSL).",
  },
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Utilities",
    path: "/tools/markdown-live-preview",
    description: "Write Markdown and see the rendered HTML in real-time.",
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Utilities",
    path: "/tools/regex-tester-generator",
    description: "Test regular expressions and generate common patterns.",
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer & Viewer",
    category: "Utilities",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize SVG files and preview their rendering.",
  },
  {
    slug: "hash-verifier",
    name: "Hash Verifier",
    category: "Utilities",
    path: "/tools/hash-verifier",
    description: "Verify the integrity of files using hash checksums.",
  },
  {
    slug: "sql-playground",
    name: "SQL Playground",
    category: "Data & API",
    path: "/tools/sql-playground",
    description: "Experiment with SQL queries against a mock in-memory database.",
  },
];

// Helper functions (MUST be preserved exactly as functions)
export function toolsByCategory(): Record<string, Tool[]> {
  return tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}