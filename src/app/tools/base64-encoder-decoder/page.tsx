import ToolPageWrapper from "@/components/ToolPageWrapper";

export default function Base64EncoderDecoderPage() {
  return (
    <ToolPageWrapper
      toolSlug="base64-encoder-decoder"
      toolName="Base64 Encoder/Decoder"
      description="Encode and decode Base64 strings."
    >
      <div className="grid grid-cols-2 gap-8 h-full">
        <textarea
          className="w-full h-full p-4 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm text-slate-200 resize-none"
          placeholder="Enter text to encode or Base64 to decode..."
        ></textarea>
        <textarea
          className="w-full h-full p-4 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm text-slate-200 resize-none"
          placeholder="Result will appear here..."
          readOnly
        ></textarea>
      </div>
    </ToolPageWrapper>
  );
}