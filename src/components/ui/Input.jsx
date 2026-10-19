import React, { useId } from 'react';
import { cn } from '../../lib/cn';

export function Input({
    label,
    hint,
    error,
    leftIcon: LeftIcon,
    id,
    className,
    inputClassName,
    ...props
}) {
    const generatedId = useId();
    const inputId = id || generatedId;
    const messageId = `${inputId}-message`;
    const message = error || hint;

    return (
        <div className={cn('flex flex-col gap-1.5', className)}>
            {label && (
                <label htmlFor={inputId} className="text-sm font-semibold text-ink">
                    {label}
                </label>
            )}
            <div className="relative">
                {LeftIcon && (
                    <LeftIcon
                        size={18}
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-subtle"
                    />
                )}
                <input
                    id={inputId}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={message ? messageId : undefined}
                    className={cn(
                        // text-base (16px) evita el zoom automático de iOS al enfocar
                        'min-h-11 w-full rounded-sm border bg-surface px-3 font-sans text-base text-ink',
                        'placeholder:text-subtle focus:ring-2 focus:outline-none',
                        error
                            ? 'border-danger focus:ring-danger/20'
                            : 'border-border focus:border-primary focus:ring-primary/20',
                        LeftIcon && 'pl-10',
                        inputClassName
                    )}
                    {...props}
                />
            </div>
            {message && (
                <p id={messageId} className={cn('text-sm', error ? 'text-danger' : 'text-subtle')}>
                    {message}
                </p>
            )}
        </div>
    );
}
