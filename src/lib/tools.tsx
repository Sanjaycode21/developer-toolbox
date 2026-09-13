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
    category: "Navigation",
    path: "/tools/favorites",
    description: "Your most loved tools, all in one place.",
  },
  {
    slug: "history",
    name: "History",
    category: "Navigation",
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
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools", // This path needs to be updated if a dedicated page is created
    description: "Convert text to various cases (e.g., camelCase, snake_case).",
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
    description: "Generate various cryptographic hashes (MD5, SHA1, SHA256, etc.).",
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    category: "Generators",
    path: "/tools/day-6-implement-uuid-password-generator-tools", // This path needs to be updated if a dedicated page is created
    description: "Generate universally unique identifiers (UUIDs).",
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "Generators",
    path: "/tools/day-6-implement-uuid-password-generator-tools", // This path needs to be updated if a dedicated page is created
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
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools", // This path needs to be updated if a dedicated page is created
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
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools", // This path needs to be updated if a dedicated page is created
    description: "Generate complex CSS box and text shadows.",
  },
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Generator",
    category: "Generators",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools", // This path needs to be updated if a dedicated page is created
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
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Formatters & Validators",
    path: "/tools/yaml-formatter",
    description: "Beautify or minify YAML data.",
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Formatters & Validators",
    path: "/tools/html-formatter",
    description: "Beautify or minify HTML code.",
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "Formatters & Validators",
    path: "/tools/sql-formatter",
    description: "Beautify or minify SQL queries.",
  },
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Formatters & Validators",
    path: "/tools/markdown-live-preview",
    description: "Write and preview Markdown in real-time.",
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

  // Network & Utilities
  {
    slug: "http-header-viewer",
    name: "HTTP Header Viewer",
    category: "Network & Utilities",
    path: "/tools/http-header-viewer",
    description: "View HTTP headers of any URL.",
  },
  {
    slug: "websocket-tester",
    name: "WebSocket Tester",
    category: "Network & Utilities",
    path: "/tools/websocket-tester",
    description: "Connect and test WebSocket endpoints.",
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Design & Graphics",
    path: "/tools/color-picker",
    description: "Select and convert colors.",
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer & Viewer",
    category: "Design & Graphics",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize and preview SVG files.",
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer & Converter",
    category: "Data & Files",
    path: "/tools/csv-viewer-converter",
    description: "View, edit, and convert CSV data.",
  },
  {
    slug: "sql-playground",
    name: "SQL Playground",
    category: "Data & Files",
    path: "/tools/sql-playground",
    description: "Experiment with SQL queries in a browser-based environment.",
  },
];

export const toolIcons: Record<string, React.ElementType> = {
  favorites: Star,
  history: History,
  "base64-encoder-decoder": Binary,
  "base64-image-encoder-decoder": Layers,
  "url-encoder-decoder": Link, // Assuming Link icon for URL
  "case-converter": Type,
  "unix-timestamp-epoch-converter": Clock,
  "hash-generator": Hash,
  "uuid-generator": Key,
  "password-generator": Shield,
  "cron-expression-builder": Calendar,
  "lorem-ipsum-generator": FileText,
  "meta-tag-generator": Search,
  "robots-txt-generator": FileText,
  "sitemap-xml-generator": FileText,
  "css-shadow-generator": Palette,
  "css-gradient-generator": Palette,
  "json-formatter": Code,
  "xml-formatter": Code,
  "yaml-formatter": Code,
  "html-formatter": Code,
  "sql-formatter": Code,
  "markdown-live-preview": FileText,
  "hash-verifier": Shield,
  "regex-tester-generator": Terminal,
  "jwt-decoder": Settings,
  "http-header-viewer": Globe, // Assuming Globe icon for network
  "websocket-tester": Layers, // Using Layers for connection
  "color-picker": Palette,
  "svg-optimizer-viewer": Sparkles,
  "csv-viewer-converter": Table,
  "sql-playground": Table, // Using Table icon for SQL Playground
};

// Helper to get tools categorized
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

// Helper to get tool by slug
export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

// Helper to get icon by slug
import { Link, Globe } from "lucide-react"; // Import additional icons used in toolIcons

export function getToolIcon(slug: string): React.ElementType {
  return toolIcons[slug] || Code; // Default to Code icon if not found
}