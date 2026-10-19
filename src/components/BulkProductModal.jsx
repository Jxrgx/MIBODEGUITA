import React, { useState, useId } from 'react';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button, Chip, IconButton, Modal } from './ui';
import { cn } from '../lib/cn';
import { formatMoney } from '../lib/format';

const WEIGHT_STEP = 0.05;
const MIN_WEIGHT = 0.05;
const DEFAULT_WEIGHT_SUGGESTIONS = [0.1, 0.25, 0.5, 1];

// Redondea a gramos para evitar 0.30000000000000004
const roundKg = (value) => Math.round(value * 1000) / 1000;
const formatWeight = (kg) => (kg >= 1 ? `${kg} kg` : `${Math.round(kg * 1000)} g`);

function getWeightSuggestions(product) {
    if (typeof product.bulkSuggestions === 'string' && product.bulkSuggestions.trim().length > 0) {
        const parsed = product.bulkSuggestions.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
        if (parsed.length > 0) return parsed;
    }
    return DEFAULT_WEIGHT_SUGGESTIONS;
}

function Stepper({ onDecrement, onIncrement, decrementDisabled, children, decrementLabel, incrementLabel }) {
    return (
        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
            <IconButton icon={Minus} label={decrementLabel} variant="surface" onClick={onDecrement} disabled={decrementDisabled} />
            <div className="text-center" aria-live="polite">{children}</div>
            <IconButton icon={Plus} label={incrementLabel} variant="surface" onClick={onIncrement} className="text-primary" />
        </div>
    );
}

export function BulkProductModal({ product, onClose, onAdd }) {
    const [mode, setMode] = useState('weight'); // 'weight' | 'unit'
    const [weight, setWeight] = useState(1.0); // in kg
    const [quantity, setQuantity] = useState(1); // units
    const [notes, setNotes] = useState('');
    const notesId = useId();

    const calculateTotal = () => {
        if (mode === 'weight') {
            return product.price * weight;
        }
        const unitWeight = product.averageWeight || 0;
        return unitWeight > 0 ? product.price * (quantity * unitWeight) : product.price * quantity;
    };

    const approxWeight = mode === 'unit' && product.averageWeight
        ? (quantity * product.averageWeight).toFixed(3)
        : null;

    const handleConfirm = () => {
        const finalPrice = calculateTotal();
        const finalWeight = mode === 'weight' ? weight : (quantity * (product.averageWeight || 0));

        onAdd({
            ...product,
            isBulkSelection: true,
            bulkMode: mode,
            quantity: mode === 'weight' ? 1 : quantity,
            cartQuantity: mode === 'weight' ? weight : quantity,
            cartUnit: mode === 'weight' ? 'kg' : 'pz',
            notes: notes,
            price: finalPrice / (mode === 'weight' ? 1 : quantity),
            totalPrice: finalPrice,
            weight: finalWeight
        });
        onClose();
    };

    return (
        <Modal
            open
            onClose={onClose}
            title={product.name}
            variant="sheet"
            footer={
                <Button size="lg" variant="brand" fullWidth leftIcon={ShoppingBag} onClick={handleConfirm} className="justify-between rounded-md">
                    <span className="flex-1 text-left">Agregar al carrito</span>
                    <span>{formatMoney(calculateTotal())}</span>
                </Button>
            }
        >
            <div className="flex flex-col gap-5 font-sans">
                <p className="text-sm text-muted">
                    {formatMoney(product.price)} por kg
                    {product.averageWeight && ` · una pieza pesa aprox. ${formatWeight(product.averageWeight)}`}
                </p>

                {product.averageWeight && (
                    <div role="radiogroup" aria-label="¿Cómo lo quieres?" className="flex rounded-md bg-gray-100 p-1">
                        {[['unit', 'Por pieza'], ['weight', 'Por kilo']].map(([value, label]) => (
                            <button
                                key={value}
                                type="button"
                                role="radio"
                                aria-checked={mode === value}
                                onClick={() => setMode(value)}
                                className={cn(
                                    'min-h-10 flex-1 cursor-pointer rounded-sm border-0 font-sans font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-primary',
                                    mode === value ? 'bg-surface text-primary shadow-sm' : 'bg-transparent text-muted'
                                )}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                )}

                {mode === 'unit' ? (
                    <Stepper
                        onDecrement={() => setQuantity(q => Math.max(1, q - 1))}
                        onIncrement={() => setQuantity(q => q + 1)}
                        decrementDisabled={quantity <= 1}
                        decrementLabel="Quitar una pieza"
                        incrementLabel="Agregar una pieza"
                    >
                        <p className="text-2xl font-bold text-ink">{quantity} {quantity === 1 ? 'pieza' : 'piezas'}</p>
                        {approxWeight && <p className="text-sm text-subtle">Aprox. {approxWeight} kg</p>}
                    </Stepper>
                ) : (
                    <div className="flex flex-col gap-3">
                        <Stepper
                            onDecrement={() => setWeight(w => roundKg(Math.max(MIN_WEIGHT, w - WEIGHT_STEP)))}
                            onIncrement={() => setWeight(w => roundKg(w + WEIGHT_STEP))}
                            decrementDisabled={weight <= MIN_WEIGHT}
                            decrementLabel="Quitar 50 gramos"
                            incrementLabel="Agregar 50 gramos"
                        >
                            <p className="text-2xl font-bold text-ink">{weight.toFixed(3)} kg</p>
                        </Stepper>
                        <div className="hide-scrollbar flex gap-2 overflow-x-auto" role="group" aria-label="Pesos sugeridos">
                            {getWeightSuggestions(product).map(w => (
                                <Chip key={w} selected={Math.abs(weight - w) < 0.001} onClick={() => setWeight(w)}>
                                    {formatWeight(w)}
                                </Chip>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-1.5">
                    <label htmlFor={notesId} className="text-sm font-semibold text-ink">
                        Notas adicionales <span className="font-normal text-subtle">(opcional)</span>
                    </label>
                    <textarea
                        id={notesId}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ej. Rebanado delgado, bien maduro…"
                        rows={2}
                        className="w-full resize-none rounded-sm border border-border bg-surface p-3 font-sans text-base text-ink placeholder:text-subtle focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    />
                </div>
            </div>
        </Modal>
    );
}
