import ToolPageWrapper from "@/components/ToolPageWrapper";

export default function RegexTesterGeneratorPage() {
  return (
    <ToolPageWrapper
      toolSlug="regex-tester-generator"
      toolName="Regex Tester & Generator"
      description="Test and generate regular expressions with ease."
    >
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <p className="text-lg">Regex Tester & Generator tool coming soon!</p>
        <p className="text-sm mt-2">Master regular expressions with an intuitive interface.</p>
      </div>
    </ToolPageWrapper>
  );
}