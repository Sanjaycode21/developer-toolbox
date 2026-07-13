import { Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search } from 'lucide-react';

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
}

export const tools: Tool[] = [
  // Favorites and History
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
    category: "Converters",
    path: "/tools/base64-encoder-decoder",
    description: "Encode and decode Base64 strings.",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Converters",
    path: "/tools/jwt-decoder",
    description: "Decode JWT (JSON Web Token) to inspect header, payload, and signature.",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Converters",
    path: "/tools/case-converter",
    description: "Convert text between different case formats like camelCase, snake_case, etc.",
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Converters",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice-versa.",
  },
  // Generators
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    category: "Generators",
    path: "/tools/uuid-password-generator", // Path points to the combined page
    description: "Generate UUIDs (Universally Unique Identifiers).",
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "Generators",
    path: "/tools/uuid-password-generator", // Path points to the combined page
    description: "Generate strong, secure passwords.",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Generators",
    path: "/tools/case-converter-lorem-ipsum-generator-tools", // Path points to the combined page
    description: "Generate placeholder text for your designs and layouts.",
  },
  {
    slug: "css-shadow-gradient-generator",
    name: "CSS Shadow & Gradient Generator",
    category: "Generators",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools",
    description: "Generate complex CSS shadows and gradients with ease.",
  },
  // Formatters
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Formatters",
    path: "/tools/json-formatter",
    description: "Beautify and validate JSON data.",
  },
  // Text
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Text",
    path: "/tools/regex-tester-generator",
    description: "Test and generate regular expressions.",
  },
  // Color
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Color",
    path: "/tools/color-picker",
    description: "Pick colors and convert between formats (HEX, RGB, HSL).",
  },
];

export const getToolBySlug = (slug: string): Tool | undefined => {
  return tools.find(tool => tool.slug === slug);
};

export const getToolByPath = (path: string): Tool | undefined => {
  return tools.find(tool => tool.path === path);
};

export const toolsByCategory = tools.reduce((acc, tool) => {
  if (!acc[tool.category]) {
    acc[tool.category] = [];
  }
  acc[tool.category].push(tool);
  return acc;
}, {} as Record<string, Tool[]>);