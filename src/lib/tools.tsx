import {
  Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search, Image, UploadCloud, Globe,
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
    description: 'Convert Unix timestamps to human-readable dates and vice versa.',
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    category: 'Converters',
    path: '/tools/case-converter',
    description: 'Convert text between different casing styles (e.g., camelCase, snake_case).',
  },
  {
    slug: 'csv-viewer-converter',
    name: 'CSV Viewer & Converter',
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
    description: 'Generate various cryptographic hashes (MD5, SHA1, SHA256, etc.).',
  },
  {
    slug: 'uuid-password-generator',
    name: 'UUID & Password Generator',
    category: 'Generators',
    path: '/tools/uuid-password-generator',
    description: 'Generate strong passwords and UUIDs (v1, v4, v5).',
  },
  {
    slug: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    category: 'Generators',
    path: '/tools/lorem-ipsum-generator',
    description: 'Generate placeholder text for your designs and prototypes.',
  },
  {
    slug: 'robots-txt-generator',
    name: 'Robots.txt Generator',
    category: 'Generators',
    path: '/tools/robots-txt-generator',
    description: 'Create a robots.txt file to manage search engine crawling.',
  },
  {
    slug: 'sitemap-xml-generator',
    name: 'Sitemap XML Generator',
    category: 'Generators',
    path: '/tools/sitemap-xml-generator',
    description: 'Generate an XML sitemap for your website to help with SEO.',
  },
  {
    slug: 'css-shadow-gradient-generator',
    name: 'CSS Shadow & Gradient Generator',
    category: 'Generators',
    path: '/tools/css-shadow-gradient-generator',
    description: 'Generate complex CSS box shadows and linear/radial gradients.',
  },

  // Formatters & Optimizers
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    category: 'Formatters & Optimizers',
    path: '/tools/json-formatter',
    description: 'Beautify or minify JSON data.',
  },
  {
    slug: 'xml-formatter',
    name: 'XML Formatter',
    category: 'Formatters & Optimizers',
    path: '/tools/xml-formatter',
    description: 'Beautify or minify XML data.',
  },
  {
    slug: 'html-formatter',
    name: 'HTML Formatter',
    category: 'Formatters & Optimizers',
    path: '/tools/html-formatter',
    description: 'Beautify or minify HTML code.',
  },
  {
    slug: 'sql-formatter',
    name: 'SQL Formatter',
    category: 'Formatters & Optimizers',
    path: '/tools/sql-formatter',
    description: 'Format SQL queries for better readability.',
  },
  {
    slug: 'yaml-formatter',
    name: 'YAML Formatter',
    category: 'Formatters & Optimizers',
    path: '/tools/yaml-formatter',
    description: 'Format YAML data for better readability.',
  },
  {
    slug: 'markdown-live-preview',
    name: 'Markdown Live Preview',
    category: 'Formatters & Optimizers',
    path: '/tools/markdown-live-preview',
    description: 'Write Markdown and see the live HTML preview.',
  },
  {
    slug: 'svg-optimizer-viewer',
    name: 'SVG Optimizer & Viewer',
    category: 'Formatters & Optimizers',
    path: '/tools/svg-optimizer-viewer',
    description: 'Optimize SVG files by removing unnecessary data and view the result.',
  },

  // Web & Security
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    category: 'Web & Security',
    path: '/tools/jwt-decoder',
    description: 'Decode JWT tokens to inspect header, payload, and verify signature.',
  },
  {
    slug: 'hash-verifier',
    name: 'Hash Verifier',
    category: 'Web & Security',
    path: '/tools/hash-verifier',
    description: 'Verify the integrity of files using various hash algorithms.',
  },
  {
    slug: 'regex-tester-generator',
    name: 'Regex Tester & Generator',
    category: 'Web & Security',
    path: '/tools/regex-tester-generator',
    description: 'Test and generate regular expressions with live matching.',
  },

  // Design & UI
  {
    slug: 'color-picker',
    name: 'Color Picker',
    category: 'Design & UI',
    path: '/tools/color-picker',
    description: 'Pick colors, convert formats (HEX, RGB, HSL), and generate palettes.',
  },
];

// Helper function to get tool by slug
export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

// Helper function to group tools by category
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

// Helper function to get category icon
export function getCategoryIcon(category: string): React.ElementType {
  switch (category) {
    case 'General':
      return Layers;
    case 'Converters':
      return Binary;
    case 'Generators':
      return Sparkles;
    case 'Formatters & Optimizers':
      return Code;
    case 'Web & Security':
      return Shield;
    case 'Design & UI':
      return Palette;
    default:
      return Settings;
  }
}

// Helper function to get tool icon
export function getToolIcon(slug: string): React.ElementType {
  switch (slug) {
    case 'favorites':
      return Star;
    case 'history':
      return History;
    case 'base64-encoder-decoder':
      return Code;
    case 'base64-image-encoder-decoder':
      return Image;
    case 'unix-timestamp-epoch-converter':
      return Clock;
    case 'case-converter':
      return FileText;
    case 'csv-viewer-converter':
      return FileText;
    case 'hash-generator':
      return Hash;
    case 'uuid-password-generator':
      return Key;
    case 'lorem-ipsum-generator':
      return FileText;
    case 'robots-txt-generator':
      return Terminal;
    case 'sitemap-xml-generator':
      return Globe;
    case 'css-shadow-gradient-generator':
      return Palette;
    case 'json-formatter':
      return Code;
    case 'xml-formatter':
      return Code;
    case 'html-formatter':
      return Code;
    case 'sql-formatter':
      return Code;
    case 'yaml-formatter':
      return Code;
    case 'markdown-live-preview':
      return FileText;
    case 'svg-optimizer-viewer':
      return UploadCloud; // Using UploadCloud for SVG Optimizer & Viewer
    case 'jwt-decoder':
      return Shield;
    case 'hash-verifier':
      return Search;
    case 'regex-tester-generator':
      return Search;
    case 'color-picker':
      return Palette;
    default:
      return Settings;
  }
}