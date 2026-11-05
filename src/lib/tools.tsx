import {
  Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search
} from "lucide-react";

export interface Tool {
  slug: string;
  name: string;
  category: string;
  path: string;
  description: string;
}

export const tools: Tool[] = [
  // Text Formatters
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Text",
    path: "/tools/json-formatter",
    description: "Beautify and validate JSON data.",
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    category: "Text",
    path: "/tools/xml-formatter",
    description: "Beautify and validate XML data.",
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Text",
    path: "/tools/html-formatter",
    description: "Beautify and format HTML code.",
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "Text",
    path: "/tools/sql-formatter",
    description: "Format and beautify SQL queries.",
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Text",
    path: "/tools/yaml-formatter",
    description: "Beautify and validate YAML data.",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Text",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools",
    description: "Convert text between different cases (e.g., camelCase, snake_case).",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Text",
    path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools",
    description: "Generate placeholder text for your designs and layouts.",
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
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    category: "Converters",
    path: "/tools/url-encoder-decoder",
    description: "Encode and decode URLs.",
  },
  {
    slug: "base64-image-encoder-decoder",
    name: "Base64 Image Encoder / Decoder",
    category: "Converters",
    path: "/tools/base64-image-encoder-decoder",
    description: "Convert images to Base64 and vice versa.",
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
    description: "View, parse, and convert CSV data.",
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
    description: "Generate strong, random passwords.",
  },
  {
    slug: "cron-expression-builder",
    name: "Cron Expression Builder",
    category: "Generators",
    path: "/tools/cron-expression-builder",
    description: "Build and visualize cron job schedules.",
  },
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator",
    category: "Generators",
    path: "/tools/meta-tag-generator",
    description: "Generate essential meta tags for SEO.",
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
  {
    slug: "css-shadow-generator",
    name: "CSS Shadow Generator",
    category: "Generators",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools",
    description: "Generate custom CSS box and text shadows.",
  },
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Generator",
    category: "Generators",
    path: "/tools/day-4-implement-css-shadow-gradient-generator-tools",
    description: "Create beautiful CSS linear and radial gradients.",
  },

  // Web Utilities
  {
    slug: "http-header-viewer",
    name: "HTTP Header Viewer",
    category: "Web Utilities",
    path: "/tools/http-header-viewer",
    description: "View HTTP headers of any URL.",
  },
  {
    slug: "websocket-tester",
    name: "WebSocket Tester",
    category: "Web Utilities",
    path: "/tools/websocket-tester",
    description: "Test WebSocket connections and send/receive messages.",
  },
  {
    slug: "meta-tag-og-preview",
    name: "Open Graph Preview",
    category: "Web Utilities",
    path: "/tools/meta-tag-generator-og-preview",
    description: "Preview how your links will look on social media.",
  },

  // Cryptography
  {
    slug: "hash-verifier",
    name: "Hash Verifier",
    category: "Cryptography",
    path: "/tools/hash-verifier",
    description: "Verify the integrity of files using hash checksums.",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Cryptography",
    path: "/tools/jwt-decoder",
    description: "Decode and inspect JSON Web Tokens.",
  },

  // Design & Graphics
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Design & Graphics",
    path: "/tools/color-picker",
    description: "Select colors and get their HEX, RGB, HSL values.",
  },
  {
    slug: "svg-optimizer-viewer",
    name: "SVG Optimizer & Viewer",
    category: "Design & Graphics",
    path: "/tools/svg-optimizer-viewer",
    description: "Optimize and view SVG files.",
  },

  // Development Tools
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Development Tools",
    path: "/tools/markdown-live-preview",
    description: "Write Markdown and see the live HTML preview.",
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    category: "Development Tools",
    path: "/tools/regex-tester-generator",
    description: "Test and debug regular expressions.",
  },

  // Database Tools
  {
    slug: "sql-playground",
    name: "SQL Playground",
    category: "Database",
    path: "/tools/sql-playground",
    description: "Execute and test SQL queries in a simulated environment.",
  },

  // Special Pages (not actual tools, but part of the navigation)
  {
    slug: "favorites",
    name: "Favorites",
    category: "Special",
    path: "/tools/favorites",
    description: "Your favorite tools for quick access.",
  },
  {
    slug: "history",
    name: "History",
    category: "Special",
    path: "/tools/history",
    description: "Recently used tools.",
  },
];

// Helper function to group tools by category
export function toolsByCategory(): Record<string, Tool[]> {
  return tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);
}

// Helper function to get a tool by its slug
export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

// Helper function to get a tool's icon (using a map for now)
// This is a simplified approach. In a real app, icons might be part of the Tool interface
// or dynamically loaded.
export function getToolIcon(slug: string): React.ElementType | null {
  const iconMap: { [key: string]: React.ElementType } = {
    "json-formatter": Code,
    "xml-formatter": Code,
    "html-formatter": Code,
    "sql-formatter": Code,
    "yaml-formatter": Code,
    "case-converter": FileText,
    "lorem-ipsum-generator": FileText,

    "base64-encoder-decoder": Binary,
    "url-encoder-decoder": Binary,
    "base64-image-encoder-decoder": Binary,
    "unix-timestamp-epoch-converter": Clock,
    "csv-viewer-converter": Layers,

    "hash-generator": Hash,
    "uuid-generator": Key,
    "password-generator": Key,
    "cron-expression-builder": Calendar,
    "meta-tag-generator": Search,
    "robots-txt-generator": Shield,
    "sitemap-xml-generator": Layers,
    "css-shadow-generator": Palette,
    "css-gradient-generator": Palette,

    "http-header-viewer": Terminal,
    "websocket-tester": Terminal,
    "meta-tag-og-preview": Search,

    "hash-verifier": Shield,
    "jwt-decoder": Key,

    "color-picker": Palette,
    "svg-optimizer-viewer": Sparkles,

    "markdown-live-preview": FileText,
    "regex-tester": Search,

    "sql-playground": Terminal, // Using Terminal for SQL Playground

    "favorites": Star,
    "history": History,
  };
  return iconMap[slug] || Settings; // Default icon
}