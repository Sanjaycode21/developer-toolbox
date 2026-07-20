import { Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search } from 'lucide-react';

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
}

export const tools: Tool[] = [
  // Converters & Encoders
  {
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder / Decoder",
    category: "Converters & Encoders",
    path: "/tools/base64-encoder-decoder",
    description: "Encode and decode Base64 strings.",
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Converters & Encoders",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice-versa.",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Converters & Encoders",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools", // This path seems incorrect, should be a dedicated page.
    description: "Convert text between different cases (e.g., camelCase, snake_case).",
  },

  // Formatters
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Formatters",
    path: "/tools/json-formatter",
    description: "Beautify or minify JSON data.",
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    category: "Formatters",
    path: "/tools/xml-formatter",
    description: "Beautify or minify XML data.",
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Formatters",
    path: "/tools/yaml-formatter",
    description: "Beautify or minify YAML data.",
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Formatters",
    path: "/tools/html-formatter",
    description: "Beautify or minify HTML markup.",
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer & Converter",
    category: "Formatters",
    path: "/tools/csv-viewer-converter",
    description: "View, format, and convert CSV data.",
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "Formatters",
    path: "/tools/sql-formatter",
    description: "Format and beautify your SQL queries for better readability.",
  },

  // Generators
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    category: "Generators",
    path: "/tools/day-6-implement-uuid-password-generator-tools", // This path seems incorrect, should be a dedicated page.
    description: "Generate universally unique identifiers (UUIDs).",
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "Generators",
    path: "/tools/day-6-implement-uuid-password-generator-tools", // This path seems incorrect, should be a dedicated page.
    description: "Generate strong, random passwords.",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Generators",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools", // This path seems incorrect, should be a dedicated page.
    description: "Generate placeholder text for your designs.",
  },
  {
    slug: "css-shadow-generator",
    name: "CSS Shadow Generator",
    category: "Generators",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools", // This path seems incorrect, should be a dedicated page.
    description: "Generate complex CSS box and text shadows.",
  },
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Generator",
    category: "Generators",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools", // This path seems incorrect, should be a dedicated page.
    description: "Create beautiful CSS linear and radial gradients.",
  },

  // Text & Data
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Text & Data",
    path: "/tools/markdown-live-preview",
    description: "Write Markdown and see the live preview.",
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Text & Data",
    path: "/tools/regex-tester-generator",
    description: "Test and generate regular expressions.",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Text & Data",
    path: "/tools/jwt-decoder",
    description: "Decode and inspect JSON Web Tokens.",
  },

  // Color
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Color",
    path: "/tools/color-picker",
    description: "Pick colors and convert between formats (HEX, RGB, HSL).",
  },

  // Other
  // {
  //   slug: "placeholder-tool",
  //   name: "Placeholder Tool",
  //   category: "Other",
  //   path: "/tools/placeholder-tool",
  //   description: "A tool that does something useful.",
  // },
];

// Helper function to group tools by category
export function toolsByCategory(): Record<string, Tool[]> {
  return tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);
}

// Helper function to get tool by slug
export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(tool => tool.slug === slug);
}