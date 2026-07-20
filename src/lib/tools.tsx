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
  ListTodo,
  Eye,
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
    description: "Encode and decode Base64 data.",
    icon: Binary,
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Converters & Encoders",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice versa.",
    icon: Clock,
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
    icon: FileText,
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Formatters",
    path: "/tools/yaml-formatter",
    description: "Beautify or minify YAML data.",
    icon: Layers,
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer / Converter",
    category: "Formatters",
    path: "/tools/csv-viewer-converter",
    description: "View and convert CSV data.",
    icon: ListTodo,
  },
  // Generators
  {
    slug: "uuid-password-generator",
    name: "UUID & Password Generator",
    category: "Generators",
    path: "/tools/uuid-password-generator",
    description: "Generate UUIDs and strong passwords.",
    icon: Key,
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Generators",
    path: "/tools/lorem-ipsum-generator",
    description: "Generate placeholder text for your designs and prototypes.",
    icon: Text,
  },
  // Text
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Text",
    path: "/tools/case-converter",
    description: "Convert text between different cases (e.g., camelCase, snake_case).",
    icon: Type,
  },
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Text",
    path: "/tools/markdown-live-preview",
    description: "Write Markdown and see the live HTML preview.",
    icon: Eye,
  },
  // Web
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Web",
    path: "/tools/jwt-decoder",
    description: "Decode JSON Web Tokens to inspect their contents.",
    icon: Shield,
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Web",
    path: "/tools/color-picker",
    description: "Select colors and get their HEX, RGB, HSL values.",
    icon: Palette,
  },
  {
    slug: "css-shadow-gradient-generator",
    name: "CSS Shadow & Gradient Generator",
    category: "Web",
    path: "/tools/css-shadow-gradient-generator",
    description: "Generate beautiful CSS shadows and gradients.",
    icon: Sparkles,
  },
  // Utilities
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Utilities",
    path: "/tools/regex-tester-generator",
    description: "Test and generate regular expressions.",
    icon: Search,
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

// Helper to get all slugs
export function getAllToolSlugs(): string[] {
  return tools.map((tool) => tool.slug);
}