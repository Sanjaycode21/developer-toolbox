// The Sidebar component (not provided in workspace) must handle icon mapping.

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
}

export const tools: Tool[] = [
  // Formatting & Minification
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Formatting & Minification",
    path: "/tools/json-formatter",
    description: "Beautify or minify JSON data for better readability or smaller file size.",
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    category: "Formatting & Minification",
    path: "/tools/xml-formatter",
    description: "Format or minify XML data for improved readability or reduced size.",
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Formatting & Minification",
    path: "/tools/html-formatter",
    description: "Clean up and format HTML code for better structure and readability.",
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "Formatting & Minification",
    path: "/tools/sql-formatter",
    description: "Format SQL queries for enhanced readability and easier debugging.",
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Formatting & Minification",
    path: "/tools/yaml-formatter",
    description: "Format or minify YAML data for improved readability or reduced size.",
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
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Converters",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice versa.",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Converters",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools",
    description: "Convert text between different cases (e.g., lowercase, UPPERCASE, Title Case).",
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer & Converter",
    category: "Converters",
    path: "/tools/csv-viewer-converter",
    description: "View, edit, and convert CSV data to other formats like JSON or XML.",
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
    path: "/tools/day-6-implement-uuid-password-generator-tools",
    description: "Generate universally unique identifiers (UUIDs).",
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "Generators",
    path: "/tools/day-6-implement-uuid-password-generator-tools",
    description: "Create strong, random passwords with customizable options.",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Generators",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools",
    description: "Generate placeholder text for your designs and layouts.",
  },
  {
    slug: "css-shadow-gradient-generator",
    name: "CSS Shadow & Gradient Generator",
    category: "Generators",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools",
    description: "Visually generate complex CSS box shadows and gradients.",
  },
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator & OG Preview",
    category: "Generators",
    path: "/tools/meta-tag-generator",
    description: "Generate essential meta tags for SEO and social media, and preview Open Graph and Twitter cards.",
  },

  // Web & Security
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Web & Security",
    path: "/tools/jwt-decoder",
    description: "Decode JSON Web Tokens to inspect header, payload, and verify signature.",
  },
  {
    slug: "hash-verifier",
    name: "Hash Verifier",
    category: "Web & Security",
    path: "/tools/hash-verifier",
    description: "Verify the integrity of files or text using various hash algorithms.",
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester & Generator",
    category: "Web & Security",
    path: "/tools/regex-tester-generator",
    description: "Test and generate regular expressions with real-time feedback.",
  },

  // SEO
  {
    slug: "robots-txt-generator",
    name: "Robots.txt Generator",
    category: "SEO",
    path: "/tools/robots-txt-generator",
    description: "Create a robots.txt file to manage crawler access to your site.",
  },
  {
    slug: "sitemap-xml-generator",
    name: "Sitemap XML Generator",
    category: "SEO",
    path: "/tools/sitemap-xml-generator",
    description: "Generate an XML sitemap to help search engines crawl your website.",
  },

  // Utilities
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Utilities",
    path: "/tools/color-picker",
    description: "Select colors, convert formats (HEX, RGB, HSL), and generate palettes.",
  },
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Utilities",
    path: "/tools/markdown-live-preview",
    description: "Write Markdown and see the rendered HTML in real-time.",
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer & Viewer",
    category: "Utilities",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize SVG files for smaller size and preview their rendering.",
  },

  // Special Pages
  {
    slug: "favorites",
    name: "Favorites",
    category: "Special",
    path: "/tools/favorites",
    description: "Your most loved and frequently used tools.",
  },
  {
    slug: "history",
    name: "History",
    category: "Special",
    path: "/tools/history",
    description: "Recently used tools for quick access.",
  },
];

// Helper functions (DO NOT MODIFY)
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