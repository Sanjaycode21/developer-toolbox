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
} from "lucide-react";

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
    description: "Your most loved tools, all in one place.",
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
    slug: "case-converter",
    name: "Case Converter",
    category: "Converters & Encoders",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools", // This path needs to be updated if the slug is different
    description: "Convert text to different cases (e.g., uppercase, lowercase, camelCase).",
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Converters & Encoders",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice-versa.",
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
    path: "/tools/day-6-implement-uuid-password-generator-tools", // This path needs to be updated if the slug is different
    description: "Generate strong passwords and UUIDs.",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Generators",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools", // This path needs to be updated if the slug is different
    description: "Generate placeholder text for your designs and prototypes.",
  },
  {
    slug: "meta-tag-generator-og-preview",
    name: "Meta Tag Generator & OG Preview",
    category: "Generators",
    path: "/tools/meta-tag-generator-og-preview",
    description: "Generate essential meta tags and preview Open Graph (OG) social media cards.",
  },
  // Formatters
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
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools", // This path needs to be updated if the slug is different
    description: "Beautify or minify CSS code.",
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
  // Web Utilities
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Web Utilities",
    path: "/tools/jwt-decoder",
    description: "Decode JWT tokens to inspect header, payload, and verify signature.",
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    category: "Web Utilities",
    path: "/tools/day-3-implement-jwt-decoder-tool", // This path needs to be updated if the slug is different
    description: "Encode and decode URLs.",
  },
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
    slug: "robots-txt-generator",
    name: "Robots.txt Generator",
    category: "Web Utilities",
    path: "/tools/robots-txt-generator",
    description: "Generate a robots.txt file to manage crawler access.",
  },
  {
    slug: "sitemap-xml-generator",
    name: "Sitemap XML Generator",
    category: "Web Utilities",
    path: "/tools/sitemap-xml-generator",
    description: "Create an XML sitemap for your website.",
  },
  // Design & Graphics
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Design & Graphics",
    path: "/tools/color-picker",
    description: "Pick colors and convert between formats (HEX, RGB, HSL).",
  },
  {
    slug: "css-shadow-generator",
    name: "CSS Shadow Generator",
    category: "Design & Graphics",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools", // This path needs to be updated if the slug is different
    description: "Generate custom CSS box and text shadows.",
  },
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Generator",
    category: "Design & Graphics",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools", // This path needs to be updated if the slug is different
    description: "Create beautiful CSS linear and radial gradients.",
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer & Viewer",
    category: "Design & Graphics",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize SVG files and preview their rendering.",
  },
  // Data & Files
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer & Converter",
    category: "Data & Files",
    path: "/tools/csv-viewer-converter",
    description: "View, edit, and convert CSV data.",
  },
  {
    slug: "hash-verifier",
    name: "Hash Verifier",
    category: "Security",
    path: "/tools/hash-verifier",
    description: "Verify the integrity of files using hash comparison.",
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
  General: Star,
  "Converters & Encoders": Binary,
  Generators: Sparkles,
  Formatters: Code,
  "Web Utilities": Terminal,
  "Design & Graphics": Palette,
  "Data & Files": FileText,
  Security: Shield,
};