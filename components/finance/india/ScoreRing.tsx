"use client"

interface ScoreRingProps {
  score: number
  size?: number
}

export default function ScoreRing({ score, size = 64 }: ScoreRingProps) {
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const center = size / 2

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      {/* Background ring */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#222"
        strokeWidth={strokeWidth}
      />
      {/* Progress arc */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#FF8000"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
      {/* Score label — counter-rotate so text reads correctly */}
      <text
        x={center}
        y={center}
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontWeight="bold"
        fontSize={size * 0.22}
        style={{ transform: `rotate(90deg) translate(0px, -${size}px)` }}
      >
        {Math.round(score)}
      </text>
    </svg>
  )
}
