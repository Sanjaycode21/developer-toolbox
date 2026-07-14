import { Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search } from "lucide-react";

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
    description: "Your most loved and frequently used tools.",
  },
  {
    slug: "history",
    name: "History",
    category: "General",
    path: "/tools/history",
    description: "Recently used tools for quick access.",
  },

  // Converters
  {
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder / Decoder",
    category: "Converters",
    path: "/tools/base64-encoder-decoder",
    description: "Encode and decode Base64 strings.",
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Converters",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice-versa.",
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Converters",
    path: "/tools/json-formatter",
    description: "Format and validate JSON data.",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Converters",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools", // This path needs to be updated if a dedicated page is created
    description: "Convert text between different casing styles.",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Converters",
    path: "/tools/day-3-implement-jwt-decoder-tool", // This path needs to be updated if a dedicated page is created
    description: "Decode and inspect JWT tokens.",
  },

  // Generators
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    category: "Generators",
    path: "/tools/day-6-implement-uuid-password-generator-tools", // This path needs to be updated if a dedicated page is created
    description: "Generate universally unique identifiers (UUIDs).",
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "Generators",
    path: "/tools/day-6-implement-uuid-password-generator-tools", // This path needs to be updated if a dedicated page is created
    description: "Create strong, random passwords.",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Generators",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools", // This path needs to be updated if a dedicated page is created
    description: "Generate placeholder text for your designs.",
  },
  {
    slug: "css-shadow-generator",
    name: "CSS Shadow Generator",
    category: "Generators",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools", // This path needs to be updated if a dedicated page is created
    description: "Generate complex CSS box and text shadows.",
  },
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Generator",
    category: "Generators",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools", // This path needs to be updated if a dedicated page is created
    description: "Create beautiful CSS linear and radial gradients.",
  },

  // Formatters
  // {
  //   slug: "html-formatter",
  //   name: "HTML Formatter",
  //   category: "Formatters",
  //   path: "/tools/html-formatter",
  //   description: "Format and beautify HTML code.",
  // },
  // {
  //   slug: "css-formatter",
  //   name: "CSS Formatter",
  //   category: "Formatters",
  //   path: "/tools/css-formatter",
  //   description: "Format and beautify CSS code.",
  // },
  // {
  //   slug: "javascript-formatter",
  //   name: "JavaScript Formatter",
  //   category: "Formatters",
  //   path: "/tools/javascript-formatter",
  //   description: "Format and beautify JavaScript code.",
  // },

  // Web
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Web",
    path: "/tools/color-picker",
    description: "Select colors and get their HEX, RGB, HSL values.",
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    category: "Web",
    path: "/tools/regex-tester-generator", // This path needs to be updated if a dedicated page is created
    description: "Test and debug regular expressions.",
  },
  {
    slug: "regex-generator",
    name: "Regex Generator",
    category: "Web",
    path: "/tools/regex-tester-generator", // This path needs to be updated if a dedicated page is created
    description: "Generate regular expressions from examples.",
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolByPath(path: string): Tool | undefined {
  return tools.find((tool) => tool.path === path);
}

export const toolsByCategory = tools.reduce((acc, tool) => {
  if (!acc[tool.category]) {
    acc[tool.category] = [];
  }
  acc[tool.category].push(tool);
  return acc;
}, {} as Record<string, Tool[]>);