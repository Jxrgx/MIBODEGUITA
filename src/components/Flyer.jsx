import React, { useState, useEffect } from 'react';
import { Modal, SectionHeader } from './ui';

export function Flyer() {
    const [flyers, setFlyers] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const loadFlyers = async () => {
            try {
                const { ContentService } = await import('../services/content');
                const data = await ContentService.getFlyers();
                setFlyers(data);
            } catch (error) {
                console.error("Error loading flyers:", error);
            }
        };
        loadFlyers();
    }, []);

    // Sin folletos no se muestra la sección: un recuadro vacío en el Inicio no aporta nada
    if (flyers.length === 0) return null;

    return (
        <section className="mb-6 font-sans" aria-labelledby="flyer-title">
            <SectionHeader id="flyer-title" title="Folleto digital" />

            <ul className="hide-scrollbar -mx-4 flex snap-x snap-mandatory list-none gap-3 overflow-x-auto px-4 pb-2">
                {flyers.map((flyer, index) => (
                    <li key={flyer.id} className="w-72 max-w-[85vw] shrink-0 snap-start">
                        <button
                            type="button"
                            onClick={() => setSelectedImage(flyer.imageUrl)}
                            aria-label={`Ver folleto ${index + 1} en grande`}
                            className="block w-full cursor-zoom-in overflow-hidden rounded-lg border-0 bg-surface p-0 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                            <img src={flyer.imageUrl} alt="" loading="lazy" className="block h-auto w-full" />
                        </button>
                    </li>
                ))}
            </ul>

            <Modal
                open={Boolean(selectedImage)}
                onClose={() => setSelectedImage(null)}
                title="Folleto digital"
                className="max-w-3xl"
            >
                <img src={selectedImage} alt="Folleto digital ampliado" className="mx-auto block max-h-[75vh] w-auto max-w-full rounded-sm" />
            </Modal>
        </section>
    );
}
