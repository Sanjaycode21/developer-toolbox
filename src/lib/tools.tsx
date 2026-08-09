import {
  Code,
  History,
  Star,
  Hash,
  FileText,
  Binary,
  Palette,
  Layers,
  Search,
  Calendar,
  Sparkles,
  Clock,
  Key,
  Terminal,
  Shield,
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
    category: 'Quick Access',
    path: '/tools/favorites',
    description: 'Your most loved and frequently used tools.',
  },
  {
    slug: 'history',
    name: 'History',
    category: 'Quick Access',
    path: '/tools/history',
    description: 'Recently used tools for quick navigation.',
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
    slug: 'unix-timestamp-epoch-converter',
    name: 'Unix Timestamp & Epoch Converter',
    category: 'Converters',
    path: '/tools/unix-timestamp-epoch-converter',
    description: 'Convert Unix timestamps to human-readable dates and vice-versa.',
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    category: 'Converters',
    path: '/tools/case-converter',
    description: 'Convert text to different cases: lowercase, uppercase, camelCase, etc.',
  },
  // Formatters
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    category: 'Formatters',
    path: '/tools/json-formatter',
    description: 'Beautify or minify JSON data.',
  },
  {
    slug: 'xml-formatter',
    name: 'XML Formatter',
    category: 'Formatters',
    path: '/tools/xml-formatter',
    description: 'Beautify or minify XML data.',
  },
  {
    slug: 'html-formatter',
    name: 'HTML Formatter',
    category: 'Formatters',
    path: '/tools/html-formatter',
    description: 'Beautify or minify HTML code.',
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
    description: 'Beautify or convert YAML data.',
  },
  // Generators
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    category: 'Generators',
    path: '/tools/hash-generator',
    description: 'Generate various hash types like MD5, SHA1, SHA256, etc.',
  },
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    category: 'Generators',
    path: '/tools/uuid-generator',
    description: 'Generate universally unique identifiers (UUIDs) v1 and v4.',
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    category: 'Generators',
    path: '/tools/password-generator',
    description: 'Create strong, random passwords with customizable options.',
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
    description: 'Generate complex CSS box and text shadows with live preview.',
  },
  {
    slug: 'css-gradient-generator',
    name: 'CSS Gradient Generator',
    category: 'Generators',
    path: '/tools/css-gradient-generator',
    description: 'Create beautiful CSS linear and radial gradients.',
  },
  {
    slug: 'meta-tag-generator',
    name: 'Meta Tag Generator & OG Preview',
    category: 'Generators',
    path: '/tools/meta-tag-generator',
    description: 'Generate essential meta tags for SEO and social media, with a live Open Graph preview.',
  },
  {
    slug: 'robots-txt-generator',
    name: 'Robots.txt Generator',
    category: 'Generators',
    path: '/tools/robots-txt-generator',
    description: 'Create a robots.txt file to manage crawler access to your site.',
  },
  {
    slug: 'sitemap-xml-generator',
    name: 'Sitemap XML Generator',
    category: 'Generators',
    path: '/tools/sitemap-xml-generator',
    description: 'Generate an XML sitemap for your website to help with SEO.',
  },
  // Web Utilities
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    category: 'Web Utilities',
    path: '/tools/jwt-decoder',
    description: 'Decode JWT tokens to inspect header, payload, and verify signature.',
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
    slug: 'regex-tester-generator',
    name: 'Regex Tester & Generator',
    category: 'Web Utilities',
    path: '/tools/regex-tester-generator',
    description: 'Test and generate regular expressions.',
  },
  {
    slug: 'svg-optimizer-viewer',
    name: 'SVG Optimizer & Viewer',
    category: 'Web Utilities',
    path: '/tools/svg-optimizer-viewer',
    description: 'Optimize SVG files and preview their content.',
  },
  {
    slug: 'csv-viewer-converter',
    name: 'CSV Viewer & Converter',
    category: 'Web Utilities',
    path: '/tools/csv-viewer-converter',
    description: 'View, edit, and convert CSV data to other formats.',
  },
  // Cryptography
  {
    slug: 'hash-verifier',
    name: 'Hash Verifier',
    category: 'Cryptography',
    path: '/tools/hash-verifier',
    description: 'Verify the integrity of files using various hash algorithms.',
  },
  // Color Tools
  {
    slug: 'color-picker',
    name: 'Color Picker',
    category: 'Color Tools',
    path: '/tools/color-picker',
    description: 'Select colors and get their HEX, RGB, HSL values.',
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
  'Quick Access': Star,
  'Converters': Binary,
  'Formatters': Code,
  'Generators': Sparkles,
  'Web Utilities': Layers,
  'Cryptography': Shield,
  'Color Tools': Palette,
};