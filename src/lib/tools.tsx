import {
  Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search,
  Type, // For Case Converter
  AlignLeft, // For Lorem Ipsum
  Image, // For Base64 Image
  Table, // For CSV Viewer
  Brackets, // For JSON/XML/YAML
  Link, // For URL Encoder/Decoder
  Lock, // For JWT Decoder
  SquareTerminal, // For Regex Tester
  Database, // For SQL Playground
} from 'lucide-react';

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
}

export const tools: Tool[] = [
  {
    slug: "favorites",
    name: "Favorites",
    category: "Quick Access",
    path: "/tools/favorites",
    description: "Your most loved and frequently used tools.",
  },
  {
    slug: "history",
    name: "History",
    category: "Quick Access",
    path: "/tools/history",
    description: "Recently used tools for quick navigation.",
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Date & Time",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice versa.",
  },
  {
    slug: "cron-expression-builder",
    name: "Cron Expression Builder",
    category: "Date & Time",
    path: "/tools/cron-expression-builder",
    description: "Generate and understand cron expressions easily.",
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    category: "Security",
    path: "/tools/hash-generator",
    description: "Generate various hash checksums like MD5, SHA1, SHA256, etc.",
  },
  {
    slug: "hash-verifier",
    name: "Hash Verifier",
    category: "Security",
    path: "/tools/hash-verifier",
    description: "Verify the integrity of text or files using hash checksums.",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Security",
    path: "/tools/jwt-decoder",
    description: "Decode JSON Web Tokens to inspect their header, payload, and signature.",
  },
  {
    slug: "uuid-password-generator",
    name: "UUID & Password Generator",
    category: "Generators",
    path: "/tools/uuid-password-generator",
    description: "Generate strong passwords and UUIDs (v1, v4, v5).",
  },
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator",
    category: "Generators",
    path: "/tools/meta-tag-generator",
    description: "Create essential meta tags for SEO and social media.",
  },
  {
    slug: "meta-tag-generator-og-preview",
    name: "Open Graph Previewer",
    category: "Generators",
    path: "/tools/meta-tag-generator-og-preview",
    description: "Preview how your content will look when shared on social media.",
  },
  {
    slug: "robots-txt-generator",
    name: "Robots.txt Generator",
    category: "Generators",
    path: "/tools/robots-txt-generator",
    description: "Generate a robots.txt file to manage crawler access.",
  },
  {
    slug: "sitemap-xml-generator",
    name: "Sitemap XML Generator",
    category: "Generators",
    path: "/tools/sitemap-xml-generator",
    description: "Create an XML sitemap for your website to help with SEO.",
  },
  {
    slug: "css-shadow-gradient-generator",
    name: "CSS Shadow & Gradient Generator",
    category: "Generators",
    path: "/tools/css-shadow-gradient-generator",
    description: "Generate complex CSS box shadows and beautiful gradients.",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Generators",
    path: "/tools/lorem-ipsum-generator",
    description: "Generate placeholder text for your designs and prototypes.",
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Formatters",
    path: "/tools/json-formatter",
    description: "Beautify or minify JSON data for better readability or compactness.",
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    category: "Formatters",
    path: "/tools/xml-formatter",
    description: "Beautify or minify XML data for better readability or compactness.",
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Formatters",
    path: "/tools/yaml-formatter",
    description: "Beautify or minify YAML data for better readability or compactness.",
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "Formatters",
    path: "/tools/sql-formatter",
    description: "Format SQL queries for improved readability.",
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Formatters",
    path: "/tools/html-formatter",
    description: "Beautify or minify HTML code for better readability or compactness.",
  },
  {
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder / Decoder",
    category: "Encoders / Decoders",
    path: "/tools/base64-encoder-decoder",
    description: "Encode and decode Base64 strings.",
  },
  {
    slug: "base64-image-encoder-decoder",
    name: "Base64 Image Encoder / Decoder",
    category: "Encoders / Decoders",
    path: "/tools/base64-image-encoder-decoder",
    description: "Encode and decode images to/from Base64 strings.",
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    category: "Encoders / Decoders",
    path: "/tools/url-encoder-decoder",
    description: "Encode and decode URLs to handle special characters.",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Text",
    path: "/tools/case-converter",
    description: "Convert text between different cases: lowercase, uppercase, camelCase, etc.",
  },
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Text",
    path: "/tools/markdown-live-preview",
    description: "Write and preview Markdown in real-time.",
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Text",
    path: "/tools/regex-tester-generator",
    description: "Test and build regular expressions with instant feedback.",
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer & Converter",
    category: "Data",
    path: "/tools/csv-viewer-converter",
    description: "View, edit, and convert CSV data to other formats.",
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer & Viewer",
    category: "Image",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize SVG files and preview their rendering.",
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Design",
    path: "/tools/color-picker",
    description: "Select colors and convert between HEX, RGB, HSL formats.",
  },
  {
    slug: "http-header-viewer",
    name: "HTTP Header Viewer",
    category: "Network",
    path: "/tools/http-header-viewer",
    description: "Inspect HTTP headers of any URL.",
  },
  {
    slug: "websocket-tester",
    name: "WebSocket Tester",
    category: "Network",
    path: "/tools/websocket-tester",
    description: "Connect to WebSocket servers and send/receive messages.",
  },
  {
    slug: "sql-playground",
    name: "SQL Playground",
    category: "Database",
    path: "/tools/sql-playground",
    description: "Execute and test SQL queries against a simulated database environment.",
  },
];

export function toolsByCategory(): Record<string, Tool[]> {
  const categories: Record<string, Tool[]> = {};
  tools.forEach(tool => {
    if (!categories[tool.category]) {
      categories[tool.category] = [];
    }
    categories[tool.category].push(tool);
  });
  return categories;
}

export function allCategories(): string[] {
  const categories = new Set<string>();
  tools.forEach(tool => categories.add(tool.category));
  return Array.from(categories).sort((a, b) => {
    // Custom sort for categories to prioritize 'Quick Access'
    if (a === "Quick Access") return -1;
    if (b === "Quick Access") return 1;
    return a.localeCompare(b);
  });
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(tool => tool.slug === slug);
}

export const categoryIcons: Record<string, React.ElementType> = {
  "Quick Access": Star,
  "Date & Time": Calendar,
  "Security": Shield,
  "Generators": Sparkles,
  "Formatters": Brackets,
  "Encoders / Decoders": Binary,
  "Text": Type,
  "Data": Table,
  "Image": Image,
  "Design": Palette,
  "Network": Layers,
  "Database": Database, // Added Database icon
  "Utilities": Settings, // Fallback or general utilities
};