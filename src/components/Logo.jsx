import React from 'react'

/**
 * Tilnogz Photography Official Logo Component
 * Exact vector replication of the brand logo with clean geometric sans typography.
 */
export default function Logo({ className = 'h-7 w-auto', variant = 'default' }) {
  const colorClass =
    variant === 'light'
      ? 'text-paper hover:text-copper-light'
      : variant === 'copper'
      ? 'text-copper'
      : 'text-charcoal hover:text-copper'

  return (
    <div className={`inline-flex flex-col items-center justify-center transition-colors duration-300 ${colorClass}`}>
      <svg
        viewBox="0 0 600 170"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Tilnogz Photography Logo"
      >
        {/* TILNOGZ */}
        <text
          x="300"
          y="98"
          fontFamily="'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          fontSize="96"
          fontWeight="300"
          textAnchor="middle"
          style={{ letterSpacing: '0.18em' }}
        >
          TILNOGZ
        </text>

        {/* P H O T O G R A P H Y */}
        <text
          x="300"
          y="142"
          fontFamily="'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          fontSize="22"
          fontWeight="700"
          textAnchor="middle"
          style={{ letterSpacing: '0.65em' }}
        >
          PHOTOGRAPHY
        </text>
      </svg>
    </div>
  )
}
