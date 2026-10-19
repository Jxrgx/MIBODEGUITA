import { useState, useEffect, useCallback } from 'react';

export function useVoiceSearch() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognitionInstance = new SpeechRecognition();

            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = false;
            recognitionInstance.lang = 'es-MX'; // Set language to Mexican Spanish

            recognitionInstance.onstart = () => {
                setIsListening(true);
                setError(null);
                setTranscript('');
            };

            recognitionInstance.onend = () => {
                setIsListening(false);
            };

            recognitionInstance.onerror = (event) => {
                // Ignore common non-critical errors
                if (event.error === 'no-speech' || event.error === 'aborted') {
                    setIsListening(false);
                    return;
                }
                console.error('Speech recognition error', event.error);
                setError(event.error);
                setIsListening(false);
            };

            recognitionInstance.onresult = (event) => {
                const current = event.resultIndex;
                const transcriptText = event.results[current][0].transcript;
                setTranscript(transcriptText);
            };

            setRecognition(recognitionInstance);
        } else {
            setError('Browser not supported');
        }
    }, []);

    const startListening = useCallback(() => {
        if (recognition) {
            try {
                recognition.start();
            } catch (e) {
                console.error("Error starting recognition:", e);
                // Sometimes it throws if already started, just ignore
            }
        }
    }, [recognition]);

    const stopListening = useCallback(() => {
        if (recognition) {
            recognition.stop();
        }
    }, [recognition]);

    return {
        isListening,
        transcript,
        error,
        startListening,
        stopListening,
        isSupported: !!recognition
    };
}
