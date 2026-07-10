import ToolPageWrapper from "@/components/ToolPageWrapper";

export default function ColorPickerPage() {
  return (
    <ToolPageWrapper
      toolSlug="color-picker"
      toolName="Color Picker"
      description="Select and convert colors in various formats."
    >
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <p className="text-lg">Color Picker tool coming soon!</p>
        <p className="text-sm mt-2">Stay tuned for a beautiful color selection experience.</p>
      </div>
    </ToolPageWrapper>
  );
}