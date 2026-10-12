import {
  Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search, Database
} from 'lucide-react';
import React from 'react';

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
  icon?: React.ElementType; // Optional icon property
}

export const tools: Tool[] = [
  // Core Tools
  {
    slug: "favorites",
    name: "Favorites",
    category: "Core",
    path: "/tools/favorites",
    description: "Your most loved and frequently used tools.",
    icon: Star,
  },
  {
    slug: "history",
    name: "History",
    category: "Core",
    path: "/tools/history",
    description: "Recently used tools for quick access.",
    icon: History,
  },

  // Converters & Encoders
  {
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder / Decoder",
    category: "Converters & Encoders",
    path: "/tools/base64-encoder-decoder",
    description: "Encode and decode Base64 strings.",
    icon: Binary,
  },
  {
    slug: "base64-image-encoder-decoder",
    name: "Base64 Image Encoder / Decoder",
    category: "Converters & Encoders",
    path: "/tools/base64-image-encoder-decoder",
    description: "Encode and decode images to/from Base64.",
    icon: FileText,
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    category: "Converters & Encoders",
    path: "/tools/url-encoder-decoder",
    description: "Encode and decode URLs.",
    icon: Code,
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Converters & Encoders",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice-versa.",
    icon: Clock,
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Converters & Encoders",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools",
    description: "Convert text between different cases (e.g., camelCase, snake_case).",
    icon: Code,
  },

  // Generators
  {
    slug: "hash-generator",
    name: "Hash Generator",
    category: "Generators",
    path: "/tools/hash-generator",
    description: "Generate various cryptographic hashes (MD5, SHA1, SHA256, etc.).",
    icon: Hash,
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    category: "Generators",
    path: "/tools/day-6-implement-uuid-password-generator-tools",
    description: "Generate universally unique identifiers (UUIDs).",
    icon: Key,
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "Generators",
    path: "/tools/day-6-implement-uuid-password-generator-tools",
    description: "Generate strong, random passwords.",
    icon: Shield,
  },
  {
    slug: "cron-expression-builder",
    name: "Cron Expression Builder",
    category: "Generators",
    path: "/tools/cron-expression-builder",
    description: "Build and visualize cron job schedules.",
    icon: Calendar,
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Generators",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools",
    description: "Generate placeholder text for your designs and layouts.",
    icon: FileText,
  },
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator",
    category: "Generators",
    path: "/tools/meta-tag-generator",
    description: "Generate essential meta tags for SEO and social media.",
    icon: Code,
  },
  {
    slug: "robots-txt-generator",
    name: "Robots.txt Generator",
    category: "Generators",
    path: "/tools/robots-txt-generator",
    description: "Create a robots.txt file to manage crawler access.",
    icon: FileText,
  },
  {
    slug: "sitemap-xml-generator",
    name: "Sitemap XML Generator",
    category: "Generators",
    path: "/tools/sitemap-xml-generator",
    description: "Generate an XML sitemap for your website.",
    icon: FileText,
  },
  {
    slug: "css-shadow-generator",
    name: "CSS Shadow Generator",
    category: "Generators",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools",
    description: "Generate complex CSS box and text shadows.",
    icon: Palette,
  },
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Generator",
    category: "Generators",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools",
    description: "Create beautiful CSS linear and radial gradients.",
    icon: Palette,
  },

  // Formatters & Validators
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Formatters & Validators",
    path: "/tools/json-formatter",
    description: "Format and validate JSON data.",
    icon: Code,
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    category: "Formatters & Validators",
    path: "/tools/xml-formatter",
    description: "Format and validate XML data.",
    icon: Code,
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Formatters & Validators",
    path: "/tools/yaml-formatter",
    description: "Format and validate YAML data.",
    icon: Code,
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "Formatters & Validators",
    path: "/tools/sql-formatter",
    description: "Format SQL queries for readability.",
    icon: Code,
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Formatters & Validators",
    path: "/tools/html-formatter",
    description: "Format HTML code for better readability.",
    icon: Code,
  },
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Formatters & Validators",
    path: "/tools/markdown-live-preview",
    description: "Write Markdown and see the live HTML preview.",
    icon: FileText,
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Formatters & Validators",
    path: "/tools/jwt-decoder",
    description: "Decode JWT tokens to inspect header, payload, and signature.",
    icon: Shield,
  },
  {
    slug: "hash-verifier",
    name: "Hash Verifier",
    category: "Formatters & Validators",
    path: "/tools/hash-verifier",
    description: "Verify the integrity of files using hash comparisons.",
    icon: Hash,
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Formatters & Validators",
    path: "/tools/regex-tester-generator",
    description: "Test and generate regular expressions.",
    icon: Search,
  },

  // Web Utilities
  {
    slug: "http-header-viewer",
    name: "HTTP Header Viewer",
    category: "Web Utilities",
    path: "/tools/http-header-viewer",
    description: "View HTTP headers for any URL.",
    icon: Layers,
  },
  {
    slug: "websocket-tester",
    name: "WebSocket Tester",
    category: "Web Utilities",
    path: "/tools/websocket-tester",
    description: "Connect to WebSocket servers and send/receive messages.",
    icon: Terminal,
  },
  {
    slug: "meta-tag-og-preview",
    name: "Meta Tag & OG Preview",
    category: "Web Utilities",
    path: "/tools/meta-tag-generator-og-preview",
    description: "Preview how your website appears on social media.",
    icon: Code,
  },

  // Image & Color Tools
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Image & Color Tools",
    path: "/tools/color-picker",
    description: "Pick colors and convert between formats (HEX, RGB, HSL).",
    icon: Palette,
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer & Viewer",
    category: "Image & Color Tools",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize SVG files and preview their rendering.",
    icon: Sparkles,
  },

  // Data & CSV
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer & Converter",
    category: "Data & CSV",
    path: "/tools/csv-viewer-converter",
    description: "View, edit, and convert CSV data.",
    icon: FileText,
  },

  // Development
  {
    slug: "sql-playground",
    name: "SQL Playground",
    category: "Development",
    path: "/tools/sql-playground",
    description: "Execute and test SQL queries against a mock in-memory database.",
    icon: Database,
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