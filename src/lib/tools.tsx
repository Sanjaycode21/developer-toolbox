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
  AlignLeft,
  Image,
  Database, // Added Database icon
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
    description: "Your most loved and frequently used tools, all in one place.",
  },
  {
    slug: "history",
    name: "History",
    category: "Core",
    path: "/tools/history",
    description: "Recently used tools for quick access and continuity.",
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
    slug: "base64-image-encoder-decoder",
    name: "Base64 Image Encoder / Decoder",
    category: "Converters",
    path: "/tools/base64-image-encoder-decoder",
    description: "Encode and decode images to/from Base64 strings.",
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer & Converter",
    category: "Converters",
    path: "/tools/csv-viewer-converter",
    description: "View, edit, and convert CSV data to other formats.",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Converters",
    path: "/tools/case-converter",
    description: "Convert text between different cases (e.g., camelCase, snake_case, kebab-case).",
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
    description: "Beautify SQL queries for better readability.",
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Formatters",
    path: "/tools/yaml-formatter",
    description: "Beautify or convert YAML data.",
  },
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Formatters",
    path: "/tools/markdown-live-preview",
    description: "Write and preview Markdown in real-time.",
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
    description: "Generate essential meta tags for SEO and social media.",
  },
  {
    slug: "meta-tag-generator-og-preview",
    name: "Open Graph Preview",
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
    description: "Decode JSON Web Tokens to inspect their contents.",
  },
  {
    slug: "websocket-tester",
    name: "WebSocket Tester",
    category: "Web Utilities",
    path: "/tools/websocket-tester",
    description: "Connect to and test WebSocket endpoints.",
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Web Utilities",
    path: "/tools/regex-tester-generator",
    description: "Test and build regular expressions.",
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer & Viewer",
    category: "Web Utilities",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize and preview SVG files.",
  },

  // Data & Database
  {
    slug: "hash-verifier",
    name: "Hash Verifier",
    category: "Data & Database",
    path: "/tools/hash-verifier",
    description: "Verify the integrity of files using hash comparisons.",
  },
  {
    slug: "sql-playground",
    name: "SQL Playground",
    category: "Data & Database",
    path: "/tools/sql-playground",
    description: "Execute and test SQL queries against a simulated database environment.",
  },

  // Design & Graphics
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Design & Graphics",
    path: "/tools/color-picker",
    description: "Select colors and get their values in various formats.",
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

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

export function getCategoryIcon(category: string): React.ElementType | null {
  switch (category) {
    case "Core":
      return Star;
    case "Converters":
      return Binary;
    case "Formatters":
      return Code;
    case "Generators":
      return Sparkles;
    case "Web Utilities":
      return Layers;
    case "Data & Database":
      return Database; // Use Database icon for Data & Database category
    case "Design & Graphics":
      return Palette;
    default:
      return null;
  }
}

export function getToolIcon(slug: string): React.ElementType | null {
  switch (slug) {
    case "favorites":
      return Star;
    case "history":
      return History;
    case "base64-encoder-decoder":
      return Binary;
    case "url-encoder-decoder":
      return Link; // Assuming Link icon for URL
    case "unix-timestamp-epoch-converter":
      return Clock;
    case "json-formatter":
      return Code;
    case "xml-formatter":
      return FileText;
    case "html-formatter":
      return Code;
    case "sql-formatter":
      return Terminal;
    case "yaml-formatter":
      return AlignLeft;
    case "markdown-live-preview":
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
      return Type;
    case "meta-tag-generator":
      return Search;
    case "meta-tag-generator-og-preview":
      return Image;
    case "robots-txt-generator":
      return FileText;
    case "sitemap-xml-generator":
      return Globe; // Assuming Globe icon for sitemap
    case "http-header-viewer":
      return Layers;
    case "jwt-decoder":
      return Key;
    case "websocket-tester":
      return Terminal;
    case "regex-tester-generator":
      return Search;
    case "hash-verifier":
      return Shield;
    case "color-picker":
      return Palette;
    case "base64-image-encoder-decoder":
      return Image;
    case "csv-viewer-converter":
      return FileText;
    case "case-converter":
      return Type;
    case "css-shadow-generator":
      return Layers; // Using Layers for general design elements
    case "css-gradient-generator":
      return Palette; // Using Palette for color/design
    case "svg-optimizer-viewer":
      return FileText; // Using FileText for file related
    case "sql-playground":
      return Database; // Specific icon for SQL Playground
    default:
      return null;
  }
}

// Add Link and Globe icons if not already imported
import { Link, Globe } from "lucide-react";