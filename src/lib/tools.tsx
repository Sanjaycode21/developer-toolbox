// No direct icon imports here, as the Tool interface does not include an icon property.
// Icons are likely managed in the Sidebar component via a separate mapping.

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
}

export const tools: Tool[] = [
  // Text Tools
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Text",
    path: "/tools/case-converter",
    description: "Convert text between different cases (e.g., uppercase, lowercase, camelCase).",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Text",
    path: "/tools/lorem-ipsum-generator",
    description: "Generate placeholder text for your designs and layouts.",
  },
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Text",
    path: "/tools/markdown-live-preview",
    description: "Write Markdown and see the rendered HTML in real-time.",
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Text",
    path: "/tools/regex-tester-generator",
    description: "Test and build regular expressions with ease.",
  },

  // Converters
  {
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder / Decoder",
    category: "Converters",
    path: "/tools/base64-encoder-decoder",
    description: "Encode and decode Base64 strings.",
  },
  {
    slug: "base64-image-encoder-decoder",
    name: "Base64 Image Encoder / Decoder",
    category: "Converters",
    path: "/tools/base64-image-encoder-decoder",
    description: "Encode and decode images to/from Base64.",
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    category: "Converters",
    path: "/tools/url-encoder-decoder",
    description: "Encode and decode URL components.",
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Converters",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice versa.",
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer & Converter",
    category: "Converters",
    path: "/tools/csv-viewer-converter",
    description: "View, edit, and convert CSV data.",
  },

  // Generators
  {
    slug: "hash-generator",
    name: "Hash Generator",
    category: "Generators",
    path: "/tools/hash-generator",
    description: "Generate various cryptographic hashes (MD5, SHA1, SHA256, etc.).",
  },
  {
    slug: "uuid-password-generator",
    name: "UUID & Password Generator",
    category: "Generators",
    path: "/tools/uuid-password-generator",
    description: "Generate UUIDs and strong, random passwords.",
  },
  {
    slug: "cron-expression-builder",
    name: "Cron Expression Builder",
    category: "Generators",
    path: "/tools/cron-expression-builder",
    description: "Build and understand cron expressions easily.",
  },
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator",
    category: "Generators",
    path: "/tools/meta-tag-generator",
    description: "Generate essential meta tags for SEO and social media.",
  },
  {
    slug: "meta-tag-generator-og-preview",
    name: "Open Graph Preview",
    category: "Generators",
    path: "/tools/meta-tag-generator-og-preview",
    description: "Preview how your links will look when shared on social media.",
  },
  {
    slug: "robots-txt-generator",
    name: "Robots.txt Generator",
    category: "Generators",
    path: "/tools/robots-txt-generator",
    description: "Create a robots.txt file to manage crawler access.",
  },
  {
    slug: "sitemap-xml-generator",
    name: "Sitemap XML Generator",
    category: "Generators",
    path: "/tools/sitemap-xml-generator",
    description: "Generate an XML sitemap for your website.",
  },

  // Web Tools
  {
    slug: "http-header-viewer",
    name: "HTTP Header Viewer",
    category: "Web",
    path: "/tools/http-header-viewer",
    description: "View HTTP headers for any URL.",
  },
  {
    slug: "websocket-tester",
    name: "WebSocket Tester",
    category: "Web",
    path: "/tools/websocket-tester",
    description: "Connect to and test WebSocket endpoints.",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Web",
    path: "/tools/jwt-decoder",
    description: "Decode JSON Web Tokens to inspect their header, payload, and signature.",
  },

  // Formatters
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Formatters",
    path: "/tools/json-formatter",
    description: "Format and validate JSON data.",
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    category: "Formatters",
    path: "/tools/xml-formatter",
    description: "Format and validate XML data.",
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Formatters",
    path: "/tools/yaml-formatter",
    description: "Format and validate YAML data.",
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Formatters",
    path: "/tools/html-formatter",
    description: "Format and beautify HTML code.",
  },

  // Databases (New Category)
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "Databases",
    path: "/tools/sql-formatter",
    description: "Format and beautify SQL queries.",
  },
  {
    slug: "sql-playground",
    name: "SQL Playground",
    category: "Databases",
    path: "/tools/sql-playground",
    description: "Test and format SQL queries in a simulated environment.",
  },

  // Image & Graphics
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Image & Graphics",
    path: "/tools/color-picker",
    description: "Pick colors and get their HEX, RGB, HSL values.",
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer & Viewer",
    category: "Image & Graphics",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize and view SVG files.",
  },

  // Security & Hashing
  {
    slug: "hash-verifier",
    name: "Hash Verifier",
    category: "Security & Hashing",
    path: "/tools/hash-verifier",
    description: "Verify the integrity of files using hash comparisons.",
  },
];

// Helper functions (DO NOT MODIFY OR REMOVE)
export function toolsByCategory(): Record<string, Tool[]> {
  const categories: Record<string, Tool[]> = {};
  tools.forEach(tool => {
    if (!categories[tool.category]) {
      categories[tool.category] = [];
    }
    categories[tool.category].push(tool);
  });
  return categories;
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(tool => tool.slug === slug);
}