import {
  Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search,
  Type, AlignLeft, Image, Table, ScrollText, Bot, Link, LayoutDashboard,
} from "lucide-react";

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
}

export const tools: Tool[] = [
  // Formatting & Minification
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Formatting & Minification",
    path: "/tools/json-formatter",
    description: "Beautify or minify JSON data for better readability or smaller size.",
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    category: "Formatting & Minification",
    path: "/tools/xml-formatter",
    description: "Beautify or minify XML data for better readability or smaller size.",
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Formatting & Minification",
    path: "/tools/html-formatter",
    description: "Beautify or minify HTML markup for better readability or smaller size.",
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "Formatting & Minification",
    path: "/tools/sql-formatter",
    description: "Format SQL queries for improved readability and debugging.",
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Formatting & Minification",
    path: "/tools/yaml-formatter",
    description: "Beautify or minify YAML data for better readability or smaller size.",
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
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools", // This path needs to be updated to a dedicated slug
    description: "Convert text between different case formats (e.g., camelCase, snake_case).",
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer & Converter",
    category: "Converters",
    path: "/tools/csv-viewer-converter",
    description: "View, edit, and convert CSV data to other formats like JSON or XML.",
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
    slug: "uuid-password-generator",
    name: "UUID & Password Generator",
    category: "Generators",
    path: "/tools/day-6-implement-uuid-password-generator-tools", // This path needs to be updated to a dedicated slug
    description: "Generate universally unique identifiers (UUIDs) and strong passwords.",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Generators",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools", // This path needs to be updated to a dedicated slug
    description: "Generate placeholder text for your designs and prototypes.",
  },
  {
    slug: "css-shadow-gradient-generator",
    name: "CSS Shadow & Gradient Generator",
    category: "Generators",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools", // This path needs to be updated to a dedicated slug
    description: "Generate complex CSS shadows and gradients with live preview.",
  },
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator & OG Preview",
    category: "Generators",
    path: "/tools/meta-tag-generator",
    description: "Generate essential meta tags for SEO and social media, and preview Open Graph (OG) cards.",
  },
  {
    slug: "robots-txt-generator",
    name: "Robots.txt Generator",
    category: "Generators",
    path: "/tools/robots-txt-generator",
    description: "Create a robots.txt file to manage search engine crawling.",
  },
  {
    slug: "sitemap-xml-generator",
    name: "Sitemap XML Generator",
    category: "Generators",
    path: "/tools/sitemap-xml-generator",
    description: "Generate an XML sitemap for your website to help search engines.",
  },

  // Web Utilities
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Web Utilities",
    path: "/tools/jwt-decoder",
    description: "Decode JWT (JSON Web Token) to inspect its header, payload, and verify signature.",
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Web Utilities",
    path: "/tools/regex-tester-generator",
    description: "Test and generate regular expressions with a live preview.",
  },
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Web Utilities",
    path: "/tools/markdown-live-preview",
    description: "Write Markdown and see the rendered HTML in real-time.",
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer & Viewer",
    category: "Web Utilities",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize SVG files for smaller size and view their content.",
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Web Utilities",
    path: "/tools/color-picker",
    description: "Select colors and get their values in various formats (HEX, RGB, HSL).",
  },
  {
    slug: "hash-verifier",
    name: "Hash Verifier",
    category: "Web Utilities",
    path: "/tools/hash-verifier",
    description: "Verify the integrity of files by comparing their hash values.",
  },

  // Special Pages
  {
    slug: "favorites",
    name: "Favorites",
    category: "Special",
    path: "/tools/favorites",
    description: "Your favorite tools for quick access.",
  },
  {
    slug: "history",
    name: "History",
    category: "Special",
    path: "/tools/history",
    description: "Recently used tools.",
  },
];

// Helper function to get Lucide icon component by slug
export function getToolIcon(slug: string) {
  switch (slug) {
    case "json-formatter":
    case "xml-formatter":
    case "html-formatter":
    case "sql-formatter":
    case "yaml-formatter":
      return Code;
    case "base64-encoder-decoder":
    case "base64-image-encoder-decoder":
    case "case-converter":
      return Binary;
    case "unix-timestamp-epoch-converter":
      return Clock;
    case "csv-viewer-converter":
      return Table;
    case "hash-generator":
    case "hash-verifier":
      return Hash;
    case "uuid-password-generator":
      return Key;
    case "lorem-ipsum-generator":
      return AlignLeft;
    case "css-shadow-gradient-generator":
      return Palette;
    case "meta-tag-generator":
      return FileText;
    case "robots-txt-generator":
      return Bot;
    case "sitemap-xml-generator":
      return Link;
    case "jwt-decoder":
      return Shield;
    case "regex-tester-generator":
      return Search;
    case "markdown-live-preview":
      return ScrollText;
    case "svg-optimizer-viewer":
      return Image;
    case "color-picker":
      return Sparkles;
    case "favorites":
      return Star;
    case "history":
      return History;
    default:
      return Settings; // Default icon for unassigned tools
  }
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

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(tool => tool.slug === slug);
}