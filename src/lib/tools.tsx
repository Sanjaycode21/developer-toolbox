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
  Type,
  Database, // Added for SQL Playground
} from "lucide-react";

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
}

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
    description: "Recently used tools.",
  },

  // Converters & Encoders
  {
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder / Decoder",
    category: "Converters & Encoders",
    path: "/tools/base64-encoder-decoder",
    description: "Encode and decode Base64 strings.",
  },
  {
    slug: "base64-image-encoder-decoder",
    name: "Base64 Image Encoder / Decoder",
    category: "Converters & Encoders",
    path: "/tools/base64-image-encoder-decoder",
    description: "Convert images to Base64 and vice-versa.",
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    category: "Converters & Encoders",
    path: "/tools/url-encoder-decoder",
    description: "Encode and decode URLs.",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Converters & Encoders",
    path: "/tools/case-converter",
    description: "Convert text between different casing styles.",
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer / Converter",
    category: "Converters & Encoders",
    path: "/tools/csv-viewer-converter",
    description: "View and convert CSV data to other formats.",
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
    path: "/tools/uuid-generator",
    description: "Generate universally unique identifiers (UUIDs).",
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "Generators",
    path: "/tools/password-generator",
    description: "Create strong, random passwords.",
  },
  {
    slug: "cron-expression-builder",
    name: "Cron Expression Builder",
    category: "Generators",
    path: "/tools/cron-expression-builder",
    description: "Build and understand cron job schedules.",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Generators",
    path: "/tools/lorem-ipsum-generator",
    description: "Generate placeholder text for your designs.",
  },
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator",
    category: "Generators",
    path: "/tools/meta-tag-generator",
    description: "Generate essential meta tags for SEO and social media.",
  },
  {
    slug: "meta-tag-generator-og-preview",
    name: "Open Graph Previewer",
    category: "Generators",
    path: "/tools/meta-tag-generator-og-preview",
    description: "Preview how your links will appear on social media.",
  },
  {
    slug: "robots-txt-generator",
    name: "Robots.txt Generator",
    category: "Generators",
    path: "/tools/robots-txt-generator",
    description: "Create a robots.txt file to manage crawler access.",
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
    path: "/tools/css-shadow-generator",
    description: "Generate complex CSS box and text shadows.",
  },
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Generator",
    category: "Generators",
    path: "/tools/css-gradient-generator",
    description: "Create beautiful CSS linear and radial gradients.",
  },

  // Formatters & Validators
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Formatters & Validators",
    path: "/tools/json-formatter",
    description: "Beautify or minify JSON data.",
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    category: "Formatters & Validators",
    path: "/tools/xml-formatter",
    description: "Beautify or minify XML data.",
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Formatters & Validators",
    path: "/tools/html-formatter",
    description: "Beautify or minify HTML markup.",
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "Formatters & Validators",
    path: "/tools/sql-formatter",
    description: "Beautify or minify SQL queries.",
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Formatters & Validators",
    path: "/tools/yaml-formatter",
    description: "Beautify or minify YAML data.",
  },
  {
    slug: "hash-verifier",
    name: "Hash Verifier",
    category: "Formatters & Validators",
    path: "/tools/hash-verifier",
    description: "Verify the integrity of files using hash comparison.",
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Formatters & Validators",
    path: "/tools/regex-tester-generator",
    description: "Test and build regular expressions.",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Formatters & Validators",
    path: "/tools/jwt-decoder",
    description: "Decode and inspect JSON Web Tokens.",
  },

  // Web & Network
  {
    slug: "http-header-viewer",
    name: "HTTP Header Viewer",
    category: "Web & Network",
    path: "/tools/http-header-viewer",
    description: "View HTTP headers of any URL.",
  },
  {
    slug: "websocket-tester",
    name: "WebSocket Tester",
    category: "Web & Network",
    path: "/tools/websocket-tester",
    description: "Connect and test WebSocket endpoints.",
  },
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Web & Network",
    path: "/tools/markdown-live-preview",
    description: "Write and preview Markdown in real-time.",
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer & Viewer",
    category: "Web & Network",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize and view SVG files.",
  },

  // Utilities
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Utilities",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert between human-readable dates and Unix timestamps.",
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Utilities",
    path: "/tools/color-picker",
    description: "Select and convert colors between different formats.",
  },

  // Database
  {
    slug: "sql-playground",
    name: "SQL Playground",
    category: "Database",
    path: "/tools/sql-playground",
    description: "Execute and test SQL queries against a simulated database environment.",
  },
];

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

export const categoryIcons: Record<string, React.ElementType> = {
  General: Star,
  "Converters & Encoders": Binary,
  Generators: Sparkles,
  "Formatters & Validators": Code,
  "Web & Network": Layers,
  Utilities: Settings,
  Database: Database, // Assign icon for Database category
};