import { Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search } from "lucide-react";

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
}

export const tools: Tool[] = [
  // Data & Code
  {
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder / Decoder",
    category: "Data & Code",
    path: "/tools/base64-encoder-decoder",
    description: "Encode and decode Base64 strings.",
  },
  {
    slug: "base64-image-encoder-decoder",
    name: "Base64 Image Encoder / Decoder",
    category: "Data & Code",
    path: "/tools/base64-image-encoder-decoder",
    description: "Encode and decode images to/from Base64.",
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer & Converter",
    category: "Data & Code",
    path: "/tools/csv-viewer-converter",
    description: "View, analyze, and convert CSV data.",
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    category: "Data & Code",
    path: "/tools/hash-generator",
    description: "Generate various cryptographic hashes (MD5, SHA1, SHA256, etc.).",
  },
  {
    slug: "hash-verifier",
    name: "Hash Verifier",
    category: "Data & Code",
    path: "/tools/hash-verifier",
    description: "Verify the integrity of data using hash comparisons.",
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Data & Code",
    path: "/tools/json-formatter",
    description: "Format and validate JSON data.",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Data & Code",
    path: "/tools/jwt-decoder",
    description: "Decode and inspect JSON Web Tokens.",
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "Data & Code",
    path: "/tools/sql-formatter",
    description: "Format SQL queries for readability.",
  },
  {
    slug: "sql-playground",
    name: "SQL Playground",
    category: "Data & Code",
    path: "/tools/sql-playground",
    description: "Execute and test SQL queries against a mock database.",
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    category: "Data & Code",
    path: "/tools/url-encoder-decoder",
    description: "Encode and decode URL components.",
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    category: "Data & Code",
    path: "/tools/xml-formatter",
    description: "Format and validate XML data.",
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Data & Code",
    path: "/tools/yaml-formatter",
    description: "Format and validate YAML data.",
  },

  // Design
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Design",
    path: "/tools/color-picker",
    description: "Select and convert colors.",
  },
  {
    slug: "css-shadow-gradient-generator",
    name: "CSS Shadow & Gradient Generator",
    category: "Design",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools",
    description: "Generate CSS shadows and gradients.",
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer & Viewer",
    category: "Design",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize and view SVG files.",
  },

  // Generators
  {
    slug: "cron-expression-builder",
    name: "Cron Expression Builder",
    category: "Generators",
    path: "/tools/cron-expression-builder",
    description: "Build and visualize cron job schedules.",
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
    description: "Create a robots.txt file for web crawlers.",
  },
  {
    slug: "sitemap-xml-generator",
    name: "Sitemap XML Generator",
    category: "Generators",
    path: "/tools/sitemap-xml-generator",
    description: "Generate an XML sitemap for your website.",
  },
  {
    slug: "uuid-password-generator",
    name: "UUID & Password Generator",
    category: "Generators",
    path: "/tools/day-6-implement-uuid-password-generator-tools",
    description: "Generate UUIDs and strong, random passwords.",
  },

  // SEO
  {
    slug: "meta-tag-generator-og-preview",
    name: "Open Graph Preview",
    category: "SEO",
    path: "/tools/meta-tag-generator-og-preview",
    description: "Preview Open Graph meta tags for social media.",
  },

  // Text
  {
    slug: "case-lorem-generator",
    name: "Case Converter & Lorem Ipsum",
    category: "Text",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools",
    description: "Convert text case and generate lorem ipsum.",
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Text",
    path: "/tools/html-formatter",
    description: "Format and beautify HTML code.",
  },
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Text",
    path: "/tools/markdown-live-preview",
    description: "Write Markdown and see the live preview.",
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Text",
    path: "/tools/regex-tester-generator",
    description: "Test and build regular expressions.",
  },

  // Time
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Time",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert between human-readable dates and Unix timestamps.",
  },

  // Utilities
  {
    slug: "http-header-viewer",
    name: "HTTP Header Viewer",
    category: "Utilities",
    path: "/tools/http-header-viewer",
    description: "View HTTP headers of any URL.",
  },
  {
    slug: "websocket-tester",
    name: "WebSocket Tester",
    category: "Utilities",
    path: "/tools/websocket-tester",
    description: "Test WebSocket connections and send/receive messages.",
  },
];

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
  return tools.find(tool => tool.slug === slug);
}