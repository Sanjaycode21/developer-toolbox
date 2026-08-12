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
    description: "Beautify or minify JSON data for better readability or smaller size.",
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    category: "Formatting & Minification",
    path: "/tools/xml-formatter",
    description: "Format or minify XML data for improved structure and readability.",
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Formatting & Minification",
    path: "/tools/html-formatter",
    description: "Clean up and format HTML code for better organization and readability.",
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "Formatting & Minification",
    path: "/tools/sql-formatter",
    description: "Format SQL queries for enhanced readability and debugging.",
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Formatting & Minification",
    path: "/tools/yaml-formatter",
    description: "Format or minify YAML data for improved structure and readability.",
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
    description: "Convert text between different cases (e.g., camelCase, snake_case, kebab-case).",
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
    path: "/tools/uuid-password-generator",
    description: "Generate strong passwords and unique UUIDs.",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Generators",
    path: "/tools/lorem-ipsum-generator",
    description: "Generate placeholder text for your designs and prototypes.",
  },
  {
    slug: "css-shadow-gradient-generator",
    name: "CSS Shadow & Gradient Generator",
    category: "Generators",
    path: "/tools/css-shadow-gradient-generator",
    description: "Generate complex CSS box shadows and beautiful gradients with ease.",
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
    description: "Generate an XML sitemap for better search engine indexing.",
  },
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator & OG Preview",
    category: "SEO",
    path: "/tools/meta-tag-generator",
    description: "Generate essential meta tags and preview Open Graph & Twitter cards for SEO and social sharing.",
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
    description: "Test and generate regular expressions for pattern matching.",
  },
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Web Utilities",
    path: "/tools/markdown-live-preview",
    description: "Write and preview Markdown in real-time.",
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

  // Cryptography
  {
    slug: "hash-verifier",
    name: "Hash Verifier",
    category: "Cryptography",
    path: "/tools/hash-verifier",
    description: "Verify the integrity of files using various hash algorithms.",
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

export const toolIcons: { [key: string]: React.ElementType } = {
  "Formatting & Minification": Code,
  "Converters": Layers,
  "Generators": Sparkles,
  "Web Utilities": Terminal,
  "Cryptography": Shield,
  "SEO": Search,
  "Special": Star,
};

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

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(tool => tool.slug === slug);
}