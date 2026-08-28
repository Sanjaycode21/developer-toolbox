import { Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search, Globe, Link, Table } from "lucide-react";

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
    description: "Your most loved and frequently used tools, all in one place.",
  },
  {
    slug: "history",
    name: "History",
    category: "Core",
    path: "/tools/history",
    description: "Recently used tools for quick access and continuity.",
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
    description: "Encode and decode URL components.",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Converters & Encoders",
    path: "/tools/case-converter",
    description: "Convert text between different cases (e.g., camelCase, snake_case).",
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Converters & Encoders",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice-versa.",
  },

  // Formatters
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Formatters",
    path: "/tools/json-formatter",
    description: "Beautify and validate JSON data.",
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    category: "Formatters",
    path: "/tools/xml-formatter",
    description: "Beautify and validate XML data.",
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Formatters",
    path: "/tools/html-formatter",
    description: "Beautify and format HTML code.",
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
    description: "Beautify and validate YAML data.",
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer / Converter",
    category: "Formatters",
    path: "/tools/csv-viewer-converter",
    description: "View, format, and convert CSV data.",
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
    description: "Create strong, random passwords with customizable options.",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Generators",
    path: "/tools/lorem-ipsum-generator",
    description: "Generate placeholder text for your designs and prototypes.",
  },
  {
    slug: "cron-expression-builder",
    name: "Cron Expression Builder",
    category: "Generators",
    path: "/tools/cron-expression-builder",
    description: "Build and understand cron expressions easily.",
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
    path: "/tools/css-shadow-generator",
    description: "Visually create complex CSS box and text shadows.",
  },
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Generator",
    category: "Generators",
    path: "/tools/css-gradient-generator",
    description: "Generate beautiful CSS linear and radial gradients.",
  },

  // Web Utilities
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Web Utilities",
    path: "/tools/jwt-decoder",
    description: "Decode JWT tokens to inspect header, payload, and signature.",
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    category: "Web Utilities",
    path: "/tools/regex-tester",
    description: "Test and debug regular expressions with live matching.",
  },
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Web Utilities",
    path: "/tools/markdown-live-preview",
    description: "Write Markdown and see the rendered HTML in real-time.",
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Web Utilities",
    path: "/tools/color-picker",
    description: "Select colors and get their values in various formats (HEX, RGB, HSL).",
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer & Viewer",
    category: "Web Utilities",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize SVG files and preview their rendering.",
  },
  {
    slug: "hash-verifier",
    name: "Hash Verifier",
    category: "Web Utilities",
    path: "/tools/hash-verifier",
    description: "Verify the integrity of files by comparing their hashes.",
  },
  {
    slug: "meta-tag-og-preview",
    name: "Open Graph Preview",
    category: "Web Utilities",
    path: "/tools/meta-tag-og-preview",
    description: "Preview how your links will appear on social media.",
  },
  {
    slug: "websocket-tester",
    name: "WebSocket Tester",
    category: "Web Utilities",
    path: "/tools/websocket-tester",
    description: "Connect to WebSocket servers, send messages, and view real-time communication logs.",
  },
];

// Helper function to get tools by category
export function toolsByCategory(): Record<string, Tool[]> {
  return tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);
}

// Helper function to get tool by slug
export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(tool => tool.slug === slug);
}

// Helper function to get tool icon by slug (for sidebar)
export function getToolIcon(slug: string): React.ElementType | null {
  switch (slug) {
    case "favorites":
      return Star;
    case "history":
      return History;
    case "base64-encoder-decoder":
      return Binary;
    case "base64-image-encoder-decoder":
      return Layers;
    case "url-encoder-decoder":
      return Link;
    case "json-formatter":
      return Code;
    case "xml-formatter":
      return Code;
    case "html-formatter":
      return Code;
    case "sql-formatter":
      return Terminal;
    case "yaml-formatter":
      return FileText;
    case "csv-viewer-converter":
      return Table;
    case "hash-generator":
      return Hash;
    case "uuid-generator":
      return Key;
    case "password-generator":
      return Shield;
    case "lorem-ipsum-generator":
      return Sparkles;
    case "cron-expression-builder":
      return Clock;
    case "meta-tag-generator":
      return Settings;
    case "robots-txt-generator":
      return FileText;
    case "sitemap-xml-generator":
      return Globe;
    case "jwt-decoder":
      return Shield;
    case "regex-tester":
      return Search;
    case "markdown-live-preview":
      return FileText;
    case "color-picker":
      return Palette;
    case "svg-optimizer-viewer":
      return Layers;
    case "hash-verifier":
      return Shield;
    case "meta-tag-og-preview":
      return Globe;
    case "unix-timestamp-epoch-converter":
      return Calendar;
    case "case-converter":
      return FileText;
    case "css-shadow-generator":
      return Palette;
    case "css-gradient-generator":
      return Palette;
    case "websocket-tester":
      return Globe;
    default:
      return Code;
  }
}