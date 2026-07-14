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
  Clock, // Added Clock icon
  Key,
  Search,
} from 'lucide-react';

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
  icon: React.ElementType; // LucideIcon
}

export const tools: Tool[] = [
  {
    slug: 'favorites',
    name: 'Favorites',
    category: 'General',
    path: '/tools/favorites',
    description: 'Your most loved and frequently used tools.',
    icon: Star,
  },
  {
    slug: 'history',
    name: 'History',
    category: 'General',
    path: '/tools/history',
    description: 'Recently used tools and past conversions.',
    icon: History,
  },
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    category: 'Formatters',
    path: '/tools/json-formatter',
    description: 'Beautify or minify JSON data for better readability.',
    icon: Code,
  },
  {
    slug: 'base64-encoder-decoder',
    name: 'Base64 Encoder/Decoder',
    category: 'Converters',
    path: '/tools/base64-encoder-decoder',
    description: 'Encode and decode Base64 strings.',
    icon: Binary,
  },
  {
    slug: 'color-picker',
    name: 'Color Picker',
    category: 'Utilities',
    path: '/tools/color-picker',
    description: 'Select colors and get their HEX, RGB, HSL, and other values.',
    icon: Palette,
  },
  {
    slug: 'uuid-password-generator',
    name: 'UUID & Password Generator',
    category: 'Generators',
    path: '/tools/uuid-password-generator',
    description: 'Generate strong passwords and unique UUIDs.',
    icon: Key,
  },
  {
    slug: 'unix-timestamp-epoch-converter',
    name: 'Unix Timestamp & Epoch Converter',
    category: 'Converters',
    path: '/tools/unix-timestamp-epoch-converter',
    description: 'Convert Unix timestamps to human-readable dates and vice-versa.',
    icon: Clock, // Used Clock icon
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    category: 'Text',
    path: '/tools/case-converter',
    description: 'Convert text between different cases: lowercase, uppercase, camelCase, etc.',
    icon: FileText,
  },
  {
    slug: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    category: 'Generators',
    path: '/tools/lorem-ipsum-generator',
    description: 'Generate placeholder text for your designs and prototypes.',
    icon: Sparkles,
  },
  {
    slug: 'regex-tester-generator',
    name: 'Regex Tester & Generator',
    category: 'Text',
    path: '/tools/regex-tester-generator',
    description: 'Test and generate regular expressions with ease.',
    icon: Search,
  },
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    category: 'Security',
    path: '/tools/jwt-decoder',
    description: 'Decode JWT tokens to inspect headers, payload, and verify signature.',
    icon: Shield,
  },
  {
    slug: 'css-shadow-gradient-generator',
    name: 'CSS Shadow & Gradient Generator',
    category: 'Generators',
    path: '/tools/css-shadow-gradient-generator',
    description: 'Generate complex CSS box shadows and beautiful gradients.',
    icon: Layers,
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