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
  Link,
  Table, // Added for SQL Playground
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
    path: "/tools/case-converter",
    description: "Convert text to different cases (e.g., uppercase, lowercase, camelCase).",
  },
  {
    slug: "base64-image-encoder-decoder",
    name: "Base64 Image Encoder / Decoder",
    category: "Converters",
    path: "/tools/base64-image-encoder-decoder",
    description: "Encode and decode images to/from Base64 strings.",
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer / Converter",
    category: "Converters",
    path: "/tools/csv-viewer-converter",
    description: "View and convert CSV data to other formats.",
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
    description: "Build and visualize cron job schedules.",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Generators",
    path: "/tools/lorem-ipsum-generator",
    description: "Generate placeholder text for your designs and prototypes.",
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
    name: "Open Graph Meta Tag Generator & Preview",
    category: "Generators",
    path: "/tools/meta-tag-generator-og-preview",
    description: "Generate and preview Open Graph meta tags for social sharing.",
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
    description: "Generate complex CSS box-shadow and text-shadow styles.",
  },
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Generator",
    category: "Generators",
    path: "/tools/css-gradient-generator",
    description: "Create beautiful CSS linear and radial gradients.",
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
    description: "Test WebSocket connections and send/receive messages.",
  },

  // Data & API
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Data & API",
    path: "/tools/jwt-decoder",
    description: "Decode and inspect JSON Web Tokens.",
  },
  {
    slug: "sql-playground",
    name: "SQL Playground",
    category: "Data & API",
    path: "/tools/sql-playground",
    description: "Execute and test SQL queries against a mock database.",
  },

  // Utilities
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Utilities",
    path: "/tools/markdown-live-preview",
    description: "Write Markdown and see the live preview.",
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Utilities",
    path: "/tools/regex-tester-generator",
    description: "Test and build regular expressions.",
  },
  {
    slug: "hash-verifier",
    name: "Hash Verifier",
    category: "Utilities",
    path: "/tools/hash-verifier",
    description: "Verify the integrity of files using hash comparison.",
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Utilities",
    path: "/tools/color-picker",
    description: "Select colors and get their codes in various formats.",
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer & Viewer",
    category: "Utilities",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize SVG files and preview them.",
  },
];

// Helper function to get an icon for a given tool slug
export function getToolIcon(slug: string) {
  switch (slug) {
    case "favorites":
      return Star;
    case "history":
      return History;
    case "base64-encoder-decoder":
      return Binary;
    case "url-encoder-decoder":
      return Link;
    case "unix-timestamp-epoch-converter":
      return Clock;
    case "case-converter":
      return Type;
    case "base64-image-encoder-decoder":
      return Image;
    case "csv-viewer-converter":
      return Table; // CSV also uses Table icon
    case "json-formatter":
      return Layers;
    case "xml-formatter":
      return Code;
    case "html-formatter":
      return Code;
    case "sql-formatter":
      return Terminal;
    case "yaml-formatter":
      return FileText;
    case "hash-generator":
      return Hash;
    case "uuid-generator":
      return Key;
    case "password-generator":
      return Shield;
    case "cron-expression-builder":
      return Calendar;
    case "lorem-ipsum-generator":
      return FileText;
    case "meta-tag-generator":
      return Search;
    case "meta-tag-generator-og-preview":
      return Search;
    case "robots-txt-generator":
      return FileText;
    case "sitemap-xml-generator":
      return Layers;
    case "css-shadow-generator":
      return Palette;
    case "css-gradient-generator":
      return Palette;
    case "http-header-viewer":
      return Terminal;
    case "websocket-tester":
      return Settings;
    case "jwt-decoder":
      return Key;
    case "sql-playground":
      return Table; // SQL Playground uses Table icon
    case "markdown-live-preview":
      return FileText;
    case "regex-tester-generator":
      return Search;
    case "hash-verifier":
      return Shield;
    case "color-picker":
      return Palette;
    case "svg-optimizer-viewer":
      return Sparkles;
    default:
      return Code; // Default icon
  }
}

// Helper function to group tools by category
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

// Helper function to get a tool by its slug
export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}