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
  Table,
  Columns,
  SquareStack,
  Brackets,
  ScrollText,
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
  // Favorites & History
  {
    slug: "favorites",
    name: "Favorites",
    category: "General",
    path: "/tools/favorites",
    description: "Your most loved and frequently used tools, all in one place.",
  },
  {
    slug: "history",
    name: "History",
    category: "General",
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
    description: "Convert images to Base64 strings and vice-versa.",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Converters & Encoders",
    path: "/tools/case-converter",
    description: "Convert text to various case formats (e.g., camelCase, snake_case).",
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Converters & Encoders",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice-versa.",
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer / Converter",
    category: "Converters & Encoders",
    path: "/tools/csv-viewer-converter",
    description: "View and convert CSV data to other formats like JSON or XML.",
  },

  // Generators
  {
    slug: "hash-generator",
    name: "Hash Generator",
    category: "Generators",
    path: "/tools/hash-generator",
    description: "Generate various hash checksums (MD5, SHA1, SHA256, etc.).",
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
    slug: "meta-tag-generator-og-preview",
    name: "Open Graph Meta Tag Generator & Preview",
    category: "Generators",
    path: "/tools/meta-tag-generator-og-preview",
    description: "Generate Open Graph meta tags and preview how your content will look when shared on social media.",
  },
  {
    slug: "robots-txt-generator",
    name: "Robots.txt Generator",
    category: "Generators",
    path: "/tools/robots-txt-generator",
    description: "Create a robots.txt file to manage crawler access to your site.",
  },
  {
    slug: "sitemap-xml-generator",
    name: "Sitemap XML Generator",
    category: "Generators",
    path: "/tools/sitemap-xml-generator",
    description: "Generate an XML sitemap for your website to help search engines crawl it more effectively.",
  },
  {
    slug: "css-shadow-generator",
    name: "CSS Shadow Generator",
    category: "Generators",
    path: "/tools/css-shadow-generator",
    description: "Generate complex CSS box and text shadows with live preview.",
  },
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Generator",
    category: "Generators",
    path: "/tools/css-gradient-generator",
    description: "Create beautiful CSS linear and radial gradients.",
  },

  // Formatters
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
    description: "Format and prettify XML data.",
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Formatters",
    path: "/tools/html-formatter",
    description: "Format and indent HTML code.",
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "Formatters",
    path: "/tools/sql-formatter",
    description: "Format and beautify SQL queries.",
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Formatters",
    path: "/tools/yaml-formatter",
    description: "Format and validate YAML data.",
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
    description: "Connect to and test WebSocket endpoints.",
  },

  // Utilities
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Utilities",
    path: "/tools/color-picker",
    description: "Select colors and get their HEX, RGB, HSL values.",
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
    description: "Test and build regular expressions.",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Utilities",
    path: "/tools/jwt-decoder",
    description: "Decode JSON Web Tokens to inspect their header, payload, and verify signature.",
  },
  {
    slug: "hash-verifier",
    name: "Hash Verifier",
    category: "Utilities",
    path: "/tools/hash-verifier",
    description: "Verify the integrity of files by comparing their hash checksums.",
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer & Viewer",
    category: "Utilities",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize SVG files for smaller size and view their content.",
  },
  {
    slug: "sql-playground",
    name: "SQL Playground",
    category: "Database",
    path: "/tools/sql-playground",
    description: "Execute and test SQL queries against a simulated database.",
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

export const categoryIcons: Record<string, React.ElementType> = {
  General: Star,
  "Converters & Encoders": Binary,
  Generators: Sparkles,
  Formatters: Code,
  "Web & Network": Link,
  Utilities: Settings,
  Database: Database, // Assign Database icon to the new category
};