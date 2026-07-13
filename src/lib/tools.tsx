import { Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search } from "lucide-react";

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
    description: "Your most loved tools, all in one place.",
  },
  {
    slug: "history",
    name: "History",
    category: "General",
    path: "/tools/history",
    description: "Recently used tools for quick access.",
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Formatters",
    path: "/tools/json-formatter",
    description: "Beautify or minify JSON data.",
  },
  {
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder/Decoder",
    category: "Converters",
    path: "/tools/base64-encoder-decoder",
    description: "Encode and decode Base64 strings.",
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Time",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice-versa.",
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Design",
    path: "/tools/color-picker",
    description: "Pick colors and convert between formats (HEX, RGB, HSL).",
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Text",
    path: "/tools/regex-tester-generator",
    description: "Test and generate regular expressions.",
  },
  // Day 3: JWT Decoder
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Security",
    path: "/tools/jwt-decoder",
    description: "Decode JWT tokens to inspect header, payload, and verify signature.",
  },
  // Day 4: CSS Shadow & Gradient Generator
  {
    slug: "css-shadow-generator",
    name: "CSS Shadow Generator",
    category: "Design",
    path: "/tools/css-shadow-generator",
    description: "Generate various CSS box and text shadows.",
  },
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Generator",
    category: "Design",
    path: "/tools/css-gradient-generator",
    description: "Create beautiful CSS linear and radial gradients.",
  },
  // Day 6: UUID & Password Generator
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    category: "Generators",
    path: "/tools/uuid-generator",
    description: "Generate universally unique identifiers (UUIDs).",
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "Security",
    path: "/tools/password-generator",
    description: "Create strong, random passwords with custom options.",
  },
  // Day 7: Case Converter & Lorem Ipsum Generator
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Text",
    path: "/tools/case-converter",
    description: "Convert text between different casing styles.",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Generators",
    path: "/tools/lorem-ipsum-generator",
    description: "Generate placeholder text for your designs and layouts.",
  },
];

export const getToolBySlug = (slug: string): Tool | undefined => {
  return tools.find((tool) => tool.slug === slug);
};

export const getToolByPath = (path: string): Tool | undefined => {
  return tools.find((tool) => tool.path === path);
};

export const toolsByCategory = tools.reduce((acc, tool) => {
  if (!acc[tool.category]) {
    acc[tool.category] = [];
  }
  acc[tool.category].push(tool);
  return acc;
}, {} as Record<string, Tool[]>);