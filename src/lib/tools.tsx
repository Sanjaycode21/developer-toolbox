import { Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search } from 'lucide-react';

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
    description: "Beautify or minify XML data for better readability or smaller file size.",
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Formatting & Minification",
    path: "/tools/html-formatter",
    description: "Beautify or minify HTML code for better readability or smaller file size.",
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
    description: "Beautify or minify YAML data for better readability or smaller file size.",
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
    description: "Encode and decode images to/from Base64 data URIs.",
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer & Converter",
    category: "Converters",
    path: "/tools/csv-viewer-converter",
    description: "View, edit, and convert CSV data to other formats like JSON or XML.",
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Converters",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice-versa.",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Converters",
    path: "/tools/case-converter",
    description: "Convert text between different cases: lowercase, uppercase, camelCase, PascalCase, snake_case, kebab-case, etc.",
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
    description: "Generate universally unique identifiers (UUIDs) and strong, random passwords.",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Generators",
    path: "/tools/lorem-ipsum-generator",
    description: "Generate placeholder text for your designs and prototypes.",
  },
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator & OG Preview",
    category: "Generators",
    path: "/tools/meta-tag-generator",
    description: "Generate essential meta tags for SEO and social media, and preview how your content will appear on platforms like Facebook and Twitter.",
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
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    category: "Web Utilities",
    path: "/tools/url-encoder-decoder",
    description: "Encode and decode URLs to handle special characters safely.",
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Web Utilities",
    path: "/tools/regex-tester-generator",
    description: "Test and generate regular expressions with real-time matching.",
  },
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Web Utilities",
    path: "/tools/markdown-live-preview",
    description: "Write Markdown and see the rendered HTML in real-time.",
  },
  {
    slug: "robots-txt-generator",
    name: "Robots.txt Generator",
    category: "Web Utilities",
    path: "/tools/robots-txt-generator",
    description: "Create a robots.txt file to guide search engine crawlers.",
  },
  {
    slug: "sitemap-xml-generator",
    name: "Sitemap XML Generator",
    category: "Web Utilities",
    path: "/tools/sitemap-xml-generator",
    description: "Generate an XML sitemap for your website to help search engines discover your pages.",
  },
  // Design & Graphics
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Design & Graphics",
    path: "/tools/color-picker",
    description: "Select colors and get their HEX, RGB, HSL, and other formats.",
  },
  {
    slug: "css-shadow-gradient-generator",
    name: "CSS Shadow & Gradient Generator",
    category: "Design & Graphics",
    path: "/tools/css-shadow-gradient-generator",
    description: "Generate complex CSS box-shadows, text-shadows, and gradients with live preview.",
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer & Viewer",
    category: "Design & Graphics",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize SVG files for smaller size and view their content.",
  },
  // Security
  {
    slug: "hash-verifier",
    name: "Hash Verifier",
    category: "Security",
    path: "/tools/hash-verifier",
    description: "Verify the integrity of files or text using various hash algorithms.",
  },
  // Other
  {
    slug: "favorites",
    name: "Favorites",
    category: "Other",
    path: "/tools/favorites",
    description: "Your most loved tools, easily accessible.",
  },
  {
    slug: "history",
    name: "History",
    category: "Other",
    path: "/tools/history",
    description: "Recently used tools for quick navigation.",
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

export function searchTools(query: string): Tool[] {
  const lowerCaseQuery = query.toLowerCase();
  return tools.filter(tool =>
    tool.name.toLowerCase().includes(lowerCaseQuery) ||
    tool.description.toLowerCase().includes(lowerCaseQuery) ||
    tool.category.toLowerCase().includes(lowerCaseQuery)
  );
}