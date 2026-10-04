export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
}

export const tools: Tool[] = [
  {
    slug: 'favorites',
    name: 'Favorites',
    category: 'General',
    path: '/tools/favorites',
    description: 'Your most loved and frequently used tools.',
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
    slug: 'base64-image-encoder-decoder',
    name: 'Base64 Image Encoder / Decoder',
    category: 'Converters & Encoders',
    path: '/tools/base64-image-encoder-decoder',
    description: 'Encode and decode images to/from Base64.',
  },
  {
    slug: 'url-encoder-decoder',
    name: 'URL Encoder / Decoder',
    category: 'Converters & Encoders',
    path: '/tools/url-encoder-decoder',
    description: 'Encode and decode URL components.',
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    category: 'Converters & Encoders',
    path: '/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools',
    description: 'Convert text between different cases (e.g., camelCase, snake_case).',
  },
  {
    slug: 'unix-timestamp-epoch-converter',
    name: 'Unix Timestamp & Epoch Converter',
    category: 'Converters & Encoders',
    path: '/tools/unix-timestamp-epoch-converter',
    description: 'Convert Unix timestamps to human-readable dates and vice versa.',
  },
  // Generators
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    category: 'Generators',
    path: '/tools/day-6-implement-uuid-password-generator-tools',
    description: 'Generate universally unique identifiers (UUIDs).',
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    category: 'Generators',
    path: '/tools/day-6-implement-uuid-password-generator-tools',
    description: 'Create strong, random passwords.',
  },
  {
    slug: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    category: 'Generators',
    path: '/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools',
    description: 'Generate placeholder text for your designs and layouts.',
  },
  {
    slug: 'cron-expression-builder',
    name: 'Cron Expression Builder',
    category: 'Generators',
    path: '/tools/cron-expression-builder',
    description: 'Build and understand cron expressions easily.',
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
    name: 'Open Graph Preview',
    category: 'Generators',
    path: '/tools/meta-tag-generator-og-preview',
    description: 'Preview how your links will look when shared on social media.',
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
    slug: 'css-shadow-gradient-generator',
    name: 'CSS Shadow & Gradient Generator',
    category: 'Generators',
    path: '/tools/day-4-implement-css-shadow-gradient-generator-tools',
    description: 'Generate complex CSS box shadows and gradients.',
  },
  // Formatters & Validators
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    category: 'Formatters & Validators',
    path: '/tools/json-formatter',
    description: 'Beautify or minify JSON data.',
  },
  {
    slug: 'xml-formatter',
    name: 'XML Formatter',
    category: 'Formatters & Validators',
    path: '/tools/xml-formatter',
    description: 'Beautify or minify XML data.',
  },
  {
    slug: 'yaml-formatter',
    name: 'YAML Formatter',
    category: 'Formatters & Validators',
    path: '/tools/yaml-formatter',
    description: 'Beautify or convert YAML data.',
  },
  {
    slug: 'html-formatter',
    name: 'HTML Formatter',
    category: 'Formatters & Validators',
    path: '/tools/html-formatter',
    description: 'Beautify or minify HTML code.',
  },
  {
    slug: 'sql-formatter',
    name: 'SQL Formatter',
    category: 'Formatters & Validators',
    path: '/tools/sql-formatter',
    description: 'Format SQL queries for readability.',
  },
  {
    slug: 'markdown-live-preview',
    name: 'Markdown Live Preview',
    category: 'Formatters & Validators',
    path: '/tools/markdown-live-preview',
    description: 'Write and preview Markdown in real-time.',
  },
  {
    slug: 'regex-tester-generator',
    name: 'Regex Tester & Generator',
    category: 'Formatters & Validators',
    path: '/tools/regex-tester-generator',
    description: 'Test and build regular expressions.',
  },
  // Cryptography
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    category: 'Cryptography',
    path: '/tools/hash-generator',
    description: 'Generate various cryptographic hashes (MD5, SHA1, SHA256, etc.).',
  },
  {
    slug: 'hash-verifier',
    name: 'Hash Verifier',
    category: 'Cryptography',
    path: '/tools/hash-verifier',
    description: 'Verify the integrity of files or text using hash comparisons.',
  },
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    category: 'Cryptography',
    path: '/tools/jwt-decoder',
    description: 'Decode and inspect JSON Web Tokens.',
  },
  // Network
  {
    slug: 'http-header-viewer',
    name: 'HTTP Header Viewer',
    category: 'Network',
    path: '/tools/http-header-viewer',
    description: 'View HTTP headers of any URL.',
  },
  {
    slug: 'websocket-tester',
    name: 'WebSocket Tester',
    category: 'Network',
    path: '/tools/websocket-tester',
    description: 'Connect to and test WebSocket endpoints.',
  },
  // Utilities
  {
    slug: 'color-picker',
    name: 'Color Picker',
    category: 'Utilities',
    path: '/tools/color-picker',
    description: 'Select and convert colors with ease.',
  },
  {
    slug: 'csv-viewer-converter',
    name: 'CSV Viewer & Converter',
    category: 'Utilities',
    path: '/tools/csv-viewer-converter',
    description: 'View, edit, and convert CSV data.',
  },
  {
    slug: 'svg-optimizer-viewer',
    name: 'SVG Optimizer & Viewer',
    category: 'Utilities',
    path: '/tools/svg-optimizer-viewer',
    description: 'Optimize and preview SVG files.',
  },
  // Database
  {
    slug: 'sql-playground',
    name: 'SQL Playground',
    category: 'Database',
    path: '/tools/sql-playground',
    description: 'Execute and test SQL queries in a browser-based environment.',
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
  return tools.find((tool) => tool.slug === slug);
}