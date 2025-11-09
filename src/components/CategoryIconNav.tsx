import { useState } from 'react';

interface CategoryIcon {
  name: string;
  icon: string;
  href: string;
}

interface CategoryIconNavProps {
  categories: CategoryIcon[];
  currentCategory?: string;
}

export default function CategoryIconNav({ categories, currentCategory }: CategoryIconNavProps) {
  return (
    <div className="border-b border-neutral-200" style={{ backgroundColor: 'var(--brand-ink-exact)' }}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center gap-12 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <a
              key={category.name}
              href={category.href}
              className={`flex flex-col items-center gap-3 min-w-[100px] group transition-opacity ${
                currentCategory === category.name ? 'opacity-100' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                <img 
                  src={category.icon} 
                  alt={category.name}
                  className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
                />
              </div>
              <span className="text-xs sm:text-sm font-light tracking-wide text-center">
                {category.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

