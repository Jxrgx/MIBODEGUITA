import React, { useState, useEffect } from 'react';
import { ShoppingBag, Layers } from 'lucide-react';
import { Button, SectionHeader } from './ui';
import { formatMoney } from '../lib/format';

export function ComboSection({ onAddCombo, onSeeAll }) {
    const [combos, setCombos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCombos = async () => {
            try {
                const { ContentService } = await import('../services/content');
                const data = await ContentService.getCombos();
                setCombos(data);
            } catch (error) {
                console.error("Error loading combos:", error);
            } finally {
                setLoading(false);
            }
        };
        loadCombos();
    }, []);

    if (loading) return null;
    if (combos.length === 0) return null;

    return (
        <section className="mb-6 font-sans" aria-labelledby="combos-title">
            <SectionHeader id="combos-title" title="Combos Morralla" actionLabel="Ver todos" onAction={onSeeAll} />

            <ul className="hide-scrollbar -mx-4 flex snap-x snap-mandatory list-none gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:overflow-visible md:px-0 md:pb-0 md:grid-cols-2 lg:grid-cols-3">
                {combos.map(combo => (
                    <li
                        key={combo.id}
                        className="flex w-72 shrink-0 snap-start flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-sm md:w-auto"
                    >
                        <div className="flex h-36 items-center justify-center bg-gray-50">
                            {combo.image ? (
                                <img src={combo.image} alt="" loading="lazy" className="size-full object-cover" />
                            ) : (
                                <Layers size={40} className="text-gray-300" aria-hidden="true" />
                            )}
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                            <div className="mb-1 flex items-start justify-between gap-2">
                                <h3 className="font-semibold text-ink">{combo.name}</h3>
                                <span className="shrink-0 text-lg font-extrabold text-primary">{formatMoney(combo.price)}</span>
                            </div>

                            {combo.description && (
                                <p className="mb-3 line-clamp-2 text-sm text-muted">{combo.description}</p>
                            )}

                            {combo.items && combo.items.length > 0 && (
                                <div className="mb-4">
                                    <p className="mb-1 text-xs text-subtle">Incluye:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {combo.items.slice(0, 3).map((item, idx) => (
                                            <span key={idx} className="rounded-sm bg-gray-100 px-2 py-0.5 text-xs text-muted">
                                                {item.quantity}× {item.name}
                                            </span>
                                        ))}
                                        {combo.items.length > 3 && (
                                            <span className="px-1 text-xs text-subtle">+{combo.items.length - 3} más</span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <Button
                                variant="brand"
                                fullWidth
                                leftIcon={ShoppingBag}
                                onClick={() => onAddCombo(combo)}
                                className="mt-auto rounded-md"
                            >
                                Agregar al carrito
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}
