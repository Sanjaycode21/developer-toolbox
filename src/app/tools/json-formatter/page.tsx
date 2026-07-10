import ToolPageWrapper from "@/components/ToolPageWrapper";

export default function JsonFormatterPage() {
  return (
    <ToolPageWrapper
      toolSlug="json-formatter"
      toolName="JSON Formatter"
      description="Format and beautify JSON data for better readability."
    >
      {/* Existing content of the JSON Formatter tool */}
      <div className="grid grid-cols-2 gap-8 h-full">
        <textarea
          className="w-full h-full p-4 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm text-slate-200 resize-none"
          placeholder="Paste your JSON here..."
        ></textarea>
        <textarea
          className="w-full h-full p-4 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm text-slate-200 resize-none"
          placeholder="Formatted JSON will appear here..."
          readOnly
        ></textarea>
      </div>
    </ToolPageWrapper>
  );
}