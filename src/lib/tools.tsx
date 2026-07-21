import {
  Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search,
  Type, // For Case Converter
  AlignLeft, // For Lorem Ipsum
  Image, // For Base64 Image Encoder/Decoder
} from 'lucide-react';

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
}

export const tools: Tool[] = [
  // Formatting
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    category: 'Formatting',
    path: '/tools/json-formatter',
    description: 'Beautify and validate JSON data.',
  },
  {
    slug: 'xml-formatter',
    name: 'XML Formatter',
    category: 'Formatting',
    path: '/tools/xml-formatter',
    description: 'Beautify and validate XML data.',
  },
  {
    slug: 'html-formatter',
    name: 'HTML Formatter',
    category: 'Formatting',
    path: '/tools/html-formatter',
    description: 'Beautify and format HTML code.',
  },
  {
    slug: 'sql-formatter',
    name: 'SQL Formatter',
    category: 'Formatting',
    path: '/tools/sql-formatter',
    description: 'Beautify and format SQL queries.',
  },
  {
    slug: 'yaml-formatter',
    name: 'YAML Formatter',
    category: 'Formatting',
    path: '/tools/yaml-formatter',
    description: 'Beautify and validate YAML data.',
  },
  {
    slug: 'markdown-live-preview',
    name: 'Markdown Live Preview',
    category: 'Formatting',
    path: '/tools/markdown-live-preview',
    description: 'Write and preview Markdown in real-time.',
  },

  // Converters
  {
    slug: 'base64-encoder-decoder',
    name: 'Base64 Encoder / Decoder',
    category: 'Encoding / Decoding',
    path: '/tools/base64-encoder-decoder',
    description: 'Encode and decode Base64 strings.',
  },
  {
    slug: 'base64-image-encoder-decoder',
    name: 'Base64 Image Encoder / Decoder',
    category: 'Encoding / Decoding',
    path: '/tools/base64-image-encoder-decoder',
    description: 'Encode images to Base64 and decode Base64 back to images.',
  },
  {
    slug: 'unix-timestamp-epoch-converter',
    name: 'Unix Timestamp & Epoch Converter',
    category: 'Converters',
    path: '/tools/unix-timestamp-epoch-converter',
    description: 'Convert Unix timestamps to human-readable dates and vice-versa.',
  },
  {
    slug: 'csv-viewer-converter',
    name: 'CSV Viewer / Converter',
    category: 'Converters',
    path: '/tools/csv-viewer-converter',
    description: 'View and convert CSV data to other formats.',
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    category: 'Text Manipulation',
    path: '/tools/case-converter',
    description: 'Convert text between different cases (e.g., camelCase, snake_case).',
  },

  // Generators
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    category: 'Generators',
    path: '/tools/uuid-generator',
    description: 'Generate universally unique identifiers (UUIDs).',
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    category: 'Generators',
    path: '/tools/password-generator',
    description: 'Generate strong, random passwords.',
  },
  {
    slug: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    category: 'Generators',
    path: '/tools/lorem-ipsum-generator',
    description: 'Generate placeholder text for your designs and layouts.',
  },
  {
    slug: 'css-shadow-generator',
    name: 'CSS Shadow Generator',
    category: 'Generators',
    path: '/tools/css-shadow-generator',
    description: 'Generate beautiful CSS box and text shadows.',
  },
  {
    slug: 'css-gradient-generator',
    name: 'CSS Gradient Generator',
    category: 'Generators',
    path: '/tools/css-gradient-generator',
    description: 'Create stunning CSS linear and radial gradients.',
  },

  // Web Utilities
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    category: 'Web Utilities',
    path: '/tools/jwt-decoder',
    description: 'Decode and inspect JSON Web Tokens.',
  },
  {
    slug: 'color-picker',
    name: 'Color Picker',
    category: 'Design Tools',
    path: '/tools/color-picker',
    description: 'Select colors and get their HEX, RGB, HSL values.',
  },

  // Other
  {
    slug: 'regex-tester-generator',
    name: 'Regex Tester & Generator',
    category: 'Text Manipulation',
    path: '/tools/regex-tester-generator',
    description: 'Test and generate regular expressions.',
  },
];

export function toolsByCategory(): Record<string, Tool[]> {
  return tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(tool => tool.slug === slug);
}

export const categoryIcons: Record<string, React.ElementType> = {
  'Formatting': Code,
  'Encoding / Decoding': Binary,
  'Converters': Layers,
  'Generators': Sparkles,
  'Web Utilities': Globe, // Assuming Globe is available or similar
  'Design Tools': Palette,
  'Text Manipulation': FileText,
  'Date & Time': Clock,
  'Security': Shield,
  'System': Terminal,
};

// Add Globe icon if not already imported
import { Globe } from 'lucide-react';