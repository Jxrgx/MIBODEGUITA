import React, { useEffect } from 'react';
import { Mic } from 'lucide-react';
import { useVoiceSearch } from '../hooks/useVoiceSearch';
import { cn } from '../lib/cn';

export function VoiceSearch({ onSearch, onStateChange }) {
    const { isListening, transcript, startListening, stopListening, isSupported } = useVoiceSearch();

    const [lastEmitted, setLastEmitted] = React.useState('');

    useEffect(() => {
        if (transcript && transcript !== lastEmitted) {
            onSearch(transcript);
            setLastEmitted(transcript);
        }
    }, [transcript, onSearch, lastEmitted]);

    useEffect(() => {
        if (onStateChange) {
            onStateChange(isListening);
        }
    }, [isListening, onStateChange]);

    if (!isSupported) return null;

    const label = isListening ? 'Detener búsqueda por voz' : 'Buscar por voz';

    return (
        <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            aria-label={label}
            aria-pressed={isListening}
            title={label}
            className={cn(
                'relative inline-flex size-10 cursor-pointer items-center justify-center rounded-pill border-0 bg-transparent transition-colors',
                'focus-visible:outline-2 focus-visible:outline-primary',
                isListening ? 'text-danger' : 'text-subtle hover:bg-gray-100'
            )}
        >
            {isListening && <span aria-hidden="true" className="absolute inset-1 animate-ping rounded-pill bg-danger/20" />}
            <Mic size={20} aria-hidden="true" className="relative" />
        </button>
    );
}
