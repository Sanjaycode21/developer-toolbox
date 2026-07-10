import ToolPageWrapper from "@/components/ToolPageWrapper";

export default function CssShadowGradientGeneratorPage() {
  return (
    <ToolPageWrapper
      toolSlug="css-shadow-gradient-generator"
      toolName="CSS Shadow & Gradient Generator"
      description="Generate beautiful CSS box shadows and linear/radial gradients."
    >
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <p className="text-lg">CSS Shadow & Gradient Generator tool coming soon!</p>
        <p className="text-sm mt-2">Get ready to style your elements with ease.</p>
      </div>
    </ToolPageWrapper>
  );
}