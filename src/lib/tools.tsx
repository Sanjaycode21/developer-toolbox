import {
  Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search,
  Type, // For Case Converter
  AlignLeft, // For Lorem Ipsum
  Image, // For Base64 Image Encoder/Decoder
} from "lucide-react";

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
}

export const tools: Tool[] = [
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Formatters",
    path: "/tools/json-formatter",
    description: "Beautify and validate JSON data.",
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    category: "Formatters",
    path: "/tools/xml-formatter",
    description: "Beautify and validate XML data.",
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Formatters",
    path: "/tools/html-formatter",
    description: "Beautify and indent HTML code.",
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "Formatters",
    path: "/tools/sql-formatter",
    description: "Beautify and format SQL queries.",
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Formatters",
    path: "/tools/yaml-formatter",
    description: "Beautify and validate YAML data.",
  },
  {
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder / Decoder",
    category: "Converters",
    path: "/tools/base64-encoder-decoder",
    description: "Encode and decode Base64 strings.",
  },
  {
    slug: "base64-image-encoder-decoder",
    name: "Base64 Image Encoder/Decoder",
    category: "Converters",
    path: "/tools/base64-image-encoder-decoder",
    description: "Encode images to Base64 strings and decode Base64 strings back to images.",
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
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Decoders",
    path: "/tools/jwt-decoder",
    description: "Decode and inspect JSON Web Tokens.",
  },
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Utilities",
    path: "/tools/markdown-live-preview",
    description: "Write and preview Markdown in real-time.",
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Utilities",
    path: "/tools/regex-tester-generator",
    description: "Test and generate regular expressions.",
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Utilities",
    path: "/tools/color-picker",
    description: "Select colors and get their HEX, RGB, HSL values.",
  },
  {
    slug: "day-3-implement-jwt-decoder-tool",
    name: "Day 3: Implement JWT Decoder Tool",
    category: "Development",
    path: "/tools/day-3-implement-jwt-decoder-tool",
    description: "Placeholder for Day 3 task.",
  },
  {
    slug: "day-4-implement-css-shadow-gradient-generator-tools",
    name: "Day 4: Implement CSS Shadow & Gradient Generator Tools",
    category: "Development",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools",
    description: "Placeholder for Day 4 task.",
  },
  {
    slug: "day-5-implement-unix-timestamp-epoch-converter-tools",
    name: "Day 5: Implement Unix Timestamp & Epoch Converter Tools",
    category: "Development",
    path: "/tools/day-5-implement-unix-timestamp-epoch-converter-tools",
    description: "Placeholder for Day 5 task.",
  },
  {
    slug: "day-6-implement-uuid-password-generator-tools",
    name: "Day 6: Implement UUID & Password Generator Tools",
    category: "Development",
    path: "/tools/day-6-implement-uuid-password-generator-tools",
    description: "Placeholder for Day 6 task.",
  },
  {
    slug: "day-7-implement-case-converter-lorem-ipsum-generator-tools",
    name: "Day 7: Implement Case Converter & Lorem Ipsum Generator Tools",
    category: "Development",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools",
    description: "Placeholder for Day 7 task.",
  },
];

export const toolCategories: Record<string, { icon: React.ElementType; tools: Tool[] }> = {
  Formatters: { icon: Code, tools: [] },
  Converters: { icon: Binary, tools: [] },
  Decoders: { icon: Key, tools: [] },
  Generators: { icon: Sparkles, tools: [] },
  Utilities: { icon: Settings, tools: [] },
  Text: { icon: FileText, tools: [] },
  Development: { icon: Terminal, tools: [] },
  // Add more categories as needed
};

// Populate toolCategories
tools.forEach((tool) => {
  if (toolCategories[tool.category]) {
    toolCategories[tool.category].tools.push(tool);
  }
});

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

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

export const mainNavigation = [
  {
    name: "All Tools",
    href: "/tools",
    icon: Layers,
    slug: "all-tools",
  },
  {
    name: "Favorites",
    href: "/tools/favorites",
    icon: Star,
    slug: "favorites",
  },
  {
    name: "History",
    href: "/tools/history",
    icon: History,
    slug: "history",
  },
];

export const categoryIcons: Record<string, React.ElementType> = {
  Formatters: Code,
  Converters: Binary,
  Decoders: Key,
  Generators: Sparkles,
  Utilities: Settings,
  Text: FileText,
  Development: Terminal,
  // Specific icons for tools that might not fit a general category icon well
  "JSON Formatter": Code,
  "XML Formatter": Code,
  "HTML Formatter": Code,
  "SQL Formatter": Code,
  "YAML Formatter": Code,
  "Base64 Encoder / Decoder": Binary,
  "Base64 Image Encoder/Decoder": Image, // Specific icon for the new tool
  "CSV Viewer / Converter": FileText,
  "Unix Timestamp & Epoch Converter": Clock,
  "JWT Decoder": Shield,
  "Markdown Live Preview": FileText,
  "Regex Tester & Generator": Search,
  "Color Picker": Palette,
  "Case Converter": Type,
  "Lorem Ipsum Generator": AlignLeft,
  // Placeholder icons for development tasks
  "Day 3: Implement JWT Decoder Tool": Terminal,
  "Day 4: Implement CSS Shadow & Gradient Generator Tools": Terminal,
  "Day 5: Implement Unix Timestamp & Epoch Converter Tools": Terminal,
  "Day 6: Implement UUID & Password Generator Tools": Terminal,
  "Day 7: Implement Case Converter & Lorem Ipsum Generator Tools": Terminal,
};