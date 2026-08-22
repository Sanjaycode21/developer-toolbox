import { Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search } from "lucide-react";

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
}

export const tools: Tool[] = [
  // Formatting & Linting
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Formatting & Linting",
    path: "/tools/json-formatter",
    description: "Beautify and validate JSON data.",
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    category: "Formatting & Linting",
    path: "/tools/xml-formatter",
    description: "Format and pretty-print XML documents.",
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Formatting & Linting",
    path: "/tools/html-formatter",
    description: "Clean up and format HTML code.",
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "Formatting & Linting",
    path: "/tools/sql-formatter",
    description: "Beautify and format SQL queries.",
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Formatting & Linting",
    path: "/tools/yaml-formatter",
    description: "Format and validate YAML data.",
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
    description: "Convert images to Base64 and vice-versa.",
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Converters",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and back.",
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer & Converter",
    category: "Converters",
    path: "/tools/csv-viewer-converter",
    description: "View, edit, and convert CSV data.",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Converters",
    path: "/tools/case-converter",
    description: "Convert text between different cases (e.g., camelCase, snake_case).",
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
    description: "Create strong, random passwords.",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Generators",
    path: "/tools/lorem-ipsum-generator",
    description: "Generate placeholder text for your designs.",
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
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator & OG Preview",
    category: "Generators",
    path: "/tools/meta-tag-generator",
    description: "Generate SEO-friendly meta tags and preview Open Graph cards.",
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
    description: "Generate an XML sitemap for your website.",
  },
  // Web Utilities
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Web Utilities",
    path: "/tools/jwt-decoder",
    description: "Decode and inspect JSON Web Tokens.",
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    category: "Web Utilities",
    path: "/tools/url-encoder-decoder",
    description: "Encode and decode URL components.",
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Web Utilities",
    path: "/tools/regex-tester-generator",
    description: "Test and build regular expressions.",
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
    description: "Optimize SVG files and preview their content.",
  },
  {
    slug: "color-picker",
    category: "Web Utilities",
    name: "Color Picker",
    path: "/tools/color-picker",
    description: "Select colors and get their HEX, RGB, HSL values.",
  },
  // Cryptography
  {
    slug: "hash-verifier",
    name: "Hash Verifier",
    category: "Cryptography",
    path: "/tools/hash-verifier",
    description: "Verify the integrity of files using hash comparisons.",
  },
  // DevForge
  {
    slug: "favorites",
    name: "Favorites",
    category: "DevForge",
    path: "/tools/favorites",
    description: "Your most loved tools, all in one place.",
  },
  {
    slug: "history",
    name: "History",
    category: "DevForge",
    path: "/tools/history",
    description: "Recently used tools.",
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
  return tools.find((tool) => tool.slug === slug);
}

export const toolIcons: Record<string, React.ElementType> = {
  "json-formatter": Code,
  "xml-formatter": Code,
  "html-formatter": Code,
  "sql-formatter": Terminal,
  "yaml-formatter": Code,
  "base64-encoder-decoder": Binary,
  "base64-image-encoder-decoder": Binary,
  "unix-timestamp-epoch-converter": Clock,
  "csv-viewer-converter": FileText,
  "case-converter": FileText,
  "hash-generator": Hash,
  "uuid-generator": Key,
  "password-generator": Shield,
  "lorem-ipsum-generator": Sparkles,
  "css-shadow-generator": Palette,
  "css-gradient-generator": Palette,
  "meta-tag-generator": Layers, // Using Layers for meta tags
  "robots-txt-generator": FileText,
  "sitemap-xml-generator": FileText,
  "jwt-decoder": Key,
  "url-encoder-decoder": Code, // Using Code for URL encoder/decoder
  "regex-tester-generator": Search,
  "markdown-live-preview": FileText,
  "svg-optimizer-viewer": FileText,
  "color-picker": Palette,
  "hash-verifier": Shield,
  "favorites": Star,
  "history": History,
};