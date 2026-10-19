import React, { useEffect, useRef } from 'react';
import { LayoutGrid } from 'lucide-react';
import { Chip } from '../ui';
import { getCategoryIcon } from '../../lib/categoryIcons';

// Franja de categorías del header: desplazamiento horizontal y el chip activo siempre a la vista
export function CategoryChips({ categories = [], selectedCategory, onSelect, onSelectAll }) {
    const activeRef = useRef(null);

    useEffect(() => {
        activeRef.current?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }, [selectedCategory]);

    if (categories.length === 0) return null;

    return (
        <nav aria-label="Categorías" className="border-b border-border bg-surface">
            <div className="mx-auto max-w-6xl">
                <ul className="hide-scrollbar flex snap-x list-none gap-2 overflow-x-auto px-4 py-2.5">
                    <li className="snap-start" ref={!selectedCategory ? activeRef : undefined}>
                        <Chip icon={LayoutGrid} selected={!selectedCategory} onClick={onSelectAll}>
                            Todo
                        </Chip>
                    </li>
                    {categories.map((category, index) => {
                        const isSelected = selectedCategory === category.name;
                        return (
                            <li key={`${category.id}-${index}`} className="snap-start" ref={isSelected ? activeRef : undefined}>
                                <Chip
                                    icon={getCategoryIcon(category.name, category.icon)}
                                    selected={isSelected}
                                    onClick={() => onSelect(category.name)}
                                >
                                    {category.name}
                                </Chip>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}
