import { Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search } from 'lucide-react';

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
    description: "Format SQL queries for better readability.",
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    category: "Formatting & Linting",
    path: "/tools/xml-formatter",
    description: "Beautify and format XML data.",
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Formatting & Linting",
    path: "/tools/yaml-formatter",
    description: "Format and validate YAML files.",
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
    slug: "csv-viewer-converter",
    name: "CSV Viewer / Converter",
    category: "Converters",
    path: "/tools/csv-viewer-converter",
    description: "View, edit, and convert CSV data.",
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
    description: "Convert text between different casing styles (e.g., camelCase, snake_case).",
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
    description: "Generate placeholder text for your designs and prototypes.",
  },
  {
    slug: "css-shadow-generator",
    name: "CSS Shadow Generator",
    category: "Generators",
    path: "/tools/css-shadow-generator",
    description: "Generate complex CSS box and text shadows with live preview.",
  },
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Generator",
    category: "Generators",
    path: "/tools/css-gradient-generator",
    description: "Create beautiful CSS linear and radial gradients.",
  },
  // SEO Tools
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator & OG Preview",
    category: "SEO",
    path: "/tools/meta-tag-generator",
    description: "Generate meta tags for SEO and social media, with Open Graph and Twitter card previews.",
  },
  {
    slug: "robots-txt-generator",
    name: "Robots.txt Generator",
    category: "SEO",
    path: "/tools/robots-txt-generator",
    description: "Create a robots.txt file to manage crawler access.",
  },
  {
    slug: "sitemap-xml-generator",
    name: "Sitemap XML Generator",
    category: "SEO",
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
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Web Utilities",
    path: "/tools/markdown-live-preview",
    description: "Write Markdown and see the rendered HTML in real-time.",
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Web Utilities",
    path: "/tools/regex-tester-generator",
    description: "Test and build regular expressions.",
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer & Viewer",
    category: "Web Utilities",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize SVG files and preview their rendering.",
  },
  // Cryptography
  {
    slug: "hash-verifier",
    name: "Hash Verifier",
    category: "Cryptography",
    path: "/tools/hash-verifier",
    description: "Verify the integrity of files using hash comparisons.",
  },
  // Color Tools
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Color Tools",
    path: "/tools/color-picker",
    description: "Select colors and get their HEX, RGB, HSL values.",
  },
  // Other
  {
    slug: "favorites",
    name: "Favorites",
    category: "Other",
    path: "/tools/favorites",
    description: "Your favorite tools for quick access.",
  },
  {
    slug: "history",
    name: "History",
    category: "Other",
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

export const categoryIcons: Record<string, React.ElementType> = {
  "Formatting & Linting": Code,
  "Converters": Binary,
  "Generators": Sparkles,
  "SEO": Search,
  "Web Utilities": Terminal,
  "Cryptography": Shield,
  "Color Tools": Palette,
  "Other": Layers,
};