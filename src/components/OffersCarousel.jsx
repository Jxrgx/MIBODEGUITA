import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { cn } from '../lib/cn';

const defaultOffers = [
    {
        id: 1,
        title: "Martes de Frescura",
        subtitle: "Frutas y Verduras al 2x1",
        color: "#2e7d32",
        textColor: "white"
    },
    {
        id: 2,
        title: "Limpieza Total",
        subtitle: "30% de descuento en Detergentes",
        color: "#004aad",
        textColor: "white"
    },
    {
        id: 3,
        title: "Panadería Recién Hecha",
        subtitle: "¡El mejor pan dulce de la ciudad!",
        color: "#b45309",
        textColor: "white"
    },
    {
        id: 4,
        title: "Envío GRATIS",
        subtitle: "En compras mayores a $299",
        color: "#ad1457",
        textColor: "white"
    }
];

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 40;

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function OffersCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [offers, setOffers] = useState(defaultOffers);
    const [isPaused, setIsPaused] = useState(prefersReducedMotion);
    const [isHovered, setIsHovered] = useState(false);
    const touchStartX = useRef(null);

    useEffect(() => {
        const loadBanners = async () => {
            try {
                const { ContentService } = await import('../services/content');
                const remoteBanners = await ContentService.getBanners();
                setOffers(remoteBanners.length > 0 ? remoteBanners : defaultOffers);
            } catch (error) {
                console.error("Failed to load banners", error);
                setOffers(defaultOffers);
            }
        };

        loadBanners();
    }, []);

    useEffect(() => {
        if (isPaused || isHovered || offers.length < 2) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % offers.length);
        }, AUTOPLAY_MS);
        return () => clearInterval(interval);
    }, [offers.length, isPaused, isHovered]);

    const goTo = (index) => setCurrentIndex((index + offers.length) % offers.length);
    const nextSlide = () => goTo(currentIndex + 1);
    const prevSlide = () => goTo(currentIndex - 1);

    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        if (deltaX > SWIPE_THRESHOLD) prevSlide();
        else if (deltaX < -SWIPE_THRESHOLD) nextSlide();
        touchStartX.current = null;
    };

    const controlClass = 'absolute top-1/2 z-[2] hidden size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-pill border-0 bg-white/80 text-ink shadow-sm hover:bg-white focus-visible:outline-2 focus-visible:outline-white sm:inline-flex';

    return (
        <section
            aria-roledescription="carrusel"
            aria-label="Promociones"
            className="relative mb-6 h-40 overflow-hidden rounded-lg font-sans shadow-md sm:h-48"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsHovered(true)}
            onBlur={() => setIsHovered(false)}
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={handleTouchEnd}
        >
            {offers.map((offer, index) => (
                <div
                    key={offer.id}
                    role="group"
                    aria-roledescription="diapositiva"
                    aria-label={`${index + 1} de ${offers.length}`}
                    aria-hidden={index !== currentIndex}
                    className="absolute inset-0 flex flex-col justify-center px-6 transition-transform duration-500 ease-in-out motion-reduce:transition-none sm:px-16"
                    style={{
                        backgroundColor: offer.imageUrl ? '#000' : offer.color,
                        color: offer.textColor || 'white',
                        transform: `translateX(${(index - currentIndex) * 100}%)`
                    }}
                >
                    {offer.imageUrl && (
                        <>
                            <img
                                src={offer.imageUrl}
                                alt=""
                                loading={index === 0 ? 'eager' : 'lazy'}
                                fetchPriority={index === 0 ? 'high' : 'auto'}
                                className="absolute inset-0 size-full object-cover"
                            />
                            {/* Degradado para que el texto siempre se lea sobre la foto */}
                            <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-transparent" />
                        </>
                    )}
                    <div className="relative max-w-md">
                        <h3 className="mb-1 text-2xl leading-tight font-extrabold sm:text-3xl">{offer.title}</h3>
                        {offer.subtitle && <p className="text-base opacity-90 sm:text-lg">{offer.subtitle}</p>}
                    </div>
                </div>
            ))}

            {offers.length > 1 && (
                <>
                    <button type="button" onClick={prevSlide} aria-label="Promoción anterior" className={cn(controlClass, 'left-3')}>
                        <ChevronLeft size={20} aria-hidden="true" />
                    </button>
                    <button type="button" onClick={nextSlide} aria-label="Siguiente promoción" className={cn(controlClass, 'right-3')}>
                        <ChevronRight size={20} aria-hidden="true" />
                    </button>

                    <div className="absolute bottom-2 left-1/2 z-[2] flex -translate-x-1/2 items-center gap-1">
                        {offers.map((offer, index) => (
                            <button
                                key={offer.id}
                                type="button"
                                onClick={() => goTo(index)}
                                aria-label={`Ir a la promoción ${index + 1}`}
                                aria-current={index === currentIndex}
                                className="flex size-6 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
                            >
                                <span
                                    className={cn(
                                        'h-2 rounded-pill transition-all',
                                        index === currentIndex ? 'w-5 bg-white' : 'w-2 bg-white/50'
                                    )}
                                />
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => setIsPaused(p => !p)}
                            aria-label={isPaused ? 'Reanudar promociones' : 'Pausar promociones'}
                            className="ml-1 flex size-6 cursor-pointer items-center justify-center rounded-pill border-0 bg-black/20 p-0 text-white"
                        >
                            {isPaused ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}
                        </button>
                    </div>
                </>
            )}
        </section>
    );
}
