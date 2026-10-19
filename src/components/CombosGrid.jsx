import React from 'react';
import { Plus, ArrowLeft, Layers } from 'lucide-react';
import { Badge, Button, EmptyState, IconButton, Skeleton } from './ui';
import { formatMoney } from '../lib/format';

export function CombosGrid({ onAddCombo, onBack }) {
    const [combos, setCombos] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const loadCombos = async () => {
            try {
                const { ContentService } = await import('../services/content');
                const combosData = await ContentService.getCombos();
                setCombos(combosData);
            } catch (error) {
                console.error("Error loading combos:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadCombos();
    }, []);

    return (
        <div className="pb-8 font-sans">
            <div className="mb-4 flex items-center gap-2">
                <IconButton icon={ArrowLeft} label="Volver al inicio" onClick={onBack} className="-ml-2 text-ink" />
                <h1 className="text-2xl font-bold text-ink">Todos los combos</h1>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-lg" />)}
                </div>
            ) : combos.length === 0 ? (
                <EmptyState icon={Layers} title="No hay combos por ahora" message="Vuelve pronto para ver nuevas promociones." />
            ) : (
                <ul className="grid list-none grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {combos.map(combo => {
                        const price = Number(combo.price);
                        const originalPrice = Number(combo.originalPrice);
                        // Solo se muestra ahorro si el combo trae un precio original real y mayor
                        const savings = originalPrice > price ? originalPrice - price : 0;

                        return (
                            <li key={combo.id} className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
                                <div className="relative flex aspect-video items-center justify-center bg-gray-50">
                                    {combo.image ? (
                                        <img src={combo.image} alt="" loading="lazy" className="size-full object-cover" />
                                    ) : (
                                        <Layers size={36} className="text-gray-300" aria-hidden="true" />
                                    )}
                                    {savings > 0 && (
                                        <Badge tone="sale" className="absolute top-2 right-2">
                                            Ahorras {formatMoney(savings)}
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex flex-1 flex-col p-3">
                                    <h2 className="mb-1 font-semibold text-ink">{combo.name}</h2>
                                    {combo.description && <p className="mb-2 line-clamp-3 text-xs text-muted">{combo.description}</p>}

                                    <div className="mt-auto">
                                        <div className="mb-2 flex flex-wrap items-baseline gap-2">
                                            <span className="text-lg font-bold text-primary">{formatMoney(price)}</span>
                                            {savings > 0 && (
                                                <span className="text-xs text-subtle line-through">{formatMoney(originalPrice)}</span>
                                            )}
                                        </div>
                                        <Button
                                            variant="brand"
                                            size="sm"
                                            fullWidth
                                            leftIcon={Plus}
                                            onClick={() => onAddCombo(combo)}
                                            aria-label={`Agregar ${combo.name} al carrito`}
                                            className="rounded-md"
                                        >
                                            Agregar
                                        </Button>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
