import ToolPageWrapper from "@/components/ToolPageWrapper";

export default function UnixTimestampEpochConverterPage() {
  return (
    <ToolPageWrapper
      toolSlug="unix-timestamp-epoch-converter"
      toolName="Unix Timestamp & Epoch Converter"
      description="Convert Unix timestamps to human-readable dates and vice-versa."
    >
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <p className="text-lg">Unix Timestamp & Epoch Converter tool coming soon!</p>
        <p className="text-sm mt-2">Convert time formats effortlessly.</p>
      </div>
    </ToolPageWrapper>
  );
}