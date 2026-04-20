"use client";

type Props = {
  tags: string[];
  selected: string;
  onSelect: (tag: string) => void;
};

export default function VocabularyTagChips({ tags, selected, onSelect }: Props) {
  if (tags.length === 0) return null;
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onSelect(selected === tag ? "" : tag)}
          className={`flex-shrink-0 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
            selected === tag
              ? "border-sky-400/70 bg-sky-500/15 text-sky-100"
              : "border-slate-700/90 bg-slate-950/50 text-slate-400 hover:text-slate-300"
          }`}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}
