import { useState } from 'react';

interface CatalogTopBarProps {
  categoryTitle: string;
  onFilterClick?: () => void;
}

export default function CatalogTopBar({ categoryTitle, onFilterClick }: CatalogTopBarProps) {
  return (
    <div className="border-b border-neutral-200 sticky top-0 z-30" style={{ backgroundColor: 'var(--brand-ink-exact)' }}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Category Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-light tracking-wide">{categoryTitle}</span>
          <svg 
            className="w-4 h-4 text-neutral-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Filters Button */}
        <button
          onClick={onFilterClick}
          className="flex items-center gap-2 px-4 py-2 border border-neutral-900 rounded-full hover:bg-neutral-900 hover:text-white transition-colors text-sm font-light tracking-wide"
        >
          <span>Filters</span>
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>
      </div>
    </div>
  );
}

