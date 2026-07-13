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
  Clock, // Added Clock icon for Unix Timestamp Converter
  Key,
  Search,
} from 'lucide-react';

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
  icon: React.ElementType; // Lucide icon component
}

export const tools: Tool[] = [
  // Favorites & History
  {
    slug: 'favorites',
    name: 'Favorites',
    category: 'General',
    path: '/tools/favorites',
    description: 'Your most loved tools, all in one place.',
    icon: Star,
  },
  {
    slug: 'history',
    name: 'History',
    category: 'General',
    path: '/tools/history',
    description: 'Recently used tools for quick access.',
    icon: History,
  },
  // Converters & Encoders
  {
    slug: 'base64-encoder-decoder',
    name: 'Base64 Encoder / Decoder',
    category: 'Converters & Encoders',
    path: '/tools/base64-encoder-decoder',
    description: 'Encode and decode Base64 strings.',
    icon: Binary,
  },
  {
    slug: 'unix-timestamp-epoch-converter',
    name: 'Unix Timestamp & Epoch Converter',
    category: 'Converters & Encoders',
    path: '/tools/unix-timestamp-epoch-converter',
    description: 'Convert Unix timestamps to human-readable dates and vice-versa.',
    icon: Clock,
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    category: 'Text',
    path: '/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools', // This path needs to be updated if a dedicated page is created
    description: 'Convert text between different letter cases.',
    icon: FileText,
  },
  // Generators
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    category: 'Generators',
    path: '/tools/day-6-implement-uuid-password-generator-tools', // This path needs to be updated if a dedicated page is created
    description: 'Generate universally unique identifiers (UUIDs).',
    icon: Hash,
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    category: 'Generators',
    path: '/tools/day-6-implement-uuid-password-generator-tools', // This path needs to be updated if a dedicated page is created
    description: 'Create strong, random passwords.',
    icon: Key,
  },
  {
    slug: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    category: 'Generators',
    path: '/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools', // This path needs to be updated if a dedicated page is created
    description: 'Generate placeholder text for your designs.',
    icon: FileText,
  },
  {
    slug: 'css-shadow-generator',
    name: 'CSS Shadow Generator',
    category: 'Generators',
    path: '/tools/day-4-implement-css-shadow-gradient-generator-tools', // This path needs to be updated if a dedicated page is created
    description: 'Generate complex CSS box and text shadows.',
    icon: Layers,
  },
  {
    slug: 'css-gradient-generator',
    name: 'CSS Gradient Generator',
    category: 'Generators',
    path: '/tools/day-4-implement-css-shadow-gradient-generator-tools', // This path needs to be updated if a dedicated page is created
    description: 'Create beautiful CSS gradients.',
    icon: Palette,
  },
  // Formatters
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    category: 'Formatters',
    path: '/tools/json-formatter',
    description: 'Beautify and validate JSON data.',
    icon: Code,
  },
  // Web Utilities
  {
    slug: 'color-picker',
    name: 'Color Picker',
    category: 'Web Utilities',
    path: '/tools/color-picker',
    description: 'Select and convert colors.',
    icon: Palette,
  },
  // Dev Utilities
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    category: 'Dev Utilities',
    path: '/tools/day-3-implement-jwt-decoder-tool/page', // This path needs to be updated if a dedicated page is created
    description: 'Decode JSON Web Tokens to inspect header, payload, and signature.',
    icon: Shield,
  },
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    category: 'Dev Utilities',
    path: '/tools/regex-tester-generator',
    description: 'Test and debug regular expressions.',
    icon: Search,
  },
  {
    slug: 'regex-generator',
    name: 'Regex Generator',
    category: 'Dev Utilities',
    path: '/tools/regex-tester-generator',
    description: 'Generate regular expressions from examples.',
    icon: Sparkles,
  },
];

export const getToolBySlug = (slug: string) => tools.find((tool) => tool.slug === slug);
export const getToolByPath = (path: string) => tools.find((tool) => tool.path === path);

export const toolsByCategory = tools.reduce((acc, tool) => {
  if (!acc[tool.category]) {
    acc[tool.category] = [];
  }
  acc[tool.category].push(tool);
  return acc;
}, {} as Record<string, Tool[]>);