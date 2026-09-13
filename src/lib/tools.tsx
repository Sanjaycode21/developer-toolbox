import { Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search, Table, Database as DatabaseIcon } from "lucide-react";

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
}

export const tools: Tool[] = [
  {
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder / Decoder",
    category: "Encoders / Decoders",
    path: "/tools/base64-encoder-decoder",
    description: "Encode and decode Base64 strings.",
  },
  {
    slug: "base64-image-encoder-decoder",
    name: "Base64 Image Encoder / Decoder",
    category: "Encoders / Decoders",
    path: "/tools/base64-image-encoder-decoder",
    description: "Encode and decode images to/from Base64.",
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    category: "Encoders / Decoders",
    path: "/tools/url-encoder-decoder",
    description: "Encode and decode URL components.",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Security",
    path: "/tools/jwt-decoder",
    description: "Decode JSON Web Tokens to inspect header, payload, and signature.",
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    category: "Security",
    path: "/tools/hash-generator",
    description: "Generate various cryptographic hashes (MD5, SHA1, SHA256, SHA512).",
  },
  {
    slug: "hash-verifier",
    name: "Hash Verifier",
    category: "Security",
    path: "/tools/hash-verifier",
    description: "Verify the integrity of data against a given hash.",
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Date & Time",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice versa.",
  },
  {
    slug: "cron-expression-builder",
    name: "Cron Expression Builder",
    category: "Date & Time",
    path: "/tools/cron-expression-builder",
    description: "Build and visualize cron job schedules.",
  },
  {
    slug: "uuid-password-generator",
    name: "UUID & Password Generator",
    category: "Generators",
    path: "/tools/day-6-implement-uuid-password-generator-tools", // Preserving existing path as per instructions
    description: "Generate UUIDs and strong, random passwords.",
  },
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator",
    category: "SEO",
    path: "/tools/meta-tag-generator",
    description: "Generate essential meta tags for SEO.",
  },
  {
    slug: "meta-tag-generator-og-preview",
    name: "Open Graph Previewer",
    category: "SEO",
    path: "/tools/meta-tag-generator-og-preview",
    description: "Preview how your links will appear on social media.",
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
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "Formatters",
    path: "/tools/sql-formatter",
    description: "Beautify or minify SQL queries.",
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Formatters",
    path: "/tools/yaml-formatter",
    description: "Beautify or minify YAML data.",
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer & Converter",
    category: "Formatters",
    path: "/tools/csv-viewer-converter",
    description: "View, edit, and convert CSV data.",
  },
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Text",
    path: "/tools/markdown-live-preview",
    description: "Write Markdown and see the rendered output in real-time.",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Text",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools", // Preserving existing path as per instructions
    description: "Convert text between different casing styles (e.g., camelCase, snake_case).",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Text",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools", // Preserving existing path as per instructions
    description: "Generate placeholder text for your designs and layouts.",
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Text",
    path: "/tools/regex-tester-generator",
    description: "Test regular expressions and generate common patterns.",
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Design",
    path: "/tools/color-picker",
    description: "Select colors and convert between formats (HEX, RGB, HSL).",
  },
  {
    slug: "css-shadow-gradient-generator",
    name: "CSS Shadow & Gradient Generator",
    category: "Design",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools", // Preserving existing path as per instructions
    description: "Generate complex CSS box shadows and gradients.",
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer & Viewer",
    category: "Design",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize SVG files and preview their rendering.",
  },
  {
    slug: "http-header-viewer",
    name: "HTTP Header Viewer",
    category: "Network",
    path: "/tools/http-header-viewer",
    description: "Inspect HTTP headers of any URL.",
  },
  {
    slug: "websocket-tester",
    name: "WebSocket Tester",
    category: "Network",
    path: "/tools/websocket-tester",
    description: "Connect to and test WebSocket endpoints.",
  },
  {
    slug: "sql-playground",
    name: "SQL Playground",
    category: "Database",
    path: "/tools/sql-playground",
    description: "Execute and test SQL queries in an in-browser environment.",
  },
  // Special pages
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

export const categoryIcons: Record<string, React.ElementType> = {
  "Encoders / Decoders": Binary,
  "Security": Shield,
  "Date & Time": Clock,
  "Generators": Sparkles,
  "SEO": Search,
  "Formatters": Code,
  "Text": FileText,
  "Design": Palette,
  "Network": Layers,
  "Database": DatabaseIcon, // Using DatabaseIcon for the new category
  "Special": Star, // Star for favorites/history
};