import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/20 to-purple-950/20 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
        <div className="relative z-10 space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent">
            Welcome to DevForge
          </h2>
          <p className="text-sm text-slate-400 max-w-xl">
            Your premium, all-in-one suite of essential utilities. Select a tool from the categories below or use the sidebar to begin.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/80">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Utilities</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-100">2</span>
            <span className="text-xs text-indigo-400 font-semibold">(Day 1 Base)</span>
          </div>
        </div>
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/80">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Evolution Pipeline</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-indigo-400">Daily</span>
            <span className="text-xs text-slate-500">Autonomous Updates</span>
          </div>
        </div>
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/80">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">System State</span>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm font-semibold text-slate-200">Online & Ready</span>
          </div>
        </div>
      </div>

      {/* Tool Categories & Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-slate-200">Available Utilities</h3>
          <span className="text-xs text-slate-500">Sorted alphabetically</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tool Card: Color Picker */}
          <Link href="/tools/color-picker" className="group">
            <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-850 hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all duration-300 relative overflow-hidden group-hover:-translate-y-1 shadow-lg">
              <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/5 rounded-bl-full group-hover:bg-indigo-500/10 transition-colors" />
              <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                🎨
              </div>
              <h4 className="text-base font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">Color Picker</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Generate color palettes, convert hex/rgb/hsl formats, and select customized colors with a smooth visual interface.
              </p>
            </div>
          </Link>

          {/* Tool Card: JSON Formatter */}
          <Link href="/tools/json-formatter" className="group">
            <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-850 hover:border-purple-500/50 hover:bg-slate-900/60 transition-all duration-300 relative overflow-hidden group-hover:-translate-y-1 shadow-lg">
              <div className="absolute top-0 right-0 h-24 w-24 bg-purple-500/5 rounded-bl-full group-hover:bg-purple-500/10 transition-colors" />
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                ⚙️
              </div>
              <h4 className="text-base font-bold text-slate-100 group-hover:text-purple-400 transition-colors">JSON Formatter</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Format, minify, validate, and clean up JSON strings instantly with dynamic error detection.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
