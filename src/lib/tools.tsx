import {
  Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search,
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
  // Favorites & History
  {
    slug: 'favorites',
    name: 'Favorites',
    category: 'General',
    path: '/tools/favorites',
    description: 'Your most loved tools, all in one place.',
  },
  {
    slug: 'history',
    name: 'History',
    category: 'General',
    path: '/tools/history',
    description: 'Recently used tools for quick access.',
  },

  // Converters & Encoders
  {
    slug: 'base64-encoder-decoder',
    name: 'Base64 Encoder / Decoder',
    category: 'Converters & Encoders',
    path: '/tools/base64-encoder-decoder',
    description: 'Encode and decode Base64 strings.',
  },
  {
    slug: 'url-encoder-decoder',
    name: 'URL Encoder / Decoder',
    category: 'Converters & Encoders',
    path: '/tools/url-encoder-decoder',
    description: 'Encode and decode URLs.',
  },
  {
    slug: 'base64-image-encoder-decoder',
    name: 'Base64 Image Encoder / Decoder',
    category: 'Converters & Encoders',
    path: '/tools/base64-image-encoder-decoder',
    description: 'Convert images to Base64 and vice-versa.',
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    category: 'Converters & Encoders',
    path: '/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools', // This path needs to be updated if the file is renamed
    description: 'Convert text to various cases (e.g., camelCase, snake_case).',
  },
  {
    slug: 'unix-timestamp-epoch-converter',
    name: 'Unix Timestamp & Epoch Converter',
    category: 'Converters & Encoders',
    path: '/tools/unix-timestamp-epoch-converter',
    description: 'Convert Unix timestamps to human-readable dates and vice-versa.',
  },

  // Text & String
  {
    slug: 'markdown-live-preview',
    name: 'Markdown Live Preview',
    category: 'Text & String',
    path: '/tools/markdown-live-preview',
    description: 'Write and preview Markdown in real-time.',
  },
  {
    slug: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    category: 'Text & String',
    path: '/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools', // This path needs to be updated if the file is renamed
    description: 'Generate placeholder text for your designs and prototypes.',
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
    description: 'Beautify and format HTML code.',
  },
  {
    slug: 'sql-formatter',
    name: 'SQL Formatter',
    category: 'Formatters',
    path: '/tools/sql-formatter',
    description: 'Beautify and format SQL queries.',
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
    path: '/tools/day-6-implement-uuid-password-generator-tools', // This path needs to be updated if the file is renamed
    description: 'Generate universally unique identifiers (UUIDs).',
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    category: 'Generators',
    path: '/tools/day-6-implement-uuid-password-generator-tools', // This path needs to be updated if the file is renamed
    description: 'Generate strong, random passwords.',
  },
  {
    slug: 'meta-tag-generator',
    name: 'Meta Tag Generator',
    category: 'Generators',
    path: '/tools/meta-tag-generator',
    description: 'Generate essential meta tags for SEO.',
  },
  {
    slug: 'meta-tag-generator-og-preview',
    name: 'Open Graph Meta Tag Generator & Preview',
    category: 'Generators',
    path: '/tools/meta-tag-generator-og-preview',
    description: 'Generate Open Graph meta tags and preview how your content will look when shared on social media.',
  },
  {
    slug: 'robots-txt-generator',
    name: 'Robots.txt Generator',
    category: 'Generators',
    path: '/tools/robots-txt-generator',
    description: 'Create a robots.txt file to manage crawler access.',
  },
  {
    slug: 'sitemap-xml-generator',
    name: 'Sitemap XML Generator',
    category: 'Generators',
    path: '/tools/sitemap-xml-generator',
    description: 'Generate an XML sitemap for your website.',
  },
  {
    slug: 'cron-expression-builder',
    name: 'Cron Expression Builder',
    category: 'Generators',
    path: '/tools/cron-expression-builder',
    description: 'Build and understand cron job schedules.',
  },
  {
    slug: 'css-shadow-generator',
    name: 'CSS Shadow Generator',
    category: 'Generators',
    path: '/tools/day-4-implement-css-shadow-gradient-generator-tools', // This path needs to be updated if the file is renamed
    description: 'Generate complex CSS box and text shadows.',
  },
  {
    slug: 'css-gradient-generator',
    name: 'CSS Gradient Generator',
    category: 'Generators',
    path: '/tools/day-4-implement-css-shadow-gradient-generator-tools', // This path needs to be updated if the file is renamed
    description: 'Create beautiful CSS linear and radial gradients.',
  },

  // Web Utilities
  {
    slug: 'http-header-viewer',
    name: 'HTTP Header Viewer',
    category: 'Web Utilities',
    path: '/tools/http-header-viewer',
    description: 'View HTTP headers of any URL.',
  },
  {
    slug: 'websocket-tester',
    name: 'WebSocket Tester',
    category: 'Web Utilities',
    path: '/tools/websocket-tester',
    description: 'Connect to and test WebSocket endpoints.',
  },
  {
    slug: 'regex-tester-generator',
    name: 'Regex Tester & Generator',
    category: 'Web Utilities',
    path: '/tools/regex-tester-generator',
    description: 'Test and build regular expressions.',
  },
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    category: 'Web Utilities',
    path: '/tools/jwt-decoder',
    description: 'Decode and inspect JSON Web Tokens.',
  },
  {
    slug: 'svg-optimizer-viewer',
    name: 'SVG Optimizer & Viewer',
    category: 'Web Utilities',
    path: '/tools/svg-optimizer-viewer',
    description: 'Optimize and preview SVG files.',
  },

  // Cryptography
  {
    slug: 'hash-verifier',
    name: 'Hash Verifier',
    category: 'Cryptography',
    path: '/tools/hash-verifier',
    description: 'Verify the integrity of files using hash comparisons.',
  },

  // Design & Graphics
  {
    slug: 'color-picker',
    name: 'Color Picker',
    category: 'Design & Graphics',
    path: '/tools/color-picker',
    description: 'Select colors and get their codes in various formats.',
  },

  // Database
  {
    slug: 'sql-playground',
    name: 'SQL Playground',
    category: 'Database',
    path: '/tools/sql-playground',
    description: 'Execute and test SQL queries against a mock in-memory database.',
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

export function searchTools(query: string): Tool[] {
  const lowerCaseQuery = query.toLowerCase();
  return tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(lowerCaseQuery) ||
      tool.description.toLowerCase().includes(lowerCaseQuery) ||
      tool.category.toLowerCase().includes(lowerCaseQuery)
  );
}