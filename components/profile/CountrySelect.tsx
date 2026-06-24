"use client";

import { useMemo, useState } from "react";
import { listCountries } from "@/lib/countries/list";

type Props = {
  name?: string;
  locale: string;
  defaultValue?: string;
  required?: boolean;
  searchPlaceholder: string;
  className?: string;
};

export default function CountrySelect({
  name = "kokuseki",
  locale,
  defaultValue = "JP",
  required = true,
  searchPlaceholder,
  className,
}: Props) {
  const countries = useMemo(() => listCountries(locale), [locale]);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    const hits = countries.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.value.toLowerCase().includes(q),
    );
    const selected = countries.find((c) => c.value === defaultValue);
    if (selected && !hits.some((c) => c.value === selected.value)) {
      return [selected, ...hits];
    }
    return hits;
  }, [countries, query, defaultValue]);

  return (
    <div className="space-y-2">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={searchPlaceholder}
        className="w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-[13px] text-slate-100 placeholder:text-slate-500 focus:border-wa-ruri focus:outline-none focus:ring-1 focus:ring-wa-ruri/60"
        autoComplete="off"
      />
      <select
        name={name}
        required={required}
        defaultValue={defaultValue}
        size={8}
        className={
          className ??
          "w-full appearance-none rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-[13px] text-slate-100 focus:border-wa-ruri focus:outline-none focus:ring-1 focus:ring-wa-ruri/60"
        }
      >
        {filtered.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
      <p className="text-[10px] text-slate-500">
        {filtered.length} / {countries.length}
      </p>
    </div>
  );
}
