import { extendTailwindMerge } from 'tailwind-merge';

// tailwind-merge resuelve conflictos: en cn('rounded-pill', 'rounded-md') gana la última.
// Se le enseñan los tokens propios de styles/theme.css que no son nombres estándar de Tailwind.
const twMerge = extendTailwindMerge({
    extend: {
        theme: {
            radius: ['pill']
        }
    }
});

// Une clases condicionales: cn('a', isOn && 'b', undefined) -> 'a b'
export function cn(...classes) {
    return twMerge(classes.filter(Boolean).join(' '));
}
