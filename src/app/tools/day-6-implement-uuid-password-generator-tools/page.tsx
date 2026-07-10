import ToolPageWrapper from "@/components/ToolPageWrapper";

export default function UuidPasswordGeneratorPage() {
  return (
    <ToolPageWrapper
      toolSlug="uuid-password-generator"
      toolName="UUID & Password Generator"
      description="Generate strong UUIDs and secure passwords."
    >
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <p className="text-lg">UUID & Password Generator tool coming soon!</p>
        <p className="text-sm mt-2">Create unique identifiers and strong credentials.</p>
      </div>
    </ToolPageWrapper>
  );
}