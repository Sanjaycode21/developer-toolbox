import { Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search } from "lucide-react";

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
    description: "Beautify or minify JSON data for better readability or smaller file size.",
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    category: "Formatting & Minification",
    path: "/tools/xml-formatter",
    description: "Format or minify XML data for improved readability and structure.",
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Formatting & Minification",
    path: "/tools/html-formatter",
    description: "Clean up and format HTML code for consistency and readability.",
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "Formatting & Minification",
    path: "/tools/sql-formatter",
    description: "Format SQL queries for better readability and debugging.",
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Formatting & Minification",
    path: "/tools/yaml-formatter",
    description: "Format or convert YAML data for improved readability and structure.",
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer & Viewer",
    category: "Formatting & Minification",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize SVG files to reduce size and view their content.",
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
    description: "Encode and decode images to/from Base64 strings.",
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
    path: "/tools/case-converter",
    description: "Convert text between various case formats (e.g., camelCase, snake_case).",
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
    description: "Generate various cryptographic hashes (MD5, SHA1, SHA256, etc.) from text.",
  },
  {
    slug: "uuid-password-generator",
    name: "UUID & Password Generator",
    category: "Generators",
    path: "/tools/uuid-password-generator",
    description: "Generate universally unique identifiers (UUIDs) and strong passwords.",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Generators",
    path: "/tools/lorem-ipsum-generator",
    description: "Generate placeholder text for your designs and layouts.",
  },
  {
    slug: "css-shadow-gradient-generator",
    name: "CSS Shadow & Gradient Generator",
    category: "Generators",
    path: "/tools/css-shadow-gradient-generator",
    description: "Generate complex CSS box shadows and gradient codes visually.",
  },
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator & OG Preview",
    category: "SEO & Web",
    path: "/tools/meta-tag-generator",
    description: "Generate essential meta tags and preview Open Graph content for SEO and social media.",
  },
  {
    slug: "robots-txt-generator",
    name: "Robots.txt Generator",
    category: "SEO & Web",
    path: "/tools/robots-txt-generator",
    description: "Create a robots.txt file to manage search engine crawling.",
  },
  {
    slug: "sitemap-xml-generator",
    name: "Sitemap XML Generator",
    category: "SEO & Web",
    path: "/tools/sitemap-xml-generator",
    description: "Generate an XML sitemap for your website to help search engines index your pages.",
  },

  // Web Utilities
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Web Utilities",
    path: "/tools/jwt-decoder",
    description: "Decode JSON Web Tokens to inspect their header, payload, and verify signature.",
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    category: "Web Utilities",
    path: "/tools/url-encoder-decoder",
    description: "Encode and decode URL components.",
  },
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Web Utilities",
    path: "/tools/markdown-live-preview",
    description: "Write and preview Markdown in real-time.",
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Web Utilities",
    path: "/tools/regex-tester-generator",
    description: "Test and generate regular expressions with a live preview.",
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Web Utilities",
    path: "/tools/color-picker",
    description: "Select colors and get their HEX, RGB, HSL, and other formats.",
  },

  // Cryptography
  {
    slug: "hash-verifier",
    name: "Hash Verifier",
    category: "Cryptography",
    path: "/tools/hash-verifier",
    description: "Verify the integrity of text or files using various hash algorithms.",
  },

  // DevForge Specific
  {
    slug: "favorites",
    name: "Favorites",
    category: "DevForge",
    path: "/tools/favorites",
    description: "Your most loved and frequently used tools, all in one place.",
  },
  {
    slug: "history",
    name: "History",
    category: "DevForge",
    path: "/tools/history",
    description: "Recently used tools for quick access.",
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

export const categoryIcons: Record<string, React.ElementType> = {
  "Formatting & Minification": Code,
  "Converters": Layers,
  "Generators": Sparkles,
  "Web Utilities": Terminal,
  "Cryptography": Shield,
  "SEO & Web": Search,
  "DevForge": Settings,
};