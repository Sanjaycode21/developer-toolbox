import { Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search, Table } from 'lucide-react';

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
    description: "Encode and decode images to/from Base64.",
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    category: "Encoders / Decoders",
    path: "/tools/url-encoder-decoder",
    description: "Encode and decode URLs.",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Encoders / Decoders",
    path: "/tools/jwt-decoder",
    description: "Decode JSON Web Tokens to inspect their contents.",
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    category: "Generators",
    path: "/tools/hash-generator",
    description: "Generate various hash types like MD5, SHA1, SHA256, etc.",
  },
  {
    slug: "hash-verifier",
    name: "Hash Verifier",
    category: "Generators",
    path: "/tools/hash-verifier",
    description: "Verify the integrity of files or text using hash comparison.",
  },
  {
    slug: "uuid-password-generator",
    name: "UUID & Password Generator",
    category: "Generators",
    path: "/tools/uuid-password-generator",
    description: "Generate UUIDs and strong, random passwords.",
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
    description: "Generate a robots.txt file to manage web crawler access.",
  },
  {
    slug: "sitemap-xml-generator",
    name: "Sitemap XML Generator",
    category: "Generators",
    path: "/tools/sitemap-xml-generator",
    description: "Create an XML sitemap for your website to help with SEO.",
  },
  {
    slug: "cron-expression-builder",
    name: "Cron Expression Builder",
    category: "Generators",
    path: "/tools/cron-expression-builder",
    description: "Build and understand cron expressions easily.",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Text",
    path: "/tools/case-converter",
    description: "Convert text between different cases (e.g., camelCase, snake_case).",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Text",
    path: "/tools/lorem-ipsum-generator",
    description: "Generate placeholder text for your designs and prototypes.",
  },
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Text",
    path: "/tools/markdown-live-preview",
    description: "Write and preview Markdown in real-time.",
  },
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
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Design",
    path: "/tools/color-picker",
    description: "Select colors and get their HEX, RGB, HSL values.",
  },
  {
    slug: "css-shadow-gradient-generator",
    name: "CSS Shadow & Gradient Generator",
    category: "Design",
    path: "/tools/css-shadow-gradient-generator",
    description: "Generate complex CSS box shadows and gradients.",
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer & Viewer",
    category: "Design",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize SVG files and preview their rendering.",
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Date & Time",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice-versa.",
  },
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
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer & Converter",
    category: "Data & API",
    path: "/tools/csv-viewer-converter",
    description: "View and convert CSV data to other formats.",
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Development",
    path: "/tools/regex-tester-generator",
    description: "Test and build regular expressions with ease.",
  },
  {
    slug: "sql-playground",
    name: "SQL Playground",
    category: "Data & API",
    path: "/tools/sql-playground",
    description: "Execute SQL queries against an in-memory SQLite database.",
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
  "Encoders / Decoders": Code,
  Generators: Sparkles,
  Text: FileText,
  Formatters: Layers,
  Design: Palette,
  "Date & Time": Calendar,
  Network: Terminal,
  "Data & API": Table, // Using Table icon for Data & API
  Development: Settings,
};