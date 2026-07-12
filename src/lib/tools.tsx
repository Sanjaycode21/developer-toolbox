export interface Tool {
  slug: string; // Clean slug for internal use (e.g., "jwt-decoder")
  name: string;
  category: string;
  path: string; // Actual path in the app (e.g., "/tools/day-3-implement-jwt-decoder-tool")
  description: string; // Added description for ToolPageWrapper
}

export const tools: Tool[] = [
  { slug: "json-formatter", name: "JSON Formatter", category: "Text & Formatting", path: "/tools/json-formatter", description: "Format and beautify JSON data for better readability." },
  { slug: "base64-encoder-decoder", name: "Base64 Encoder/Decoder", category: "Text & Formatting", path: "/tools/base64-encoder-decoder", description: "Encode and decode Base64 strings." },
  { slug: "regex-tester-generator", name: "Regex Tester & Generator", category: "Text & Formatting", path: "/tools/regex-tester-generator", description: "Test and generate regular expressions with ease." },
  { slug: "case-converter-lorem-ipsum-generator", name: "Case Converter & Lorem Ipsum Generator", category: "Text & Formatting", path: "/tools/day-7-implement-case-converter-lorem-ipsum-generator-tools", description: "Convert text case and generate placeholder Lorem Ipsum text." },
  { slug: "markdown-live-preview", name: "Markdown Live Preview", category: "Text & Formatting", path: "/tools/markdown-live-preview", description: "Render Markdown in real-time." }, // Placeholder
  { slug: "html-formatter", name: "HTML Formatter", category: "Text & Formatting", path: "/tools/html-formatter", description: "Beautify and format HTML code." }, // Placeholder
  { slug: "color-picker", name: "Color Picker", category: "Design & Graphics", path: "/tools/color-picker", description: "Select and convert colors in various formats." },
  { slug: "css-shadow-gradient-generator", name: "CSS Shadow & Gradient Generator", category: "Design & Graphics", path: "/tools/day-4-implement-css-shadow-gradient-generator-tools", description: "Generate beautiful CSS box shadows and linear/radial gradients." },
  { slug: "unix-timestamp-epoch-converter", name: "Unix Timestamp & Epoch Converter", category: "Converters & Encoders", path: "/tools/day-5-implement-unix-timestamp-epoch-converter-tools", description: "Convert Unix timestamps to human-readable dates and vice-versa." },
  { slug: "uuid-password-generator", name: "UUID & Password Generator", category: "Generators", path: "/tools/day-6-implement-uuid-password-generator-tools", description: "Generate strong UUIDs and secure passwords." },
  { slug: "jwt-decoder", name: "JWT Decoder", category: "Security & Cryptography", path: "/tools/day-3-implement-jwt-decoder-tool", description: "Decode JSON Web Tokens to inspect their header, payload, and signature." },
];

export const getToolBySlug = (slug: string) => tools.find(tool => tool.slug === slug);
export const getToolByPath = (path: string) => tools.find(tool => tool.path === path);

export const toolsByCategory = tools.reduce((acc, tool) => {
  if (!acc[tool.category]) {
    acc[tool.category] = [];
  }
  acc[tool.category].push(tool);
  return acc;
}, {} as Record<string, Tool[]>);