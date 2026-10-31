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
  Text,
  Image,
  Link,
  Table,
  Columns,
  SquareTerminal,
  Database,
} from "lucide-react";

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
  icon: React.ElementType; // Add icon property
}

export const tools: Tool[] = [
  // Favorites & History
  {
    slug: "favorites",
    name: "Favorites",
    category: "General",
    path: "/tools/favorites",
    description: "Your most loved tools, all in one place.",
    icon: Star,
  },
  {
    slug: "history",
    name: "History",
    category: "General",
    path: "/tools/history",
    description: "Recently used tools for quick access.",
    icon: History,
  },
  // Converters
  {
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder / Decoder",
    category: "Converters",
    path: "/tools/base64-encoder-decoder",
    description: "Encode and decode Base64 strings.",
    icon: Binary,
  },
  {
    slug: "base64-image-encoder-decoder",
    name: "Base64 Image Encoder / Decoder",
    category: "Converters",
    path: "/tools/base64-image-encoder-decoder",
    description: "Encode and decode images to/from Base64.",
    icon: Image,
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    category: "Converters",
    path: "/tools/url-encoder-decoder",
    description: "Encode and decode URLs.",
    icon: Link,
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Converters",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools", // This path needs to be updated if a dedicated page is created
    description: "Convert text to different cases (e.g., uppercase, lowercase).",
    icon: Type,
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Converters",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice versa.",
    icon: Clock,
  },
  // Generators
  {
    slug: "hash-generator",
    name: "Hash Generator",
    category: "Generators",
    path: "/tools/hash-generator",
    description: "Generate various hash types like MD5, SHA1, SHA256.",
    icon: Hash,
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    category: "Generators",
    path: "/tools/day-6-implement-uuid-password-generator-tools", // This path needs to be updated if a dedicated page is created
    description: "Generate universally unique identifiers (UUIDs).",
    icon: Key,
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "Generators",
    path: "/tools/day-6-implement-uuid-password-generator-tools", // This path needs to be updated if a dedicated page is created
    description: "Create strong, random passwords.",
    icon: Shield,
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Generators",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools", // This path needs to be updated if a dedicated page is created
    description: "Generate placeholder text for your designs.",
    icon: Text,
  },
  {
    slug: "cron-expression-builder",
    name: "Cron Expression Builder",
    category: "Generators",
    path: "/tools/cron-expression-builder",
    description: "Build and understand cron expressions easily.",
    icon: Calendar,
  },
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator",
    category: "Generators",
    path: "/tools/meta-tag-generator",
    description: "Generate essential meta tags for SEO.",
    icon: Code,
  },
  {
    slug: "robots-txt-generator",
    name: "Robots.txt Generator",
    category: "Generators",
    path: "/tools/robots-txt-generator",
    description: "Create a robots.txt file to manage crawler access.",
    icon: FileText,
  },
  {
    slug: "sitemap-xml-generator",
    name: "Sitemap XML Generator",
    category: "Generators",
    path: "/tools/sitemap-xml-generator",
    description: "Generate an XML sitemap for your website.",
    icon: FileText,
  },
  // Formatters
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Formatters",
    path: "/tools/json-formatter",
    description: "Beautify or minify JSON data.",
    icon: Code,
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    category: "Formatters",
    path: "/tools/xml-formatter",
    description: "Beautify or minify XML data.",
    icon: Code,
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Formatters",
    path: "/tools/html-formatter",
    description: "Beautify or minify HTML code.",
    icon: Code,
  },
  {
    slug: "css-formatter",
    name: "CSS Formatter",
    category: "Formatters",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools", // This path needs to be updated if a dedicated page is created
    description: "Beautify or minify CSS code.",
    icon: Palette,
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "Formatters",
    path: "/tools/sql-formatter",
    description: "Beautify or minify SQL queries.",
    icon: Database,
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Formatters",
    path: "/tools/yaml-formatter",
    description: "Beautify or minify YAML data.",
    icon: FileText,
  },
  // Web Utilities
  {
    slug: "http-header-viewer",
    name: "HTTP Header Viewer",
    category: "Web Utilities",
    path: "/tools/http-header-viewer",
    description: "View HTTP headers of any URL.",
    icon: Search,
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Web Utilities",
    path: "/tools/jwt-decoder",
    description: "Decode JSON Web Tokens to inspect their contents.",
    icon: Key,
  },
  {
    slug: "websocket-tester",
    name: "WebSocket Tester",
    category: "Web Utilities",
    path: "/tools/websocket-tester",
    description: "Test WebSocket connections and send/receive messages.",
    icon: Terminal,
  },
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Web Utilities",
    path: "/tools/markdown-live-preview",
    description: "Write Markdown and see the live preview.",
    icon: FileText,
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    category: "Web Utilities",
    path: "/tools/regex-tester-generator",
    description: "Test and debug regular expressions.",
    icon: Search,
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer / Converter",
    category: "Web Utilities",
    path: "/tools/csv-viewer-converter",
    description: "View and convert CSV data.",
    icon: Table,
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer / Viewer",
    category: "Web Utilities",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize and view SVG files.",
    icon: Image,
  },
  // Design & Graphics
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Design & Graphics",
    path: "/tools/color-picker",
    description: "Pick colors and get their HEX, RGB, HSL values.",
    icon: Palette,
  },
  {
    slug: "css-shadow-generator",
    name: "CSS Shadow Generator",
    category: "Design & Graphics",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools", // This path needs to be updated if a dedicated page is created
    description: "Generate complex CSS box and text shadows.",
    icon: Layers,
  },
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Generator",
    category: "Design & Graphics",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools", // This path needs to be updated if a dedicated page is created
    description: "Create beautiful CSS gradients.",
    icon: Palette,
  },
  // Programming
  {
    slug: "sql-playground",
    name: "SQL Playground",
    category: "Programming",
    path: "/tools/sql-playground",
    description: "Execute and test SQL queries against a mock database.",
    icon: SquareTerminal,
  },
  // DevForge Specific (if any)
  // {
  //   slug: "settings",
  //   name: "Settings",
  //   category: "DevForge",
  //   path: "/tools/settings",
  //   description: "Configure your DevForge experience.",
  //   icon: Settings,
  // },
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