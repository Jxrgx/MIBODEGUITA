import React, { useState } from 'react';
import { ShoppingBasket } from 'lucide-react';
import { cn } from '../../lib/cn';

// Imagen de producto con respaldo: si no hay URL o falla la carga, muestra una canasta gris.
export function ProductImage({ src, alt = '', className, iconSize = 40, ...props }) {
    const [failedSrc, setFailedSrc] = useState(null);

    if (!src || failedSrc === src) {
        return (
            <ShoppingBasket
                size={iconSize}
                className="shrink-0 text-gray-300"
                role={alt ? 'img' : undefined}
                aria-label={alt || undefined}
                aria-hidden={alt ? undefined : true}
            />
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            onError={() => setFailedSrc(src)}
            className={cn('object-contain', className)}
            {...props}
        />
    );
}
