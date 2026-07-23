import { Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search, Image } from "lucide-react";

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
}

export const tools: Tool[] = [
  {
    slug: "favorites",
    name: "Favorites",
    category: "General",
    path: "/tools/favorites",
    description: "Your most loved and frequently used tools, all in one place.",
  },
  {
    slug: "history",
    name: "History",
    category: "General",
    path: "/tools/history",
    description: "Recently used tools for quick access and continuity.",
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Formatters",
    path: "/tools/json-formatter",
    description: "Beautify or minify JSON data for better readability or compactness.",
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    category: "Formatters",
    path: "/tools/xml-formatter",
    description: "Beautify or minify XML data for better readability or compactness.",
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Formatters",
    path: "/tools/html-formatter",
    description: "Beautify or minify HTML code for better readability or compactness.",
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "Formatters",
    path: "/tools/sql-formatter",
    description: "Beautify or minify SQL queries for better readability or compactness.",
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Formatters",
    path: "/tools/yaml-formatter",
    description: "Beautify or minify YAML data for better readability or compactness.",
  },
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Editors",
    path: "/tools/markdown-live-preview",
    description: "Write Markdown and see the rendered output in real-time.",
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
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Security",
    path: "/tools/jwt-decoder",
    description: "Decode JWT tokens to inspect header, payload, and verify signature.",
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Date & Time",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice versa.",
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    category: "Generators",
    path: "/tools/uuid-generator",
    description: "Generate universally unique identifiers (UUIDs) in various versions.",
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "Generators",
    path: "/tools/password-generator",
    description: "Create strong, random passwords with customizable options.",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Text",
    path: "/tools/case-converter",
    description: "Convert text between different casing styles (e.g., camelCase, snake_case).",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Generators",
    path: "/tools/lorem-ipsum-generator",
    description: "Generate placeholder text for your designs and prototypes.",
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Design",
    path: "/tools/color-picker",
    description: "Select colors and convert between HEX, RGB, HSL, and other formats.",
  },
  {
    slug: "css-shadow-generator",
    name: "CSS Shadow Generator",
    category: "Design",
    path: "/tools/css-shadow-generator",
    description: "Generate complex CSS box-shadow and text-shadow styles visually.",
  },
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Generator",
    category: "Design",
    path: "/tools/css-gradient-generator",
    description: "Create beautiful CSS linear and radial gradients with ease.",
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer & Converter",
    category: "Converters",
    path: "/tools/csv-viewer-converter",
    description: "View, parse, and convert CSV data to JSON or other formats.",
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Text",
    path: "/tools/regex-tester-generator",
    description: "Test and build regular expressions with a live preview.",
  },
];

export function getToolIcon(slug: string) {
  switch (slug) {
    case "json-formatter":
    case "xml-formatter":
    case "html-formatter":
    case "sql-formatter":
    case "yaml-formatter":
      return Code;
    case "base64-encoder-decoder":
    case "base64-image-encoder-decoder":
      return Binary;
    case "jwt-decoder":
      return Shield;
    case "unix-timestamp-epoch-converter":
      return Clock;
    case "uuid-generator":
      return Hash;
    case "password-generator":
      return Key;
    case "markdown-live-preview":
      return FileText;
    case "favorites":
      return Star;
    case "history":
      return History;
    case "case-converter":
      return Layers;
    case "lorem-ipsum-generator":
      return Sparkles;
    case "color-picker":
    case "css-shadow-generator":
    case "css-gradient-generator":
      return Palette;
    case "csv-viewer-converter":
      return Terminal;
    case "regex-tester-generator":
      return Search;
    default:
      return Settings;
  }
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

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}