import ToolPageWrapper from "@/components/ToolPageWrapper";

export default function JwtDecoderPage() {
  return (
    <ToolPageWrapper
      toolSlug="jwt-decoder"
      toolName="JWT Decoder"
      description="Decode JSON Web Tokens to inspect their header, payload, and signature."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
        <textarea
          className="w-full h-full p-4 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm text-slate-200 resize-none"
          placeholder="Paste your JWT here..."
        ></textarea>
        <div className="flex flex-col space-y-4 h-full">
          <textarea
            className="w-full flex-1 p-4 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm text-slate-200 resize-none"
            placeholder="Header will appear here..."
            readOnly
          ></textarea>
          <textarea
            className="w-full flex-1 p-4 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm text-slate-200 resize-none"
            placeholder="Payload will appear here..."
            readOnly
          ></textarea>
          <textarea
            className="w-full flex-1 p-4 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm text-slate-200 resize-none"
            placeholder="Signature will appear here..."
            readOnly
          ></textarea>
        </div>
      </div>
    </ToolPageWrapper>
  );
}