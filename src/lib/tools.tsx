import { LucideIcon, Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search } from 'lucide-react';

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
  icon?: LucideIcon; // Optional icon property
}

export const tools: Tool[] = [
  // Favorites & History
  {
    slug: "favorites",
    name: "Favorites",
    category: "Navigation",
    path: "/tools/favorites",
    description: "Your most loved tools, all in one place.",
    icon: Star,
  },
  {
    slug: "history",
    name: "History",
    category: "Navigation",
    path: "/tools/history",
    description: "Recently used tools.",
    icon: History,
  },

  // Converters & Encoders
  {
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder / Decoder",
    category: "Converters & Encoders",
    path: "/tools/base64-encoder-decoder",
    description: "Encode and decode Base64 strings.",
    icon: Binary,
  },
  {
    slug: "base64-image-encoder-decoder",
    name: "Base64 Image Encoder / Decoder",
    category: "Converters & Encoders",
    path: "/tools/base64-image-encoder-decoder",
    description: "Convert images to Base64 and vice-versa.",
    icon: FileText,
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Converters & Encoders",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice-versa.",
    icon: Clock,
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Converters & Encoders",
    path: "/tools/case-converter",
    description: "Convert text to different cases: lowercase, uppercase, camelCase, etc.",
    icon: FileText,
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer / Converter",
    category: "Converters & Encoders",
    path: "/tools/csv-viewer-converter",
    description: "View and convert CSV data.",
    icon: FileText,
  },

  // Formatters
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Formatters",
    path: "/tools/json-formatter",
    description: "Format and validate JSON data.",
    icon: Code,
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    category: "Formatters",
    path: "/tools/xml-formatter",
    description: "Format and validate XML data.",
    icon: Code,
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Formatters",
    path: "/tools/html-formatter",
    description: "Format and beautify HTML code.",
    icon: Code,
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "Formatters",
    path: "/tools/sql-formatter",
    description: "Format and beautify SQL queries.",
    icon: Terminal,
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Formatters",
    path: "/tools/yaml-formatter",
    description: "Format and validate YAML data.",
    icon: Code,
  },

  // Generators
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    category: "Generators",
    path: "/tools/uuid-generator",
    description: "Generate universally unique identifiers (UUIDs).",
    icon: Key,
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "Generators",
    path: "/tools/password-generator",
    description: "Generate strong, random passwords.",
    icon: Shield,
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Generators",
    path: "/tools/lorem-ipsum-generator",
    description: "Generate placeholder text for your designs and layouts.",
    icon: FileText,
  },
  {
    slug: "css-shadow-generator",
    name: "CSS Shadow Generator",
    category: "Generators",
    path: "/tools/css-shadow-generator",
    description: "Generate custom CSS box and text shadows.",
    icon: Layers,
  },
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Generator",
    category: "Generators",
    path: "/tools/css-gradient-generator",
    description: "Create beautiful CSS linear and radial gradients.",
    icon: Palette,
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    category: "Generators",
    path: "/tools/hash-generator",
    description: "Generate MD5, SHA-1, and SHA-256 hashes from text.",
    icon: Hash,
  },

  // Web & Utilities
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Web & Utilities",
    path: "/tools/jwt-decoder",
    description: "Decode JSON Web Tokens to inspect header, payload, and signature.",
    icon: Key,
  },
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Web & Utilities",
    path: "/tools/markdown-live-preview",
    description: "Write and preview Markdown in real-time.",
    icon: FileText,
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Web & Utilities",
    path: "/tools/color-picker",
    description: "Pick colors and get their HEX, RGB, HSL values.",
    icon: Palette,
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Web & Utilities",
    path: "/tools/regex-tester-generator",
    description: "Test and generate regular expressions.",
    icon: Search,
  },
];

export function toolsByCategory(): Record<string, Tool[]> {
  const categories: Record<string, Tool[]> = {};
  tools.forEach(tool => {
    if (!categories[tool.category]) {
      categories[tool.category] = [];
    }
    // Assign default icons if not explicitly set
    if (!tool.icon) {
      switch (tool.category) {
        case "Navigation":
          // Handled above for Star and History
          break;
        case "Converters & Encoders":
          tool.icon = Binary;
          break;
        case "Formatters":
          tool.icon = Code;
          break;
        case "Generators":
          tool.icon = Sparkles;
          break;
        case "Web & Utilities":
          tool.icon = Settings;
          break;
        default:
          tool.icon = Settings; // Fallback icon
      }
    }
    categories[tool.category].push(tool);
  });
  return categories;
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(tool => tool.slug === slug);
}