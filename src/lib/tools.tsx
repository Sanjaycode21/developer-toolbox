import {
  Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search
} from 'lucide-react';

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
    category: "Converters",
    path: "/tools/base64-encoder-decoder",
    description: "Encode and decode Base64 strings.",
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Design",
    path: "/tools/color-picker",
    description: "Select colors and convert between HEX, RGB, HSL formats.",
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Development",
    path: "/tools/regex-tester-generator",
    description: "Test and generate regular expressions with ease.",
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Converters",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice-versa.",
  },
  // Placeholder for future tools
  // {
  //   slug: "jwt-decoder",
  //   name: "JWT Decoder",
  //   category: "Security",
  //   path: "/tools/jwt-decoder",
  //   description: "Decode JWT tokens to inspect header, payload, and verify signature.",
  // },
  // {
  //   slug: "css-shadow-gradient-generator",
  //   name: "CSS Shadow & Gradient Generator",
  //   category: "Design",
  //   path: "/tools/css-shadow-gradient-generator",
  //   description: "Generate complex CSS box shadows and gradient backgrounds.",
  // },
  // {
  //   slug: "uuid-password-generator",
  //   name: "UUID & Password Generator",
  //   category: "Generators",
  //   path: "/tools/uuid-password-generator",
  //   description: "Generate strong passwords and UUIDs (v1, v4, v5).",
  // },
  // {
  //   slug: "case-converter",
  //   name: "Case Converter",
  //   category: "Text",
  //   path: "/tools/case-converter",
  //   description: "Convert text between different cases (e.g., camelCase, snake_case).",
  // },
  // {
  //   slug: "lorem-ipsum-generator",
  //   name: "Lorem Ipsum Generator",
  //   category: "Text",
  //   path: "/tools/lorem-ipsum-generator",
  //   description: "Generate placeholder text for your designs and prototypes.",
  // },
];

// Helper functions (MUST be preserved)
export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(tool => tool.slug === slug);
}

export function getToolByPath(path: string): Tool | undefined {
  return tools.find(tool => tool.path === path);
}

export function toolsByCategory(): Record<string, Tool[]> {
  const categories: Record<string, Tool[]> = {};
  tools.forEach(tool => {
    if (!categories[tool.category]) {
      categories[tool.category] = [];
    }
    categories[tool.category].push(tool);
  });
  return categories;
}