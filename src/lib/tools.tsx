import {
  Code,
  Star,
  History,
  Palette,
  Layers,
  Settings,
  Terminal,
  Hash,
  Shield,
  FileText,
  Binary,
  Calendar,
  Sparkles,
  Clock,
  Key,
  Search,
  Image, // Added Image icon
} from "lucide-react";

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
    slug: "favorites",
    name: "Favorites",
    category: "General",
    path: "/tools/favorites",
    description: "Your most loved and frequently used tools, all in one place.",
  },
  {
    slug: "history",
    name: "History",
    category: "General",
    path: "/tools/history",
    description: "Recently used tools and past conversions for quick access.",
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
    description: "Encode images to Base64 strings and decode Base64 strings back to images.",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Converters",
    path: "/tools/case-converter",
    description: "Convert text to different cases: lowercase, UPPERCASE, Title Case, etc.",
  },
  {
    slug: "csv-viewer-converter",
    name: "CSV Viewer / Converter",
    category: "Converters",
    path: "/tools/csv-viewer-converter",
    description: "View and convert CSV data to other formats like JSON or XML.",
  },
  {
    slug: "json-to-yaml-converter",
    name: "JSON to YAML Converter",
    category: "Converters",
    path: "/tools/json-to-yaml-converter",
    description: "Convert JSON data to YAML format.",
  },
  {
    slug: "yaml-to-json-converter",
    name: "YAML to JSON Converter",
    category: "Converters",
    path: "/tools/yaml-to-json-converter",
    description: "Convert YAML data to JSON format.",
  },
  // Formatters
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Formatters",
    path: "/tools/json-formatter",
    description: "Beautify or minify JSON data for better readability or compactness.",
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    category: "Formatters",
    path: "/tools/xml-formatter",
    description: "Beautify or minify XML data for better readability or compactness.",
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Formatters",
    path: "/tools/html-formatter",
    description: "Beautify or minify HTML code for better readability or compactness.",
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "Formatters",
    path: "/tools/sql-formatter",
    description: "Format SQL queries for improved readability and debugging.",
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    category: "Formatters",
    path: "/tools/yaml-formatter",
    description: "Format YAML data for improved readability and consistency.",
  },
  // Generators
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    category: "Generators",
    path: "/tools/uuid-generator",
    description: "Generate universally unique identifiers (UUIDs) in various versions.",
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "Generators",
    path: "/tools/password-generator",
    description: "Create strong, random passwords with customizable options.",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Generators",
    path: "/tools/lorem-ipsum-generator",
    description: "Generate placeholder text for your designs and prototypes.",
  },
  {
    slug: "css-shadow-generator",
    name: "CSS Shadow Generator",
    category: "Generators",
    path: "/tools/css-shadow-generator",
    description: "Generate complex CSS box and text shadows with live preview.",
  },
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Generator",
    category: "Generators",
    path: "/tools/css-gradient-generator",
    description: "Create beautiful CSS linear and radial gradients with ease.",
  },
  // Web
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    category: "Web",
    path: "/tools/url-encoder-decoder",
    description: "Encode and decode URLs to handle special characters safely.",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Web",
    path: "/tools/jwt-decoder",
    description: "Decode JSON Web Tokens to inspect their header, payload, and verify signature.",
  },
  // Text
  {
    slug: "markdown-live-preview",
    name: "Markdown Live Preview",
    category: "Text",
    path: "/tools/markdown-live-preview",
    description: "Write Markdown and see the rendered HTML in real-time.",
  },
  {
    slug: "regex-tester-generator",
    name: "Regex Tester / Generator",
    category: "Text",
    path: "/tools/regex-tester-generator",
    description: "Test and generate regular expressions with a live preview of matches.",
  },
  // Utilities
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Utilities",
    path: "/tools/color-picker",
    description: "Select colors and get their HEX, RGB, HSL, and CMYK values.",
  },
  {
    slug: "unix-timestamp-epoch-converter",
    name: "Unix Timestamp & Epoch Converter",
    category: "Utilities",
    path: "/tools/unix-timestamp-epoch-converter",
    description: "Convert Unix timestamps to human-readable dates and vice versa.",
  },
];

export function toolsByCategory(): Record<string, Tool[]> {
  return tools.reduce(
    (acc, tool) => {
      if (!acc[tool.category]) {
        acc[tool.category] = [];
      }
      acc[tool.category].push(tool);
      return acc;
    },
    {} as Record<string, Tool[]>
  );
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export const categoryIcons: Record<string, React.ElementType> = {
  General: Layers,
  Converters: Binary,
  Formatters: Code,
  Generators: Sparkles,
  Web: Globe, // Assuming Globe is available or using a placeholder
  Text: FileText,
  Utilities: Settings,
};

// Map tool slugs to Lucide icons
export const toolIcons: Record<string, React.ElementType> = {
  favorites: Star,
  history: History,
  "base64-encoder-decoder": Binary,
  "base64-image-encoder-decoder": Image, // Added icon for the new tool
  "case-converter": FileText,
  "csv-viewer-converter": FileText,
  "json-to-yaml-converter": Layers,
  "yaml-to-json-converter": Layers,
  "json-formatter": Code,
  "xml-formatter": Code,
  "html-formatter": Code,
  "sql-formatter": Terminal,
  "yaml-formatter": Code,
  "uuid-generator": Hash,
  "password-generator": Shield,
  "lorem-ipsum-generator": FileText,
  "css-shadow-generator": Palette,
  "css-gradient-generator": Palette,
  "url-encoder-decoder": Link, // Assuming Link is available
  "jwt-decoder": Key,
  "markdown-live-preview": FileText,
  "regex-tester-generator": Search,
  "color-picker": Palette,
  "unix-timestamp-epoch-converter": Clock,
};

// Dummy icons for categories not explicitly defined in Lucide, or if we want specific ones
// Make sure these are imported from lucide-react if they are actual icons
import { Globe, Link } from "lucide-react"; // Ensure Globe and Link are imported if used