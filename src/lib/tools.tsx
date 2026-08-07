import { Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search } from 'lucide-react';

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
}

export const tools: Tool[] = [
  {
    slug: 'base64-encoder-decoder',
    name: 'Base64 Encoder / Decoder',
    category: 'Encoders / Decoders',
    path: '/tools/base64-encoder-decoder',
    description: 'Encode and decode Base64 strings.',
  },
  {
    slug: 'base64-image-encoder-decoder',
    name: 'Base64 Image Encoder / Decoder',
    category: 'Encoders / Decoders',
    path: '/tools/base64-image-encoder-decoder',
    description: 'Encode and decode images to/from Base64.',
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    category: 'Text',
    path: '/tools/case-converter',
    description: 'Convert text to various case formats (e.g., uppercase, lowercase, camelCase).',
  },
  {
    slug: 'color-picker',
    name: 'Color Picker',
    category: 'Utilities',
    path: '/tools/color-picker',
    description: 'Pick colors and convert between HEX, RGB, HSL formats.',
  },
  {
    slug: 'csv-viewer-converter',
    name: 'CSV Viewer / Converter',
    category: 'Data',
    path: '/tools/csv-viewer-converter',
    description: 'View and convert CSV data to other formats like JSON or XML.',
  },
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    category: 'Security',
    path: '/tools/hash-generator',
    description: 'Generate various cryptographic hashes (MD5, SHA1, SHA256, etc.).',
  },
  {
    slug: 'hash-verifier',
    name: 'Hash Verifier',
    category: 'Security',
    path: '/tools/hash-verifier',
    description: 'Verify the integrity of data using hash comparison.',
  },
  {
    slug: 'html-formatter',
    name: 'HTML Formatter',
    category: 'Formatters',
    path: '/tools/html-formatter',
    description: 'Beautify and format HTML code for better readability.',
  },
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    category: 'Formatters',
    path: '/tools/json-formatter',
    description: 'Beautify and validate JSON data.',
  },
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    category: 'Security',
    path: '/tools/jwt-decoder',
    description: 'Decode JSON Web Tokens to inspect header, payload, and verify signature.',
  },
  {
    slug: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    category: 'Text',
    path: '/tools/lorem-ipsum-generator',
    description: 'Generate placeholder text for your designs and prototypes.',
  },
  {
    slug: 'markdown-live-preview',
    name: 'Markdown Live Preview',
    category: 'Text',
    path: '/tools/markdown-live-preview',
    description: 'Write Markdown and see the live HTML preview.',
  },
  {
    slug: 'meta-tag-generator',
    name: 'Meta Tag Generator & OG Preview',
    category: 'SEO',
    path: '/tools/meta-tag-generator',
    description: 'Generate essential meta tags for SEO and social media, and preview Open Graph & Twitter cards.',
  },
  {
    slug: 'regex-tester-generator',
    name: 'Regex Tester & Generator',
    category: 'Text',
    path: '/tools/regex-tester-generator',
    description: 'Test and generate regular expressions with ease.',
  },
  {
    slug: 'robots-txt-generator',
    name: 'Robots.txt Generator',
    category: 'SEO',
    path: '/tools/robots-txt-generator',
    description: 'Generate a robots.txt file to manage crawler access to your site.',
  },
  {
    slug: 'sitemap-xml-generator',
    name: 'Sitemap XML Generator',
    category: 'SEO',
    path: '/tools/sitemap-xml-generator',
    description: 'Create an XML sitemap for your website to help search engines crawl it.',
  },
  {
    slug: 'sql-formatter',
    name: 'SQL Formatter',
    category: 'Formatters',
    path: '/tools/sql-formatter',
    description: 'Beautify and format SQL queries for better readability.',
  },
  {
    slug: 'svg-optimizer-viewer',
    name: 'SVG Optimizer / Viewer',
    category: 'Images',
    path: '/tools/svg-optimizer-viewer',
    description: 'Optimize and view SVG files.',
  },
  {
    slug: 'unix-timestamp-epoch-converter',
    name: 'Unix Timestamp & Epoch Converter',
    category: 'Date & Time',
    path: '/tools/unix-timestamp-epoch-converter',
    description: 'Convert Unix timestamps to human-readable dates and vice versa.',
  },
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    category: 'Generators',
    path: '/tools/uuid-generator',
    description: 'Generate universally unique identifiers (UUIDs) in various versions.',
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    category: 'Generators',
    path: '/tools/password-generator',
    description: 'Create strong, random passwords with customizable options.',
  },
  {
    slug: 'xml-formatter',
    name: 'XML Formatter',
    category: 'Formatters',
    path: '/tools/xml-formatter',
    description: 'Beautify and validate XML data.',
  },
  {
    slug: 'yaml-formatter',
    name: 'YAML Formatter',
    category: 'Formatters',
    path: '/tools/yaml-formatter',
    description: 'Beautify and validate YAML data.',
  },
];

// Helper functions (MUST be preserved exactly as functions)
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