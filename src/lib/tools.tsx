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
  Clock,
  Key,
  Search,
  Image as ImageIcon, // Renamed to avoid conflict with HTML ImageElement
} from 'lucide-react';

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
}

export const tools: Tool[] = [
  // Special Pages
  {
    slug: 'favorites',
    name: 'Favorites',
    category: 'Special',
    path: '/tools/favorites',
    description: 'Your most loved tools, all in one place.',
  },
  {
    slug: 'history',
    name: 'History',
    category: 'Special',
    path: '/tools/history',
    description: 'Recently used tools.',
  },

  // Formatters
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    category: 'Formatters',
    path: '/tools/json-formatter',
    description: 'Beautify and validate JSON data.',
  },
  {
    slug: 'xml-formatter',
    name: 'XML Formatter',
    category: 'Formatters',
    path: '/tools/xml-formatter',
    description: 'Beautify and validate XML data.',
  },
  {
    slug: 'html-formatter',
    name: 'HTML Formatter',
    category: 'Formatters',
    path: '/tools/html-formatter',
    description: 'Beautify and clean up HTML code.',
  },
  {
    slug: 'sql-formatter',
    name: 'SQL Formatter',
    category: 'Formatters',
    path: '/tools/sql-formatter',
    description: 'Format SQL queries for better readability.',
  },
  {
    slug: 'yaml-formatter',
    name: 'YAML Formatter',
    category: 'Formatters',
    path: '/tools/yaml-formatter',
    description: 'Beautify and validate YAML data.',
  },

  // Converters
  {
    slug: 'base64-encoder-decoder',
    name: 'Base64 Encoder / Decoder',
    category: 'Converters',
    path: '/tools/base64-encoder-decoder',
    description: 'Encode and decode Base64 strings.',
  },
  {
    slug: 'base64-image-encoder-decoder',
    name: 'Base64 Image Encoder / Decoder',
    category: 'Converters',
    path: '/tools/base64-image-encoder-decoder',
    description: 'Encode and decode images to/from Base64 strings.',
  },
  {
    slug: 'csv-viewer-converter',
    name: 'CSV Viewer / Converter',
    category: 'Converters',
    path: '/tools/csv-viewer-converter',
    description: 'View, edit, and convert CSV data.',
  },
  {
    slug: 'unix-timestamp-epoch-converter',
    name: 'Unix Timestamp & Epoch Converter',
    category: 'Converters',
    path: '/tools/unix-timestamp-epoch-converter',
    description: 'Convert Unix timestamps to human-readable dates and vice versa.',
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    category: 'Converters',
    path: '/tools/case-converter',
    description: 'Convert text between different casing styles (e.g., camelCase, snake_case).',
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
    description: 'Create strong, random passwords.',
  },
  {
    slug: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    category: 'Generators',
    path: '/tools/lorem-ipsum-generator',
    description: 'Generate placeholder text for your designs and prototypes.',
  },
  {
    slug: 'css-shadow-generator',
    name: 'CSS Shadow Generator',
    category: 'Generators',
    path: '/tools/css-shadow-generator',
    description: 'Generate custom CSS box and text shadows.',
  },
  {
    slug: 'css-gradient-generator',
    name: 'CSS Gradient Generator',
    category: 'Generators',
    path: '/tools/css-gradient-generator',
    description: 'Create beautiful CSS linear and radial gradients.',
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
    slug: 'url-encoder-decoder',
    name: 'URL Encoder / Decoder',
    category: 'Web Utilities',
    path: '/tools/url-encoder-decoder',
    description: 'Encode and decode URLs.',
  },
  {
    slug: 'markdown-live-preview',
    name: 'Markdown Live Preview',
    category: 'Web Utilities',
    path: '/tools/markdown-live-preview',
    description: 'Write and preview Markdown in real-time.',
  },
  {
    slug: 'color-picker',
    name: 'Color Picker',
    category: 'Web Utilities',
    path: '/tools/color-picker',
    description: 'Select colors and get their HEX, RGB, HSL values.',
  },

  // Text Utilities
  {
    slug: 'regex-tester-generator',
    name: 'Regex Tester & Generator',
    category: 'Text Utilities',
    path: '/tools/regex-tester-generator',
    description: 'Test and generate regular expressions.',
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

export const categoryIcons: Record<string, React.ElementType> = {
  Special: Star,
  Formatters: Code,
  Converters: Layers,
  Generators: Sparkles,
  'Web Utilities': Terminal,
  'Text Utilities': FileText,
  // Add more categories and their icons as needed
};