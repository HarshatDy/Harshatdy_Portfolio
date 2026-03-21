"use client"

import { DOMAINS } from "@/app/data/types/newsletter"
import type { Domain } from "@/app/data/types/newsletter"

interface Props {
  selected: Domain[]
  onChange: (domains: Domain[]) => void
}

export default function DomainSelector({ selected, onChange }: Props) {
  function toggle(domain: Domain) {
    if (selected.includes(domain)) {
      onChange(selected.filter((d) => d !== domain))
    } else {
      onChange([...selected, domain])
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {DOMAINS.map(({ value, label, icon }) => {
        const active = selected.includes(value)
        return (
          <button
            key={value}
            type="button"
            onClick={() => toggle(value)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all duration-200 ${
              active
                ? "border-[#FF8000] bg-[#FF8000]/10 text-white"
                : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
            }`}
          >
            <span className="text-xl">{icon}</span>
            <span className="text-sm font-medium">{label}</span>
            {active && (
              <span className="ml-auto w-4 h-4 rounded-full bg-[#FF8000] flex items-center justify-center">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
