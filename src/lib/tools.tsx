// Removed specific icon imports as they are not part of the Tool interface
// The sidebar component will handle icon rendering based on category/slug.

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
}

export const tools: Tool[] = [
  // Converters
  {
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder / Decoder",
    category: "Converters",
    path: "/tools/base64-encoder-decoder",
    description: "Encode and decode Base64 strings.",
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    category: "Converters",
    path: "/tools/url-encoder-decoder",
    description: "Encode and decode URL components.",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Converters",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools", // This path needs to be updated to the actual page for case converter
    description: "Convert text to various cases (e.g., camelCase, snake_case).",
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Converters",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice versa.",
  },
  {
    slug: "base64-image-encoder-decoder",
    name: "Base64 Image Encoder / Decoder",
    category: "Converters",
    path: "/tools/base64-image-encoder-decoder",
    description: "Encode and decode images to/from Base64 data URIs.",
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
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Formatters",
    path: "/tools/html-formatter",
    description: "Format and beautify HTML code.",
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "Formatters",
    path: "/tools/sql-formatter",
    description: "Format and beautify SQL queries.",
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Formatters",
    path: "/tools/yaml-formatter",
    description: "Format and validate YAML data.",
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer / Converter",
    category: "Formatters",
    path: "/tools/csv-viewer-converter",
    description: "View, format, and convert CSV data.",
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
    slug: "uuid-generator",
    name: "UUID Generator",
    category: "Generators",
    path: "/tools/day-6-implement-uuid-password-generator-tools", // This path needs to be updated
    description: "Generate universally unique identifiers (UUIDs).",
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "Generators",
    path: "/tools/day-6-implement-uuid-password-generator-tools", // This path needs to be updated
    description: "Generate strong, random passwords.",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Generators",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools", // This path needs to be updated
    description: "Generate placeholder text for your designs.",
  },
  {
    slug: "cron-expression-builder",
    name: "Cron Expression Builder",
    category: "Generators",
    path: "/tools/cron-expression-builder",
    description: "Build and understand cron job schedules.",
  },
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator",
    category: "Generators",
    path: "/tools/meta-tag-generator",
    description: "Generate essential meta tags for SEO.",
  },
  {
    slug: "meta-tag-generator-og-preview",
    name: "Open Graph Meta Tag Generator & Preview",
    category: "Generators",
    path: "/tools/meta-tag-generator-og-preview",
    description: "Generate Open Graph meta tags and preview how your content will look when shared.",
  },
  {
    slug: "robots-txt-generator",
    name: "Robots.txt Generator",
    category: "Generators",
    path: "/tools/robots-txt-generator",
    description: "Create a robots.txt file to manage web crawler access.",
  },
  {
    slug: "sitemap-xml-generator",
    name: "Sitemap XML Generator",
    category: "Generators",
    path: "/tools/sitemap-xml-generator",
    description: "Generate an XML sitemap for your website.",
  },
  {
    slug: "css-shadow-generator",
    name: "CSS Shadow Generator",
    category: "Generators",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools", // This path needs to be updated
    description: "Generate complex CSS box and text shadows.",
  },
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Generator",
    category: "Generators",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools", // This path needs to be updated
    description: "Create beautiful CSS linear and radial gradients.",
  },

  // Data & API
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Data & API",
    path: "/tools/jwt-decoder",
    description: "Decode and inspect JSON Web Tokens.",
  },
  {
    slug: "http-header-viewer",
    name: "HTTP Header Viewer",
    category: "Data & API",
    path: "/tools/http-header-viewer",
    description: "View HTTP headers of any URL.",
  },
  {
    slug: "websocket-tester",
    name: "WebSocket Tester",
    category: "Data & API",
    path: "/tools/websocket-tester",
    description: "Test WebSocket connections and send/receive messages.",
  },
  {
    slug: "sql-playground",
    name: "SQL Playground",
    category: "Data & API",
    path: "/tools/sql-playground",
    description: "Experiment with SQL queries against a mock database.",
  },

  // Utilities
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Utilities",
    path: "/tools/regex-tester-generator",
    description: "Test and build regular expressions.",
  },
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Utilities",
    path: "/tools/markdown-live-preview",
    description: "Write Markdown and see the live preview.",
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Utilities",
    path: "/tools/color-picker",
    description: "Pick colors and convert between formats (HEX, RGB, HSL).",
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer & Viewer",
    category: "Utilities",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize SVG files and preview them.",
  },
  {
    slug: "hash-verifier",
    name: "Hash Verifier",
    category: "Utilities",
    path: "/tools/hash-verifier",
    description: "Verify the integrity of files using hash comparison.",
  },

  // System Tools (Placeholder for future expansion)
  // {
  //   slug: "system-info",
  //   name: "System Info",
  //   category: "System Tools",
  //   path: "/tools/system-info",
  //   description: "View detailed information about your system.",
  // },
];

// Helper functions (DO NOT MODIFY)
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