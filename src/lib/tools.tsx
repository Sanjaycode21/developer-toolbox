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
  Database, // Add Database icon
} from 'lucide-react';

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
}

export const tools: Tool[] = [
  // Core
  {
    slug: 'favorites',
    name: 'Favorites',
    category: 'Core',
    path: '/tools/favorites',
    description: 'Your most loved and frequently used tools.',
  },
  {
    slug: 'history',
    name: 'History',
    category: 'Core',
    path: '/tools/history',
    description: 'Recently used tools for quick access.',
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
    description: 'Encode and decode images to/from Base64.',
  },
  {
    slug: 'url-encoder-decoder',
    name: 'URL Encoder / Decoder',
    category: 'Converters',
    path: '/tools/url-encoder-decoder',
    description: 'Encode and decode URL components.',
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
    path: '/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools', // This path seems incorrect, should be a dedicated page.
    description: 'Convert text between different cases (e.g., camelCase, snake_case).',
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
    description: 'Beautify and indent HTML code.',
  },
  {
    slug: 'sql-formatter',
    name: 'SQL Formatter',
    category: 'Formatters',
    path: '/tools/sql-formatter',
    description: 'Beautify and indent SQL queries.',
  },
  {
    slug: 'yaml-formatter',
    name: 'YAML Formatter',
    category: 'Formatters',
    path: '/tools/yaml-formatter',
    description: 'Beautify and validate YAML data.',
  },
  {
    slug: 'csv-viewer-converter',
    name: 'CSV Viewer / Converter',
    category: 'Formatters',
    path: '/tools/csv-viewer-converter',
    description: 'View, format, and convert CSV data.',
  },

  // Generators
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    category: 'Generators',
    path: '/tools/hash-generator',
    description: 'Generate various cryptographic hashes (MD5, SHA1, SHA256, etc.).',
  },
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    category: 'Generators',
    path: '/tools/day-6-implement-uuid-password-generator-tools', // This path seems incorrect, should be a dedicated page.
    description: 'Generate universally unique identifiers (UUIDs).',
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    category: 'Generators',
    path: '/tools/day-6-implement-uuid-password-generator-tools', // This path seems incorrect, should be a dedicated page.
    description: 'Generate strong, random passwords.',
  },
  {
    slug: 'cron-expression-builder',
    name: 'Cron Expression Builder',
    category: 'Generators',
    path: '/tools/cron-expression-builder',
    description: 'Build and visualize cron job schedules.',
  },
  {
    slug: 'meta-tag-generator',
    name: 'Meta Tag Generator',
    category: 'Generators',
    path: '/tools/meta-tag-generator',
    description: 'Generate essential meta tags for SEO and social media.',
  },
  {
    slug: 'robots-txt-generator',
    name: 'Robots.txt Generator',
    category: 'Generators',
    path: '/tools/robots-txt-generator',
    description: 'Create a robots.txt file to manage web crawler access.',
  },
  {
    slug: 'sitemap-xml-generator',
    name: 'Sitemap XML Generator',
    category: 'Generators',
    path: '/tools/sitemap-xml-generator',
    description: 'Generate an XML sitemap for your website.',
  },
  {
    slug: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    category: 'Generators',
    path: '/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools', // This path seems incorrect, should be a dedicated page.
    description: 'Generate placeholder text for your designs and layouts.',
  },
  {
    slug: 'css-shadow-generator',
    name: 'CSS Shadow Generator',
    category: 'Generators',
    path: '/tools/day-4-implement-css-shadow-gradient-generator-tools', // This path seems incorrect, should be a dedicated page.
    description: 'Visually create and generate CSS box and text shadows.',
  },
  {
    slug: 'css-gradient-generator',
    name: 'CSS Gradient Generator',
    category: 'Generators',
    path: '/tools/day-4-implement-css-shadow-gradient-generator-tools', // This path seems incorrect, should be a dedicated page.
    description: 'Create beautiful CSS linear and radial gradients.',
  },

  // Web
  {
    slug: 'http-header-viewer',
    name: 'HTTP Header Viewer',
    category: 'Web',
    path: '/tools/http-header-viewer',
    description: 'View HTTP headers of any URL.',
  },
  {
    slug: 'websocket-tester',
    name: 'WebSocket Tester',
    category: 'Web',
    path: '/tools/websocket-tester',
    description: 'Connect to and test WebSocket endpoints.',
  },
  {
    slug: 'meta-tag-og-preview',
    name: 'Open Graph Preview',
    category: 'Web',
    path: '/tools/meta-tag-generator-og-preview',
    description: 'Preview how your links will look on social media.',
  },

  // Utilities
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    category: 'Utilities',
    path: '/tools/jwt-decoder',
    description: 'Decode and inspect JSON Web Tokens.',
  },
  {
    slug: 'hash-verifier',
    name: 'Hash Verifier',
    category: 'Utilities',
    path: '/tools/hash-verifier',
    description: 'Verify the integrity of files using hash comparison.',
  },
  {
    slug: 'regex-tester-generator',
    name: 'Regex Tester & Generator',
    category: 'Utilities',
    path: '/tools/regex-tester-generator',
    description: 'Test and build regular expressions.',
  },
  {
    slug: 'markdown-live-preview',
    name: 'Markdown Live Preview',
    category: 'Utilities',
    path: '/tools/markdown-live-preview',
    description: 'Write Markdown and see the live HTML preview.',
  },
  {
    slug: 'color-picker',
    name: 'Color Picker',
    category: 'Utilities',
    path: '/tools/color-picker',
    description: 'Select colors and get their codes in various formats.',
  },
  {
    slug: 'svg-optimizer-viewer',
    name: 'SVG Optimizer & Viewer',
    category: 'Utilities',
    path: '/tools/svg-optimizer-viewer',
    description: 'Optimize SVG files and preview their rendering.',
  },
  {
    slug: 'sql-playground',
    name: 'SQL Playground',
    category: 'Utilities',
    path: '/tools/sql-playground',
    description: 'Execute and test SQL queries against a mock in-memory database.',
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
  return tools.find((tool) => tool.slug === slug);
}

export const categoryIcons: Record<string, React.ElementType> = {
  Core: Star,
  Converters: Layers,
  Formatters: Code,
  Generators: Sparkles,
  Web: Terminal,
  Utilities: Settings,
  Security: Shield,
  Text: FileText,
  Numbers: Hash,
  Time: Clock,
  Images: Palette,
  // Data: Database, // Example for a new category, not used currently
};