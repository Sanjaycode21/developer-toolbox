import {
  Code,
  Star,
  History,
  Palette,
  Layers,
  Settings,
  Terminal,
  Hash,
  Shield,
  FileText,
  Binary,
  Calendar,
  Sparkles,
  Clock,
  Key,
  Search,
  Type,
  List,
  Image,
  Link, // Added Link icon for URL tools
} from "lucide-react";

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
}

export const tools: Tool[] = [
  // Core Tools
  {
    slug: "favorites",
    name: "Favorites",
    category: "Core",
    path: "/tools/favorites",
    description: "Your most loved and frequently used tools.",
  },
  {
    slug: "history",
    name: "History",
    category: "Core",
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
    description: "Encode and decode images to/from Base64.",
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encode/Decode",
    category: "Converters & Encoders",
    path: "/tools/url-encoder-decoder",
    description: "Encode or decode URL components, query strings, and parameters.",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Converters & Encoders",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools", // This path needs to be updated if the tool is moved to its own page
    description: "Convert text between different cases (e.g., camelCase, snake_case).",
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Converters & Encoders",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice versa.",
  },

  // Text & Data
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Text & Data",
    path: "/tools/json-formatter",
    description: "Beautify or minify JSON data.",
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    category: "Text & Data",
    path: "/tools/xml-formatter",
    description: "Beautify or minify XML data.",
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Text & Data",
    path: "/tools/yaml-formatter",
    description: "Beautify or minify YAML data.",
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "Text & Data",
    path: "/tools/sql-formatter",
    description: "Beautify or minify SQL queries.",
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Text & Data",
    path: "/tools/html-formatter",
    description: "Beautify or minify HTML markup.",
  },
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Text & Data",
    path: "/tools/markdown-live-preview",
    description: "Write and preview Markdown in real-time.",
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer / Converter",
    category: "Text & Data",
    path: "/tools/csv-viewer-converter",
    description: "View, edit, and convert CSV data.",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Text & Data",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools", // This path needs to be updated if the tool is moved to its own page
    description: "Generate placeholder text for your designs and prototypes.",
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
    path: "/tools/day-6-implement-uuid-password-generator-tools", // This path needs to be updated if the tool is moved to its own page
    description: "Generate universally unique identifiers (UUIDs).",
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "Generators",
    path: "/tools/day-6-implement-uuid-password-generator-tools", // This path needs to be updated if the tool is moved to its own page
    description: "Create strong, random passwords.",
  },
  {
    slug: "cron-expression-builder",
    name: "Cron Expression Builder",
    category: "Generators",
    path: "/tools/cron-expression-builder",
    description: "Build and visualize cron job schedules.",
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
    name: "Open Graph Meta Tag Generator",
    category: "Generators",
    path: "/tools/meta-tag-generator-og-preview",
    description: "Generate Open Graph meta tags and preview.",
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

  // Web & Security
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Web & Security",
    path: "/tools/jwt-decoder",
    description: "Decode and inspect JSON Web Tokens.",
  },
  {
    slug: "hash-verifier",
    name: "Hash Verifier",
    category: "Web & Security",
    path: "/tools/hash-verifier",
    description: "Verify the integrity of files using hash comparison.",
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Web & Security",
    path: "/tools/regex-tester-generator",
    description: "Test and build regular expressions.",
  },

  // Design & Graphics
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Design & Graphics",
    path: "/tools/color-picker",
    description: "Select colors and get their codes in various formats.",
  },
  {
    slug: "css-shadow-generator",
    name: "CSS Shadow Generator",
    category: "Design & Graphics",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools", // This path needs to be updated if the tool is moved to its own page
    description: "Generate complex CSS box and text shadows.",
  },
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Generator",
    category: "Design & Graphics",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools", // This path needs to be updated if the tool is moved to its own page
    description: "Create beautiful CSS linear and radial gradients.",
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer & Viewer",
    category: "Design & Graphics",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize and preview SVG files.",
  },
];

export const toolIcons: { [key: string]: React.ElementType } = {
  favorites: Star,
  history: History,
  "base64-encoder-decoder": Binary,
  "base64-image-encoder-decoder": Image,
  "url-encoder-decoder": Link,
  "case-converter": Type,
  "unix-timestamp-epoch-converter": Clock,
  "json-formatter": Code,
  "xml-formatter": Layers,
  "yaml-formatter": FileText,
  "sql-formatter": Terminal,
  "html-formatter": Code,
  "markdown-live-preview": FileText,
  "csv-viewer-converter": List,
  "lorem-ipsum-generator": Sparkles,
  "hash-generator": Hash,
  "uuid-generator": Key,
  "password-generator": Shield,
  "cron-expression-builder": Calendar,
  "meta-tag-generator": Settings,
  "meta-tag-generator-og-preview": Settings,
  "robots-txt-generator": Shield,
  "sitemap-xml-generator": Search,
  "jwt-decoder": Key,
  "hash-verifier": Shield,
  "regex-tester-generator": Search,
  "color-picker": Palette,
  "css-shadow-generator": Layers,
  "css-gradient-generator": Palette,
  "svg-optimizer-viewer": Image,
};

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