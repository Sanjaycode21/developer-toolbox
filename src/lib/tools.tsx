import { Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search } from "lucide-react";

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
}

export const tools: Tool[] = [
  // --- Core Tools ---
  {
    slug: "favorites",
    name: "Favorites",
    category: "Core",
    path: "/tools/favorites",
    description: "Your most loved tools, all in one place.",
  },
  {
    slug: "history",
    name: "History",
    category: "Core",
    path: "/tools/history",
    description: "Recently used tools for quick access.",
  },

  // --- Converters & Encoders ---
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
    description: "Encode and decode images to/from Base64.",
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Converters & Encoders",
    path: "/tools/unix-timestamp-epoch-converter", // Corrected path
    description: "Convert Unix timestamps to human-readable dates and vice-versa.",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Converters & Encoders",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools",
    description: "Convert text to various cases: uppercase, lowercase, title case, etc.",
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer / Converter",
    category: "Converters & Encoders",
    path: "/tools/csv-viewer-converter",
    description: "View, edit, and convert CSV data.",
  },

  // --- Generators ---
  {
    slug: "hash-generator",
    name: "Hash Generator",
    category: "Generators",
    path: "/tools/hash-generator",
    description: "Generate MD5, SHA1, SHA256, SHA512 hashes.",
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    category: "Generators",
    path: "/tools/day-6-implement-uuid-password-generator-tools",
    description: "Generate universally unique identifiers (UUIDs).",
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "Generators",
    path: "/tools/day-6-implement-uuid-password-generator-tools",
    description: "Create strong, random passwords.",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Generators",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools",
    description: "Generate placeholder text for your designs.",
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
    slug: "meta-tag-generator", // NEW TOOL
    name: "Meta Tag Generator & OG Preview", // NEW TOOL
    category: "Generators", // NEW TOOL
    path: "/tools/meta-tag-generator", // NEW TOOL
    description: "Generate SEO and social media meta tags with a live preview.", // NEW TOOL
  },

  // --- Formatters ---
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
    slug: "css-formatter",
    name: "CSS Formatter",
    category: "Formatters",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools",
    description: "Beautify or minify CSS code.",
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

  // --- Web Utilities ---
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Web Utilities",
    path: "/tools/jwt-decoder", // Corrected path
    description: "Decode JSON Web Tokens to inspect header, payload, and signature.",
  },
  // Removed "url-encoder-decoder" as it's not implemented and points to a wrong path.
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Web Utilities",
    path: "/tools/regex-tester-generator",
    description: "Test and generate regular expressions.",
  },
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Web Utilities",
    path: "/tools/markdown-live-preview",
    description: "Write Markdown and see the live HTML preview.",
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer & Viewer",
    category: "Web Utilities",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize SVG files and preview them.",
  },

  // --- Design & Color ---
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Design & Color",
    path: "/tools/color-picker",
    description: "Select colors and get their HEX, RGB, HSL values.",
  },
  {
    slug: "css-shadow-generator",
    name: "CSS Shadow Generator",
    category: "Design & Color",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools",
    description: "Generate custom CSS box and text shadows.",
  },
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Generator",
    category: "Design & Color",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools",
    description: "Create beautiful CSS linear and radial gradients.",
  },

  // --- Security ---
  {
    slug: "hash-verifier",
    name: "Hash Verifier",
    category: "Security",
    path: "/tools/hash-verifier",
    description: "Verify the integrity of files using hash comparison.",
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