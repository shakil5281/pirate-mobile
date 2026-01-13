"use client"

import React, { useId } from "react"

// Semi-circle usage gauge with optional gradient stroke.
export default function EsimGauge({ percent = 60, color = "#22c55e", gradient }) {
  const clamped = Math.max(0, Math.min(100, percent))
  const radius = 40
  const cx = 50
  const cy = 50
  const circumference = Math.PI * radius
  const progressLength = (clamped / 100) * circumference
  const gradientId = useId()
  const strokeValue = gradient ? `url(#${gradientId})` : color
  const [start, end] = gradient || [color, color]

  return (
    <svg viewBox="0 0 100 60" className="w-44 h-32 drop-shadow-[0_10px_20px_rgba(0,0,0,0.06)]">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={start} />
          <stop offset="100%" stopColor={end} />
        </linearGradient>
      </defs>
      <path
        d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
        stroke="#f1f1f1"
        strokeWidth={8}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
        stroke={strokeValue}
        strokeWidth={8}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${progressLength}, ${circumference}`}
      />
    </svg>
  )
}


