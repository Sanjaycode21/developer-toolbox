import {
  Code,
  Hash,
  Binary,
  Palette,
  Calendar,
  Key,
  FileText,
  History,
  Star,
  Sparkles,
  Shield,
  Search,
  Type,
  AlignLeft,
  Clock,
} from "lucide-react";
import React from "react";

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
  icon?: React.ElementType; // Optional icon property
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
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Converters & Encoders",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice versa.",
    icon: Clock,
  },
  // Generators
  {
    slug: "uuid-password-generator",
    name: "UUID & Password Generator",
    category: "Generators",
    path: "/tools/uuid-password-generator",
    description: "Generate UUIDs and strong, random passwords.",
    icon: Key,
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Generators",
    path: "/tools/lorem-ipsum-generator",
    description: "Generate placeholder text for your designs and prototypes.",
    icon: AlignLeft,
  },
  // Formatters
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Formatters",
    path: "/tools/json-formatter",
    description: "Beautify and validate JSON data.",
    icon: Code,
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    category: "Formatters",
    path: "/tools/xml-formatter",
    description: "Beautify and format your XML data for better readability.",
    icon: FileText,
  },
  // Text
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Text",
    path: "/tools/case-converter",
    description: "Convert text between different letter cases (e.g., camelCase, snake_case).",
    icon: Type,
  },
  // Web
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Web",
    path: "/tools/jwt-decoder",
    description: "Decode JWTs to inspect header, payload, and verify signature.",
    icon: Shield,
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Web",
    path: "/tools/regex-tester-generator",
    description: "Test and generate regular expressions.",
    icon: Search,
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Web",
    path: "/tools/color-picker",
    description: "Pick colors and convert between formats (HEX, RGB, HSL).",
    icon: Palette,
  },
  {
    slug: "css-shadow-gradient-generator",
    name: "CSS Shadow & Gradient Generator",
    category: "Web",
    path: "/tools/css-shadow-gradient-generator",
    description: "Generate complex CSS shadows and gradients with ease.",
    icon: Sparkles,
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