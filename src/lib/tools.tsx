import {
  Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search, Globe
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
    category: "Navigation",
    path: "/tools/favorites",
    description: "Your most loved tools, all in one place.",
  },
  {
    slug: "history",
    name: "History",
    category: "Navigation",
    path: "/tools/history",
    description: "Recently used tools.",
  },

  // Converters & Encoders/Decoders
  {
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder / Decoder",
    category: "Converters",
    path: "/tools/base64-encoder-decoder",
    description: "Encode and decode Base64 strings.",
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    category: "Converters",
    path: "/tools/url-encoder-decoder",
    description: "Encode and decode URLs.",
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Converters",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice versa.",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Converters",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools",
    description: "Convert text to different cases (e.g., camelCase, snake_case).",
  },
  {
    slug: "base64-image-encoder-decoder",
    name: "Base64 Image Encoder / Decoder",
    category: "Converters",
    path: "/tools/base64-image-encoder-decoder",
    description: "Encode and decode images to/from Base64.",
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer / Converter",
    category: "Converters",
    path: "/tools/csv-viewer-converter",
    description: "View and convert CSV data.",
  },

  // Generators
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
    description: "Build and understand cron expressions.",
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

  // Formatters & Validators
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Formatters",
    path: "/tools/json-formatter",
    description: "Format and validate JSON data.",
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    category: "Formatters",
    path: "/tools/xml-formatter",
    description: "Format and validate XML data.",
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "Formatters",
    path: "/tools/sql-formatter",
    description: "Format SQL queries for better readability.",
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Formatters",
    path: "/tools/html-formatter",
    description: "Format and beautify HTML code.",
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Formatters",
    path: "/tools/yaml-formatter",
    description: "Format and validate YAML data.",
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Formatters",
    path: "/tools/regex-tester-generator",
    description: "Test and generate regular expressions.",
  },

  // Cryptography & Security
  {
    slug: "hash-generator",
    name: "Hash Generator",
    category: "Cryptography",
    path: "/tools/hash-generator",
    description: "Generate various cryptographic hashes (MD5, SHA1, SHA256, etc.).",
  },
  {
    slug: "hash-verifier",
    name: "Hash Verifier",
    category: "Cryptography",
    path: "/tools/hash-verifier",
    description: "Verify the integrity of files using hash comparison.",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Cryptography",
    path: "/tools/jwt-decoder",
    description: "Decode and inspect JSON Web Tokens.",
  },

  // Network
  {
    slug: "websocket-tester",
    name: "WebSocket Tester",
    category: "Network",
    path: "/tools/websocket-tester",
    description: "Test WebSocket connections and send/receive messages.",
  },
  {
    slug: "http-header-viewer",
    name: "HTTP Header Viewer",
    category: "Network",
    path: "/tools/http-header-viewer",
    description: "View HTTP headers for any URL.",
  },

  // Design & UI
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Design",
    path: "/tools/color-picker",
    description: "Pick colors and convert between formats (HEX, RGB, HSL).",
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer & Viewer",
    category: "Design",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize and view SVG files.",
  },
  {
    slug: "meta-tag-og-preview",
    name: "Open Graph Preview",
    category: "Design",
    path: "/tools/meta-tag-generator-og-preview",
    description: "Preview how your links will look on social media.",
  },

  // Text & Content
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Text",
    path: "/tools/markdown-live-preview",
    description: "Write Markdown and see the live preview.",
  },
];

// Helper function to get tool by slug
export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

// Helper function to categorize tools
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

// Helper function to get icon for a tool (used in Sidebar)
export function getToolIcon(slug: string) {
  switch (slug) {
    case "favorites":
      return Star;
    case "history":
      return History;
    case "base64-encoder-decoder":
      return Binary;
    case "url-encoder-decoder":
      return Search; // Changed from Link to Search (allowed icon)
    case "unix-timestamp-epoch-converter":
      return Clock;
    case "case-converter":
      return FileText;
    case "base64-image-encoder-decoder":
      return Layers;
    case "csv-viewer-converter":
      return FileText; // Changed from Table to FileText (allowed icon)
    case "uuid-generator":
      return Key;
    case "password-generator":
      return Shield;
    case "cron-expression-builder":
      return Calendar;
    case "lorem-ipsum-generator":
      return Sparkles;
    case "meta-tag-generator":
      return Code;
    case "robots-txt-generator":
      return FileText;
    case "sitemap-xml-generator":
      return Globe;
    case "css-shadow-generator":
      return Palette;
    case "css-gradient-generator":
      return Palette;
    case "json-formatter":
      return Code;
    case "xml-formatter":
      return Code;
    case "sql-formatter":
      return Terminal;
    case "html-formatter":
      return Code;
    case "yaml-formatter":
      return Code;
    case "regex-tester-generator":
      return Search;
    case "hash-generator":
      return Hash;
    case "hash-verifier":
      return Shield;
    case "jwt-decoder":
      return Key;
    case "websocket-tester":
      return Layers;
    case "http-header-viewer":
      return Globe; // New tool icon
    case "color-picker":
      return Palette;
    case "svg-optimizer-viewer":
      return FileText;
    case "meta-tag-og-preview":
      return Search;
    case "markdown-live-preview":
      return FileText;
    default:
      return Settings;
  }
}