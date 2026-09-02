import {
  Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search, Table,
} from 'lucide-react';

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
}

export const tools: Tool[] = [
  // Favorites & History
  {
    slug: "favorites",
    name: "Favorites",
    category: "General",
    path: "/tools/favorites",
    description: "Your most loved and frequently used tools.",
  },
  {
    slug: "history",
    name: "History",
    category: "General",
    path: "/tools/history",
    description: "Recently used tools for quick access.",
  },

  // Converters & Encoders
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
    description: "Convert images to Base64 and vice-versa.",
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    category: "Converters & Encoders",
    path: "/tools/url-encoder-decoder",
    description: "Encode and decode URL components.",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Converters & Encoders",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools", // This path needs to be updated if a dedicated page is created. Assuming it's part of a multi-tool page for now.
    description: "Convert text between different casing styles.",
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Converters & Encoders",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice-versa.",
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer / Converter",
    category: "Converters & Encoders",
    path: "/tools/csv-viewer-converter",
    description: "View, format, and convert CSV data.",
  },

  // Text & String
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Text & String",
    path: "/tools/markdown-live-preview",
    description: "Write Markdown and see the live preview.",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Text & String",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools", // This path needs to be updated if a dedicated page is created. Assuming it's part of a multi-tool page for now.
    description: "Generate placeholder text for your designs.",
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Text & String",
    path: "/tools/regex-tester-generator",
    description: "Test and generate regular expressions.",
  },

  // Code & Formatting
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Code & Formatting",
    path: "/tools/json-formatter",
    description: "Beautify or minify JSON data.",
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    category: "Code & Formatting",
    path: "/tools/xml-formatter",
    description: "Beautify or minify XML data.",
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Code & Formatting",
    path: "/tools/html-formatter",
    description: "Beautify or minify HTML code.",
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "Code & Formatting",
    path: "/tools/sql-formatter",
    description: "Beautify or minify SQL queries.",
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Code & Formatting",
    path: "/tools/yaml-formatter",
    description: "Beautify or minify YAML data.",
  },
  {
    slug: "css-shadow-gradient-generator",
    name: "CSS Shadow & Gradient Generator",
    category: "Code & Formatting",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools", // This path needs to be updated if a dedicated page is created.
    description: "Generate complex CSS shadows and gradients.",
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer & Viewer",
    category: "Code & Formatting",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize and view SVG files.",
  },

  // Generators
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    category: "Generators",
    path: "/tools/day-6-implement-uuid-password-generator-tools", // This path needs to be updated if a dedicated page is created.
    description: "Generate universally unique identifiers (UUIDs).",
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "Generators",
    path: "/tools/day-6-implement-uuid-password-generator-tools", // This path needs to be updated if a dedicated page is created.
    description: "Generate strong, random passwords.",
  },
  {
    slug: "cron-expression-builder",
    name: "Cron Expression Builder",
    category: "Generators",
    path: "/tools/cron-expression-builder",
    description: "Build and understand cron job schedules.",
  },
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator",
    category: "Generators",
    path: "/tools/meta-tag-generator",
    description: "Generate essential meta tags for SEO.",
  },
  {
    slug: "meta-tag-generator-og-preview",
    name: "Open Graph Meta Tag Generator & Preview",
    category: "Generators",
    path: "/tools/meta-tag-generator-og-preview",
    description: "Generate Open Graph tags and preview how your content will look when shared on social media.",
  },
  {
    slug: "robots-txt-generator",
    name: "Robots.txt Generator",
    category: "Generators",
    path: "/tools/robots-txt-generator",
    description: "Create a robots.txt file to manage web crawler access.",
  },
  {
    slug: "sitemap-xml-generator",
    name: "Sitemap XML Generator",
    category: "Generators",
    path: "/tools/sitemap-xml-generator",
    description: "Generate an XML sitemap for your website.",
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Generators",
    path: "/tools/color-picker",
    description: "Select and convert colors with various formats.",
  },

  // Security & Hashing
  {
    slug: "hash-generator",
    name: "Hash Generator",
    category: "Security & Hashing",
    path: "/tools/hash-generator",
    description: "Generate various cryptographic hashes (MD5, SHA1, SHA256, etc.).",
  },
  {
    slug: "hash-verifier",
    name: "Hash Verifier",
    category: "Security & Hashing",
    path: "/tools/hash-verifier",
    description: "Verify the integrity of files or text using hash comparison.",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Security & Hashing",
    path: "/tools/jwt-decoder",
    description: "Decode and inspect JSON Web Tokens.",
  },

  // Network & API
  {
    slug: "http-header-viewer",
    name: "HTTP Header Viewer",
    category: "Network & API",
    path: "/tools/http-header-viewer",
    description: "View HTTP headers of any URL.",
  },
  {
    slug: "websocket-tester",
    name: "WebSocket Tester",
    category: "Network & API",
    path: "/tools/websocket-tester",
    description: "Connect to and test WebSocket endpoints.",
  },
  // New tool
  {
    slug: "sql-playground",
    name: "SQL Playground",
    category: "Data & API",
    path: "/tools/sql-playground",
    description: "Execute and test SQL queries against a mock database.",
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
  "General": Layers,
  "Converters & Encoders": Binary,
  "Text & String": FileText,
  "Code & Formatting": Code,
  "Generators": Sparkles,
  "Security & Hashing": Shield,
  "Network & API": Terminal,
  "Data & API": Table,
};