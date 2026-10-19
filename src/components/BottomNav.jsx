import React from 'react';
import { cn } from '../lib/cn';
import { navItems, formatCartCount } from '../layouts/navItems';

export function BottomNav({ activeTab, onTabChange, cartCount, isAnimating }) {
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-[1000] border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_10px_rgba(0,0,0,0.05)] select-none md:hidden"
    >
      <ul className="mx-auto flex max-w-lg list-none">
        {navItems.map(({ tab, label, shortLabel, icon: Icon }) => {
          const isActive = activeTab === tab;
          const isCart = tab === 'cart';
          return (
            <li key={tab} className="flex-1">
              <button
                type="button"
                onClick={() => onTabChange(tab)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={isCart && cartCount > 0 ? `${label}, ${cartCount} artículos` : undefined}
                className={cn(
                  'flex w-full cursor-pointer touch-manipulation flex-col items-center gap-1 border-0 bg-transparent pt-2 pb-2.5 font-sans text-[0.7rem] font-medium',
                  'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary',
                  isActive ? 'text-primary' : 'text-subtle'
                )}
              >
                <span className="relative">
                  {isActive && <span aria-hidden="true" className="absolute -inset-x-3 -inset-y-1 rounded-pill bg-primary-soft" />}
                  <Icon
                    size={22}
                    aria-hidden="true"
                    className={cn('relative', isCart && 'bottom-nav-cart-icon', isCart && isAnimating && 'cart-shake')}
                  />
                  {isCart && cartCount > 0 && (
                    <span
                      aria-hidden="true"
                      className="absolute -top-2 -right-3 flex h-[18px] min-w-[18px] items-center justify-center rounded-pill bg-accent px-1 text-[0.65rem] font-bold text-white animate-pop-in"
                    >
                      {formatCartCount(cartCount)}
                    </span>
                  )}
                </span>
                {shortLabel || label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
