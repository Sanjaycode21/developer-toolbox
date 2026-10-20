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
  Type, // For Case Converter
  AlignLeft, // For Lorem Ipsum
  Image, // For Base64 Image
  Link, // For URL Encoder/Decoder
  Braces, // For JSON/XML/YAML
  Table, // For CSV
  SquareStack, // For Meta Tag Generator
  Bot, // For Robots.txt
  Map, // For Sitemap.xml
  Database, // For SQL related tools
  ScrollText, // For Markdown
  Eye, // For HTTP Header Viewer
  Fingerprint, // For Hash Verifier
  Cpu, // For UUID Generator
  Lock, // For Password Generator
  Paintbrush, // For CSS Shadow/Gradient
  Timer, // For Cron
  SquareDot, // For Regex
  Globe, // For HTTP Header Viewer (alternative)
  MessageSquare, // For WebSocket Tester
  FileCode, // For HTML Formatter
} from "lucide-react";

// Preserve the exact Tool interface definition
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
    description: "Your most loved and frequently used tools.",
  },
  {
    slug: "history",
    name: "History",
    category: "Navigation",
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
    description: "Encode and decode images to/from Base64.",
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    category: "Converters",
    path: "/tools/url-encoder-decoder",
    description: "Encode and decode URL components.",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Converters",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools", // This path needs to be updated to a specific page for case converter
    description: "Convert text between different cases (e.g., camelCase, snake_case).",
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer / Converter",
    category: "Converters",
    path: "/tools/csv-viewer-converter",
    description: "View and convert CSV data.",
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Converters",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice versa.",
  },

  // Generators
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    category: "Generators",
    path: "/tools/day-6-implement-uuid-password-generator-tools", // This path needs to be updated to a specific page for UUID generator
    description: "Generate universally unique identifiers (UUIDs).",
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "Generators",
    path: "/tools/day-6-implement-uuid-password-generator-tools", // This path needs to be updated to a specific page for password generator
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
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools", // This path needs to be updated to a specific page for lorem ipsum
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
    name: "Sitemap.xml Generator",
    category: "Generators",
    path: "/tools/sitemap-xml-generator",
    description: "Generate an XML sitemap for your website.",
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
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Formatters",
    path: "/tools/yaml-formatter",
    description: "Beautify and validate YAML data.",
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
    description: "Format and beautify SQL queries.",
  },

  // Text
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Text",
    path: "/tools/markdown-live-preview",
    description: "Write Markdown and see the live preview.",
  },

  // Cryptography
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
    description: "Verify the integrity of data using hash comparisons.",
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
    slug: "http-header-viewer",
    name: "HTTP Header Viewer",
    category: "Network",
    path: "/tools/http-header-viewer",
    description: "View HTTP headers of any URL.",
  },
  {
    slug: "websocket-tester",
    name: "WebSocket Tester",
    category: "Network",
    path: "/tools/websocket-tester",
    description: "Connect to and test WebSocket endpoints.",
  },

  // Utilities
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Utilities",
    path: "/tools/color-picker",
    description: "Select colors and get their codes in various formats.",
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Utilities",
    path: "/tools/regex-tester-generator",
    description: "Test and build regular expressions.",
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer & Viewer",
    category: "Utilities",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize and view SVG files.",
  },
  {
    slug: "css-shadow-generator",
    name: "CSS Shadow Generator",
    category: "Utilities",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools", // This path needs to be updated
    description: "Generate complex CSS box and text shadows.",
  },
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Generator",
    category: "Utilities",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools", // This path needs to be updated
    description: "Create beautiful CSS linear and radial gradients.",
  },
  {
    slug: "sql-playground",
    name: "SQL Playground",
    category: "Utilities",
    path: "/tools/sql-playground",
    description: "Write, test, and visualize SQL queries with a mock database engine.",
  },
];

// Preserve helper functions exactly as functions
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

export function getCategoryIcon(category: string): React.ElementType | null {
  switch (category) {
    case "Navigation":
      return Star;
    case "Converters":
      return Binary;
    case "Generators":
      return Sparkles;
    case "Formatters":
      return Code;
    case "Text":
      return FileText;
    case "Cryptography":
      return Shield;
    case "Network":
      return Globe;
    case "Utilities":
      return Layers; // Using Layers for Utilities category
    default:
      return Settings;
  }
}