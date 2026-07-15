import { Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search } from 'lucide-react';

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
    description: "Your most loved and frequently used tools.",
  },
  {
    slug: "history",
    name: "History",
    category: "General",
    path: "/tools/history",
    description: "Recently used tools and past conversions.",
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Formatters",
    path: "/tools/json-formatter",
    description: "Beautify or minify JSON data for better readability.",
  },
  {
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder/Decoder",
    category: "Encoders / Decoders",
    path: "/tools/base64-encoder-decoder",
    description: "Encode and decode Base64 strings.",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Security",
    path: "/tools/jwt-decoder",
    description: "Decode JWT (JSON Web Token) to inspect its header, payload, and verify signature.",
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Design",
    path: "/tools/color-picker",
    description: "Select colors and convert between HEX, RGB, HSL formats.",
  },
  {
    slug: "css-shadow-generator",
    name: "CSS Shadow Generator",
    category: "Design",
    path: "/tools/css-shadow-generator",
    description: "Generate beautiful CSS box and text shadows.",
  },
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Generator",
    category: "Design",
    path: "/tools/css-gradient-generator",
    description: "Create stunning CSS linear and radial gradients.",
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Date & Time",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert between Unix timestamps (Epoch) and human-readable dates and times.",
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    category: "Generators",
    path: "/tools/uuid-generator",
    description: "Generate universally unique identifiers (UUIDs/GUIDs).",
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
    description: "Convert text between various case formats (e.g., camelCase, snake_case).",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Text",
    path: "/tools/lorem-ipsum-generator",
    description: "Generate placeholder text for your designs and prototypes.",
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Text",
    path: "/tools/regex-tester-generator",
    description: "Test and generate regular expressions with ease.",
  },
];

// Helper functions (must be preserved)
export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolByPath(path: string): Tool | undefined {
  return tools.find((tool) => tool.path === path);
}

export function toolsByCategory(): Record<string, Tool[]> {
  return tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);
}