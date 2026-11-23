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
  Image,
  Table,
  Link,
  Bot,
  ScrollText,
  Braces,
  SquareCode,
  Database, // Assuming Database icon is available or using a fallback
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
    slug: "base64-image-encoder-decoder",
    name: "Base64 Image Encoder / Decoder",
    category: "Converters & Encoders",
    path: "/tools/base64-image-encoder-decoder",
    description: "Encode and decode images to/from Base64.",
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
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools", // This path seems incorrect, should be specific to case converter
    description: "Convert text to different letter cases.",
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Converters & Encoders",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice versa.",
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
    path: "/tools/day-6-implement-uuid-password-generator-tools", // This path seems incorrect, should be specific to UUID generator
    description: "Generate universally unique identifiers (UUIDs).",
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "Generators",
    path: "/tools/day-6-implement-uuid-password-generator-tools", // This path seems incorrect, should be specific to password generator
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
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools", // This path seems incorrect, should be specific to lorem ipsum
    description: "Generate placeholder text for your designs and layouts.",
  },
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator",
    category: "Generators",
    path: "/tools/meta-tag-generator",
    description: "Generate essential meta tags for SEO and social media.",
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
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools", // This path seems incorrect, should be specific to shadow generator
    description: "Generate complex CSS box and text shadows.",
  },
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Generator",
    category: "Generators",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools", // This path seems incorrect, should be specific to gradient generator
    description: "Create beautiful CSS linear and radial gradients.",
  },

  // Formatters & Validators
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Formatters & Validators",
    path: "/tools/json-formatter",
    description: "Format and validate JSON data.",
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    category: "Formatters & Validators",
    path: "/tools/xml-formatter",
    description: "Format and validate XML data.",
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Formatters & Validators",
    path: "/tools/yaml-formatter",
    description: "Format and validate YAML data.",
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "Formatters & Validators",
    path: "/tools/sql-formatter",
    description: "Format SQL queries for better readability.",
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Formatters & Validators",
    path: "/tools/html-formatter",
    description: "Format HTML code for better readability.",
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
    description: "Test and generate regular expressions.",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Formatters & Validators",
    path: "/tools/jwt-decoder",
    description: "Decode and inspect JSON Web Tokens.",
  },

  // Network & Web
  {
    slug: "http-header-viewer",
    name: "HTTP Header Viewer",
    category: "Network & Web",
    path: "/tools/http-header-viewer",
    description: "View HTTP headers of any URL.",
  },
  {
    slug: "websocket-tester",
    name: "WebSocket Tester",
    category: "Network & Web",
    path: "/tools/websocket-tester",
    description: "Connect and test WebSocket endpoints.",
  },
  {
    slug: "meta-tag-og-preview",
    name: "Open Graph Preview",
    category: "Network & Web",
    path: "/tools/meta-tag-generator-og-preview",
    description: "Preview how your link will look on social media.",
  },

  // Utilities
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Utilities",
    path: "/tools/color-picker",
    description: "Select and convert colors.",
  },
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Utilities",
    path: "/tools/markdown-live-preview",
    description: "Write and preview Markdown in real-time.",
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer & Converter",
    category: "Utilities",
    path: "/tools/csv-viewer-converter",
    description: "View, edit, and convert CSV data.",
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer & Viewer",
    category: "Utilities",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize and view SVG files.",
  },
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

export function getToolIcon(slug: string) {
  switch (slug) {
    case "favorites":
      return Star;
    case "history":
      return History;
    case "base64-encoder-decoder":
      return Binary;
    case "base64-image-encoder-decoder":
      return Image;
    case "url-encoder-decoder":
      return Link;
    case "case-converter":
      return Type;
    case "unix-timestamp-epoch-converter":
      return Clock;
    case "hash-generator":
      return Hash;
    case "uuid-generator":
      return Key;
    case "password-generator":
      return Shield;
    case "cron-expression-builder":
      return Calendar;
    case "lorem-ipsum-generator":
      return ScrollText;
    case "meta-tag-generator":
      return Layers;
    case "robots-txt-generator":
      return Bot;
    case "sitemap-xml-generator":
      return Search;
    case "css-shadow-generator":
      return Palette; // Using Palette for styling tools
    case "css-gradient-generator":
      return Sparkles; // Using Sparkles for styling tools
    case "json-formatter":
      return Braces;
    case "xml-formatter":
      return Code; // Using Code for generic code formatting
    case "yaml-formatter":
      return FileText; // YAML is text-based config
    case "sql-formatter":
      return Terminal; // SQL related
    case "html-formatter":
      return SquareCode; // HTML specific code
    case "hash-verifier":
      return Shield;
    case "regex-tester-generator":
      return Search;
    case "jwt-decoder":
      return Key;
    case "http-header-viewer":
      return Terminal; // Network related
    case "websocket-tester":
      return Settings; // Generic settings/connection
    case "meta-tag-og-preview":
      return Image; // OG is image/link preview
    case "color-picker":
      return Palette;
    case "markdown-live-preview":
      return FileText;
    case "csv-viewer-converter":
      return Table;
    case "svg-optimizer-viewer":
      return Image; // SVG is image related
    case "sql-playground":
      return Terminal; // SQL related
    default:
      return Code; // Default icon
  }
}