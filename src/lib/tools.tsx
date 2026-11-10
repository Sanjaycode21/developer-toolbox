import {
  Code,
  Hash,
  Binary,
  Palette,
  FileText,
  Layers,
  Calendar,
  Clock,
  Key,
  Terminal,
  Search,
  Sparkles,
  Shield,
  Type,
  Image,
  List,
  Table,
  ScrollText,
  Link,
  Brackets,
  SquareCode,
  MessageSquareCode,
  Database, // Added Database icon
} from 'lucide-react';

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
}

export const tools: Tool[] = [
  // Text Manipulators
  {
    slug: 'case-converter',
    name: 'Case Converter',
    category: 'Text Manipulators',
    path: '/tools/case-converter',
    description: 'Convert text to different cases: lowercase, uppercase, camelCase, PascalCase, etc.',
  },
  {
    slug: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    category: 'Text Manipulators',
    path: '/tools/lorem-ipsum-generator',
    description: 'Generate placeholder text for your designs and layouts.',
  },
  {
    slug: 'markdown-live-preview',
    name: 'Markdown Live Preview',
    category: 'Text Manipulators',
    path: '/tools/markdown-live-preview',
    description: 'Write and preview Markdown in real-time.',
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
    slug: 'url-encoder-decoder',
    name: 'URL Encoder / Decoder',
    category: 'Converters',
    path: '/tools/url-encoder-decoder',
    description: 'Encode and decode URLs.',
  },
  {
    slug: 'unix-timestamp-epoch-converter',
    name: 'Unix Timestamp & Epoch Converter',
    category: 'Converters',
    path: '/tools/unix-timestamp-epoch-converter',
    description: 'Convert Unix timestamps to human-readable dates and vice versa.',
  },
  {
    slug: 'csv-viewer-converter',
    name: 'CSV Viewer / Converter',
    category: 'Converters',
    path: '/tools/csv-viewer-converter',
    description: 'View and convert CSV data to other formats like JSON or XML.',
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
    slug: 'uuid-password-generator',
    name: 'UUID & Password Generator',
    category: 'Generators',
    path: '/tools/uuid-password-generator',
    description: 'Generate UUIDs and strong, random passwords.',
  },
  {
    slug: 'cron-expression-builder',
    name: 'Cron Expression Builder',
    category: 'Generators',
    path: '/tools/cron-expression-builder',
    description: 'Build and visualize cron expressions easily.',
  },
  {
    slug: 'meta-tag-generator',
    name: 'Meta Tag Generator',
    category: 'Generators',
    path: '/tools/meta-tag-generator',
    description: 'Generate essential meta tags for SEO and social media.',
  },
  {
    slug: 'meta-tag-generator-og-preview',
    name: 'Open Graph Previewer',
    category: 'Generators',
    path: '/tools/meta-tag-generator-og-preview',
    description: 'Preview how your website will look when shared on social media.',
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
  // Formatters
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    category: 'Formatters',
    path: '/tools/json-formatter',
    description: 'Format and validate JSON data.',
  },
  {
    slug: 'xml-formatter',
    name: 'XML Formatter',
    category: 'Formatters',
    path: '/tools/xml-formatter',
    description: 'Format and validate XML data.',
  },
  {
    slug: 'html-formatter',
    name: 'HTML Formatter',
    category: 'Formatters',
    path: '/tools/html-formatter',
    description: 'Format and beautify HTML code.',
  },
  {
    slug: 'sql-formatter',
    name: 'SQL Formatter',
    category: 'Formatters',
    path: '/tools/sql-formatter',
    description: 'Format and beautify SQL queries.',
  },
  {
    slug: 'yaml-formatter',
    name: 'YAML Formatter',
    category: 'Formatters',
    path: '/tools/yaml-formatter',
    description: 'Format and validate YAML data.',
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
    description: 'Test WebSocket connections and send/receive messages.',
  },
  {
    slug: 'regex-tester-generator',
    name: 'Regex Tester & Generator',
    category: 'Web Utilities',
    path: '/tools/regex-tester-generator',
    description: 'Test and generate regular expressions.',
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
    description: 'Optimize and view SVG files.',
  },
  // Cryptography
  {
    slug: 'hash-verifier',
    name: 'Hash Verifier',
    category: 'Cryptography',
    path: '/tools/hash-verifier',
    description: 'Verify the integrity of files using hash comparisons.',
  },
  // Design & UI
  {
    slug: 'color-picker',
    name: 'Color Picker',
    category: 'Design & UI',
    path: '/tools/color-picker',
    description: 'Pick colors and convert between HEX, RGB, HSL formats.',
  },
  {
    slug: 'css-shadow-gradient-generator',
    name: 'CSS Shadow & Gradient Generator',
    category: 'Design & UI',
    path: '/tools/day-4-implement-css-shadow-gradient-generator-tools', // This path seems incorrect, should be fixed to match slug
    description: 'Generate complex CSS box shadows and gradients.',
  },
  // Database
  {
    slug: 'sql-playground',
    name: 'SQL Playground',
    category: 'Database',
    path: '/tools/sql-playground',
    description: 'Execute and test SQL queries in a client-side environment.',
  },
];

export const toolIcons: Record<string, React.ElementType> = {
  'base64-encoder-decoder': Binary,
  'base64-image-encoder-decoder': Image,
  'case-converter': Type,
  'color-picker': Palette,
  'cron-expression-builder': Calendar,
  'csv-viewer-converter': Table,
  'css-shadow-gradient-generator': Sparkles,
  'hash-generator': Hash,
  'hash-verifier': Shield,
  'html-formatter': Code,
  'http-header-viewer': Layers,
  'json-formatter': Brackets,
  'jwt-decoder': Key,
  'lorem-ipsum-generator': ScrollText,
  'markdown-live-preview': MessageSquareCode,
  'meta-tag-generator': Link,
  'meta-tag-generator-og-preview': Search,
  'regex-tester-generator': Terminal,
  'robots-txt-generator': Shield,
  'sitemap-xml-generator': List,
  'sql-formatter': SquareCode,
  'sql-playground': Database, // Using Database icon for SQL Playground
  'svg-optimizer-viewer': Image,
  'unix-timestamp-epoch-converter': Clock,
  'url-encoder-decoder': Link,
  'uuid-password-generator': Key,
  'websocket-tester': Terminal,
  'xml-formatter': Code,
  'yaml-formatter': FileText,
};

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