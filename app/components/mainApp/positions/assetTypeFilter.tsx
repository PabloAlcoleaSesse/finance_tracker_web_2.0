import type { AssetType } from "@/app/components/mainApp/positions/types";

type AssetTypeFilterProps = {
  options: Array<"All" | AssetType>;
  selected: "All" | AssetType;
  onSelect: (next: "All" | AssetType) => void;
};

export default function AssetTypeFilter({ options, selected, onSelect }: AssetTypeFilterProps) {
  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-4">
      <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Asset type filter</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option === selected;
          return (
            <button
              type="button"
              key={option}
              onClick={() => onSelect(option)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                active
                  ? "border-[#14b8a6]/40 bg-[#14b8a6]/10 text-[#2dd4bf]"
                  : "border-[#334155] bg-black text-neutral-300 hover:text-white"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </section>
  );
}
