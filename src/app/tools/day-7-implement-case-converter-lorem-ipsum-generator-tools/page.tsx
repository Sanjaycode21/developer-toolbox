import ToolPageWrapper from "@/components/ToolPageWrapper";

export default function CaseConverterLoremIpsumGeneratorPage() {
  return (
    <ToolPageWrapper
      toolSlug="case-converter-lorem-ipsum-generator"
      toolName="Case Converter & Lorem Ipsum Generator"
      description="Convert text case and generate placeholder Lorem Ipsum text."
    >
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <p className="text-lg">Case Converter & Lorem Ipsum Generator tool coming soon!</p>
        <p className="text-sm mt-2">Transform text and fill your layouts with dummy content.</p>
      </div>
    </ToolPageWrapper>
  );
}