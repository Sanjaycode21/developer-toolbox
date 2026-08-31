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
  List,
  Table,
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
  // Core Tools
  {
    slug: "favorites",
    name: "Favorites",
    category: "Core",
    path: "/tools/favorites",
    description: "Your most loved and frequently used tools.",
  },
  {
    slug: "history",
    name: "History",
    category: "Core",
    path: "/tools/history",
    description: "Recently used tools for quick access.",
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
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    category: "Converters & Encoders",
    path: "/tools/url-encoder-decoder",
    description: "Encode and decode URLs.",
  },
  {
    slug: "base64-image-encoder-decoder",
    name: "Base64 Image Encoder / Decoder",
    category: "Converters & Encoders",
    path: "/tools/base64-image-encoder-decoder",
    description: "Convert images to Base64 and vice-versa.",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Converters & Encoders",
    path: "/tools/case-converter",
    description: "Convert text to different letter cases.",
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer / Converter",
    category: "Converters & Encoders",
    path: "/tools/csv-viewer-converter",
    description: "View and convert CSV data.",
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Converters & Encoders",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice-versa.",
  },

  // Generators
  {
    slug: "hash-generator",
    name: "Hash Generator",
    category: "Generators",
    path: "/tools/hash-generator",
    description: "Generate various types of hashes (MD5, SHA1, SHA256, etc.).",
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
    description: "Build and understand cron expressions easily.",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Generators",
    path: "/tools/lorem-ipsum-generator",
    description: "Generate placeholder text for your designs and layouts.",
  },
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator",
    category: "Generators",
    path: "/tools/meta-tag-generator",
    description: "Generate essential meta tags for SEO.",
  },
  {
    slug: "meta-tag-generator-og-preview",
    name: "Open Graph Meta Tag Generator & Preview",
    category: "Generators",
    path: "/tools/meta-tag-generator-og-preview",
    description: "Generate and preview Open Graph meta tags for social media.",
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
    description: "Generate beautiful CSS box and text shadows.",
  },
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Generator",
    category: "Generators",
    path: "/tools/css-gradient-generator",
    description: "Create stunning CSS linear and radial gradients.",
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
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Formatters",
    path: "/tools/html-formatter",
    description: "Beautify or minify HTML code.",
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "Formatters",
    path: "/tools/sql-formatter",
    description: "Format SQL queries for better readability.",
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Formatters",
    path: "/tools/yaml-formatter",
    description: "Beautify or minify YAML data.",
  },

  // Web Utilities
  {
    slug: "http-header-viewer",
    name: "HTTP Header Viewer",
    category: "Web Utilities",
    path: "/tools/http-header-viewer",
    description: "View HTTP headers of any URL.",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Web Utilities",
    path: "/tools/jwt-decoder",
    description: "Decode and inspect JSON Web Tokens.",
  },
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Web Utilities",
    path: "/tools/markdown-live-preview",
    description: "Write and preview Markdown in real-time.",
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Web Utilities",
    path: "/tools/regex-tester-generator",
    description: "Test and build regular expressions.",
  },
  {
    slug: "websocket-tester",
    name: "WebSocket Tester",
    category: "Web Utilities",
    path: "/tools/websocket-tester",
    description: "Connect and test WebSocket endpoints.",
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer & Viewer",
    category: "Web Utilities",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize and preview SVG files.",
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Web Utilities",
    path: "/tools/color-picker",
    description: "Select and convert colors.",
  },

  // Database Tools
  {
    slug: "sql-playground",
    name: "SQL Playground",
    category: "Database",
    path: "/tools/sql-playground",
    description: "Execute and test SQL queries in a simulated environment.",
  },
];

export function toolsByCategory(): Record<string, Tool[]> {
  const categories: Record<string, Tool[]> = {};
  tools.forEach((tool) => {
    if (!categories[tool.category]) {
      categories[tool.category] = [];
    }
    categories[tool.category].push(tool);
  });
  return categories;
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getCategoryIcon(category: string): React.ElementType {
  switch (category) {
    case "Core":
      return Star;
    case "Converters & Encoders":
      return Layers;
    case "Generators":
      return Sparkles;
    case "Formatters":
      return Code;
    case "Web Utilities":
      return Terminal;
    case "Database": // Added icon for Database category
      return Database;
    default:
      return Settings;
  }
}